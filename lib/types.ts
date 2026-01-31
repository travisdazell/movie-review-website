import { Timestamp } from 'firebase/firestore';

export interface Movie {
  id?: string;
  title: string;
  year: number;
  actors?: string[];
  director: string;
  image?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface Review {
  id?: string;
  movieId: string;
  userId: string;
  text: string;
  grade: 'F' | 'D' | 'C' | 'B' | 'A' | 'A+';
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  authMethod: 'local' | 'gmail';
  createdAt?: Date | Timestamp;
  lastLogin?: Date | Timestamp;
}