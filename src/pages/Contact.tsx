import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="section-padding py-12 md:py-16 border-b border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Get in Touch</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">Our concierge team is ready to assist you.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-4">
              <h3 className="font-display text-lg mb-4">Send a Message</h3>
              {[
                { key: 'name', label: 'Name', type: 'text', placeholder: 'Your Name' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
                { key: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your dream car..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none transition-colors"
                  required
                />
              </div>
              <button type="submit" className="w-full py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-lg inline-flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
              {sent && <p className="text-center text-primary text-sm">✓ Message sent successfully!</p>}
            </form>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {[
              { icon: MapPin, title: 'Showroom', lines: ['Velocity Supercars', 'Worli Sea Face Road', 'Mumbai, Maharashtra 400018'] },
              { icon: Phone, title: 'Phone', lines: ['+91 98765 43210', '+91 22 4567 8900'] },
              { icon: Mail, title: 'Email', lines: ['concierge@velocity.in', 'sales@velocity.in'] },
              { icon: Clock, title: 'Hours', lines: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: By Appointment Only'] },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 flex gap-4"
              >
                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm mb-1">{item.title}</h4>
                  {item.lines.map(line => <p key={line} className="text-muted-foreground text-sm">{line}</p>)}
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className="glass-panel overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.023!2d72.815!3d18.986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU5JzEwLjIiTiA3MsKwNDgnNTQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
                loading="lazy"
                title="Velocity showroom location"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
