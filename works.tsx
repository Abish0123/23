

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
      description: 'We provide end-to-end office interior design and on-site supervision—covering space planning, materials and finishes, MEP coordination, and quality control—to deliver functional, branded workplaces on time and within budget. Our team manages contractors, shop drawings, and inspections, ensuring QCDD/NFPA and Baladiya compliance from concept to handover for a smooth, approval-ready fit-out.',
      mainImage: 'https://res.cloudinary.com/dj3vhocuf/image/upload/v1761224706/WhatsApp_Image_2025-10-22_at_23.46.06_e814e5d0_uqphxj.png',
      gallery: [
        'https://res.cloudinary.com/dj3vhocuf/image/upload/v1761224706/WhatsApp_Image_2025-10-22_at_23.46.06_e814e5d0_uqphxj.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/v1761224698/WhatsApp_Image_2025-10-22_at_23.46.07_714b8d87_1_eljwpn.png',
        'https://res.cloudinary.com/dj3vhocuf/image/upload/v1761224698/WhatsApp_Image_2025-10-22_at_23.46.07_d6db18c5_tovqbt.png'
      ]
    },
    { 
      title: 'World Wide Business Center',
      meta: 'Design and Supervision