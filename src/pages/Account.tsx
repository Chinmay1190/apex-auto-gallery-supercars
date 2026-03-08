import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Heart, ShoppingBag, Package, Edit2, Save, X, MapPin, Phone, Mail, Calendar, Shield, Crown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/data/cars';
import { toast } from 'sonner';

const Account = () => {
  const { user, profile, logout, isAuthenticated, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

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
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        .then(({ data }) => { if (data) setOrders(data); });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (e) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" />
    </div>
  );
  if (!isAuthenticated) return null;

  const initials = (profile?.full_name || user?.email || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />

        <div className="section-padding py-10 md:py-14 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl gold-gradient flex items-center justify-center gold-glow">
                  <span className="font-display text-3xl md:text-4xl text-primary-foreground font-bold">{initials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-3 border-background flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-display text-2xl md:text-3xl font-bold">{profile?.full_name || user?.email?.split('@')[0]}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-semibold gold-gradient text-primary-foreground flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Member
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {memberSince && (
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {memberSince}</span>
                  )}
                  {profile?.city && profile?.state && (
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.city}, {profile.state}</span>
                  )}
                  {profile?.phone && (
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="section-padding -mt-2">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
          {[
            { to: '/orders', icon: Package, value: orders.length, label: 'Orders', color: 'text-primary' },
            { to: '/wishlist', icon: Heart, value: '—', label: 'Wishlist', color: 'text-accent' },
            { to: '/cart', icon: ShoppingBag, value: '—', label: 'Cart', color: 'text-primary' },
          ].map((s, i) => (
            <Link key={i} to={s.to}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-5 hover:border-primary/30 transition-all group cursor-pointer text-center">
                <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <div className="font-display text-xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="section-padding mt-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 p-1 rounded-xl bg-secondary/50 w-fit mb-8">
            {(['profile', 'orders'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}>
                {tab === 'profile' ? 'Profile' : `Orders (${orders.length})`}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (() => {
            const fields = [
              { key: 'full_name', label: 'Full Name', icon: User, placeholder: 'Enter your full name' },
              { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+91 98765 43210' },
              { key: 'address', label: 'Street Address', icon: MapPin, placeholder: 'House no, Street, Landmark' },
              { key: 'city', label: 'City', icon: MapPin, placeholder: 'e.g. Mumbai' },
              { key: 'state', label: 'State', icon: MapPin, placeholder: 'e.g. Maharashtra' },
              { key: 'pincode', label: 'PIN Code', icon: Mail, placeholder: 'e.g. 400001' },
            ];
            const filledCount = fields.filter(f => !!(form as any)[f.key]?.trim()).length;
            const completionPct = Math.round((filledCount / fields.length) * 100);

            return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Profile Completion Banner */}
              {completionPct < 100 && (
                <div className="glass-panel p-5 border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">Profile Completion</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{completionPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full gold-gradient rounded-full" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Complete your profile to get a personalized experience. {fields.length - filledCount} field{fields.length - filledCount > 1 ? 's' : ''} remaining.</p>
                </div>
              )}

              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Personal Information</h3>
                    <p className="text-xs text-muted-foreground mt-1">Manage your personal details and shipping address</p>
                  </div>
                  {editing ? (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(false); if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '', address: profile.address || '', city: profile.city || '', state: profile.state || '', pincode: profile.pincode || '' }); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 gold-gradient text-primary-foreground rounded-lg text-xs font-semibold disabled:opacity-50">
                        <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {fields.map(f => {
                      const val = (form as any)[f.key];
                      return (
                        <div key={f.key}>
                          <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">{f.label}</label>
                          <div className="relative">
                            <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              value={val}
                              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {fields.map((f, i) => {
                      const val = (profile as any)?.[f.key];
                      const isFilled = !!val?.trim();
                      return (
                        <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl transition-colors ${isFilled ? 'bg-secondary/30' : 'bg-destructive/5 border border-dashed border-destructive/20'}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isFilled ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                            <f.icon className={`w-4 h-4 ${isFilled ? 'text-primary' : 'text-destructive/50'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                            {isFilled ? (
                              <p className="text-sm font-medium text-foreground truncate">{val}</p>
                            ) : (
                              <p className="text-sm text-destructive/60 italic">Not provided</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Full Address Summary */}
                {!editing && (profile?.address || profile?.city || profile?.state || profile?.pincode) && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipping Address</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {[profile?.address, profile?.city, profile?.state, profile?.pincode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Account Security */}
              <div className="glass-panel p-6 md:p-8">
                <h3 className="font-display text-lg font-semibold mb-1">Account Security</h3>
                <p className="text-xs text-muted-foreground mb-4">Your account credentials and verification status</p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">Primary email address</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-green-500/15 text-green-500">
                    Verified
                  </span>
                </div>
              </div>
            </motion.div>
            );
          })()}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order, i) => (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}>
                      <Link to={`/orders/${order.id}`}
                        className="flex items-center justify-between p-5 glass-panel hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Order #{order.order_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-display gold-text font-semibold">{formatPrice(order.total)}</p>
                            <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              order.status === 'delivered' ? 'bg-green-500/15 text-green-500' :
                              order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400' :
                              'bg-primary/15 text-primary'
                            }`}>{order.status}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  <div className="text-center pt-4">
                    <Link to="/orders" className="text-primary text-sm hover:underline">View All Orders →</Link>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-lg mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground text-sm mb-6">Start exploring our exclusive collection.</p>
                  <Link to="/shop" className="inline-flex px-6 py-2.5 gold-gradient text-primary-foreground rounded-xl text-sm font-semibold">
                    Browse Collection
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default Account;