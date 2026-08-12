import { drivers } from '../data/drivers';
import type { Song, Driver } from '../types';

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
 * Gets the valid songs for the current round of the "True Shuffle" (Deck Shuffle).
 */
export function getValidSongs(songPool: Song[], currentSongId: string | null, history: string[]): Song[] {
  if (songPool.length === 0) return [];

  // Effective history includes the currently playing song
  const effectiveHistory = currentSongId ? [...history, currentSongId] : [...history];
  const playedInRoundCount = effectiveHistory.length % songPool.length;
  
  let excludeList: string[] = [];
  
  // If playedInRoundCount is 0, we've played exactly a multiple of the pool size.
  // This means a new "deck" is starting.
  // We only exclude the current song to avoid playing it twice in a row at the deck boundary.
  if (playedInRoundCount === 0) {
    excludeList = currentSongId ? [currentSongId] : [];
  } else {
    // Exclude all songs that have already been played in this current deck round
    excludeList = effectiveHistory.slice(-playedInRoundCount);
  }
  
  let validSongs = songPool.filter(s => !excludeList.includes(s.id));
  
  // Fallbacks just in case something goes wrong
  if (validSongs.length === 0) {
    validSongs = songPool.filter(s => s.id !== currentSongId);
    if (validSongs.length === 0) validSongs = songPool;
  }
  
  return validSongs;
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

  const validSongs = getValidSongs(songPool, currentSongId, history);

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
  const validSongs = getValidSongs(songPool, currentSongId, history);

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
