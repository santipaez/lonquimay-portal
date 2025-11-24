import React, { useState, useEffect } from 'react';
import NewsSkeleton from './NewsSkeleton';
import { motion } from 'framer-motion';

interface NewsItem {
  id: number;
  title: string;
  snippet: string;
  image: string;
  category: string;
  date: string;
}

interface NewsListProps {
  initialNews?: NewsItem[];
}

export default function NewsList({ initialNews = [] }: NewsListProps) {
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsData, setNewsData] = useState<NewsItem[]>(initialNews);

  useEffect(() => {
    // Simular carga de datos (cuando conectes Supabase, reemplazá esto)
    const loadNews = async () => {
      setNewsLoading(true);
      // Simular fetch desde Supabase con delay de 0.5-1 segundo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Si hay datos iniciales, usarlos; sino, simular carga vacía
      if (initialNews.length > 0) {
        setNewsData(initialNews);
      }
      
      setNewsLoading(false);
    };
    
    loadNews();
  }, [initialNews]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsLoading ? (
        <NewsSkeleton count={6} />
      ) : newsData.length > 0 ? (
        newsData.map((news, idx) => (
          <motion.article
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
          >
            <div className="h-56 overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-[#7bc143] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                {news.category}
              </span>
              <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full z-10">
                {news.date}
              </span>
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-3 leading-tight text-gray-800 group-hover:text-[#7bc143] transition-colors">
                {news.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {news.snippet}
              </p>
              <a
                href={`/novedades/${news.id}`}
                className="inline-flex items-center gap-2 text-[#7bc143] font-semibold text-sm hover:gap-3 transition-all"
              >
                Leer más
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </motion.article>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">No hay noticias disponibles</p>
        </div>
      )}
    </div>
  );
}

