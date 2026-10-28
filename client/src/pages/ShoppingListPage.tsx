import React, { useState, useEffect } from 'react';
import { shoppingApi } from '../services/api';
import { ShoppingCart, Plus, Check, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface ShoppingListProps {
  onNavigate: (page: string) => void;
}

export const ShoppingListPage: React.FC<ShoppingListProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<Record<string, any[]>>({});
  const [totalEstimatedCost, setTotalEstimatedCost] = useState(0);
  const [loading, setLoading] = useState(true);

  // Add form
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Pantry & Essentials');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(60);
  const [showAdd, setShowAdd] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await shoppingApi.getList();
      if (res.success) {
        setItems(res.items || []);
        setGrouped(res.grouped || {});
        setTotalEstimatedCost(res.totalEstimatedCost || 0);
      }
    } catch (err) {
      console.warn("Could not load shopping list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleToggle = async (id: number) => {
    try {
      const res = await shoppingApi.toggleItem(id);
      if (res.success) {
        setItems(items.map(i => i.id === id ? { ...i, is_checked: res.isChecked } : i));
        fetchList();
      }
    } catch (err) {
      alert("Failed to toggle item.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await shoppingApi.deleteItem(id);
      setItems(items.filter(i => i.id !== id));
      fetchList();
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  const handleClearCompleted = async () => {
    try {
      await shoppingApi.clearCompleted();
      fetchList();
    } catch (err) {
      alert("Failed to clear completed items.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const res = await shoppingApi.addItem({
        name: newItemName.trim(),
        category: newItemCat,
        quantity: newItemQty,
        estimatedPrice: newItemPrice
      });
      if (res.success) {
        setNewItemName('');
        setShowAdd(false);
        fetchList();
      }
    } catch (err) {
      alert("Failed to add item.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Budget Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E6E1] dark:border-slate-800">
        <div>
          <div className="section-eyebrow">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Next-Basket Optimiser</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
            Smart Shopping List
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Automatically organized by aisle categories with estimated checkout cost.
          </p>
        </div>

        {/* Cost Summary Box */}
        <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 text-right shrink-0">
          <span className="text-[11px] text-[#5B6B7A] uppercase font-bold block">Estimated Basket Cost</span>
          <span className="text-2xl font-black text-[#2E2E2E] dark:text-white">
            ₹{totalEstimatedCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 shadow-sm shadow-[#C75A3B]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Item</span>
        </button>

        {items.some(i => i.is_checked) && (
          <button
            onClick={handleClearCompleted}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-[#5B6B7A] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      {/* Add Item Form */}
      {showAdd && (
        <form onSubmit={handleAddSubmit} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 shadow-soft grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fade-in">
          <input
            type="text"
            required
            placeholder="Item name (e.g. Greek Yogurt)"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="sm:col-span-2 px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
          />
          <select
            value={newItemCat}
            onChange={e => setNewItemCat(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
          >
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Grains & Pulses">Grains & Pulses</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Healthy Snacks">Healthy Snacks</option>
            <option value="Pantry & Essentials">Pantry & Essentials</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E2E2E] text-white hover:bg-black"
          >
            Add to List
          </button>
        </form>
      )}

      {/* Grouped Shopping Items by Category */}
      {loading ? (
        <p className="text-xs text-[#5B6B7A]">Loading list...</p>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 text-center space-y-3">
          <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">Your Shopping List is Empty</h3>
          <p className="text-xs text-[#5B6B7A] max-w-sm mx-auto">
            Add items manually, transfer missing recipe ingredients from Pantry-to-Plate, or add recommended swaps from "What If?".
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-slate-400">
                {category} ({catItems.length})
              </h3>

              <div className="space-y-2">
                {catItems.map((item: any) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      item.is_checked
                        ? 'bg-stone-100 dark:bg-slate-800/40 border-stone-200 dark:border-slate-700 opacity-60'
                        : 'bg-[#FAF8F4] dark:bg-slate-700/50 border-[#E8E6E1] dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(item.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          item.is_checked
                            ? 'bg-[#2E7D6B] border-[#2E7D6B] text-white'
                            : 'border-stone-300 dark:border-slate-500 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {item.is_checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-0.5">
                        <span className={`text-xs font-bold ${item.is_checked ? 'line-through text-[#5B6B7A]' : 'text-[#2E2E2E] dark:text-white'}`}>
                          {item.name}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-[#5B6B7A]">
                          <span>{item.quantity} {item.unit}</span>
                          {item.added_reason === 'what_if_swap' && (
                            <span className="px-1.5 py-0.2 rounded bg-[#C75A3B]/10 text-[#C75A3B] font-semibold">
                              What-If swap
                            </span>
                          )}
                          {item.added_reason === 'recipe_ingredient' && (
                            <span className="px-1.5 py-0.2 rounded bg-[#2E7D6B]/10 text-[#2E7D6B] font-semibold">
                              Recipe ingredient
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-semibold text-[#2E2E2E] dark:text-white">
                        ~₹{item.estimated_price * item.quantity}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
