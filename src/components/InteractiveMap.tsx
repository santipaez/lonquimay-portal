import React, { useEffect, useRef, useState } from 'react';

interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  icon: 'municipalidad' | 'hospital' | 'farmacia' | 'policia' | 'cajero';
  color: string;
}

interface InteractiveMapProps {
  height?: string;
  showTitle?: boolean;
}

const MAP_POINTS: MapPoint[] = [
  {
    id: 'municipalidad',
    name: 'Municipalidad de Lonquimay',
    lat: -36.4642,
    lng: -63.6244,
    description: 'Edificio Municipal - Sector Rentas y Administración',
    icon: 'municipalidad',
    color: '#7bc143'
  },
  {
    id: 'hospital',
    name: 'Hospital / Salita',
    lat: -36.4635,
    lng: -63.6250,
    description: 'Centro de Salud Municipal',
    icon: 'hospital',
    color: '#ef4444'
  },
  {
    id: 'farmacia',
    name: 'Farmacia',
    lat: -36.4645,
    lng: -63.6235,
    description: 'Farmacia local',
    icon: 'farmacia',
    color: '#3b82f6'
  },
  {
    id: 'policia',
    name: 'Comisaría',
    lat: -36.4638,
    lng: -63.6248,
    description: 'Policía - Emergencias 101',
    icon: 'policia',
    color: '#1e40af'
  },
  {
    id: 'cajero',
    name: 'Cajero Automático',
    lat: -36.4640,
    lng: -63.6240,
    description: 'Único cajero automático del pueblo',
    icon: 'cajero',
    color: '#10b981'
  }
];

export default function InteractiveMap({ height = '600px', showTitle = true }: InteractiveMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    setIsClient(true);

    let timer: NodeJS.Timeout;
    let mounted = true;

    const initMap = async () => {
      if (!mounted) return;
      try {
        // Esperar a que el componente esté montado y el DOM esté listo
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verificar que el contenedor esté disponible
        if (!mapContainerRef.current) {
          // Intentar encontrar el contenedor por el atributo data
          const container = document.querySelector('[data-map-container="true"]');
          if (container && !mapContainerRef.current) {
            // Si encontramos el contenedor pero el ref no está asignado, esperar un poco más
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
          if (!mapContainerRef.current) {
            console.error('Contenedor del mapa no encontrado después de esperar');
            console.log('Estado del ref:', mapContainerRef.current);
            console.log('Contenedor en DOM:', document.querySelector('[data-map-container="true"]'));
            setIsLoading(false);
            return;
          }
        }

        // Importación dinámica de Leaflet solo en el cliente
        const L = await import('leaflet');
        
        // Cargar CSS de Leaflet desde CDN si no está disponible
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = '';
          document.head.appendChild(cssLink);
        }
        
        // También intentar importar el CSS localmente
        try {
          await import('leaflet/dist/leaflet.css');
        } catch (e) {
          console.warn('No se pudo cargar CSS local de Leaflet, usando CDN');
        }
        
        // Esperar un momento para que el CSS esté listo
        await new Promise(resolve => setTimeout(resolve, 200));

        if (mapRef.current) {
          console.warn('El mapa ya está inicializado');
          setIsLoading(false);
          return;
        }

        // Leaflet se importa como namespace, no como default
        const Leaflet = L as typeof import('leaflet');
        
        if (!Leaflet || typeof Leaflet.map !== 'function') {
          console.error('Leaflet no se cargó correctamente', { 
            L,
            Leaflet,
            hasMap: typeof Leaflet?.map
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Leaflet cargado correctamente');

        // Coordenadas de Lonquimay, La Pampa
        const lonquimayCenter: [number, number] = [-36.4642, -63.6244];

        // Función para crear iconos personalizados (dentro del useEffect para tener acceso a L)
        const createCustomIcon = (color: string, iconType: MapPoint['icon']) => {
          const iconMap = {
            municipalidad: '🏛️',
            hospital: '🏥',
            farmacia: '💊',
            policia: '🚔',
            cajero: '🏧'
          };

          return Leaflet.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background-color: ${color};
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 3px solid white;
              ">
                ${iconMap[iconType]}
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
          });
        };

        // Asegurar que el contenedor tenga dimensiones
        if (mapContainerRef.current) {
          mapContainerRef.current.style.height = height;
          mapContainerRef.current.style.width = '100%';
        }

        // Inicializar el mapa
        const map = Leaflet.map(mapContainerRef.current, {
          center: lonquimayCenter,
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Agregar capa de OpenStreetMap
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Invalidar el tamaño del mapa para asegurar que se renderice correctamente
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        // Agregar marcadores
        MAP_POINTS.forEach((point) => {
          const marker = Leaflet.marker([point.lat, point.lng], {
            icon: createCustomIcon(point.color, point.icon)
          }).addTo(map);

          // Popup con información
          marker.bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: ${point.color};">
                ${point.name}
              </h3>
              <p style="margin: 0; color: #666; font-size: 14px;">
                ${point.description}
              </p>
            </div>
          `);
        });

        // Ajustar el view para mostrar todos los marcadores
        const group = new Leaflet.FeatureGroup(
          MAP_POINTS.map(point => Leaflet.marker([point.lat, point.lng]))
        );
        map.fitBounds(group.getBounds().pad(0.1));

        // Invalidar el tamaño del mapa para asegurar que se renderice
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        mapRef.current = map;
        setIsLoading(false);
        console.log('Mapa cargado correctamente');
      } catch (error) {
        console.error('Error loading map:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setIsLoading(false);
      }
    };

    // Delay para asegurar que el componente esté montado y el DOM esté listo
    timer = setTimeout(() => {
      initMap();
    }, 200);

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Error al limpiar el mapa:', e);
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Mostrar skeleton mientras carga, pero mantener el contenedor del mapa siempre renderizado
  const showLoading = !isClient || isLoading;

  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Mapa Interactivo de Lonquimay
          </h2>
          <p className="text-gray-600">
            Ubicaciones de los puntos clave del pueblo
          </p>
          <div className="h-1 w-20 bg-[#7bc143] mx-auto mt-3 rounded-full"></div>
        </div>
      )}
      
      <div className="relative">
        {showLoading && (
          <div 
            style={{ height, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 2 }}
            className="rounded-2xl shadow-lg border border-gray-200 bg-gray-200 animate-pulse flex items-center justify-center"
          >
            <p className="text-gray-500">Cargando mapa...</p>
          </div>
        )}
        <div 
          ref={mapContainerRef} 
          style={{ height, width: '100%', minHeight: height, position: 'relative', zIndex: 1 }}
          className="rounded-2xl shadow-lg border border-gray-200"
          data-map-container="true"
        />
      </div>
      
      {/* Leyenda */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {MAP_POINTS.map((point) => {
          const iconMap = {
            municipalidad: '🏛️',
            hospital: '🏥',
            farmacia: '💊',
            policia: '🚔',
            cajero: '🏧'
          };
          
          return (
            <div
              key={point.id}
              className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{iconMap[point.icon]}</span>
              <span className="text-sm font-semibold text-gray-700">{point.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
