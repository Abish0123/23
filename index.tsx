
import React, { useState, useEffect, useRef, memo, createContext, useContext, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

// --- DATA & CONFIG ---

const servicesSubLinks = [
  { name: 'Architectural Design', href: 'architectural-design.html', icon: 'fas fa-archway', description: 'Innovative and functional spaces from concept to construction.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60' },
  { name: 'Interior Design & Fit-Out', href: 'interior-design.html', icon: 'fas fa-couch', description: 'From concept to handover: layouts, materials, FF&E, site supervision, and code-compliant delivery.', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=60' },
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

// --- SHARED & LAYOUT COMPONENTS ---

const SkipToContentLink = () => (
    <a href="#main-content" className="skip-to-content-link">
        Skip to main content
    </a>
);


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
                                         <li key={subLink.name}>
                                            {/* @Fix: Wrapped parameter-less event handlers in arrow functions to match expected signature. */}
                                            <AppLink href={subLink.href} onClick={() => onClose()}>
                                                {subLink.name}
                                            </AppLink>
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

const Header = ({ theme }) => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => navRef.current?.classList.add('animate-in'), 300);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
    };
  }, []);

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsServicesDropdownOpen(prev => !prev);
  };
  
  const handleDropdownItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    // @Fix: Added explicit type to assist TypeScript's type inference.
    const items: HTMLAnchorElement[] = Array.from(
      servicesDropdownContainerRef.current?.querySelectorAll('.dropdown-link-item') || []
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
      <nav className="main-nav" aria-label="Main navigation">
        <ul ref={navRef}>
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
      <div className="logo">
        <AppLink href="/index.html">
          <img src="https://res.cloudinary.com/dj3vhocuf/image/upload/v1762341232/DESign_220_x_60_px_abhv5e.png" alt="Taj Design Consultancy Logo" className="logo-image" />
        </AppLink>
      </div>
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

const LeftSidebar = ({ pageName }) => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-top">
        <div className="divider" />
        <div className="home-text">{pageName}</div>
      </div>
      <div className="social-icons">
        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
        <a href="#" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="#" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
      </div>
      <div className="sidebar-footer">
        <p>© Taj Design Consultancy 2024. All rights reserved.</p>
      </div>
    </aside>
  );
};

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer id="footer" className="app-footer scroll-trigger fade-up">
            <WaveAnimation />
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-item footer-logo scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                        <div className="logo-text">Taj Design Consultancy</div>
                        <p>Our team takes over everything, from an idea and concept development to realization. We believe in traditions and incorporate them within our innovations.</p>
                         <div className="footer-contact-info">
                            <p><i className="fas fa-phone" aria-hidden="true"></i> <a href="tel:+97477123400">+974 7712 3400</a></p>
                            <p><i className="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:info@tajdc.com">info@tajdc.com</a></p>
                            <p><i className="fas fa-map-marker-alt" aria-hidden="true"></i> 14th floor, Al Jazeera tower, Westbay, Doha Qatar</p>
                        </div>
                    </div>
                    <div className="footer-item scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                        <h4>Get in Touch</h4>
                        <ContactForm />
                    </div>
                </div>
                <div className="copyright-section">
                    <span>2024 © Taj Design Consultancy. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
    )
}

const ContactForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        if (!name.trim() || !email.trim() || !message.trim()) {
            alert('Please fill in all fields before sending.');
            return;
        }

        const subject = encodeURIComponent(`Contact Form Inquiry from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        );

        window.location.href = `mailto:info@tajdc.com?subject=${subject}&body=${body}`;
        
        setIsSubmitted(true);
    };

    return (
        <div className="contact-form-container">
            <form onSubmit={handleSubmit} className={`contact-form ${isSubmitted ? 'submitted' : ''}`} aria-hidden={isSubmitted}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name-footer">Name</label>
                        <input type="text" id="name-footer" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-footer">Email</label>
                        <input type="email" id="email-footer" name="email" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="message-footer">Message</label>
                    <textarea id="message-footer" name="message" rows={4} required></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
            </form>
            <div className={`success-message ${isSubmitted ? 'visible' : ''}`} aria-hidden={!isSubmitted} aria-live="polite">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <h3>Thank You!</h3>
                <p>Please complete sending your message in your email client.</p>
            </div>
        </div>
    );
};

// --- HOME PAGE & COMPONENTS ---
const ParticleCanvas = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        const particleCount = 150;

        class Particle {
            x: number; y: number; vx: number; vy: number; radius: number; color: string; shadowBlur: number;
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.2 + 0.3;
                const alpha = Math.random() * 0.7 + 0.1;
                this.color = `rgba(212, 175, 55, ${alpha})`; this.shadowBlur = Math.random() * 8 + 4;
            }
            draw() {
                ctx.save(); ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.shadowColor = 'rgba(212, 175, 55, 0.8)'; ctx.shadowBlur = this.shadowBlur;
                ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x > canvas.width + this.radius) this.x = -this.radius; else if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius; else if (this.y < -this.radius) this.y = canvas.height + this.radius;
                this.draw();
            }
        }
        
        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => particle.update());
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize(); animate();
        window.addEventListener('resize', handleResize);
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); };
    }, []);

    return <canvas ref={canvasRef} id="particle-canvas" />;
});

const BlueprintAnimation = memo(() => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const paths = document.querySelectorAll('.blueprint-path');
        if (!paths.length) return;

        const tl = gsap.timeline();
        paths.forEach(path => {
            const length = (path as SVGPathElement).getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        tl.to(paths, { strokeDashoffset: 0, duration: 4, ease: 'power1.inOut', stagger: 0.2, delay: 1.5 });
    }, []);

    return (
        <div className="blueprint-container" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
                <g>
                    <path className="blueprint-path" d="M 5,5 L 95,5 L 95,95 L 5,95 Z" />
                    <path className="blueprint-path" d="M 5,50 L 95,50" />
                    <path className="blueprint-path" d="M 50,5 L 50,95" />
                    <path className="blueprint-path" d="M 5,30 L 30,5" />
                    <path className="blueprint-path" d="M 70,5 L 95,30" />
                    <path className="blueprint-path" d="M 5,70 L 30,95" />
                    <path className="blueprint-path" d="M 70,95 L 95,70" />
                    <path className="blueprint-path" d="M 50,30 A 20,20 0 1,1 49.9,30.05" />
                    <path className="blueprint-path" d="M 50,30 L 50,15" />
                    <path className="blueprint-path" d="M 64.14,35.86 L 74.95,25.05" />
                    <path className="blueprint-path" d="M 70,50 L 85,50" />
                    <path className="blueprint-path" d="M 20,80 Q 35,70 50,80 T 80,80" />
                </g>
            </svg>
        </div>
    );
});

const HeroSection = () => {
    const [offsetY, setOffsetY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const titleLines = ["STRUCTURES WITH", "PURPOSE"];
    const fullTitle = titleLines.join(' ');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const handleScroll = () => setOffsetY(window.pageYOffset);
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e; const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth) - 0.5; const y = (clientY / innerHeight) - 0.5;
            setMousePos({ x, y });
        };

        window.addEventListener('scroll', handleScroll); window.addEventListener('mousemove', handleMouseMove);
        return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('mousemove', handleMouseMove); };
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            gsap.set('.letter', { opacity: 1 });
            return;
        }

        gsap.fromTo('.letter',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.8 }
        );
    }, []);

    const contentMouseParallax = 60;

    return (
        <section className="hero-section">
            <video autoPlay loop muted playsInline className="hero-video" src="https://videos.pexels.com/video-files/4120241/4120241-uhd_3840_2160_25fps.mp4" aria-hidden="true" />
            <BlueprintAnimation />
            <ParticleCanvas />
            <div className="hero-content" style={{
                transform: `translate(${mousePos.x * contentMouseParallax}px, ${(offsetY * 0.7) + (mousePos.y * contentMouseParallax)}px)`,
                opacity: Math.max(0, 1 - offsetY / (window.innerHeight * 0.8))
            }}>
                <h1 className="reveal-text" aria-label={fullTitle}>
                    {titleLines.map((line, lineIndex) => (
                        <div className="hero-title-line" key={lineIndex}>
                            {line.split(' ').map((word, wordIndex, words) => (
                                <React.Fragment key={wordIndex}>
                                    <span style={{ display: 'inline-block' }}>
                                        {word.split('').map((char, charIndex) => (
                                            <span className="letter" key={charIndex} aria-hidden="true">
                                                {char}
                                            </span>
                                        ))}
                                    </span>
                                    {wordIndex < words.length - 1 && (
                                        <span className="letter" aria-hidden="true">{'\u00A0'}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </h1>
                <a href={isMobile ? '/works.html' : '#works'} className="explore-btn">Explore Our Work</a>
            </div>
             <a href="#about" className="scroll-down-indicator" aria-label="Scroll down to about section">
                <i className="fas fa-arrow-down" aria-hidden="true"></i>
            </a>
        </section>
    );
};

const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (prefersReducedMotion) { setCount(end); return; }
                    const stepTime = Math.abs(Math.floor(duration / end));
                    timerRef.current = setInterval(() => {
                        start += 1; setCount(start);
                        if (start === end) { if (timerRef.current) clearInterval(timerRef.current); }
                    }, stepTime);
                    observer.disconnect();
                }
            }, { threshold: 0.5 }
        );

        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); if (timerRef.current) clearInterval(timerRef.current); };
    }, [end, duration]);

    return <div ref={ref} className="num">{count}</div>;
};

const TestimonialsCarousel = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        resetTimeout();
        timeoutRef.current = setTimeout(() => setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1), 5000);
        return () => resetTimeout();
    }, [currentIndex, testimonials.length]);

    const goToPrev = () => setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    const goToNext = () => setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    const goToSlide = (slideIndex) => setCurrentIndex(slideIndex);

    return (
        <div className="testimonials-carousel" aria-roledescription="carousel" aria-label="Customer testimonials">
             <div className="sr-only" aria-live="polite" aria-atomic="true">
                Showing testimonial {currentIndex + 1} of {testimonials.length}
            </div>
            <div className="testimonials-wrapper">
                <div className="testimonials-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {testimonials.map((testimonial, index) => (
                        <div className="testimonial-slide" key={index} role="group" aria-roledescription="slide" aria-hidden={currentIndex !== index}>
                            <div className="testimonial-card">
                                <img src={testimonial.image} alt={testimonial.alt} className="testimonial-avatar" />
                                <p className="testimonial-quote">"{testimonial.quote}"</p>
                                <span className="testimonial-author">{testimonial.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={goToPrev} className="carousel-btn prev" aria-label="Previous testimonial"><i className="fas fa-chevron-left" aria-hidden="true"></i></button>
            <button onClick={goToNext} className="carousel-btn next" aria-label="Next testimonial"><i className="fas fa-chevron-right" aria-hidden="true"></i></button>
            <div className="carousel-dots">
                {testimonials.map((_, slideIndex) => (
                    <div
                        key={slideIndex} role="button" tabIndex={0} aria-label={`Go to testimonial ${slideIndex + 1}`}
                        className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(slideIndex)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { goToSlide(slideIndex); }}}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const ClientsCarousel = () => {
    const clientLogos = [
        { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPTwxAXnyJ94XVj2GIYoPuZtQ0I5MJGpmreA&s", name: "Ministry of Interior, Qatar" },
        { url: "https://www.trustlinkqatar.com/assets/images/trustlinkqatar-logo-colored.png", name: "TrustLink Qatar" },
        { url: "https://pbs.twimg.com/profile_images/1508776406137856008/57PHPv7w_400x400.jpg", name: "Kahramaa" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338839/Untitled_bkksjc.png", name: "Regency Group Holding" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338838/Thyssenkrupp_AG_Logo_2015.svg_igmux4.png", name: "Thyssenkrupp" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338828/Maldives_Embassy_1_kwiwt1.png", name: "Embassy of Maldives" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338827/5_fzbier.png", name: "Al Jabor Group" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338827/logo_3_zeqqrp.png", name: "Milaha" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338827/Untitled_design_-_2025-11-05T160138.102_wazfbk.png", name: "World Wide Business Center" },
        { url: "https://res.cloudinary.com/dj3vhocuf/image/upload/v1762338827/Untitled_design_-_2025-11-05T155948.514_larixu.png", name: "Qatar Foundation" },
    ];
    
    // Duplicate logos for seamless scrolling effect
    const duplicatedLogos = [...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos];

    return (
        <div className="clients-scroller">
            <div className="clients-scroller-inner">
                {duplicatedLogos.map((logo, index) => (
                    <div className="client-logo" key={index}>
                        <img src={logo.url} alt={`${logo.name} Logo`} />
                    </div>
                ))}
            </div>
        </div>
    );
};


const ProjectGalleryModal = ({ project, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const lastFocusedElement = useRef<HTMLElement | null>(null);

    // For swipe functionality
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const goToPrevious = () => {
        if (!project) return;
        setCurrentIndex(prev => (prev === 0 ? project.gallery.length - 1 : prev - 1));
    };
    const goToNext = () => {
        if (!project) return;
        setCurrentIndex(prev => (prev === project.gallery.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (project) {
            setCurrentIndex(0);
            lastFocusedElement.current = document.activeElement as HTMLElement;
            setTimeout(() => modalRef.current?.focus(), 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
                else if (e.key === 'ArrowRight') goToNext();
                else if (e.key === 'ArrowLeft') goToPrevious();
                else if (e.key === 'Tab') {
                     const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (!focusableElements || focusableElements.length === 0) return;
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    if (e.shiftKey) { if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }}
                    else { if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }}
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => { 
                document.removeEventListener('keydown', handleKeyDown);
                lastFocusedElement.current?.focus();
            };
        }
    }, [project, onClose]);

    if (!project) return null;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (project.gallery.length > 1) {
            if (isLeftSwipe) {
                goToNext();
            } else if (isRightSwipe) {
                goToPrevious();
            }
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div className="project-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div ref={modalRef} className="project-modal-content" onClick={e => e.stopPropagation()} tabIndex={-1}>
                <button onClick={onClose} className="project-modal-close" aria-label="Close project gallery">&times;</button>
                <div className="project-modal-gallery">
                    <div className="gallery-main-image" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                        <img src={project.gallery[currentIndex]} alt={`${project.title} - Image ${currentIndex + 1}`} />
                        {project.gallery.length > 1 && (
                            <>
                                <button onClick={goToPrevious} className="gallery-nav-btn prev" aria-label="Previous image"><i className="fas fa-chevron-left"></i></button>
                                <button onClick={goToNext} className="gallery-nav-btn next" aria-label="Next image"><i className="fas fa-chevron-right"></i></button>
                            </>
                        )}
                    </div>
                    {project.gallery.length > 1 && (
                        <div className="gallery-thumbnails">
                            {project.gallery.map((img, index) => (
                                <button 
                                  key={index} 
                                  className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`} 
                                  onClick={() => setCurrentIndex(index)}
                                  aria-label={`View image ${index + 1}`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="project-modal-details">
                    <p className="modal-meta">{project.meta}</p>
                    <h3 id="modal-title" className="modal-title">{project.title}</h3>
                    <p className="modal-location"><i className="fas fa-map-marker-alt" aria-hidden="true"></i> {project.location}</p>
                    <p className="modal-description">{project.description}</p>
                </div>
            </div>
        </div>
    );
};

const SectionDivider = () => (
    <div className="section-divider-wrapper">
        <div className="section-divider" />
    </div>
);

const useSmoothScroll = () => {
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (anchor && anchor.hash && new URL(anchor.href).pathname === window.location.pathname) {
                const targetId = anchor.hash.substring(1);
                if (!targetId) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const header = document.querySelector<HTMLElement>('.app-header');
                    const headerOffset = header ? header.offsetHeight + 10 : 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        };
        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);
};

const HomePage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const factsContainerRef = useRef<HTMLDivElement | null>(null);
  const clientsContainerRef = useRef<HTMLDivElement | null>(null);
  
  useSmoothScroll();
  
  const workItems = [
    { 
      title: 'TrustLink office',
      meta: 'Design and Build of Office Interior',
      location: 'Bin Mahmoud',
      description: 'We provide end-to-end office interior design and on-site supervision—covering space planning, materials and finishes, MEP coordination, and quality control—to deliver functional, branded workplaces on time and within budget.',
      mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761224706/WhatsApp_Image_2025-10-22_at_23.46.06_e814e5d0_uqphxj.png',
      gallery: [
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761224706/WhatsApp_Image_2025-10-22_at_23.46.06_e814e5d0_uqphxj.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761224698/WhatsApp_Image_2025-10-22_at_23.46.07_714b8d87_1_eljwpn.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761224698/WhatsApp_Image_2025-10-22_at_23.46.07_d6db18c5_tovqbt.png'
      ],
      alt: 'Interior design of the modern TrustLink office in Bin Mahmoud, Doha.'
    },
    { 
      title: 'World Wide Business Center',
      meta: 'Design and Supervision of Office Interior',
      location: 'D Ring Road',
      description: 'World Wide Business Center — a 2,000 sqm office interior designed and supervised by our team — blends elegant aesthetics with high functionality, featuring a welcoming reception, multiple meeting rooms, a fully equipped conference room, collaborative zones, and a dedicated games area.',
      mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733626/Untitled_design_-_2025-10-29T155509.760_nzctlr.png',
      gallery: [
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733626/Untitled_design_-_2025-10-29T155509.760_nzctlr.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733626/Untitled_design_-_2025-10-29T155459.346_basulg.png',
      ],
      alt: 'Spacious and modern interior of World Wide Business Center on D Ring Road, Doha.'
    },
    { 
      title: 'Al Jabor Building',
      meta: 'Design and Municipality Approvals for Commercial Building',
      location: 'Al Hilal',
      description: 'Designed and delivered to meet the client’s specific requirements, this project involved a full interior reconfiguration of the commercial building based on a targeted market-demand analysis.',
      mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_2_aypzfx.png',
      gallery: [
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_2_aypzfx.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_3_m7smfu.png',
      ],
      alt: 'Architectural redesign of the Al Jabor commercial building in Al Hilal, Qatar.'
    },
  ];

  const testimonials = [
    { quote: "The design was flawless. Their attention to detail and coordination saved us significant time and budget on our high-rise project.", author: "Project Manager, High-Rise Development", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&auto=format&fit=crop&q=60", alt: "Portrait of a satisfied female project manager, a client of Taj Design Consultancy." },
    { quote: "The supervision and management for our villa were exceptional. The team was professional, transparent, and delivered beyond our expectations.", author: "Private Villa Owner, Doha", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&auto=format&fit=crop&q=60", alt: "Portrait of a satisfied male villa owner, a client of Taj Design Consultancy in Qatar." },
    { quote: "Their innovative approach to engineering challenges is commendable. Taj Design Consultancy is a reliable partner for any complex construction endeavor.", author: "Lead Architect, Hospitality Project", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=500&auto=format&fit=crop&q=60", alt: "Portrait of a satisfied lead architect, a client of Taj Design Consultancy." }
  ];

  const processSteps = [
    { title: 'Consult & Brief', icon: 'fas fa-clipboard-list', description: 'We start by listening. Understanding your vision, goals, and constraints is the foundation of our partnership.' },
    { title: 'Concept Options', icon: 'fas fa-lightbulb', description: 'Exploring possibilities. We develop multiple design concepts, presenting creative solutions that align with the brief.' },
    { title: 'Design Development', icon: 'fas fa-ruler-combined', description: 'Refining the vision. We flesh out the chosen concept with detailed drawings, material selections, and 3D models.' },
    { title: 'Docs & Tender', icon: 'fas fa-file-signature', description: 'Precision in planning. We produce comprehensive construction documents and manage the tendering process.' },
    { title: 'Construction Support', icon: 'fas fa-hard-hat', description: 'Ensuring quality. Our team provides site supervision and support to ensure the design is executed flawlessly.' },
    { title: 'Post-Occupancy', icon: 'fas fa-key', description: 'Beyond completion. We conduct a final review and handover, ensuring you are delighted with the final result.' },
  ];
  
  const services = [
    { icon: 'fas fa-archway', title: 'Architectural Design', description: 'Creating innovative and functional spaces from concept to construction, ensuring aesthetic appeal and structural integrity.', href: 'architectural-design.html' },
    { icon: 'fas fa-couch', title: 'Interior Design & Fit-Out', description: 'From concept to handover: layouts, materials, FF&E, site supervision, and code-compliant delivery.', href: 'interior-design.html' },
    { icon: 'fas fa-cogs', title: 'Engineering Consultancy', description: 'Providing expert technical advice and solutions across various engineering disciplines for robust and efficient project outcomes.', href: 'engineering-consultancy.html' },
    { icon: 'fas fa-tasks', title: 'Project Management Consultancy', description: 'Overseeing projects from inception to completion, ensuring they are delivered on time, within budget, and to the highest quality standards.', href: 'project-management.html' },
    { icon: 'fas fa-leaf', title: 'Sustainability & Energy', description: 'Integrating green building principles and energy-efficient solutions to create environmentally responsible and cost-effective designs.', href: 'sustainability-energy.html' },
    { icon: 'fas fa-check-double', title: 'Construction Approval', description: 'Navigating regulatory hurdles to secure all necessary construction permits and approvals efficiently.', href: 'construction-approval.html' },
  ];

  const sectors = [
    { name: 'Private Sector', icon: 'fas fa-building' }, { name: 'Refurbishment & Small Works', icon: 'fas fa-hammer' }, { name: 'Commercial & Mixed-Use', icon: 'fas fa-store-alt' }, 
    { name: 'Residential', icon: 'fas fa-home' }, { name: 'Industrial', icon: 'fas fa-industry' }, { name: 'Sports & Entertainment', icon: 'fas fa-futbol' }, 
    { name: 'Hospitality & Leisure', icon: 'fas fa-concierge-bell' }, { name: 'Education & Healthcare', icon: 'fas fa-graduation-cap' }, { name: 'Government & Public Sector', icon: 'fas fa-landmark' },
  ];

  const blogPosts = [
    { image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60", category: "Technology", date: "August 15, 2024", title: "The Future of BIM: AI and Generative Design", href: "blog-bim-ai.html", },
    { image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60", category: "Architecture", date: "August 10, 2024", title: "Sustainable Materials in Modern Construction", href: "blog-sustainable-materials.html", },
    { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60", category: "Interior Design", date: "August 05, 2024", title: "Minimalism and Light: Crafting Serene Spaces", href: "blog-minimalism-light.html", }
  ];

   useEffect(() => {
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
    return () => elementsToReveal.forEach((el) => observer.unobserve(el));
  }, []);

  // Simplified Parallax Effects
  useEffect(() => {
    const projectImageParallaxSpeed = 0.2;
    const workImageContainers = document.querySelectorAll<HTMLElement>('.work-image');
    const servicesSection = document.getElementById('our-services');

    const handleScroll = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Work image parallax
        workImageContainers.forEach(container => {
            const image = container.querySelector('img');
            if (!image) return;
            const rect = container.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = -rect.top * projectImageParallaxSpeed;
                image.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });

        // Services BG parallax
        if(servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.25;
                const yOffset = rect.top * speed;
                servicesSection.style.setProperty('--bg-parallax-y', `${yOffset}px`);
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ProjectGalleryModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <HeroSection />
      
      <section id="about" className="content-section section-bg-white scroll-trigger fade-up">
        <div className="section-decorator decorator-right scroll-trigger" aria-hidden="true">
            <span className="decorator-text">01</span>
        </div>
        <div className="container">
          <div className="about-section">
            <div className="grid">
              <div className="about-image scroll-trigger fade-up">
                <img src="https://images.pexels.com/photos/256150/pexels-photo-256150.jpeg?cs=srgb&dl=pexels-pixabay-256150.jpg&fm=jpg" alt="Modern residential architecture with a pool, designed by Taj Design Consultancy in Qatar." />
              </div>
              <div className="about-text">
                <h2 className="section-title scroll-trigger fade-up">WHO <strong>WE ARE</strong></h2>
                <p className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                  Taj Consultancy is a leading multidisciplinary firm in Qatar, delivering excellence in Architectural Design, Engineering, Project Management, and Sustainability. With decades of experience and a diverse expert team, we create landmark projects that blend innovation, integrity, and technical precision. From concept to completion, we turn ambitious ideas into sustainable, high-quality realities on time and on budget.
                </p>
                <div className="process-section scroll-trigger fade-up" style={{transitionDelay: '0.3s'}}>
                  <h3 className="sub-section-title">Our Process</h3>
                  <p>A transparent and collaborative path from your first idea to project handover.</p>
                  <div className="process-grid">
                    {processSteps.map((step, index) => (
                       <div className="process-item scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                          <div className="process-icon-wrapper">
                            <i className={`process-icon ${step.icon}`} aria-hidden="true"></i>
                          </div>
                          <h4><span>0{index + 1}.</span> {step.title}</h4>
                          <p className="process-description">{step.description}</p>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="facts" className="content-section section-bg-dark scroll-trigger fade-up has-divider" style={{backgroundImage: `url(https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?cs=srgb&dl=pexels-yentl-jacobs-43020-157811.jpg&fm=jpg)`}}>
        <SectionDivider />
        <div className="section-decorator decorator-left scroll-trigger" aria-hidden="true">
            <span className="decorator-text">02</span>
        </div>
        <div className="container" ref={factsContainerRef}>
            <div className="facts-section">
                <div className="grid">
                    <div className="facts-title">
                         <h2 className="section-title scroll-trigger fade-up">Some Interesting <strong>Facts</strong></h2>
                    </div>
                    <div className="facts-text">
                        <p className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}><strong>Taj Design Consultancy</strong> operates on the belief that evidence-led design and technical precision create lasting value.</p>
                        <p className="scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>Our integrated teams bring together architecture, interiors, landscape, and urban design under one roof — ensuring seamless collaboration and faster delivery.</p>
                         <div className="facts-counters">
                            <div className="counter-item scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>
                                <i className="fas fa-building-circle-check counter-icon" aria-hidden="true"></i>
                                <AnimatedCounter end={265} />
                                <p>Finished projects</p>
                            </div>
                            <div className="counter-item scroll-trigger fade-up" style={{ transitionDelay: '0.4s' }}>
                                <i className="fas fa-users-line counter-icon" aria-hidden="true"></i>
                                <AnimatedCounter end={240} />
                                <p>Happy customers</p>
                            </div>
                            <div className="counter-item scroll-trigger fade-up" style={{ transitionDelay: '0.5s' }}>
                                <i className="fas fa-helmet-safety counter-icon" aria-hidden="true"></i>
                                <AnimatedCounter end={36} />
                                <p>Opening Projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="our-services" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="section-decorator decorator-right decorator-03 scroll-trigger" aria-hidden="true">
            <span className="decorator-text">03</span>
        </div>
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Our <strong>Services</strong></h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-item scroll-trigger fade-up" style={{ transitionDelay: `${index * 0.1}s` }} key={index}>
                <svg className="service-border-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect className="service-border-rect" x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="7" pathLength="1" />
                </svg>
                <div className="service-icon-wrapper">
                  <i className={`service-icon ${service.icon}`} aria-hidden="true"></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <AppLink href={service.href} className="read-more-btn">Read More<span className="sr-only"> about {service.title}</span> <i className="fas fa-arrow-right" aria-hidden="true"></i></AppLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sectors" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Sectors <strong>We Serve</strong></h2>
          <div className="sectors-grid">
            {sectors.map((sector, index) => (
              <div className="sector-item scroll-trigger fade-up" style={{ transitionDelay: `${index * 0.1}s` }} key={index}>
                <svg className="service-border-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect className="service-border-rect" x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="7" pathLength="1" />
                </svg>
                <div className="service-icon-wrapper">
                  <i className={`service-icon ${sector.icon}`} aria-hidden="true"></i>
                </div>
                <h3>{sector.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="content-section section-bg-dark scroll-trigger fade-up has-divider" style={{backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=60)`}}>
        <SectionDivider />
        <div className="section-decorator decorator-left scroll-trigger" aria-hidden="true">
            <span className="decorator-text">04</span>
        </div>
        <div className="container">
            <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Our Featured <strong>Projects</strong></h2>
            <div className="works-grid">
                {workItems.slice(0, 3).map((item, index) => (
                    <button
                        key={index}
                        className="project-card scroll-trigger fade-up"
                        style={{ transitionDelay: `${index * 0.1}s` }}
                        onClick={() => setSelectedProject(item)}
                        aria-label={`View project details for ${item.title}`}
                    >
                        <img src={item.mainImage} alt={item.alt} className="project-card-image" />
                        <div className="project-card-cover">
                            <h3>{item.title}</h3>
                            <span className="view-project-button">View Project</span>
                        </div>
                    </button>
                ))}
            </div>
            <div className="view-all-projects-wrapper">
                <AppLink href="/works.html" className="view-all-projects-btn">View All Projects</AppLink>
            </div>
        </div>
    </section>

      <section id="clients" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Our <strong>Clients</strong></h2>
           <ClientsCarousel />
        </div>
      </section>

      <section id="blog" className="content-section section-bg-white scroll-trigger fade-up has-divider">
        <SectionDivider />
        <div className="section-decorator decorator-left decorator-06 scroll-trigger" aria-hidden="true">
            <span className="decorator-text">06</span>
        </div>
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up">From <strong>The Blog</strong></h2>
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
                <div className="blog-item scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                    <div className="blog-item-image" style={{backgroundImage: `url(${post.image})`}} />
                    <div className="blog-item-content">
                        <p className="blog-item-meta">{post.category} / {post.date}</p>
                        <h3 className="blog-item-title"><AppLink href={post.href}>{post.title}</AppLink></h3>
                        <AppLink href={post.href} className="blog-item-link">Read More <i className="fas fa-arrow-right" aria-hidden="true"></i></AppLink>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="content-section section-bg-dark scroll-trigger fade-up has-divider" style={{backgroundImage: `url(https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?cs=srgb&dl=pexels-yentl-jacobs-43020-157811.jpg&fm=jpg)`}}>
        <SectionDivider />
        <div className="section-decorator decorator-right decorator-05" aria-hidden="true">
            <span className="decorator-text scroll-trigger">05</span>
        </div>
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>What Our <strong>Clients Say</strong></h2>
            <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

    </>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const headerTheme = 'dark';

  return (
      <div className={`app ${loading ? 'loading' : ''}`}>
        <SkipToContentLink />
        <WhatsAppChatWidget />
        <Header theme={headerTheme} />
        <div className="main-container">
          <LeftSidebar pageName="HOME" />
          <main className="main-content" id="main-content" tabIndex={-1}>
            <HomePage />
            <Footer />
          </main>
        </div>
      </div>
  );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
