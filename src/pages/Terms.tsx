import { motion } from 'framer-motion';

const Terms = () => (
  <div className="min-h-screen pt-20 md:pt-24">
    <section className="section-padding py-12 md:py-16 border-b border-border/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>
    <section className="section-padding py-12">
      <div className="max-w-3xl mx-auto">
        {[
          { title: 'Acceptance of Terms', content: 'By accessing and using Velocity\'s website and services, you agree to be bound by these terms and conditions.' },
          { title: 'Products & Pricing', content: 'All prices are listed in Indian Rupees (₹) and include applicable taxes as specified. Prices are subject to change without notice. Vehicle availability is subject to confirmation.' },
          { title: 'Orders & Payment', content: 'An order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment is required in full before delivery unless financing arrangements have been made.' },
          { title: 'Delivery', content: 'Delivery timelines are estimates only. Velocity is not liable for delays caused by circumstances beyond our control. All deliveries are made via enclosed transport.' },
          { title: 'Returns & Refunds', content: 'Vehicles may be returned within 7 days of delivery in original condition. Refunds are processed within 10 business days. Custom orders are non-refundable.' },
          { title: 'Limitation of Liability', content: 'Velocity\'s liability is limited to the purchase price of the vehicle. We are not liable for indirect, consequential, or incidental damages.' },
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

export default Terms;
