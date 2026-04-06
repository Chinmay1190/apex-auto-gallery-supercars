import { motion } from 'framer-motion';
import { FileText, ShoppingBag, CreditCard, Truck, RotateCcw, AlertTriangle, Scale, Gavel, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

const sections = [
  { icon: FileText, title: 'Acceptance of Terms', content: 'By accessing and using Velocity\'s website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please refrain from using our platform.', highlights: ['Binding upon use of our website', 'Applies to all users and visitors', 'Subject to periodic updates'] },
  { icon: ShoppingBag, title: 'Products & Pricing', content: 'All prices are listed in Indian Rupees (₹) and include applicable taxes as specified. Vehicle availability, specifications, and pricing are subject to confirmation and may change without prior notice.', highlights: ['Prices in INR inclusive of GST', 'Availability subject to confirmation', 'Specifications may vary by model year'] },
  { icon: CreditCard, title: 'Orders & Payment', content: 'An order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment is required in full before delivery unless pre-approved financing arrangements have been made through our partner institutions.', highlights: ['Full payment before delivery', 'Financing available through partners', 'Order confirmation within 24 hours'] },
  { icon: Truck, title: 'Delivery & Shipping', content: 'Delivery timelines are estimates and may vary based on location and vehicle availability. All vehicles are transported in fully enclosed carriers to ensure pristine condition upon arrival. Velocity is not liable for delays caused by force majeure.', highlights: ['Nationwide enclosed transport', 'Real-time delivery tracking', 'Insurance covered during transit'] },
  { icon: RotateCcw, title: 'Returns & Refunds', content: 'Vehicles may be returned within 7 days of delivery provided they are in the same condition as delivered. Refunds are processed within 10 business days to the original payment method. Custom and bespoke orders are non-refundable.', highlights: ['7-day return window', 'Refund in 10 business days', 'Custom orders are final sale'] },
  { icon: Shield, title: 'Warranty & Guarantees', content: 'All vehicles sold by Velocity come with applicable manufacturer warranties. Additionally, Velocity provides a comprehensive 2-year coverage plan including roadside assistance and scheduled maintenance support.', highlights: ['Manufacturer warranty included', '2-year Velocity coverage plan', '24/7 roadside assistance'] },
  { icon: AlertTriangle, title: 'Limitation of Liability', content: 'Velocity\'s total liability shall not exceed the purchase price of the vehicle. We are not liable for any indirect, consequential, incidental, or punitive damages arising from the use of our services or products.', highlights: ['Liability limited to purchase price', 'No consequential damages', 'Force majeure clause applies'] },
  { icon: Gavel, title: 'Governing Law & Disputes', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Nagpur, Maharashtra. We encourage amicable resolution through our customer support before legal proceedings.', highlights: ['Governed by Indian law', 'Jurisdiction: Nagpur courts', 'Mediation encouraged first'] },
];

const Terms = () => (
  <div className="min-h-screen pt-20 md:pt-24">
    {/* Hero */}
    <section className="section-padding py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
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
            <Scale className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">Legal</span>
          </motion.div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Terms of <span className="gold-text">Service</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Please review these terms carefully before using our platform. Your use of Velocity constitutes acceptance of these conditions.
          </p>
          <p className="text-muted-foreground/60 text-sm mt-4">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>

    {/* Sections */}
    <section className="section-padding py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-5">
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
                <div className="flex flex-wrap gap-2">
                  {section.highlights.map((h, j) => (
                    <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default Terms;
