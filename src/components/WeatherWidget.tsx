import React from 'react';
import { CloudSun, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeatherWidget() {
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
    let mounted = true;
    let observer: IntersectionObserver | null = null;
    let timeoutId: NodeJS.Timeout;

    const fetchWeather = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        const lat = -36.4667;
        const lon = -63.6167;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&timezone=America/Argentina/Buenos_Aires`;
        
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { 
          signal: controller.signal,
          priority: 'low' as RequestPriority
        });
        
        if (!response.ok) throw new Error('Error al obtener datos del clima');
        
        const data = await response.json();
        const current = data.current;
        
        if (!mounted) return;
        
        const getDescription = (code: number): string => {
          const descriptions: Record<number, string> = {
            0: 'Cielo despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
            45: 'Niebla', 48: 'Niebla con escarcha', 51: 'Llovizna ligera', 53: 'Llovizna moderada',
            55: 'Llovizna densa', 61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia fuerte',
            71: 'Nieve ligera', 73: 'Nieve moderada', 75: 'Nieve fuerte', 77: 'Granizo',
            80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos fuertes',
            95: 'Tormenta', 96: 'Tormenta con granizo', 99: 'Tormenta fuerte con granizo'
          };
          return descriptions[code] || 'Desconocido';
        };
        
        const getIcon = (code: number): string => {
          if (code === 0 || code === 1) return 'sunny';
          if (code === 2) return 'partly-cloudy';
          if (code === 3 || code === 45 || code === 48) return 'cloudy';
          if (code >= 51 && code <= 67) return 'rainy';
          if (code >= 71 && code <= 86) return 'snowy';
          if (code >= 95) return 'stormy';
          return 'cloudy';
        };
        
        setWeatherData({
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          pressure: Math.round(current.surface_pressure),
          windSpeed: Math.round(current.wind_speed_10m),
          description: getDescription(current.weather_code),
          icon: getIcon(current.weather_code),
        });
        setError(null);
      } catch (err) {
        if (mounted && (err as Error).name !== 'AbortError') {
          setError('No se pudo cargar el clima');
          console.error('Error fetching weather:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const widgetElement = document.querySelector('[data-weather-widget]');
    let weatherInterval: NodeJS.Timeout | null = null;
    
    const startWeatherUpdates = () => {
      fetchWeather();
      weatherInterval = setInterval(() => {
        if (mounted) fetchWeather();
      }, 600000);
    };
    
    if (widgetElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && mounted) {
            startWeatherUpdates();
            if (observer) observer.disconnect();
          }
        },
        { rootMargin: '100px' }
      );
      
      observer.observe(widgetElement);
    } else {
      setTimeout(() => {
        if (mounted) startWeatherUpdates();
      }, 1000);
    }

    return () => {
      mounted = false;
      if (observer) observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (weatherInterval) clearInterval(weatherInterval);
    };
  }, []);

  const formatDate = (timestamp?: string): string => {
    if (typeof window === 'undefined') return '';
    try {
      if (!timestamp) {
        const now = new Date();
        const time = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
        return `${time || ''}, ${date || ''}`;
      }
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
      return `${time || ''}, ${dateStr || ''}`;
    } catch (error) {
      return new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
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
    <div 
      data-weather-widget
      className="bg-white rounded-3xl shadow-lg p-6 md:p-8 max-w-sm mx-auto border border-gray-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

      <div className="text-center relative z-10">
        <h3 className="text-green-700 font-bold text-xl md:text-2xl mb-1">Lonquimay, AR</h3>
        <p className="text-gray-600 text-sm mb-6">
          {loading ? 'Cargando...' : formatDate()}
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-4 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CloudSun size={64} className="text-gray-400" />
            </motion.div>
            <span className="text-6xl font-bold text-gray-600">--<span className="text-3xl align-top text-gray-600">°C</span></span>
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
              <span className="text-6xl font-bold text-green-700">
                {String(weatherData.temperature ?? '--')}
                <span className="text-3xl align-top text-green-700">°C</span>
              </span>
            </div>

            <p className="text-gray-600 font-medium mb-6 capitalize">
              {String(weatherData.description || '')}
            </p>

            <div className="flex justify-between text-gray-400 text-xs md:text-sm px-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-600">{String(weatherData.humidity ?? '--')} %</span>
                <span>Humedad</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-600">{String(weatherData.pressure ?? '--')} mb</span>
                <span>Presión</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-gray-600">{String(weatherData.windSpeed ?? '--')} km/h</span>
                <span>Viento</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

