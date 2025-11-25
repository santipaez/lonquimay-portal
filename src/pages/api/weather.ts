import type { APIRoute } from 'astro';

export const prerender = false;

// Coordenadas de Lonquimay, La Pampa, Argentina
const LONQUIMAY_LAT = -36.4667;
const LONQUIMAY_LON = -63.6167;

export const GET: APIRoute = async () => {
  try {
    // Usar API key de OpenWeatherMap desde variable de entorno
    // Si no está configurada, usar una API key pública de prueba (limitada)
    const apiKey = import.meta.env.PUBLIC_WEATHER_API_KEY || 'demo';
    
    // Si es 'demo', usar una API alternativa gratuita que no requiere key
    if (apiKey === 'demo') {
      // Usar Open-Meteo API (gratuita, no requiere API key)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LONQUIMAY_LAT}&longitude=${LONQUIMAY_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&timezone=America/Argentina/Buenos_Aires`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener datos del clima');
      }
      
      const data = await response.json();
      
      // Convertir datos de Open-Meteo al formato que esperamos
      const current = data.current;
      
      // Open-Meteo devuelve wind_speed_10m en km/h por defecto, no necesita conversión
      const windSpeed = Math.round(current.wind_speed_10m);
      
      return new Response(JSON.stringify({
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.surface_pressure),
        windSpeed: windSpeed,
        weatherCode: current.weather_code,
        description: getWeatherDescription(current.weather_code),
        icon: getWeatherIcon(current.weather_code),
        timestamp: current.time
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
        }
      });
    } else {
      // Usar OpenWeatherMap si hay API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LONQUIMAY_LAT}&lon=${LONQUIMAY_LON}&appid=${apiKey}&units=metric&lang=es`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener datos del clima');
      }
      
      const data = await response.json();
      
      // OpenWeatherMap con units=metric devuelve wind.speed en m/s, convertir a km/h
      const windSpeed = Math.round(data.wind.speed * 3.6);
      
      return new Response(JSON.stringify({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        pressure: Math.round(data.main.pressure),
        windSpeed: windSpeed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener datos del clima' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Función auxiliar para convertir códigos de clima de Open-Meteo a descripciones
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Cielo despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia fuerte',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve fuerte',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos fuertes',
    85: 'Nevadas ligeras',
    86: 'Nevadas fuertes',
    95: 'Tormenta',
    96: 'Tormenta con granizo',
    99: 'Tormenta fuerte con granizo'
  };
  return descriptions[code] || 'Desconocido';
}

// Función auxiliar para obtener el icono según el código del clima
function getWeatherIcon(code: number): string {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2) return 'partly-cloudy';
  if (code === 3 || code === 45 || code === 48) return 'cloudy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'cloudy';
}

