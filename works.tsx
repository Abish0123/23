
import React, { useState, useEffect, useRef, memo, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

// --- DATA & CONFIG ---

const servicesSubLinks = [
  { name: 'Architectural Design', href: 'architectural-design.html', icon: 'fas fa-archway' },
  { name: 'Engineering Consultancy', href: 'engineering-consultancy.html', icon: 'fas fa-cogs' },
  { name: 'Project Management Consultancy', href: 'project-management.html', icon: 'fas fa-tasks' },
  { name: 'Sustainability & Energy', href: 'sustainability-energy.html', icon: 'fas fa-leaf' },
  { name: 'Construction Approval', href: 'construction-approval.html', icon: 'fas fa-check-double' },
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
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733625/Untitled_design_-_2025-10-29T155452.800_jhx5w7.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733625/Untitled_design_-_2025-10-29T155518.651_btziq9.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733626/Untitled_design_-_2025-10-29T155448.743_eciho2.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733624/Untitled_design_-_2025-10-29T155527.788_v5gops.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761733613/Untitled_design_-_2025-10-29T155606.164_rv7jcv.png'
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
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_1_ht1iux.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425806/Untitled_16_x_9_in_mi6glx.png'
      ],
      alt: 'Architectural redesign of the Al Jabor commercial building in Al Hilal, Qatar.'
    },
    {
      title: 'Legal office for Shaiek Jassim Al Thani',
      meta: 'End-to-end interior design and fit-out supervision',
      location: 'Westbay',
      description: 'Interior design and supervision for turnkey fit-out works—covering concept to handover—with full life-safety compliance to QCDD/NFPA codes. Services include 3D renders and visualizations, coordinated MEP layouts, furniture and finishes selection, technical specifications, detailed BOQs, and on-site supervision/QA to ensure quality, budget control, and timely delivery.',
      mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761394147/10_gtnarf.png',
      gallery: [
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761394147/10_gtnarf.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761394141/6_ypphq2.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761394138/5_qr7poc.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761394123/12_pqzmgc.png'
      ],
      alt: 'Luxurious interior design for a legal office in Westbay, Doha.'
    },
    { 
      title: 'Al Jazeera Tower',
      meta: 'End-to-end interior design and fit-out supervision',
      location: 'Dafna',
      description: 'Office space design, supervision, and photorealistic renders for a high-rise project in Dafna (4 floors)—including workplace planning, detailed interiors, coordinated MEP, QCDD/NFPA life-safety compliance, supervision for design compliance, adherence to tower standards/procedures, full snagging/rectification, QA/QC, and handover—plus contractor pre-qualification and selection, tendering support, quotation/bid evaluation with comparative summaries, value engineering, and award recommendations.',
      mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637877/Untitled_16_x_9_in_13_pd7hre.png',
      gallery: [
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637877/Untitled_16_x_9_in_13_pd7hre.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637877/Untitled_16_x_9_in_14_mxzymr.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637876/Untitled_16_x_9_in_19_kqzxdr.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637875/Untitled_16_x_9_in_17_x98cqb.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637875/Untitled_16_x_9_in_12_npf9j9.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637876/Untitled_16_x_9_in_15_v8kenj.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637875/Untitled_16_x_9_in_18_n9nsc0.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761637875/Untitled_16_x_9_in_16_lxxcfa.png'
      ],
      alt: 'High-rise office interior fit-out at Al Jazeera Tower in Dafna, Doha.'
    }
];

// --- SHARED & LAYOUT COMPONENTS ---

const SkipToContentLink = () => (
    <a href="#main-content" className="skip-to-content-link">
        Skip to main content
    </a>
);

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
      const firstItem = servicesDropdownContainerRef.current?.querySelector<HTMLAnchorElement>('.dropdown-menu a');
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsServicesDropdownOpen(prev => !prev);
  };
  
  const handleDropdownItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    const items = Array.from(
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
          <img src="https://res.cloudinary.com/dj3vhocuf/image/upload/v1760896759/Blue_Bold_Office_Idea_Logo_250_x_80_px_7_uatyqd.png" alt="Taj Design Consultancy Logo - Architectural Firm in Qatar" className="logo-image" />
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
        <p>© Taj Design Consult 2024. All rights reserved.</p>
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


const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer id="footer" className="app-footer">
            <WaveAnimation />
            <div className="container">
                <div className="copyright-section">
                    <span>2024 © Taj Design Consult. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
    )
}

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

const WorksPage = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <>
            <ProjectGalleryModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            <section className="works-hero-section">
                <h1>Our <strong>Projects</strong></h1>
            </section>
            <section id="works-grid-section" className="works-list-section">
                <div className="container">
                    <div className="works-grid">
                        {workItems.map((item, index) => (
                            <button
                                key={index}
                                className="project-card"
                                onClick={() => setSelectedProject(item)}
                                aria-label={`View project details for ${item.title}`}
                            >
                                <img src={item.mainImage} alt={item.alt || item.title} className="project-card-image" />
                                <div className="project-card-cover">
                                    <h3>{item.title}</h3>
                                    <span className="view-project-button">View Project</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}


const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`app ${loading ? 'loading' : ''}`}>
            <SkipToContentLink />
            <WhatsAppChatWidget />
            <Header theme="dark" />
            <div className="main-container">
                <LeftSidebar pageName="WORKS" />
                <main className="main-content" id="main-content" tabIndex={-1}>
                    <WorksPage />
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
