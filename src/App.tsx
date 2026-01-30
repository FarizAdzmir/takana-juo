import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Instagram, Star, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Circular Stamp Component
const CircularStamp = ({ text, className = '', size = 100 }: { text: string; className?: string; size?: number }) => {
  return (
    <div 
      className={`stamp bg-[#FF6A00] text-[#0B0B0C] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.14 }}
    >
      <span className="px-2">{text}</span>
    </div>
  );
};

// Logo Placeholder Component
const LogoPlaceholder = ({ size = 40 }: { size?: number }) => {
  return (
    <div className="logo-placeholder" style={{ width: size, height: size }}>
      <span className="text-[#FF6A00] text-xs font-bold">LOGO</span>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero (approximately 100vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsScrolled(scrollY > heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav ref={navRef} className={`navbar ${isScrolled ? 'navbar-dark' : 'navbar-clear'}`}>
      <div className="flex items-center gap-3">
        <LogoPlaceholder size={36} />
        <div className="font-display font-bold text-lg tracking-wide">TAKANA JUO</div>
      </div>
      <div className="hidden md:flex gap-8">
        <button onClick={() => scrollToSection('menu')} className="nav-link">Menu</button>
        {/* <button onClick={() => scrollToSection('story')} className="nav-link">Story</button> */}
        <button onClick={() => scrollToSection('reviews')} className="nav-link">Reviews</button> 
        <button onClick={() => scrollToSection('order')} className="nav-link">Order</button>
      </div>
    </nav>
  );
};

// Section 1: Hero
const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo(bgRef.current, 
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }
      )
      .fromTo(headlineRef.current?.querySelectorAll('.headline-line') || [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
        '-=0.5'
      )
      .fromTo(subheadRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(ctaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(stampRef.current,
        { scale: 0.6, rotate: -25, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.8)' },
        '-=0.4'
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set([headlineRef.current, subheadRef.current, ctaRef.current, stampRef.current, bgRef.current], {
              opacity: 1, x: 0, y: 0, scale: 1, rotate: 0
            });
          }
        }
      });

      // Phase 2: Exit (70% - 100%)
      scrollTl.fromTo(headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(subheadRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo(ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.74
      )
      .fromTo(stampRef.current,
        { x: 0, rotate: 0, scale: 1, opacity: 1 },
        { x: '12vw', rotate: 25, scale: 0.85, opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.35, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-10">
      {/* Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 0 }}
      >
        <img 
          src="/hero_plate.jpg" 
          alt="Nasi Goreng Minang"
          className="w-full h-full object-cover img-grade"
        />
        <div className="absolute inset-0 gradient-left" />
        <div className="vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-[6vw]">
        {/* Headline */}
        <div ref={headlineRef} className="max-w-[52vw]" style={{ marginTop: '10vh' }}>
          <h1 className="headline-xl text-[clamp(3rem,8vw,7rem)] text-[#F4F4F4]">
            <span className="headline-line block">NASI GORENG</span>
            <span className="headline-line block">MINANG</span>
          </h1>
        </div>

        {/* Subheadline - Calligraphy */}
        <div ref={subheadRef} className="mt-8 max-w-[34vw]">
          <p className="text-calligraphy text-3xl md:text-4xl text-[#FF6A00]">
            Pasti Takana Juo
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-8">
          <button 
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Circular Stamp - Hidden but code kept */}
      <div 
        ref={stampRef}
        className="absolute hidden"
        style={{ right: '12vw', bottom: '18vh' }}
      >
        <CircularStamp text="OPEN DAILY • 10AM–10PM" size={140} />
      </div>
    </section>
  );
};

// Section 2: Brand Collage
const BrandSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPhotoRef = useRef<HTMLDivElement>(null);
  const rightTopPhotoRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const promiseRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: '-60vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(rightTopPhotoRef.current,
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(rightBottomRef.current,
        { y: '60vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo(brandTextRef.current,
        { x: '18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo(promiseRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      )
      .fromTo(stampRef.current,
        { scale: 0.4, rotate: -90, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.6)' },
        0.12
      );

      // All entrance animations complete by 30%
      scrollTl.to({}, {}, 0.3);

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(rightTopPhotoRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(rightBottomRef.current,
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(brandTextRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(promiseRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo(stampRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.7, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-20 bg-[#0B0B0C]">
      {/* Left Photo Card */}
      <div 
        ref={leftPhotoRef}
        className="absolute card-rounded will-change-transform"
        style={{ left: '5vw', top: '12vh', width: '34vw', height: '76vh' }}
      >
        <img 
          src="/brand_collage_left.jpg" 
          alt="Nasi Goreng"
          className="w-full h-full object-cover img-grade"
        />
      </div>

      {/* Stamp on Left Photo - Hidden but code kept */}
      <div 
        ref={stampRef}
        className="absolute will-change-transform hidden"
        style={{ left: '9vw', top: '18vh' }}
      >
        <CircularStamp text="SINCE 2012" size={100} />
      </div>

      {/* Right Top Photo Card */}
      <div 
        ref={rightTopPhotoRef}
        className="absolute card-rounded will-change-transform"
        style={{ left: '42vw', top: '12vh', width: '53vw', height: '38vh' }}
      >
        <img 
          src="/brand_collage_top_right.jpg" 
          alt="Fried Rice and Chicken"
          className="w-full h-full object-cover img-grade"
        />
      </div>

      {/* Right Bottom Panel */}
      <div 
        ref={rightBottomRef}
        className="absolute card-rounded will-change-transform bg-[#141414] flex flex-col justify-center"
        style={{ left: '42vw', top: '54vh', width: '53vw', height: '34vh', padding: '4vh 4vw' }}
      >
        {/* Brand Text */}
        <div ref={brandTextRef} className="will-change-transform">
          <h2 className="headline-lg text-[clamp(2.5rem,6vw,5rem)] text-[#F4F4F4]">
            <span className="block">TAKANA</span>
            <span className="block">JUO</span>
          </h2>
        </div>

        {/* Promise */}
        <div ref={promiseRef} className="mt-6 will-change-transform">
          <p className="text-lg text-[#B8B8B8]">Murah • Mudah • Sedap</p>
        </div>
      </div>
    </section>
  );
};

// Section 3: The Recipe
const RecipeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPhotoRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: '-60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(rightPanelRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(headlineRef.current,
        { y: '-10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      )
      .fromTo(bodyRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      )
      .fromTo(ctaRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      )
      .fromTo(stampRef.current,
        { scale: 0.3, rotate: -120, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.7)' },
        0.1
      );

      scrollTl.to({}, {}, 0.3);

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(rightPanelRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo(ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '5vh', opacity: 0, ease: 'power2.in' },
        0.74
      )
      .fromTo(stampRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.7, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="section-pinned z-30 bg-[#0B0B0C]">
      {/* Left Photo Card */}
      <div 
        ref={leftPhotoRef}
        className="absolute card-rounded will-change-transform"
        style={{ left: '5vw', top: '12vh', width: '34vw', height: '76vh' }}
      >
        <img 
          src="/recipe_left.jpg" 
          alt="Nasi Goreng with Egg"
          className="w-full h-full object-cover img-grade"
        />
      </div>

      {/* HALAL Stamp - Hidden but code kept */}
      <div 
        ref={stampRef}
        className="absolute will-change-transform hidden"
        style={{ left: '9vw', top: '18vh' }}
      >
        <CircularStamp text="HALAL" size={100} />
      </div>

      {/* Right Panel */}
      <div 
        ref={rightPanelRef}
        className="absolute card-rounded will-change-transform bg-[#141414] flex flex-col justify-center"
        style={{ left: '42vw', top: '12vh', width: '53vw', height: '76vh', padding: '6vh 4vw' }}
      >
        {/* Headline */}
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="headline-lg text-[clamp(2rem,5vw,4rem)] text-[#F4F4F4]">
            <span className="block">SIMPLE</span>
            <span className="block">INGREDIENTS.</span>
            <span className="block text-[#FF6A00]">BIG FLAVOR.</span>
          </h2>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="mt-8 max-w-[40vw] will-change-transform">
          <p className="text-base md:text-lg text-[#B8B8B8] leading-relaxed">
            We fry to order on high heat—garlic, shallots, kecap manis, and a blend of chili sambal. 
            No shortcuts. Just the same recipe we've served since day one.
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-8 flex gap-4 will-change-transform">
          <button className="btn-primary">Our Story</button>
          {/* <button className="btn-secondary">Allergens</button>*/}
        </div>
      </div>
    </section>
  );
};

// Section 4: Menu
const MenuSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPhotoRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: '-60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(rightPanelRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.to({}, {}, 0.3);

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(rightPanelRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const alaCarteItems = [
    { name: 'Nasi Goreng', price: 'RM 4' },
    { name: 'Nasi Goreng Telur', price: 'RM 6' },
    { name: 'Nasi Goreng Daging', price: 'RM 7' },
    { name: 'Nasi Goreng Ayam', price: 'RM 9' },
  ];

  const comboItems = [
    { name: 'Nasi Goreng Daging Telur', price: 'RM 10' },
    { name: 'Nasi Goreng Ayam Telur', price: 'RM 11' },
    { name: 'Nasi Goreng Special', price: 'RM 12' },
    { name: 'Nasi Goreng Ayam Double', price: 'RM 13' },
  ];

  return (
    <section id="menu" ref={sectionRef} className="section-pinned z-40 bg-[#0B0B0C]">
      {/* Left Photo Card */}
      <div 
        ref={leftPhotoRef}
        className="absolute card-rounded will-change-transform"
        style={{ left: '5vw', top: '12vh', width: '40vw', height: '76vh' }}
      >
        <img 
          src="/menu_rice.jpg" 
          alt="Nasi Goreng"
          className="w-full h-full object-cover img-grade"
        />
      </div>

      {/* Right Panel - Menu */}
      <div 
        ref={rightPanelRef}
        className="absolute card-rounded will-change-transform bg-[#141414] overflow-y-auto"
        style={{ left: '48vw', top: '12vh', width: '47vw', height: '76vh', padding: '4vh 3vw' }}
      >
        <h2 className="headline-lg text-[clamp(1.8rem,4vw,3rem)] text-[#F4F4F4] mb-6">
          MENU
        </h2>

        {/* Ala Carte */}
        <div className="menu-category">Ala Carte</div>
        <div className="mb-6">
          {alaCarteItems.map((item, index) => (
            <div key={index} className="menu-item">
              <span className="text-[#F4F4F4]">{item.name}</span>
              <span className="price-pill">{item.price}</span>
            </div>
          ))}
        </div>

        {/* Combo */}
        <div className="menu-category">Combo</div>
        <div>
          {comboItems.map((item, index) => (
            <div key={index} className="menu-item">
              <span className="text-[#F4F4F4]">{item.name}</span>
              <span className="price-pill">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section 5: Open Daily
const OpenDailySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPhotoRef = useRef<HTMLDivElement>(null);
  const rightTopPhotoRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: '-60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(rightTopPhotoRef.current,
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(rightBottomRef.current,
        { y: '60vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo(headlineRef.current,
        { x: '12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo(hoursRef.current,
        { y: '4vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      )
      .fromTo(ctaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'back.out(1.6)' },
        0.18
      )
      .fromTo(stampRef.current,
        { scale: 0.4, rotate: -90, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.7)' },
        0.12
      );

      scrollTl.to({}, {}, 0.3);

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftPhotoRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(rightTopPhotoRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(rightBottomRef.current,
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-8vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(hoursRef.current,
        { y: 0, opacity: 1 },
        { y: '3vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo(ctaRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.9, opacity: 0, ease: 'power2.in' },
        0.74
      )
      .fromTo(stampRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.7, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-50 bg-[#0B0B0C]">
      {/* Left Photo Card */}
      <div 
        ref={leftPhotoRef}
        className="absolute card-rounded will-change-transform"
        style={{ left: '5vw', top: '12vh', width: '34vw', height: '76vh' }}
      >
        <img 
          src="/storefront_left.jpg" 
          alt="Storefront"
          className="w-full h-full object-cover img-grade"
        />
      </div>

      {/* PARKING Stamp - Hidden but code kept */}
      <div 
        ref={stampRef}
        className="absolute will-change-transform hidden"
        style={{ left: '9vw', top: '18vh' }}
      >
        <CircularStamp text="PARKING" size={100} />
      </div>

      {/* Right Top Photo Card */}
      <div 
        ref={rightTopPhotoRef}
        className="absolute card-rounded will-change-transform"
        style={{ left: '42vw', top: '12vh', width: '53vw', height: '38vh' }}
      >
        <img 
          src="/store_interior.jpg" 
          alt="Store Interior"
          className="w-full h-full object-cover img-grade"
        />
      </div>

      {/* Right Bottom Panel */}
      <div 
        ref={rightBottomRef}
        className="absolute card-rounded will-change-transform bg-[#141414] flex flex-col justify-center"
        style={{ left: '42vw', top: '54vh', width: '53vw', height: '34vh', padding: '4vh 4vw' }}
      >
        {/* Headline */}
        <div ref={headlineRef} className="will-change-transform">
          <h2 className="headline-lg text-[clamp(2.5rem,6vw,5rem)] text-[#F4F4F4]">
            <span className="block">OPEN</span>
            <span className="block">WEEKDAYS</span>
          </h2>
        </div>

        {/* Hours */}
        <div ref={hoursRef} className="mt-4 will-change-transform">
          <p className="text-xl text-[#B8B8B8] font-mono-accent">10AM – 5PM</p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="absolute will-change-transform" style={{ right: '4vw', bottom: '4vh' }}>
          <a 
            href="https://maps.google.com/?q=NASI+GORENG+MINANG+TAKANA+JUO+Kuala+Lumpur"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Get Directions
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

// Section 6: Reviews
const ReviewsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(headingRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.5,
          }
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.review-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              end: 'top 45%',
              scrub: 0.5,
            }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const reviews = [
    {
      quote: "Best nasi goreng in the town. Crispy chicken, smoky wok hei—perfect.",
      author: "Aisyah",
      rating: 5
    },
    {
      quote: "Fast, hot, and consistent. We come every weekend.",
      author: "Rizal",
      rating: 5
    },
    {
      quote: "Simple menu done right. The sambal hits different.",
      author: "Hafiz",
      rating: 5
    }
  ];

  return (
    <section id="reviews" ref={sectionRef} className="relative z-[60] bg-[#0B0B0C] py-[10vh] px-[6vw]">
      {/* Heading */}
      <div ref={headingRef} className="mb-12">
        <h2 className="headline-lg text-[clamp(2rem,5vw,4rem)] text-[#F4F4F4]">
          <span className="block">CUSTOMER</span>
          <span className="block text-[#FF6A00]">LOVE</span>
        </h2>
        <p className="mt-4 text-[#B8B8B8]">Real plates. Real people. Real reviews.</p>
      </div>

      {/* Review Cards */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#FF6A00] text-[#FF6A00]" />
              ))}
            </div>
            <p className="text-[#F4F4F4] mb-4 leading-relaxed">"{review.quote}"</p>
            <p className="text-[#B8B8B8] text-sm">— {review.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Section 7: Order / Location
const OrderSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.5,
          }
        }
      );

      gsap.fromTo(leftColRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 45%',
            scrub: 0.5,
          }
        }
      );

      gsap.fromTo(rightColRef.current,
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 45%',
            scrub: 0.5,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="order" ref={sectionRef} className="relative z-[70] bg-[#0B0B0C] py-[10vh] px-[6vw]">
      {/* Heading */}
      <div ref={headingRef} className="mb-12">
        <h2 className="headline-lg text-[clamp(2rem,5vw,4rem)] text-[#F4F4F4]">
          <span className="block">TAPAU</span>
          <span className="block text-[#FF6A00]">IT NOW</span>
        </h2>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Order */}
        <div ref={leftColRef}>
          <h3 className="text-lg font-semibold text-[#F4F4F4] mb-6">Delivery Partners</h3>
          
          {/* Delivery Buttons with Logos */}
          <div className="flex flex-col gap-4 mb-8">
            <a 
              href="https://www.grab.com/my/food/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#00B14F] text-white px-6 py-4 rounded-2xl font-semibold transition-transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="text-xl">GrabFood</span>
            </a>
            <a 
              href="https://www.foodpanda.my/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#D70F64] text-white px-6 py-4 rounded-2xl font-semibold transition-transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">fp</span>
              </div>
              <span className="text-xl">foodpanda</span>
            </a>
          </div>

          {/*<button className="btn-primary w-full">Order Pickup</button>*/}
        </div>

        {/* Right Column - Location */}
        <div ref={rightColRef}>
          <h3 className="text-lg font-semibold text-[#F4F4F4] mb-6">Visit Us</h3>
          
          <div className="bg-[#141414] rounded-[28px] p-6 mb-6">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/takanajuoofficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#B8B8B8] hover:text-[#FF6A00] transition-colors mb-4"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </a>

            {/* Address as clickable link */}
            <a 
              href="https://www.google.com/maps?q=NASI+GORENG+MINANG+TAKANA+JUO+Kuala+Lumpur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-[#B8B8B8] hover:text-[#FF6A00] transition-colors mb-4"
            >
              <MapPin size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[#F4F4F4] font-medium block">Takana Juo</span>
                <span className="text-sm block">69, Jalan Haji Yahya Sheikh Ahmad</span>
                <span className="text-sm block">Kampung Baru, 50300 Kuala Lumpur</span>
              </div>
            </a>
            
            {/* Phone */}
            <a href="tel:+60123456789" className="flex items-center gap-3 text-[#B8B8B8] hover:text-[#FF6A00] transition-colors mb-4">
              <Phone size={20} />
              <span>+60 12-345-6789</span>
            </a>

            {/* Email */}
            {/*<a href="mailto:hello@takanajuo.my" className="flex items-center gap-3 text-[#B8B8B8] hover:text-[#FF6A00] transition-colors">
              <Mail size={20} />
              <span>hello@takanajuo.my</span>
            </a>*/}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <LogoPlaceholder size={32} />
            <div className="font-display font-bold text-lg tracking-wide">TAKANA JUO</div>
          </div>
          
          <p className="text-[#B8B8B8] text-sm">
            © 2024 Takana Juo. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
};

// Main App Component
function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global snap configuration for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        }
      });
    };

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-[#0B0B0C]">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Sections */}
      <main className="relative">
        <HeroSection />
        <BrandSection />
        <RecipeSection />
        <MenuSection />
        <OpenDailySection />
        <ReviewsSection />
        <OrderSection />
      </main>
    </div>
  );
}

export default App;
