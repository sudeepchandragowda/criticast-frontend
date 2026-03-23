export interface Idea {
  id: number;
  title: string;
  description: string;
  genre: string;
  status: string;
  creatorId: number;
  creatorName: string;
  createdAt: string;
  totalReviews: number;
  avgRating: number;
  scriptUrl: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  emailVerified: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
}
