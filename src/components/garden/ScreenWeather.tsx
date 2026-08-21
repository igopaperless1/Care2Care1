import React, { useState } from "react";
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Thermometer
} from "lucide-react";
import { WeatherDayForecast, FarmGardenItem } from "./types";
import { FORECAST_DATA } from "./mockData";

interface ScreenWeatherProps {
  activeFarm: FarmGardenItem;
}

export const ScreenWeather: React.FC<ScreenWeatherProps> = ({ activeFarm }) => {
  const [selectedCity, setSelectedCity] = useState<string>(activeFarm.location || "Pokhara, Nepal");

  const getWeatherIcon = (iconName: string) => {
    if (iconName === "CloudRain") return <CloudRain className="w-5 h-5 text-blue-500" />;
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="space-y-4">
      {/* WEATHER OVERVIEW CARD (Matching Screenshot Card 10) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        {/* LOCATION SELECTOR */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-orange-50/70 text-slate-900 text-sm font-black pl-3 pr-8 py-1.5 rounded-xl border border-orange-200 focus:outline-hidden cursor-pointer"
            >
              <option value="Pokhara, Nepal">Pokhara, Nepal</option>
              <option value="Kathmandu, Nepal">Kathmandu, Nepal</option>
              <option value="Bandipur, Nepal">Bandipur, Nepal</option>
              <option value="Lalitpur, Nepal">Lalitpur, Nepal</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs font-bold text-slate-400">Live Satellite Data</span>
        </div>

        {/* CURRENT TEMP & CONDITION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-xs">
              <CloudSun className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">26°C</span>
              </div>
              <span className="text-sm font-bold text-slate-600">Partly Cloudy</span>
            </div>
          </div>

          {/* 3 SECONDARY STATS (Humidity 68%, Wind 8 km/h, Rain Chance 20%) */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 w-full sm:w-auto justify-between">
            <div className="text-center px-1">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Humidity</span>
              <span className="text-sm font-black text-slate-900">68%</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center px-1">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Wind</span>
              <span className="text-sm font-black text-slate-900">8 km/h</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center px-1">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Rain Chance</span>
              <span className="text-sm font-black text-blue-600">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-DAY FORECAST LIST (Matching Screenshot Card 10) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
        <h3 className="text-base font-black text-slate-900">5 Day Forecast</h3>

        <div className="space-y-2.5">
          {FORECAST_DATA.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                  {getWeatherIcon(day.icon)}
                </div>
                <span className="text-xs font-black text-slate-900 w-24">
                  {day.dayName}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-slate-800">
                  {day.tempHigh}° / {day.tempLow}°
                </span>

                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 w-12 justify-end">
                  <Droplets className="w-3 h-3" />
                  <span>{day.rainChance}%</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AGRICULTURAL WEATHER ADVISORY */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Agri-Weather Field Advisory
          </h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Optimal foliar spray window between 06:00 AM - 08:30 AM before direct noon sunshine. Low rain probability through Sunday makes it ideal for weed cultivation and organic compost soil incorporation.
          </p>
        </div>
      </div>
    </div>
  );
};
