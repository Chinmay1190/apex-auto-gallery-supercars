import { motion } from 'framer-motion';
import { Shield, Zap, Award, Users, Target, Gem } from 'lucide-react';
import heroImg from '@/assets/hero-car.jpg';

const About = () => {
  const timeline = [
    { year: '2018', title: 'Founded in Mumbai', desc: 'Velocity was born from a passion for automotive excellence.' },
    { year: '2019', title: 'First 100 Deliveries', desc: 'Reached milestone of 100 luxury vehicles delivered across India.' },
    { year: '2021', title: 'Expanded Nationwide', desc: 'Opened showrooms in Delhi, Bangalore, and Hyderabad.' },
    { year: '2024', title: 'Digital Showroom Launch', desc: 'Launched India\'s most premium online supercar experience.' },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Showroom" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Story</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">About Velocity</h1>
        </motion.div>
      </section>

      {/* Vision */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Vision</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Redefining Luxury Automotive</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Velocity is India's premier supercar destination, curating the world's most exclusive automobiles for discerning enthusiasts.
              We believe every drive should be extraordinary, every vehicle a masterpiece, and every client an honored guest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding py-16 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Gem, title: 'Exclusivity', desc: 'Access to the rarest and most coveted supercars in the world.' },
            { icon: Shield, title: 'Trust', desc: 'Every vehicle verified, authenticated, and guaranteed.' },
            { icon: Target, title: 'Precision', desc: 'Meticulous attention to every detail of your experience.' },
          ].map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-panel p-8 text-center hover-lift">
              <v.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Journey</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our Timeline</h2>
          </motion.div>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
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

      {/* Trust */}
      <section className="section-padding py-12 border-t border-border/30">
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
