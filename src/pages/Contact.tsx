import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle, ArrowRight, Sparkles, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const infoCards = [
    { icon: MapPin, title: 'Visit Our Showroom', value: 'Wardha Road, Nagpur', sub: 'Maharashtra 440012', color: 'from-amber-500/20' },
    { icon: Phone, title: 'Call Us', value: '+91 98765 43210', sub: '+91 712 456 7890', color: 'from-emerald-500/20' },
    { icon: Mail, title: 'Email Us', value: 'concierge@velocity.in', sub: 'sales@velocity.in', color: 'from-blue-500/20' },
    { icon: Clock, title: 'Working Hours', value: 'Mon–Sat: 10AM–8PM', sub: 'Sunday: By Appointment', color: 'from-purple-500/20' },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero Header */}
      <section className="section-padding py-20 md:py-28 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/3 rounded-full blur-[120px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">Get in Touch</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-5 leading-tight">
              Let's Start a
              <br />
              <span className="gold-text">Conversation</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Our dedicated concierge team is ready to help you find the perfect supercar. 
              Reach out and experience the Velocity difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-padding -mt-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-6 text-center hover:border-primary/30 transition-all duration-500"
            >
              <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-display text-sm font-semibold mb-2">{item.title}</h4>
                <p className="text-foreground text-sm font-medium">{item.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map Section */}
      <section className="section-padding py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm p-8">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Send a Message</h3>
                  <p className="text-xs text-muted-foreground">We typically respond within 2 hours</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm mb-6">Our team will get back to you shortly.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs">
                      <Clock className="w-3 h-3" /> Expected response: Within 2 hours
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
                        { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
                      ].map(field => (
                        <div key={field.key} className="relative">
                          <label className={`block text-xs mb-1.5 uppercase tracking-wider transition-colors ${focusedField === field.key ? 'text-primary' : 'text-muted-foreground'}`}>
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            value={(form as any)[field.key]}
                            onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                            onFocus={() => setFocusedField(field.key)}
                            onBlur={() => setFocusedField(null)}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all duration-300"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <label className={`block text-xs mb-1.5 uppercase tracking-wider transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className={`block text-xs mb-1.5 uppercase tracking-wider transition-colors ${focusedField === 'subject' ? 'text-primary' : 'text-muted-foreground'}`}>
                        Subject
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className={`block text-xs mb-1.5 uppercase tracking-wider transition-colors ${focusedField === 'message' ? 'text-primary' : 'text-muted-foreground'}`}>
                        Message
                      </label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell us about your dream car..."
                        rows={4}
                        className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none resize-none transition-all duration-300"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-xl inline-flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
                    >
                      <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> Send Message
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right column: Map + Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl border border-border/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                title="Velocity showroom - Nagpur"
              />
            </div>

            {/* Showroom Details */}
            <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm p-6">
              <div className="absolute top-0 left-0 w-1 h-full gold-gradient" />
              <h4 className="font-display text-base font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Showroom Details
              </h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div>
                    <p className="text-sm font-medium">Velocity Supercars Pvt. Ltd.</p>
                    <p className="text-muted-foreground text-sm">Wardha Road, Near Zero Mile</p>
                    <p className="text-muted-foreground text-sm">Nagpur, Maharashtra 440012</p>
                  </div>
                </div>
                <div className="border-t border-border/30 pt-3">
                  <p className="text-sm font-medium mb-1">Business Hours</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Mon–Sat</span>
                      <span className="text-foreground">10AM–8PM</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sunday</span>
                      <span className="text-foreground">By Appt.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book a Viewing CTA */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 text-center group hover:border-primary/40 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-px gold-gradient" />
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <p className="font-display text-base font-semibold mb-1">Book a Private Viewing</p>
              <p className="text-muted-foreground text-sm mb-4">
                Schedule an exclusive one-on-one session at our showroom
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 gold-gradient text-primary-foreground rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                View Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="section-padding py-14 border-t border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center relative z-10">
          {[
            { icon: Shield, label: 'Secure Communication' },
            { icon: Clock, label: '2hr Response Time' },
            { icon: CheckCircle, label: 'Verified Dealer' },
          ].map((badge, i) => (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <badge.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground tracking-wider uppercase">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
