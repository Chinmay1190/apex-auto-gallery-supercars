import { motion } from 'framer-motion';
import { Shield, Zap, Award, Users, Target, Gem, MapPin, Phone, Globe, Heart } from 'lucide-react';
import heroImg from '@/assets/hero-car.jpg';

const About = () => {
  const timeline = [
    { year: '2018', title: 'Founded in Nagpur', desc: 'Velocity was born from a passion for automotive excellence in the heart of India.' },
    { year: '2019', title: 'First 100 Deliveries', desc: 'Reached milestone of 100 luxury vehicles delivered across India.' },
    { year: '2021', title: 'Expanded Nationwide', desc: 'Opened showrooms in Mumbai, Delhi, Bangalore, and Hyderabad.' },
    { year: '2023', title: 'Digital Showroom Launch', desc: 'Launched India\'s most premium online supercar experience.' },
    { year: '2024', title: '40+ Models', desc: 'Expanded collection to 40+ exclusive supercar models from 7 brands.' },
  ];

  const team = [
    { name: 'Arjun Mehta', role: 'Founder & CEO', desc: 'Former racing enthusiast with 15+ years in luxury automotive.' },
    { name: 'Priya Deshmukh', role: 'Head of Sales', desc: 'Curates the finest collection of supercars for our clientele.' },
    { name: 'Vikram Joshi', role: 'Chief Technician', desc: 'Certified by Ferrari, Lamborghini, and Porsche for inspections.' },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Showroom" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            About <span className="gold-text">Velocity</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">India's premier luxury supercar destination, based in Nagpur</p>
        </motion.div>
      </section>

      {/* Vision */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Vision</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Redefining Luxury Automotive in India</h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              Velocity is India's premier supercar destination, headquartered in Nagpur, curating the world's most exclusive automobiles for discerning enthusiasts.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              We believe every drive should be extraordinary, every vehicle a masterpiece, and every client an honored guest. From our showroom in the heart of central India, we deliver supercars to enthusiasts nationwide.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 gap-4">
            {[
              { value: '40+', label: 'Car Models' },
              { value: '7', label: 'Luxury Brands' },
              { value: '2,500+', label: 'Happy Clients' },
              { value: '₹500Cr+', label: 'Cars Delivered' },
            ].map((stat, i) => (
              <div key={stat.label} className="glass-panel p-5 text-center">
                <p className="font-display text-2xl gold-text mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding py-16 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Values</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">What Drives Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Gem, title: 'Exclusivity', desc: 'Access to the rarest and most coveted supercars in the world.' },
              { icon: Shield, title: 'Trust & Authenticity', desc: 'Every vehicle verified, authenticated, and guaranteed with full provenance.' },
              { icon: Heart, title: 'Passion', desc: 'We are enthusiasts first. Every car we sell, we would drive ourselves.' },
              { icon: Target, title: 'Precision', desc: 'Meticulous attention to every detail of your buying experience.' },
              { icon: Globe, title: 'Global Reach', desc: 'Sourcing from authorized dealers worldwide to find your perfect car.' },
              { icon: Users, title: 'Community', desc: 'Join our exclusive club of 2,500+ supercar owners across India.' },
            ].map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel p-8 hover-lift group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Team</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Meet the Experts</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-panel p-6 text-center hover-lift">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4 text-primary-foreground font-display text-xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-display text-base mb-1">{member.name}</h3>
                <p className="text-primary text-xs uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding py-16 md:py-24 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Journey</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our Timeline</h2>
          </motion.div>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex gap-6">
                <div className="w-20 flex-shrink-0 text-right">
                  <span className="font-display text-lg gold-text">{item.year}</span>
                </div>
                <div className="relative pb-8 border-l border-border pl-6">
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full gold-gradient -translate-x-[7px]" />
                  <h3 className="font-display text-base mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-padding py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Visit Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our Showroom</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                title="Velocity showroom - Nagpur"
              />
            </div>
            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin, title: 'Address', lines: ['Velocity Supercars Pvt. Ltd.', 'Wardha Road, Nagpur', 'Maharashtra 440012, India'] },
                { icon: Phone, title: 'Contact', lines: ['+91 98765 43210', 'concierge@velocity.in'] },
                { icon: Award, title: 'Certifications', lines: ['ISO 9001 Certified', 'Authorized Multi-Brand Dealer'] },
              ].map((item) => (
                <div key={item.title} className="glass-panel p-5 flex gap-4">
                  <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-sm mb-1">{item.title}</h4>
                    {item.lines.map(line => <p key={line} className="text-muted-foreground text-sm">{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section-padding py-12 border-t border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Award, label: 'ISO 9001 Certified' },
            { icon: Shield, label: 'Authorized Dealer' },
            { icon: Users, label: '2,500+ Happy Clients' },
            { icon: Zap, label: 'Premium After-Sales' },
          ].map((badge, i) => (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <badge.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground tracking-wider uppercase">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
