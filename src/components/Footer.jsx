import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, Instagram, MessageSquare, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream/80 pt-20 pb-10 border-t-2 border-brand-gold/30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Foot Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-brand-muted/20 pb-16 mb-10"
        >
          
          {/* Col 1: Brand Info */}
          <motion.div variants={staggerItem} className="space-y-5">
            <h3 className="font-display text-2xl font-bold text-brand-cream tracking-wide">Swastika Sarees</h3>
            <p className="font-sans text-xs italic text-brand-gold-light uppercase tracking-widest font-semibold">"Shine Bright, Get Your Sparkle On!"</p>
            <p className="font-sans text-xs text-brand-cream/65 leading-relaxed">
              Experience the magnificence of handpicked, curated Indian ethnic wear. Discover sarees, kurtis, dress materials, and luxury accessories tailored to bring out your natural elegance.
            </p>
            <div className="pt-4">
              <h4 className="font-display text-xs uppercase tracking-widest font-bold text-brand-gold mb-3">Newsletter</h4>
              <div className="flex relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-brand-white/5 border border-brand-border/20 text-brand-cream text-xs px-4 py-2.5 rounded-l w-full focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all duration-300 hover-glow"
                />
                <button className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-r text-xs font-bold uppercase tracking-wider hover:bg-brand-cream transition-colors duration-300 hover-glow">
                  Join
                </button>
              </div>
            </div>

            <div className="flex space-x-3.5 pt-4">
              <motion.a
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                href="https://instagram.com/swastikasarees_"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-transparent border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10 transition-colors duration-300 rounded-full text-brand-cream flex items-center justify-center hover-glow"
                aria-label="Instagram Profile"
              >
                <Instagram size={16} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-transparent border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10 transition-colors duration-300 rounded-full text-brand-cream flex items-center justify-center hover-glow"
                aria-label="WhatsApp Support"
              >
                <MessageSquare size={16} />
              </motion.a>
            </div>
          </motion.div>

          {/* Col 2: Customer Care Links */}
          <motion.div variants={staggerItem}>
            <h4 className="font-display text-xs uppercase tracking-widest font-bold text-brand-gold mb-6 border-b border-brand-border/10 pb-2.5">Customer Care</h4>
            <ul className="space-y-3.5 text-xs">
              <li><Link to="/track-order" className="hover:text-brand-gold transition-colors block py-0.5">Track Order</Link></li>
              <li><Link to="/shipping" className="hover:text-brand-gold transition-colors block py-0.5">Shipping & Delivery Info</Link></li>
              <li><Link to="/returns" className="hover:text-brand-gold transition-colors block py-0.5">Return & Refund Policy</Link></li>
              <li><Link to="/about" className="hover:text-brand-gold transition-colors block py-0.5">About Swastika Sarees</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors block py-0.5">Contact Support</Link></li>
            </ul>
          </motion.div>

          {/* Col 3: Quick Categories Links */}
          <motion.div variants={staggerItem}>
            <h4 className="font-display text-xs uppercase tracking-widest font-bold text-brand-gold mb-6 border-b border-brand-border/10 pb-2.5">Quick Shop</h4>
            <ul className="space-y-3.5 text-xs">
              <li><Link to="/shop?category=sarees" className="hover:text-brand-gold transition-colors block py-0.5">Sarees</Link></li>
              <li><Link to="/shop?category=kurtis" className="hover:text-brand-gold transition-colors block py-0.5">Kurtis</Link></li>
              <li><Link to="/shop?category=dress-materials" className="hover:text-brand-gold transition-colors block py-0.5">Dress Materials</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-brand-gold transition-colors block py-0.5">Fashion Accessories</Link></li>
              <li><Link to="/shop?sale=true" className="text-brand-gold-light hover:underline font-bold tracking-wider block py-0.5 uppercase text-[10px]">Clearance Sale</Link></li>
            </ul>
          </motion.div>

          {/* Col 4: Contact Info */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h4 className="font-display text-xs uppercase tracking-widest font-bold text-brand-gold mb-6 border-b border-brand-border/10 pb-2.5">Contact Us</h4>
            <div className="flex items-start space-x-3 text-xs">
              <PhoneCall size={16} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-brand-cream/90">WhatsApp Order Desk:</span>
                <a href="https://wa.me/919999999999" className="hover:text-brand-gold transition-colors block mt-0.5">+91 99999 99999</a>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-xs">
              <Mail size={16} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-brand-cream/90">Email Desk:</span>
                <a href="mailto:contact@swastikasarees.com" className="hover:text-brand-gold transition-colors block mt-0.5">contact@swastikasarees.com</a>
              </div>
            </div>
            <div className="pt-3 border-t border-brand-border/5 mt-4">
              <div className="text-[10px] uppercase tracking-wider text-brand-gold/60 font-bold mb-1">Registered Office</div>
              <p className="text-[11px] text-brand-cream/50 leading-relaxed font-sans">
                Swastika Sarees, Retail Park, Secunderabad, Telangana - 500003, India.
              </p>
            </div>
          </motion.div>

        </motion.div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-2xs text-brand-cream/50">
          <div>
            &copy; {new Date().getFullYear()} Swastika Sarees. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-1.5 mt-2.5 sm:mt-0 font-semibold tracking-wider uppercase text-[10px]">
            <span>Made with</span>
            <span className="text-brand-crimson animate-pulse text-xs">♥</span>
            <span>in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
