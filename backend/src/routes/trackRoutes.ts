import express from 'express';
import {
  createTrack,
  getTracks,
  getTrack,
  updateTrack,
  deleteTrack,
  likeTrack
} from '../controllers/trackController';
import { authenticateToken, isTrackOwner } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTracks);
router.get('/:id', getTrack);

// Protected routes
router.post('/', authenticateToken, createTrack);
router.put('/:id', authenticateToken, isTrackOwner, updateTrack);
router.delete('/:id', authenticateToken, isTrackOwner, deleteTrack);
router.post('/:id/like', authenticateToken, likeTrack);

export default router; 