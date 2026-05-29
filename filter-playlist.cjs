
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'playlist.m3u');
const outputPath = path.join(__dirname, 'public', 'playlist.m3u');

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split('\n');

const sportKeywords = [
  'sport', 'beIN', 'alwan', 'thamanya', 'starz play',
  'shasha', 'shahid', 'serie a', 'nba', 'wwe', 'world cup',
  'alkass', 'ontime', 'premier', 'champions', 'liga', 'bundesliga',
  'laliga', 'serie a', 'ligue 1', 'mlb', 'nhl', 'ufc', 'boxing',
  'tennis', 'formula', 'f1', 'motor', 'racing', 'bein', 'sports'
];

let filteredLines = ['#EXTM3U'];
let currentChannel = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.startsWith('#EXTINF:')) {
    if (currentChannel.length > 0) {
      filteredLines.push(...currentChannel);
      currentChannel = [];
    }
    currentChannel.push(line);
  } else if (line && !line.startsWith('#')) {
    if (currentChannel.length > 0) {
      currentChannel.push(line);
      
      // Check if this channel is a sport channel
      const channelText = currentChannel.join(' ').toLowerCase();
      const isSportChannel = sportKeywords.some(keyword => 
        channelText.includes(keyword.toLowerCase())
      );
      
      if (isSportChannel) {
        filteredLines.push(...currentChannel);
      }
      currentChannel = [];
    }
  } else if (line.startsWith('#')) {
    if (currentChannel.length > 0) {
      currentChannel.push(line);
    }
  }
}

// Add any remaining channel
if (currentChannel.length > 2) {
  const channelText = currentChannel.join(' ').toLowerCase();
  const isSportChannel = sportKeywords.some(keyword => 
    channelText.includes(keyword.toLowerCase())
  );
  if (isSportChannel) {
    filteredLines.push(...currentChannel);
  }
}

fs.writeFileSync(outputPath, filteredLines.join('\n'), 'utf8');
console.log(`✅ Filtered playlist saved! Kept ${(filteredLines.length - 1) / 2} sport channels`);
