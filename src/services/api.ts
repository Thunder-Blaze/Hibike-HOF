import { ethers } from 'ethers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Track {
  id: string;
  title: string;
  artistName: string;
  artistAddress: string;
  audioUrl: string;
  coverUrl: string;
  description: string;
  likes: number;
}

export const api = {
  async getTracks(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/tracks?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch tracks');
    return response.json();
  },

  async getTrack(id: string) {
    const response = await fetch(`${API_BASE_URL}/tracks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch track');
    return response.json();
  },

  async createTrack(trackData: Omit<Track, 'id' | 'likes'>, signature: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...trackData,
        signature,
        message,
      }),
    });
    if (!response.ok) throw new Error('Failed to create track');
    return response.json();
  },

  async likeTrack(id: string, signature: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/tracks/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature, message }),
    });
    if (!response.ok) throw new Error('Failed to like track');
    return response.json();
  },

  async authenticate(signature: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature, message }),
    });
    if (!response.ok) throw new Error('Authentication failed');
    return response.json();
  },
}; 