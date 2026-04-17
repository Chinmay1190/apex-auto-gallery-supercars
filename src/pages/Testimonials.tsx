import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Award, Users, ThumbsUp, Shield, MessageSquarePlus, Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { brands } from '@/data/cars';

const testimonials = [
  {
    id: 1, name: 'Rajesh Mehta', location: 'Mumbai, India', role: 'Tech Entrepreneur',
    car: 'Lamborghini Aventador SVJ', brand: 'Lamborghini', rating: 5,
    text: 'The entire experience at Velocity was nothing short of extraordinary. From the first consultation to the moment I received my Aventador, every detail was handled with precision and care. The team understood exactly what I was looking for.',
    avatar: 'RM', date: 'February 2026'
  },
  {
    id: 2, name: 'Priya Sharma', location: 'Delhi, India', role: 'Film Producer',
    car: 'Ferrari SF90 Stradale', brand: 'Ferrari', rating: 5,
    text: 'Velocity made my dream of owning a Ferrari come true. Their white-glove service, transparent pricing, and attention to detail set them apart from every other dealer I\'ve visited. I felt valued as a client from day one.',
    avatar: 'PS', date: 'January 2026'
  },
  {
    id: 3, name: 'Arjun Kapoor', location: 'Bangalore, India', role: 'Venture Capitalist',
    car: 'Rolls-Royce Ghost Black Badge', brand: 'Rolls-Royce', rating: 5,
    text: 'Purchasing my Ghost through Velocity was a seamless experience. The team\'s knowledge of the brand and their ability to source exactly the specification I wanted was impressive. True professionals.',
    avatar: 'AK', date: 'December 2025'
  },
  {
    id: 4, name: 'Neha Gupta', location: 'Hyderabad, India', role: 'CEO, Gupta Industries',
    car: 'Porsche 911 Turbo S', brand: 'Porsche', rating: 5,
    text: 'I\'ve purchased three cars from Velocity now, and each time the experience has been exceptional. Their after-sales support is unmatched — they truly care about building long-term relationships.',
    avatar: 'NG', date: 'November 2025'
  },
  {
    id: 5, name: 'Vikram Singh', location: 'Jaipur, India', role: 'Hotelier',
    car: 'Bugatti Chiron Super Sport', brand: 'Bugatti', rating: 5,
    text: 'When you\'re spending this kind of money, you expect perfection. Velocity delivered beyond my expectations. The private viewing, the detailed walkthrough, the personalized delivery — every moment was curated.',
    avatar: 'VS', date: 'October 2025'
  },
  {
    id: 6, name: 'Ananya Reddy', location: 'Chennai, India', role: 'Fashion Designer',
    car: 'McLaren 720S', brand: 'McLaren', rating: 5,
    text: 'As a first-time supercar buyer, I was nervous about the process. The Velocity team made it effortless. They guided me through every option and helped me find the perfect spec. Absolutely recommend.',
    avatar: 'AR', date: 'September 2025'
  },
];

const stats = [
  { icon: Users, value: '2,500+', label: 'Happy Clients' },
  { icon: Award, value: '98%', label: 'Satisfaction Rate' },
  { icon: ThumbsUp, value: '4.9/5', label: 'Average Rating' },
  { icon: Shield, value: '15+', label: 'Years of Trust' },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => { setDirection(1); setActiveIndex((i) => (i + 1) % testimonials.length); };
  const prev = () => { setDirection(-1); setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length); };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs tracking-[0.2em] uppercase mb-6">
              Client Stories
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              What Our <span className="text-primary">Clients</span> Say
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Every car we deliver comes with a story. Here's what our distinguished clients have to say about their Velocity experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <s.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Testimonial Carousel */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
        <div className="relative">
          <div className="absolute -top-8 left-8 text-primary/10">
            <Quote className="w-24 h-24" />
          </div>
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 min-h-[320px] flex flex-col justify-center relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={activeIndex} custom={direction} variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}>
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 font-light italic">
                  "{testimonials[activeIndex].text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonials[activeIndex].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[activeIndex].role} · {testimonials[activeIndex].location}</div>
                  </div>
                  <div className="ml-auto hidden md:block">
                    <span className="text-xs text-primary/80 border border-primary/20 rounded-full px-3 py-1">
                      {testimonials[activeIndex].car}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="p-3 rounded-full border border-border/50 bg-card/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />
              ))}
            </div>
            <button onClick={next} className="p-3 rounded-full border border-border/50 bg-card/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* All Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          More <span className="text-primary">Reviews</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-500">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6 line-clamp-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t.car}</span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-10 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to Write Your Story?</h3>
          <p className="text-muted-foreground mb-6">Join our community of distinguished supercar owners.</p>
          <a href="/shop" className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Explore Collection
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Testimonials;
