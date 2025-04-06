import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { Track } from '../models/Track';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    address: string;
  };
}

export const verifySignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { signature, message, address } = req.body;

    if (!signature || !message || !address) {
      return res.status(400).json({ error: 'Missing authentication parameters' });
    }

    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Generate JWT token
    const token = jwt.sign({ address: recoveredAddress }, JWT_SECRET, { expiresIn: '24h' });

    res.locals.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid signature' });
  }
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { address: string };
    req.user = { address: decoded.address };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const isTrackOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    if (track.artistAddress.toLowerCase() !== req.user?.address.toLowerCase()) {
      return res.status(403).json({ error: 'Not authorized to modify this track' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 