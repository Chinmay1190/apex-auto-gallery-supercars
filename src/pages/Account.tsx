import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Heart, ShoppingBag, Clock, Package, Settings, Edit2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/data/cars';

const Account = () => {
  const { user, profile, logout, isAuthenticated, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/auth');
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
        .then(({ data }) => { if (data) setOrders(data); });
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile(form);
    setEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile Card */}
            <div className="glass-panel p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl">{profile?.full_name || user?.email?.split('@')[0]}</h1>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 gold-gradient text-primary-foreground rounded-lg text-sm font-semibold">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  ) : (
                    <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  )}
                </div>
              </div>

              {editing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { key: 'full_name', label: 'Full Name' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'address', label: 'Address' },
                    { key: 'city', label: 'City' },
                    { key: 'state', label: 'State' },
                    { key: 'pincode', label: 'PIN Code' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">{f.label}</label>
                      <input
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { to: '/wishlist', icon: Heart, label: 'Wishlist', desc: 'Saved cars' },
                { to: '/cart', icon: ShoppingBag, label: 'Cart', desc: 'Current items' },
                { to: '/orders', icon: Package, label: 'Orders', desc: 'Track orders' },
                { to: '/shop', icon: Clock, label: 'Browse', desc: 'Explore collection' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="glass-panel p-6 hover-lift text-center">
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-sm mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Link>
              ))}
            </div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg">Recent Orders</h3>
                  <Link to="/orders" className="text-primary text-sm hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                  {orders.map(order => (
                    <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium">#{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm gold-text font-display">{formatPrice(order.total)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-primary/20 text-primary'
                        }`}>{order.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;
