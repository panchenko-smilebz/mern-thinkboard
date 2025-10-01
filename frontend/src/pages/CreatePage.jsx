import api from '../lib/axios';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const CreatePage = () => {
  const [isTitle, setIsTitle] = useState('');
  const [isContent, setIsContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/notes', {
        title: isTitle,
        content: isContent,
      });
      toast.success('Note created successfully');
      setIsTitle('');
      setIsContent('');
    } catch (error) {
      console.log('Error creating note:', error);
      if (error.response.status === 429) {
        toast.error('Slow down! You are creating notes too fast.', {
          duration: 4000,
          icon: '💀',
        });
      } else {
        toast.error('Failed to create note');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bd-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={'/'} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">
                      Title <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={isTitle}
                    onChange={(e) => setIsTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={isContent}
                    onChange={(e) => setIsContent(e.target.value)}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
