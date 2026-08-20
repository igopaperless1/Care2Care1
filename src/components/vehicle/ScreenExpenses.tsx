import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  ChevronDown,
  Filter,
  Plus,
  Fuel,
  Sparkles,
  MapPin,
  CircleDollarSign,
  Car,
  Receipt
} from 'lucide-react';
import { VehicleExpense } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenExpensesProps {
  expenses: VehicleExpense[];
  onNavigate: (screen: VehicleScreenId, params?: any) => void;
  onBack: () => void;
}

export const ScreenExpenses: React.FC<ScreenExpensesProps> = ({
  expenses,
  onNavigate,
  onBack
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'this_month' | 'last_month' | 'all'>('this_month');

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalFuelCost = expenses
    .filter((e) => e.type === 'Fuel')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalDistance = 1245;

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5 text-emerald-500" />;
      case 'wash':
        return <Sparkles className="w-3.5 h-3.5 text-sky-500" />;
      case 'parking':
        return <MapPin className="w-3.5 h-3.5 text-amber-500" />;
      case 'toll':
        return <CircleDollarSign className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Receipt className="w-3.5 h-3.5 text-orange-500" />;
    }
  };

  const getCategoryBg = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fuel':
        return 'bg-emerald-50';
      case 'wash':
        return 'bg-sky-50';
      case 'parking':
        return 'bg-amber-50';
      case 'toll':
        return 'bg-indigo-50';
      default:
        return 'bg-orange-50';
    }
  };

  return (
    <div id="screen-8-expenses" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Expenses</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as any)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-extrabold text-xs py-1.5 pl-3 pr-7 rounded-xl border border-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="all">All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Metrics Card */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4 text-center">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold truncate">Total Expenses</p>
            <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
              NPR {totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="border-x border-slate-200 px-1">
            <p className="text-[10px] text-slate-400 font-semibold truncate">Total Fuel Cost</p>
            <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
              NPR {totalFuelCost.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold truncate">Total Distance</p>
            <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
              {totalDistance.toLocaleString()} km
            </p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-2.5">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-white hover:bg-slate-50/80 rounded-2xl p-3 border border-slate-100 hover:border-orange-100 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl ${getCategoryBg(exp.type)} flex items-center justify-center shrink-0`}>
                  {getCategoryIcon(exp.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">
                      {new Date(exp.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">•</span>
                    <span className="text-[11px] font-bold text-slate-700">
                      {exp.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {exp.odometer.toLocaleString()} km {exp.description ? `• ${exp.description}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900">
                  NPR {exp.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button: + Add Expense */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-add-expense-trigger"
          onClick={() => onNavigate('add_expense')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>
    </div>
  );
};
