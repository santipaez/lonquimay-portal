import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = ({ isSolid }: { isSolid: boolean }) => (
    <div className="flex items-center gap-2 sm:gap-3">
        <img
            src="/logo-lonquimay.png"
            alt="Logo Lonquimay"
            className="h-10 sm:h-11 md:h-14 w-auto object-contain shrink-0"
        />
        <div className="flex flex-col min-w-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className={`text-xs sm:text-sm md:text-base font-normal uppercase tracking-wide leading-tight transition-colors whitespace-nowrap ${
                isSolid ? 'text-gray-600' : 'text-white'
            }`}>
                MUNICIPALIDAD DE
            </span>
            <span className="text-[#7bc143] text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide leading-tight whitespace-nowrap">
                LONQUIMAY
            </span>
        </div>
    </div>
);

interface HeaderProps {
    currentPage?: string;
    transparent?: boolean; // Si es true, el header es transparente (para home), si es false, siempre sólido (para páginas internas)
}

export default function Header({ currentPage = 'Inicio', transparent = false }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (!transparent) {
            setIsScrolled(true);
            return;
        }

        let ticking = false;
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    if (Math.abs(scrollPosition - lastScrollY) > 5) {
                        setIsScrolled(scrollPosition > 50);
                        lastScrollY = scrollPosition;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        requestAnimationFrame(() => {
            setIsScrolled(window.scrollY > 50);
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparent]);

    const menuItems = [
        { label: 'Inicio', href: '/' },
        { label: 'El Municipio', href: '/el-municipio' },
        { label: 'Guía de Trámites', href: '/tramites' },
        { label: 'Servicios', href: '/servicios' },
        { label: 'Novedades', href: '/novedades' },
        { label: 'Mapa', href: '/mapa' },
        { label: 'Contacto', href: '/contacto' }
    ];

    // Determinar si el header debe estar sólido o transparente
    const shouldBeSolid = transparent ? isScrolled : true; // Si transparent=false, siempre sólido

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                shouldBeSolid
                    ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' 
                    : 'bg-transparent shadow-none border-b border-transparent'
            }`} 
            data-astro-transition-persist
        >
            <div className="container mx-auto px-3 sm:px-4 md:px-8 h-20 sm:h-24 md:h-28 flex items-center justify-between py-2">
                <a href="/" className="shrink-0 min-w-0">
                    <Logo isSolid={shouldBeSolid} />
                </a>

                {/* Desktop Nav - Solo se muestra en pantallas grandes (lg y más) */}
                <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`font-medium transition-colors text-sm xl:text-base uppercase tracking-wide whitespace-nowrap ${
                                currentPage === item.label
                                    ? 'text-[#7bc143] font-bold'
                                    : shouldBeSolid
                                        ? 'text-gray-600 hover:text-[#7bc143]'
                                        : 'text-white hover:text-green-300'
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile/Tablet Menu Toggle - Se muestra desde md hacia abajo (incluye tablets) */}
                <button
                    className={`lg:hidden p-2 transition-colors shrink-0 ${
                        shouldBeSolid ? 'text-gray-600' : 'text-white'
                    }`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menú"
                >
                    {isMenuOpen ? <X size={28} className="sm:w-8 sm:h-8" /> : <Menu size={28} className="sm:w-8 sm:h-8" />}
                </button>
            </div>

            {/* Mobile/Tablet Nav Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ maxHeight: 0, opacity: 0 }}
                        animate={{ maxHeight: 500, opacity: 1 }}
                        exit={{ maxHeight: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                        style={{ willChange: 'max-height, opacity' }}
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {menuItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`font-medium py-2 border-b border-gray-50 ${currentPage === item.label
                                            ? 'text-[#7bc143] font-bold'
                                            : 'text-gray-600 hover:text-[#7bc143]'
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
