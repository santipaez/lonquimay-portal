import React, { useEffect, useRef, useState } from 'react';
import { Building2, Hospital, Pill, Shield, CreditCard } from 'lucide-react';

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
    color: '#15803d'
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
    if (typeof window === 'undefined') return;
    
    setIsClient(true);

    let mounted = true;
    let observer: IntersectionObserver | null = null;

    const initMap = async () => {
      if (!mounted) return;
      try {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        if (!mapContainerRef.current) {
          const container = document.querySelector('[data-map-container="true"]');
          if (container && !mapContainerRef.current) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
          if (!mapContainerRef.current) {
            setIsLoading(false);
            return;
          }
        }

        const L = await import('leaflet');
        
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = '';
          cssLink.media = 'print';
          cssLink.onload = function() {
            (this as HTMLLinkElement).media = 'all';
          };
          document.head.appendChild(cssLink);
        }
        
        try {
          await import('leaflet/dist/leaflet.css');
        } catch (e) {
          console.warn('No se pudo cargar CSS local de Leaflet, usando CDN');
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));

        if (mapRef.current) {
          console.warn('El mapa ya está inicializado');
          setIsLoading(false);
          return;
        }

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

        const lonquimayCenter: [number, number] = [-36.4642, -63.6244];

        const getIconSVG = (iconType: MapPoint['icon']): string => {
          const icons = {
            municipalidad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <path d="M9 22v-4h6v4"/>
              <path d="M8 6h8M8 10h8M8 14h8M8 18h8"/>
            </svg>`,
            hospital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21h-4a2 2 0 0 1-2-2v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/>
              <line x1="12" y1="11" x2="12" y2="15"/>
              <line x1="10" y1="13" x2="14" y2="13"/>
            </svg>`,
            farmacia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <line x1="12" y1="6" x2="12" y2="22"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>`,
            policia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>`,
            cajero: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="7" y1="8" x2="7.01" y2="8"/>
              <line x1="11" y1="8" x2="13" y2="8"/>
              <line x1="17" y1="8" x2="17.01" y2="8"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
            </svg>`
          };
          
          return icons[iconType] || icons.municipalidad;
        };

        const createCustomIcon = (color: string, iconType: MapPoint['icon']) => {
          const iconSVG = getIconSVG(iconType);

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
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 3px solid white;
              ">
                <div style="
                  color: white;
                  width: 24px;
                  height: 24px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  ${iconSVG}
                </div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
          });
        };

        if (mapContainerRef.current) {
          mapContainerRef.current.style.height = height;
          mapContainerRef.current.style.width = '100%';
        }

        const map = Leaflet.map(mapContainerRef.current, {
          center: lonquimayCenter,
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: true
        });

        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            map.invalidateSize();
          });
        });

        MAP_POINTS.forEach((point) => {
          const marker = Leaflet.marker([point.lat, point.lng], {
            icon: createCustomIcon(point.color, point.icon)
          }).addTo(map);

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

        const group = new Leaflet.FeatureGroup(
          MAP_POINTS.map(point => Leaflet.marker([point.lat, point.lng]))
        );
        map.fitBounds(group.getBounds().pad(0.1));

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            map.invalidateSize();
          });
        });

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

    const mapElement = mapContainerRef.current || document.querySelector('[data-map-container="true"]');
    
    if (mapElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && mounted) {
            initMap();
            if (observer) observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      
      observer.observe(mapElement);
    } else {
      setTimeout(() => {
        if (mounted) initMap();
      }, 500);
    }

    return () => {
      mounted = false;
      if (observer) observer.disconnect();
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
          <div className="h-1 w-20 bg-green-700 mx-auto mt-3 rounded-full"></div>
        </div>
      )}
      
      <div className="relative">
        {showLoading && (
          <div 
            style={{ height, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 2 }}
            className="rounded-2xl shadow-lg border border-gray-200 bg-gray-100 animate-pulse flex items-center justify-center"
          >
            <p className="text-gray-700">Cargando mapa...</p>
          </div>
        )}
        <div 
          ref={mapContainerRef} 
          style={{ height, width: '100%', minHeight: height, position: 'relative', zIndex: 1 }}
          className="rounded-2xl shadow-lg border border-gray-200"
          data-map-container="true"
        />
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {MAP_POINTS.map((point) => {
          const getLegendIcon = () => {
            const iconProps = { size: 20, className: "flex-shrink-0" };
            switch (point.icon) {
              case 'municipalidad':
                return <Building2 {...iconProps} style={{ color: point.color }} />;
              case 'hospital':
                return <Hospital {...iconProps} style={{ color: point.color }} />;
              case 'farmacia':
                return <Pill {...iconProps} style={{ color: point.color }} />;
              case 'policia':
                return <Shield {...iconProps} style={{ color: point.color }} />;
              case 'cajero':
                return <CreditCard {...iconProps} style={{ color: point.color }} />;
              default:
                return null;
            }
          };
          
          return (
            <div
              key={point.id}
              className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            >
              {getLegendIcon()}
              <span className="text-sm font-semibold text-gray-700">{point.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

