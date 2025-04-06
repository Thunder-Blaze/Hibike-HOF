import mongoose, { Document, Schema } from 'mongoose';

export interface ITrack extends Document {
  artistAddress: string;
  artistName: string;
  description: string;
  anime?: string;
  title: string;
  genre: string[];
  tags: string[];
  likes: number;
  ipfsCID: string;
  createdAt: Date;
  updatedAt: Date;
}

const trackSchema = new Schema({
  artistAddress: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Please provide a valid Ethereum address']
  },
  artistName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  anime: {
    type: String,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  genre: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: 'At least one genre must be specified'
    },
    index: true
  },
  tags: {
    type: [String],
    default: [],
    index: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  ipfsCID: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/.test(v),
      message: 'Please provide a valid IPFS CID'
    }
  }
}, {
  timestamps: true
});

// Create text indexes for search functionality
trackSchema.index({ title: 'text', description: 'text', artistName: 'text' });

// Add compound indexes for common queries
trackSchema.index({ genre: 1, likes: -1 });
trackSchema.index({ tags: 1, likes: -1 });

export const Track = mongoose.model<ITrack>('Track', trackSchema); 