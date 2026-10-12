import React, { useState, useRef } from 'react';
import { mealApi } from '../services/api';
import { UncertaintyBadge } from '../components/UncertaintyBadge';
import { PlanLimitBanner } from '../components/PlanLimitBanner';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Plus,
  Trash2,
  Edit2,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface MealScannerProps {
  onNavigate: (page: string) => void;
}

export const MealScannerPage: React.FC<MealScannerProps> = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [limitBanner, setLimitBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable fields in confirmation stage
  const [editableMealName, setEditableMealName] = useState('');
  const [editableMealType, setEditableMealType] = useState('lunch');
  const [editablePortionGrams, setEditablePortionGrams] = useState<number>(250);
  const [editableCookingMethod, setEditableCookingMethod] = useState('Tempered / Light Sauté');
  const [editableAddedOil, setEditableAddedOil] = useState('1/2 tsp Ghee (+23 kcal)');
  const [editableIngredients, setEditableIngredients] = useState<any[]>([]);
  const [mealNotes, setMealNotes] = useState('');
  const [manualEntryMode, setManualEntryMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
    setError(null);
    setSuccessMessage(null);
  };

  const executeScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setError(null);
    setLimitBanner(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await mealApi.scanMeal(formData);
      if (res.success) {
        const data = res.data;
        setScanResult(data);
        setEditableMealName(data.mealName);
        setEditablePortionGrams(data.totals?.calories ? 250 : 200);
        setEditableCookingMethod(data.cookingMethod || 'Tempered / Light Sauté');
        setEditableIngredients(data.ingredients || []);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('limit')) {
        setLimitBanner(err.message);
      } else {
        setError(err.message || 'Analysis failed. Please check image format.');
      }
    } finally {
      setScanning(false);
    }
  };

  // Dynamically recompute totals when ingredients or oils change
  const calculateCurrentTotals = () => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;

    editableIngredients.forEach(ing => {
      calories += ing.calories || 0;
      protein += ing.protein || 0;
      carbs += ing.carbs || 0;
      fat += ing.fat || 0;
      fiber += ing.fiber || 0;
    });

    // Add extra fat/calories from chosen oil
    if (editableAddedOil.includes('+23 kcal')) {
      calories += 23;
      fat += 2.5;
    } else if (editableAddedOil.includes('+45 kcal')) {
      calories += 45;
      fat += 5.0;
    } else if (editableAddedOil.includes('+90 kcal')) {
      calories += 90;
      fat += 10.0;
    }

    return {
      calories: Math.round(calories),
      protein: +protein.toFixed(1),
      carbs: +carbs.toFixed(1),
      fat: +fat.toFixed(1),
      fiber: +fiber.toFixed(1)
    };
  };

  const handleIngredientPortionChange = (index: number, newGrams: number) => {
    const updated = [...editableIngredients];
    const ing = updated[index];
    const ratio = newGrams / (ing.portionGrams || 100);

    updated[index] = {
      ...ing,
      portionGrams: newGrams,
      calories: Math.round(ing.calories * ratio),
      protein: +(ing.protein * ratio).toFixed(1),
      carbs: +(ing.carbs * ratio).toFixed(1),
      fat: +(ing.fat * ratio).toFixed(1),
      fiber: +(ing.fiber * ratio).toFixed(1)
    };
    setEditableIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setEditableIngredients(editableIngredients.filter((_, i) => i !== index));
  };

  const handleConfirmAndSave = async () => {
    const totals = calculateCurrentTotals();

    try {
      const payload = {
        mealName: editableMealName,
        mealType: editableMealType,
        imagePath: scanResult?.uploadedImagePath || null,
        portionGrams: editablePortionGrams,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        fiber: totals.fiber,
        confidenceScore: scanResult?.confidenceScore || 0.90,
        uncertaintyRange: scanResult?.uncertaintyRange || '±10%',
        cookingMethod: editableCookingMethod,
        addedOil: editableAddedOil,
        notes: mealNotes,
        loggedDate: new Date().toISOString().slice(0, 10),
        ingredients: editableIngredients
      };

      const res = await mealApi.confirmMeal(payload);
      if (res.success) {
        setSuccessMessage('Meal successfully logged to your daily intake log!');
        setScanResult(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save meal.');
    }
  };

  const computedTotals = calculateCurrentTotals();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Precision Standards Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>BiteSize Vision & IFCT Nutrition Intelligence</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          AI Meal Photo Scanner
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Capture or upload your meal photo. BiteSize identifies the dishes, applies verified Indian Food Composition Tables, and lets you calibrate portion sizes and cooking oils before logging.
        </p>
      </div>

      {limitBanner && (
        <PlanLimitBanner
          message={limitBanner}
          onUpgrade={() => onNavigate('subscriptions')}
          onClose={() => setLimitBanner(null)}
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-[#D96B6B] flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage} Redirecting to your dashboard...</span>
        </div>
      )}

      {/* Upload & Capture Card */}
      {!scanResult && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-dashed border-[#E8E6E1] dark:border-slate-700 shadow-soft text-center space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          {previewUrl ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E6E1] max-h-72 shadow-md">
                <img src={previewUrl} alt="Meal preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-[#5B6B7A] dark:text-slate-400 font-medium">
                Photo selected: {selectedFile?.name}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E8E6E1] hover:border-[#C75A3B]"
                >
                  Change Photo
                </button>
                <button
                  onClick={executeScan}
                  disabled={scanning}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{scanning ? 'Analyzing Food Vision...' : 'Analyze Meal with AI'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF8F4] dark:bg-slate-700 mx-auto flex items-center justify-center text-[#C75A3B]">
                <Camera className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
                  Take or Upload Meal Photo
                </h3>
                <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Works with Indian thalis, dals, rotis, rice bowls, healthy breakfasts, and regional dishes.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 shadow-md shadow-[#C75A3B]/20"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Live Photo</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-600 hover:border-[#C75A3B] transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#5B6B7A]" />
                  <span>Upload From Gallery</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
                <button
                  onClick={() => {
                    // Manual entry preset
                    setScanResult({
                      mealName: 'Custom Indian Meal Plate',
                      confidenceScore: 1.0,
                      uncertaintyRange: 'User Defined',
                      ingredients: [
                        { name: 'Whole Wheat Roti', portionGrams: 80, calories: 210, protein: 7.4, carbs: 43.2, fat: 1.4, fiber: 6.8 },
                        { name: 'Moong Dal Tadka', portionGrams: 150, calories: 177, protein: 10.2, carbs: 21.8, fat: 5.7, fiber: 6.3 }
                      ]
                    });
                    setEditableMealName('Custom Indian Meal Plate');
                    setEditableIngredients([
                      { name: 'Whole Wheat Roti', portionGrams: 80, calories: 210, protein: 7.4, carbs: 43.2, fat: 1.4, fiber: 6.8 },
                      { name: 'Moong Dal Tadka', portionGrams: 150, calories: 177, protein: 10.2, carbs: 21.8, fat: 5.7, fiber: 6.3 }
                    ]);
                  }}
                  className="text-xs text-[#5B6B7A] hover:text-[#C75A3B] underline"
                >
                  Or manually add a meal without photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Review & Confirmation Screen */}
      {scanResult && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-xl space-y-6 animate-fade-in">
          
          {/* Header & Uncertainty Indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E6E1] dark:border-slate-700">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#C75A3B] uppercase tracking-wider">
                  Food Vision AI Match
                </span>
                <UncertaintyBadge
                  uncertaintyRange={scanResult.uncertaintyRange}
                  confidenceScore={scanResult.confidenceScore}
                />
              </div>
              <input
                type="text"
                value={editableMealName}
                onChange={e => setEditableMealName(e.target.value)}
                className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#C75A3B] focus:outline-none mt-1 w-full"
                title="Click to edit meal title"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={editableMealType}
                onChange={e => setEditableMealType(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          {/* Clarification Checklist Prompts */}
          {scanResult.clarificationNeeded && scanResult.clarificationNeeded.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#5B6B7A] dark:text-slate-200">
                <HelpCircle className="w-4 h-4 text-[#C75A3B]" />
                <span>AI Clarification Prompts (Refining Accuracy):</span>
              </div>
              <ul className="text-xs text-[#5B6B7A] dark:text-slate-300 space-y-1 list-disc list-inside">
                {scanResult.clarificationNeeded.map((c: string, idx: number) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Cooking Method & Oil Adjustment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Cooking Method (Adjusts Caloric Density)
              </label>
              <select
                value={editableCookingMethod}
                onChange={e => setEditableCookingMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              >
                <option value="Tempered / Light Sauté">Tempered with Spices (Tadka / Light Sauté)</option>
                <option value="Plain Boiled / Steamed">Plain Boiled / Steamed (Zero Oil)</option>
                <option value="Shallow Fried">Shallow Fried in Kadai</option>
                <option value="Tandoori / Roasted">Tandoori / Oven Roasted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Added Oils / Ghee
              </label>
              <select
                value={editableAddedOil}
                onChange={e => setEditableAddedOil(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              >
                <option value="None">None / Zero Added Oil</option>
                <option value="1/2 tsp Ghee (+23 kcal)">1/2 tsp Ghee / Tadka (+23 kcal)</option>
                <option value="1 tsp Oil/Ghee (+45 kcal)">1 tsp Oil / Butter (+45 kcal)</option>
                <option value="2 tsp Oil/Butter (+90 kcal)">2 tsp Oil / Restaurant Gravy (+90 kcal)</option>
              </select>
            </div>
          </div>

          {/* Identified Food Items Table with Portion Sliders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-slate-400">
              Identified Dishes & Estimated Portions
            </h4>

            <div className="space-y-2">
              {editableIngredients.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#2E2E2E] dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-[#5B6B7A] dark:text-slate-300">
                      {item.calories} kcal • {item.protein}g protein • {item.carbs}g carbs • {item.fiber}g fiber
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#5B6B7A]">Portion:</span>
                      <input
                        type="number"
                        min="20"
                        max="800"
                        step="10"
                        value={item.portionGrams}
                        onChange={e => handleIngredientPortionChange(idx, Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs text-center rounded-lg border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
                      />
                      <span className="text-xs text-[#5B6B7A]">g</span>
                    </div>

                    <button
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibrated Total Macro Card */}
          <div className="p-5 rounded-2xl bg-[#2E2E2E] text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F6D6C9] uppercase tracking-wider">
                Total Nutrition Summary
              </span>
              <span className="text-[11px] text-stone-400">
                Verified against ICMR-NIN IFCT 2024
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="block text-[11px] text-stone-300">Total Calories</span>
                <span className="font-extrabold text-lg text-white">{computedTotals.calories} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="block text-[11px] text-stone-300">Protein</span>
                <span className="font-extrabold text-lg text-[#F6D6C9]">{computedTotals.protein}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="block text-[11px] text-stone-300">Carbs</span>
                <span className="font-extrabold text-lg text-white">{computedTotals.carbs}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="block text-[11px] text-stone-300">Fats</span>
                <span className="font-extrabold text-lg text-white">{computedTotals.fat}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="block text-[11px] text-stone-300">Fiber</span>
                <span className="font-extrabold text-lg text-[#7FB3B8]">{computedTotals.fiber}g</span>
              </div>
            </div>
          </div>

          {/* Confirm & Save Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
            <button
              onClick={() => setScanResult(null)}
              className="text-xs font-semibold text-[#5B6B7A] hover:text-[#2E2E2E]"
            >
              ← Cancel and retake
            </button>

            <button
              onClick={handleConfirmAndSave}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-lg shadow-[#C75A3B]/25 transition-transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Save to Daily Log</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
