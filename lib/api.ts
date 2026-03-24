import axios from "axios";
import { Page, Idea } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach the JWT token to every request if one is stored in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Ideas ────────────────────────────────────────────────────────────────────

export async function getTopIdeas(page = 0, size = 10): Promise<Page<Idea>> {
  const { data } = await api.get("/api/ideas/top", { params: { page, size } });
  return data;
}

export async function getIdeaById(id: number): Promise<Idea> {
  const { data } = await api.get(`/api/ideas/${id}`);
  return data;
}

export async function getIdeasByGenre(
  genre: string,
  page = 0,
  size = 10
): Promise<Page<Idea>> {
  const { data } = await api.get(`/api/ideas/genre/${genre}`, {
    params: { page, size },
  });
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role?: string
) {
  const { data } = await api.post("/api/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get("/api/users/me");
  return data;
}

// ── My Ideas (Creator dashboard) ─────────────────────────────────────────────

export async function getMyIdeas(page = 0, size = 20): Promise<Page<Idea>> {
  const { data } = await api.get("/api/ideas/my", { params: { page, size } });
  return data;
}

export async function createIdea(payload: {
  title: string;
  description: string;
  genre: string;
  scriptUrl?: string;
}): Promise<Idea> {
  const { data } = await api.post("/api/ideas", payload);
  return data;
}

export async function updateIdea(id: number, payload: {
  title: string;
  description: string;
  genre: string;
  scriptUrl?: string;
}): Promise<Idea> {
  const { data } = await api.put(`/api/ideas/${id}`, payload);
  return data;
}

export async function publishIdea(id: number): Promise<Idea> {
  const { data } = await api.patch(`/api/ideas/${id}/publish`);
  return data;
}

export async function deleteIdea(id: number): Promise<void> {
  await api.delete(`/api/ideas/${id}`);
}

// ── Browse (search + genre filter) ───────────────────────────────────────────

export async function browseIdeas(params: {
  genre?: string;
  search?: string;
  page?: number;
  size?: number;
}): Promise<Page<Idea>> {
  const { data } = await api.get("/api/ideas", { params: { ...params, size: params.size ?? 12 } });
  return data;
}

export default api;
