import fs from 'fs';
import path from 'path';
import ytSearch from 'yt-search';

// Path to the playlist file
const FILE_PATH = path.join(process.cwd(), '../src/data/autoDriver90sPlaylist.ts');

async function main() {
  console.log("Reading playlist file...");
  let content = fs.readFileSync(FILE_PATH, 'utf-8');
  
  // Extract all songs using regex
  const songRegex = /(title:\s*['"]([^'"]+)['"],\s*artist:\s*['"]([^'"]+)['"][\s\S]*?youtubeVideoId:\s*['"]([^'"]+)['"])/g;
  
  const matches = [...content.matchAll(songRegex)];
  console.log(`Found ${matches.length} songs. Fetching Bass Boosted versions...`);
  
  for (const match of matches) {
    const [fullMatch, _, title, artist, currentYtId] = match;
    
    console.log(`Searching for: ${title} ${artist} Bass Boosted...`);
    const query = `${title} ${artist} 90s bass boosted`;
    
    try {
      const searchResult = await ytSearch({ query, pageStart: 1, pageEnd: 1 });
      const videos = searchResult.videos;
      
      if (videos.length > 0) {
        let bestVideo = videos[0];
        
        // Try to find one that actually says "bass boosted" or "jhankar" if possible
        const bassBoosted = videos.find(v => v.title.toLowerCase().includes('bass') || v.title.toLowerCase().includes('boost') || v.title.toLowerCase().includes('jhankar'));
        if (bassBoosted) bestVideo = bassBoosted;
        
        console.log(`  -> Found: ${bestVideo.title} (${bestVideo.videoId})`);
        
        if (bestVideo.videoId !== currentYtId) {
          // Replace in content
          content = content.replace(
            `youtubeVideoId: '${currentYtId}'`,
            `youtubeVideoId: '${bestVideo.videoId}'`
          ).replace(
            `"youtubeVideoId": "${currentYtId}"`,
            `"youtubeVideoId": "${bestVideo.videoId}"`
          );
        }
      } else {
        console.log(`  -> No results found.`);
      }
    } catch (e) {
      console.error(`  -> Error searching: ${e.message}`);
    }
    
    // Slight delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync(FILE_PATH, content, 'utf-8');
  console.log("Done updating playlist with Bass Boosted versions!");
}

main();
