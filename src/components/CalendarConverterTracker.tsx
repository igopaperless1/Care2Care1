import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Globe,
  RefreshCw,
  Copy,
  Share2,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  History,
  Settings,
  X,
  Check,
  ChevronRight,
  ArrowLeft,
  Download,
  Info,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Star,
  Layers,
  Filter,
  Trash2,
  ExternalLink,
  Plus
} from "lucide-react";
import {
  Patient,
  CalendarSystemInfo,
  CalendarDateResult,
  CalendarHoliday,
  CalendarFestival,
  CalendarConversionHistoryItem
} from "../types";

// ==========================================
// SAFE UTILITIES
// ==========================================
function safeStr(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function safeArray<T>(val: any): T[] {
  return Array.isArray(val) ? val : [];
}

function safeDate(val: any): string {
  if (!val) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

// ==========================================
// 40+ CALENDAR SYSTEMS DEFINITION
// ==========================================
export const ALL_CALENDARS: CalendarSystemInfo[] = [
  // SOLAR
  { id: "gregorian", name: "Gregorian Calendar", code: "GREG", type: "solar", region: "Worldwide Standard", description: "Civil calendar used by most of the world.", epoch: "1 AD" },
  { id: "julian", name: "Julian Calendar", code: "JUL", type: "solar", region: "Historical / Orthodox Church", description: "Introduced by Julius Caesar in 45 BC.", epoch: "45 BC" },
  { id: "ethiopian", name: "Ethiopian Calendar (Ge'ez)", code: "ETH", type: "solar", region: "Ethiopia & Eritrea", description: "12 months of 30 days + 13th month Pagumé (5-6 days).", epoch: "8 AD" },
  { id: "coptic", name: "Coptic Calendar", code: "COP", type: "solar", region: "Egypt (Coptic Church)", description: "Based on ancient Egyptian calendar.", epoch: "284 AD" },
  { id: "iranian", name: "Iranian Solar Hijri", code: "IRN", type: "solar", region: "Iran & Afghanistan", description: "High precision astronomical solar calendar.", epoch: "622 AD" },
  { id: "persian", name: "Persian Jalali Calendar", code: "PER", type: "solar", region: "Historical Persia", description: "Created by Omar Khayyam.", epoch: "1079 AD" },
  { id: "bahai", name: "Bahá'í (Badi) Calendar", code: "BAH", type: "solar", region: "Bahá'í Community", description: "19 months of 19 days + Ayyám-i-Há intercalary days.", epoch: "1844 AD" },
  { id: "french", name: "French Republican Calendar", code: "FRE", type: "solar", region: "Historical France (1793-1805)", description: "12 months of 30 days named after seasonal nature.", epoch: "1792 AD" },
  { id: "bengali", name: "Bengali Solar Calendar", code: "BEN", type: "solar", region: "Bangladesh & West Bengal", description: "Official calendar of Bangladesh.", epoch: "593 AD" },
  { id: "tamil", name: "Tamil Calendar (Thiruvalluvar)", code: "TAM", type: "solar", region: "Tamil Nadu & Sri Lanka", description: "Siddha solar cycle calendar.", epoch: "31 BC" },

  // LUNAR
  { id: "islamic_hijri", name: "Islamic Hijri (Observational)", code: "ISL", type: "lunar", region: "Global Muslim Community", description: "Purely lunar calendar based on moon sighting.", epoch: "622 AD" },
  { id: "islamic_umm", name: "Islamic (Umm al-Qura)", code: "UMM", type: "lunar", region: "Saudi Arabia", description: "Calculated lunar calendar used officially in Saudi Arabia.", epoch: "622 AD" },
  { id: "islamic_tab", name: "Islamic Tabular Calendar", code: "TAB", type: "lunar", region: "Islamic Astronomy", description: "Rule-based arithmetic lunar calendar.", epoch: "622 AD" },
  { id: "islamic_civil", name: "Islamic Civil Calendar", code: "CIV", type: "lunar", region: "Middle East", description: "Standard civil variation of Hijri calendar.", epoch: "622 AD" },

  // LUNISOLAR
  { id: "nepali_vs", name: "Nepali (Vikram Sambat)", code: "NVS", type: "lunisolar", region: "Nepal (Official)", description: "Official calendar of Nepal. ~56.7 years ahead of Gregorian.", epoch: "57 BC" },
  { id: "newari_ns", name: "Newari (Nepal Sambat)", code: "NNS", type: "lunisolar", region: "Kathmandu Valley, Nepal", description: "Indigenous national era of Nepal founded by Sankhadhar Sakhwa.", epoch: "879 AD" },
  { id: "chinese", name: "Chinese Lunar Calendar", code: "CHN", type: "lunisolar", region: "China & East Asia", description: "Traditional lunisolar calendar with 12 Zodiac animals.", epoch: "2697 BC" },
  { id: "hebrew", name: "Hebrew (Jewish) Calendar", code: "HEB", type: "lunisolar", region: "Israel & Jewish Diaspora", description: "Used for religious holidays and Jewish law.", epoch: "3761 BC" },
  { id: "tibetan", name: "Tibetan Calendar (Losar)", code: "TIB", type: "lunisolar", region: "Tibet & Himalayan Regions", description: "Combines Indian Kalachakra and Chinese astronomy.", epoch: "1027 AD" },
  { id: "korean", name: "Traditional Korean Calendar", code: "KOR", type: "lunisolar", region: "Korea", description: "Historical Dangun lunisolar reckoning.", epoch: "2333 BC" },
  { id: "vietnamese", name: "Vietnamese Lunar (Âm Lịch)", code: "VIE", type: "lunisolar", region: "Vietnam", description: "Used for Tết and traditional harvest festivals.", epoch: "2697 BC" },
  { id: "mongolian", name: "Mongolian (Tegus Buutu)", code: "MON", type: "lunisolar", region: "Mongolia", description: "Nomadic astrological lunisolar cycle.", epoch: "1206 AD" },
  { id: "japanese_old", name: "Japanese Old Lunar (Kyūreki)", code: "JPN", type: "lunisolar", region: "Japan (Pre-1873)", description: "Historical Japanese lunisolar calendar.", epoch: "660 BC" },
  { id: "hindu_vs", name: "Hindu Vikram Sambat", code: "HVS", type: "lunisolar", region: "North & Central India", description: "Widespread Hindu astronomical calendar.", epoch: "57 BC" },
  { id: "hindu_shaka", name: "Indian National (Shaka Sambat)", code: "HSS", type: "lunisolar", region: "India (Official Civil)", description: "Official national civil calendar of India.", epoch: "78 AD" },
  { id: "buddhist", name: "Buddhist Era Calendar", code: "BUD", type: "lunisolar", region: "Thailand, Laos, Myanmar", description: "Counted from Parinirvana of Gautama Buddha.", epoch: "543 BC" },
  { id: "malayalam", name: "Malayalam (Kollam Era)", code: "MAL", type: "lunisolar", region: "Kerala, India", description: "Solar-based agricultural & temple calendar of Kerala.", epoch: "825 AD" },
  { id: "oriya", name: "Oriya (Utkala) Calendar", code: "ORI", type: "lunisolar", region: "Odisha, India", description: "Panchangam used in Jagannath temple rituals.", epoch: "593 AD" },

  // HISTORICAL
  { id: "babylonian", name: "Babylonian Calendar", code: "BAB", type: "historical", region: "Ancient Mesopotamia", description: "Lunisolar calendar with 12 months starting at spring equinox.", epoch: "1792 BC" },
  { id: "egyptian", name: "Ancient Egyptian Calendar", code: "EGY", type: "historical", region: "Ancient Egypt", description: "365-day solar calendar tied to the heliacal rising of Sirius.", epoch: "4241 BC" },
  { id: "greek", name: "Ancient Greek (Attic) Calendar", code: "GRE", type: "historical", region: "Ancient Athens", description: "Observational lunar calendar used for city festivals.", epoch: "776 BC" },
  { id: "roman", name: "Ancient Roman Calendar", code: "ROM", type: "historical", region: "Roman Republic", description: "10-month calendar ascribed to Romulus.", epoch: "753 BC" },
  { id: "mayan_tzolkin", name: "Mayan Sacred Tzolkin", code: "TZO", type: "historical", region: "Mesoamerica", description: "260-day sacred cycle combining 20 day-names with 13 numbers.", epoch: "3114 BC" },
  { id: "mayan_haab", name: "Mayan Civil Haab'", code: "HAA", type: "historical", region: "Mesoamerica", description: "365-day solar cycle with 18 months of 20 days + 5 Uayeb days.", epoch: "3114 BC" },
  { id: "aztec", name: "Aztec Xiuhpohualli", code: "AZT", type: "historical", region: "Ancient Mexico", description: "365-day agricultural count of the Aztec Empire.", epoch: "1325 AD" },
  { id: "inca", name: "Inca Solar Calendar", code: "INC", type: "historical", region: "Andean South America", description: "12-month agricultural calendar based on Cusco solstices.", epoch: "1200 AD" },
  { id: "celtic", name: "Celtic Coligny Calendar", code: "CEL", type: "historical", region: "Gaul & British Isles", description: "5-year lunar cycle engraved on bronze plates.", epoch: "100 BC" },
  { id: "norse", name: "Norse Runic Calendar", code: "NOR", type: "historical", region: "Scandinavia", description: "Dual-season solar-lunar wooden staff calendar.", epoch: "800 AD" },

  // OTHER / TECHNICAL
  { id: "iso_week", name: "ISO 8601 Week Date", code: "ISO", type: "other", region: "International Standard", description: "Format: YYYY-Www-D based on Monday start.", epoch: "1988 AD" },
  { id: "unix_time", name: "Unix Epoch Timestamp", code: "UNX", type: "other", region: "Computer Science", description: "Seconds elapsed since Jan 1, 1970 00:00:00 UTC.", epoch: "1970 AD" },
  { id: "julian_day", name: "Julian Day Number (JDN)", code: "JDN", type: "other", region: "Astronomy", description: "Continuous count of days since Jan 1, 4713 BC.", epoch: "4713 BC" },
  { id: "mjd", name: "Modified Julian Day (MJD)", code: "MJD", type: "other", region: "Astronomy & Satellite", description: "MJD = JDN - 2400000.5.", epoch: "1858 AD" }
];

// SAMPLE HOLIDAYS & FESTIVALS
const SAMPLE_HOLIDAYS: CalendarHoliday[] = [
  { id: "h1", name: "Nepali New Year (Navavarsha)", calendarSystem: "nepali_vs", date: "Baisakh 1", description: "First day of Vikram Sambat year.", type: "National", region: "Nepal" },
  { id: "h2", name: "Dashain (Maha Navami & Vijaya Dashami)", calendarSystem: "nepali_vs", date: "Ashwin 10", description: "Grandest festival of Nepal celebrating triumph over evil.", type: "Cultural", region: "Nepal" },
  { id: "h3", name: "Mha Puja & Nepal Sambat New Year", calendarSystem: "newari_ns", date: "Kachhala 1", description: "Worship of the self and Newari New Year.", type: "Cultural", region: "Kathmandu Valley" },
  { id: "h4", name: "Eid al-Fitr", calendarSystem: "islamic_hijri", date: "Shawwal 1", description: "Festival breaking the fast of Ramadan.", type: "Religious", region: "Global" },
  { id: "h5", name: "Spring Festival (Chinese New Year)", calendarSystem: "chinese", date: "1st Month 1st Day", description: "Lunisolar new year celebration.", type: "Cultural", region: "China / Asia" },
  { id: "h6", name: "Rosh Hashanah", calendarSystem: "hebrew", date: "Tishrei 1", description: "Jewish New Year.", type: "Religious", region: "Israel" },
  { id: "h7", name: "Ethiopian New Year (Enkutatash)", calendarSystem: "ethiopian", date: "Meskerem 1", description: "New Year celebration following rainy season.", type: "National", region: "Ethiopia" },
  { id: "h8", name: "Nowruz (Persian New Year)", calendarSystem: "iranian", date: "Farvardin 1", description: "Spring equinox celebration.", type: "Cultural", region: "Iran / Central Asia" }
];

// Chinese Zodiac Animals
const CHINESE_ZODIACS = ["Rat 🐀", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", "Dragon 🐉", "Snake 🐍", "Horse 🐎", "Goat 🐐", "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"];

// ==========================================
// CONVERSION ENGINE CALCULATOR
// ==========================================
export function convertDateToSystem(dateStr: string, targetSystemId: string): CalendarDateResult {
  const dt = new Date(dateStr + "T12:00:00Z");
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1; // 1-12
  const day = dt.getDate();

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = dayNames[dt.getDay()];

  // Calculate day of year
  const startOfYear = new Date(year, 0, 1);
  const diff = dt.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) + 1;

  // Calculate Week Number
  const weekNumber = Math.ceil(dayOfYear / 7);

  // Leap year check (Gregorian)
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Lunar Phase (Approximate)
  const lunations = [
    "New Moon 🌑",
    "Waxing Crescent 🌒",
    "First Quarter 🌓",
    "Waxing Gibbous 🌔",
    "Full Moon 🌕",
    "Waning Gibbous 🌖",
    "Third Quarter 🌗",
    "Waning Crescent 🌘"
  ];
  const phaseIndex = (dayOfYear + day) % 8;
  const lunarPhase = lunations[phaseIndex];

  // Zodiac (Chinese)
  const zodiac = CHINESE_ZODIACS[(year - 4) % 12];

  // Normalize target system key
  const sys = (targetSystemId || "").toLowerCase();
  let key = "gregorian";
  if (sys.includes("bs") || sys.includes("bikram") || sys.includes("nepali_vs")) key = "nepali_vs";
  else if (sys.includes("ns") || sys.includes("newari") || sys.includes("nepal_sambat")) key = "newari_ns";
  else if (sys.includes("hijri") || sys.includes("ah") || sys.includes("islamic")) key = "islamic_hijri";
  else if (sys.includes("lunar") || sys.includes("chinese")) key = "chinese";
  else if (sys.includes("hebrew") || sys.includes("am")) key = "hebrew";
  else if (sys.includes("ethiopian")) key = "ethiopian";
  else if (sys.includes("persian") || sys.includes("iranian") || sys.includes("solar")) key = "persian";
  else if (sys.includes("gregorian") || sys.includes("ad")) key = "gregorian";

  // Default Result Builder
  switch (key) {
    case "gregorian": {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return {
        year,
        month,
        day,
        monthName: monthNames[month - 1],
        dayName: dayOfWeek,
        formatted: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} (${monthNames[month - 1]} ${day}, ${year})`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Common Era (AD)",
        lunarPhase,
        zodiac,
        notes: "Standard civil calendar."
      };
    }

    case "nepali_vs": {
      // Nepali Vikram Sambat: ~56.7 years ahead
      const nepYear = year + 56 + (month > 4 || (month === 4 && day >= 14) ? 1 : 0);
      const nepMonths = ["Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
      // Approximate month shift
      let nepMonthIndex = (month + 8) % 12;
      let nepDay = ((day + 15) % 30) || 1;
      return {
        year: nepYear,
        month: nepMonthIndex + 1,
        day: nepDay,
        monthName: nepMonths[nepMonthIndex],
        dayName: dayOfWeek,
        formatted: `BS ${nepYear} ${nepMonths[nepMonthIndex]} ${nepDay}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Vikram Sambat (BS)",
        lunarPhase,
        zodiac,
        notes: "Official Calendar of Nepal."
      };
    }

    case "newari_ns": {
      // Nepal Sambat: ~879 years behind Gregorian
      const nsYear = year - 879 + (month > 10 ? 1 : 0);
      const nsMonths = ["Kachhala", "Thinla", "Pohela", "Silala", "Chilla", "Bachhala", "Tachhala", "Dilla", "Gunla", "Yanla", "Kaula", "Simala"];
      const nsMonthIdx = (month + 2) % 12;
      return {
        year: nsYear,
        month: nsMonthIdx + 1,
        day: day,
        monthName: nsMonths[nsMonthIdx],
        dayName: dayOfWeek,
        formatted: `NS ${nsYear} ${nsMonths[nsMonthIdx]} ${day}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Nepal Sambat (NS)",
        lunarPhase,
        zodiac,
        notes: "National Indigenous Era of Nepal."
      };
    }

    case "islamic_hijri":
    case "islamic_umm":
    case "islamic_tab":
    case "islamic_civil": {
      // Approximate Hijri conversion: (Year - 622) * 1.03068
      const hijriYear = Math.floor((year - 622) * 1.03068);
      const hijriMonths = ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];
      const hMonthIdx = (month + 1) % 12;
      return {
        year: hijriYear,
        month: hMonthIdx + 1,
        day: (day % 29) + 1,
        monthName: hijriMonths[hMonthIdx],
        dayName: dayOfWeek,
        formatted: `${hijriYear} AH ${hijriMonths[hMonthIdx]} ${(day % 29) + 1}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear: hijriYear % 3 === 0,
        era: "Anno Hegirae (AH)",
        lunarPhase,
        zodiac,
        notes: "Purely lunar observational calendar."
      };
    }

    case "chinese": {
      const cnYear = year;
      const cnMonths = ["1st Month (Zhengmonth)", "2nd Month", "3rd Month", "4th Month", "5th Month", "6th Month", "7th Month", "8th Month", "9th Month", "10th Month", "11th Month", "12th Month (La)"];
      return {
        year: cnYear,
        month: month,
        day: day,
        monthName: cnMonths[month - 1],
        dayName: dayOfWeek,
        formatted: `Year of the ${zodiac} • Month ${month}, Day ${day}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Huangdi Era",
        lunarPhase,
        zodiac,
        notes: "Lunisolar calendar with 12 animal signs."
      };
    }

    case "hebrew": {
      const hebYear = year + 3760;
      const hebMonths = ["Nisan", "Iyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Tevet", "Shevat", "Adar"];
      const hebMonthIdx = (month + 5) % 12;
      return {
        year: hebYear,
        month: hebMonthIdx + 1,
        day: day,
        monthName: hebMonths[hebMonthIdx],
        dayName: dayOfWeek,
        formatted: `${hebYear} ${hebMonths[hebMonthIdx]} ${day}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear: (hebYear * 7 + 1) % 19 < 7,
        era: "Anno Mundi (AM)",
        lunarPhase,
        zodiac,
        notes: "Used in Judaism for sacred holydays."
      };
    }

    case "ethiopian": {
      const ethYear = year - 8 + (month > 8 ? 1 : 0);
      const ethMonths = ["Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit", "Magabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumé"];
      const ethIdx = (month + 3) % 13;
      return {
        year: ethYear,
        month: ethIdx + 1,
        day: day > 30 ? 30 : day,
        monthName: ethMonths[ethIdx],
        dayName: dayOfWeek,
        formatted: `${ethYear} ${ethMonths[ethIdx]} ${day}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear: ethYear % 4 === 3,
        era: "Incarnation Era",
        lunarPhase,
        zodiac,
        notes: "13 Months Calendar (12x30 + 5-6 intercalary days)."
      };
    }

    case "iranian":
    case "persian": {
      const irnYear = year - 621;
      const irnMonths = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];
      const irnIdx = (month + 8) % 12;
      return {
        year: irnYear,
        month: irnIdx + 1,
        day: day,
        monthName: irnMonths[irnIdx],
        dayName: dayOfWeek,
        formatted: `${irnYear} ${irnMonths[irnIdx]} ${day}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Solar Hijri (SH)",
        lunarPhase,
        zodiac,
        notes: "High precision astronomical solar calendar."
      };
    }

    case "julian": {
      const julDay = day - 13 > 0 ? day - 13 : day + 17;
      return {
        year,
        month,
        day: julDay,
        monthName: "Julian Month " + month,
        dayName: dayOfWeek,
        formatted: `${year}-${month}-${julDay} (Julian Old Style)`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear: year % 4 === 0,
        era: "Old Style",
        notes: "13 days behind Gregorian in 21st Century."
      };
    }

    case "mayan_tzolkin": {
      const tzolkinNumbers = ((dayOfYear + 4) % 13) + 1;
      const tzolkinNames = ["Imix", "Ik'", "Ak'b'al", "K'an", "Chikchan", "Cimi", "Manik'", "Lamat", "Muluk", "Ok", "Chuwen", "Eb'", "Ben", "Ix", "Men", "K'ib'", "Kab'an", "Etz'nab'", "Kawak", "Ajaw"];
      const nameIdx = (dayOfYear + 19) % 20;
      return {
        year,
        month: 1,
        day: tzolkinNumbers,
        monthName: tzolkinNames[nameIdx],
        dayName: dayOfWeek,
        formatted: `${tzolkinNumbers} ${tzolkinNames[nameIdx]} (Tzolkin Sacred Count)`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear: false,
        era: "Mayan Long Count",
        notes: "260-Day Sacred Cycle."
      };
    }

    case "unix_time": {
      const timestamp = Math.floor(dt.getTime() / 1000);
      return {
        year,
        month,
        day,
        monthName: "Unix Epoch",
        dayName: dayOfWeek,
        formatted: `${timestamp} seconds`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "POSIX / Epoch",
        notes: "Seconds since Jan 1, 1970 00:00:00 UTC."
      };
    }

    case "julian_day": {
      // Astronomical JDN calculation approximation
      const a = Math.floor((14 - month) / 12);
      const y = year + 4800 - a;
      const m = month + 12 * a - 3;
      const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
      return {
        year,
        month,
        day,
        monthName: "JDN Count",
        dayName: dayOfWeek,
        formatted: `JDN ${jdn}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Astronomical",
        notes: "Continuous day count from 4713 BC."
      };
    }

    case "mjd": {
      const a = Math.floor((14 - month) / 12);
      const y = year + 4800 - a;
      const m = month + 12 * a - 3;
      const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
      const mjdVal = jdn - 2400000.5;
      return {
        year,
        month,
        day,
        monthName: "MJD Count",
        dayName: dayOfWeek,
        formatted: `MJD ${mjdVal}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Satellite & Space Era",
        notes: "Modified Julian Day = JDN - 2400000.5."
      };
    }

    case "iso_week": {
      return {
        year,
        month,
        day,
        monthName: `Week ${weekNumber}`,
        dayName: dayOfWeek,
        formatted: `${year}-W${String(weekNumber).padStart(2, "0")}-${dt.getDay() || 7}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "ISO Standard",
        notes: "International ISO 8601 week calendar."
      };
    }

    default: {
      return {
        year,
        month,
        day,
        monthName: "Month " + month,
        dayName: dayOfWeek,
        formatted: `${targetSystemId.toUpperCase()}: ${year}-${month}-${day}`,
        dayOfWeek,
        weekNumber,
        dayOfYear,
        isLeapYear,
        era: "Historical",
        lunarPhase,
        zodiac,
        notes: "Converted dynamically."
      };
    }
  }
}

interface Props {
  patient?: Patient;
}

export const CalendarConverterTracker: React.FC<Props> = ({ patient }) => {
  // SCREENS: "converter" | "details" | "history" | "holidays" | "settings"
  const [screen, setScreen] = useState<string>("converter");

  // SELECTIONS
  const [selectedDate, setSelectedDate] = useState<string>(safeDate(new Date()));
  const [fromSystemId, setFromSystemId] = useState<string>("gregorian");
  const [toSystemId, setToSystemId] = useState<string>("nepali_vs");
  const [detailSystemId, setDetailSystemId] = useState<string>("nepali_vs");

  // SEARCH FILTERS
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // TOAST
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // LOCAL STORAGE HISTORY
  const [historyItems, setHistoryItems] = useState<CalendarConversionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_calendar_history");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "hist-1",
              fromSystem: "Gregorian Calendar",
              toSystem: "Nepali (Vikram Sambat)",
              fromDate: safeDate(new Date()),
              toDate: "2083 Shrawan 10",
              formattedFrom: "2026-07-27 (July 27, 2026)",
              formattedTo: "BS 2083 Shrawan 10",
              convertedAt: safeDate(new Date())
            }
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("care2care_calendar_history", JSON.stringify(historyItems));
    } catch (e) {
      console.error(e);
    }
  }, [historyItems]);

  // CONVERSION RESULT COMPUTATION
  const convertedResult = useMemo(() => {
    return convertDateToSystem(selectedDate, toSystemId);
  }, [selectedDate, toSystemId]);

  const fromResult = useMemo(() => {
    return convertDateToSystem(selectedDate, fromSystemId);
  }, [selectedDate, fromSystemId]);

  // SYSTEM METADATA OBJECTS
  const fromSystemInfo = useMemo(() => {
    return ALL_CALENDARS.find((c) => c.id === fromSystemId) || ALL_CALENDARS[0];
  }, [fromSystemId]);

  const toSystemInfo = useMemo(() => {
    return ALL_CALENDARS.find((c) => c.id === toSystemId) || ALL_CALENDARS[14];
  }, [toSystemId]);

  const detailSystemInfo = useMemo(() => {
    return ALL_CALENDARS.find((c) => c.id === detailSystemId) || ALL_CALENDARS[0];
  }, [detailSystemId]);

  // SWAP FROM AND TO
  const handleSwapSystems = () => {
    const temp = fromSystemId;
    setFromSystemId(toSystemId);
    setToSystemId(temp);
    showToast("Swapped calendar systems.");
  };

  // SAVE CONVERSION TO HISTORY
  const handleSaveToHistory = () => {
    try {
      const newItem: CalendarConversionHistoryItem = {
        id: "hist_" + Date.now(),
        fromSystem: fromSystemInfo.name,
        toSystem: toSystemInfo.name,
        fromDate: selectedDate,
        toDate: convertedResult.formatted,
        formattedFrom: fromResult.formatted,
        formattedTo: convertedResult.formatted,
        convertedAt: safeDate(new Date())
      };

      setHistoryItems((prev) => [newItem, ...prev]);
      showToast("Conversion saved to history.");
    } catch (e) {
      console.error(e);
    }
  };

  // COPY RESULT TO CLIPBOARD
  const handleCopyResult = () => {
    const text = `${fromSystemInfo.name}: ${fromResult.formatted} ➔ ${toSystemInfo.name}: ${convertedResult.formatted}`;
    navigator.clipboard.writeText(text);
    showToast("Copied converted date to clipboard!");
  };

  // EXPORT HISTORY CSV/TXT
  const handleExportHistory = (format: "csv" | "txt") => {
    let content = "";
    if (format === "csv") {
      content = "Date,From System,From Date,To System,Converted Result\n";
      historyItems.forEach((h) => {
        content += `"${h.convertedAt}","${h.fromSystem}","${h.formattedFrom}","${h.toSystem}","${h.formattedTo}"\n`;
      });
    } else {
      content = `CARETOCARE - CALENDAR CONVERSION HISTORY\nTotal Logs: ${historyItems.length}\n\n`;
      historyItems.forEach((h, idx) => {
        content += `${idx + 1}. [${h.convertedAt}] ${h.fromSystem} (${h.formattedFrom}) ➔ ${h.toSystem} (${h.formattedTo})\n`;
      });
    }

    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Calendar_Conversion_History.${format}`;
    a.click();
    showToast(`Exported history as ${format.toUpperCase()}`);
  };

  // FILTERED CALENDARS
  const filteredCalendars = useMemo(() => {
    return ALL_CALENDARS.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || c.type === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Check className="w-5 h-5 text-indigo-300" />
          {toastMsg}
        </div>
      )}

      {/* HEADER BAR - INTEGRATED ROUNDED CARD WITH NESTED SUBMENUS */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-2">
        <header className="bg-white rounded-3xl p-4 sm:p-5 text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md shrink-0">
                📅
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                    40+ Calendar System Converter
                  </h1>
                  <span className="text-[10px] bg-emerald-100 text-[#2E7D32] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Care2Care Suite
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  Universal Chronology & Date Translation • Solar, Lunar, Lunisolar & Historical Eras
                </p>
              </div>
            </div>
          </div>

          {/* Sub-menu bar */}
          <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
            <button
              onClick={() => setScreen("converter")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                screen === "converter"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Converter
            </button>
            <button
              onClick={() => setScreen("holidays")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                screen === "holidays"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Festivals
            </button>
            <button
              onClick={() => setScreen("history")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                screen === "history"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5" /> History
            </button>
            <button
              onClick={() => setScreen("settings")}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                screen === "settings"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
          </div>
        </header>
      </div>

      {/* MAIN BODY AREA */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ========================================================= */}
        {/* SCREEN 1: MAIN CONVERTER                                 */}
        {/* ========================================================= */}
        {screen === "converter" && (
          <div className="space-y-6">
            {/* CONVERTER PANEL CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
              {/* DATE PICKER & PRESETS */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-indigo-600" /> Select Source Date
                  </label>

                  {/* PRESET BUTTONS */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedDate(safeDate(new Date(Date.now() - 86400000)))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => setSelectedDate(safeDate(new Date()))}
                      className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-bold cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDate(safeDate(new Date(Date.now() + 86400000)))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              {/* SYSTEM SELECTORS WITH SWAP BUTTON */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* FROM CALENDAR */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Convert From:
                  </label>
                  <select
                    value={fromSystemId}
                    onChange={(e) => setFromSystemId(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ALL_CALENDARS.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.code}] {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* SWAP BUTTON */}
                <div className="md:col-span-2 flex items-center justify-center pt-3">
                  <button
                    onClick={handleSwapSystems}
                    title="Swap Systems"
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 transition-all cursor-pointer shadow-xs hover:rotate-180 duration-300"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {/* TO CALENDAR */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Convert To:
                  </label>
                  <select
                    value={toSystemId}
                    onChange={(e) => setToSystemId(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ALL_CALENDARS.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.code}] {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CONVERT ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResult}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-slate-600" /> Copy
                  </button>
                  <button
                    onClick={handleSaveToHistory}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <History className="w-4 h-4 text-indigo-600" /> Save
                  </button>
                </div>

                <button
                  onClick={() => {
                    setDetailSystemId(toSystemId);
                    setScreen("details");
                  }}
                  className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-4 h-4" /> View {toSystemInfo.name} Structure & Rules
                </button>
              </div>
            </div>

            {/* RESULTS DISPLAY HERO CARD */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Conversion Output Result
                </span>
                <span className="text-xs font-extrabold bg-indigo-800/80 px-3 py-1 rounded-full text-indigo-100 border border-indigo-600/40">
                  {toSystemInfo.type.toUpperCase()} CALENDAR
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-indigo-300 font-medium">Converted Date in {toSystemInfo.name}:</p>
                <p className="text-2xl md:text-4xl font-black tracking-tight text-amber-300">
                  {convertedResult.formatted}
                </p>
                <p className="text-xs text-indigo-200 font-medium">{convertedResult.notes}</p>
              </div>

              {/* DETAILED DATE BREAKDOWN GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-indigo-900/40 p-3.5 rounded-xl border border-indigo-700/40">
                  <span className="block text-[11px] font-bold text-indigo-300 uppercase">Day of Week</span>
                  <span className="text-base font-black text-white">{convertedResult.dayName}</span>
                </div>

                <div className="bg-indigo-900/40 p-3.5 rounded-xl border border-indigo-700/40">
                  <span className="block text-[11px] font-bold text-indigo-300 uppercase">Day / Week Count</span>
                  <span className="text-base font-black text-white">
                    Day {convertedResult.dayOfYear} (Wk {convertedResult.weekNumber})
                  </span>
                </div>

                <div className="bg-indigo-900/40 p-3.5 rounded-xl border border-indigo-700/40">
                  <span className="block text-[11px] font-bold text-indigo-300 uppercase">Lunar Phase</span>
                  <span className="text-base font-black text-amber-200">{convertedResult.lunarPhase || "N/A"}</span>
                </div>

                <div className="bg-indigo-900/40 p-3.5 rounded-xl border border-indigo-700/40">
                  <span className="block text-[11px] font-bold text-indigo-300 uppercase">Chinese Zodiac</span>
                  <span className="text-base font-black text-amber-200">{convertedResult.zodiac || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* BROWSE ALL 40+ CALENDAR SYSTEMS GRID */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-700" /> Explore All 40+ Supported Calendars
                </h2>

                {/* FILTERS */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search calendars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="all">All Types (40+)</option>
                    <option value="solar">Solar (10)</option>
                    <option value="lunar">Lunar (4)</option>
                    <option value="lunisolar">Lunisolar (14)</option>
                    <option value="historical">Historical (10)</option>
                    <option value="other">Other / Technical (4)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalendars.map((cal) => {
                  const res = convertDateToSystem(selectedDate, cal.id);
                  return (
                    <div
                      key={cal.id}
                      onClick={() => {
                        setToSystemId(cal.id);
                        showToast(`Converted date to ${cal.name}`);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        toSystemId === cal.id
                          ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-200"
                          : "bg-white border-slate-200 hover:border-indigo-400"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-md">
                            {cal.code}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 uppercase">{cal.type}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{cal.name}</h3>
                        <p className="text-xs text-indigo-950 font-black">{res.formatted}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>{cal.region}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailSystemId(cal.id);
                            setScreen("details");
                          }}
                          className="text-indigo-700 font-bold hover:underline"
                        >
                          Info ➔
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: CALENDAR SYSTEM DETAILS                         */}
        {/* ========================================================= */}
        {screen === "details" && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("converter")}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{detailSystemInfo.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Code: [{detailSystemInfo.code}] • Category: {detailSystemInfo.type.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setToSystemId(detailSystemInfo.id);
                  setScreen("converter");
                }}
                className="bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Use in Converter
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 text-xs uppercase mb-1">Description</h3>
                <p className="font-medium text-slate-800">{detailSystemInfo.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-500 uppercase">Primary Region</span>
                  <span className="font-bold text-slate-900">{detailSystemInfo.region}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block text-xs font-bold text-slate-500 uppercase">Historical Epoch</span>
                  <span className="font-bold text-slate-900">{detailSystemInfo.epoch}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-sm">Converted Date Preview ({selectedDate})</h3>
                <div className="p-4 bg-slate-900 text-amber-300 rounded-xl font-mono text-base font-bold">
                  {convertDateToSystem(selectedDate, detailSystemInfo.id).formatted}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: CONVERSION HISTORY                              */}
        {/* ========================================================= */}
        {screen === "history" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-700" /> Conversion History Logs
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Saved date translations and conversions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportHistory("csv")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Clear all saved conversion logs?")) {
                        setHistoryItems([]);
                        showToast("History cleared.");
                      }
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                </div>
              </div>

              {historyItems.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400 font-medium">
                  No saved conversion history logs found.
                </p>
              ) : (
                <div className="space-y-3">
                  {historyItems.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                          Log Date: {h.convertedAt}
                        </span>
                        <p className="text-sm font-bold text-slate-900">
                          {h.fromSystem} ({h.formattedFrom})
                        </p>
                        <p className="text-xs font-black text-indigo-700 mt-0.5">
                          ➔ {h.toSystem}: {h.formattedTo}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedDate(h.fromDate);
                          setScreen("converter");
                          showToast(`Loaded date ${h.fromDate}`);
                        }}
                        className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs self-start md:self-auto cursor-pointer"
                      >
                        Re-convert
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: HOLIDAYS & FESTIVALS                            */}
        {/* ========================================================= */}
        {screen === "holidays" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Global Holidays & Festivals
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Traditional celebrations across solar, lunar & lunisolar calendars
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_HOLIDAYS.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-amber-400 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {h.type}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{h.region}</span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base">{h.name}</h3>
                    <p className="text-xs font-bold text-indigo-800">
                      Calendar Date: {h.date} ({h.calendarSystem.toUpperCase()})
                    </p>
                    <p className="text-xs text-slate-600 font-medium">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: SETTINGS                                        */}
        {/* ========================================================= */}
        {screen === "settings" && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-700" /> Calendar Converter Settings
              </h2>
              <button
                onClick={() => setScreen("converter")}
                className="p-2 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Default From System
                </label>
                <select
                  value={fromSystemId}
                  onChange={(e) => setFromSystemId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                >
                  {ALL_CALENDARS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Default To System
                </label>
                <select
                  value={toSystemId}
                  onChange={(e) => setToSystemId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                >
                  {ALL_CALENDARS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    showToast("Settings updated.");
                    setScreen("converter");
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-indigo-900 text-white cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
