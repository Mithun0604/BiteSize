import React, { useState } from 'react';
import { shoppingApi } from '../services/api';
import {
  Calendar,
  Sparkles,
  ChefHat,
  ShoppingCart,
  Check,
  RefreshCw,
  Flame,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface MealPlannerProps {
  onNavigate: (page: string) => void;
}

export const MealPlannerPage: React.FC<MealPlannerProps> = ({ onNavigate }) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [goal, setGoal] = useState<'fat_loss' | 'muscle_gain' | 'balanced'>('muscle_gain');
  const [addedToList, setAddedToList] = useState<boolean>(false);
  const [dietaryType, setDietaryType] = useState<'all' | 'veg' | 'non_veg'>('all');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const weeklyPlans: Record<string, Record<number, any>> = {
    muscle_gain: {
      0: {
        breakfast: { name: 'Rolled Oats with Greek Yogurt, Chia Seeds & Almonds', calories: 420, protein: 26, carbs: 54, fat: 12, time: '10 min', ingredients: ['Rolled Oats', 'Greek Yogurt', 'Chia Seeds', 'Almonds'] },
        lunch: { name: 'Grilled Skinless Chicken Breast (180g) with Quinoa & Steamed Broccoli', calories: 510, protein: 48, carbs: 42, fat: 14, time: '25 min', ingredients: ['Chicken Breast', 'Quinoa', 'Broccoli', 'Olive Oil'] },
        snack: { name: '3 Boiled Egg Whites + Roasted Fox Nuts (Makhana)', calories: 230, protein: 18, carbs: 24, fat: 5, time: '8 min', ingredients: ['Eggs', 'Fox Nuts / Makhana'] },
        dinner: { name: 'Palak Paneer with 2 Whole Wheat Rotis & Cucumber Salad', calories: 540, protein: 28, carbs: 52, fat: 22, time: '30 min', ingredients: ['Paneer', 'Spinach (Palak)', 'Whole Wheat Atta', 'Cucumber'] }
      },
      1: {
        breakfast: { name: '3 Whole Egg Bhurji with 2 Multigrain Toasts', calories: 440, protein: 28, carbs: 32, fat: 20, time: '15 min', ingredients: ['Eggs', 'Onion', 'Tomato', 'Multigrain Bread'] },
        lunch: { name: 'Tandoori Chicken Tikka with Brown Rice & Dal Tadka', calories: 580, protein: 46, carbs: 62, fat: 16, time: '35 min', ingredients: ['Chicken Breast', 'Brown Rice', 'Moong Dal', 'Yogurt'] },
        snack: { name: 'Hung Curd Dip with Carrot & Cucumber Sticks', calories: 180, protein: 14, carbs: 16, fat: 6, time: '5 min', ingredients: ['Hung Curd / Dahi', 'Carrots', 'Cucumber'] },
        dinner: { name: 'Grilled Rohu Fish with Lemon Pepper & Sautéed Beans', calories: 480, protein: 42, carbs: 18, fat: 24, time: '20 min', ingredients: ['Rohu Fish', 'Green Beans', 'Lemon', 'Olive Oil'] }
      },
      2: {
        breakfast: { name: 'Moong Dal Sprouts Salad with Paneer Cubes & Lime', calories: 380, protein: 24, carbs: 36, fat: 14, time: '10 min', ingredients: ['Moong Sprouts', 'Paneer', 'Lemon', 'Tomato'] },
        lunch: { name: 'Pan-Seared Chicken Breast (180g) with Sweet Potato & Green Beans', calories: 520, protein: 47, carbs: 46, fat: 12, time: '25 min', ingredients: ['Chicken Breast', 'Sweet Potato', 'Beans'] },
        snack: { name: 'Whey Protein / Soya Milk Smoothie with Banana', calories: 260, protein: 25, carbs: 32, fat: 4, time: '5 min', ingredients: ['Toned Milk', 'Banana', 'Chia Seeds'] },
        dinner: { name: 'Rajma Masala with Steamed Basmati Rice & Indian Green Salad', calories: 560, protein: 22, carbs: 86, fat: 12, time: '30 min', ingredients: ['Rajma', 'Basmati Rice', 'Onion', 'Tomato'] }
      },
      3: {
        breakfast: { name: 'Besan Chilla (2 pcs) Stuffed with Grated Paneer', calories: 410, protein: 22, carbs: 40, fat: 18, time: '15 min', ingredients: ['Besan (Gram Flour)', 'Paneer', 'Green Chilies'] },
        lunch: { name: 'Chicken Curry (Homestyle) with 2 Rotis & Curd', calories: 540, protein: 42, carbs: 48, fat: 18, time: '35 min', ingredients: ['Chicken Breast', 'Wheat Atta', 'Curd'] },
        snack: { name: 'Roasted Chana (Chickpeas) & Green Tea', calories: 190, protein: 12, carbs: 26, fat: 4, time: '2 min', ingredients: ['Roasted Chana'] },
        dinner: { name: 'Grilled Tofu / Paneer Tikka with Sautéed Bell Peppers', calories: 460, protein: 32, carbs: 22, fat: 26, time: '20 min', ingredients: ['Paneer or Tofu', 'Bell Peppers', 'Onion'] }
      },
      4: {
        breakfast: { name: 'Overnight Rolled Oats with Peanut Butter & Berries', calories: 450, protein: 20, carbs: 58, fat: 16, time: '5 min', ingredients: ['Rolled Oats', 'Peanut Butter', 'Milk', 'Berries'] },
        lunch: { name: 'Boiled Shredded Chicken Breast Salad with Olive Oil Dressing', calories: 480, protein: 49, carbs: 14, fat: 22, time: '15 min', ingredients: ['Chicken Breast', 'Lettuce', 'Olive Oil', 'Cucumber'] },
        snack: { name: 'Boiled Egg Whites (4 pcs) with Pinch of Chaat Masala', calories: 210, protein: 22, carbs: 2, fat: 1, time: '10 min', ingredients: ['Eggs', 'Chaat Masala'] },
        dinner: { name: 'Moong Dal Khichdi with Ghee Tadka & Cucumber Raita', calories: 520, protein: 20, carbs: 74, fat: 14, time: '25 min', ingredients: ['Moong Dal', 'Rice', 'Curd', 'Ghee'] }
      },
      5: {
        breakfast: { name: 'Paneer Bhurji with 2 Whole Wheat Rotis', calories: 460, protein: 26, carbs: 44, fat: 20, time: '15 min', ingredients: ['Paneer', 'Wheat Flour', 'Onion', 'Tomato'] },
        lunch: { name: 'Hyderabadi Chicken Biryani (Lean Breast Pieces) with Cucumber Raita', calories: 590, protein: 44, carbs: 68, fat: 16, time: '40 min', ingredients: ['Chicken Breast', 'Basmati Rice', 'Curd', 'Spices'] },
        snack: { name: 'Handful of Mixed Nuts (Walnuts, Almonds) & Black Coffee', calories: 210, protein: 6, carbs: 8, fat: 18, time: '2 min', ingredients: ['Almonds', 'Walnuts'] },
        dinner: { name: 'Palak Chana Gravy with Steamed Rice', calories: 490, protein: 21, carbs: 76, fat: 11, time: '30 min', ingredients: ['Kabuli Chana', 'Spinach', 'Rice'] }
      },
      6: {
        breakfast: { name: 'Steamed Idli (3 pcs) with Lentil Sambar & Coconut Chutney', calories: 380, protein: 14, carbs: 64, fat: 8, time: '20 min', ingredients: ['Idli Batter', 'Toor Dal', 'Coconut'] },
        lunch: { name: 'Grilled Salmon or Pomfret Fillet with Lemon & Mashed Potatoes', calories: 530, protein: 42, carbs: 36, fat: 22, time: '25 min', ingredients: ['Fish Fillet', 'Potato', 'Butter', 'Lemon'] },
        snack: { name: 'Fruit Bowl (Apple & Papaya) with Pumpkin Seeds', calories: 190, protein: 5, carbs: 36, fat: 4, time: '5 min', ingredients: ['Apple', 'Papaya', 'Pumpkin Seeds'] },
        dinner: { name: 'Tawa Chicken Breast / Paneer with Mixed Vegetable Sabzi', calories: 510, protein: 45, carbs: 28, fat: 18, time: '25 min', ingredients: ['Chicken Breast or Paneer', 'Carrot', 'Beans', 'Capsicum'] }
      }
    },
    fat_loss: {
      0: {
        breakfast: { name: 'Egg White Omelet (4 whites) with Spinach & Mushroom', calories: 220, protein: 24, carbs: 6, fat: 4, time: '10 min', ingredients: ['Eggs', 'Spinach', 'Mushroom'] },
        lunch: { name: 'Skinless Boiled Chicken Breast (160g) with Large Garden Salad', calories: 340, protein: 44, carbs: 12, fat: 8, time: '15 min', ingredients: ['Chicken Breast', 'Cucumber', 'Tomato', 'Lemon'] },
        snack: { name: 'Cucumber Slices with 2 tbsp Hung Curd', calories: 85, protein: 7, carbs: 8, fat: 2, time: '3 min', ingredients: ['Cucumber', 'Hung Curd'] },
        dinner: { name: 'Clear Vegetable Moong Dal Soup with Sautéed Tofu', calories: 360, protein: 26, carbs: 32, fat: 10, time: '20 min', ingredients: ['Moong Dal', 'Tofu', 'Beans', 'Carrots'] }
      }
    },
    balanced: {
      0: {
        breakfast: { name: 'Poha with Roasted Peanuts, Peas & Lemon', calories: 340, protein: 9, carbs: 54, fat: 10, time: '15 min', ingredients: ['Flattened Rice (Poha)', 'Peanuts', 'Green Peas', 'Lemon'] },
        lunch: { name: 'Toor Dal Tadka with Steamed Rice, Bhindi Masala & Curd', calories: 510, protein: 18, carbs: 76, fat: 14, time: '30 min', ingredients: ['Toor Dal', 'Rice', 'Bhindi', 'Curd'] },
        snack: { name: 'Roasted Makhana with Pink Salt & Green Tea', calories: 150, protein: 4, carbs: 28, fat: 3, time: '5 min', ingredients: ['Makhana'] },
        dinner: { name: '2 Whole Wheat Rotis with Aloo Gobhi & Cucumber Salad', calories: 450, protein: 12, carbs: 68, fat: 12, time: '25 min', ingredients: ['Whole Wheat Atta', 'Potato', 'Cauliflower'] }
      }
    }
  };

  const activePlanDay = (weeklyPlans[goal] && weeklyPlans[goal][selectedDay]) || weeklyPlans['muscle_gain'][selectedDay % 7];

  const totalCalories = (activePlanDay.breakfast?.calories || 0) + (activePlanDay.lunch?.calories || 0) + (activePlanDay.snack?.calories || 0) + (activePlanDay.dinner?.calories || 0);
  const totalProtein = (activePlanDay.breakfast?.protein || 0) + (activePlanDay.lunch?.protein || 0) + (activePlanDay.snack?.protein || 0) + (activePlanDay.dinner?.protein || 0);
  const totalCarbs = (activePlanDay.breakfast?.carbs || 0) + (activePlanDay.lunch?.carbs || 0) + (activePlanDay.snack?.carbs || 0) + (activePlanDay.dinner?.carbs || 0);
  const totalFat = (activePlanDay.breakfast?.fat || 0) + (activePlanDay.lunch?.fat || 0) + (activePlanDay.snack?.fat || 0) + (activePlanDay.dinner?.fat || 0);

  const handleAddAllToShoppingList = async () => {
    const allIngredients = [
      ...(activePlanDay.breakfast?.ingredients || []),
      ...(activePlanDay.lunch?.ingredients || []),
      ...(activePlanDay.snack?.ingredients || []),
      ...(activePlanDay.dinner?.ingredients || [])
    ];

    try {
      for (const item of allIngredients) {
        await shoppingApi.addItem({
          name: item,
          category: 'Fresh Produce & Pantry',
          quantity: 1,
          unit: 'pack / kg',
          estimated_price_inr: 80
        });
      }
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to add items to shopping list.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="section-eyebrow">
            <ChefHat className="w-3.5 h-3.5" />
            <span>AI Precision Meal Planning</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
            Weekly Meal Planner
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Scientifically balanced meal schedules aligned with your fitness goals, pantry ingredients, and grocery budget.
          </p>
        </div>

        {/* Goal Selector Pill */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setGoal('muscle_gain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              goal === 'muscle_gain'
                ? 'bg-[#C75A3B] text-white shadow-sm'
                : 'text-[#5B6B7A] hover:text-[#2E2E2E] dark:hover:text-white'
            }`}
          >
            Muscle Gain (High Protein)
          </button>
          <button
            onClick={() => setGoal('fat_loss')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              goal === 'fat_loss'
                ? 'bg-[#C75A3B] text-white shadow-sm'
                : 'text-[#5B6B7A] hover:text-[#2E2E2E] dark:hover:text-white'
            }`}
          >
            Fat Loss (Calorie Deficit)
          </button>
          <button
            onClick={() => setGoal('balanced')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              goal === 'balanced'
                ? 'bg-[#C75A3B] text-white shadow-sm'
                : 'text-[#5B6B7A] hover:text-[#2E2E2E] dark:hover:text-white'
            }`}
          >
            Balanced Health
          </button>
        </div>
      </div>

      {/* Days of Week Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {daysOfWeek.map((day, idx) => {
          const isSelected = selectedDay === idx;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#2E2E2E] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-[#5B6B7A] dark:text-slate-300 border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B]'
              }`}
            >
              <span>{day}</span>
              <span className="block text-[10px] font-normal text-stone-400 mt-0.5">
                Day {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Daily Nutritional Target Card */}
      <div className="bg-[#FAF8F4] dark:bg-slate-800/80 p-5 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C75A3B] uppercase tracking-wider">
            {daysOfWeek[selectedDay]} Planned Nutrition
          </span>
          <div className="flex items-baseline space-x-3 mt-1">
            <span className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              {totalCalories} kcal
            </span>
            <span className="text-xs text-[#5B6B7A] dark:text-slate-300 font-semibold">
              {totalProtein}g Protein • {totalCarbs}g Carbs • {totalFat}g Fats
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddAllToShoppingList}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              addedToList
                ? 'bg-[#2E7D6B] text-white'
                : 'bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20'
            }`}
          >
            {addedToList ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span>{addedToList ? 'Added to Shopping List!' : 'Add Ingredients to Shopping List'}</span>
          </button>
        </div>
      </div>

      {/* Meal Slots (Breakfast, Lunch, Snack, Dinner) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { slot: 'Breakfast', data: activePlanDay.breakfast },
          { slot: 'Lunch', data: activePlanDay.lunch },
          { slot: 'Snack', data: activePlanDay.snack },
          { slot: 'Dinner', data: activePlanDay.dinner }
        ].map(({ slot, data }) => (
          <div
            key={slot}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4 hover:border-[#C75A3B]/40 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C75A3B]">
                  {slot}
                </span>
                <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white mt-0.5">
                  {data?.name || 'Balanced Whole Foods Plate'}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-[#5B6B7A] dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#5B6B7A]" />
                <span>{data?.time || '20 min'}</span>
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600">
              <div>
                <span className="block text-[10px] text-[#5B6B7A]">Calories</span>
                <span className="font-bold text-xs text-[#2E2E2E] dark:text-white">{data?.calories} kcal</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#5B6B7A]">Protein</span>
                <span className="font-bold text-xs text-[#C75A3B]">{data?.protein}g</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#5B6B7A]">Carbs</span>
                <span className="font-bold text-xs text-[#D4A85A]">{data?.carbs}g</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#5B6B7A]">Fat</span>
                <span className="font-bold text-xs text-[#5B6B7A]">{data?.fat}g</span>
              </div>
            </div>

            {/* Ingredients Chips */}
            <div>
              <span className="text-[11px] font-bold text-[#5B6B7A] dark:text-slate-300 block mb-1.5">
                Key Ingredients:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data?.ingredients?.map((ing: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-stone-100 dark:bg-slate-700 text-[#2E2E2E] dark:text-slate-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E6E1] dark:border-slate-700">
              <button
                onClick={() => onNavigate('scan-meal')}
                className="text-xs font-semibold text-[#C75A3B] hover:underline flex items-center space-x-1"
              >
                <span>Log this meal photo</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => onNavigate('pantry')}
                className="text-xs text-[#5B6B7A] hover:text-[#2E2E2E] underline"
              >
                Check Pantry Stock
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
