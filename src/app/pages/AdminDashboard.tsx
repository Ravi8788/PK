import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authAPI, portfolioAPI, reelsAPI, testimonialsAPI, contactAPI } from '@/app/utils/api';
import { Plus, Trash2, LogOut, Image, Video, MessageSquare, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { PortfolioForm } from '@/app/components/PortfolioForm';
import { ReelForm } from '@/app/components/ReelForm';
import { TestimonialForm } from '@/app/components/TestimonialForm';

type Tab = 'portfolio' | 'reels' | 'testimonials' | 'contact';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [portfolio, setPortfolio] = useState([]);
  const [reels, setReels] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Form modals
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showReelForm, setShowReelForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    try {
      const session = await authAPI.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
    } catch (error) {
      console.warn('Auth check error:', error);
      navigate('/admin/login');
    }
  };

  const loadData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === 'portfolio') {
        const data = await portfolioAPI.getAll();
        setPortfolio(data || []);
      } else if (activeTab === 'reels') {
        const data = await reelsAPI.getAll();
        setReels(data || []);
      } else if (activeTab === 'testimonials') {
        const data = await testimonialsAPI.getAll();
        setTestimonials(data || []);
      } else if (activeTab === 'contact') {
        const data = await contactAPI.getAll();
        setContacts(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Don't show error toast if it's just empty data
      if (error instanceof Error && !error.message.includes('does not exist')) {
        toast.error(`Failed to load ${activeTab} data`);
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.warn('Sign out error:', error);
    } finally {
      navigate('/admin/login');
    }
  };

  const handleAddPortfolio = async () => {
    const title = prompt('Enter title:');
    const category = prompt('Enter category (Wedding/Pre-Wedding/Creative/Reels):');
    const image = prompt('Enter image URL:');
    
    if (title && category && image) {
      try {
        await portfolioAPI.add({ title, category, image });
        toast.success('Portfolio item added');
        loadData();
      } catch (error) {
        toast.error('Failed to add portfolio item');
      }
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await portfolioAPI.delete(id);
        toast.success('Portfolio item deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete portfolio item');
      }
    }
  };

  const handleAddReel = async () => {
    const title = prompt('Enter title:');
    const thumbnail = prompt('Enter thumbnail URL:');
    const views = prompt('Enter view count (e.g., 100K):');
    
    if (title && thumbnail && views) {
      try {
        await reelsAPI.add({ title, thumbnail, views });
        toast.success('Reel added');
        loadData();
      } catch (error) {
        toast.error('Failed to add reel');
      }
    }
  };

  const handleDeleteReel = async (id: string) => {
    if (confirm('Are you sure you want to delete this reel?')) {
      try {
        await reelsAPI.delete(id);
        toast.success('Reel deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete reel');
      }
    }
  };

  const handleAddTestimonial = async () => {
    const name = prompt('Enter client name:');
    const role = prompt('Enter role (e.g., Wedding Client):');
    const text = prompt('Enter testimonial text:');
    const image = prompt('Enter image URL:');
    const rating = prompt('Enter rating (1-5):');
    
    if (name && role && text && image && rating) {
      try {
        await testimonialsAPI.add({ name, role, text, image, rating: parseInt(rating) });
        toast.success('Testimonial added');
        loadData();
      } catch (error) {
        toast.error('Failed to add testimonial');
      }
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialsAPI.delete(id);
        toast.success('Testimonial deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">PK</span>
                <span className="text-orange-600"> Graphics</span>
              </h1>
              <p className="text-gray-400 text-sm">Admin Dashboard</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-gray-400 text-sm sm:text-base truncate">{user?.email}</span>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                View Site
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs - Scrollable on mobile */}
      <div className="bg-gray-800 border-b border-gray-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 min-w-max sm:min-w-0">
            {[
              { id: 'portfolio', label: 'Portfolio', icon: Image },
              { id: 'reels', label: 'Reels', icon: Video },
              { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
              { id: 'contact', label: 'Contact Messages', icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as Tab)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Portfolio */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Portfolio Items</h2>
              <button
                onClick={() => setShowPortfolioForm(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading portfolio items...</div>
              </div>
            ) : portfolio.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                <Image size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Portfolio Items Yet</h3>
                <p className="text-gray-500 mb-6">Start building your portfolio by adding your first item</p>
                <button
                  onClick={() => setShowPortfolioForm(true)}
                  className="px-6 py-3 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item: any) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <img src={item.image_url || item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{item.category}</p>
                      <button
                        onClick={() => handleDeletePortfolio(item.id)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reels */}
        {activeTab === 'reels' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Reels</h2>
              <button
                onClick={() => setShowReelForm(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={20} />
                Add Reel
              </button>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading reels...</div>
              </div>
            ) : reels.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                <Video size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Reels Yet</h3>
                <p className="text-gray-500 mb-6">Showcase your video content by adding your first reel</p>
                <button
                  onClick={() => setShowReelForm(true)}
                  className="px-6 py-3 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Your First Reel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reels.map((item: any) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <img src={item.thumbnail_url || item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{item.description || item.views} views</p>
                      <button
                        onClick={() => handleDeleteReel(item.id)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Testimonials */}
        {activeTab === 'testimonials' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Testimonials</h2>
              <button
                onClick={() => setShowTestimonialForm(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={20} />
                Add Testimonial
              </button>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading testimonials...</div>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Testimonials Yet</h3>
                <p className="text-gray-500 mb-6">Build trust by showcasing client reviews and feedback</p>
                <button
                  onClick={() => setShowTestimonialForm(true)}
                  className="px-6 py-3 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Your First Testimonial
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((item: any) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={item.client_image || item.image} alt={item.client_name || item.name} className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <h3 className="font-semibold text-white">{item.client_name || item.name}</h3>
                        <p className="text-sm text-gray-400">{item.project_type || item.role}</p>
                        <p className="text-orange-600 text-sm">Rating: {item.rating}/5</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">"{item.text}"</p>
                    <button
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Messages */}
        {activeTab === 'contact' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading contact messages...</div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                <Mail size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Contact Messages</h3>
                <p className="text-gray-500">Messages from your contact form will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((item: any) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at || item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Portfolio Form Modal */}
      {showPortfolioForm && (
        <PortfolioForm
          onClose={() => setShowPortfolioForm(false)}
          onSubmit={async (data) => {
            try {
              console.log('Submitting portfolio data:', data);
              const result = await portfolioAPI.add(data);
              console.log('Portfolio add result:', result);
              
              if (!result) {
                throw new Error('Failed to add portfolio item - no data returned');
              }
              
              toast.success('Portfolio item added successfully!');
              setShowPortfolioForm(false);
              
              // Wait a moment for database to update, then reload
              setTimeout(() => {
                loadData();
              }, 500);
            } catch (error) {
              console.error('Error in portfolio submit:', error);
              toast.error('Failed to add portfolio item. Please check console for details.');
            }
          }}
        />
      )}

      {/* Reel Form Modal */}
      {showReelForm && (
        <ReelForm
          onClose={() => setShowReelForm(false)}
          onSubmit={async (data) => {
            try {
              console.log('Submitting reel data:', data);
              const result = await reelsAPI.add(data);
              console.log('Reel add result:', result);
              
              if (!result) {
                throw new Error('Failed to add reel - no data returned');
              }
              
              toast.success('Reel added successfully!');
              setShowReelForm(false);
              
              // Wait a moment for database to update, then reload
              setTimeout(() => {
                loadData();
              }, 500);
            } catch (error) {
              console.error('Error in reel submit:', error);
              toast.error('Failed to add reel. Please check console for details.');
            }
          }}
        />
      )}

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <TestimonialForm
          onClose={() => setShowTestimonialForm(false)}
          onSubmit={async (data) => {
            try {
              console.log('Submitting testimonial data:', data);
              const result = await testimonialsAPI.add(data);
              console.log('Testimonial add result:', result);
              
              if (!result) {
                throw new Error('Failed to add testimonial - no data returned');
              }
              
              toast.success('Testimonial added successfully!');
              setShowTestimonialForm(false);
              
              // Wait a moment for database to update, then reload
              setTimeout(() => {
                loadData();
              }, 500);
            } catch (error) {
              console.error('Error in testimonial submit:', error);
              toast.error('Failed to add testimonial. Please check console for details.');
            }
          }}
        />
      )}
    </div>
  );
}