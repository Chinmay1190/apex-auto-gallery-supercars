import { motion } from 'framer-motion';
import {
  Shield, Zap, Award, Users, Target, Gem, MapPin, Phone, Globe, Heart,
  ArrowRight, Star, CheckCircle2, Quote, Sparkles, TrendingUp, Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '@/assets/hero-car.jpg';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const About = () => {
  const timeline = [
    { year: '2018', title: 'Founded in Nagpur', desc: 'Velocity was born from a singular obsession — supercars deserve concierge-grade ownership in India.', icon: Sparkles },
    { year: '2020', title: 'Multi-brand Authorisation', desc: 'Secured authorised partnerships with seven of the world\'s most prestigious marques.', icon: Award },
    { year: '2022', title: '1,000 Deliveries', desc: 'Crossed one thousand vehicles handed over — every single one with provenance documented.', icon: Trophy },
    { year: '2024', title: 'Digital Showroom', desc: 'Launched India\'s most refined online supercar configurator, viewable from any device.', icon: Globe },
    { year: '2026', title: '1,500+ Models', desc: 'Curated the largest verified supercar inventory in the country across 38 brands.', icon: TrendingUp },
  ];

  const team = [
    { name: 'Chinmay Pinglee', role: 'Founder & CEO', desc: 'Engineer-turned-collector. Believes provenance is the only honest luxury.', initials: 'CP' },
    { name: 'Priya Deshmukh', role: 'Head of Concierge', desc: 'Curates the buying journey — from first call to first ignition.', initials: 'PD' },
    { name: 'Vikram Joshi', role: 'Chief Technician', desc: 'Certified by Ferrari, Lamborghini and Porsche for pre-delivery inspections.', initials: 'VJ' },
  ];

  const values = [
    { icon: Gem, title: 'Exclusivity', desc: 'Access to the rarest, the limited, the unrepeatable. We don\'t do common.', accent: 'from-amber-400/15' },
    { icon: Shield, title: 'Provenance', desc: 'Every vehicle authenticated and documented — history is part of the price.', accent: 'from-sky-400/15' },
    { icon: Heart, title: 'Passion', desc: 'We\'re enthusiasts first. Every car we list, we would drive ourselves.', accent: 'from-rose-400/15' },
    { icon: Target, title: 'Precision', desc: 'Meticulous attention to every detail — from PDI to white-glove delivery.', accent: 'from-emerald-400/15' },
    { icon: Globe, title: 'Global Reach', desc: 'Sourcing from authorised channels worldwide to match your spec exactly.', accent: 'from-violet-400/15' },
    { icon: Users, title: 'The Club', desc: 'Join 2,500+ owners across India — track days, drives, owner-only events.', accent: 'from-cyan-400/15' },
  ];

  const press = ['AUTOCAR INDIA', 'EVO MAGAZINE', 'OVERDRIVE', 'TOP GEAR INDIA', 'CARANDBIKE', 'FORBES INDIA'];

  return (
    <div className="min-h-screen pt-20 md:pt-24 overflow-hidden">
      {/* ───────── Cinematic Hero ───────── */}
      <section className="relative h-[78vh] md:h-[88vh] flex items-end overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent" />

        {/* Sweep */}
        <motion.div
          initial={{ x: '-110%' }}
          animate={{ x: '110%' }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 bottom-0 w-[35%] bg-gradient-to-r from-transparent via-primary/[0.05] to-transparent skew-x-12"
        />

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/40" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/40" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/40" />

        <div className="relative z-10 section-padding pb-20 md:pb-28 w-full">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '4rem' }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-[3px] gold-gradient rounded-full mb-7"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-primary text-xs md:text-sm tracking-[0.4em] uppercase mb-5 font-medium"
            >
              Est. 2018 · Nagpur · India
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-display text-5xl md:text-8xl font-bold mb-7 leading-[0.95]"
            >
              The pursuit<br />
              of <span className="gold-text italic">extraordinary</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-muted-foreground text-base md:text-xl max-w-2xl leading-relaxed"
            >
              India's most exclusive supercar destination. Where engineering artistry,
              uncompromising luxury, and the romance of speed converge under one roof.
            </motion.p>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60"
        >
          Scroll
        </motion.div>
      </section>

      {/* ───────── Stats ribbon ───────── */}
      <section className="relative -mt-12 z-20">
        <div className="section-padding">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
            >
              {[
                { value: '1,500+', label: 'Curated Models' },
                { value: '38', label: 'Premium Brands' },
                { value: '2,500+', label: 'Owners Club' },
                { value: '₹2,000Cr+', label: 'Vehicles Delivered' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 md:p-7 group hover:border-primary/30 transition-all duration-500"
                >
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <p className="font-display text-3xl md:text-4xl gold-text font-bold mb-1 group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── Founder quote ───────── */}
      <section className="section-padding py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Quote className="w-10 h-10 text-primary/40 mx-auto mb-6" />
          <p className="font-display text-2xl md:text-4xl leading-[1.35] mb-8 text-foreground/90 italic">
            "A supercar isn't a transaction — it's a relationship. We exist to make that
            relationship <span className="gold-text not-italic font-bold">honest</span>,{' '}
            <span className="gold-text not-italic font-bold">unhurried</span> and{' '}
            <span className="gold-text not-italic font-bold">unforgettable</span>."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-display text-xs font-bold">
              CP
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Chinmay Pinglee</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Founder & CEO</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───────── Vision + Showroom ───────── */}
      <section className="section-padding py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 rounded-full gold-gradient" />
              <div>
                <p className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium">Our Vision</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">Redefining Luxury</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed mb-5">
              Velocity is India's premier supercar destination, headquartered in Nagpur,
              curating the world's most exclusive automobiles for discerning enthusiasts.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              We believe every drive should be extraordinary, every vehicle a masterpiece,
              and every client an honoured guest. From central India, we deliver supercars
              and bespoke ownership experiences nationwide.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {[
                'Authorised multi-brand dealership',
                'Full provenance & service history',
                'Dedicated concierge — one point of contact',
                'Nationwide white-glove delivery',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
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
            <div className="relative rounded-3xl overflow-hidden border border-border/40 group">
              <img src={heroImg} alt="Velocity showroom" className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/60 backdrop-blur-md border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-semibold">Flagship</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-2">Nagpur · Wardha Road</p>
                <p className="font-display text-2xl font-bold mb-1">30,000 sq. ft.</p>
                <p className="text-muted-foreground text-sm">Climate-controlled · Display floor · Private viewing suites</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-28 h-28 border-r-2 border-b-2 border-primary/30 rounded-br-3xl" />
            <div className="absolute -top-3 -left-3 w-28 h-28 border-l-2 border-t-2 border-primary/30 rounded-tl-3xl" />
          </motion.div>
        </div>
      </section>

      {/* ───────── Values ───────── */}
      <section className="section-padding py-20 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Star className="w-3 h-3 text-primary" />
              <span className="text-primary text-[10px] tracking-[0.3em] uppercase font-medium">Core Values</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">What drives us</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all duration-500"
              >
                <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br ${v.accent} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-3xl`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-300">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Team ───────── */}
      <section className="section-padding py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium mb-3">Leadership</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">Meet the experts</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">The passionate minds behind India's premier supercar experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-8 text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full gold-gradient blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative w-full h-full rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-display text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-[10px] uppercase tracking-[0.25em] mb-3 font-medium">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Timeline ───────── */}
      <section className="section-padding py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/40 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium mb-3">Our Journey</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Milestones</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0 md:-translate-x-px" />

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className={`relative flex items-center mb-10 last:mb-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-32px)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-6 hover:border-primary/40 transition-colors group">
                      <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-display text-xl gold-text font-bold">{item.year}</span>
                      </div>
                      <h3 className="font-display text-base font-semibold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full gold-gradient -translate-x-1/2 border-4 border-background z-10 shadow-[0_0_12px_hsl(var(--gold)/0.5)]" />
                  <div className="hidden md:block md:w-[calc(50%-32px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Press strip ───────── */}
      <section className="section-padding py-12 border-y border-border/20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-60">
            {press.map(p => (
              <span key={p} className="font-display text-sm tracking-[0.25em] text-foreground/70 hover:text-primary transition-colors cursor-default">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Location ───────── */}
      <section className="section-padding py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase font-medium mb-3">Visit Us</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Our flagship</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-border/40">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="380"
                style={{ border: 0, filter: 'grayscale(60%) contrast(1.05)' }}
                loading="lazy"
                title="Velocity showroom - Nagpur"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {[
                { icon: MapPin, title: 'Address', lines: ['Velocity Supercars Pvt. Ltd.', 'Wardha Road, Nagpur', 'Maharashtra 440012, India'] },
                { icon: Phone, title: 'Contact', lines: ['+91 98765 43210', 'concierge@velocity.in'] },
                { icon: Award, title: 'Certifications', lines: ['ISO 9001 Certified', 'Authorised Multi-Brand Dealer'] },
              ].map((item) => (
                <div key={item.title} className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 flex gap-4 hover:border-primary/30 transition-colors group">
                  <div className="absolute top-0 left-0 w-1 h-full gold-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold mb-1.5 tracking-wider uppercase">{item.title}</h4>
                    {item.lines.map(line => <p key={line} className="text-muted-foreground text-sm leading-relaxed">{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Trust strip ───────── */}
      <section className="section-padding py-14 border-t border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent" />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {[
            { icon: Award, label: 'ISO 9001' },
            { icon: Shield, label: 'Authorised Dealer' },
            { icon: Users, label: '2,500+ Owners' },
            { icon: Zap, label: 'White-glove Service' },
          ].map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <badge.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="section-padding py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-5" />
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">
            Ready to experience<br />
            <span className="gold-text">Velocity</span>?
          </h2>
          <p className="text-muted-foreground mb-9 text-base">
            Visit our flagship in Nagpur, or explore the collection from anywhere.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-primary-foreground rounded-xl font-semibold text-sm tracking-wider uppercase hover:shadow-[0_10px_40px_-10px_hsl(var(--gold)/0.5)] hover:-translate-y-0.5 transition-all"
            >
              Browse Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary/40 rounded-xl font-semibold text-sm tracking-wider uppercase text-primary hover:bg-primary/10 hover:border-primary transition-all"
            >
              Talk to a Concierge
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
