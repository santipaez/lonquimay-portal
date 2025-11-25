import React, { Suspense } from 'react';
import { Search, Calendar, Pill, CloudSun } from 'lucide-react';
import PagefindSearch from './PagefindSearch';

export default function HeroContent() {
  const [currentDate, setCurrentDate] = React.useState<string>('');

  React.useEffect(() => {
    try {
      const dateStr = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
      setCurrentDate(dateStr || '');
    } catch {
      setCurrentDate(new Date().toLocaleDateString('es-AR') || '');
    }
  }, []);

  return (
    <>
      <div className="relative z-30 container mx-auto px-6 md:px-12 mt-10">
        <div className="max-w-2xl">
          <h1
            className="text-5xl md:text-7xl text-white mb-6 leading-tight tracking-tight lcp-title"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className="font-light">Bienvenido a</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 font-extrabold uppercase tracking-tight">
              LONQUIMAY
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed max-w-lg lcp-subtitle"
          >
            Gestión transparente y cercana. Accedé a trámites, servicios y noticias de tu municipio en un solo lugar.
          </p>

          <div
            className="bg-white p-2 rounded-full flex flex-row gap-2 w-full max-w-lg relative shadow-2xl lcp-search"
          >
            <div className="flex-1 flex items-center px-3 md:px-4 min-w-0">
              <Search className="w-5 h-5 text-slate-500 mr-2 md:mr-3 shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0 relative">
                <Suspense fallback={null}>
                  <PagefindSearch />
                </Suspense>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                const form = e.currentTarget.closest('form') || 
                            e.currentTarget.parentElement?.querySelector('input[type="text"]')?.closest('form');
                const input = form?.querySelector('input[type="text"]') as HTMLInputElement ||
                             document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input?.value) {
                  window.location.href = `/tramites?q=${encodeURIComponent(input.value)}`;
                }
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 text-sm md:text-base"
              aria-label="Buscar en el portal"
            >
              Buscar
            </button>
          </div>

          <div
            className="mt-8 flex gap-4 text-sm text-slate-200 flex-wrap lcp-popular"
          >
            <span>Lo más buscado:</span>
            <a href="/pagos" className="text-white hover:text-green-300 underline decoration-green-400 underline-offset-4 transition-colors" aria-label="Buscar información sobre impuestos">Impuestos</a>
            <a href="/tramites" className="text-white hover:text-green-300 underline decoration-green-400 underline-offset-4 transition-colors" aria-label="Buscar información sobre licencias">Licencia</a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full border-t border-white/10 bg-slate-900/80 backdrop-blur-md z-30">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4 flex flex-nowrap justify-between md:justify-between items-center text-sm md:text-sm font-medium tracking-wide overflow-x-auto">
          <div className="flex items-center gap-2 md:gap-3 text-slate-200 shrink-0">
            <Calendar className="w-5 h-5 md:w-5 md:h-5 text-green-300 shrink-0" aria-hidden="true" />
            <span className="uppercase text-xs md:text-xs font-bold tracking-widest text-slate-300 hidden sm:inline">Hoy</span>
            <time dateTime={new Date().toISOString()} className="text-white text-sm md:text-sm whitespace-nowrap" aria-label="Fecha actual">
              {currentDate}
            </time>
          </div>

          <div className="flex items-center gap-4 md:gap-12 shrink-0">
            <div className="flex items-center gap-2 md:gap-2 text-slate-200">
              <Pill className="w-5 h-5 md:w-5 md:h-5 text-green-300 shrink-0" aria-hidden="true" />
              <span className="text-sm md:text-sm whitespace-nowrap"><span className="hidden sm:inline">Farmacia: </span><b className="text-white">San José</b></span>
            </div>

            <div className="hidden md:block w-px h-4 bg-white/20 shrink-0" aria-hidden="true"></div>

            <div className="flex items-center gap-2 md:gap-2 text-slate-200 shrink-0">
              <CloudSun className="w-5 h-5 md:w-5 md:h-5 text-yellow-300 shrink-0" aria-hidden="true" />
              <span className="text-sm md:text-sm whitespace-nowrap"><span className="hidden sm:inline">Clima: </span><b className="text-white">24°C</b></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

