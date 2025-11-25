import React, { useEffect, useState } from 'react';
import { DataService } from '../services/mockBackend';
import { Calendar as CalendarIcon, Clock, Briefcase, Megaphone } from 'lucide-react';
import { UserRole } from '../types';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'vacancy' | 'ad' | 'exam';
  description: string;
}

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const vacancies = await DataService.getVacancies(UserRole.STUDENT); // View approved
      const ads = await DataService.getActiveAds();
      
      const vEvents: CalendarEvent[] = vacancies.map(v => ({
        id: v.id,
        title: `Deadline: ${v.title}`,
        date: v.deadline,
        type: 'vacancy',
        description: `${v.company} - ${v.location}`
      }));

      const aEvents: CalendarEvent[] = ads.map(a => ({
        id: a.id,
        title: `Event Ends: ${a.title}`,
        date: a.endDate,
        type: 'ad',
        description: 'Promotional Event'
      }));

      // Sort by date
      const allEvents = [...vEvents, ...aEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(allEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
           <CalendarIcon size={24} />
         </div>
         <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Calendar</h2>
            <p className="text-slate-500 dark:text-slate-400">Upcoming deadlines and events.</p>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">No upcoming events found.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
             {events.map((evt, idx) => {
               const date = new Date(evt.date);
               const day = date.getDate();
               const month = date.toLocaleString('default', { month: 'short' });
               
               return (
                 <div key={idx} className="p-6 flex items-start gap-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl shrink-0 border border-slate-200 dark:border-slate-600">
                       <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{month}</span>
                       <span className="text-2xl font-bold text-slate-800 dark:text-white">{day}</span>
                    </div>
                    
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          {evt.type === 'vacancy' && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><Briefcase size={10}/> Job Deadline</span>}
                          {evt.type === 'ad' && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><Megaphone size={10}/> Event</span>}
                       </div>
                       <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{evt.title}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm">{evt.description}</p>
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;