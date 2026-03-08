import { motion } from 'framer-motion';
import { Shield, Zap, Award, Users, Target, Gem, MapPin, Phone, Globe, Heart, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '@/assets/hero-car.jpg';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const About = () => {
  const timeline = [
    { year: '2018', title: 'Founded in Nagpur', desc: 'Velocity was born from a passion for automotive excellence in the heart of India.', icon: '🚀' },
    { year: '2019', title: 'First 100 Deliveries', desc: 'Reached milestone of 100 luxury vehicles delivered across India.', icon: '🏎️' },
    { year: '2021', title: 'Expanded Nationwide', desc: 'Opened showrooms in Mumbai, Delhi, Bangalore, and Hyderabad.', icon: '🌍' },
    { year: '2023', title: 'Digital Showroom Launch', desc: 'Launched India\'s most premium online supercar experience.', icon: '💻' },
    { year: '2024', title: '40+ Models', desc: 'Expanded collection to 40+ exclusive supercar models from 7 brands.', icon: '👑' },
  ];

  const team = [
    { name: 'Arjun Mehta', role: 'Founder & CEO', desc: 'Former racing enthusiast with 15+ years in luxury automotive.', initials: 'AM' },
    { name: 'Priya Deshmukh', role: 'Head of Sales', desc: 'Curates the finest collection of supercars for our clientele.', initials: 'PD' },
    { name: 'Vikram Joshi', role: 'Chief Technician', desc: 'Certified by Ferrari, Lamborghini, and Porsche for inspections.', initials: 'VJ' },
  ];

  const values = [
    { icon: Gem, title: 'Exclusivity', desc: 'Access to the rarest and most coveted supercars in the world.', accent: 'from-amber-500/20 to-transparent' },
    { icon: Shield, title: 'Trust & Authenticity', desc: 'Every vehicle verified, authenticated, and guaranteed with full provenance.', accent: 'from-blue-500/20 to-transparent' },
    { icon: Heart, title: 'Passion', desc: 'We are enthusiasts first. Every car we sell, we would drive ourselves.', accent: 'from-red-500/20 to-transparent' },
    { icon: Target, title: 'Precision', desc: 'Meticulous attention to every detail of your buying experience.', accent: 'from-emerald-500/20 to-transparent' },
    { icon: Globe, title: 'Global Reach', desc: 'Sourcing from authorized dealers worldwide to find your perfect car.', accent: 'from-purple-500/20 to-transparent' },
    { icon: Users, title: 'Community', desc: 'Join our exclusive club of 2,500+ supercar owners across India.', accent: 'from-cyan-500/20 to-transparent' },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Cinematic Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
        <img src={heroImg} alt="Showroom" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />

        {/* Decorative lines */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30" />

        <div className="relative z-10 section-padding pb-16 md:pb-20 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-3xl">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '3rem' }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-1 gold-gradient rounded-full mb-6"
            />
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 font-medium">Est. 2018 • Nagpur, India</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-5 leading-[1.1]">
              The Pursuit of
              <br />
              <span className="gold-text">Automotive Perfection</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed">
              India's most exclusive supercar destination. Where engineering artistry meets uncompromising luxury.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative -mt-1 z-20">
        <div className="section-padding">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { value: '40+', label: 'Car Models', icon: '⚡' },
                { value: '7', label: 'Luxury Brands', icon: '🏆' },
                { value: '2,500+', label: 'Happy Clients', icon: '❤️' },
                { value: '₹500Cr+', label: 'Cars Delivered', icon: '🚀' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="glass-panel p-5 md:p-6 text-center group hover:border-primary/20 transition-all duration-300"
                >
                  <span className="text-xl block mb-1">{stat.icon}</span>
                  <p className="font-display text-2xl md:text-3xl gold-text mb-0.5 group-hover:scale-110 transition-transform">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision + Story */}
      <section className="section-padding py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 rounded-full gold-gradient" />
              <div>
                <p className="text-primary text-xs tracking-[0.3em] uppercase font-medium">Our Vision</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold">Redefining Luxury</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed mb-5">
              Velocity is India's premier supercar destination, headquartered in Nagpur, curating the world's most exclusive automobiles for discerning enthusiasts.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              We believe every drive should be extraordinary, every vehicle a masterpiece, and every client an honored guest. From our showroom in the heart of central India, we deliver supercars to enthusiasts nationwide.
            </p>

            <div className="space-y-3">
              {['Authorized multi-brand dealership', 'Full vehicle provenance & history', 'Dedicated concierge service', 'Nationwide delivery'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/30">
              <img src={heroImg} alt="Velocity showroom" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-primary text-xs tracking-[0.2em] uppercase mb-1">Nagpur Flagship</p>
                <p className="font-display text-lg font-bold">30,000 sq. ft. Showroom</p>
                <p className="text-muted-foreground text-sm">Wardha Road, Nagpur</p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-primary/20 rounded-br-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">Core Values</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold">What Drives Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-7 hover:border-primary/30 transition-all duration-500"
              >
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${v.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.3em] uppercase font-medium mb-3">Leadership</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">Meet the Experts</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">The passionate minds behind India's premier supercar experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-8 text-center hover:border-primary/30 transition-all duration-500"
              >
                {/* Gradient background on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative mx-auto w-20 h-20 mb-5">
                  <div className="w-full h-full rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-display text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-xs uppercase tracking-[0.15em] mb-3 font-medium">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.3em] uppercase font-medium mb-3">Our Journey</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Milestones</h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-primary/50 md:-translate-x-px" />

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className={`relative flex items-center mb-10 last:mb-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-32px)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className="glass-panel p-5 hover:border-primary/20 transition-colors group">
                      <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-display text-lg gold-text font-bold">{item.year}</span>
                      </div>
                      <h3 className="font-display text-base font-semibold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full gold-gradient -translate-x-1/2 border-4 border-background z-10" />

                  {/* Spacer for opposite side (desktop only) */}
                  <div className="hidden md:block md:w-[calc(50%-32px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-padding py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary text-xs tracking-[0.3em] uppercase font-medium mb-3">Visit Us</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Our Showroom</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 glass-panel overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                title="Velocity showroom - Nagpur"
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {[
                { icon: MapPin, title: 'Address', lines: ['Velocity Supercars Pvt. Ltd.', 'Wardha Road, Nagpur', 'Maharashtra 440012, India'] },
                { icon: Phone, title: 'Contact', lines: ['+91 98765 43210', 'concierge@velocity.in'] },
                { icon: Award, title: 'Certifications', lines: ['ISO 9001 Certified', 'Authorized Multi-Brand Dealer'] },
              ].map((item) => (
                <div key={item.title} className="glass-panel p-5 flex gap-4 hover:border-primary/20 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold mb-1">{item.title}</h4>
                    {item.lines.map(line => <p key={line} className="text-muted-foreground text-sm">{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-padding py-14 border-t border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {[
            { icon: Award, label: 'ISO 9001 Certified' },
            { icon: Shield, label: 'Authorized Dealer' },
            { icon: Users, label: '2,500+ Happy Clients' },
            { icon: Zap, label: 'Premium After-Sales' },
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

      {/* CTA */}
      <section className="section-padding py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience <span className="gold-text">Velocity</span>?
          </h2>
          <p className="text-muted-foreground mb-8">Visit our showroom or browse our collection online to find your dream supercar.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-primary-foreground rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all">
              Browse Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary/30 rounded-xl font-semibold text-sm text-primary hover:bg-primary/5 transition-all">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
