import { v4 as uuidv4 } from 'uuid';

const ANONYMOUS_USER_KEY = 'omegle_anonymous_user';

export interface AnonymousUser {
  id: string;
  createdAt: string;
  sessionActive: boolean;
}

export const getAnonymousUser = (): AnonymousUser | null => {
  try {
    const stored = localStorage.getItem(ANONYMOUS_USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error getting anonymous user:', error);
  }
  return null;
};

export const createAnonymousUser = (): AnonymousUser => {
  const anonymousUser: AnonymousUser = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    sessionActive: true
  };
  
  try {
    localStorage.setItem(ANONYMOUS_USER_KEY, JSON.stringify(anonymousUser));
  } catch (error) {
    console.error('Error storing anonymous user:', error);
  }
  
  return anonymousUser;
};

export const clearAnonymousUser = (): void => {
  try {
    localStorage.removeItem(ANONYMOUS_USER_KEY);
  } catch (error) {
    console.error('Error clearing anonymous user:', error);
  }
};

export const getOrCreateAnonymousUser = (): AnonymousUser => {
  const existing = getAnonymousUser();
  if (existing && existing.sessionActive) {
    return existing;
  }
  return createAnonymousUser();
};