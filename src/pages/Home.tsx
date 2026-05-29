import { useState, useEffect } from 'react';
import { usePlaylist } from '../hooks/usePlaylist';
import { useAds } from '../hooks/useAds';
import { ChannelList } from '../components/ChannelList';
import { VideoPlayer } from '../components/VideoPlayer';
import { AdBanner } from '../components/AdBanner';
import { AdPreroll } from '../components/AdPreroll';
import { AntiAdblockOverlay } from '../components/AntiAdblock';
import type { Channel } from '../types';

export const Home = () => {
  const { channels, loading, error } = usePlaylist();
  const { showPreroll, checkPreroll, markPrerollShown } = useAds();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  useEffect(() => {
    // Load last watched channel
    const lastWatchedId = localStorage.getItem('lastWatched');
    if (lastWatchedId && channels.length > 0) {
      const lastChannel = channels.find(c => c.id === lastWatchedId);
      if (lastChannel) {
        setSelectedChannel(lastChannel);
      }
    } else if (channels.length > 0) {
      setSelectedChannel(channels[0]);
    }
  }, [channels]);

  const handleSelectChannel = (channel: Channel) => {
    checkPreroll();
    setSelectedChannel(channel);
    localStorage.setItem('lastWatched', channel.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">خطأ: {error}</p>
          <p className="text-gray-400">يرجى التأكد من وجود ملف playlist.m3u في مجلد public</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AntiAdblockOverlay />
      {showPreroll && <AdPreroll onClose={markPrerollShown} />}
      
      {/* Header */}
      <header className="bg-bg-secondary p-4 flex items-center justify-between gap-4">
        <div className="text-2xl font-bold text-accent">📺 IPTV</div>
        <div className="flex-1 max-w-3xl">
          <AdBanner size="leaderboard" />
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Channel List Sidebar */}
        <aside className="w-full lg:w-80 bg-bg-secondary overflow-hidden">
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={handleSelectChannel}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {selectedChannel && (
            <div className="flex flex-col gap-4">
              <VideoPlayer src={selectedChannel.url} poster={selectedChannel.logo} />
              <div className="bg-bg-secondary p-4 rounded-lg">
                <h1 className="text-2xl font-bold mb-2">{selectedChannel.name}</h1>
                <p className="text-gray-400">{selectedChannel.category}</p>
              </div>
              <div className="flex justify-center">
                <AdBanner size="rectangle" />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Ad */}
      <div className="lg:hidden">
        <AdBanner size="mobile" />
      </div>
    </div>
  );
};
