import React, { useState, useEffect } from 'react';
import { pantryApi } from '../services/api';
import {
  Refrigerator,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  UtensilsCrossed,
  ShoppingCart,
  Calendar,
  ChefHat
} from 'lucide-react';

interface PantryProps {
  onNavigate: (page: string) => void;
}

export const PantryPage: React.FC<PantryProps> = ({ onNavigate }) => {
  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New item modal
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Grains & Pulses');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemDays, setNewItemDays] = useState(14);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchPantryData = async () => {
    setLoading(true);
    try {
      const [pantryRes, recipeRes] = await Promise.all([
        pantryApi.getPantry(),
        pantryApi.getRecipes()
      ]);

      if (pantryRes.success) setPantryItems(pantryRes.items || []);
      if (recipeRes.success) setRecipes(recipeRes.recipes || []);
    } catch (err) {
      console.warn("Error loading pantry data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantryData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const res = await pantryApi.addItem({
        name: newItemName.trim(),
        category: newItemCat,
        quantity: newItemQty,
        unit: newItemUnit,
        daysRemaining: newItemDays
      });

      if (res.success) {
        setNewItemName('');
        setShowAddForm(false);
        setActionMessage('Pantry item added successfully!');
        fetchPantryData();
      }
    } catch (err: any) {
      alert("Failed to add pantry item.");
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await pantryApi.deleteItem(id);
      setPantryItems(pantryItems.filter(i => i.id !== id));
    } catch (err) {
      alert("Failed to delete pantry item.");
    }
  };

  const handleCookRecipe = async (recipeId: string, title: string) => {
    try {
      const res = await pantryApi.cookRecipe(recipeId);
      if (res.success) {
        setActionMessage(`"${title}" cooked! Pantry ingredients deducted.`);
        fetchPantryData();
      }
    } catch (err) {
      alert("Could not update pantry.");
    }
  };

  const handleAddMissing = async (recipeId: string) => {
    try {
      const res = await pantryApi.addMissing(recipeId);
      if (res.success) {
        setActionMessage(res.message);
      }
    } catch (err) {
      alert("Failed to add ingredients to shopping list.");
    }
  };

  const expiringSoon = pantryItems.filter(i => i.days_remaining <= 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2E7D6B]/10 text-[#2E7D6B] text-xs font-semibold">
          <Refrigerator className="w-3.5 h-3.5" />
          <span>Smart Food Storage & Zero Waste</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          Pantry-to-Plate AI
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Track ingredients you already own from scanned grocery receipts, monitor shelf life, and discover healthy meals you can cook tonight without spending more money.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Food Waste Reduction Banner (if expiring items exist) */}
      {expiringSoon.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Zero Waste Reminder: {expiringSoon.length} item(s) expiring in &lt; 3 days!
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                {expiringSoon.map(i => `${i.name} (${i.days_remaining}d left)`).join(', ')}. Use them in a quick stir-fry or dal today!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white"
          >
            See Recipes
          </button>
        </div>
      )}

      {/* 1. PANTRY INVENTORY SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
              Current Pantry Inventory ({pantryItems.length})
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Synced from your grocery bills and manual pantry updates.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F4] dark:bg-slate-700 text-[#C75A3B] border border-[#E8E6E1] hover:border-[#C75A3B] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ingredient</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input
              type="text"
              required
              placeholder="Item name (e.g. Sona Masoori Rice)"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
            />
            <select
              value={newItemCat}
              onChange={e => setNewItemCat(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <option value="Grains & Pulses">Grains & Pulses</option>
              <option value="Dairy & Eggs">Dairy & Eggs</option>
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Healthy Snacks">Healthy Snacks</option>
              <option value="Pantry & Spices">Pantry & Spices</option>
            </select>
            <div className="flex space-x-1">
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={newItemQty}
                onChange={e => setNewItemQty(Number(e.target.value))}
                className="w-16 px-2 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
              />
              <input
                type="text"
                value={newItemUnit}
                onChange={e => setNewItemUnit(e.target.value)}
                placeholder="kg / pack"
                className="w-16 px-2 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white"
            >
              Save Item
            </button>
          </form>
        )}

        {/* Pantry Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pantryItems.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.days_remaining <= 3
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                  : 'bg-[#FAF8F4] dark:bg-slate-700/50 border-[#E8E6E1] dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#2E2E2E] dark:text-white leading-tight">{item.name}</h4>
                  <span className="text-[10px] text-[#5B6B7A] dark:text-slate-400">{item.category}</span>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-stone-400 hover:text-red-500 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2E2E2E] dark:text-white">
                  {item.quantity} {item.unit}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.days_remaining <= 3
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-stone-200 dark:bg-slate-600 text-stone-700 dark:text-slate-300'
                }`}>
                  {item.days_remaining}d shelf life
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RECIPE SUGGESTIONS MATCHED TO PANTRY */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ChefHat className="w-5 h-5 text-[#C75A3B]" />
          <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
            Pantry-Matched Recipes You Can Cook Now
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF8F4] dark:bg-slate-700 text-[#C75A3B] uppercase">
                    {recipe.category}
                  </span>
                  <span className="text-xs font-bold text-[#2E7D6B] bg-[#2E7D6B]/10 px-2 py-0.5 rounded-full">
                    {recipe.matchPercentage}% Pantry Match
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
                  {recipe.title}
                </h4>

                <div className="flex items-center space-x-4 text-xs text-[#5B6B7A] dark:text-slate-300">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                  </span>
                  <span>•</span>
                  <span>~₹{recipe.estimatedCostPerServing} / serving</span>
                  <span>•</span>
                  <span className="text-[#C75A3B] font-semibold">{recipe.nutritionPerServing.protein}g protein</span>
                </div>

                {/* Required Ingredients Status */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 space-y-1.5 text-xs">
                  <span className="font-semibold text-[#5B6B7A] text-[11px]">Ingredients in Recipe:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.ingredientsStatus.map((ing: any, idx: number) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          ing.availableInPantry
                            ? 'bg-[#2E7D6B]/15 text-[#2E7D6B] font-medium'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        <span>{ing.availableInPantry ? '✓' : '✗'}</span>
                        <span>{ing.name} ({ing.quantity})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cooking Instructions */}
                <div className="text-xs text-[#5B6B7A] dark:text-slate-400 space-y-1">
                  <span className="font-semibold text-[#2E2E2E] dark:text-white">Quick Method:</span>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                    {recipe.instructions.slice(0, 2).map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8E6E1] dark:border-slate-700">
                {recipe.missingCount > 0 ? (
                  <button
                    onClick={() => handleAddMissing(recipe.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 border border-[#E8E6E1] hover:border-[#C75A3B] text-[#5B6B7A] hover:text-[#C75A3B]"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add {recipe.missingCount} Missing Item(s)</span>
                  </button>
                ) : (
                  <span className="text-xs text-[#2E7D6B] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All ingredients ready!</span>
                  </span>
                )}

                <button
                  onClick={() => handleCookRecipe(recipe.id, recipe.title)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105"
                >
                  Cook This & Deduct Pantry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
