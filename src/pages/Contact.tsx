import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="section-padding py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-5">
              Contact <span className="gold-text">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our dedicated concierge team in Nagpur is ready to assist you with anything you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-padding -mt-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, title: 'Showroom', value: 'Wardha Road, Nagpur', sub: 'Maharashtra 440012' },
            { icon: Phone, title: 'Phone', value: '+91 98765 43210', sub: '+91 712 456 7890' },
            { icon: Mail, title: 'Email', value: 'concierge@velocity.in', sub: 'sales@velocity.in' },
            { icon: Clock, title: 'Hours', value: 'Mon–Sat: 10AM–8PM', sub: 'Sunday: By Appointment' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 text-center hover-lift group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-display text-sm mb-1">{item.title}</h4>
              <p className="text-foreground text-sm font-medium">{item.value}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-panel p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg">Send a Message</h3>
                  <p className="text-xs text-muted-foreground">We'll get back within 24 hours</p>
                </div>
              </div>

              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">Our team will reach out to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'Name', type: 'text', placeholder: 'Your Name' },
                      { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">{field.label}</label>
                        <input
                          type={field.type}
                          value={(form as any)[field.key]}
                          onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your dream car..."
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none resize-none transition-all"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-xl inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass-panel overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                title="Velocity showroom - Nagpur"
              />
            </div>

            <div className="glass-panel p-6">
              <h4 className="font-display text-sm tracking-wider uppercase mb-4">Showroom Details</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Velocity Supercars Pvt. Ltd.</p>
                    <p className="text-muted-foreground text-sm">Wardha Road, Near Zero Mile</p>
                    <p className="text-muted-foreground text-sm">Nagpur, Maharashtra 440012</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-muted-foreground text-sm">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                    <p className="text-muted-foreground text-sm">Sunday: By Appointment Only</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 text-center">
              <p className="text-primary text-xs tracking-[0.2em] uppercase mb-2">Book a Private Viewing</p>
              <p className="text-muted-foreground text-sm">
                Schedule an exclusive one-on-one session at our Nagpur showroom
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
