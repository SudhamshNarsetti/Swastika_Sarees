import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, ShieldCheck, Truck, RotateCcw, HelpCircle, Star, Heart, Instagram } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp, scaleUp, kenBurns, fadeScale, slideUpFade, blurReveal, slideInRight } from '../utils/animations';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState({ featured: [], bestsellers: [], newArrivals: [] });
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings
        const setRes = await fetch('/api/settings');
        if (setRes.ok) {
          const setData = await setRes.json();
          setSettings(setData);
        }

        // Fetch banners
        const banRes = await fetch('/api/banners');
        const banData = await banRes.json();
        setBanners(banData);

        // Fetch categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        setCategories(catData);

        // Fetch products collections
        const colRes = await fetch('/api/products/collections');
        const colData = await colRes.json();
        setCollections(colData);

        // Fetch approved reviews
        const revRes = await fetch('/api/reviews/all?approved=true');
        const revData = await revRes.json();
        setReviews(revData);
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll banner slides — runs after activeBanners is defined (see below)

  // Mock banners data if database collection is empty
  const activeBanners = banners.length > 0 ? banners : [
    {
      _id: 'banner1',
      title: 'Royal Banarasi Silk Collection',
      subtitle: 'Drape yourself in royal heritage. Crafted by master weavers of Varanasi.',
      ctaText: 'Explore Sarees',
      ctaLink: '/shop?category=sarees',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200'
    },
    {
      _id: 'banner2',
      title: 'Summer Chiffon & Georgette Kurtis',
      subtitle: 'Lightweight, vibrant, and elegant. Shine bright this festive season!',
      ctaText: 'Explore Kurtis',
      ctaLink: '/shop?category=kurtis',
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  // Mock categories if empty
  const activeCategories = categories.length > 0 ? categories : [
    { name: 'Sarees', slug: 'sarees', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300' },
    { name: 'Kurtis', slug: 'kurtis', imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=300' },
    { name: 'Dress Materials', slug: 'dress-materials', imageUrl: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=300' },
    { name: 'Accessories', slug: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1598530028795-0e68f863a8a3?auto=format&fit=crop&q=80&w=300' }
  ];

  // Mock reviews if empty
  const activeReviews = reviews.length > 0 ? reviews : [
    { customerName: 'Divya Reddy', rating: 5, comment: 'The Banarasi silk saree is absolutely gorgeous! The gold zari weave is so fine and luxurious. Shipping was so fast.', product: { name: 'Royal Banarasi Silk Saree' } },
    { customerName: 'Ananya Sharma', rating: 5, comment: 'Purchased a floral georgette kurti, the fitting is perfect and fabric is very lightweight and comfortable. Highly recommended!', product: { name: 'Floral Georgette Kurti' } },
    { customerName: 'Priya Patel', rating: 5, comment: 'Ordered dress material. The cotton fabric is thick and print is vibrant. Got matching accessories too, lovely customer service on WhatsApp.', product: { name: 'Handblock Print Cotton Suit' } }
  ];

  const handleNextBanner = () => {
    setActiveBannerIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrevBanner = () => {
    setActiveBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  // Auto-scroll: now correctly uses activeBanners (includes fallback mocks)
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Auto-scroll reviews carousel
  useEffect(() => {
    if (activeReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % activeReviews.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeReviews.length]);

  return (
    <div className="relative">

      {/* 1. HERO BANNER CAROUSEL (First section below header) */}
      <section className="relative h-[60vh] lg:h-[78vh] w-full overflow-hidden bg-brand-dark">
        {activeBanners.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeBannerIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Slide Background Image */}
            <motion.div
              initial="initial"
              animate={activeBannerIndex === index ? "animate" : "initial"}
              variants={kenBurns}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              {/* Soft dark overlay (20-30%) for high readability */}
              <div className="absolute inset-0 bg-black/40 z-10" />
            </motion.div>

            {/* Subtle Gold Shimmer particle animation layer */}
            <div className="absolute inset-0 gold-shimmer opacity-20 z-10 pointer-events-none" />

            {/* Text details overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20 text-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <AnimatePresence mode="wait">
                  {activeBannerIndex === index && (
                    <motion.div 
                      initial="initial"
                      animate="whileInView"
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                      variants={staggerContainer}
                      className="flex flex-col items-center justify-center text-center text-brand-cream space-y-6 max-w-2xl mx-auto"
                    >
                      <motion.h1 variants={fadeInUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md italic tracking-wide">
                        {slide.title}
                      </motion.h1>
                      <motion.p variants={fadeInUp} className="text-xs sm:text-sm md:text-base font-sans text-brand-cream/90 max-w-lg leading-relaxed tracking-wider uppercase">
                        {slide.subtitle}
                      </motion.p>
                      <motion.div variants={fadeInUp} className="pt-2">
                        <Link
                          to={slide.ctaLink}
                          className="inline-flex items-center space-x-2 bg-brand-crimson hover:bg-brand-muted text-brand-cream px-8 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-widest border border-brand-gold/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        ))}

        {/* Carousel controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrevBanner}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-brand-white/10 hover:bg-brand-white/20 text-brand-cream transition-colors duration-300"
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            <button
              onClick={handleNextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-brand-white/10 hover:bg-brand-white/20 text-brand-cream transition-colors duration-300"
              aria-label="Next slide"
            >
              &#10095;
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBannerIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeBannerIndex === i ? 'bg-brand-gold w-6' : 'bg-brand-cream/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 1.5 TRUST STRIP BAR (Slim Premium Strip) */}
      <section className="bg-brand-cream border-b border-brand-border/40 select-none py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-0 text-center items-center justify-center divide-y md:divide-y-0 md:divide-x divide-brand-border/30">
            <div className="flex items-center justify-center space-x-2 py-2 md:py-0 px-2">
              <span className="text-lg">🚚</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-dark/80">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-2 md:py-0 px-2">
              <span className="text-lg">🔄</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-dark/80">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-2 md:py-0 px-2">
              <span className="text-lg">🔒</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-dark/80">Secure Payments</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-2 md:py-0 px-2">
              <span className="text-lg">⭐</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-dark/80">Premium Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY GRID (Luxury layout) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeScale}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center select-none"
      >
        <h2 className="font-display text-3xl sm:text-4xl text-brand-dark tracking-wide font-bold uppercase">
          {settings?.homeCategoryHeading || 'Shop by Category'}
        </h2>
        <div className="luxury-divider" />
        <p className="text-sm text-brand-muted/80 max-w-lg mx-auto mb-12 leading-relaxed">
          {settings?.homeCategoryDescription || 'Handcrafted fabrics tailored for festive sparkle, weddings, daily charm, and special moments.'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {activeCategories.map((cat, i) => (
            <motion.div variants={scaleUp} key={i}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-500 border border-brand-border/20 block h-full"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute bottom-6 left-0 right-0 text-center flex flex-col items-center justify-center px-4">
                  <span className="font-display text-brand-cream text-lg sm:text-xl font-bold tracking-wider">
                    {cat.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-sans text-brand-gold-light mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Shop Collection &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. FEATURED PRODUCTS COLLECTION (Increased vertical padding) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={slideUpFade}
        className="bg-brand-white border-t border-b border-brand-border/40 py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <motion.div variants={fadeInUp} className="text-left">
              <h2 className="font-display text-3xl text-brand-dark font-bold uppercase tracking-wide">
                {settings?.homeFeaturedHeading || 'Featured Collection'}
              </h2>
              <span className="text-xs text-brand-gold font-sans font-bold uppercase tracking-widest mt-1 block">
                {settings?.homeFeaturedSubheading || 'Premium Wardrobe Curations'}
              </span>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/shop" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-crimson hover:text-brand-gold flex items-center space-x-1.5 transition-colors">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="aspect-[3/4] skeleton-shimmer rounded-xl" />
              ))}
            </div>
          ) : collections.featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {collections.featured.slice(0, 4).map(prod => (
                <motion.div variants={fadeInUp} key={prod._id}>
                  <ProductCard
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-brand-muted text-sm text-center py-6">Add featured products from the admin panel to showcase here!</p>
          )}
        </div>
      </motion.section>

      {/* 4. PROMOTIONAL SPLIT BANNER (Enhanced typography and spacing) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={blurReveal}
        className="w-full bg-brand-dark text-brand-cream flex flex-col md:flex-row overflow-hidden border-t-2 border-b-2 border-brand-gold/30"
      >
        {/* Left block */}
        <div className="w-full md:w-1/2 p-10 sm:p-20 flex flex-col justify-center text-left space-y-5 relative">
          <div className="absolute inset-0 ambient-glow-bg z-0" />
          <div className="relative z-10">
            <span className="text-brand-gold font-sans font-bold tracking-widest text-xs uppercase">Bespoke Boutique Experience</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight uppercase tracking-wide mt-2">
              {settings?.homePromoHeading || 'Handpicked. Curated. Yours.'}
            </h2>
            <p className="font-sans text-sm text-brand-cream/70 leading-relaxed max-w-md mt-4">
              {settings?.homePromoDescription || 'Unsure of fabric weight, shade match, or sizes? Skip the queue and consult directly with our catalog experts on WhatsApp for product videos, customized sizing checkups, and COD booking services.'}
            </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${settings?.whatsAppNumber || '919999999999'}?text=Hi!%20I'm%20interested%20in%20shopping%20at%20Swastika%20Sarees.%20Could%20you%20share%20the%20latest%20arrivals%20catalog?%20🙏`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3.5 rounded text-xs font-semibold uppercase tracking-widest transition-colors shadow-lg"
            >
              <MessageSquare size={14} />
              <span>Consult via WhatsApp</span>
            </a>
          </div>
          </div>
        </div>
        
        {/* Right block: collage/grid of 3 mock images */}
        <div className="w-full md:w-1/2 grid grid-cols-3 aspect-video md:aspect-auto md:min-h-[420px]">
          <div className="h-full overflow-hidden">
            <img src={settings?.homePromoImage1 || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=350"} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="h-full overflow-hidden border-l border-r border-brand-gold/20">
            <img src={settings?.homePromoImage2 || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=350"} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="h-full overflow-hidden">
            <img src={settings?.homePromoImage3 || "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=350"} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </motion.section>

      {/* 5. NEW ARRIVALS GRID (Increased spacing) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={slideInRight}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24"
      >
        <div className="flex justify-between items-end mb-10 border-b border-brand-border/30 pb-4">
          <motion.div variants={fadeInUp} className="text-left">
            <h2 className="font-display text-3xl text-brand-dark font-bold uppercase tracking-wide">New Arrivals</h2>
            <span className="text-xs text-brand-gold font-sans font-bold uppercase tracking-widest mt-1 block">Unveil The Season's Best</span>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link to="/shop?sort=newest" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-crimson hover:text-brand-gold flex items-center space-x-1.5 transition-colors">
              <span>View All New</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <div key={n} className="aspect-[3/4] skeleton-shimmer rounded-xl" />)}
          </div>
        ) : collections.newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {collections.newArrivals.slice(0, 4).map(prod => (
              <motion.div variants={fadeInUp} key={prod._id}>
                <ProductCard product={prod} onQuickView={(p) => setQuickViewProduct(p)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-brand-muted text-sm text-center py-6">Check back soon for new arrivals!</p>
        )}
      </motion.section>

      {/* 6. BESTSELLERS (Increased spacing and cream background) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeScale}
        className="bg-brand-cream/45 border-t border-b border-brand-border/40 py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 border-b border-brand-border/30 pb-4">
            <motion.div variants={fadeInUp} className="text-left">
              <h2 className="font-display text-3xl text-brand-dark font-bold uppercase tracking-wide">Bestsellers</h2>
              <span className="text-xs text-brand-gold font-sans font-bold uppercase tracking-widest mt-1 block">Customer Favorites</span>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/shop?sort=popular" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-crimson hover:text-brand-gold flex items-center space-x-1.5 transition-colors">
                <span>View All Bestselling</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => <div key={n} className="aspect-[3/4] skeleton-shimmer rounded-xl" />)}
            </div>
          ) : collections.bestsellers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {collections.bestsellers.slice(0, 4).map(prod => (
                <motion.div variants={fadeInUp} key={prod._id}>
                  <ProductCard product={prod} onQuickView={(p) => setQuickViewProduct(p)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-brand-muted text-sm text-center py-6">Add bestselling products to display here!</p>
          )}
        </div>
      </motion.section>

      {/* 7. WHY CHOOSE US (Luxury Refinement) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={blurReveal}
        className="bg-brand-cream border-b border-brand-border/30 py-20 lg:py-24 text-center select-none relative"
      >
        <div className="absolute inset-0 ambient-glow-bg" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="font-display text-3xl text-brand-dark font-bold uppercase tracking-wide mb-2">Boutique Guarantee</h2>
          <div className="luxury-divider" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={fadeInUp} className="flex flex-col items-center p-6 bg-brand-white rounded-xl shadow-xs border border-brand-border/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
                <ShieldCheck size={28} />
              </div>
              <h4 className="font-display font-semibold text-brand-dark text-sm sm:text-base mb-1.5 uppercase tracking-wide">Handpicked Quality</h4>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed">Each piece is individually checked for weave defects and stitching detail.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center p-6 bg-brand-white rounded-xl shadow-xs border border-brand-border/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
                <Truck size={28} />
              </div>
              <h4 className="font-display font-semibold text-brand-dark text-sm sm:text-base mb-1.5 uppercase tracking-wide">Pan-India Shipping</h4>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed">Free standard shipping on cart totals above ₹999 anywhere in India.</p>
            </motion.div>
 
            <motion.div variants={fadeInUp} className="flex flex-col items-center p-6 bg-brand-white rounded-xl shadow-xs border border-brand-border/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
                <MessageSquare size={28} />
              </div>
              <h4 className="font-display font-semibold text-brand-dark text-sm sm:text-base mb-1.5 uppercase tracking-wide">WhatsApp Support</h4>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed">Get assistance in choosing designs, variants, and colors via video consult.</p>
            </motion.div>
 
            <motion.div variants={fadeInUp} className="flex flex-col items-center p-6 bg-brand-white rounded-xl shadow-xs border border-brand-border/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
                <RotateCcw size={28} />
              </div>
              <h4 className="font-display font-semibold text-brand-dark text-sm sm:text-base mb-1.5 uppercase tracking-wide">Easy Returns</h4>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed">Not happy with weight or color? Return within 7 days of delivery.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 8. CUSTOMER REVIEWS (Testimonial Carousel) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={slideUpFade}
        className="bg-brand-white border-t border-b border-brand-border/40 py-20 lg:py-24 text-center select-none overflow-hidden relative"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-brand-dark tracking-wide font-bold uppercase">Praise & Reviews</h2>
          <div className="luxury-divider" />
          
          <div className="relative min-h-[220px] flex items-center justify-center mt-6">
            {activeReviews.map((rev, idx) => (
              <div
                key={idx}
                className={`absolute inset-x-0 transition-all duration-[800ms] ease-in-out flex flex-col items-center justify-center ${
                  activeReviewIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
                }`}
              >
                <div className="flex text-brand-gold justify-center mb-6">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="mx-0.5" />)}
                </div>
                <blockquote className="text-base sm:text-lg md:text-xl text-brand-dark italic max-w-2xl font-serif leading-relaxed px-4 text-center">
                  "{rev.comment}"
                </blockquote>
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-xs sm:text-sm font-bold text-brand-dark tracking-wider uppercase">{rev.customerName}</span>
                  <span className="text-[10px] text-brand-gold font-sans font-bold uppercase tracking-widest mt-1">Verified Purchaser — {rev.product?.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Controls */}
          {activeReviews.length > 1 && (
            <div className="flex justify-center items-center space-x-3.5 mt-8">
              <button
                onClick={() => setActiveReviewIndex(prev => (prev - 1 + activeReviews.length) % activeReviews.length)}
                className="p-2 rounded-full border border-brand-border/40 hover:border-brand-gold hover:text-brand-gold text-brand-muted transition-colors duration-300 flex items-center justify-center"
                aria-label="Previous Review"
              >
                &#10094;
              </button>
              {activeReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReviewIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeReviewIndex === i ? 'bg-brand-gold w-5' : 'bg-brand-border/50'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
              <button
                onClick={() => setActiveReviewIndex(prev => (prev + 1) % activeReviews.length)}
                className="p-2 rounded-full border border-brand-border/40 hover:border-brand-gold hover:text-brand-gold text-brand-muted transition-colors duration-300 flex items-center justify-center"
                aria-label="Next Review"
              >
                &#10095;
              </button>
            </div>
          )}
        </div>
      </motion.section>

      {/* 9. INSTAGRAM FEED STRIP */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeScale}
        className="bg-brand-white border-t border-brand-border/40 py-20 lg:py-24 text-center select-none"
      >
        <h2 className="font-display text-2xl text-brand-dark font-bold uppercase tracking-wide mb-1">Follow Us On Instagram</h2>
        <a
          href="https://instagram.com/swastikasarees_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm text-brand-crimson font-bold hover:text-brand-gold uppercase tracking-widest transition-colors"
        >
          @swastikasarees_
        </a>
        
        {/* Instagram Post Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3.5 mt-8 max-w-7xl mx-auto px-4">
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1598530028795-0e68f863a8a3?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=200'
          ].map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/swastikasarees_"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-lg overflow-hidden group border border-brand-border/30 shadow-2xs hover:shadow-md transition-all duration-500"
            >
              <img src={src} alt="Instagram post thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-brand-cream select-none">
                <Instagram size={20} className="mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="text-[9px] uppercase tracking-widest font-bold font-sans">View Post</span>
              </div>
            </a>
          ))}
        </div>

        {/* Instagram Follow CTA button */}
        <div className="mt-10">
          <a
            href="https://instagram.com/swastikasarees_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-brand-white hover:bg-brand-cream border border-brand-crimson/30 hover:border-brand-crimson text-brand-crimson px-7 py-3 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          >
            <Instagram size={14} />
            <span>Follow @swastikasarees_</span>
          </a>
        </div>
      </motion.section>

      {/* Quick View Popup Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
