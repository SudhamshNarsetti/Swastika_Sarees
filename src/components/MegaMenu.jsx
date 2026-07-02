/**
 * MegaMenu.jsx
 * 
 * Premium 4-column Mega Menu for Swastika Sarees desktop navigation.
 * Designed to be reusable — pass `config` prop to customize per nav item.
 * 
 * Columns:
 *   1. Shop Categories  (dynamic from API + static fallback)
 *   2. Shop by Occasion (static config)
 *   3. Featured Collection Cards (×2, from config)
 *   4. Large Promo Banner (from config)
 * 
 * Visibility is controlled via opacity/transform/visibility CSS transitions
 * (not display:none) so GPU-accelerated animations work smoothly.
 * The element is always in the DOM on desktop — invisible when isOpen=false.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/* Fallback category links shown when no API categories have loaded yet */
const DEFAULT_CATEGORIES = [
  { label: 'Shop All', link: '/shop' },
  { label: 'Silk Sarees', link: '/shop?subcategory=silk-sarees' },
  { label: 'Cotton Sarees', link: '/shop?subcategory=cotton-sarees' },
  { label: 'Banarasi Sarees', link: '/shop?subcategory=banarasi-sarees' },
  { label: 'Kanjivaram Sarees', link: '/shop?subcategory=kanjivaram' },
  { label: 'Organza Sarees', link: '/shop?subcategory=organza' },
  { label: 'Linen Sarees', link: '/shop?subcategory=linen' },
  { label: 'Chiffon Sarees', link: '/shop?subcategory=chiffon' },
  { label: 'Georgette Sarees', link: '/shop?subcategory=georgette' },
];

/* ─────────────────────────── Sub-components ─────────────────────────── */

/** Animated nav link with underline slide + arrow slide micro-interaction */
function MenuLink({ to, children, bold = false }) {
  return (
    <Link
      to={to}
      role="menuitem"
      className={`group flex items-center justify-between py-[7px] pr-1 text-sm transition-colors duration-200 ${
        bold
          ? 'font-bold text-brand-crimson hover:text-brand-gold text-xs uppercase tracking-widest'
          : 'font-medium text-brand-dark hover:text-brand-crimson'
      }`}
    >
      <span className="relative leading-none">
        {children}
        {/* Underline slide animation */}
        <span className="absolute -bottom-px left-0 w-0 h-px bg-brand-crimson group-hover:w-full transition-all duration-300 ease-out" />
      </span>
      <ArrowRight
        size={11}
        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-brand-crimson shrink-0 ml-1"
      />
    </Link>
  );
}

/** Section heading with gold gradient rule */
function ColHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h3 className="font-display text-brand-dark text-sm font-bold tracking-wide whitespace-nowrap">
        {children}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-brand-gold/60 to-transparent" />
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */

const containerVariants = {
  open: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { staggerChildren: 0.07, delayChildren: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  closed: {
    opacity: 0,
    y: -5,
    filter: 'blur(5px)',
    transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.3, ease: 'easeIn' }
  }
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  closed: { opacity: 0, y: 15, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function MegaMenu({ isOpen, categories, config, onMouseEnter, onMouseLeave }) {
  return (
    <>
      {/* The Mega Panel — always in DOM on md+, controlled via Framer Motion */}
      <motion.div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        className={`
          absolute left-0 right-0 top-full z-40
          hidden lg:block
        `}
                  style={{ pointerEvents: isOpen ? 'auto' : 'none', visibility: isOpen ? 'visible' : 'hidden' }}
        role="navigation"
        aria-label="Shop categories mega menu"
        aria-hidden={!isOpen}
      >
        {/* Invisible bridge — fills any pixel gap between header bottom and panel top.
            Without this, fast mouse movement from Shop trigger downward can briefly
            leave both the trigger AND the panel, causing a flicker. */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" aria-hidden="true" />

        {/* Gold accent top border */}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

        {/* Main white panel */}
        <div className="w-full bg-[#FFFCF8] shadow-2xl shadow-brand-dark/10 border-b border-brand-border/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-10">

            {/* 4-column grid */}
            <div className="grid grid-cols-[minmax(180px,1fr)_minmax(200px,1fr)_minmax(240px,1.3fr)_minmax(220px,1.3fr)] divide-x divide-brand-border/25 min-h-[380px]">

              {/* ══ Col 1: Shop Categories ══ */}
              <motion.div variants={itemVariants} className="pr-8">
                <ColHeading>Shop Categories</ColHeading>

                <ul className="space-y-0" role="menu" aria-label="Product categories">
                  {/* "Shop All" always first */}
                  <li role="none">
                    <MenuLink to="/shop" bold>Shop All</MenuLink>
                  </li>

                  {/* Divider */}
                  <li className="py-1" aria-hidden>
                    <div className="h-px w-full bg-brand-border/40" />
                  </li>

                  {/* Dynamic categories from API */}
                  {categories.length > 0
                    ? categories.map((cat) => (
                        <React.Fragment key={cat._id}>
                          <li role="none">
                            <MenuLink to={`/shop?category=${cat.slug}`}>
                              {cat.name}
                            </MenuLink>
                          </li>
                          {/* Show first 3 sub-categories as indented links */}
                          {cat.subCategories?.slice(0, 3).map((sub, i) => (
                            <li key={i} role="none">
                              <Link
                                to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                                role="menuitem"
                                className="group flex items-center gap-2 py-[5px] pl-3.5 text-xs text-brand-muted hover:text-brand-crimson transition-colors duration-200"
                              >
                                <span className="w-1 h-1 rounded-full bg-brand-gold/50 group-hover:bg-brand-crimson transition-colors duration-200 shrink-0" />
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </React.Fragment>
                      ))
                    : /* Fallback static list when API hasn't loaded */
                      DEFAULT_CATEGORIES.slice(1).map((cat, i) => (
                        <li key={i} role="none">
                          <MenuLink to={cat.link}>{cat.label}</MenuLink>
                        </li>
                      ))
                  }
                </ul>
              </motion.div>

              {/* ══ Col 2: Shop by Occasion ══ */}
              <motion.div variants={itemVariants} className="px-8">
                <ColHeading>Shop by Occasion</ColHeading>

                <ul className="space-y-0" role="menu" aria-label="Shop by occasion">
                  {config.occasions.map((occ, i) => (
                    <li key={i} role="none">
                      <MenuLink to={occ.link}>{occ.label}</MenuLink>
                    </li>
                  ))}
                </ul>

                {/* Bottom accent — track order */}
                <div className="mt-6 pt-4 border-t border-brand-border/30">
                  <Link
                    to="/track-order"
                    className="flex items-center gap-2 text-[10px] font-bold text-brand-gold hover:text-brand-crimson transition-colors uppercase tracking-widest group"
                  >
                    <span className="text-sm">📦</span>
                    <span>Track My Order</span>
                    <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </div>
              </motion.div>

              {/* ══ Col 3: Featured Collection Cards ══ */}
              <motion.div variants={itemVariants} className="px-8">
                <ColHeading>Featured Collections</ColHeading>

                <div className="space-y-4">
                  {config.featuredCards.map((card, i) => (
                    <Link
                      key={i}
                      to={card.link}
                      className="group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Card image */}
                      <div className="aspect-[16/8] overflow-hidden bg-brand-border/20">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
                      {/* Card text */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="font-display text-brand-cream text-sm font-bold leading-snug">
                          {card.title}
                        </p>
                        <p className="text-brand-cream/70 text-[10px] mt-0.5 font-sans leading-relaxed">
                          {card.description}
                        </p>
                        <div className="mt-1.5 inline-flex items-center gap-1 text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                          Shop Now <ArrowRight size={9} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* ══ Col 4: Large Promo Banner ══ */}
              <motion.div variants={itemVariants} className="pl-8">
                <ColHeading>Exclusive Picks</ColHeading>

                <Link
                  to={config.banner.link}
                  className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                  style={{ height: '310px' }}
                >
                  {/* Banner image with Ken Burns zoom */}
                  <img
                    src={config.banner.image}
                    alt={config.banner.heading}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />

                  {/* Multi-layer dark overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/45 to-brand-dark/5" />

                  {/* Gold top shimmer accent */}
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-brand-gold/15 to-transparent pointer-events-none" />

                  {/* Banner content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="font-sans text-brand-gold text-[9px] font-bold uppercase tracking-[0.18em] mb-1.5">
                      ✦ Exclusive Collection ✦
                    </span>
                    <h4 className="font-display text-brand-cream text-[1.35rem] font-bold leading-snug italic">
                      {config.banner.heading}
                    </h4>
                    <p className="text-brand-cream/65 text-xs font-sans mt-1.5 leading-relaxed max-w-[190px]">
                      {config.banner.subtext}
                    </p>
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1.5 bg-brand-crimson text-brand-cream px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-brand-gold/25 group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                        Shop Now <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>

            </div>
          </div>

          {/* Bottom trust strip */}
          <div className="border-t border-brand-border/25 bg-brand-cream/40 py-2.5 px-6 lg:px-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8 text-[10px] text-brand-muted font-sans tracking-wide">
                <span>🚚 Free shipping on orders above ₹999</span>
                <span className="hidden lg:inline">🔒 100% Secure Payments</span>
                <span className="hidden lg:inline">💬 WhatsApp Support Available</span>
              </div>
              <Link
                to="/shop"
                className="text-[10px] font-bold text-brand-crimson hover:text-brand-gold transition-colors uppercase tracking-widest flex items-center gap-1 group"
              >
                Full Collection
                <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
