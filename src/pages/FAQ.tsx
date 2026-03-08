import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I purchase a supercar from Velocity?', a: 'Browse our collection, add your dream car to the cart, and complete checkout. Our concierge team will contact you within 24 hours to arrange documentation and delivery.' },
  { q: 'Are all vehicles certified authentic?', a: 'Yes. Every vehicle undergoes a rigorous 200-point inspection and comes with full provenance documentation, service history, and authenticity guarantee.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards (Visa, Mastercard, Amex), net banking from all major banks, and digital wallets. For high-value purchases, wire transfers are also accepted.' },
  { q: 'Do you offer financing options?', a: 'Yes, we partner with leading financial institutions to offer flexible financing and leasing options tailored to luxury vehicle purchases.' },
  { q: 'Can I schedule a test drive?', a: 'Absolutely! Visit our Contact page or call our concierge team to schedule a private test drive at our Mumbai showroom or at a location of your choice.' },
  { q: 'What warranty comes with the vehicles?', a: 'All vehicles come with a manufacturer warranty (if applicable) plus Velocity\'s comprehensive coverage for up to 2 years, including roadside assistance.' },
  { q: 'Do you deliver nationwide?', a: 'Yes, we deliver across India. Your vehicle will be transported in an enclosed carrier to ensure it arrives in pristine condition.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return policy from the date of delivery. The vehicle must be in the same condition as delivered. Terms and conditions apply.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="section-padding py-12 md:py-16 border-b border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Support</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">Everything you need to know about buying with Velocity.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-primary flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
