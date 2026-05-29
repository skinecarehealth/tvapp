import { useState, useMemo } from 'react';
import type { Channel } from '../types';
import { Search, Star, StarOff } from 'lucide-react';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
}

export const ChannelList = ({ channels, selectedChannel, onSelectChannel }: ChannelListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = useMemo(() => {
    const cats = new Set(channels.map(c => c.category));
    return ['الكل', ...Array.from(cats)];
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || channel.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchQuery, selectedCategory]);

  const toggleFavorite = (e: React.MouseEvent, channelId: string) => {
    e.stopPropagation();
    let newFavorites;
    if (favorites.includes(channelId)) {
      newFavorites = favorites.filter(id => id !== channelId);
    } else {
      newFavorites = [...favorites, channelId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-bg-secondary">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ابحث عن قناة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 rounded-full whitespace-nowrap transition ${
                selectedCategory === category 
                  ? 'bg-accent text-white' 
                  : 'bg-bg-dark text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filteredChannels.map(channel => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition ${
              selectedChannel?.id === channel.id 
                ? 'bg-accent' 
                : 'bg-bg-secondary hover:bg-gray-700'
            }`}
          >
            <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{channel.name}</h3>
              <p className="text-sm text-gray-400 truncate">{channel.category}</p>
            </div>
            <button
              onClick={(e) => toggleFavorite(e, channel.id)}
              className="text-yellow-400"
            >
              {favorites.includes(channel.id) ? <Star fill="currentColor" size={20} /> : <StarOff size={20} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
