import { Request, Response } from 'express';
import { Track, ITrack } from '../models/Track';
import { AuthRequest } from '../middleware/auth';

export const createTrack = async (req: AuthRequest, res: Response) => {
  try {
    const trackData = {
      ...req.body,
      artistAddress: req.user?.address
    };

    const track = new Track(trackData);
    await track.save();

    res.status(201).json(track);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTracks = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      genre,
      tag,
      artist,
      anime,
      search,
      sortBy = 'createdAt'
    } = req.query;

    const query: any = {};
    
    if (genre) query.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    if (tag) query.tags = { $in: Array.isArray(tag) ? tag : [tag] };
    if (artist) query.artistAddress = artist;
    if (anime) query.anime = anime;
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions: any = {};
    if (sortBy === 'likes') {
      sortOptions.likes = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const tracks = await Track.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Track.countDocuments(query);

    res.json({
      tracks,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrack = async (req: Request, res: Response) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTrack = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = ['description', 'tags', 'genre', 'anime', 'title'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const track = await Track.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json(track);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json({ message: 'Track deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const likeTrack = async (req: AuthRequest, res: Response) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json(track);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 