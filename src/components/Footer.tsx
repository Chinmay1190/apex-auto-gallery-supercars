import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/30 section-padding py-12 md:py-16">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
      <div>
        <h3 className="font-display text-xl gold-text tracking-[0.15em] mb-4">VELOCITY</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The world's most exclusive supercar showroom. Experience luxury, performance, and engineering excellence.
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm tracking-wider uppercase text-foreground mb-4">Explore</h4>
        <div className="flex flex-col gap-2">
          {[
            { to: '/shop', label: 'Collection' },
            { to: '/brands', label: 'Brands' },
            { to: '/categories', label: 'Categories' },
            { to: '/about', label: 'About Us' },
            { to: '/contact', label: 'Contact' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="text-muted-foreground text-sm hover:text-primary transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-display text-sm tracking-wider uppercase text-foreground mb-4">Services</h4>
        <div className="flex flex-col gap-2 text-muted-foreground text-sm">
          <span>Test Drive Booking</span><span>Custom Orders</span><span>Finance & Leasing</span><span>After-Sales Care</span>
        </div>
      </div>
      <div>
        <h4 className="font-display text-sm tracking-wider uppercase text-foreground mb-4">Contact</h4>
        <div className="flex flex-col gap-2 text-muted-foreground text-sm">
          <span>+91 98765 43210</span>
          <span>concierge@velocity.in</span>
          <span>Mumbai, Maharashtra, India</span>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-muted-foreground text-xs">© 2026 Velocity Supercars. All rights reserved.</p>
      <div className="flex gap-6 text-muted-foreground text-xs">
        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
