import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function generatePlaylist() {
  const playlistId = 'PLA6bkRomFH9Q';
  console.log(`Fetching playlist: ${playlistId} using yt-dlp...`);
  
  try {
    const stdout = execSync(`python -m yt_dlp --flat-playlist --dump-json "https://youtube.com/playlist?list=${playlistId}"`, { encoding: 'utf-8' });
    
    const lines = stdout.trim().split('\n');
    const newSongs = lines.map((line, i) => {
      if (!line) return null;
      try {
        const video = JSON.parse(line);
        if (!video.title || video.title === '[Private video]' || video.title === '[Deleted video]') return null;
        return {
          id: `song-${Date.now()}-${i}`,
          title: video.title,
          artist: video.uploader || video.channel || "Unknown Artist",
          artwork: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
          youtubeVideoId: video.id
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    console.log(`Found ${newSongs.length} videos in playlist!`);

    const fileContent = `import type { Song } from '../types';

export const autoDriver90sPlaylist: Song[] = ${JSON.stringify(newSongs, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

    const destPath = path.join(process.cwd(), 'src/data/autoDriver90sPlaylist.ts');
    fs.writeFileSync(destPath, fileContent, 'utf-8');
    console.log(`Playlist successfully updated to ${newSongs.length} songs at ${destPath}`);
  } catch (err) {
    console.error("Error fetching playlist:", err.message);
  }
}

generatePlaylist();
