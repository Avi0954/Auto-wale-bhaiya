import { drivers } from '../data/drivers';
import type { Song, Driver } from '../types';

export const RECENT_HISTORY_LIMIT = 3;

/**
 * Checks if a song is in the recently played history.
 */
export function isRecentlyPlayed(songId: string, history: string[]): boolean {
  // Only look at the last RECENT_HISTORY_LIMIT songs
  const recentHistory = history.slice(-RECENT_HISTORY_LIMIT);
  return recentHistory.includes(songId);
}

/**
 * Calculates a weight for a song based on driver preferences.
 * High = 3x, Medium = 1.5x, Low = 0.1x, Unmatched = 1x
 */
export function getSongWeight(song: Song, driver: Driver): number {
  let weight = 1.0;
  
  const tags = [...(song.genre || []), ...(song.mood || []), song.era].filter(Boolean) as string[];
  
  for (const tag of tags) {
    const pref = driver.preferences[tag];
    if (pref === 'high') weight *= 3.0;
    else if (pref === 'medium') weight *= 1.5;
    else if (pref === 'low') weight *= 0.1;
  }
  
  return weight;
}

/**
 * Selects a weighted random song for a specific driver, avoiding recent history.
 */
export function getWeightedRandomSong(
  driverId: string,
  currentSongId: string | null,
  songPool: Song[],
  history: string[],
  randomFn: () => number = Math.random
): Song {
  if (songPool.length === 0) throw new Error("Song pool is empty");

  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return getRandomSong(songPool, currentSongId, history, randomFn);
  }

  // Filter out current song and recently played songs
  let validSongs = songPool.filter(
    s => s.id !== currentSongId && !isRecentlyPlayed(s.id, history)
  );

  // Fallback: If filtering is too strict (e.g. pool is very small), just filter current song
  if (validSongs.length === 0) {
    validSongs = songPool.filter(s => s.id !== currentSongId);
    if (validSongs.length === 0) validSongs = songPool; // absolute fallback
  }

  // Calculate total weight
  let totalWeight = 0;
  const weightedSongs = validSongs.map(song => {
    const weight = getSongWeight(song, driver);
    totalWeight += weight;
    return { song, weight };
  });

  let randomVal = randomFn() * totalWeight;
  
  for (const { song, weight } of weightedSongs) {
    randomVal -= weight;
    if (randomVal <= 0) return song;
  }
  
  return weightedSongs[weightedSongs.length - 1].song;
}

/**
 * Simple random song selection (no driver preference applied).
 */
export function getRandomSong(
  songPool: Song[],
  currentSongId: string | null = null,
  history: string[] = [],
  randomFn: () => number = Math.random
): Song {
  let validSongs = songPool.filter(
    s => s.id !== currentSongId && !isRecentlyPlayed(s.id, history)
  );
  
  if (validSongs.length === 0) {
    validSongs = songPool.filter(s => s.id !== currentSongId);
    if (validSongs.length === 0) validSongs = songPool;
  }

  const index = Math.floor(randomFn() * validSongs.length);
  return validSongs[index];
}

/**
 * Wrapper for getting the next song, meant to be used by the store.
 */
export function getNextSong(
  driverId: string | undefined,
  currentSongId: string | null,
  songPool: Song[],
  history: string[],
  randomFn: () => number = Math.random
): Song {
  if (driverId) {
    return getWeightedRandomSong(driverId, currentSongId, songPool, history, randomFn);
  }
  return getRandomSong(songPool, currentSongId, history, randomFn);
}

/**
 * Wrapper for getting the previous song.
 */
export function getPreviousSong(songPool: Song[], history: string[]): Song | null {
  if (history.length === 0) return null;
  const prevId = history[history.length - 1]; // Top of the history stack is the most recently played before current
  return songPool.find(s => s.id === prevId) || null;
}
