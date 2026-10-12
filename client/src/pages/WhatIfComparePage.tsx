import React, { useState, useEffect } from 'react';
import { compareApi } from '../services/api';
import { ArrowRightLeft, Sparkles, Plus, CheckCircle2, ShoppingCart, HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface WhatIfProps {
  onNavigate: (page: string) => void;
}

export const WhatIfComparePage: React.FC<WhatIfProps> = ({ onNavigate }) => {
  const [curatedSwaps, setCuratedSwaps] = useState<any[]>([]);
  const [availableFoods, setAvailableFoods] = useState<any[]>([]);
  const [selectedSwapId, setSelectedSwapId] = useState<string>('swap_rice_quinoa');

  const [foodAId, setFoodAId] = useState('rice_white_cooked');
  const [gramsA, setGramsA] = useState(150);
  const [foodBId, setFoodBId] = useState('quinoa_cooked');
  const [gramsB, setGramsB] = useState(150);

  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const fetchCurated = async () => {
    try {
      const res = await compareApi.getCurated();
      if (res.success) {
        setCuratedSwaps(res.swaps || []);
        setAvailableFoods(res.availableFoods || []);
      }
    } catch (err) {
      console.warn("Could not load curated swaps:", err);
    }
  };

  const calculateComparison = async (fA: string, gA: number, fB: string, gB: number) => {
    setLoading(true);
    setAddedMessage(null);
    try {
      const res = await compareApi.calculate({
        originalFoodId: fA,
        originalGrams: gA,
        alternativeFoodId: fB,
        alternativeGrams: gB
      });
      if (res.success) {
        setComparisonResult(res);
      }
    } catch (err: any) {
      console.error("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurated();
    calculateComparison(foodAId, gramsA, foodBId, gramsB);
  }, []);

  const handleSelectCurated = (swap: any) => {
    setSelectedSwapId(swap.id);
    setFoodAId(swap.originalFoodId);
    setGramsA(swap.originalServingGrams);
    setFoodBId(swap.alternativeFoodId);
    setGramsB(swap.alternativeServingGrams);
    calculateComparison(swap.originalFoodId, swap.originalServingGrams, swap.alternativeFoodId, swap.alternativeServingGrams);
  };

  const handleCustomRecalculate = () => {
    calculateComparison(foodAId, gramsA, foodBId, gramsB);
  };

  const handleAddToShoppingList = async () => {
    if (!comparisonResult) return;
    try {
      const res = await compareApi.addToShopping(comparisonResult.alternative.id, 1);
      if (res.success) {
        setAddedMessage(`"${comparisonResult.alternative.name}" added to your shopping list!`);
      }
    } catch (err: any) {
      alert("Failed to add to shopping list.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-xs font-semibold">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>BiteSize Killer Feature</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          “What If I Changed This?”
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Instead of labeling food as simply "good" or "bad", explore practical trade-offs. Test substitutions, portion changes, or alternative ingredients to see estimated differences in nutrition, macros, and cost per serving.
        </p>
      </div>

      {/* Curated Swaps Quick Selector Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-slate-400">
          Popular Daily Swaps:
        </span>
        <div className="flex flex-wrap gap-2">
          {curatedSwaps.map(swap => (
            <button
              key={swap.id}
              onClick={() => handleSelectCurated(swap)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSwapId === swap.id
                  ? 'bg-[#C75A3B] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-[#5B6B7A] dark:text-slate-300 border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B]'
              }`}
            >
              {swap.title}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors for Custom Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
        
        {/* Original Choice */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5B6B7A] uppercase tracking-wider">Original Choice (A)</span>
            <span className="text-[10px] text-[#5B6B7A]">Baseline</span>
          </div>
          <div>
            <label className="block text-[11px] text-[#5B6B7A] mb-1">Select Food Item</label>
            <select
              value={foodAId}
              onChange={e => {
                setFoodAId(e.target.value);
                setSelectedSwapId('custom');
              }}
              className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white"
            >
              {availableFoods.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-[#5B6B7A] mb-1">
              <span>Portion Weight</span>
              <span className="font-bold">{gramsA}g</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="10"
              value={gramsA}
              onChange={e => {
                setGramsA(Number(e.target.value));
                setSelectedSwapId('custom');
              }}
              className="w-full accent-[#C75A3B]"
            />
          </div>
        </div>

        {/* Alternative Choice */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#C75A3B] uppercase tracking-wider">Alternative Swap (B)</span>
            <span className="text-[10px] text-[#C75A3B] font-bold">New Decision</span>
          </div>
          <div>
            <label className="block text-[11px] text-[#5B6B7A] mb-1">Select Substitute Item</label>
            <select
              value={foodBId}
              onChange={e => {
                setFoodBId(e.target.value);
                setSelectedSwapId('custom');
              }}
              className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white"
            >
              {availableFoods.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-[#5B6B7A] mb-1">
              <span>Portion Weight</span>
              <span className="font-bold">{gramsB}g</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="10"
              value={gramsB}
              onChange={e => {
                setGramsB(Number(e.target.value));
                setSelectedSwapId('custom');
              }}
              className="w-full accent-[#C75A3B]"
            />
          </div>
        </div>

        <div className="md:col-span-2 text-center">
          <button
            onClick={handleCustomRecalculate}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2E2E2E] text-white hover:bg-black transition-colors"
          >
            {loading ? 'Calculating Trade-offs...' : 'Calculate Trade-off Comparison'}
          </button>
        </div>
      </div>

      {/* Comparison Results Card */}
      {comparisonResult && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-xl space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E6E1] dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2E7D6B]/15 text-[#2E7D6B]">
                Goal Alignment Insights
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">
                {comparisonResult.original.name} vs. {comparisonResult.alternative.name}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddToShoppingList}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 transition-transform hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Alternative to Shopping List</span>
              </button>
            </div>
          </div>

          {addedMessage && (
            <div className="p-3.5 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{addedMessage}</span>
            </div>
          )}

          {/* Side-by-Side Comparison Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Calories */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 text-center space-y-1">
              <span className="text-[11px] text-[#5B6B7A] dark:text-slate-400">Calories</span>
              <div className="text-sm font-semibold text-[#2E2E2E] dark:text-white">
                {comparisonResult.original.nutrition.calories} → {comparisonResult.alternative.nutrition.calories}
              </div>
              <span className={`inline-block text-xs font-bold ${comparisonResult.differences.calories <= 0 ? 'text-[#2E7D6B]' : 'text-amber-600'}`}>
                {comparisonResult.differences.calories > 0 ? `+${comparisonResult.differences.calories}` : comparisonResult.differences.calories} kcal
              </span>
            </div>

            {/* Protein */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 text-center space-y-1">
              <span className="text-[11px] text-[#5B6B7A] dark:text-slate-400">Protein</span>
              <div className="text-sm font-semibold text-[#2E2E2E] dark:text-white">
                {comparisonResult.original.nutrition.protein}g → {comparisonResult.alternative.nutrition.protein}g
              </div>
              <span className={`inline-block text-xs font-bold ${comparisonResult.differences.protein >= 0 ? 'text-[#C75A3B]' : 'text-[#5B6B7A]'}`}>
                {comparisonResult.differences.protein > 0 ? `+${comparisonResult.differences.protein}` : comparisonResult.differences.protein}g
              </span>
            </div>

            {/* Fiber */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 text-center space-y-1">
              <span className="text-[11px] text-[#5B6B7A] dark:text-slate-400">Fiber</span>
              <div className="text-sm font-semibold text-[#2E2E2E] dark:text-white">
                {comparisonResult.original.nutrition.fiber}g → {comparisonResult.alternative.nutrition.fiber}g
              </div>
              <span className={`inline-block text-xs font-bold ${comparisonResult.differences.fiber >= 0 ? 'text-[#2E7D6B]' : 'text-[#5B6B7A]'}`}>
                {comparisonResult.differences.fiber > 0 ? `+${comparisonResult.differences.fiber}` : comparisonResult.differences.fiber}g
              </span>
            </div>

            {/* Carbs */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 text-center space-y-1">
              <span className="text-[11px] text-[#5B6B7A] dark:text-slate-400">Carbs</span>
              <div className="text-sm font-semibold text-[#2E2E2E] dark:text-white">
                {comparisonResult.original.nutrition.carbs}g → {comparisonResult.alternative.nutrition.carbs}g
              </div>
              <span className="inline-block text-xs font-bold text-[#5B6B7A]">
                {comparisonResult.differences.carbs > 0 ? `+${comparisonResult.differences.carbs}` : comparisonResult.differences.carbs}g
              </span>
            </div>

            {/* Cost Per Serving */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 text-center space-y-1 col-span-2 md:col-span-1">
              <span className="text-[11px] text-[#5B6B7A] dark:text-slate-400">Cost / Serving</span>
              <div className="text-sm font-semibold text-[#2E2E2E] dark:text-white">
                ₹{comparisonResult.original.costPerServing} → ₹{comparisonResult.alternative.costPerServing}
              </div>
              <span className={`inline-block text-xs font-bold ${comparisonResult.differences.costDiff <= 0 ? 'text-[#2E7D6B]' : 'text-[#C75A3B]'}`}>
                {comparisonResult.differences.costDiff > 0 ? `+₹${comparisonResult.differences.costDiff}` : `-₹${Math.abs(comparisonResult.differences.costDiff)}`}
              </span>
            </div>

          </div>

          {/* Goal Explanation Box */}
          <div className="p-5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <h4 className="text-xs font-bold text-[#2E2E2E] dark:text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#C75A3B]" />
              <span>Why This Alternative Fits Your Goals:</span>
            </h4>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-300 leading-relaxed">
              {comparisonResult.recommendationReason}
            </p>
          </div>

          {/* Uncertainty Notice */}
          <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400 italic">
            {comparisonResult.uncertaintyNote}
          </p>

        </div>
      )}

    </div>
  );
};
