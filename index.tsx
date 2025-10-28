import React, { useState, useEffect, useRef, memo, createContext, useContext, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

// --- DATA & CONFIG ---

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

const servicePageData = {
    'architectural-design.html': {
        title: 'Architectural Design',
        image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop&q=60',
        alt: 'Architectural design sketch',
        content: [
            'From concept sketches to refined details, we craft cohesive spatial narratives where aesthetics, function, and flow work as one. Our Architectural Design division unites multiple studios into one collaborative team, covering every discipline – from urban planning, landscape architecture, and interiors to public/commercial developments, residential projects, industrial facilities, and even stadium and venue design. We leverage a holistic design process that blends creativity with practicality, ensuring spaces are not only visually striking but also highly functional and contextually appropriate.',
            'We excel in Building Information Modeling (BIM), delivering end-to-end BIM support (3D–5D) from concept through to handover. By using coordinated digital models, we detect and resolve clashes early in the design phase, improving buildability and reducing risk on complex projects. Our team’s integrated approach and attention to detail result in architectural solutions that are innovative, sustainable, and aligned with each client’s vision.',
        ],
        services: [
            'Building Architecture – Complete architectural design for commercial, residential, and institutional buildings.',
            'Landscape Architecture – Planning and design of outdoor spaces, gardens, and urban landscapes.',
            'Interiors – Interior architecture and space planning that enhance form and function.',
            'Site Selection, Evaluation & Analysis – Assessing and selecting optimal sites based on project requirements and feasibility.',
            'Infrastructure Architecture – Design of support facilities and integration with civil infrastructure.',
            'Industrial Architecture – Customized design for factories, warehouses, and industrial plants.',
            'Project Brief & Feasibility Studies – Defining project requirements, scope, and viability analyses.',
            'Preliminary Design & Concept Presentations – Early-phase design development with reports and client presentations.',
            'Detailed Design & Documentation – Comprehensive architectural drawings, specifications, and reports.',
            'Tender Documents & Analysis – Preparation of tender packages and assistance with bid evaluation.',
            'Presentation Drawings, 3D Walkthroughs & Animations – Visualizations and animations bringing designs to life for stakeholders.',
            'Architectural Scale Models – Physical and digital scale models for design review and client display.',
            'Building Information Modeling (up to 5D) – Advanced BIM modeling including 3D geometry, scheduling (4D), and cost estimation (5D).',
            'Urban Design & Masterplanning – Large-scale urban planning, cityscape design, and master plan development.',
            'Redevelopment & Refurbishment – Renovation design and adaptive reuse for existing buildings and heritage projects.',
            'Municipality Approvals – Navigating local authority regulations and obtaining necessary building permits and approvals.',
        ],
    },
    'engineering-consultancy.html': {
        title: 'Engineering Consultancy',
        image: 'https://images.unsplash.com/photo-1581092446337-234557050003?w=800&auto=format&fit=crop&q=60',
        alt: 'Engineers collaborating on a blueprint.',
        content: [
            'Our Engineering Consultancy division provides the technical backbone for visionary architecture. We deliver integrated, multidisciplinary engineering solutions that are innovative, efficient, and resilient. Our expert teams in structural, MEP, civil, and specialized engineering disciplines work collaboratively to solve complex challenges and ensure that every design is buildable, sustainable, and optimized for performance. We merge technical excellence with a deep understanding of our clients’ goals to deliver projects that stand the test of time.',
            'From initial feasibility studies to detailed design and construction support, we are committed to precision and quality. We leverage cutting-edge software and analysis tools to model and test our designs, ensuring they meet the highest standards of safety and efficiency. Our proactive approach to coordination and problem-solving helps streamline the construction process, minimize risks, and deliver exceptional value. We are dedicated to engineering excellence that supports architectural creativity and delivers lasting results.',
        ],
        services: [
            'Structural Engineering – Design of robust and efficient structural systems for buildings and infrastructure.',
            'MEP (Mechanical, Electrical & Plumbing) Engineering – Integrated design of building services for optimal performance and comfort.',
            'Civil Engineering – Site development, grading, drainage, and utility design.',
            'Geotechnical Engineering – Subsurface investigation and foundation design.',
            'Facade Engineering – Design and analysis of building envelopes for performance and aesthetics.',
            'Fire & Life Safety Consulting – Code compliance, fire protection system design, and evacuation planning.',
            'Acoustic Consulting – Design for optimal sound insulation, room acoustics, and noise control.',
            'Vertical Transportation – Elevator and escalator system design and analysis.',
            'Value Engineering – Optimizing project value by analyzing function and cost.',
            'Peer Review & Third-Party Verification – Independent review of engineering designs for quality and compliance.',
        ],
    },
    'project-management.html': {
        title: 'Project & Construction Management',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=60',
        alt: 'Construction site with project managers reviewing plans.',
        content: [
            'We provide comprehensive leadership for projects of all sizes, ensuring your vision is realized on time, on budget, and to the highest quality standards. Our Project Management Consultancy (PMC) team serves as a trusted extension of our clients, managing every phase of a project from inception to handover. With a proven track record on some of Qatar’s most iconic developments, we specialize in navigating complex projects with precision and foresight. Our deep local experience gives us an unparalleled understanding of regional regulations and market dynamics, allowing us to proactively mitigate risks and drive project success.',
            'Our methodology is built on a foundation of clear communication, rigorous control, and proactive problem-solving. We implement robust systems for planning, cost management, and quality assurance, ensuring complete transparency for all stakeholders. By integrating seamlessly with design teams, contractors, and authorities, we foster a collaborative environment focused on shared goals. Whether managing a single project or a large-scale program, our commitment is to safeguard our clients\' interests and deliver outcomes that exceed expectations.',
        ],
        services: [
            'Project Management – Comprehensive project planning, execution, and closing services representing the client’s interests.',
            'Construction Management & Supervision – On-site construction supervision, contractor coordination, and quality control.',
            'Technical Review – Independent technical audits and constructability reviews of designs and plans.',
            'Cost Estimating & Management – Budget development, cost control, value engineering, and financial reporting throughout the project.',
            'Construction Claims Consulting – Claims analysis, mitigation strategies, and dispute resolution support during construction.',
            'Independent Contract Document Review – Thorough review of contracts, drawings, and specifications to ensure clarity and completeness.',
            'Bid Management & Tender Evaluation – Management of the bidding process, contractor pre-qualification, and tender analysis.',
            'Quality Assurance & Control (QA/QC) – Establishing and implementing QA/QC protocols to meet project standards.',
            'Commissioning & Handover Management – Managing the final stages of a project, including system testing, training, and final handover.',
        ],
    },
    'sustainability-energy.html': {
        title: 'Sustainability & Energy',
        image: 'https://images.unsplash.com/photo-1579225688258-af53a436a5e1?w=800&auto=format&fit=crop&q=60',
        alt: 'Sustainable energy solutions like solar panels on a modern building',
        content: [
            'Aligned with our clients’ objectives, we deliver projects safely and sustainably – meeting cost, schedule, and quality targets every time. Our Sustainability & Energy team provides end-to-end environmental consulting and energy management services for both public and private clients. We guide projects through Environmental Impact Assessments and regulatory approvals, embedding practical strategies for energy efficiency, resource conservation, and low-carbon design to achieve compliant and resilient outcomes. By clarifying environmental impacts and cutting energy consumption, we help clients meet green building standards and future-proof their investments.',
            'Our specialists develop tailored solutions in energy auditing, retrofitting, and sustainable design integration. We implement strategies like advanced commissioning, renewable energy integration, and smart building controls to maximize efficiency. These efforts regularly reduce building operating costs by over 50% without compromising comfort, safety, or compliance – delivering tangible savings alongside environmental benefits. With a finger on the pulse of global best practices and local regulations, Taj Consultancy’s sustainability experts ensure each project not only meets today’s goals but also contributes to a greener, more energy-efficient future.',
        ],
        services: [
            'Energy Audits & Savings Roadmaps',
            'Retro-Commissioning & Continuous Commissioning',
            'HVAC Optimization',
            'Building Management System (BMS) Optimization',
            'Lighting Redesign & Smart Controls',
            'Solar PV Feasibility & Design',
            'Water Efficiency Solutions',
            'Utility Tariff Optimization',
            'Measurement & Verification (M&V)',
            'Indoor Air Quality Improvements',
            'Waste Minimization & Circular Materials',
            'Carbon Accounting & Net-Zero Roadmaps',
            'Sustainability Reporting & Certification',
            'Environmental Impact Assessments (EIA/ESIA)',
            'Contractor Sustainability Compliance',
            'Training & Change Management',
        ],
    },
    'construction-approval.html': {
        title: 'Construction Approval',
        image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800&auto=format&fit=crop&q=60',
        alt: 'Official documents and a hard hat on a blueprint.',
        content: [
            'Navigating Qatar’s complex regulatory landscape is one of the most critical challenges in any construction project. Our dedicated Construction Approval team specializes in streamlining this process, acting as your expert liaison with all government authorities. We manage the entire lifecycle of approvals, from initial compliance checks to securing the final Building Completion Certificate (BCC). Our deep understanding of the requirements set by Baladiya (Municipality), the Building Permit Complex (DC1/DC2), Kahramaa, Ooredoo, Ashghal, and the Qatar Civil Defense Department (QCDD) ensures a smooth and predictable path to construction.',
            'By entrusting us with your project approvals, you mitigate risks, avoid costly delays, and ensure full compliance with all local laws and building codes. Our established relationships with key authorities and our meticulous approach to documentation management allow us to anticipate hurdles and resolve issues proactively. We provide complete transparency throughout the process, giving you the peace of mind to focus on your core project objectives while we handle the critical administrative and regulatory groundwork.',
        ],
        services: [
            'Initial Project Assessment & Regulatory Compliance Check',
            'Building Permit (BP) Application Management (Baladiya)',
            'DC1 & DC2 Submission, Tracking, and Follow-up',
            'Utility Connections & NOCs (Kahramaa, Ooredoo)',
            'Civil Defense (QCDD) Approval Coordination and Inspection Facilitation',
            'Roads & Drainage NOCs (Ashghal)',
            'Environmental Permits (Ministry of Environment and Climate Change)',
            'Building Completion Certificate (BCC) Application and Acquisition',
            'Regular Status Reporting and Authority Liaison',
            'Comprehensive Management of All Required Documentation and Drawings',
        ],
    },
};

const blogPageData = {
    '/blog-bim-ai.html': {
        title: 'The Future of BIM: AI and Generative Design',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=60',
        alt: 'Abstract visualization of AI and design',
        category: 'Technology',
        date: 'August 15, 2024',
        content: [
            'Building Information Modeling (BIM) has fundamentally transformed the architecture, engineering, and construction (AEC) industry over the past two decades. By creating intelligent 3D models, BIM allows for better collaboration, improved clash detection, and more efficient project delivery. However, we are on the cusp of another revolution, one powered by Artificial Intelligence (AI) and Generative Design.',
            'AI is moving beyond simple automation and into the realm of creative partnership. In the context of architecture, AI algorithms can analyze vast datasets—from building performance metrics to local climate data and zoning regulations—to inform and optimize the design process. This isn\'t about replacing the architect but augmenting their capabilities, freeing them from repetitive tasks to focus on higher-level creative and strategic thinking.',
            'This is where Generative Design comes in. It\'s a design exploration process where designers input their goals and constraints (e.g., spatial requirements, material costs, energy performance, structural loads) into an AI system. The system then explores the entire solution space, rapidly generating thousands of potential design options. It learns from each iteration, refining the results to produce high-performing and often unexpected solutions that a human designer might never have conceived.',
            'The benefits are profound. Generative design can lead to structures that are not only more aesthetically innovative but also lighter, stronger, and more sustainable. By optimizing for material usage, it can significantly reduce construction costs and environmental impact. The ability to simulate performance at an early stage allows for the creation of buildings that are more energy-efficient and comfortable for their occupants.',
            'While the technology is still evolving, its potential is undeniable. From creating complex, lightweight lattice structures for building facades to optimizing the layout of an entire hospital floor for patient flow and staff efficiency, AI-driven design is set to tackle some of the most complex challenges in the built environment. As computational power grows and algorithms become more sophisticated, the collaboration between human creativity and machine intelligence will define the future of architecture.',
        ],
    },
    '/blog-sustainable-materials.html': {
        title: 'Sustainable Materials in Modern Construction',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&auto=format&fit=crop&q=60',
        alt: 'A modern wooden building showcasing sustainable materials',
        category: 'Architecture',
        date: 'August 10, 2024',
        content: [
            'As global awareness of climate change and resource depletion grows, the construction industry is under increasing pressure to adopt more sustainable practices. Buildings are responsible for a significant portion of global energy consumption and carbon emissions, making the choice of materials more critical than ever. The shift towards sustainable materials is not just an ethical choice; it\'s becoming an economic and regulatory necessity.',
            'At the forefront of this movement is mass timber, particularly Cross-Laminated Timber (CLT). CLT panels are made by gluing layers of solid-sawn lumber together at right angles, creating a product that is exceptionally strong, lightweight, and dimensionally stable. It can replace concrete and steel in many applications, significantly reducing the carbon footprint of a building. As a renewable resource, timber sequesters carbon throughout its life, making it a key player in the fight against climate change.',
            'Beyond timber, a host of innovative materials are gaining traction. Bamboo, a rapidly renewable grass, offers incredible tensile strength. Recycled steel reduces the energy-intensive process of virgin steel production. Hempcrete, a mixture of hemp fibers and lime, is a carbon-negative insulation material. Even more futuristic materials like mycelium (the root structure of fungi) are being explored to grow bricks and insulation with minimal environmental impact.',
            'Choosing the right material involves more than just its origin. A Life Cycle Assessment (LCA) is a crucial tool that evaluates the environmental impact of a material from cradle to grave—from raw material extraction through manufacturing, use, and eventual disposal or recycling. This holistic view ensures that we make informed decisions that genuinely reduce a project\'s overall environmental footprint.',
            'At Taj Design Consultancy, we are deeply committed to integrating sustainable materials and practices into our projects. We believe that thoughtful material selection is fundamental to creating resilient, healthy, and environmentally responsible buildings that will stand the test of time and contribute positively to our planet\'s future.',
        ],
    },
    '/blog-minimalism-light.html': {
        title: 'Minimalism and Light: Crafting Serene Spaces',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=60',
        alt: 'A minimalist interior with abundant natural light',
        category: 'Interior Design',
        date: 'August 05, 2024',
        content: [
            'In a world of constant noise and clutter, the principles of minimalist design offer a powerful antidote. Rooted in the "less is more" philosophy, interior design is about stripping away the non-essential to create spaces that are calm, intentional, and deeply restorative. It’s not about emptiness, but about making room for what truly matters.',
            'Natural light is arguably the most important element in a minimalist interior. It breathes life into a space, making it feel larger, cleaner, and more open. The design should work to maximize daylight at every turn. This can be achieved through large, unadorned windows, translucent materials, and strategically placed mirrors. Sheer, simple window treatments are preferred over heavy draperies to allow light to filter through gently.',
            'The color palette in minimalist design is typically subdued, relying on a foundation of neutrals like white, beige, and grey. This doesn\'t mean the space has to be boring. Interest and warmth are introduced through texture—the rough weave of a linen sofa, the smooth grain of a light wood floor, the soft pile of a wool rug. These tactile elements prevent the space from feeling cold or sterile.',
            'Every piece of furniture and decor in a minimalist space must earn its place. The focus is on quality over quantity. Each item is chosen for its form, function, and beauty. Clean lines, simple geometries, and high-quality craftsmanship are hallmarks of minimalist furniture. Clutter is eliminated through clever, integrated storage solutions that keep surfaces clear and the mind at ease.',
            'The result of this intentional approach is more than just an aesthetic; it\'s a feeling. Minimalist spaces have been shown to reduce stress, improve focus, and promote a sense of well-being. By creating an environment free from overwhelming visual stimuli, we create a sanctuary where we can truly relax, recharge, and connect with ourselves.',
        ],
    },
};

const careerOpenings = [
    {
      title: 'Senior Architect',
      description: 'Lead design projects from concept to completion. Must have 8+ years of experience in large-scale commercial and residential projects.',
    },
    {
      title: 'BIM Specialist',
      description: 'Develop and manage BIM models, ensuring clash detection and coordination across disciplines. Proficiency in Revit is essential.',
    },
    {
      title: 'Lead Interior Designer',
      description: 'Create innovative and functional interior spaces for high-end hospitality and corporate clients. Strong portfolio required.',
    },
];

// --- SEO & SHARED COMPONENTS ---

const SchemaMarkup = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Taj Design Consultancy",
      "image": "https://res.cloudinary.com/dj3vhocuf/image/upload/v1760896759/Blue_Bold_Office_Idea_Logo_250_x_80_px_7_uatyqd.png",
      "url": "https://www.tajdc-qatar.com/", 
      "telephone": "+974 7712 3400",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "14th floor, Al Jazeera tower, Westbay",
        "addressLocality": "Doha",
        "addressCountry": "QA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.3218,
        "longitude": 51.5218
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Qatar"
      },
      "description": "A leading multidisciplinary firm in Doha, Qatar, delivering excellence in Architectural Design, Engineering, Project Management, and Sustainability services."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};


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
          <img src="https://res.cloudinary.com/dj3vhocuf/image/upload/v1760896759/Blue_Bold_Office_Idea_Logo_250_x_80_px_7_uatyqd.png" alt="Taj Design Consultancy Logo - Architectural Firm in Qatar" className="logo-image" />
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

        if (window.innerWidth <= 768) return;
        
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
    const titleLines = ["DESIGNING QATAR'S", "FUTURE"];
    const fullTitle = "Designing Qatar's Future";

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const isMobile = window.innerWidth <= 768;

        const handleScroll = () => {
            if (!isMobile) {
                setOffsetY(window.pageYOffset);
            }
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isMobile) {
                const { clientX, clientY } = e; const { innerWidth, innerHeight } = window;
                const x = (clientX / innerWidth) - 0.5; const y = (clientY / innerHeight) - 0.5;
                setMousePos({ x, y });
            }
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
    
    return (
        <section className="hero-section">
            <video
                className="hero-video"
                src="https://res.cloudinary.com/dj3vhocuf/video/upload/v1760897003/pexels-tima-miroshnichenko-5317374_2160p_r6tqya.mp4"
                autoPlay
                loop
                muted
                playsInline
            ></video>
            <BlueprintAnimation />
            <ParticleCanvas />
            <div
                className="hero-content"
                style={{
                    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                    opacity: 1 - (offsetY * 0.0015)
                }}
            >
                <h1 className="reveal-text" aria-label={fullTitle}>
                    {titleLines.map((line, lineIndex) => (
                        <span className="hero-title-line" key={lineIndex} aria-hidden="true">
                            {line.split('').map((char, charIndex) => (
                                <span className="letter" key={charIndex}>{char === ' ' ? '\u00A0' : char}</span>
                            ))}
                        </span>
                    ))}
                </h1>
                <a href="#about" className="explore-btn">Explore Our Vision</a>
            </div>
            <a href="#about" className="scroll-down-indicator" aria-label="Scroll down to learn more">
                <i className="fas fa-chevron-down" aria-hidden="true"></i>
            </a>
        </section>
    );
};
const AboutSection = () => {
    return (
        <section id="about" className="content-section section-bg-white">
            <div className="section-decorator decorator-right scroll-trigger" aria-hidden="true">
                <span className="decorator-text">TAJ</span>
            </div>
            <div className="container">
                <div className="about-section">
                    <div className="grid">
                        <div className="about-image scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                           <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=60" alt="Team of architects and engineers collaborating in a modern office in Doha, Qatar." />
                        </div>
                        <div className="about-text scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                            <h2 className="section-title">Evidence-Led Design, <strong>Technical Precision</strong></h2>
                            <p>
                                Established in 2021, Taj Design Consultancy is a premier multidisciplinary firm delivering excellence across architecture, engineering, project management, and sustainability services.
                            </p>
                            <p>
                                At the heart of our philosophy is a commitment to evidence-led design, ensuring every decision is informed by rigorous analysis and technical precision. We pride ourselves on turning ambitious ideas into tangible realities, delivered on time and within budget.
                            </p>
                            <a href="about.html" className="view-projects-btn">Learn More About Us</a>
                            
                            <h3 className="sub-section-title">Our Integrated Process</h3>
                            <div className="process-section">
                                <p>We follow a comprehensive four-step process to ensure quality and clarity from start to finish.</p>
                                <div className="process-grid">
                                    <div className="process-item">
                                        <div className="process-icon-wrapper"><i className="fas fa-lightbulb process-icon"></i></div>
                                        <h4><span>01</span> Concept & Feasibility</h4>
                                    </div>
                                    <div className="process-item">
                                        <div className="process-icon-wrapper"><i className="fas fa-drafting-compass process-icon"></i></div>
                                        <h4><span>02</span> Design & Documentation</h4>
                                    </div>
                                    <div className="process-item">
                                        <div className="process-icon-wrapper"><i className="fas fa-hard-hat process-icon"></i></div>
                                        <h4><span>03</span> Tendering & Construction</h4>
                                    </div>
                                    <div className="process-item">
                                        <div className="process-icon-wrapper"><i className="fas fa-check-double process-icon"></i></div>
                                        <h4><span>04</span> Handover & Completion</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
const FactsSection = () => {
    const countersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const counters = countersRef.current?.querySelectorAll<HTMLElement>('.num');
                    counters?.forEach(counter => {
                        const target = +counter.getAttribute('data-target')!;
                        gsap.to(counter, {
                            innerText: target,
                            duration: 2,
                            ease: 'power2.out',
                            snap: { innerText: 1 },
                            onUpdate: () => {
                                counter.innerText = Math.ceil(parseFloat(counter.innerText)).toLocaleString();
                            }
                        });
                    });
                    observer.disconnect();
                }
            }, { threshold: 0.5 }
        );
        if (countersRef.current) observer.observe(countersRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="facts" className="content-section section-bg-dark" style={{backgroundImage: "url('https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=1600&auto=format&fit=crop&q=60')"}}>
             <div className="section-decorator decorator-left scroll-trigger" aria-hidden="true">
                <span className="decorator-text">2021</span>
            </div>
            <div className="container">
                <div className="facts-section">
                    <div className="grid">
                        <div className="facts-text scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                            <h2 className="section-title">Delivering <strong>Excellence</strong></h2>
                            <p>Our commitment to quality, innovation, and client satisfaction has established us as a trusted partner in Qatar's development. Our numbers speak for themselves, reflecting a portfolio of diverse and successful projects that shape the nation's landscape.</p>
                        </div>
                         <div ref={countersRef} className="facts-counters scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                            <div className="counter-item">
                                <i className="fas fa-building counter-icon" aria-hidden="true"></i>
                                <div className="num" data-target="150">0</div>
                                <p>Projects Completed</p>
                            </div>
                            <div className="counter-item">
                                <i className="fas fa-users counter-icon" aria-hidden="true"></i>
                                <div className="num" data-target="50">0</div>
                                <p>Happy Clients</p>
                            </div>
                            <div className="counter-item">
                                <i className="fas fa-award counter-icon" aria-hidden="true"></i>
                                <div className="num" data-target="5">0</div>
                                <p>Years of Experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
const ServicesSection = () => {
    return (
        <section id="our-services" className="content-section">
            <div className="container">
                <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Our Core <strong>Services</strong></h2>
                <div className="services-grid">
                    {servicesSubLinks.map((service, index) => (
                        <div className="service-item scroll-trigger fade-up" key={service.name} style={{ transitionDelay: `${index * 0.1}s` }}>
                           <div className="service-icon-wrapper">
                                <i className={`service-icon ${service.icon}`} aria-hidden="true"></i>
                           </div>
                           <h3>{service.name}</h3>
                           <p>{service.description}</p>
                           <a href={service.href} className="read-more-btn">Read More <i className="fas fa-arrow-right" aria-hidden="true"></i></a>
                           <svg className="service-border-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <rect className="service-border-rect" width="100%" height="100%" />
                           </svg>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
const SectorsSection = () => {
    const sectors = [
        { name: "Residential", icon: "fas fa-home" },
        { name: "Commercial", icon: "fas fa-store-alt" },
        { name: "Hospitality", icon: "fas fa-concierge-bell" },
        { name: "Healthcare", icon: "fas fa-clinic-medical" },
        { name: "Educational", icon: "fas fa-school" },
        { name: "Industrial", icon: "fas fa-industry" },
    ];
    return (
        <section id="sectors" className="content-section section-bg-dark" style={{backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=60')"}}>
            <div className="container">
                <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Sectors <strong>We Serve</strong></h2>
                <div className="sectors-grid">
                    {sectors.map((sector, index) => (
                         <div className="sector-item scroll-trigger fade-up" key={sector.name} style={{ transitionDelay: `${index * 0.1}s`, backgroundColor: 'rgba(28, 28, 28, 0.7)', border: '1px solid var(--border-light)' }}>
                           <div className="service-icon-wrapper" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
                                <i className={`service-icon ${sector.icon}`} aria-hidden="true"></i>
                           </div>
                           <h3 style={{color: '#fff'}}>{sector.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FeaturedProjects = () => {
    const workItems = [
        { 
          title: 'World Wide Business Center',
          meta: 'Design and Supervision of Office Interior',
          location: 'D Ring Road',
          description: 'A 2,000 sqm office interior featuring a welcoming reception, multiple meeting rooms, a conference room, collaborative zones, and a dedicated games area.',
          mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761304504/_DSC9859_sx03dr.jpg',
          gallery: [
            'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761304504/_DSC9859_sx03dr.jpg',
            'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761304501/_DSC9888_rkhjis.jpg',
            'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761304500/_DSC9901_beo4mx.jpg',
          ],
          alt: 'Spacious and modern interior of World Wide Business Center on D Ring Road, Doha.'
        },
        { 
          title: 'Al Jabor Building',
          meta: 'Design and Municipality Approvals for Commercial Building',
          location: 'Al Hilal',
          description: 'This project involved a full interior reconfiguration of the commercial building based on a targeted market-demand analysis.',
          mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_2_aypzfx.png',
          gallery: [
            'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_2_aypzfx.png',
            'https://res.cloudinary.com/dj3vhocuf/image/upload/f_auto,q_auto,w_1200/v1761425803/Untitled_16_x_9_in_3_m7smfu.png',
          ],
          alt: 'Architectural redesign of the Al Jabor commercial building in Al Hilal, Qatar.'
        }
    ];

    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const parallaxItems = document.querySelectorAll<HTMLElement>('.work-item');
        const handleScroll = () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 992) return;
            parallaxItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const speed = 0.1;
                const offset = (window.innerHeight - rect.top) * speed;
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    item.style.setProperty('--parallax-y', `${offset}px`);
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <section id="works" className="content-section section-bg-dark" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542892945-931502763527?w=1600&auto=format&fit=crop&q=60')"}}>
            <ProjectGalleryModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            <div className="container">
                <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Our <strong>Featured Projects</strong></h2>
                 <div className="works-list">
                    {workItems.map((item, index) => (
                         <button
                            className={`work-item scroll-trigger fade-up ${index % 2 === 1 ? 'reverse' : ''}`}
                            key={index}
                            onClick={() => setSelectedProject(item)}
                            aria-label={`View project details for ${item.title}`}
                        >
                            <div className="grid">
                                <div className="work-image">
                                    <img src={item.mainImage} alt={item.alt} style={{ transform: `translateY(var(--parallax-y))` }} />
                                    <div className="work-image-overlay" aria-hidden="true">
                                        <h3>{item.title}</h3>
                                        <span className="view-projects-btn">View Project</span>
                                    </div>
                                </div>
                                <div className="work-info">
                                    <p className="meta">{item.meta}</p>
                                    <h2 className="section-title"><strong>{item.title}</strong></h2>
                                    <p className="work-description">{item.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

const BlogSection = () => {
    const blogPosts = [
      {
        title: 'The Future of BIM: AI and Generative Design',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60',
        meta: 'Aug 15, 2024 · Technology',
        link: 'blog-bim-ai.html'
      },
      {
        title: 'Sustainable Materials in Modern Construction',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60',
        meta: 'Aug 10, 2024 · Architecture',
        link: 'blog-sustainable-materials.html'
      },
      {
        title: 'Minimalism and Light: Crafting Serene Spaces',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60',
        meta: 'Aug 05, 2024 · Interior Design',
        link: 'blog-minimalism-light.html'
      },
    ];
  
    return (
      <section id="blog" className="content-section section-bg-white">
        <div className="container">
          <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>From <strong>Our Blog</strong></h2>
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <div className="blog-item scroll-trigger fade-up" key={post.title} style={{ transitionDelay: `${index * 0.1}s` }}>
                <div className="blog-item-image" style={{ backgroundImage: `url(${post.image})` }}></div>
                <div className="blog-item-content">
                  <p className="blog-item-meta">{post.meta}</p>
                  <h3 className="blog-item-title">
                    <a href={post.link}>{post.title}</a>
                  </h3>
                  <a href={post.link} className="blog-item-link">Read More <i className="fas fa-arrow-right"></i></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
      {
        quote: "Taj Design Consult transformed our vision into a stunning reality. Their attention to detail and commitment to quality were evident in every phase of the project. Highly recommended!",
        author: "Ahmed Al-Baker, CEO of Qatar Innovations",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60"
      },
      {
        quote: "Working with Taj's team was a seamless experience. Their professionalism and expertise in navigating local regulations saved us invaluable time and resources.",
        author: "Fatima Al-Kuwari, Real Estate Developer",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60"
      },
      {
        quote: "The final result exceeded all our expectations. The design is not only beautiful but also incredibly functional. Their integrated approach makes all the difference.",
        author: "Yousef Al-Malki, Hospitality Group",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60"
      }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToNext = () => {
        setCurrentIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
    };

    const goToPrev = () => {
        setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
    };

    return (
        <section id="testimonials" className="content-section section-bg-dark" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549439589-36f882436384?w=1600&auto=format&fit=crop&q=60')" }}>
            <div className="container scroll-trigger fade-up">
                <h2 className="section-title" style={{ textAlign: 'center' }}>What Our <strong>Clients Say</strong></h2>
                <div className="testimonials-carousel">
                    <div className="testimonials-wrapper">
                         <div className="testimonials-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {testimonials.map((t, index) => (
                                <div className="testimonial-slide" key={index}>
                                    <div className="testimonial-card">
                                        <img src={t.avatar} alt={`Avatar of ${t.author}`} className="testimonial-avatar" />
                                        <p className="testimonial-quote">"{t.quote}"</p>
                                        <p className="testimonial-author">- {t.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="carousel-btn prev" onClick={goToPrev} aria-label="Previous testimonial"><i className="fas fa-chevron-left"></i></button>
                    <button className="carousel-btn next" onClick={goToNext} aria-label="Next testimonial"><i className="fas fa-chevron-right"></i></button>
                    <div className="carousel-dots">
                        {testimonials.map((_, index) => (
                            <button key={index} className={`dot ${currentIndex === index ? 'active' : ''}`} onClick={() => goToSlide(index)} aria-label={`Go to testimonial ${index + 1}`}></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const ClientsSection = () => {
    const clients = [
        "https://res.cloudinary.com/dj3vhocuf/image/upload/v1761400262/download-1_h8xuyj.png",
        "https://res.cloudinary.com/dj3vhocuf/image/upload/v1761400261/download-2_v3bcyi.png",
        "https://res.cloudinary.com/dj3vhocuf/image/upload/v1761400260/download_h1xxdt.png",
        "https://res.cloudinary.com/dj3vhocuf/image/upload/v1761400260/images_f9a94j.png",
        "https://res.cloudinary.com/dj3vhocuf/image/upload/v1761400259/download-3_qimvyc.png",
    ];
    const doubledClients = [...clients, ...clients];

    return (
        <section id="clients" className="content-section section-bg-white">
            <div className="container">
                <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Our <strong>Valued Clients</strong></h2>
                 <div className="clients-scroller scroll-trigger fade-up">
                    <div className="clients-scroller-inner">
                        {doubledClients.map((client, index) => (
                            <div className="client-logo" key={index}>
                                <img src={client} alt={`Client logo ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
const CustomCursor = memo(() => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || window.innerWidth <= 992) return;

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
            gsap.to([dot, outline], { autoAlpha: 1, duration: 0.3 });
        };
        const hideCursor = () => {
            gsap.to([dot, outline], { autoAlpha: 0, duration: 0.3 });
        };
        
        const handleMouseEnterHoverTarget = () => {
            gsap.to(outline, { scale: 1.6, backgroundColor: 'var(--accent-color)', borderColor: 'transparent', opacity: 0.25, duration: 0.3 });
            gsap.to(dot, { scale: 0, duration: 0.3 });
        };

        const handleMouseLeaveHoverTarget = () => {
            gsap.to(outline, { scale: 1, backgroundColor: 'transparent', borderColor: 'var(--accent-color)', opacity: 1, duration: 0.3 });
            gsap.to(dot, { scale: 1, duration: 0.3 });
        };
        
        window.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseleave", hideCursor);
        document.body.addEventListener("mouseenter", showCursor);

        const hoverTargets = document.querySelectorAll(
            'a, button, [role="button"], .work-item, .service-item, .blog-item, .whatsapp-widget, .carousel-dot, .carousel-nav-btn, .about-image'
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
            <div ref={outlineRef} className="custom-cursor-outline" style={{ opacity: 0 }}></div>
            <div ref={dotRef} className="custom-cursor-dot" style={{ opacity: 0 }}></div>
        </>
    );
});

const ProjectGalleryModal = ({ project, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const lastFocusedElement = useRef<HTMLElement | null>(null);

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

    const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? project.gallery.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev === project.gallery.length - 1 ? 0 : prev + 1));

    return (
        <div className="project-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div ref={modalRef} className="project-modal-content" onClick={e => e.stopPropagation()} tabIndex={-1}>
                <button onClick={onClose} className="project-modal-close" aria-label="Close project gallery">&times;</button>
                <div className="project-modal-gallery">
                    <div className="gallery-main-image">
                        <img src={project.gallery[currentIndex]} alt={`${project.alt} - Image ${currentIndex + 1}`} />
                        {project.gallery.length >= 2 && (
                            <>
                                <button onClick={goToPrevious} className="gallery-nav-btn prev" aria-label="Previous image"><i className="fas fa-chevron-left"></i></button>
                                <button onClick={goToNext} className="gallery-nav-btn next" aria-label="Next image"><i className="fas fa-chevron-right"></i></button>
                            </>
                        )}
                    </div>
                    {project.gallery.length >= 2 && (
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
const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500); // Slight delay for content to be ready
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (loading) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.querySelectorAll('.scroll-trigger').forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const elementsToReveal = document.querySelectorAll('.scroll-trigger');
        elementsToReveal.forEach((el) => observer.observe(el));

        return () => elementsToReveal.forEach((el) => observer.unobserve(el));
    }, [loading]);


    return (
        <div className={`app ${loading ? 'loading' : ''}`}>
            <SchemaMarkup />
            <SkipToContentLink />
            <CustomCursor />
            <WhatsAppChatWidget />
            <Header theme="dark"/>
            <div className="main-container">
                <LeftSidebar pageName="HOME" />
                <main className="main-content" id="main-content" tabIndex={-1}>
                    <HeroSection />
                    <AboutSection />
                    <FactsSection />
                    <ServicesSection />
                    <SectorsSection />
                    <FeaturedProjects />
                    <BlogSection />
                    <TestimonialsSection />
                    <ClientsSection />
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