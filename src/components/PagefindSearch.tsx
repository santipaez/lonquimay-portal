import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

// Páginas y contenido buscable
const SEARCHABLE_PAGES = [
  { url: '/', title: 'Inicio', description: 'Portal principal del municipio', keywords: 'inicio, home, portal, principal' },
  { url: '/el-municipio', title: 'El Municipio', description: 'Información sobre la administración municipal', keywords: 'municipio, gobierno, administración, municipalidad' },
  { url: '/tramites', title: 'Guía de Trámites', description: 'Consulta requisitos y documentación necesaria', keywords: 'trámites, requisitos, documentos, guía, procedimientos, licencia, habilitación' },
  { url: '/servicios', title: 'Servicios', description: 'Servicios municipales disponibles para vecinos', keywords: 'servicios, municipal, atención, oficinas' },
  { url: '/novedades', title: 'Novedades', description: 'Últimas noticias y comunicados oficiales', keywords: 'noticias, novedades, actualidad, eventos' },
  { url: '/pagos', title: 'Pagos Online', description: 'Consulta y paga tus tasas municipales e impuestos', keywords: 'pagos, impuestos, tasas, tributos, facturas, deuda' },
  { url: '/numeros-utiles', title: 'Números Útiles', description: 'Teléfonos de emergencia y servicios esenciales', keywords: 'emergencias, teléfonos, bomberos, policía, hospital' },
  { url: '/mapa', title: 'Mapa Interactivo', description: 'Ubicación de servicios y puntos de interés', keywords: 'mapa, ubicación, direcciones, geolocalización' },
  { url: '/contacto', title: 'Contacto', description: 'Información de contacto y oficinas municipales', keywords: 'contacto, email, teléfono, dirección, comunicarse' },
];

export default function PagefindSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pagefindRef = useRef<any>(null);

  useEffect(() => {
    // Intentar cargar Pagefind si está disponible (solo en producción)
    if (isOpen && !pagefindRef.current && typeof window !== 'undefined') {
      // @ts-ignore - Pagefind se carga globalmente
      if ((window as any).Pagefind) {
        setIsLoading(true);
        (window as any).Pagefind().then((pf: any) => {
          pagefindRef.current = pf;
          setIsLoading(false);
        }).catch((err: Error) => {
          console.error('Error loading Pagefind:', err);
          setIsLoading(false);
        });
      }
    }
  }, [isOpen]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Si Pagefind está disponible, usarlo
    if (pagefindRef.current) {
      setIsLoading(true);
      try {
        const searchResults = await pagefindRef.current.search(searchQuery);
        const resultsData = await Promise.all(
          searchResults.results.slice(0, 5).map(async (result: any) => {
            const data = await result.data();
            return {
              url: data.url,
              title: data.meta?.title || data.url,
              description: data.excerpt ? data.excerpt.replace(/<[^>]*>/g, '').trim().substring(0, 100) : '',
              excerpt: data.excerpt ? data.excerpt.replace(/<[^>]*>/g, '').trim() : ''
            };
          })
        );
        setResults(resultsData);
      } catch (error) {
        console.error('Error searching with Pagefind:', error);
        // Fallback a búsqueda simple
        performSimpleSearch(searchQuery);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Búsqueda simple como fallback
      performSimpleSearch(searchQuery);
    }
  };

  const performSimpleSearch = (searchQuery: string) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const filtered = SEARCHABLE_PAGES.filter(page => {
      const titleMatch = page.title.toLowerCase().includes(searchLower);
      const keywordMatch = page.keywords.toLowerCase().includes(searchLower);
      const descriptionMatch = page.description?.toLowerCase().includes(searchLower);
      return titleMatch || keywordMatch || descriptionMatch;
    }).map(page => ({
      url: page.url,
      title: page.title,
      description: page.description || ''
    }));
    
    setResults(filtered.slice(0, 8));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      <div className="relative w-full">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar trámite o servicio..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm md:text-base focus:outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                searchInputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Resultados */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 max-h-96 overflow-y-auto z-[100]">
            {isLoading && (
              <div className="p-6 text-center text-slate-300">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#7bc143]"></div>
                <p className="mt-2 text-sm">Buscando...</p>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-6 text-center text-slate-300">
                <p className="text-sm">No se encontraron resultados para "{query}"</p>
              </div>
            )}

            {!isLoading && !query && (
              <div className="p-6 text-center text-slate-300">
                <p className="text-sm">Escribe para buscar...</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Resultados ({results.length})
                </div>
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full text-left px-4 py-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-b-0 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#7bc143] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white mb-1 text-base group-hover:text-[#7bc143] transition-colors">
                          {result.title}
                        </h4>
                        {(result.description || result.excerpt) && (
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {result.description || result.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setQuery('');
            setResults([]);
          }}
        />
      )}
    </>
  );
}

