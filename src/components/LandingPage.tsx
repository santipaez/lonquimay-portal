import React from 'react';
import {
  Search,
  CreditCard,
  FileText,
  Newspaper,
  Phone,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  CloudSun,
  Wind,
  Droplets,
  ArrowRight,
  Calendar,
  Pill,
  Sun
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import PagefindSearch from './PagefindSearch';
import NewsSkeleton from './NewsSkeleton';
import InteractiveMap from './InteractiveMap';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces & Types ---
interface ServiceBtn {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  href: string;
}

interface NewsItem {
  id: number;
  title: string;
  snippet: string;
  image: string;
  category: string;
}

// --- Mock Data ---
const SERVICES: ServiceBtn[] = [
  { icon: CreditCard, label: "Pagos", color: "text-white", bgColor: "bg-[#7bc143]", href: "/pagos" },
  { icon: FileText, label: "Trámites", color: "text-white", bgColor: "bg-[#7bc143]", href: "/tramites" },
  { icon: Newspaper, label: "Noticias", color: "text-white", bgColor: "bg-[#7bc143]", href: "/novedades" },
  { icon: Phone, label: "Números Útiles", color: "text-white", bgColor: "bg-[#7bc143]", href: "/numeros-utiles" },
];

const NEWS: NewsItem[] = [
  {
    id: 1,
    category: "Digital",
    title: "Nuevo Portal Digital de Lonquimay",
    snippet: "La Municipalidad de Lonquimay lanza su nuevo portal ciudadano digital, facilitando el acceso a trámites, servicios y información municipal desde cualquier dispositivo...",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    category: "Obras",
    title: "Planificación Urbana y Hábitat",
    snippet: "Se presentó el nuevo plan de desarrollo urbano que incluye mejoras en infraestructura, espacios verdes y vivienda social para el crecimiento sostenible de la ciudad...",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    category: "Social",
    title: "Programas de Asistencia y Conservación",
    snippet: "El municipio continúa implementando programas de asistencia social y conservación del medio ambiente, trabajando junto a la comunidad para mejorar la calidad de vida...",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const EMERGENCY_NUMBERS = [
  { label: "BOMBEROS", number: "100" },
  { label: "POLICÍA", number: "101" },
  { label: "DEF CIVIL", number: "103" },
  { label: "PREV ADICCIONES", number: "132" },
  { label: "PERS. EN CRISIS", number: "136" },
  { label: "ASST A VÍCTIMAS", number: "144" },
];

// --- Components ---




const WeatherWidget = () => {
  const [weatherData, setWeatherData] = React.useState<{
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    description: string;
    icon: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Error al obtener datos del clima');
        }
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('No se pudo cargar el clima');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Actualizar cada 10 minutos
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp?: string) => {
    if (!timestamp) {
      const now = new Date();
      return now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ', ' +
             now.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ', ' +
           date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
        return <CloudSun size={64} className="text-yellow-400" />;
      case 'partly-cloudy':
        return <CloudSun size={64} className="text-yellow-300" />;
      case 'cloudy':
        return <CloudSun size={64} className="text-gray-400" />;
      case 'rainy':
        return <Droplets size={64} className="text-blue-400" />;
      case 'snowy':
        return <CloudSun size={64} className="text-blue-200" />;
      case 'stormy':
        return <CloudSun size={64} className="text-gray-600" />;
      default:
        return <CloudSun size={64} className="text-yellow-400" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 max-w-sm mx-auto border border-gray-100 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

      <div className="text-center relative z-10">
        <h3 className="text-[#7bc143] font-bold text-xl md:text-2xl mb-1">Lonquimay, AR</h3>
        <p className="text-gray-400 text-sm mb-6">
          {loading ? 'Cargando...' : formatDate()}
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-4 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CloudSun size={64} className="text-gray-300" />
            </motion.div>
            <span className="text-6xl font-bold text-gray-300">--<span className="text-3xl align-top">°C</span></span>
          </div>
        ) : error ? (
          <div className="text-gray-400 text-sm py-8">
            {error}
          </div>
        ) : weatherData ? (
          <>
            <div className="flex items-center justify-center gap-4 mb-2">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {getWeatherIcon(weatherData.icon)}
              </motion.div>
              <span className="text-6xl font-bold text-[#7bc143]">
                {weatherData.temperature}
                <span className="text-3xl align-top">°C</span>
              </span>
            </div>

            <p className="text-gray-500 font-medium mb-6 capitalize">
              {weatherData.description}
            </p>

            <div className="flex justify-between text-gray-400 text-xs md:text-sm px-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-600">{weatherData.humidity} %</span>
                <span>Humedad</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-600">{weatherData.pressure} mb</span>
                <span>Presión</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-600">{weatherData.windSpeed} km/h</span>
                <span>Viento</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [newsLoading, setNewsLoading] = React.useState(true);
  const [newsData, setNewsData] = React.useState<NewsItem[]>([]);

  // For hero carousel dots (if adding multiple videos/images later)
  const heroSlides = 1; // Currently just one video

  // Simular carga de datos (cuando conectes Supabase, reemplazá esto)
  React.useEffect(() => {
    // Simular delay de carga de 0.5-1 segundo
    const loadNews = async () => {
      setNewsLoading(true);
      // Simular fetch desde Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewsData(NEWS);
      setNewsLoading(false);
    };
    
    loadNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* --- HEADER --- */}
      <Header client:load currentPage="Inicio" transparent={true} />

      {/* --- HERO SECTION with Left-Aligned Modern Design --- */}
      <section className="relative h-[750px] md:h-[900px] flex items-center pt-20 md:pt-24">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/bg-lonqui.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/70 to-transparent pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 mt-10">
          <div className="max-w-2xl">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl text-white mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="font-light">Bienvenido a</span> <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-300 font-extrabold uppercase tracking-tight">
                LONQUIMAY
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-slate-300 mb-10 font-light leading-relaxed max-w-lg"
            >
              Gestión transparente y cercana. Accedé a trámites, servicios y noticias de tu municipio en un solo lugar.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-2 rounded-full flex flex-row gap-2 w-full max-w-lg relative shadow-2xl"
            >
              <div className="flex-1 flex items-center px-3 md:px-4 min-w-0">
                <Search className="w-5 h-5 text-slate-400 mr-2 md:mr-3 shrink-0" />
                <div className="flex-1 min-w-0 relative">
                  <PagefindSearch />
                </div>
              </div>
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (input && input.value) {
                    window.location.href = `/tramites?q=${encodeURIComponent(input.value)}`;
                  }
                }}
                className="bg-green-700 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 text-sm md:text-base"
              >
                Buscar
              </button>
            </motion.div>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex gap-4 text-sm text-slate-400 flex-wrap"
            >
              <span>Lo más buscado:</span>
              <a href="/pagos" className="text-white hover:text-green-400 underline decoration-green-500/50 underline-offset-4 transition-colors">Impuestos</a>
              <a href="/tramites" className="text-white hover:text-green-400 underline decoration-green-500/50 underline-offset-4 transition-colors">Licencia</a>
            </motion.div>
          </div>
        </div>

        {/* Data Strip integrated */}
        <div className="absolute bottom-0 w-full border-t border-white/10 bg-slate-900/80 backdrop-blur-md z-10">
          <div className="container mx-auto px-3 md:px-6 py-3 md:py-4 flex flex-nowrap justify-between md:justify-between items-center text-xs md:text-sm font-medium tracking-wide overflow-x-auto">
            <div className="flex items-center gap-1.5 md:gap-3 text-slate-300 shrink-0">
              <Calendar className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-400 shrink-0" />
              <span className="uppercase text-[10px] md:text-xs font-bold tracking-widest text-slate-400 hidden sm:inline">Hoy</span>
              <span className="text-white text-[10px] md:text-sm whitespace-nowrap">{new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>
            </div>

            <div className="flex items-center gap-3 md:gap-12 shrink-0">
              <div className="flex items-center gap-1 md:gap-2 text-slate-300">
                <Pill className="w-3.5 h-3.5 md:w-5 md:h-5 text-green-400 shrink-0" />
                <span className="text-[10px] md:text-sm whitespace-nowrap"><span className="hidden sm:inline">Farmacia: </span><b className="text-white">San José</b></span>
              </div>

              <div className="hidden md:block w-px h-4 bg-white/20 shrink-0"></div>

              <div className="flex items-center gap-1 md:gap-2 text-slate-300 shrink-0">
                <CloudSun className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-400 shrink-0" />
                <span className="text-[10px] md:text-sm whitespace-nowrap"><span className="hidden sm:inline">Clima: </span><b className="text-white">24°C</b></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK ACCESS --- */}
      <section className="relative z-20 pb-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center pt-16 mb-28">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Acceso Rápido a Servicios</h2>
            <p className="text-slate-500 text-lg">Gestioná tus trámites y consultas de forma simple y rápida.</p>
          </div>

          <div className="-mt-20 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Pagos */}
            <motion.a
              href="/pagos"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition-colors">Pagos Online</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Consultá tus tasas municipales, imprimí cupones y realizá pagos desde casa.</p>
            </motion.a>

            {/* Trámites */}
            <motion.a
              href="/tramites"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="group bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition-colors">Guía de Trámites</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Requisitos claros para licencias, habilitaciones y catastro municipal.</p>
            </motion.a>

            {/* Novedades */}
            <motion.a
              href="/novedades"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="group bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition-colors">Novedades</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Enterate de las últimas obras, eventos culturales y comunicados oficiales.</p>
            </motion.a>

            {/* Teléfonos Útiles */}
            <motion.a
              href="/numeros-utiles"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -8 }}
              className="group bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.2)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition-colors">Teléfonos Útiles</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Listado de números de emergencia: Policía, Bomberos, Hospital y Guardia.</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* --- NEWS SECTION --- */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Noticias Recientes</h2>
              <div className="h-1 w-20 bg-[#7bc143] mt-3 rounded-full"></div>
            </div>
            <a href="#" className="hidden md:block text-[#7bc143] font-bold hover:underline">Ver todas</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsLoading ? (
              <NewsSkeleton count={3} />
            ) : (
              newsData.map((news, idx) => (
                <motion.article
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-100/50 transition-all group cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative bg-gray-200">
                    <span className="absolute top-4 left-4 bg-[#7bc143] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      {news.category}
                    </span>
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback a una imagen placeholder si falla
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/800x400/7bc143/ffffff?text=${encodeURIComponent(news.title)}`;
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-[#7bc143] transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3">
                      {news.snippet}
                    </p>
                  </div>
                </motion.article>
              ))
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <button className="text-[#7bc143] font-bold">Ver todas las noticias</button>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE MAP --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <InteractiveMap client:only="react" height="500px" showTitle={true} />
            <div className="mt-8 text-center">
              <a
                href="/mapa"
                className="inline-flex items-center gap-2 text-[#7bc143] font-bold hover:underline"
              >
                Ver mapa completo
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- WEATHER & INFO --- */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="order-2 md:order-1">
              <WeatherWidget />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Lonquimay: Corazón de la Pampa</h2>
              <p className="text-gray-600 leading-relaxed">
                Descubrí la inmensidad de nuestra llanura. En Lonquimay, la tranquilidad y la tradición se encuentran en cada rincón. Un pueblo seguro, de gente cálida, donde el horizonte se une con el cielo.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <MapPin className="text-[#7bc143] mb-2" />
                  <h4 className="font-bold">Ubicación</h4>
                  <p className="text-sm text-gray-500">Ruta Nacional 5</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <Wind className="text-[#4a9bb7] mb-2" />
                  <h4 className="font-bold">Cuna de la Tradición</h4>
                  <p className="text-sm text-gray-500">Cultura y Raíces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

      {/* --- WHATSAPP BUTTON --- */}
      <WhatsAppButton />
    </div>
  );
}
