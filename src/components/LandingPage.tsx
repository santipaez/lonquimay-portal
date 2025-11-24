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
  ArrowRight
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
             now.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ', ' +
           date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
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
          {loading ? 'Cargando...' : formatDate(weatherData?.timestamp)}
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
      <Header client:load currentPage="Inicio" />

      {/* --- HERO SECTION with Video Background --- */}
      <section className="relative h-[50vh] md:h-[600px] w-full overflow-hidden bg-gray-900">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/bg-lonqui.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl text-white"
            >
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Bienvenido al Portal Ciudadano Digital de Lonquimay
              </h1>
              <motion.a
                href="/tramites"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#7bc143] hover:bg-[#6aa839] text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg shadow-green-900/20 transition-all inline-flex items-center gap-2 whitespace-nowrap w-fit"
              >
                <span>Buscar Información</span>
                <ArrowRight size={20} className="flex-shrink-0" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SEARCH BAR --- */}
      <section className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex justify-center">
            <div className="bg-gray-50 rounded-xl shadow-md p-3 max-w-2xl w-full border border-gray-200">
              <PagefindSearch />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden">
            <div className="bg-gray-50 rounded-xl shadow-md p-3 max-w-lg mx-auto border border-gray-200">
              <PagefindSearch />
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK ACCESS --- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Acceso Rápido a Servicios</h2>
            <div className="h-1 w-20 bg-[#7bc143] mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {SERVICES.map((service, idx) => (
              <motion.a
                key={service.label}
                href={service.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className={`${service.bgColor} w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shadow-gray-200 group-hover:shadow-xl transition-all mb-4`}>
                  <service.icon size={32} className="text-white md:w-10 md:h-10" />
                </div>
                <span className="font-bold text-gray-700 text-lg group-hover:text-[#7bc143] transition-colors">{service.label}</span>
              </motion.a>
            ))}
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
