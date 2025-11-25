import React, { useEffect, useState } from 'react';
import { Advertisement } from '../types';
import { DataService } from '../services/mockBackend';
import { ExternalLink } from 'lucide-react';

const AdCarousel: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getActiveAds().then((data) => {
      setAds(data);
      setLoading(false);
    });
  }, []);

  if (loading || ads.length === 0) return null;

  return (
    <div className="mb-8">
       <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">Announcements & Offers</h3>
       <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
         {ads.map(ad => (
           <div 
             key={ad.id} 
             className="snap-center shrink-0 w-[300px] md:w-[400px] h-[200px] relative rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group"
           >
             <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-white font-bold text-lg mb-1 shadow-sm">{ad.title}</h4>
                {ad.linkUrl && (
                  <a 
                    href={ad.linkUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-white transition-colors"
                  >
                    Learn More <ExternalLink size={12} />
                  </a>
                )}
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default AdCarousel;