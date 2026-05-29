import { useState, useEffect } from 'react';
import { parseM3U } from '../utils/m3uParser';
import type { Channel } from '../types';
import { PlaylistConfig } from '../config/playlist.config';

export const usePlaylist = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        let url;

        if (PlaylistConfig.source === 'local') {
          url = PlaylistConfig.localPath;
        } else {
          url = PlaylistConfig.remoteUrl;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch playlist');
        const content = await response.text();
        const parsedChannels = parseM3U(content);
        setChannels(parsedChannels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, []);

  return { channels, loading, error };
};
