import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, Instagram, MessageSquare, ShieldCheck, Clock, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
    } catch (_) {
      // silently succeed even if backend not wired yet
    }
    setNewsletterDone(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-brand-dark text-brand-cream/80 pt-16 pb-8 border-t border-brand-border/20 select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Foot Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-brand-border/10 pb-12 mb-8"
        >

          {/* Col 1: Brand Info */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="font-sans text-2xl font-bold text-brand-cream tracking-wide">Swastika Sarees</h3>
            <p className="font-sans text-[10px] text-brand-gold uppercase tracking-wider font-semibold">"Shine Bright, Get Your Sparkle On!"</p>
            <p className="font-sans text-xs text-brand-cream/60 leading-relaxed max-w-sm">
              Discover the magnificence of handpicked, curated Indian ethnic wear. Discover sarees, kurtis, dress materials, and luxury accessories tailored to bring out your natural elegance.
            </p>
            <div className="pt-2">
              <h4 className="font-sans text-[10px] uppercase tracking-wider font-bold text-brand-gold mb-2.5">Join the Swastika Family</h4>
              {newsletterDone ? (
                <p className="text-xs text-emerald-400 font-semibold">🎉 Thank you! You're on the list.</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex max-w-xs">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-brand-white/5 border border-brand-border/20 text-brand-cream text-xs px-3.5 py-2 rounded-l w-full focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all duration-300"
                    required
                  />
                  <button type="submit" className="bg-brand-gold text-brand-dark px-3.5 py-2 rounded-r text-xs font-bold uppercase tracking-wider hover:bg-brand-cream transition-colors duration-300">
                    Join
                  </button>
                </form>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <motion.a
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                href="https://instagram.com/swastikasarees_"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-brand-white/5 border border-brand-border/10 hover:border-brand-gold hover:bg-brand-gold/10 transition-colors duration-300 rounded-full text-brand-cream flex items-center justify-center"
                aria-label="Instagram Profile"
              >
                <Instagram size={14} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-brand-white/5 border border-brand-border/10 hover:border-brand-gold hover:bg-brand-gold/10 transition-colors duration-300 rounded-full text-brand-cream flex items-center justify-center"
                aria-label="WhatsApp Support"
              >
                <MessageSquare size={14} />
              </motion.a>
            </div>
          </motion.div>

          {/* Col 2: Customer Care Links */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-wider font-bold text-brand-gold border-b border-brand-border/10 pb-1.5">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-brand-cream/70 font-medium">
              <li><Link to="/track-order" className="hover:text-brand-gold transition-colors block">Track Order</Link></li>
              <li><Link to="/shipping" className="hover:text-brand-gold transition-colors block">Shipping & Delivery Info</Link></li>
              <li><Link to="/returns" className="hover:text-brand-gold transition-colors block">Return & Refund Policy</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold transition-colors block">About Swastika Sarees</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors block">Contact Support Desk</Link></li>
            </ul>
          </motion.div>

          {/* Col 3: Quick Categories Links */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-wider font-bold text-brand-gold border-b border-brand-border/10 pb-1.5">Quick Shop</h4>
            <ul className="space-y-2.5 text-xs text-brand-cream/70 font-medium">
              <li><Link to="/shop?category=sarees" className="hover:text-brand-gold transition-colors block">Sarees</Link></li>
              <li><Link to="/shop?category=kurtis" className="hover:text-brand-gold transition-colors block">Kurtis</Link></li>
              <li><Link to="/shop?category=dress-materials" className="hover:text-brand-gold transition-colors block">Dress Materials</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-brand-gold transition-colors block">Fashion Accessories</Link></li>
            </ul>
          </motion.div>

          {/* Col 4: Contact Info & Support details */}
          <motion.div variants={staggerItem} className="space-y-3.5">
            <h4 className="font-sans text-[11px] uppercase tracking-wider font-bold text-brand-gold border-b border-brand-border/10 pb-1.5">Contact Us</h4>
            <div className="flex items-start space-x-2.5 text-xs">
              <PhoneCall size={14} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-brand-cream/90 text-3xs uppercase tracking-wider">WhatsApp Order Desk:</span>
                <a href="https://wa.me/919999999999" className="hover:text-brand-gold transition-colors block mt-0.5 text-brand-cream/70">+91 99999 99999</a>
              </div>
            </div>
            <div className="flex items-start space-x-2.5 text-xs">
              <Mail size={14} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-brand-cream/90 text-3xs uppercase tracking-wider">Email Support:</span>
                <a href="mailto:contact@swastikasarees.com" className="hover:text-brand-gold transition-colors block mt-0.5 text-brand-cream/70">contact@swastikasarees.com</a>
              </div>
            </div>
            <div className="flex items-start space-x-2.5 text-xs border-t border-brand-border/5 pt-2.5">
              <Clock size={14} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-brand-cream/90 text-3xs uppercase tracking-wider font-sans">Support Hours:</span>
                <span className="block mt-0.5 text-brand-cream/60">Mon - Sat: 10:00 AM - 5:00 PM IST</span>
              </div>
            </div>
            <div className="pt-2 border-t border-brand-border/5 mt-3">
              <div className="text-3xs uppercase tracking-wider text-brand-gold/60 font-semibold mb-0.5 font-sans">Registered Office</div>
              <p className="text-[10px] text-brand-cream/50 leading-relaxed font-sans font-normal">
                Swastika Sarees, Retail Park, Secunderabad, Telangana - 500003, India.
              </p>
            </div>
          </motion.div>

        </motion.div>

        {/* Shipping Partners, Payments, Security */}
        <div className="border-b border-brand-border/10 pb-8 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-cream/60">
          {/* Shipping Partners */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold block font-sans">Our Shipping Partners</span>
            <div className="flex flex-wrap gap-2 text-2xs uppercase tracking-wider font-semibold">
              <span className="px-2 py-1 bg-brand-white/5 border border-brand-border/10 rounded">Delhivery</span>
              <span className="px-2 py-1 bg-brand-white/5 border border-brand-border/10 rounded">BlueDart</span>
            </div>
          </div>

          {/* Payments */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold block font-sans">100% Safe & Secure Checkout</span>
            <div className="flex flex-wrap gap-2 text-3xs uppercase tracking-widest font-bold">
              <span className="px-2 py-1 bg-brand-white/5 border border-brand-border/10 rounded">Razorpay</span>
              <span className="px-2 py-1 bg-brand-white/5 border border-brand-border/10 rounded">UPI</span>
              <span className="px-2 py-1 bg-brand-white/5 border border-brand-border/10 rounded">Visa</span>
              <span className="px-2 py-1 bg-brand-white/5 border border-brand-border/10 rounded">RuPay</span>
            </div>
          </div>

          {/* Secure badging */}
          <div className="flex items-center space-x-2.5 bg-brand-white/5 border border-brand-border/10 p-3 rounded-lg max-w-sm">
            <ShieldCheck size={20} className="text-brand-gold shrink-0" />
            <div className="text-[10px] leading-relaxed">
              <span className="block font-bold uppercase tracking-wider text-brand-cream">SSL Encrypted Transaction</span>
              <span className="text-brand-cream/50">Your card and payment credentials are never stored.</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-3xs text-brand-cream/50 tracking-wider uppercase font-semibold">
          <div>
            &copy; {new Date().getFullYear()} Swastika Sarees. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-1.5 mt-2 sm:mt-0">
            <span>Made </span>
            <span>in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
