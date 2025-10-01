import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, TrashIcon } from 'lucide-react';

const NoteDetailPage = () => {
  const [isNote, setIsNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setIsNote(res.data);
      } catch (error) {
        console.log('Error fetching note details:', error);
        toast.error('Failed to fetch note details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted');
      navigate('/');
    } catch (error) {
      console.log('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };
  const handleSave = async () => {
    if (!isNote.title.trim()) {
      toast.error('Please add a title for the note');
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/notes/${id}`, isNote);
      toast.success('Note updated');
    } catch (error) {
      console.log('Error updating note:', error);
      toast.error('Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to={'/'} className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <TrashIcon className="size-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input input-bordered"
                  value={isNote.title}
                  onChange={(e) =>
                    setIsNote({ ...isNote, title: e.target.value })
                  }
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={isNote.content}
                  onChange={(e) =>
                    setIsNote({ ...isNote, content: e.target.value })
                  }
                />
              </div>

              <div className="card-action flex justify-end">
                <button
                  className="btn btn-primary"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
