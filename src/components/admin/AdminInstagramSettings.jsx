import React, { useState, useEffect } from 'react';
import { 
  Save, X, RefreshCw, Upload, Image as ImageIcon, Edit2, 
  Trash2, Plus, ArrowUp, ArrowDown, ExternalLink, Instagram
} from 'lucide-react';
import { uploadFileWithProgress } from '../../utils/uploadHelpers';
import { useModalStore } from '../../store/modalStore';

const rotations = [
  '-rotate-1 md:-translate-y-2',
  'rotate-1 md:translate-y-1',
  '-rotate-2 md:-translate-y-4',
  'rotate-2 md:translate-y-2',
  '-rotate-1 md:-translate-y-1',
  'rotate-1 md:translate-y-3'
];

export default function AdminInstagramSettings({ token }) {
  const { success, error, confirm } = useModalStore();
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/swastikasarees_');
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Form states for adding/editing a post
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [postForm, setPostForm] = useState({
    url: '',
    coverPhoto: '',
    caption: 'View lookbook'
  });

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data) {
        setInstagramUrl(data.instagramUrl || 'https://instagram.com/swastikasarees_');
        setInstagramPosts(data.instagramPosts || []);
      }
    } catch (err) {
      error('Error', 'Failed to load Instagram settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          instagramUrl,
          instagramPosts
        })
      });
      if (res.ok) {
        success('Success', 'Instagram settings updated successfully!');
      } else {
        const data = await res.json();
        error('Error', data.error || 'Failed to save settings.');
      }
    } catch (err) {
      error('Error', 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    confirm('Discard Changes', 'Are you sure you want to revert to the last saved settings?', () => {
      fetchSettings();
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadProgress(10);
    try {
      const res = await uploadFileWithProgress(file, token, (percent) => {
        setUploadProgress(percent);
      }, 'instagram');
      
      if (res && res.url) {
        setPostForm(prev => ({ ...prev, coverPhoto: res.url }));
        success('Success', 'Cover photo uploaded successfully!');
      }
    } catch (err) {
      error('Upload Failed', err.message || 'Failed to upload cover photo.');
    } finally {
      setUploadProgress(null);
    }
  };

  // Add a new post to local state list
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!postForm.coverPhoto) {
      error('Validation Error', 'A cover photo is required for the Instagram post.');
      return;
    }
    
    const newPost = { ...postForm };
    if (!newPost.url) {
      newPost.url = instagramUrl;
    }

    setInstagramPosts(prev => [...prev, newPost]);
    setIsAdding(false);
    resetPostForm();
  };

  // Update a post in local state list
  const handleUpdatePost = (e) => {
    e.preventDefault();
    if (!postForm.coverPhoto) {
      error('Validation Error', 'A cover photo is required.');
      return;
    }

    const updated = [...instagramPosts];
    updated[editingIndex] = { ...postForm };
    setInstagramPosts(updated);
    setEditingIndex(null);
    resetPostForm();
  };

  const resetPostForm = () => {
    setPostForm({
      url: '',
      coverPhoto: '',
      caption: 'View lookbook'
    });
  };

  const deletePost = (index) => {
    confirm('Delete Post', 'Are you sure you want to remove this Instagram lookbook post from the feed list?', () => {
      setInstagramPosts(prev => prev.filter((_, i) => i !== index));
    });
  };

  const startEdit = (index) => {
    const post = instagramPosts[index];
    setPostForm({
      url: post.url || '',
      coverPhoto: post.coverPhoto || '',
      caption: post.caption || 'View lookbook'
    });
    setEditingIndex(index);
    setIsAdding(false);
  };

  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= instagramPosts.length) return;

    const list = [...instagramPosts];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setInstagramPosts(list);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading Instagram Settings...</div>;
  }

  return (
    <div className="h-full flex flex-col xl:flex-row bg-gray-50/50 relative overflow-hidden min-h-[calc(100vh-8rem)]">
      
      {/* LEFT COLUMN: Manage & Edit Section */}
      <div className="w-full xl:w-7/12 p-6 bg-brand-white border-r border-brand-border/40 overflow-y-auto space-y-6 flex flex-col">
        
        {/* Editor Actions bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-border/40">
          <div>
            <h2 className="text-xl font-display font-black text-brand-dark">Instagram Organic Lookbook</h2>
            <p className="text-xs text-brand-muted mt-1">Configure your official profile link and manage individual feed cards.</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDiscard}
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-border/60 rounded-md text-xs font-semibold text-brand-dark hover:bg-brand-cream/35 transition-colors"
            >
              <RefreshCw size={14} />
              <span>Discard</span>
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/90 disabled:bg-brand-crimson/60 text-brand-cream rounded-md text-xs font-semibold shadow-md transition-colors"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {/* Global Settings Section */}
        <div className="bg-brand-cream/20 border border-brand-border/30 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Profile Configuration</h3>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-brand-dark select-none">Instagram Profile URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/your_handle"
                className="flex-grow bg-brand-cream/40 border border-brand-border/50 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold transition-colors font-semibold"
              />
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-brand-dark text-brand-cream rounded-lg hover:bg-brand-crimson transition-colors"
                title="Verify Link"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            <p className="text-[10px] text-brand-muted">This updates the 'Follow Us' links across the header, footer, and lookbook headings.</p>
          </div>
        </div>

        {/* Post Form Area (Add or Edit) */}
        {(isAdding || editingIndex !== null) ? (
          <div className="bg-brand-cream/15 border border-brand-border p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-brand-border/20">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">
                {isAdding ? '✨ Add Lookbook Post' : '📝 Edit Lookbook Post'}
              </h3>
              <button 
                onClick={() => { setIsAdding(false); setEditingIndex(null); resetPostForm(); }}
                className="text-gray-400 hover:text-brand-crimson transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={isAdding ? handleAddPost : handleUpdatePost} className="space-y-4 text-xs font-sans font-medium text-brand-dark text-left">
              {/* Cover Photo Upload */}
              <div className="flex flex-col space-y-2">
                <span className="text-xs font-bold text-brand-dark">Cover Photo</span>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-24 h-32 rounded-xl border border-brand-border bg-brand-cream/30 overflow-hidden relative flex items-center justify-center shrink-0 shadow-sm">
                    {postForm.coverPhoto ? (
                      <img src={postForm.coverPhoto} alt="Upload Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={28} className="text-brand-muted/40" />
                    )}
                    {uploadProgress !== null && (
                      <div className="absolute inset-0 bg-brand-dark/70 text-brand-cream flex items-center justify-center flex-col text-[10px]">
                        <RefreshCw size={14} className="animate-spin mb-1 text-brand-gold" />
                        <span>{uploadProgress}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2.5 w-full">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={postForm.coverPhoto}
                        onChange={(e) => setPostForm(prev => ({ ...prev, coverPhoto: e.target.value }))}
                        placeholder="Paste Cover Image URL directly..."
                        className="flex-grow bg-brand-cream/40 border border-brand-border/50 px-3 py-2 rounded-md text-xs focus:outline-none focus:border-brand-gold text-brand-dark"
                      />
                      <label className="bg-brand-dark hover:bg-brand-crimson text-brand-cream px-4 py-2 rounded-md text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                        <Upload size={13} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-brand-muted leading-relaxed">
                      Recommended: Portrait aspect ratio (3:4) for optimum grid display.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instagram URL */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-brand-dark">Instagram Post Link (Optional)</label>
                <input
                  type="text"
                  value={postForm.url}
                  onChange={(e) => setPostForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={`Defaults to profile link: ${instagramUrl}`}
                  className="bg-brand-cream/40 border border-brand-border/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold font-semibold"
                />
              </div>

              {/* Caption */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-brand-dark">Hover Caption Text (Optional)</label>
                <input
                  type="text"
                  value={postForm.caption}
                  onChange={(e) => setPostForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="View lookbook"
                  className="bg-brand-cream/40 border border-brand-border/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingIndex(null); resetPostForm(); }}
                  className="px-4 py-2 border border-brand-border rounded-md text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-dark hover:bg-brand-crimson text-brand-cream font-bold rounded-md text-xs shadow-md transition-colors"
                >
                  {isAdding ? 'Add to Feed List' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-end pb-1">
            <button
              onClick={() => { setIsAdding(true); setEditingIndex(null); resetPostForm(); }}
              className="flex items-center gap-1.5 bg-brand-dark hover:bg-brand-crimson text-brand-cream px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Lookbook Post</span>
            </button>
          </div>
        )}

        {/* Instagram Posts Grid list */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider">Feed Cards ({instagramPosts.length})</h3>
            <span className="text-[10px] text-brand-muted">Reorder using arrows. Up to 6-8 recommended.</span>
          </div>

          {instagramPosts.length === 0 ? (
            <div className="border border-dashed border-brand-border/60 rounded-2xl p-8 text-center text-brand-muted text-xs">
              No custom Instagram feed cards configured. The site will display default mock items. Click 'Add Lookbook Post' to create custom ones.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {instagramPosts.map((post, i) => (
                <div key={i} className="flex gap-3 border border-brand-border/40 p-3 rounded-2xl bg-brand-cream/10 hover:bg-white hover:shadow-md transition-all duration-300 relative group">
                  <div className="w-16 h-20 bg-brand-cream/35 border border-brand-border/40 rounded-lg overflow-hidden shrink-0">
                    <img src={post.coverPhoto} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between text-left min-w-0 pr-12">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider">Post #{i + 1}</span>
                      <p className="text-xs font-bold text-brand-dark truncate">{post.caption || 'View lookbook'}</p>
                      <a href={post.url || instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-muted flex items-center gap-1 hover:text-brand-crimson transition-colors truncate">
                        <Instagram size={10} className="shrink-0" />
                        <span className="truncate">{post.url || instagramUrl}</span>
                      </a>
                    </div>
                  </div>
                  
                  {/* Floating Action buttons */}
                  <div className="absolute right-3.5 top-3 flex flex-col gap-1">
                    <button 
                      onClick={() => startEdit(i)}
                      className="p-1 text-gray-500 hover:text-brand-crimson hover:bg-gray-100 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => deletePost(i)}
                      className="p-1 text-gray-500 hover:text-brand-crimson hover:bg-gray-100 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  {/* Reordering indicators */}
                  <div className="absolute bottom-2.5 right-3.5 flex gap-1">
                    <button
                      onClick={() => moveItem(i, -1)}
                      disabled={i === 0}
                      className="p-1 text-gray-500 hover:text-brand-crimson hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      onClick={() => moveItem(i, 1)}
                      disabled={i === instagramPosts.length - 1}
                      className="p-1 text-gray-500 hover:text-brand-crimson hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Live Responsive Preview */}
      <div className="w-full xl:w-5/12 bg-brand-cream/35 flex flex-col p-6 overflow-y-auto min-h-[400px]">
        <div className="sticky top-0 space-y-4">
          <div className="text-left">
            <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider">Live Homepage Preview</h3>
            <p className="text-[10px] text-brand-muted">This mimics the look of the Instagram Lookbook Section on the live storefront.</p>
          </div>

          {/* Homepage Instagram Feed Section Re-creation */}
          <div className="bg-brand-cream/20 border border-brand-border/40 rounded-3xl p-6 shadow-sm select-none text-center">
            <div className="text-center max-w-sm mx-auto mb-6 flex flex-col items-center">
              <span className="text-[9px] text-brand-gold font-bold uppercase tracking-widest font-sans">Social Gallery</span>
              <h2 className="text-lg text-brand-dark font-bold mt-0.5">Tag Us to Get Featured</h2>
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center space-x-2 mt-2 text-[10px] font-semibold text-brand-dark border border-brand-border/30 bg-brand-white p-1.5 px-3 rounded-full hover:text-brand-crimson transition-colors"
              >
                <span>@{instagramUrl.replace(/\/$/, '').split('/').pop() || 'swastikasarees_'}</span>
                <span className="w-1 h-1 bg-brand-gold rounded-full" />
                <span>12K+ Followers</span>
              </a>
            </div>

            {/* Grid preview */}
            <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
              {(instagramPosts.length > 0 ? instagramPosts : [
                { coverPhoto: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400', caption: 'View lookbook' },
                { coverPhoto: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400', caption: 'View lookbook' },
                { coverPhoto: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=400', caption: 'View lookbook' },
                { coverPhoto: 'https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&q=80&w=400', caption: 'View lookbook' },
                { coverPhoto: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=400', caption: 'View lookbook' },
                { coverPhoto: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400', caption: 'View lookbook' }
              ]).slice(0, 6).map((item, i) => {
                const rotationClass = rotations[i % rotations.length];
                return (
                  <div
                    key={i}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border border-brand-border/30 shadow-2xs group cursor-pointer transition-all duration-300 transform ${rotationClass}`}
                  >
                    <img 
                      src={item.coverPhoto} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    />
                    <div className="absolute inset-0 bg-brand-dark/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-brand-cream">
                      <Instagram size={14} className="mb-0.5" />
                      <span className="text-[8px] uppercase tracking-widest font-bold">{item.caption || 'View lookbook'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-brand-white text-brand-dark border border-brand-border/50 px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-wider"
              >
                <Instagram size={10} className="text-brand-crimson" />
                <span>Follow Us On Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
