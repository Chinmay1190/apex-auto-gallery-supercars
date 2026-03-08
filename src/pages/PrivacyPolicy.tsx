import { motion } from 'framer-motion';

const PrivacyPolicy = () => (
  <div className="min-h-screen pt-20 md:pt-24">
    <section className="section-padding py-12 md:py-16 border-b border-border/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>
    <section className="section-padding py-12">
      <div className="max-w-3xl mx-auto prose prose-sm prose-invert">
        {[
          { title: 'Information We Collect', content: 'We collect personal information including name, email, phone number, shipping address, and payment details when you create an account or make a purchase.' },
          { title: 'How We Use Your Information', content: 'Your information is used to process orders, personalize your experience, communicate updates, and improve our services. We never sell your data to third parties.' },
          { title: 'Data Security', content: 'We employ industry-standard encryption and security measures to protect your personal data. All transactions are processed through secure, PCI-compliant payment gateways.' },
          { title: 'Cookies', content: 'We use cookies to enhance your browsing experience, remember preferences, and analyze site traffic. You can control cookie settings through your browser.' },
          { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@velocity.in for any data-related requests.' },
          { title: 'Contact', content: 'For privacy concerns, reach us at privacy@velocity.in or Velocity Supercars, Worli Sea Face Road, Mumbai, Maharashtra 400018.' },
        ].map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="font-display text-xl mb-3 text-foreground">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default PrivacyPolicy;
