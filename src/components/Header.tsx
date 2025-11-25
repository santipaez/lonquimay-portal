import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = ({ isSolid }: { isSolid: boolean }) => (
    <div className="flex items-center gap-2">
        <img
            src="/logo-lonquimay.png"
            alt="Logo Lonquimay"
            className="h-7 md:h-9 w-auto object-contain"
        />
        <div className="flex flex-col" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className={`text-[10px] md:text-xs font-normal uppercase tracking-wide leading-tight transition-colors ${
                isSolid ? 'text-gray-600' : 'text-white'
            }`}>
                MUNICIPALIDAD DE
            </span>
            <span className="text-[#7bc143] text-base md:text-lg font-bold uppercase tracking-wide leading-tight">
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
        // Solo escuchar el scroll si el header puede ser transparente
        if (!transparent) {
            // En páginas internas, siempre está sólido
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial position

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
            <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between py-2">
                <a href="/">
                    <Logo isSolid={shouldBeSolid} />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`font-medium transition-colors text-sm uppercase tracking-wide ${
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

                {/* Mobile Menu Toggle */}
                <button
                    className={`md:hidden p-2 transition-colors ${
                        shouldBeSolid ? 'text-gray-600' : 'text-white'
                    }`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
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
