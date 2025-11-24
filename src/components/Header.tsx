import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = () => (
    <div className="flex items-center gap-3">
        <img
            src="/logo-lonquimay.png"
            alt="Logo Lonquimay"
            className="h-8 md:h-10 w-auto object-contain"
        />
        <div className="flex flex-col" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className="text-gray-600 text-[10px] md:text-xs font-normal uppercase tracking-wide leading-tight">
                MUNICIPALIDAD DE
            </span>
            <span className="text-[#7bc143] text-lg md:text-xl font-bold uppercase tracking-wide leading-tight">
                LONQUIMAY
            </span>
        </div>
    </div>
);

interface HeaderProps {
    currentPage?: string;
}

export default function Header({ currentPage = 'Inicio' }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Inicio', href: '/' },
        { label: 'El Municipio', href: '/el-municipio' },
        { label: 'Guía de Trámites', href: '/tramites' },
        { label: 'Servicios', href: '/servicios' },
        { label: 'Novedades', href: '/novedades' },
        { label: 'Mapa', href: '/mapa' },
        { label: 'Contacto', href: '/contacto' }
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100" data-astro-transition-persist>
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                <a href="/">
                    <Logo />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`font-medium transition-colors text-sm uppercase tracking-wide ${currentPage === item.label
                                    ? 'text-[#7bc143] font-bold'
                                    : 'text-gray-600 hover:text-[#7bc143]'
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-600 p-2"
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
