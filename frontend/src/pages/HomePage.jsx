import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isNotes, setIsNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        console.log(res.data);
        setIsNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        console.log(error);

        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error('Failed to load notes');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {isNotes.length === 0 && !isRateLimited && <NotesNotFound />}

        {isNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isNotes.map((note) => (
              <NoteCard key={note._id} note={note} setIsNotes={setIsNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
