import React from 'react';
import { GenocideData } from '../types';
import { Calendar, User, MapPin, Clock, Skull, AlertTriangle, BookOpen, Users } from 'lucide-react';

interface InfoCardProps {
  data: GenocideData;
}

export const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm relative group transition-all duration-300 hover:shadow-md hover:border-slate-300 h-full">
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: data.color }}></div>
      
      <div className="p-4 md:p-5 flex-1">
        <div className="mb-4">
             <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{data.location.continent}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
             <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs">
                    <Calendar size={14} /> Inicio - Fin
                </div>
                <div className="font-semibold text-slate-800">{data.startDate} - {data.endDate}</div>
             </div>

             <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs">
                    <Clock size={14} /> Duración
                </div>
                <div className="font-semibold text-slate-800">{data.duration}</div>
             </div>
          </div>

          <div className="space-y-3 pt-2 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
                <div className="mt-1 min-w-[20px] text-slate-400"><AlertTriangle size={16} /></div>
                <div>
                    <span className="text-xs text-slate-500 block">Perpetradores / Causa</span>
                    <span className="text-sm font-medium text-slate-700">{data.perpetrators}</span>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="mt-1 min-w-[20px] text-slate-400"><Users size={16} /></div>
                <div>
                    <span className="text-xs text-slate-500 block">Víctimas / Grupo Afectado</span>
                    <span className="text-sm font-medium text-slate-700">{data.victims}</span>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="mt-1 min-w-[20px] text-slate-400"><User size={16} /></div>
                <div>
                    <span className="text-xs text-slate-500 block">Líder / Figura Clave</span>
                    <span className="text-sm font-medium text-slate-700">{data.leader}</span>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="mt-1 min-w-[20px] text-slate-400"><MapPin size={16} /></div>
                <div>
                    <span className="text-xs text-slate-500 block">Ubicación</span>
                    <span className="text-sm font-medium text-slate-700">{data.location.country}, {data.location.city}</span>
                </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
                <BookOpen size={18} className="text-slate-400"/>
                <h4 className="font-bold text-sm md:text-base leading-tight">
                    {data.contextTitle}
                </h4>
            </div>
            <p className="text-xs md:text-sm font-normal text-slate-600 leading-relaxed text-justify">
                {data.contextBody}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};