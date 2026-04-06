import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Cookie, UserCheck, Mail, Database, Server, FileText, Sparkles } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const sections = [
  { icon: Database, title: 'Information We Collect', content: 'We collect personal information including your full name, email address, phone number, shipping address, and payment details when you create an account or make a purchase. We may also collect device information, browsing behavior, and interaction data to improve our services.', items: ['Name, email, and phone number', 'Shipping and billing addresses', 'Payment and transaction details', 'Device and browser information'] },
  { icon: Eye, title: 'How We Use Your Information', content: 'Your information enables us to deliver a seamless luxury experience. We use it to process orders, personalize recommendations, communicate important updates, and continuously improve our platform.', items: ['Order processing and fulfillment', 'Personalized car recommendations', 'Account management and support', 'Service improvements and analytics'] },
  { icon: Server, title: 'Data Storage & Retention', content: 'Your data is stored on secure, encrypted servers. We retain personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law.', items: ['AES-256 encryption at rest', 'Data retained per legal requirements', 'Automatic purge of inactive accounts after 3 years'] },
  { icon: Lock, title: 'Data Security', content: 'We employ industry-standard encryption, multi-factor authentication, and regular security audits to protect your personal data. All transactions are processed through secure, PCI-DSS compliant payment gateways.', items: ['TLS 1.3 for data in transit', 'PCI-DSS compliant payments', 'Regular penetration testing', 'SOC 2 Type II certified infrastructure'] },
  { icon: Cookie, title: 'Cookies & Tracking', content: 'We use essential cookies for site functionality and optional analytics cookies to understand browsing patterns. You have full control over cookie preferences through your browser settings or our cookie consent banner.', items: ['Essential cookies (required)', 'Analytics cookies (optional)', 'Preference cookies (optional)', 'No third-party advertising cookies'] },
  { icon: UserCheck, title: 'Your Rights', content: 'Under applicable data protection laws, you have comprehensive rights over your personal data. We are committed to honoring these rights promptly and transparently.', items: ['Right to access your data', 'Right to correct inaccuracies', 'Right to delete your data', 'Right to data portability', 'Right to withdraw consent'] },
  { icon: Mail, title: 'Contact Us', content: 'For any privacy-related inquiries, data requests, or concerns, our dedicated privacy team is here to assist you. We aim to respond to all requests within 48 hours.', items: ['Email: privacy@velocity.in', 'Phone: +91 98765 43210', 'Address: Velocity Supercars, Wardha Road, Nagpur, Maharashtra 440012'] },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen pt-20 md:pt-24">
    {/* Hero */}
    <section className="section-padding py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
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
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">Your Privacy Matters</span>
          </motion.div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Privacy <span className="gold-text">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.
          </p>
          <p className="text-muted-foreground/60 text-sm mt-4">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>

    {/* Trust Badges */}
    <section className="section-padding -mt-4">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
        {[
          { icon: Lock, label: 'AES-256 Encrypted' },
          { icon: Shield, label: 'GDPR Compliant' },
          { icon: FileText, label: 'PCI-DSS Certified' },
        ].map((badge, i) => (
          <motion.div key={badge.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
            className="glass-panel p-4 text-center group hover:border-primary/20 transition-all">
            <badge.icon className="w-5 h-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-muted-foreground tracking-wider uppercase">{badge.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Sections */}
    <section className="section-padding py-16 md:py-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-7 hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute top-0 left-0 w-1 h-full gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{section.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{section.content}</p>
                {section.items && (
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default PrivacyPolicy;
