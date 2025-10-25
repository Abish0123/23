
import React, { useState, useEffect, useRef, memo, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

const servicesSubLinks = [
  { name: 'Architectural Design', href: 'architectural-design.html', icon: 'fas fa-archway', description: 'Innovative and functional spaces from concept to construction.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto.format&fit=crop&q=60' },
  { name: 'Engineering Consultancy', href: 'engineering-consultancy.html', icon: 'fas fa-cogs', description: 'Expert technical advice and solutions for robust project outcomes.', image: 'https://images.unsplash.com/photo-1518692113669-e34fa251a37c?w=800&auto.format&fit=crop&q=60' },
  { name: 'Project Management Consultancy', href: 'project-management.html', icon: 'fas fa-tasks', description: 'Overseeing projects from inception to completion on time and budget.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto.format&fit=crop&q=60' },
  { name: 'Sustainability & Energy', href: 'sustainability-energy.html', icon: 'fas fa-leaf', description: 'Integrating green principles for environmentally responsible designs.', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto.format&fit=crop&q=60' },
  { name: 'Construction Approval', href: 'construction-approval.html', icon: 'fas fa-check-double', description: 'Navigating regulatory hurdles to secure all necessary construction permits and approvals efficiently.', image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800&auto.format&fit=crop&q=60' },
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

const approvalProcessSteps = [
    { 
        title: "Consultation & Brief", 
        icon: "fa-comments", 
        description: "We start by understanding your project's scope, collecting necessary documents like title deeds, CR/QID, and appointment letters.",
    },
    { 
        title: "Technical Preparation", 
        icon: "fa-drafting-compass", 
        description: "Our team prepares and reviews all authority-compliant drawings (Architectural, Structural, MEP, Fire & Life Safety) for submission.",
    },
    { 
        title: "Submission & Coordination", 
        icon: "fa-paper-plane", 
        description: "We manage all portal submissions to authorities like Baladiya, QCDD, KAHRAMAA, and Ashghal, handling correspondence and tracking progress.",
    },
    { 
        title: "Inspections & Final Approval", 
        icon: "fa-clipboard-check", 
        description: "We schedule and facilitate required site inspections, manage any feedback, and work towards securing the final Building Completion Certificate (BCC).",
    }
];

const keyApprovalServices = [
    { 
        title: "Permitting & NOCs", 
        icon: "fa-file-signature", 
        items: [
            'Baladiya: Building Permits, Fit-Out, Change of Use',
            'QCDD: Fire & Life Safety drawings & approvals',
            'KAHRAMAA: Electricity & Water utility NOCs',
            'Ashghal: Drainage & Road Opening NOCs',
            'Telecom (Ooredoo/Vodafone) & District Cooling NOCs',
        ] 
    },
    { 
        title: "Technical Submissions", 
        icon: "fa-ruler-combined", 
        items: [
            'Authority-compliant architectural, structural & MEP drawings',
            'Fire alarm, sprinkler, and emergency system schematics',
            'Load calculations (ETABS/SAP/SAFE) & SLDs',
            'Shop drawings & as-built submissions'
        ] 
    },
    { 
        title: "Code & Compliance", 
        icon: "fa-check-double", 
        items: [
            'QCS, NFPA 101, QCDD guidelines',
            'ADA/accessibility compliance',
            'Egress & occupant load checks',
            'Energy & ventilation (IAQ) requirements'
        ] 
    },
    { 
        title: "Project Administration", 
        icon: "fa-folder-open", 
        items: [
            'Authority portal creation & tracking',
            'Fee calculations, receipts & correspondence logs',
            'Inspection scheduling & close-out snag management',
            'Completion Certificate (BCC) documentation set',
        ] 
    },
];

const bimServices = [
    {
        title: "Benefits of BIM",
        icon: "fa-thumbs-up",
        items: [
            'Fewer site clashes & variations (early detection)',
            'Faster approvals with clear, authority-ready outputs',
            'Transparent cost & time with 4D/5D visibility',
            'Better client buy-in using visuals & VR reviews'
        ]
    },
    {
        title: "Typical BIM Deliverables",
        icon: "fa-cubes",
        items: [
            'Federated RVT/NWD & IFC models',
            'Coordination reports & clash matrices',
            '2D sheets (plans, sections, details), shop drawings',
            'QTO/BoQ extracts, 4D simulations, cost snapshots',
            'High-resolution stills, animations, Web/VR walkthroughs',
            'As-builts and COBie asset registers for FM',
        ]
    }
];

const softwareStack = ['Autodesk Revit', 'Navisworks Manage', 'ACC/BIM 360', 'AutoCAD', 'Civil 3D', 'Dynamo', 'ETABS/SAP/SAFE', 'Enscape/Lumion', 'Unreal/Sketchfab', 'Excel/Power BI'];


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
            <h2 className="scroll-trigger fade-up" style={{ transitionDelay: '0.1s' }}>Ready to Start Your Project?</h2>
            <p className="scroll-trigger fade-up" style={{ transitionDelay: '0.2s' }}>
                Let our experts handle the complexities of construction approvals so you can focus on building your vision. Contact us today for a consultation.
            </p>
            <a href="contact.html" className="cta-button scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>Get in Touch</a>
        </div>
    </section>
);

const ProcessStepper = ({ steps }) => (
    <div className="process-stepper">
        {steps.map((step, index) => (
            <div className="step scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.15}s` }}>
                <div className="step-icon-wrapper">
                    <i className={`fas ${step.icon}`} aria-hidden="true"></i>
                    <div className="step-number">{index + 1}</div>
                </div>
                <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                </div>
            </div>
        ))}
    </div>
);

const InfoCard = ({ title, icon, items, children }: { title: string, icon: string, items?: (string | React.ReactNode)[], children?: React.ReactNode }) => (
    <div className="info-card scroll-trigger fade-up">
        <h4><i className={`fas ${icon}`} aria-hidden="true"></i> {title}</h4>
        {items && (
            <ul>
                {items.map((item, index) => (
                    <li key={index}><i className="fas fa-check" aria-hidden="true"></i><span>{item}</span></li>
                ))}
            </ul>
        )}
        {children}
    </div>
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
          <section className="service-hero-section scroll-trigger fade-up" style={{ backgroundImage: `url('https://media.licdn.com/dms/image/v2/D5612AQEPHDa_jIUW7Q/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1697475482996?e=2147483647&v=beta&t=W5MXkjDsRTLPnFm86_9pZBlOevq4E3AXCRzXbk8rFZc')` }}>
            <div className="container">
              <h1 className="scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>Construction Approvals & <strong>BIM Services</strong></h1>
            </div>
          </section>

          <section className="content-section">
            <div className="container">

                <div className="service-subsection text-block scroll-trigger fade-up">
                    <h2 className="section-title" style={{textAlign: 'center'}}>Streamlining Authority Approvals</h2>
                    <p style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto', color: '#555', lineHeight: '1.8'}}>
                        Navigating Qatar’s complex regulatory landscape is a critical challenge. Our dedicated team specializes in streamlining this process, acting as your expert liaison with all government authorities to ensure a smooth and predictable path from design to completion.
                    </p>
                </div>

                <div className="service-subsection">
                    <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Our Phased Approval Process</h2>
                    <ProcessStepper steps={approvalProcessSteps} />
                </div>

                <div className="service-subsection">
                    <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Key Approval Services</h2>
                    <div className="info-grid">
                        {keyApprovalServices.map((card, index) => (
                           <InfoCard key={index} title={card.title} icon={card.icon} items={card.items} />
                        ))}
                    </div>
                </div>

                <div className="service-subsection">
                    <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>BIM at a Glance: Faster, Smarter Approvals</h2>
                     <div className="info-grid">
                        {bimServices.map((card, index) => (
                           <InfoCard key={index} title={card.title} icon={card.icon} items={card.items} />
                        ))}
                        <InfoCard title="Software Stack" icon="fa-cogs">
                             <div className="software-stack">
                                {softwareStack.map((item) => <span className="software-item" key={item}>{item}</span>)}
                            </div>
                        </InfoCard>
                    </div>
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
