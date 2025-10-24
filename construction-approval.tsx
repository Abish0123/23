
import React, { useState, useEffect, useRef, memo, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

const servicesSubLinks = [
  { name: 'Architectural Design', href: 'architectural-design.html', icon: 'fas fa-archway', description: 'Innovative and functional spaces from concept to construction.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60' },
  { name: 'Engineering Consultancy', href: 'engineering-consultancy.html', icon: 'fas fa-cogs', description: 'Expert technical advice and solutions for robust project outcomes.', image: 'https://images.unsplash.com/photo-1518692113669-e34fa251a37c?w=800&auto=format&fit=crop&q=60' },
  { name: 'Project Management Consultancy', href: 'project-management.html', icon: 'fas fa-tasks', description: 'Overseeing projects from inception to completion on time and budget.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60' },
  { name: 'Sustainability & Energy', href: 'sustainability-energy.html', icon: 'fas fa-leaf', description: 'Integrating green principles for environmentally responsible designs.', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60' },
  { name: 'Construction Approval', href: 'construction-approval.html', icon: 'fas fa-check-double', description: 'Navigating regulatory hurdles to secure all necessary construction permits and approvals efficiently.', image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800&auto=format&fit=crop&q=60' },
];

const navLinks = [
  { name: 'Home', href: '/index.html' },
  { name: 'About Us', href: '/about.html' },
  { name: 'Works/Projects', href: '/works.html' },
  { name: 'Services', href: '/index.html#our-services', subLinks: servicesSubLinks },
  { name: 'Blog', href: '/index.html#blog' },
  { name: 'Careers', href: '/careers.html' },
  { name: 'Contact', href: '/contact.html' },
];

// @Fix: Converted AppLink to use React.forwardRef to properly handle refs passed from parent components like Header.
const AppLink = React.forwardRef<HTMLAnchorElement, {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}>(({ href, className = '', children, onClick, ...props }, ref) => {
    const isToggle = href === '#';

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (isToggle) {
            e.preventDefault();
        }
        
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <a 
            ref={ref}
            href={href} 
            className={className} 
            onClick={onClick ? handleClick : undefined} 
            {...props}
        >
            {children}
        </a>
    );
});

const MobileNav = ({ isOpen, onClose }) => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const navContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const focusableElements = navContainerRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            setTimeout(() => firstElement.focus(), 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }
                if (e.key === 'Tab') {
                    if (e.shiftKey) { 
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { 
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };
            
            const container = navContainerRef.current;
            container?.addEventListener('keydown', handleKeyDown);
            return () => container?.removeEventListener('keydown', handleKeyDown);

        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, onClose]);

    const handleServicesToggle = () => {
        setIsServicesOpen(prev => !prev);
    }
    
    return (
        <div ref={navContainerRef} className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!isOpen} id="mobile-nav">
            <nav className="mobile-nav">
                <ul>
                    {navLinks.map(link => (
                         <li key={link.name}>
                             <AppLink 
                                href={link.subLinks ? '#' : link.href} 
                                // @Fix: Wrapped parameter-less event handlers in arrow functions to match expected signature.
                                onClick={link.subLinks ? handleServicesToggle : () => onClose()}
                                aria-haspopup={!!link.subLinks}
                                aria-expanded={link.subLinks ? isServicesOpen : undefined}
                                aria-controls={link.subLinks ? `mobile-${link.name}-submenu` : undefined}
                                id={link.subLinks ? `mobile-${link.name}-toggle` : undefined}
                             >
                                 {link.name}
                                 {link.subLinks && <i className={`fas fa-chevron-down dropdown-indicator ${isServicesOpen ? 'open' : ''}`} aria-hidden="true"></i>}
                             </AppLink>
                             {link.subLinks && (
                                 <ul id={`mobile-${link.name}-submenu`} className={`mobile-submenu ${isServicesOpen ? 'open' : ''}`} aria-hidden={!isServicesOpen}>
                                     {link.subLinks.map(subLink => (
                                         // @Fix: Wrapped parameter-less event handlers in arrow functions to match expected signature and fixed JSX structure.
                                         <li key={subLink.name}>
                                            <AppLink href={subLink.href} onClick={() => onClose()}>{subLink.name}</AppLink>
                                         </li>
                                     ))}
                                 </ul>
                             )}
                         </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const SkipToContentLink = () => (
    <a href="#main-content" className="skip-to-content-link">
        Skip to main content
    </a>
);

const Header = ({ theme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  
  const burgerMenuRef = useRef<HTMLButtonElement>(null);
  const servicesToggleRef = useRef<HTMLAnchorElement>(null);
  const servicesDropdownContainerRef = useRef<HTMLLIElement>(null);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(prev => !prev);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    burgerMenuRef.current?.focus();
  };

  const closeServicesDropdown = (shouldFocusToggle = true) => {
    if (isServicesDropdownOpen) {
      setIsServicesDropdownOpen(false);
      if (shouldFocusToggle) {
        servicesToggleRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (isServicesDropdownOpen) {
      // @Fix: Added explicit type to assist TypeScript's type inference.
      const firstItem: HTMLAnchorElement | null = servicesDropdownContainerRef.current?.querySelector('.dropdown-menu a');
      firstItem?.focus();
    }
  }, [isServicesDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeServicesDropdown();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownContainerRef.current && !servicesDropdownContainerRef.current.contains(event.target as Node)) {
        closeServicesDropdown(false);
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsServicesDropdownOpen(prev => !prev);
  };

  const handleDropdownItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    // @Fix: Added explicit type to assist TypeScript's type inference.
    const items: HTMLAnchorElement[] = Array.from(
      servicesDropdownContainerRef.current?.querySelectorAll<HTMLAnchorElement>('.dropdown-link-item') || []
    );
    const currentIndex = items.indexOf(e.currentTarget);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === items.length - 1) {
      closeServicesDropdown(false);
    } else if (e.key === 'Tab' && e.shiftKey && currentIndex === 0) {
      closeServicesDropdown(false);
    }
  };
  
  const headerClasses = `app-header ${scrolled ? 'scrolled' : ''} on-${theme}`;

  return (
    <header className={headerClasses}>
      <div className="logo">
        <AppLink href="/index.html">
          <img src="https://res.cloudinary.com/dj3vhocuf/image/upload/v1760896759/Blue_Bold_Office_Idea_Logo_250_x_80_px_7_uatyqd.png" alt="Taj Consultancy Logo" className="logo-image" />
        </AppLink>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <ul>
          {navLinks.map((link) => (
             <li 
              key={link.name} 
              className={`${link.subLinks ? 'has-dropdown' : ''} ${link.name === 'Services' && isServicesDropdownOpen ? 'open' : ''}`}
              ref={link.name === 'Services' ? servicesDropdownContainerRef : null}
            >
              <AppLink 
                ref={link.name === 'Services' ? servicesToggleRef : null}
                href={link.href}
                id={link.name === 'Services' ? 'services-menu-toggle' : undefined}
                onClick={link.name === 'Services' ? handleServicesClick : undefined}
                aria-haspopup={!!link.subLinks}
                aria-expanded={link.name === 'Services' ? isServicesDropdownOpen : undefined}
                aria-controls={link.name === 'Services' ? 'services-dropdown-menu' : undefined}
              >
                {link.name}
                {link.subLinks && (
                  <span className="dropdown-indicator-wrapper">
                    <i className="fas fa-chevron-down dropdown-indicator" aria-hidden="true"></i>
                  </span>
                )}
              </AppLink>
              {link.subLinks && (
                <div id="services-dropdown-menu" className="dropdown-menu" role="menu" aria-labelledby="services-menu-toggle">
                  <ul className="dropdown-links" role="none">
                      {link.subLinks.map((subLink, index) => (
                          <li role="presentation" key={subLink.name}>
                              <AppLink
                                  href={subLink.href}
                                  role="menuitem"
                                  onKeyDown={handleDropdownItemKeyDown}
                                  className="dropdown-link-item"
                                  onClick={() => setIsServicesDropdownOpen(false)}
                                  style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
                              >
                                  <i className={`${subLink.icon} dropdown-link-icon`} aria-hidden="true"></i>
                                  <span>{subLink.name}</span>
                              </AppLink>
                          </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button
        ref={burgerMenuRef}
        className={`burger-menu ${isMobileNavOpen ? 'open' : ''}`}
        onClick={toggleMobileNav}
        aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="mobile-nav"
        aria-expanded={isMobileNavOpen}
      >
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
      </button>
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </header>
  );
};

const LeftSidebar = () => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-top">
        <div className="divider" />
        <div className="home-text">SERVICES</div>
      </div>
      <div className="social-icons">
        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
        <a href="#" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="#" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
      </div>
      <div className="sidebar-footer">
        <p>© Taj Consultancy 2024. All rights reserved.</p>
      </div>
    </aside>
  );
};

const WaveAnimation = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        const waves = [
            { amp: 15, freq: 0.02, phase: 0, color: 'rgba(212, 175, 55, 0.2)', speed: 0.01 },
            { amp: 20, freq: 0.015, phase: 1, color: 'rgba(212, 175, 55, 0.3)', speed: 0.015 },
            { amp: 25, freq: 0.01, phase: 2, color: 'rgba(212, 175, 55, 0.4)', speed: 0.02 },
        ];
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            waves.forEach(wave => {
                wave.phase += wave.speed;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                for (let x = 0; x < canvas.width; x++) {
                    const y = Math.sin(x * wave.freq + wave.phase) * wave.amp + (canvas.height / 1.5);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fillStyle = wave.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} id="footer-wave-canvas" aria-hidden="true" />;
});

// @Fix: Corrected the CustomCursor component by adding the missing JSX return statement.
const CustomCursor = memo(() => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const dot = dotRef.current;
        const outline = outlineRef.current;
        if (!dot || !outline) return;

        gsap.set([dot, outline], { xPercent: -50, yPercent: -50 });

        const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
        const outlineX = gsap.quickTo(outline, "x", { duration: 0.3, ease: "power3" });
        const outlineY = gsap.quickTo(outline, "y", { duration: 0.3, ease: "power3" });

        const mouseMove = (e: MouseEvent) => {
            dotX(e.clientX);
            dotY(e.clientY);
            outlineX(e.clientX);
            outlineY(e.clientY);
        };
        
        const showCursor = () => {
            dot.classList.add('visible');
            outline.classList.add('visible');
        };
        const hideCursor = () => {
            dot.classList.remove('visible');
            outline.classList.remove('visible');
        };
        
        const handleMouseEnterHoverTarget = () => {
            dot.classList.add('cursor-hover');
            outline.classList.add('cursor-hover');
        };

        const handleMouseLeaveHoverTarget = () => {
            dot.classList.remove('cursor-hover');
            outline.classList.remove('cursor-hover');
        };
        
        window.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseleave", hideCursor);
        document.body.addEventListener("mouseenter", showCursor);

        const hoverTargets = document.querySelectorAll(
            'a, button, [role="button"], .whatsapp-widget, .carousel-dot, .carousel-nav-btn, .project-card'
        );
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', handleMouseEnterHoverTarget);
            target.addEventListener('mouseleave', handleMouseLeaveHoverTarget);
        });

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            document.body.removeEventListener("mouseleave", hideCursor);
            document.body.removeEventListener("mouseenter", showCursor);
            hoverTargets.forEach(target => {
                target.removeEventListener('mouseenter', handleMouseEnterHoverTarget);
                target.removeEventListener('mouseleave', handleMouseLeaveHoverTarget);
            });
        };
    }, []);

    return (
        <>
            <div ref={outlineRef} className="custom-cursor-outline"></div>
            <div ref={dotRef} className="custom-cursor-dot"></div>
        </>
    );
});

const WhatsAppChatWidget = () => (
    <a
        href="https://wa.me/97477123400"
        className="whatsapp-widget"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
    >
        <div className="whatsapp-ring"></div>
        <div className="whatsapp-ring-delay"></div>
        <i className="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i>
    </a>
);

const CallToAction = () => (
    <section className="cta-section scroll-trigger fade-up">
        <div className="container">
            <h2 className="scroll-trigger fade-up" style={{ transitionDelay: '0.1s' }}>Let's Build the Future Together</h2>
            <p className="scroll-trigger fade-up" style={{ transitionDelay: '0.2s' }}>
                Have a vision for your next project? Our team of experts is ready to help you bring it to life. Contact us today to discuss your ideas.
            </p>
            <a href="contact.html" className="cta-button scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>Get in Touch</a>
        </div>
    </section>
);

const ServicePage = () => {
  const [loading, setLoading] = useState(true);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    document.body.style.backgroundColor = '#fff';
    const timer = setTimeout(() => setLoading(false), 200);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { document.querySelectorAll('.scroll-trigger').forEach(el => el.classList.add('visible')); return; }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elementsToReveal = document.querySelectorAll('.scroll-trigger');
    elementsToReveal.forEach((el) => observer.observe(el));
    
    return () => {
        document.body.style.backgroundColor = '';
        clearTimeout(timer);
        elementsToReveal.forEach((el) => observer.unobserve(el));
    }
  }, []);

  return (
    <div className={`app ${loading ? 'loading' : ''}`}>
      <SkipToContentLink />
      <CustomCursor />
      <WhatsAppChatWidget />
      <Header theme="light" />
      <div className="main-container">
        <LeftSidebar />
        <main className="main-content" id="main-content" tabIndex={-1}>
          <section className="service-hero-section scroll-trigger fade-up" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=1200&auto=format&fit=crop&q=60')` }}>
            <div className="container">
              <h1 className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>Construction <strong>Approval</strong></h1>
            </div>
          </section>

          <section className="content-section">
            <div className="container">
              <div className="service-main-content scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                <h2 className="section-title">Approvals</h2>
                <p>Aligned with client objectives, we secure the right approvals, in the right order, with minimal rework. Our Authority Liaison team manages end-to-end submissions and inspections across Qatar’s agencies—Baladiya (MME), QCDD (Civil Defense), KAHRAMAA, Ashghal, Ooredoo/Vodafone, Qatar Cool, MOCI, and special authorities (MoH, MoE, QFZA, QFC) when applicable.</p>
                <p>From feasibility and code checks to shop drawings, portal submissions, site inspections, and final Completion Certificate, we keep your project compliant and on schedule.</p>
                <p>With deep knowledge of QCS, NFPA 101 Life Safety, local fire & MEP codes, signage and fit-out rules, we streamline coordination between designers, contractors and authorities—reducing iteration loops and accelerating approvals.</p>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Our Construction Approval Services include:</h3>
                
                <h4 style={{fontWeight: 700, fontSize: '18px', marginBottom: '15px', color: '#111'}}>Permitting & NOCs</h4>
                <ul className="service-list" style={{columnCount: 1, marginBottom: '30px'}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Baladiya Building Permit, Fit-Out Permit, Change of Use, Mezzanine/partition approvals</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>QCDD: Fire & Life Safety drawings, hydraulic calculations, material approvals, inspections & final acceptance</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>KAHRAMAA: Electrical load application, SLD approvals, meter releases; Water/Plumbing NOC</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Ashghal: Drainage connections, road opening NOC (if required)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Telecom & Cooling: Ooredoo/Vodafone pathways NOC; Qatar Cool capacity NOC</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Signage/Facade permits (external & internal wayfinding)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Health/FOH permits for F&B, clinics, salons (when relevant)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Temporary Works permits: hoarding, scaffolding, cranes, road diversions</span></li>
                </ul>

                <h4 style={{fontWeight: 700, fontSize: '18px', marginBottom: '15px', color: '#111'}}>Technical Submissions & Drawings</h4>
                <ul className="service-list" style={{columnCount: 1, marginBottom: '30px'}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Authority-compliant architectural, structural, and MEP drawings (CAD/Revit)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Fire alarm, sprinkler, emergency lighting, ventilation & smoke control</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Load calculations (ETABS/SAP/SAFE), SLDs, pump room schematics, shop drawings, as-builts</span></li>
                </ul>

                <h4 style={{fontWeight: 700, fontSize: '18px', marginBottom: '15px', color: '#111'}}>Code & Compliance</h4>
                <ul className="service-list" style={{columnCount: 1, marginBottom: '30px'}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>QCS, NFPA 101, QCDD guidelines, ADA/accessibility, egress & occupant load checks</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Energy & ventilation requirements (IAQ), acoustic, lighting LUX and diversity checks</span></li>
                </ul>

                <h4 style={{fontWeight: 700, fontSize: '18px', marginBottom: '15px', color: '#111'}}>Project Administration</h4>
                <ul className="service-list" style={{columnCount: 1, marginBottom: '30px'}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Portal creation & tracking, fee calculations, receipts, correspondence logs</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Inspection scheduling and close-out snag management</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Completion Certificate / Building Completion documentation set</span></li>
                </ul>

                <h4 style={{fontWeight: 700, fontSize: '18px', marginBottom: '15px', color: '#111'}}>Business & Licensing Alignment</h4>
                <ul className="service-list" style={{columnCount: 1, marginBottom: '30px'}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>MOCI activity matching (e.g., Business Center 25% rule, change of activity)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>QFC/QFZA liaison where jurisdiction differs</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Mall/landlord fit-out handbook compliance</span></li>
                </ul>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Our 6-Step Approval Process</h3>
                <ol className="service-list" style={{listStyleType: 'decimal', paddingLeft: '20px', columnCount: 1}}>
                    <li><span><strong>Feasibility & Code Scan</strong> – review base-build constraints, egress, loads, fire strategy, activity compliance.</span></li>
                    <li><span><strong>Authority Strategy & Timeline</strong> – map required NOCs, sequence, fees, and critical path.</span></li>
                    <li><span><strong>Drawings & Calculations</strong> – prepare/adjust A-S-MEP and FLS packages to authority standards.</span></li>
                    <li><span><strong>Submissions</strong> – lodge through relevant portals; respond to comments/RFIs swiftly.</span></li>
                    <li><span><strong>Inspections</strong> – coordinate contractors, pre-snag, accompany authorities, close comments.</span></li>
                    <li><span><strong>Close-Out</strong> – obtain approvals, Completion Certificate, meter energization, and as-builts.</span></li>
                </ol>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Typical Timeframes (guidance only)</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Fit-out permit (Baladiya): ~2–4 weeks after complete submission</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>QCDD drawing approval: ~2–3 weeks; site acceptance: +1–2 weeks post-readiness</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>KAHRAMAA meter release: ~1–3 weeks after SLD approval & site readiness</span></li>
                </ul>
                <p style={{color: '#555', marginTop: '-10px', marginBottom: '30px'}}>(Durations vary by scope, landlord requirements, and submission quality.)</p>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Deliverables You Receive</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Approved permit sets (stamped PDFs), NOCs, approval letters</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Inspection reports, comment trackers, close-out documentation</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>As-built drawings, O&M manuals (if required), Completion Certificate</span></li>
                </ul>
                
                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>What We Need From You (Checklist)</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Title deed/lease & landlord NOC</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>CR/QID copies (company & representative), Consultant/Contractor appointments</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Base-build drawings, tenancy layout, materials/equipment specs</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Existing KAHRAMAA account details (if any)</span></li>
                </ul>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Why Choose Us</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Local authority specialists with proven relationships and submission templates</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>One team covering Architecture, MEP, Structural, and Fire—fewer iterations</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Transparent tracking & weekly status reports until certificate in hand</span></li>
                </ul>
              </div>

              <hr style={{margin: '80px 0', border: 'none', borderTop: '1px solid #eee'}} />

              <div className="service-main-content scroll-trigger fade-up">
                <h2 className="section-title">BIM & 3D Visualization</h2>
                <p>We deliver coordinated, constructible BIM models and photorealistic visuals that cut rework, speed approvals, and help clients make faster decisions. From LOD-defined authoring to clash detection, 4D/5D planning, and VR walk-throughs, our team supports projects across design, tender, construction, and handover.</p>
                <p>We work to ISO 19650 principles with IFC-based exchange and clear model responsibilities, ensuring smooth coordination between Architecture, Structure, and MEP—and alignment with Qatar authority requirements (Baladiya/QCDD submissions, KAHRAMAA loads, as-built deliverables).</p>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Our BIM & 3D Visualization services include:</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>BIM Authoring (Revit/Civil 3D) – Architectural, Structural, and MEP systems, LOD 200–400; families/content creation.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Model Coordination & Clash Detection – Navisworks/ACC Model Coordination, issue tracking (BIM 360/Autodesk Construction Cloud).</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>4D / 5D Simulation – Link model to schedule (Primavera/MSP) and cost (BoQ), visualize phasing and cashflow curves.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Quantity Take-Off (QTO) – Model-based quantification and cost checks; VE alternatives.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Construction Sequencing & Site Logistics – Animated build sequence, hoarding/crane layouts, temporary works.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Shop Drawings & As-Builts – Coordinated layouts, sleeve/opening drawings, penetration drawings, COBie asset data.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>BIM for Authority Submissions – Extract 2D sheets, fire & life safety views, schedules for QCDD/Baladiya.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>3D Visualization – Photorealistic renders, aerials, material boards; Enscape/Lumion/Twinmotion animations.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Immersive Reviews – Web/VR walk-throughs, stakeholder design reviews, options comparison.</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Digital Handover – COBie/IFC for FM, asset tagging, O&M links, model health checks.</span></li>
                </ul>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Workflow we follow</h3>
                <ol className="service-list" style={{listStyleType: 'decimal', paddingLeft: '20px', columnCount: 1}}>
                    <li><span><strong>Kickoff & BEP</strong> – Define BIM Execution Plan (standards, LOD, naming, CDE, responsibilities).</span></li>
                    <li><span><strong>Model Setup</strong> – Shared coordinates, levels/grids, worksets, templates; federated model strategy.</span></li>
                    <li><span><strong>Authoring & QA</strong> – Discipline models with weekly QA; parameter and family standards.</span></li>
                    <li><span><strong>Coordination</strong> – Regular clash sessions; issue logs with due dates and owners.</span></li>
                    <li><span><strong>4D/5D & Visuals</strong> – Link programme and cost; produce renders/animations and option studies.</span></li>
                    <li><span><strong>Deliverables & Handover</strong> – Sheets, QTOs, as-builts, COBie/IFC, viewer files; training for client/contractor.</span></li>
                </ol>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Software Stack</h3>
                <p>Autodesk Revit, Navisworks Manage, ACC/BIM 360, AutoCAD, Civil 3D, Dynamo (automation), ETABS/SAP/SAFE (structural refs), Enscape/Lumion/Twinmotion (visuals), Unreal/Sketchfab (web), Excel/Power BI (cost/quantities).</p>
                
                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Typical Deliverables</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Federated RVT/NWD & IFC models, discipline models</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Coordination reports & clash matrices, issue tracker</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>2D sheets (plans/sections/details), shop drawings</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>QTO/BoQ extracts; 4D simulations; cost snapshots</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>High-resolution stills, animations, web/VR walkthroughs</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>As-builts and COBie asset registers for FM</span></li>
                </ul>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>Benefits</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Fewer site clashes & variations (early detection)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Faster approvals via clear, authority-ready outputs</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Transparent cost & time with 4D/5D visibility</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Better client buy-in using visuals & VR reviews</span></li>
                </ul>

                <h3 className="section-title" style={{fontSize: '24px', marginTop: '40px'}}>What we need from you</h3>
                <ul className="service-list" style={{columnCount: 1}}>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Base-build drawings/surveys, project brief, brand/material palette</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Agreed schedule/cost data for 4D/5D (when applicable)</span></li>
                    <li><i className="fas fa-check-circle" aria-hidden="true"></i><span>Contractor/consultant appointments & CDE access</span></li>
                </ul>
              </div>
            </div>
          </section>

          <CallToAction />

          <footer id="footer" className="app-footer">
            <WaveAnimation />
            <div className="container">
                <div className="copyright-section">
                    <span>2024 © Taj Consultancy. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ServicePage />);
