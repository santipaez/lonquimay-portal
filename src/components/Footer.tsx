import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

const EMERGENCY_NUMBERS = [
    { label: "BOMBEROS", number: "100" },
    { label: "POLICÍA", number: "101" },
    { label: "DEF CIVIL", number: "103" },
    { label: "PREV ADICCIONES", number: "132" },
    { label: "PERS. EN CRISIS", number: "136" },
    { label: "ASST A VÍCTIMAS", number: "144" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800" data-astro-transition-persist>
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Top Section: Grid de 12 columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                    {/* Column 1: Info - 5 columnas */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/logo-lonquimay-96.png"
                                srcSet="/logo-lonquimay-96.png 96w, /logo-lonquimay-192.png 192w"
                                sizes="96px"
                                alt="Logo Lonquimay"
                                className="h-12 w-auto object-contain"
                                width="48"
                                height="48"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/logo-lonquimay.png';
                                }}
                            />
                            <div className="flex flex-col" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                <span className="text-white/80 text-[10px] md:text-xs font-normal uppercase tracking-wide leading-tight">
                                    MUNICIPALIDAD DE
                                </span>
                                <span className="text-[#7bc143] text-lg md:text-xl font-bold uppercase tracking-wide leading-tight">
                                    LONQUIMAY
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                            Trabajando juntos por el desarrollo y bienestar de nuestra comunidad. Un gobierno abierto y cercano a la gente.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white hover:text-[#7bc143] transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white hover:text-[#7bc143] transition-colors"><Instagram size={20} /></a>
                            <a href="mailto:info@lonquimay.gob.ar" className="bg-white/20 p-2 rounded-full hover:bg-white hover:text-[#7bc143] transition-colors"><Mail size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Contact - 4 columnas */}
                    <div className="lg:col-span-4">
                        <h4 className="font-bold mb-6 tracking-wider text-white border-b border-[#7bc143] inline-block pb-1">
                            CONTACTO ÚTIL
                        </h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="shrink-0 mt-1" size={18} />
                                <span>Pedro Bordarampé N°488,<br />CP: 6352, Lonquimay, La Pampa</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="shrink-0" size={18} />
                                <span>info@lonquimay.gob.ar</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="shrink-0" size={18} />
                                <span>(02954) 494255</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Links - 3 columnas */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold mb-6 tracking-wider text-white border-b border-[#7bc143] inline-block pb-1">
                            ENLACES
                        </h4>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li><a href="/el-municipio" className="hover:text-[#7bc143] transition-colors">El Municipio</a></li>
                            <li><a href="/tramites" className="hover:text-[#7bc143] transition-colors">Guía de Trámites</a></li>
                            <li><a href="/servicios" className="hover:text-[#7bc143] transition-colors">Servicios</a></li>
                            <li><a href="/novedades" className="hover:text-[#7bc143] transition-colors">Novedades</a></li>
                            <li><a href="/contacto" className="hover:text-[#7bc143] transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                </div>

                {/* Emergency Bar - Same container width */}
                <div className="bg-gradient-to-r from-[#7bc143] to-[#6aa839] rounded-2xl p-8 w-full shadow-lg">
                    <h5 className="text-center font-bold text-white text-xs mb-4 uppercase tracking-widest">Teléfonos Útiles de Emergencia</h5>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                        {EMERGENCY_NUMBERS.map((item) => (
                            <div key={item.label} className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white mb-1">{item.number}</span>
                                <span className="text-[10px] md:text-xs text-white font-semibold">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
                    <p>© {currentYear} Municipalidad de Lonquimay. Todos los derechos reservados.</p>
                </div>

            </div>
        </footer>
    );
}
