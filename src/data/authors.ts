import { founders } from './founder';

export type AuthorData = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  email?: string;
};

// Map founders to authors for EEAT schema purposes
export const authors: AuthorData[] = founders.map(f => ({
  id: f.name.toLowerCase().replace(/\s+/g, '-'),
  name: f.name,
  role: f.position,
  bio: f.story || '',
  image: f.image || '',
  linkedin: f.linkedin || '',
  email: f.email?.replace('mailto:', '')
}));

export const getAuthorById = (id: string): AuthorData | undefined => {
  return authors.find(a => a.id === id);
};

export const getAuthorByName = (name: string): AuthorData | undefined => {
  return authors.find(a => a.name.toLowerCase() === name.toLowerCase());
};
