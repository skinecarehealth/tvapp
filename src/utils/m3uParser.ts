import type { Channel } from '../types';

export function parseM3U(content: string): Channel[] {
  const channels: Channel[] = [];
  const lines = content.split('\n');
  let currentInfo: Partial<Channel> = {};
  let channelIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Extract info from EXTINF line
      const infoMatch = line.match(/#EXTINF:-?\d+(.*?),(.*)$/);
      if (infoMatch) {
        const attributesStr = infoMatch[1];
        const name = infoMatch[2].trim();
        
        currentInfo.name = name;

        // Extract attributes like tvg-logo, group-title
        const attrs: Record<string, string> = {};
        // Improved regex to handle attributes with possible whitespace
        const attrRegex = /([a-zA-Z0-9-]+)\s*=\s*"([^"]*)"/g;
        let match;
        while ((match = attrRegex.exec(attributesStr)) !== null) {
          const value = match[2].trim();
          attrs[match[1]] = value;
        }

        // Clean up logo URLs - remove any extra quotes or brackets
        let logo = attrs['tvg-logo'];
        if (logo) {
          logo = logo.replace(/^[\[\]"]+|[\[\]"]+$/g, '');
        }
        currentInfo.logo = logo || undefined;
        
        // Clean up category
        let category = attrs['group-title'];
        if (category) {
          category = category.trim();
        }
        currentInfo.category = category || 'غير مصنف';
      }
    } else if (line && !line.startsWith('#')) {
      // This is a URL - use direct connection
      currentInfo.url = line;
      // Use a simple unique ID with channel index
      currentInfo.id = `channel-${channelIndex}`;
      
      if (currentInfo.name && currentInfo.url) {
        channels.push(currentInfo as Channel);
        channelIndex++;
      }
      
      currentInfo = {};
    }
  }

  return channels;
}
