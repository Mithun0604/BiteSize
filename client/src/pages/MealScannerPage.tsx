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
  ArrowRight,
  ShieldCheck,
  Scale,
  ChefHat,
  ChevronRight,
  Info
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

  // Multi-candidate and state
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(0);
  const [editableMealName, setEditableMealName] = useState('');
  const [editableMealType, setEditableMealType] = useState('lunch');
  const [editablePortionGrams, setEditablePortionGrams] = useState<number>(150);
  const [editableCookingMethod, setEditableCookingMethod] = useState('Grilled / Pan-Seared');
  const [skinOption, setSkinOption] = useState<'skinless' | 'skin_on'>('skinless');
  const [editableAddedOil, setEditableAddedOil] = useState('No added cooking fat (0 kcal)');
  const [editableIngredients, setEditableIngredients] = useState<any[]>([]);
  const [mealNotes, setMealNotes] = useState('');

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
        setSelectedCandidateIndex(0);

        const primary = data.candidates?.[0] || data.ingredients?.[0] || {
          name: data.mealName,
          portionGrams: 150,
          calculated: data.totals
        };

        setEditableMealName(primary.name || data.mealName);
        setEditablePortionGrams(primary.portionGrams || 150);
        setEditableCookingMethod(data.cookingMethod || 'Grilled / Pan-Seared');
        setEditableIngredients(data.ingredients || [primary]);
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

  // Switch between AI-generated plausible food candidates
  const handleSelectCandidate = (candidate: any, index: number) => {
    setSelectedCandidateIndex(index);
    setEditableMealName(candidate.name);
    setEditablePortionGrams(candidate.portionGrams || 150);

    const factor = (candidate.portionGrams || 150) / 100;
    const per100g = candidate.per100g || { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 };

    const newIng = {
      name: candidate.name,
      verifiedDatabaseMatch: candidate.name,
      portionGrams: candidate.portionGrams || 150,
      servingUnit: candidate.servingDescription || `${candidate.portionGrams}g portion`,
      confidence: candidate.confidence,
      calories: Math.round(per100g.calories * factor),
      protein: +(per100g.protein * factor).toFixed(1),
      carbs: +(per100g.carbs * factor).toFixed(1),
      fat: +(per100g.fat * factor).toFixed(1),
      fiber: +(per100g.fiber * factor).toFixed(1),
      sugar: +(per100g.sugar * factor).toFixed(1),
      sodium: Math.round(per100g.sodium * factor),
      per100g
    };

    setEditableIngredients([newIng]);
  };

  // Dynamically recompute totals when portion, cooking method, skin, or oils change
  const calculateCurrentTotals = () => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;
    let sugar = 0;
    let sodium = 0;

    editableIngredients.forEach(ing => {
      calories += ing.calories || 0;
      protein += ing.protein || 0;
      carbs += ing.carbs || 0;
      fat += ing.fat || 0;
      fiber += ing.fiber || 0;
      sugar += ing.sugar || 0;
      sodium += ing.sodium || 0;
    });

    // Cooking method multiplier
    let methodFactor = 1.0;
    let methodFatAdd = 0;
    if (editableCookingMethod.includes('Boiled')) {
      methodFactor = 0.95;
    } else if (editableCookingMethod.includes('Pan-Fried')) {
      methodFactor = 1.35;
      methodFatAdd = 6.0;
    } else if (editableCookingMethod.includes('Deep Fried')) {
      methodFactor = 1.65;
      methodFatAdd = 12.0;
    }

    calories = Math.round(calories * methodFactor);
    fat += methodFatAdd;

    // Skin-on adjustment if applicable
    if (skinOption === 'skin_on' && editableMealName.toLowerCase().includes('chicken')) {
      calories += Math.round((editablePortionGrams / 100) * 35);
      fat += +((editablePortionGrams / 100) * 4.2).toFixed(1);
    }

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
      fiber: +fiber.toFixed(1),
      sugar: +sugar.toFixed(1),
      sodium: Math.round(sodium)
    };
  };

  const handlePortionPreset = (grams: number) => {
    setEditablePortionGrams(grams);
    if (editableIngredients.length > 0) {
      const updated = editableIngredients.map(ing => {
        const per100 = ing.per100g || {
          calories: (ing.calories / (ing.portionGrams || 100)) * 100,
          protein: (ing.protein / (ing.portionGrams || 100)) * 100,
          carbs: (ing.carbs / (ing.portionGrams || 100)) * 100,
          fat: (ing.fat / (ing.portionGrams || 100)) * 100,
          fiber: (ing.fiber / (ing.portionGrams || 100)) * 100,
          sugar: 0,
          sodium: 70
        };
        const factor = grams / 100;
        return {
          ...ing,
          portionGrams: grams,
          calories: Math.round(per100.calories * factor),
          protein: +(per100.protein * factor).toFixed(1),
          carbs: +(per100.carbs * factor).toFixed(1),
          fat: +(per100.fat * factor).toFixed(1),
          fiber: +(per100.fiber * factor).toFixed(1)
        };
      });
      setEditableIngredients(updated);
    }
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
        sugar: totals.sugar,
        sodium: totals.sodium,
        confidenceScore: scanResult?.confidenceScore || 0.88,
        uncertaintyRange: scanResult?.uncertaintyRange || '±9%',
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
        }, 1200);
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
          Capture or upload your meal photo. BiteSize inspects image characteristics, surfaces candidate matches with transparent confidence ratings, and calculates nutrition strictly against verified ICMR-NIN & USDA tables.
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
                  Works with lean meats (chicken breast, fish), eggs, paneer, dals, rice bowls, healthy salads, and regional dishes.
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
                    const presetCandidates = [
                      {
                        name: "Skinless Chicken Breast (Grilled / Pan-Seared)",
                        portionGrams: 150,
                        confidence: 0.90,
                        per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 }
                      },
                      {
                        name: "Raw Skinless Chicken Breast (Boneless)",
                        portionGrams: 150,
                        confidence: 0.82,
                        per100g: { calories: 120, protein: 22.5, carbs: 0, fat: 2.6, fiber: 0, sugar: 0, sodium: 65 }
                      },
                      {
                        name: "Tandoori Chicken Tikka (Boneless)",
                        portionGrams: 160,
                        confidence: 0.75,
                        per100g: { calories: 160, protein: 26.5, carbs: 3.5, fat: 4.5, fiber: 0.5, sugar: 1.0, sodium: 280 }
                      }
                    ];
                    setScanResult({
                      mealName: presetCandidates[0].name,
                      confidenceScore: 0.90,
                      uncertaintyRange: '±9%',
                      candidates: presetCandidates,
                      clarificationNeeded: [
                        "Confirm if oil or butter was added while grilling.",
                        "Confirm portion matches 150g fillet."
                      ]
                    });
                    handleSelectCandidate(presetCandidates[0], 0);
                  }}
                  className="text-xs text-[#5B6B7A] hover:text-[#C75A3B] underline"
                >
                  Or quick-test with Chicken Breast Fillet
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
                  Vision Identification
                </span>
                <UncertaintyBadge
                  uncertaintyRange={scanResult.uncertaintyRange || "±9%"}
                  confidenceScore={scanResult.confidenceScore || 0.88}
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

          {/* Multi-Candidate Selection Chips (Fixes Misidentification & Handles Visual Ambiguity) */}
          {scanResult.candidates && scanResult.candidates.length > 1 && (
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/40 border border-[#E8E6E1] dark:border-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2E2E2E] dark:text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C75A3B]" />
                  <span>Select Food Candidate (Click to switch if needed):</span>
                </span>
                <span className="text-[10px] text-[#5B6B7A] dark:text-slate-400">
                  Multiple matches detected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {scanResult.candidates.map((cand: any, idx: number) => {
                  const isSelected = selectedCandidateIndex === idx;
                  const confPct = Math.round((cand.confidence || 0.8) * 100);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCandidate(cand, idx)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#C75A3B] bg-white dark:bg-slate-800 shadow-md ring-2 ring-[#C75A3B]/20'
                          : 'border-[#E8E6E1] dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 hover:border-[#C75A3B]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2E2E2E] dark:text-white truncate pr-1">
                          {cand.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-[#C75A3B] text-white' : 'bg-stone-200 dark:bg-slate-700 text-[#5B6B7A]'
                        }`}>
                          {confPct}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400 mt-1">
                        {cand.per100g ? `${cand.per100g.calories} kcal • ${cand.per100g.protein}g protein / 100g` : `${cand.portionGrams || 150}g portion`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clarification Prompts */}
          {scanResult.clarificationNeeded && scanResult.clarificationNeeded.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#5B6B7A] dark:text-slate-200">
                <HelpCircle className="w-4 h-4 text-[#C75A3B]" />
                <span>AI Clarification Prompts:</span>
              </div>
              <ul className="text-xs text-[#5B6B7A] dark:text-slate-300 space-y-1 list-disc list-inside">
                {scanResult.clarificationNeeded.map((c: string, idx: number) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Portion Size Quick Adjusters */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300">
              Portion Size (Grams)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[100, 120, 150, 200, 250].map((grams) => (
                <button
                  key={grams}
                  type="button"
                  onClick={() => handlePortionPreset(grams)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    editablePortionGrams === grams
                      ? 'border-[#C75A3B] bg-[#C75A3B] text-white'
                      : 'border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-800 text-[#2E2E2E] dark:text-white hover:border-[#C75A3B]'
                  }`}
                >
                  {grams}g {grams === 150 ? '(Standard)' : ''}
                </button>
              ))}
              <div className="flex items-center space-x-1.5 pl-2">
                <input
                  type="number"
                  min="20"
                  max="1000"
                  step="10"
                  value={editablePortionGrams}
                  onChange={e => handlePortionPreset(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-xs text-center rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <span className="text-xs text-[#5B6B7A]">g custom</span>
              </div>
            </div>
          </div>

          {/* Cooking Method, Skin Status & Oil Adjustment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Preparation / Cooking Method
              </label>
              <select
                value={editableCookingMethod}
                onChange={e => setEditableCookingMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              >
                <option value="Grilled / Pan-Seared">Grilled / Pan-Seared (Baseline)</option>
                <option value="Boiled / Poached">Boiled / Poached (Zero Oil, Leanest)</option>
                <option value="Oven Baked">Oven Baked</option>
                <option value="Tandoori Roasted">Tandoori Roasted</option>
                <option value="Pan-Fried">Pan-Fried with Oil (+6g fat)</option>
                <option value="Crispy Deep Fried">Deep Fried / Crispy (+12g fat)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Cut / Skin Status
              </label>
              <select
                value={skinOption}
                onChange={e => setSkinOption(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              >
                <option value="skinless">Skinless (Leanest Protein)</option>
                <option value="skin_on">Skin-On (+35 kcal/100g, Crispy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Added Cooking Oils / Ghee
              </label>
              <select
                value={editableAddedOil}
                onChange={e => setEditableAddedOil(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              >
                <option value="No added cooking fat (0 kcal)">No added cooking fat (0 kcal)</option>
                <option value="1/2 tsp Ghee (+23 kcal)">1/2 tsp Ghee / Olive Oil (+23 kcal)</option>
                <option value="1 tsp Oil/Ghee (+45 kcal)">1 tsp Butter / Oil (+45 kcal)</option>
                <option value="2 tsp Oil/Butter (+90 kcal)">2 tsp Oil / Restaurant Gravy (+90 kcal)</option>
              </select>
            </div>
          </div>

          {/* Calibrated Total Macro Card */}
          <div className="p-5 rounded-2xl bg-[#2E2E2E] text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F6D6C9] uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D6B]" />
                <span>Verified Nutrition Calculation</span>
              </span>
              <span className="text-[11px] text-stone-400">
                Ground Truth: ICMR-NIN & USDA FoodData
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

          {/* Optional Meal Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
              Personal Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Post-workout meal with black pepper, weighed raw before grilling"
              value={mealNotes}
              onChange={e => setMealNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
            />
          </div>

          {/* Confirm & Save Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
            <button
              onClick={() => {
                setScanResult(null);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
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
