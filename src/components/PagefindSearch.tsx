import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

// Páginas y contenido buscable
const SEARCHABLE_PAGES = [
  { url: '/', title: 'Inicio', keywords: 'inicio, home, portal, principal' },
  { url: '/el-municipio', title: 'El Municipio', keywords: 'municipio, gobierno, administración, municipalidad' },
  { url: '/tramites', title: 'Guía de Trámites', keywords: 'trámites, requisitos, documentos, guía, procedimientos' },
  { url: '/servicios', title: 'Servicios', keywords: 'servicios, municipal, atención, oficinas' },
  { url: '/novedades', title: 'Novedades', keywords: 'noticias, novedades, actualidad, eventos' },
  { url: '/pagos', title: 'Pagos', keywords: 'pagos, impuestos, tasas, tributos, facturas' },
  { url: '/numeros-utiles', title: 'Números Útiles', keywords: 'emergencias, teléfonos, bomberos, policía, hospital' },
  { url: '/mapa', title: 'Mapa', keywords: 'mapa, ubicación, direcciones, geolocalización' },
  { url: '/contacto', title: 'Contacto', keywords: 'contacto, email, teléfono, dirección, comunicarse' },
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
              excerpt: data.excerpt || ''
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
      const urlMatch = page.url.toLowerCase().includes(searchLower);
      return titleMatch || keywordMatch || urlMatch;
    }).map(page => ({
      url: page.url,
      title: page.title,
      excerpt: `Página: ${page.title}`
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
            placeholder="Buscar trámites, servicios, información..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-gray-100 rounded-xl py-3 px-4 pl-12 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7bc143] transition-all"
          />
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                searchInputRef.current?.focus();
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Resultados */}
        {isOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
            {isLoading && (
              <div className="p-6 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#7bc143]"></div>
                <p className="mt-2 text-sm">Buscando...</p>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">No se encontraron resultados para "{query}"</p>
              </div>
            )}

            {!isLoading && !query && (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">Escribe para buscar...</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                      {result.title}
                    </h4>
                    {result.excerpt && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {result.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-[#7bc143] mt-1">
                      {result.url}
                    </p>
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

