import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle, ShoppingCart, Shield, CreditCard, Car, Wrench, Truck, RotateCcw, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Buying', value: 'buying' },
  { label: 'Payment', value: 'payment' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'After Sales', value: 'after' },
];

const faqs = [
  { q: 'How do I purchase a supercar from Velocity?', a: 'Browse our curated collection, add your dream car to the cart, and complete checkout. Our concierge team will contact you within 24 hours to arrange documentation, verification, and delivery logistics.', icon: ShoppingCart, cat: 'buying' },
  { q: 'Are all vehicles certified authentic?', a: 'Absolutely. Every vehicle undergoes a rigorous 200-point inspection conducted by brand-certified technicians. Each car comes with full provenance documentation, complete service history, and our authenticity guarantee.', icon: Shield, cat: 'buying' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards (Visa, Mastercard, Amex), net banking from all major banks, and digital wallets. For high-value purchases, direct wire transfers and demand drafts are also accepted.', icon: CreditCard, cat: 'payment' },
  { q: 'Do you offer financing options?', a: 'Yes! We partner with leading financial institutions including HDFC, ICICI, and Kotak to offer flexible financing and leasing options specifically tailored for luxury vehicle purchases with competitive interest rates.', icon: CreditCard, cat: 'payment' },
  { q: 'Can I schedule a test drive?', a: 'Of course! Visit our Contact page or call our concierge team to schedule a private test drive at our Nagpur flagship showroom, or we can arrange a doorstep experience at a location of your choice within select cities.', icon: Car, cat: 'buying' },
  { q: 'What warranty comes with the vehicles?', a: 'All vehicles include the applicable manufacturer warranty plus Velocity\'s comprehensive 2-year coverage plan, which includes 24/7 roadside assistance, scheduled maintenance reminders, and priority service appointments.', icon: Wrench, cat: 'after' },
  { q: 'Do you deliver nationwide?', a: 'Yes, we deliver across India. Your vehicle will be transported in a fully enclosed, climate-controlled carrier with real-time GPS tracking to ensure it arrives in pristine condition at your doorstep.', icon: Truck, cat: 'delivery' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return policy from the date of delivery. The vehicle must be in the same condition as delivered with no additional mileage beyond 100 km. Custom and bespoke orders are considered final sale.', icon: RotateCcw, cat: 'after' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? faqs : faqs.filter(f => f.cat === activeCategory);

  return (
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
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">Support</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-tight">
              Frequently Asked <span className="gold-text">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about buying, financing, and owning a supercar with Velocity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="section-padding -mt-6">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setActiveCategory(cat.value); setOpenIndex(null); }}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat.value
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-card/30 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((faq, i) => {
            const Icon = faq.icon;
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-xl border bg-card/30 backdrop-blur-sm transition-all duration-500 ${isOpen ? 'border-primary/30' : 'border-border/30 hover:border-primary/15'}`}
              >
                {isOpen && <div className="absolute top-0 left-0 w-1 h-full gold-gradient" />}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/15'}`}>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className={`text-sm font-medium pr-4 flex-1 transition-colors ${isOpen ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pl-[4.25rem] text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-8 text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-px gold-gradient" />
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Still Have Questions?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Our concierge team is available to answer any questions you may have about our vehicles or services.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 gold-gradient text-primary-foreground rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
