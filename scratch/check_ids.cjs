const fs = require('fs');
const content = fs.readFileSync('src/data/autoDriver90sPlaylist.ts', 'utf8');
const regex = /youtubeVideoId:\s*['"]([^'"]+)['"]/g;
let match;
let found = false;
while (match = regex.exec(content)) {
  const id = match[1];
  if (id.length !== 11 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    console.log('MALFORMED:', id);
    found = true;
  }
}
if (!found) console.log('ALL IDs ARE VALID');
