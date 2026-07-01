import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, ShieldCheck, Truck, RotateCcw, HelpCircle, Star, Heart, Instagram, X, Check, Scissors, Layers, Wind, Sparkles, Gift, Lock, Compass, ChevronLeft, ChevronRight, Eye, ShoppingCart } from 'lucide-react';
import { useModalStore } from '../store/modalStore';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp, scaleUp, kenBurns, fadeScale, slideUpFade, blurReveal, slideInRight } from '../utils/animations';
import { useAuthStore } from '../store/authStore';
import { getCloudinaryTransformedUrl } from '../utils/imageHelpers';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

const getCategoryLayoutDetails = (aspectRatio) => {
  switch (aspectRatio) {
    case '1:1':
      return { aspectClass: 'aspect-square', transformStr: 'ar_1:1,c_fill,g_face,w_600' };
    case '2:3':
      return { aspectClass: 'aspect-[2/3]', transformStr: 'ar_2:3,c_fill,g_face,w_600' };
    case '16:9':
      return { aspectClass: 'aspect-[16/9]', transformStr: 'ar_16:9,c_fill,g_face,w_600' };
    case '3:4':
    default:
      return { aspectClass: 'aspect-[3/4]', transformStr: 'ar_3:4,c_fill,g_face,w_600' };
  }
};

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

  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [setRes, banRes, catRes, colRes, revRes] = await Promise.allSettled([
          fetch('/api/settings').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/banners').then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('/api/categories').then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('/api/products/collections').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/reviews/all?approved=true').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);

        if (setRes.status === 'fulfilled' && setRes.value) {
          setSettings(setRes.value);
        }
        if (banRes.status === 'fulfilled' && banRes.value) {
          setBanners(banRes.value);
        }
        if (catRes.status === 'fulfilled' && catRes.value) {
          setCategories(catRes.value);
        }
        if (colRes.status === 'fulfilled' && colRes.value) {
          setCollections(colRes.value);
        }
        if (revRes.status === 'fulfilled' && revRes.value) {
          setReviews(revRes.value);
        }
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
      title: 'Summer Chiffon Georgette',
      subtitle: 'Embrace the summer breeze with our ultra-lightweight chiffon collection. Featuring vibrant prints and impeccable draping for effortless elegance.',
      ctaText: 'Shop Sarees',
      ctaLink: '/shop?category=sarees',
      secondaryButtonText: 'View All',
      secondaryButtonLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200',
      badge: 'Premium Chiffon',
      chips: ['Breathable', 'Vibrant Prints', 'Summer Ready', 'Easy Care'],
      mockPrice: '1,499',
      mockOriginalPrice: '2,999',
      background: 'premium-beige-gradient'
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
    setActiveThumbnailIndex(0);
  };

  const handlePrevBanner = () => {
    setActiveBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    setActiveThumbnailIndex(0);
  };

  // Auto-scroll: now correctly uses activeBanners (includes fallback mocks)
  useEffect(() => {
    if (activeBanners.length <= 1 || isHoveringCarousel) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % activeBanners.length);
      setActiveThumbnailIndex(0);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isHoveringCarousel]);

  // Auto-scroll reviews carousel
  useEffect(() => {
    if (activeReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % activeReviews.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeReviews.length]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 15;
    const y = (clientY / window.innerHeight - 0.5) * 15;
    setMousePosition({ x, y });
  };

  const premiumSlideData = [
    {
      badge: 'NEW COLLECTION',
      titleSplit: ['Royal Banarasi', 'Collection'],
      description: 'Experience timeless craftsmanship woven by the master artisans of Banaras. Designed for celebrations, weddings, and unforgettable moments.',
      chips: ['Pure Silk', 'Handwoven', 'Premium Finish', 'Wedding Collection'],
      price: '₹4,999',
      originalPrice: '₹8,999',
      discountBadge: 'Save 45%',
      thumbnails: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1585848526322-87db98f2445c?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=200'
      ]
    },
    {
      badge: 'PREMIUM CHIFFON',
      titleSplit: ['Summer Chiffon', 'Georgette'],
      description: 'Embrace the summer breeze with our ultra-lightweight chiffon collection. Featuring vibrant prints and impeccable draping for effortless elegance.',
      chips: ['Breathable', 'Vibrant Prints', 'Summer Ready', 'Easy Care'],
      price: '₹1,499',
      originalPrice: '₹2,999',
      discountBadge: 'Save 50%',
      thumbnails: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1596455607563-ad6193f76b5c?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1598530028795-0e68f863a8a3?auto=format&fit=crop&q=80&w=200'
      ]
    },
    {
      badge: 'FESTIVE SPECIAL',
      titleSplit: ['Festive Special', 'Edition'],
      description: 'Make a statement at your next celebration with our exclusive festive edition. Rich zari work and traditional motifs reimagined for the modern era.',
      chips: ['Rich Zari', 'Traditional', 'Elegant Drape', 'Exclusive'],
      price: '₹6,499',
      originalPrice: '₹12,999',
      discountBadge: 'Save 50%',
      thumbnails: [
        'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1585848526139-478db1738740?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200',
        'https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&q=80&w=200'
      ]
    }
  ];

  return (
    <div className="relative">

      {/* 0. Brand-new Hero Split Landing Section (Appears above the main carousel) */}
      {settings?.heroLandingActive && (
        <motion.section 
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            window.scrollTo(0, 0);
          }}
          style={{ transformOrigin: 'top center' }}
          className="relative w-full min-h-[50vh] md:h-[65vh] flex flex-col md:flex-row bg-brand-cream overflow-hidden border-b border-brand-border/40 select-none"
        >
          {/* Left panel (Text Details & CTA) */}
          <div className="w-full md:w-1/2 p-8 sm:p-16 md:p-20 flex flex-col justify-center text-left space-y-6 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-brand-dark tracking-tight"
            >
              {settings.heroLandingHeading || 'Craftsmanship You Can Feel In Every Fold!'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-sans text-sm sm:text-base text-brand-muted max-w-lg leading-relaxed"
            >
              {settings.heroLandingSubheading || 'Thoughtfully manufactured for modern Indian women.'}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-2"
            >
              <Link
                to={settings.heroLandingCtaLink || '/shop'}
                className="inline-flex items-center justify-center bg-brand-dark hover:bg-brand-muted text-brand-cream px-8 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {settings.heroLandingCtaText || 'Shop Now'}
              </Link>
            </motion.div>
          </div>

          {/* Right panel (Media Section) */}
          <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto h-[40vh] md:h-full overflow-hidden bg-brand-dark">
            {settings.heroLandingMediaType === 'video' && settings.heroLandingVideoUrl ? (
              <video
                src={settings.heroLandingVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              // Fallback Images Carousel / Single Image
              <div className="w-full h-full relative">
                {settings.heroLandingImages && settings.heroLandingImages.length > 0 ? (
                  <img
                    src={settings.heroLandingImages[0]}
                    alt="Craftsmanship"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000"
                    alt="Craftsmanship Fallback"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* 1. HERO BANNER CAROUSEL (Premium Editorial Vogue-Style) */}
      {/* 1. HERO BANNER CAROUSEL (Premium Editorial Vogue-Style) */}
      <section 
        className="relative w-full overflow-hidden bg-[#FDFBF7] md:min-h-[85vh] lg:min-h-[90vh]"
        style={{ minHeight: 'calc(100vh - 80px)' }}
        onMouseEnter={() => setIsHoveringCarousel(true)}
        onMouseLeave={() => setIsHoveringCarousel(false)}
      >
        {/* Soft layered cream gradients and ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F4F0E6]/60 via-transparent to-[#FDFBF7] z-0 pointer-events-none"></div>

        {/* Very light Banarasi weave / paisley texture at 2-5% opacity */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/woven.png')]"></div>

        {/* Flowing silk-inspired background waves connecting text and image */}
        <svg className="absolute inset-0 w-full h-full z-0 opacity-[0.15] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none">
          <path d="M0 200C300 300 600 0 1000 200C1300 350 1440 200 1440 200V800H0V200Z" fill="url(#silk-gradient)" />
          <path d="M0 400C400 300 800 600 1200 400C1350 325 1440 400 1440 400V800H0V400Z" fill="url(#silk-gradient-2)" />
          <defs>
            <linearGradient id="silk-gradient" x1="0" y1="0" x2="1440" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4AF37" stopOpacity="0.5"/>
              <stop offset="1" stopColor="#D4AF37" stopOpacity="0.0"/>
            </linearGradient>
            <linearGradient id="silk-gradient-2" x1="1440" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4AF37" stopOpacity="0.0"/>
              <stop offset="1" stopColor="#D4AF37" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
        </svg>
        
        {activeBanners.map((slide, index) => {
          const isProduct = slide.type === 'product' && slide.productId;
          const displayTitle = slide.overrideTitle || (isProduct ? slide.productId.name : slide.title) || 'Banner Title';
          const titleWords = displayTitle.split(' ');
          const titleFirstPart = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
          const titleSecondPart = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');
          
          const displaySubtitle = slide.overrideSubtitle || (isProduct && slide.productId.category ? slide.productId.category.name : slide.subtitle) || '';
          const displayPrice = isProduct ? slide.productId.price : (slide.mockPrice ? slide.mockPrice : null);
          const originalPrice = isProduct && slide.productId.originalPrice ? `₹${slide.productId.originalPrice}` : (slide.mockOriginalPrice ? `₹${slide.mockOriginalPrice}` : null);
          
          let displayFeatures = slide.features || [];
          let displayChips = slide.chips || [];
          
          if (displayFeatures.length === 0 && displayChips.length === 0) {
            const t = displayTitle.toLowerCase();
            const c = (isProduct && slide.productId.category ? slide.productId.category.name : '').toLowerCase();
            const matches = (k) => t.includes(k) || c.includes(k);
            
            if (matches('silk')) {
              displayFeatures = ['Pure Silk', 'Running Blouse', 'Ready to Ship', 'Premium Finish'];
              displayChips = ['Premium Silk', 'Wedding Wear', 'Festive', 'Luxury'];
            } else if (matches('georgette') || matches('chiffon')) {
              displayFeatures = ['Lightweight', 'Flowing Drape', 'Party Wear', 'Easy Care'];
              displayChips = ['Lightweight', 'Elegant', 'Designer', 'Comfort Fit'];
            } else if (matches('cotton') && !matches('kurti')) {
              displayFeatures = ['Breathable', 'Skin Friendly', 'Daily Wear', 'Summer Collection'];
              displayChips = ['Comfort', 'Breathable', 'Everyday', 'Handloom'];
            } else if (matches('kurti')) {
              displayFeatures = ['Premium Cotton', '3 Piece Set', 'Available Sizes M–3XL', 'Embroidery Work'];
              displayChips = ['Premium Cotton', 'Festive', 'Easy Care', 'Ready to Ship'];
            } else if (matches('dress') || matches('unstitched')) {
              displayFeatures = ['Unstitched Fabric', 'Matching Dupatta', 'Designer Collection', 'Stitch Ready'];
              displayChips = ['Custom Fit', 'Complete Set', 'Designer', 'Premium'];
            } else {
              displayFeatures = ['Premium Quality Fabric', 'Designer Collection', 'Ready to Ship', 'COD Available'];
              displayChips = ['Premium Fabric', 'Handpicked', 'Easy Care', 'Festive Wear'];
            }
          }
          
          let displayBadge = slide.badge;
          if (!displayBadge && isProduct) {
            displayBadge = slide.productId.isFeatured ? 'FEATURED' : 'NEW ARRIVAL';
          }
          
          const displayImage = isProduct ? slide.selectedImage : slide.imageUrl;
          const ctaText = slide.ctaText || 'Shop Now';
          const ctaLink = isProduct ? `/product/${slide.productId.slug}` : (slide.ctaLink || '/shop');
          const secondaryBtnText = slide.secondaryButtonText;
          const secondaryBtnLink = slide.secondaryButtonLink || '/shop';

          let containerLayout = '';
          let textAlignmentClass = '';
          
          if (slide.layout === 'right-image') {
            containerLayout = 'flex-col md:flex-row';
            textAlignmentClass = 'items-center md:items-start md:pl-6 lg:pl-12';
          } else if (slide.layout === 'center') {
            containerLayout = 'flex-col justify-center items-center';
            textAlignmentClass = 'items-center mt-4';
          } else {
            // left-image default
            containerLayout = 'flex-col md:flex-row-reverse';
            textAlignmentClass = 'items-center md:items-start md:pr-6 lg:pr-12';
          }

          let alignClass = 'text-left';
          if (slide.textAlignment === 'center' || (!slide.textAlignment && slide.layout === 'center')) alignClass = 'text-center';
          if (slide.textAlignment === 'right') alignClass = 'text-right';
          if (slide.textAlignment === 'left') alignClass = 'text-left';
          
          if (slide.layout === 'center' && !slide.textAlignment) alignClass = 'text-center';
          else if (!slide.textAlignment && slide.layout !== 'center') alignClass = 'text-center md:text-left';

          textAlignmentClass = `${alignClass} ${textAlignmentClass}`;

          let bgStyle = '';
          switch(slide.background) {
            case 'white-premium': bgStyle = 'bg-white'; break;
            case 'beige-luxury': bgStyle = 'bg-[#FDFBF7]'; break;
            case 'palace': bgStyle = 'bg-gradient-to-b from-[#F9F6F0] to-[#F1EAD7]'; break;
            case 'dark-luxury': bgStyle = 'bg-brand-dark'; break;
            case 'minimal': bgStyle = 'bg-gray-50'; break;
            case 'transparent': bgStyle = 'bg-transparent'; break;
            // New premium styles
            case 'luxury-palace-interior': bgStyle = 'bg-gradient-to-b from-[#EFE5D9] to-[#FDFBF7]'; break;
            case 'heritage-haveli': bgStyle = 'bg-[#F4F0E6]'; break;
            case 'royal-archways': bgStyle = 'bg-gradient-to-b from-[#F9F6F0] to-[#E6DBC8]'; break;
            case 'marble-floor-shadows': bgStyle = 'bg-[#FDFBF7]'; break;
            case 'silk-fabric-texture': bgStyle = 'bg-[#F7EFE5]'; break;
            case 'premium-beige-gradient': bgStyle = 'bg-[#D6D3CB]'; break; // Exact match to image base color
            case 'warm-ivory-luxury': bgStyle = 'bg-[#FAF8F5]'; break;
            case 'golden-ambient-lighting': bgStyle = 'bg-gradient-to-tr from-[#EAD9C0] to-[#FDFBF7]'; break;
            case 'traditional-jharokha-windows': bgStyle = 'bg-[#F2EFE9]'; break;
            case 'floral-luxury-decor': bgStyle = 'bg-[#F9F6F0]'; break;
            case 'soft-bokeh-lighting': bgStyle = 'bg-[#FDFBF7]'; break;
            case 'minimal-editorial-fashion': bgStyle = 'bg-white'; break;
            default: bgStyle = 'bg-[#FDFBF7]';
          }

          let waveColor = '';
          let archColor = '';
          let archBorder = '';
          let showArch = false;
          
          if (['premium-beige-gradient', 'white-premium', 'golden-ambient-lighting', 'dark-luxury'].includes(slide.background)) {
            showArch = true;
            if (slide.background === 'premium-beige-gradient') {
              waveColor = '#E2DFD8';
              archColor = 'bg-[#E1DFD7]';
              archBorder = 'border-black/10';
            } else if (slide.background === 'white-premium') {
              waveColor = '#F7F7F7';
              archColor = 'bg-[#F9F9F9]';
              archBorder = 'border-black/5';
            } else if (slide.background === 'golden-ambient-lighting') {
              waveColor = '#E3CBA8';
              archColor = 'bg-[#EAD4B3]';
              archBorder = 'border-black/10';
            } else if (slide.background === 'dark-luxury') {
              waveColor = '#242424';
              archColor = 'bg-[#1F1F1F]';
              archBorder = 'border-white/10';
            }
          }

          const isDark = slide.background === 'dark-luxury';
          const textColor = isDark ? 'text-white' : 'text-brand-dark';
          const mutedColor = isDark ? 'text-white/70' : 'text-brand-muted';

          return (
            <div
              key={slide._id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex px-4 sm:px-12 md:px-16 lg:px-24 py-8 md:py-16 lg:py-20 ${containerLayout} ${bgStyle} ${
                activeBannerIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Custom Background Image with Ken Burns */}
              {slide.backgroundImage && (
                <motion.div 
                  initial={{ scale: 1, opacity: 0 }} 
                  animate={activeBannerIndex === index ? { scale: 1.05, opacity: 0.3 } : { opacity: 0 }} 
                  transition={{ duration: 8, ease: "linear" }}
                  className="absolute inset-0 z-0 origin-center"
                >
                  <img src={slide.backgroundImage} alt="Background" className="w-full h-full object-cover mix-blend-multiply" />
                </motion.div>
              )}

              {/* Gradient Overlay */}
              {slide.gradientOverlay === 'soft-radial' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent z-0"></div>
              )}
              {slide.gradientOverlay === 'dark-vignette' && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20 z-0"></div>
              )}
              {slide.gradientOverlay === 'golden-glow' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent z-0"></div>
              )}
              {slide.gradientOverlay === 'warm-overlay' && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EAD9C0]/20 to-[#EAD9C0]/40 z-0"></div>
              )}
              
              {/* Decorative Theme */}
              {slide.decorativeTheme === 'floral-watermark' && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/floral-texture.png')] opacity-[0.03] z-0 mix-blend-multiply pointer-events-none"></div>
              )}

              {/* Background Decor */}
              {showArch && (
                <svg className="absolute top-0 left-0 w-full h-[80%] z-0 pointer-events-none opacity-80" preserveAspectRatio="none" viewBox="0 0 1440 600" fill="none">
                  <path d="M0 0H1440V200C1100 450 400 150 0 550V0Z" fill={waveColor} />
                </svg>
              )}
              
              {(slide.background === 'palace' || slide.background === 'luxury-palace-interior') && (
                <div className="absolute bottom-0 w-full md:w-[80%] h-[95%] left-1/2 -translate-x-1/2 border border-brand-gold/20 rounded-t-full bg-white/20 pointer-events-none z-0"></div>
              )}

              {/* Image Area */}
              <div className={`relative z-10 flex items-end justify-center ${slide.layout === 'center' ? 'w-full h-[60%]' : 'w-full md:w-1/2 h-[50%] md:h-full'}`}>
                {/* Arch Background Decor */}
                {showArch && (
                  <div className={`absolute bottom-0 w-[95%] sm:w-[85%] md:w-[80%] h-[92%] border-[1px] rounded-t-full z-[-1] pointer-events-none ${archColor} ${archBorder}`}></div>
                )}
                <motion.div
                  className="relative w-full h-full flex items-end justify-center"
                  initial={{ opacity: 0, y: 15 }}
                  animate={activeBannerIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ opacity: { duration: 1.2 }, y: { duration: 1.2, ease: "easeOut" } }}
                >
                  <img
                    src={displayImage}
                    alt={displayTitle}
                    className={`relative z-10 w-auto h-full object-contain object-bottom drop-shadow-2xl ${slide.layout === 'center' ? 'max-h-full' : 'scale-[1.05] md:scale-[1.08] lg:scale-110 origin-bottom'}`}
                  />
                  {/* Model Floor Shadow */}
                  <div className="absolute bottom-0 w-[50%] md:w-[60%] h-4 bg-black/40 blur-[12px] rounded-[100%] z-0 translate-y-1" />
                </motion.div>
              </div>

              {/* Text Area */}
              <div className={`relative z-20 flex flex-col justify-center ${textAlignmentClass} ${slide.layout === 'center' ? 'w-full h-[40%]' : 'w-full md:w-1/2 h-[50%] md:h-full'}`}>
                <AnimatePresence mode="wait">
                  {activeBannerIndex === index && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, transition: { duration: 0.3 } }}
                      variants={{
                        initial: {},
                        animate: { transition: { staggerChildren: 0.12 } }
                      }}
                      className="max-w-[580px] w-full space-y-6 md:space-y-8 flex flex-col"
                    >
                      {displayBadge && (
                        <motion.div 
                          variants={{ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                          className={`inline-block ${slide.layout === 'center' || alignClass.includes('text-center') ? 'mx-auto' : (alignClass.includes('text-right') ? 'ml-auto' : 'mr-auto')}`}
                        >
                          <span className={`text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase ${isDark ? 'text-white/80' : 'text-brand-dark/70'} flex items-center justify-center`}>
                            {alignClass.includes('text-center') || alignClass.includes('text-right') ? <span className="w-8 h-px bg-brand-gold mr-3 hidden md:block"></span> : null}
                            {displayBadge}
                            {alignClass.includes('text-center') || alignClass.includes('text-left') ? <span className="w-8 h-px bg-brand-gold ml-3 hidden md:block"></span> : null}
                          </span>
                        </motion.div>
                      )}

                      <motion.div 
                        variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                        className={`font-display leading-[1.2] ${textColor} flex flex-col space-y-2.5`}
                      >
                        <span className="text-3xl sm:text-4xl md:text-[3.2rem] lg:text-[4rem] tracking-tight font-medium drop-shadow-sm">{titleFirstPart}</span>
                        {titleSecondPart && <span className="text-3xl sm:text-4xl md:text-[3.2rem] lg:text-[4rem] italic text-brand-gold font-light">{titleSecondPart}</span>}
                      </motion.div>

                      {displaySubtitle && (
                        <motion.p 
                          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                          className={`font-sans text-xs sm:text-sm md:text-base ${mutedColor} leading-relaxed font-light`}
                        >
                          {displaySubtitle}
                        </motion.p>
                      )}

                      {/* Feature Checklist */}
                      {displayFeatures && displayFeatures.length > 0 && (
                        <motion.ul 
                          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                          className={`grid grid-cols-2 gap-y-3 gap-x-4 text-[11px] sm:text-xs font-sans ${mutedColor}`}
                        >
                          {displayFeatures.map((feature, idx) => (
                            <li key={idx} className={`flex items-center ${alignClass.includes('text-center') ? 'justify-center' : alignClass.includes('text-right') ? 'justify-end' : 'justify-start'}`}>
                              <Check className="w-4 h-4 text-brand-gold mr-2 shrink-0" />
                              <span className="tracking-wide">{feature}</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}

                      {/* Chips */}
                      {displayChips && displayChips.length > 0 && (
                        <motion.div 
                          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                          className={`flex flex-wrap gap-2 pt-1 ${alignClass.includes('text-center') ? 'justify-center' : alignClass.includes('text-right') ? 'justify-end' : 'justify-start'}`}
                        >
                          {displayChips.map((chip, idx) => (
                            <span key={idx} className={`border border-black/5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${isDark ? 'bg-white/10 text-white' : 'bg-brand-cream/80 text-brand-dark'}`}>
                              {chip}
                            </span>
                          ))}
                        </motion.div>
                      )}

                      {/* Pricing */}
                      {displayPrice && (
                        <motion.div 
                          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                          className={`flex items-baseline space-x-3 pt-3 ${alignClass.includes('text-center') ? 'justify-center' : alignClass.includes('text-right') ? 'justify-end' : 'justify-start'}`}
                        >
                          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest ${mutedColor}`}>Starting From</span>
                          <div className="flex items-center space-x-3">
                            <span className={`text-3xl sm:text-4xl md:text-5xl font-display font-bold ${textColor} tracking-tight`}>₹{displayPrice}</span>
                            {originalPrice && <span className={`text-sm sm:text-base md:text-lg font-sans tracking-wide text-brand-dark/40 line-through decoration-1`}>{originalPrice}</span>}
                          </div>
                        </motion.div>
                      )}

                      <motion.div 
                        variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                        className={`flex flex-row items-center space-x-3 sm:space-x-4 pt-4 w-full ${alignClass.includes('text-center') ? 'justify-center' : alignClass.includes('text-right') ? 'justify-end' : 'justify-center md:justify-start'}`}
                      >
                        <Link
                          to={ctaLink}
                          className={`bg-[#18110D] text-brand-cream px-8 sm:px-12 py-3.5 sm:py-4 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-sm hover:shadow-md hover:bg-black whitespace-nowrap ${isDark ? 'bg-white text-brand-dark hover:bg-brand-cream' : ''}`}
                        >
                          {ctaText}
                        </Link>
                        {secondaryBtnText && (
                          <Link
                            to={secondaryBtnLink}
                            className={`bg-black/5 border border-black/10 text-brand-dark px-8 sm:px-12 py-3.5 sm:py-4 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 whitespace-nowrap hover:bg-black/10 ${isDark ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : ''}`}
                          >
                            {secondaryBtnText}
                          </Link>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 md:bottom-8 lg:bottom-12 left-0 w-full md:w-[55%] px-4 sm:px-12 md:px-16 lg:px-32 flex justify-center md:justify-start items-center space-x-2 md:space-x-3 z-30">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveBannerIndex(i);
                  setActiveThumbnailIndex(0);
                }}
                className={`transition-all duration-500 ease-out rounded-full ${
                  activeBannerIndex === i ? 'w-10 h-1 bg-brand-dark' : 'w-2 h-2 bg-brand-dark/20 hover:bg-brand-dark/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section Transition Gradient Line */}
      <div className="w-full h-8 bg-gradient-to-b from-[#F1ECE1] to-brand-white relative overflow-hidden flex items-start justify-center">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent mt-[-1px]"></div>
      </div>

      {/* 2. CATEGORY EDITORIAL GRID */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center select-none font-sans"
      >
        <motion.span variants={fadeInUp} className="text-2xs uppercase tracking-widest font-bold text-brand-gold">Handpicked Curations</motion.span>
        <motion.h2 variants={fadeInUp} className="font-sans text-2xl sm:text-3xl text-brand-dark tracking-tight font-bold mt-1 text-center">
          {settings?.homeCategoryHeading || 'Shop by Category'}
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-xs sm:text-sm text-brand-muted/80 max-w-lg mx-auto mb-10 leading-relaxed font-normal">
          {settings?.homeCategoryDescription || 'Handcrafted fabrics tailored for festive sparkle, weddings, daily charm, and special moments.'}
        </motion.p>

        {(() => {
          const limit = settings?.homeCategoryLimit || 4;
          const categoriesToShow = activeCategories.slice(0, limit);
          const { aspectClass, transformStr } = getCategoryLayoutDetails(settings?.homeCategoryAspectRatio || '3:4');

          const getCategoryDesc = (slug, idx) => {
            if (slug === 'silk-sarees') return 'Handwoven elegance for weddings and celebrations.';
            if (slug === 'georgette-sarees') return 'Lightweight fabrics for festive occasions.';
            if (slug === 'cord-sets') return 'Modern styles for effortless fashion.';
            if (slug === 'kurtis') return 'Comfort meets everyday elegance.';
            return `Discover our handpicked premium selection of ${categoriesToShow[idx]?.name || 'items'}.`;
          };

          const gridColsClass = 
            categoriesToShow.length === 2 ? 'grid-cols-2' : 
            categoriesToShow.length === 3 ? 'grid-cols-2 md:grid-cols-3' : 
            categoriesToShow.length === 5 ? 'grid-cols-2 md:grid-cols-5' : 
            'grid-cols-2 md:grid-cols-4';

          return (
            <motion.div variants={staggerContainer} className={`grid ${gridColsClass} gap-6`}>
              {categoriesToShow.map((cat, idx) => (
                <motion.div variants={scaleUp} key={cat._id || idx}>
                  <CategoryEditorialCard 
                    category={cat} 
                    description={getCategoryDesc(cat.slug, idx)} 
                    heightClass={aspectClass}
                    transformation={transformStr}
                  />
                </motion.div>
              ))}
            </motion.div>
          );
        })()}
      </motion.section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="bg-brand-white border-t border-b border-brand-border/40 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <motion.div variants={fadeInUp} className="text-left">
              <span className="text-2xs text-brand-gold font-bold uppercase tracking-widest font-sans block">Boutique Curations</span>
              <h2 className="font-sans text-2xl sm:text-3xl text-brand-dark font-bold tracking-tight mt-1">
                {settings?.homeFeaturedHeading || 'Featured Collection'}
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/shop" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-crimson hover:text-brand-gold flex items-center space-x-1 transition-colors">
                <span>View All Products</span>
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="aspect-[2/3] skeleton-shimmer rounded-xl" />
              ))}
            </div>
          ) : collections.featured.length > 0 ? (
            <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {collections.featured.slice(0, 4).map(prod => (
                <motion.div variants={fadeInUp} key={prod._id}>
                  <FeaturedProductCard
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-brand-muted text-xs text-center py-6">Add featured products from the admin panel to showcase here!</p>
          )}
        </div>
      </motion.section>

      {/* 4. BOUTIQUE STORY SECTION */}
      {settings?.homeStoryActive !== false && (
        <motion.section
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div variants={scaleUp} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-brand-border/30 shadow-md bg-brand-dark">
              {settings?.homeStoryMediaType === 'video' && settings?.homeStoryVideoUrl ? (
                <video 
                  src={settings.homeStoryVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={settings?.homeStoryImageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"} 
                  alt="Artisanal Handloom Weaving" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-brand-dark/10" />
            </motion.div>

            <motion.div variants={fadeInUp} className="text-left space-y-5">
              <span className="text-2xs text-brand-gold font-bold uppercase tracking-widest">
                {settings?.homeStoryTagline || 'Heritage & Craftsmanship'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
                {settings?.homeStoryHeading || 'Our Story'}
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal">
                {settings?.homeStoryDescription || 'At Swastika Sarees, every piece is selected with meticulous attention to craftsmanship, fabric quality, and timeless elegance. We bridge the gap between traditional Indian master weavers and the modern contemporary woman.'}
              </p>
              {(settings?.homeStoryQuote || settings?.homeStoryAuthor) && (
                <blockquote className="border-l-2 border-brand-gold pl-4 text-xs italic text-brand-dark/80 font-serif leading-relaxed">
                  "{settings.homeStoryQuote || 'We believe in preserving the rich heritage of Indian textiles while designing comfortable, drape-friendly wear for life\'s special occasions.'}"
                  {settings.homeStoryAuthor && (
                    <span className="block mt-1.5 text-2xs uppercase tracking-wider text-brand-gold font-sans font-bold">— {settings.homeStoryAuthor}</span>
                  )}
                </blockquote>
              )}
              <div className="pt-2">
                <Link 
                  to="/about" 
                  className="inline-flex items-center space-x-1.5 bg-brand-dark hover:bg-brand-crimson text-brand-cream text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded transition-colors shadow-sm"
                >
                  <span>Read More About Us</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* 5. FABRIC GUIDE */}
      <motion.section
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="bg-brand-cream/40 border-t border-b border-brand-border/40 py-16 font-sans text-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.span variants={fadeInUp} className="text-2xs text-brand-gold font-bold uppercase tracking-widest">Textile Selection Guide</motion.span>
          <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mt-1">Choose the Perfect Fabric</motion.h2>
          <motion.p variants={fadeInUp} className="text-xs sm:text-sm text-brand-muted/80 max-w-md mx-auto mb-10 font-normal">
            Understand how each drape behaves so you look and feel your absolute best on every occasion.
          </motion.p>

          <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/30 p-6 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-1">Pure Silk</h4>
              <span className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider block mb-2">Wedding & Traditional</span>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed font-normal">
                Rich, lustrous texture with a sturdy hold. Perfect for marriages, traditional pujas, and heirloom collections.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/30 p-6 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-4">
                <Layers size={20} />
              </div>
              <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-1">Mulmul Cotton</h4>
              <span className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider block mb-2">Daily Comfort</span>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed font-normal">
                Ultra-breathable, lightweight, and skin-friendly. Hand-loomed for regular and high-summer comfort.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/30 p-6 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-4">
                <Wind size={20} />
              </div>
              <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-1">Georgette</h4>
              <span className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider block mb-2">Festive Wear</span>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed font-normal">
                Flowing, soft silhouette with an elegant bounce. Resists wrinkles, draping beautifully for evening dinners.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/30 p-6 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-4">
                <Scissors size={20} />
              </div>
              <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-1">Luxury Organza</h4>
              <span className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider block mb-2">Luxury Events</span>
              <p className="text-2xs sm:text-xs text-brand-muted leading-relaxed font-normal">
                Sheer, crisp finish that holds an elegant flare. Provides a modern, high-fashion structural drape for cocktail parties.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 6. NEW ARRIVALS HORIZONTAL SCROLL CAROUSEL */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans select-none relative"
      >
        <div className="flex justify-between items-end mb-8">
          <div className="text-left">
            <span className="text-2xs text-brand-gold font-bold uppercase tracking-widest block">Unveil The Season's Best</span>
            <h2 className="text-2xl sm:text-3xl text-brand-dark font-bold tracking-tight mt-1">New Arrivals</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full border border-brand-border bg-brand-white text-brand-dark hover:bg-brand-cream hover:text-brand-crimson transition-colors shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full border border-brand-border bg-brand-white text-brand-dark hover:bg-brand-cream hover:text-brand-crimson transition-colors shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex space-x-6 overflow-x-hidden">
            {[1, 2, 3, 4].map(n => <div key={n} className="w-[280px] shrink-0 aspect-[2/3] skeleton-shimmer rounded-xl" />)}
          </div>
        ) : collections.newArrivals.length > 0 ? (
          <div 
            ref={scrollRef}
            className="flex flex-row overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {collections.newArrivals.map(prod => (
              <div key={prod._id} className="w-[260px] sm:w-[280px] shrink-0 snap-start">
                <FeaturedProductCard product={prod} onQuickView={(p) => setQuickViewProduct(p)} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-muted text-xs text-center py-6">Check back soon for new arrivals!</p>
        )}
      </motion.section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="bg-brand-cream/35 border-t border-b border-brand-border/40 py-16 text-center select-none font-sans"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-2xs text-brand-gold font-bold uppercase tracking-widest">Voices of Swastika Clients</span>
          <h2 className="text-2xl sm:text-3xl text-brand-dark tracking-tight font-bold mt-1">Praise & Reviews</h2>
          <div className="luxury-divider mx-auto my-6" />

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/20 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=100" 
                  alt="Priya" 
                  className="w-10 h-10 rounded-full object-cover border border-brand-border/30"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Priya R.</h4>
                  <span className="text-xs text-brand-gold uppercase font-semibold">Hyderabad</span>
                </div>
              </div>
              <div className="flex text-brand-gold mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="mr-0.5" />)}
              </div>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal italic">
                "The embroidery was even better than the photos. The silk weave feels extremely premium, and the weight is exactly what I needed for the wedding function."
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/20 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                  alt="Anjali" 
                  className="w-10 h-10 rounded-full object-cover border border-brand-border/30"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Anjali S.</h4>
                  <span className="text-xs text-brand-gold uppercase font-semibold">Mumbai</span>
                </div>
              </div>
              <div className="flex text-brand-gold mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="mr-0.5" />)}
              </div>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal italic">
                "Consulting the team on WhatsApp was so helpful. They shared live videos of the fabric structure, making it super easy to match my blouse shade before purchasing!"
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-white border border-brand-border/20 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" 
                  alt="Kiran" 
                  className="w-10 h-10 rounded-full object-cover border border-brand-border/30"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Kiran J.</h4>
                  <span className="text-xs text-brand-gold uppercase font-semibold">New Delhi</span>
                </div>
              </div>
              <div className="flex text-brand-gold mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="mr-0.5" />)}
              </div>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal italic">
                "Ordered a georgette set and was amazed at the quick delivery. The packaging is absolutely luxury tier. Perfect for gift giving, or just treating yourself!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 8. BOUTIQUE GUARANTEE (7 Compact Elegant Cards) */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="bg-brand-white py-16 text-center select-none font-sans"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-2xs text-brand-gold font-bold uppercase tracking-widest">Our Service Commitment</span>
          <h2 className="text-2xl sm:text-3xl text-brand-dark tracking-tight font-bold mt-1">Boutique Guarantee</h2>
          <div className="luxury-divider mx-auto my-6" />

          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <Sparkles size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Handpicked Fabrics</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">Individually checked for weave details.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <Scissors size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Premium Stitching</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">Crafted with reinforced tailored seams.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <Lock size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Secure Payments</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">100% safe checkout with Razorpay.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <Truck size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Pan India Shipping</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">Free delivery on orders above ₹999.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <RotateCcw size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Easy Returns</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">Hassle-free return policy within 7 days.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <MessageSquare size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Styling Support</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">Video or chat consultation with catalog stylist.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-brand-cream/30 border border-brand-border/35 p-4 rounded-xl flex flex-col items-center hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <Gift size={16} />
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-brand-dark uppercase tracking-wide mb-1">Gift Packaging</h4>
              <p className="text-[11px] text-brand-muted leading-snug font-normal">Beautiful premium boxes for your drapes.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 9. INSTAGRAM ORGANIC FEED SECTION */}
      <motion.section 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="bg-brand-cream/30 border-t border-brand-border/40 py-16 text-center select-none font-sans"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-lg mx-auto mb-10">
            <span className="text-2xs text-brand-gold font-bold uppercase tracking-widest font-sans">Social Gallery</span>
            <h2 className="text-2xl sm:text-3xl text-brand-dark tracking-tight font-bold mt-1">Tag Us to Get Featured</h2>
            <p className="text-sm sm:text-base text-brand-muted font-normal mt-2 leading-relaxed">
              Join our growing family! Post a photo wearing Swastika drapes and tag us for a chance to be showcased in our lookbook.
            </p>
            
            <a 
              href="https://www.instagram.com/swastikasarees_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-6 mt-4 text-sm font-semibold text-brand-dark border border-brand-border/35 bg-brand-white hover:text-brand-crimson p-3 rounded-full shadow-xs px-6 transition-colors duration-300 cursor-pointer"
            >
              <span>@swastikasarees_</span>
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              <span>12K+ Followers</span>
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              <span>420+ Posts</span>
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400', rotation: '-rotate-1 md:-translate-y-2' },
              { src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400', rotation: 'rotate-1 md:translate-y-1' },
              { src: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=400', rotation: '-rotate-2 md:-translate-y-4' },
              { src: 'https://images.unsplash.com/photo-1583391733958-d25e07fac662?auto=format&fit=crop&q=80&w=400', rotation: 'rotate-2 md:translate-y-2' },
              { src: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=400', rotation: '-rotate-1 md:-translate-y-1' },
              { src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400', rotation: 'rotate-1 md:translate-y-3' }
            ].map((item, i) => (
              <a
                key={i}
                href="https://www.instagram.com/swastikasarees_"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative aspect-[3/4] rounded-xl overflow-hidden group border border-brand-border/30 shadow-xs hover:shadow-lg transition-all duration-500 ease-out transform ${item.rotation}`}
              >
                <img 
                  src={item.src} 
                  alt="Instagram lookbook" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-dark/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-brand-cream">
                  <Instagram size={18} className="mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="text-[11px] uppercase tracking-widest font-bold">View lookbook</span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12">
            <a
              href="https://www.instagram.com/swastikasarees_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-brand-white hover:bg-brand-cream text-brand-dark border border-brand-border/60 hover:border-brand-crimson px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors shadow-md"
            >
              <Instagram size={14} className="text-brand-crimson" />
              <span>Follow Us On Instagram</span>
            </a>
          </div>
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



function CategoryEditorialCard({ category, description, heightClass, transformation = 'ar_3:4,c_fill,g_face' }) {
  if (!category) return null;
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={`group relative ${heightClass} rounded-2xl overflow-hidden block bg-brand-dark shadow-sm hover:shadow-lg transition-all duration-500`}
    >
      <img
        src={getCloudinaryTransformedUrl(category.imageUrl, transformation)}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-100"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-row items-stretch gap-3 text-left">
        {/* Left vertical gold bar */}
        <div className="w-[3px] bg-brand-gold scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-all duration-500 origin-top shrink-0 rounded-xs" />

        {/* Text details content */}
        <div className="flex flex-col justify-center">
          <span className="font-sans text-white text-lg sm:text-xl font-bold tracking-wide transition-all duration-300 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.7)]">
            {category.name}
          </span>
          <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-[160px] group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <p className="font-sans text-xs sm:text-sm text-brand-cream/90 leading-relaxed font-normal mt-1.5 max-w-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {description}
            </p>
            <div className="pt-2.5">
              <span className="inline-flex items-center text-[10px] sm:text-[11px] uppercase tracking-widest font-sans font-bold text-brand-gold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                Explore Collection <ArrowRight size={10} className="ml-1.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedProductCard({ product, onQuickView }) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [selectedColor, setSelectedColor] = useState(null);
  const navigate = useNavigate();

  const isSaved = isInWishlist(product._id);
  const currentPrice = product.price / 100;
  const originalPrice = product.originalPrice ? product.originalPrice / 100 : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const colorMap = new Map();
  const defaultImages = product.mainProduct?.images?.length > 0 ? product.mainProduct.images : product.images;

  if (product.mainProduct?.primaryColor?.name || product.colorName) {
    colorMap.set(product.mainProduct?.primaryColor?.name || product.colorName, {
      hex: product.mainProduct?.primaryColor?.hex || product.colorHex,
      images: defaultImages
    });
  }

  product.variants?.forEach(v => {
    if (v.colorName && !colorMap.has(v.colorName)) {
      colorMap.set(v.colorName, { hex: v.colorHex, images: v.images });
    }
  });

  const colors = Array.from(colorMap.entries()).map(([name, { hex, images }]) => ({ name, hex, images }));
  const activeColorData = selectedColor ? colorMap.get(selectedColor) : null;
  const sourceImages = activeColorData?.images?.length > 0 ? activeColorData.images : defaultImages;

  const primaryImage = sourceImages?.find(img => img.isPrimary)?.url || sourceImages?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400';
  const secondaryImage = sourceImages?.find(img => !img.isPrimary && img.displayOrder > 0)?.url || sourceImages?.[1]?.url || primaryImage;

  const getBadgeText = () => {
    if (product.isBestseller) return 'Best Seller';
    if (product.isFeatured) return "Editor's Pick";
    if (product.stock && product.stock < 5) return 'Limited Stock';
    if (product.isNewArrival) return 'New Arrival';
    
    const hash = product._id ? product._id.toString().charCodeAt(product._id.toString().length - 1) : 0;
    const tags = ['Trending', 'Wedding Favourite', 'Premium Fabric', 'Fast Selling'];
    return tags[hash % tags.length];
  };

  const badgeText = getBadgeText();

  const getBadgeStyle = () => {
    switch (badgeText) {
      case 'Best Seller': return 'bg-purple-950/90 text-purple-100 border-purple-400/20';
      case "Editor's Pick": return 'bg-amber-950/90 text-amber-100 border-amber-400/20';
      case 'Limited Stock': return 'bg-red-950/95 text-red-100 border-red-400/20';
      case 'New Arrival': return 'bg-emerald-950/90 text-emerald-100 border-emerald-400/20';
      case 'Wedding Favourite': return 'bg-brand-crimson/90 text-brand-cream border-brand-gold/25';
      default: return 'bg-brand-dark/95 text-brand-cream border-brand-border/20';
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = selectedColor || product.mainProduct?.primaryColor?.name || product.colorName || product.variants?.[0]?.colorName;
    const defaultSizes = (product.mainProduct?.sizes && product.mainProduct.sizes.length > 0)
      ? product.mainProduct.sizes
      : product.variants?.[0]?.sizes;

    const defaultSizeObj = defaultSizes?.find(s => s.stock > 0) || defaultSizes?.[0];
    addItem({
      product: product._id,
      slug: product.slug,
      name: product.name,
      price: currentPrice + (defaultSizeObj?.extraPricePaise ? defaultSizeObj.extraPricePaise / 100 : 0),
      quantity: 1,
      color: defaultColor || null,
      size: product.category?.slug !== 'sarees' ? (defaultSizeObj?.size || null) : null,
      sku: defaultSizeObj?.variantSku || product.sku,
      imageUrl: primaryImage,
      stock: defaultSizeObj?.stock !== undefined ? defaultSizeObj.stock : (product.stock || 10)
    });
  };

  return (
    <div className="group relative bg-brand-white border border-brand-border/25 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500 flex flex-col h-full font-sans">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-cream select-none">
        
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border rounded shadow-xs ${getBadgeStyle()}`}>
            {badgeText}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-brand-white/90 border border-brand-border/20 text-brand-dark hover:text-brand-crimson hover:scale-110 shadow-xs transition-all duration-300"
          aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={12} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-brand-crimson" : ""} />
        </button>

        <div className="w-full h-full relative cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
          <img
            src={getCloudinaryTransformedUrl(primaryImage, 'ar_2:3,c_fill,g_face,w_600,h_900')}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {secondaryImage && secondaryImage !== primaryImage && (
            <img
              src={getCloudinaryTransformedUrl(secondaryImage, 'ar_2:3,c_fill,g_face,w_600,h_900')}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              loading="lazy"
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 px-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center space-x-1 bg-brand-cream hover:bg-brand-crimson text-brand-dark hover:text-brand-cream text-[10px] font-bold uppercase tracking-widest px-2.5 py-2 rounded-sm shadow-md border border-brand-border/20 transition-colors"
          >
            <Eye size={10} />
            <span>Quick View</span>
          </button>
          
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-brand-dark/95 hover:bg-brand-crimson text-brand-cream text-[10px] font-bold uppercase tracking-widest px-2.5 py-2 rounded-sm shadow-md border border-brand-gold/20 transition-colors"
          >
            <ShoppingCart size={10} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-left bg-brand-white">
        
        <div className="flex justify-between items-center text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
          <span>{product.category?.name || 'Collection'}</span>
          <div className="flex items-center space-x-0.5 bg-brand-cream px-1.5 py-0.5 rounded border border-brand-border/25">
            <Star size={9} fill="currentColor" className="text-brand-gold" />
            <span className="text-brand-dark text-[10px] font-bold">{product.rating || '4.9'}</span>
          </div>
        </div>

        <h4 className="font-sans text-sm font-bold text-brand-dark line-clamp-1 group-hover:text-brand-crimson transition-colors leading-tight">
          {product.name}
        </h4>

        <div className="text-[11px] text-brand-muted leading-tight font-medium">
          {product.category?.slug === 'sarees' ? (
            <span>Fabric: {product.fabric || 'Pure Silk'} • Blouse Included</span>
          ) : product.category?.slug === 'kurtis' ? (
            <span>Material: {product.fabric || 'Cotton'} • Fit: A-Line Classic</span>
          ) : (
            <span>2-Piece Coordinated Set • {product.fabric || 'Luxury Crepe'}</span>
          )}
        </div>

        {colors.length > 1 && (
          <div className="flex space-x-1.5 py-1">
            {colors.map((c, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(c.name);
                }}
                className={`w-3 h-3 rounded-full border border-black/10 transition-all ${
                  (selectedColor === c.name || (!selectedColor && idx === 0)) ? 'scale-120 ring-1 ring-brand-gold ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-brand-border/10 flex justify-between items-center">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-sm font-bold text-brand-dark">₹{currentPrice.toLocaleString('en-IN')}</span>
            {originalPrice && (
              <span className="text-xs text-brand-muted line-through font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-[#8B5A2B] border border-[#8B5A2B]/40 px-1 py-0.5 rounded-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded bg-brand-cream hover:bg-brand-crimson border border-brand-border/30 hover:border-brand-crimson text-brand-dark hover:text-brand-cream transition-colors duration-300"
            title="Add to Cart"
          >
            <ShoppingCart size={13} />
          </button>
        </div>

      </div>
    </div>
  );
}
