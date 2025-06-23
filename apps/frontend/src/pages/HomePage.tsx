
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Search } from 'lucide-react';
import { Track } from '@/types';
import TrackCard from '@/components/TrackCard';
import CreateTrackModal from '@/components/CreateTrackModal';
import { useToast } from '@/hooks/use-toast';

const HomePage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load tracks from localStorage (will be replaced with Supabase)
    const savedTracks = localStorage.getItem('projectvista_tracks');
    if (savedTracks) {
      setTracks(JSON.parse(savedTracks));
    }
  }, []);

  const saveTracksToStorage = (newTracks: Track[]) => {
    localStorage.setItem('projectvista_tracks', JSON.stringify(newTracks));
    setTracks(newTracks);
  };

  const handleCreateTrack = (title: string, articles: any[]) => {
    const newTrack: Track = {
      id: `track_${Date.now()}`,
      userId: 'demo_user',
      title,
      articles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTracks = [...tracks, newTrack];
    saveTracksToStorage(updatedTracks);
    
    toast({
      title: "Track Created!",
      description: `"${title}" has been added to your tracks.`,
    });
  };

  const handleTrackClick = (track: Track) => {
    // Navigate to track view - for now, we'll just show a toast
    toast({
      title: "Track View",
      description: `Opening "${track.title}" - Track view page coming soon!`,
    });
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUser = JSON.parse(localStorage.getItem('projectvista_user') || '{}');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">ProjectVista</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary hidden sm:block">
                Welcome, {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('projectvista_auth');
                  localStorage.removeItem('projectvista_user');
                  localStorage.removeItem('projectvista_tracks');
                  window.location.reload();
                }}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">My Learning Tracks</h2>
            <p className="text-text-secondary">
              Create and organize your personal knowledge journeys
            </p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-accent-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-5 w-5" />
            Create Track
          </button>
        </div>

        {/* Search */}
        {tracks.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your tracks..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent text-text-primary placeholder-text-secondary"
              />
            </div>
          </div>
        )}

        {/* Tracks Grid */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onClick={() => handleTrackClick(track)}
              />
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-text-primary mb-2">No tracks found</h3>
            <p className="text-text-secondary">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="h-16 w-16 text-text-secondary mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Start Your Learning Journey
              </h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Create your first learning track by organizing Wikipedia articles into a structured path of knowledge.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-accent-blue text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center gap-3"
              >
                <Plus className="h-5 w-5" />
                Create Your First Track
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Track Modal */}
      <CreateTrackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTrack}
      />
    </div>
  );
};

export default HomePage;
