import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle, ArrowRight,
  Sparkles, Shield, Headphones, Calendar, ChevronRight, Instagram, Twitter, Youtube, Linkedin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '@/assets/hero-car.jpg';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: 'General', message: '' });
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 6000);
    setForm({ name: '', email: '', phone: '', interest: 'General', message: '' });
  };

  const channels = [
    { icon: Phone, label: 'Call concierge', value: '+91 98765 43210', sub: 'Mon–Sat, 10AM–8PM IST', accent: 'from-amber-400/15' },
    { icon: Mail, label: 'Write to us', value: 'concierge@velocity.in', sub: 'Replies within 2 hours', accent: 'from-emerald-400/15' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+91 712 456 7890', sub: 'Fastest response channel', accent: 'from-sky-400/15' },
    { icon: Calendar, label: 'Book a viewing', value: 'Schedule private visit', sub: 'Nagpur flagship showroom', accent: 'from-rose-400/15' },
  ];

  const interests = ['General', 'Test Drive', 'Purchase Enquiry', 'Trade-in', 'Concierge Service'];

  const hourIST = (time.getUTCHours() + 5.5) % 24;
  const isOpen = hourIST >= 10 && hourIST < 20;

  return (
    <div className="min-h-screen pt-20 md:pt-24 overflow-hidden">
      {/* ───────── Cinematic Hero ───────── */}
      <section className="relative h-[68vh] md:h-[78vh] flex items-end overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent" />

        {/* sweep light */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent skew-x-12"
        />

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-14 h-14 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-8 right-8 w-14 h-14 border-r-2 border-t-2 border-primary/40" />

        <div className="relative z-10 section-padding pb-14 md:pb-20 w-full">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-end">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '3rem' }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="h-[3px] gold-gradient rounded-full mb-6"
              />
              <p className="text-primary text-xs md:text-sm tracking-[0.4em] uppercase font-medium mb-5">
                Velocity Concierge
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-[1.05]">
                A private line<br />
                <span className="gold-text">to your next</span> obsession.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed">
                Speak with our concierge team — a single point of contact for test drives,
                bespoke configurations, and confidential transactions.
              </p>
            </motion.div>

            {/* Live status card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative ml-auto max-w-sm glass-panel p-6 rounded-2xl backdrop-blur-xl border-primary/20">
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Concierge Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`relative flex w-2 h-2`}>
                      <span className={`absolute inset-0 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-amber-400'} animate-ping opacity-75`} />
                      <span className={`relative rounded-full w-2 h-2 ${isOpen ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    </span>
                    <span className="text-[11px] font-medium tracking-wider uppercase text-foreground">
                      {isOpen ? 'On Call' : 'Off Hours'}
                    </span>
                  </div>
                </div>
                <p className="font-display text-3xl gold-text mb-1">
                  {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
                <p className="text-xs text-muted-foreground mb-5">India Standard Time · Nagpur HQ</p>
                <div className="space-y-2 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Avg. response</span>
                    <span className="text-primary font-semibold">~ 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Active advisors</span>
                    <span className="text-primary font-semibold">6 online</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Languages</span>
                    <span className="text-foreground">EN · HI · MR</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── Channel rail ───────── */}
      <section className="section-padding -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channels.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-300">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">{c.label}</p>
                <p className="font-display text-base font-semibold text-foreground mb-1">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── Form + Showroom ───────── */}
      <section className="section-padding py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/80 via-card/40 to-card/20 backdrop-blur-xl p-8 md:p-10">
              {/* Decorative accents */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium">Concierge Enquiry</span>
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Start the conversation</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Tell us what you're searching for. A dedicated advisor will reach out within 2 working hours.
                </p>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-16"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                        className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_hsl(var(--gold)/0.4)]"
                      >
                        <CheckCircle className="w-10 h-10 text-primary-foreground" />
                      </motion.div>
                      <h3 className="font-display text-3xl font-bold mb-2">Message received</h3>
                      <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                        A Velocity concierge will reach out shortly. Keep your phone close — luxury moves fast.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                        <Clock className="w-3 h-3" /> Expected reply within 2 hours
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                          { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className={`block text-[10px] mb-1.5 uppercase tracking-[0.25em] transition-colors ${focus === field.key ? 'text-primary' : 'text-muted-foreground'}`}>
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              value={(form as any)[field.key]}
                              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                              onFocus={() => setFocus(field.key)}
                              onBlur={() => setFocus(null)}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3.5 bg-background/40 border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all duration-300"
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className={`block text-[10px] mb-1.5 uppercase tracking-[0.25em] transition-colors ${focus === 'email' ? 'text-primary' : 'text-muted-foreground'}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          onFocus={() => setFocus('email')}
                          onBlur={() => setFocus(null)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3.5 bg-background/40 border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all duration-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] mb-2 uppercase tracking-[0.25em] text-muted-foreground">
                          I'm interested in
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {interests.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setForm({ ...form, interest: opt })}
                              className={`px-3.5 py-2 rounded-lg text-xs border transition-all duration-200 ${
                                form.interest === opt
                                  ? 'border-primary bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--gold)/0.18)]'
                                  : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[10px] mb-1.5 uppercase tracking-[0.25em] transition-colors ${focus === 'message' ? 'text-primary' : 'text-muted-foreground'}`}>
                          Message
                        </label>
                        <textarea
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          onFocus={() => setFocus('message')}
                          onBlur={() => setFocus(null)}
                          placeholder="Share the model, configuration, timeline — anything that helps us help you."
                          rows={5}
                          className="w-full px-4 py-3.5 bg-background/40 border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none resize-none transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-[0.2em] uppercase rounded-xl inline-flex items-center justify-center gap-2 hover:shadow-[0_10px_40px_-10px_hsl(var(--gold)/0.5)] hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                          <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                          Send Enquiry
                        </button>
                        <p className="text-[10px] text-muted-foreground sm:max-w-[160px] tracking-wider uppercase text-center sm:text-left">
                          Encrypted · Never shared with third parties
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Showroom column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl border border-border/40 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="280"
                style={{ border: 0, filter: 'grayscale(60%) contrast(1.05)' }}
                loading="lazy"
                title="Velocity showroom - Nagpur"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-primary">Flagship</p>
                  <p className="text-sm font-display font-semibold">Nagpur · Maharashtra</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Wardha+Road+Nagpur"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] uppercase tracking-wider text-primary hover:underline"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>

            {/* Showroom card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6">
              <div className="absolute top-0 left-0 w-1 h-full gold-gradient" />
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <h4 className="font-display text-sm font-semibold tracking-wider uppercase">Velocity Flagship</h4>
              </div>
              <p className="text-sm text-foreground font-medium mb-1">Velocity Supercars Pvt. Ltd.</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Wardha Road, near Zero Mile<br />
                Nagpur, Maharashtra 440012
              </p>

              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-border/30">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Mon — Sat</p>
                  <p className="text-sm font-semibold">10AM — 8PM</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Sunday</p>
                  <p className="text-sm font-semibold">By Appointment</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 p-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700" />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <p className="font-display text-lg font-semibold mb-1">Book a private viewing</p>
                <p className="text-muted-foreground text-sm mb-5">
                  Reserve the entire showroom floor for an exclusive, unhurried session.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-primary-foreground rounded-xl text-xs font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Browse Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── Promise band ───────── */}
      <section className="section-padding py-14 border-y border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent" />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {[
            { icon: Shield, label: 'Confidential', sub: 'PCI-grade encryption' },
            { icon: Clock, label: '2-Hour Reply', sub: 'During business hours' },
            { icon: Headphones, label: 'Dedicated Advisor', sub: 'One point of contact' },
            { icon: CheckCircle, label: 'Verified Dealer', sub: 'Authorized multi-brand' },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-foreground">{b.label}</p>
                <p className="text-[10px] text-muted-foreground">{b.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── Social rail ───────── */}
      <section className="section-padding py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-3 font-medium">Follow the journey</p>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">Behind the wheel, in your feed</h3>
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: Instagram, label: 'Instagram' },
              { icon: Youtube, label: 'YouTube' },
              { icon: Twitter, label: 'X' },
              { icon: Linkedin, label: 'LinkedIn' },
            ].map(s => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-11 h-11 rounded-xl border border-border/40 bg-card/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
