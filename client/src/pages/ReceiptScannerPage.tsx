import React, { useState, useEffect, useRef } from 'react';
import { receiptApi } from '../services/api';
import { PlanLimitBanner } from '../components/PlanLimitBanner';
import {
  Receipt,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit3,
  Calendar,
  Store,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

interface ReceiptScannerProps {
  onNavigate: (page: string) => void;
}

export const ReceiptScannerPage: React.FC<ReceiptScannerProps> = ({ onNavigate }) => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [limitBanner, setLimitBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable fields in review modal
  const [editableStore, setEditableStore] = useState('');
  const [editableDate, setEditableDate] = useState('');
  const [editableItems, setEditableItems] = useState<any[]>([]);
  const [editableDiscount, setEditableDiscount] = useState(0);
  const [editableTax, setEditableTax] = useState(0);
  const [autoPantrySync, setAutoPantrySync] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReceipts = async () => {
    setLoadingHistory(true);
    try {
      const res = await receiptApi.getReceipts();
      if (res.success) {
        setReceipts(res.receipts || []);
      }
    } catch (err: any) {
      console.warn('Could not load receipts history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setParsedData(null);
    setError(null);
    setSuccessMessage(null);
  };

  const executeScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setError(null);
    setLimitBanner(null);

    const formData = new FormData();
    formData.append('receipt', selectedFile);

    try {
      const res = await receiptApi.scanReceipt(formData);
      if (res.success) {
        const data = res.data;
        setParsedData(data);
        setEditableStore(data.storeName);
        setEditableDate(data.receiptDate);
        setEditableItems(data.items || []);
        setEditableDiscount(data.discountAmount || 0);
        setEditableTax(data.taxAmount || 0);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('limit')) {
        setLimitBanner(err.message);
      } else {
        setError(err.message || 'Receipt OCR failed. Please ensure receipt is legible.');
      }
    } finally {
      setScanning(false);
    }
  };

  const calculateTotal = () => {
    const sum = editableItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    return Math.max(0, +(sum - Number(editableDiscount) + Number(editableTax)).toFixed(2));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const updated = [...editableItems];
    updated[index] = { ...updated[index], [field]: val };
    setEditableItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setEditableItems(editableItems.filter((_, i) => i !== index));
  };

  const handleConfirmReceipt = async () => {
    if (!editableDate) {
      setError('Confirm the receipt date before saving.');
      return;
    }
    const totalAmount = calculateTotal();

    try {
      const payload = {
        storeName: editableStore,
        receiptDate: editableDate,
        totalAmount,
        discountAmount: Number(editableDiscount) || 0,
        taxAmount: Number(editableTax) || 0,
        imagePath: parsedData?.uploadedFilePath || null,
        rawText: parsedData?.rawText || '',
        items: editableItems,
        autoAddToPantry: autoPantrySync
      };

      const res = await receiptApi.confirmReceipt(payload);
      if (res.success) {
        setSuccessMessage('Receipt saved. Pantry and budget records were updated.');
        setParsedData(null);
        setSelectedFile(null);
        fetchReceipts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to confirm receipt.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#5B6B7A]/10 text-[#5B6B7A] text-xs font-semibold">
          <Receipt className="w-3.5 h-3.5" />
          <span>OCR Receipt Intelligence & Budgeting</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          Grocery Receipt Scanner
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Upload any grocery bill or PDF (Reliance Smart, Blinkit, DMart, Zepto). We extract product lines, flag uncertain product matches, update your pantry inventory, and calculate Bite Currency rewards.
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
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upload Zone */}
      {!parsedData && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-dashed border-[#E8E6E1] dark:border-slate-700 shadow-soft text-center space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          <div className="w-16 h-16 rounded-3xl bg-[#FAF8F4] dark:bg-slate-700 mx-auto flex items-center justify-center text-[#5B6B7A]">
            <Receipt className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
              {selectedFile ? selectedFile.name : 'Upload Receipt Photo or PDF'}
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Extracts items, quantities, discounts, and stores automatically.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#E8E6E1] dark:border-slate-600 hover:border-[#C75A3B] transition-colors"
            >
              {selectedFile ? 'Change File' : 'Browse File'}
            </button>

            {selectedFile && (
              <button
                onClick={executeScan}
                disabled={scanning}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{scanning ? 'Running OCR Extraction...' : 'Scan & Extract Items'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Review & Correction Modal / View */}
      {parsedData && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-xl space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E1] dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-[#5B6B7A] uppercase tracking-wider">
                Extracted Grocery Invoice
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <Store className="w-4 h-4 text-[#C75A3B]" />
                <input
                  type="text"
                  value={editableStore}
                  onChange={e => setEditableStore(e.target.value)}
                  className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white bg-transparent border-b border-transparent focus:border-[#C75A3B] focus:outline-none"
                  placeholder="Store Name"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Calendar className="w-4 h-4 text-[#5B6B7A]" />
              <input
                type="date"
                required
                value={editableDate}
                onChange={e => setEditableDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              />
            </div>
          </div>

          {/* Line Items Table with Uncertain Match Flags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-slate-400">
                Receipt Items ({editableItems.length})
              </h4>
              <span className="text-[11px] text-[#5B6B7A]">
                Review items, quantities, and prices before saving
              </span>
            </div>

            <div className="space-y-2">
              {editableItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isUncertain
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-[#FAF8F4] dark:bg-slate-700/60 border-[#E8E6E1] dark:border-slate-600'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => handleItemChange(idx, 'name', e.target.value)}
                        className="text-xs font-bold text-[#2E2E2E] dark:text-white bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#C75A3B] focus:outline-none w-full"
                      />
                      {item.isUncertain && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E3B341]/20 text-[#E3B341] flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Uncertain match</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-[#5B6B7A]">
                      <select
                        value={item.category}
                        onChange={e => handleItemChange(idx, 'category', e.target.value)}
                        className="text-[11px] px-2 py-0.5 rounded border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <option value="Grains & Pulses">Grains & Pulses</option>
                        <option value="Dairy & Eggs">Dairy & Eggs</option>
                        <option value="Fresh Produce">Fresh Produce</option>
                        <option value="Healthy Snacks">Healthy Snacks</option>
                        <option value="Pantry & Spices">Pantry & Spices</option>
                        <option value="Household">Household</option>
                      </select>
                      <span>Qty: {item.quantity} {item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-[#5B6B7A]">₹</span>
                      <input
                        type="number"
                        step="0.5"
                        value={item.price}
                        onChange={e => handleItemChange(idx, 'price', Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs font-bold text-right rounded-lg border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Options */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center space-x-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPantrySync}
                onChange={e => setAutoPantrySync(e.target.checked)}
                className="w-4 h-4 text-[#C75A3B] rounded"
              />
              <span>Automatically add food items into my Pantry inventory</span>
            </label>

            <div className="text-right">
              <span className="text-xs text-[#5B6B7A] mr-2">Grand Total:</span>
              <span className="text-xl font-extrabold text-[#2E2E2E] dark:text-white">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Confirm & Persist Action */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
            <button
              onClick={() => setParsedData(null)}
              className="text-xs font-semibold text-[#5B6B7A] hover:text-[#2E2E2E]"
            >
              ← Cancel
            </button>

            <button
              onClick={handleConfirmReceipt}
              className="px-7 py-3 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Receipt & Update Rewards</span>
            </button>
          </div>

        </div>
      )}

      {/* Searchable Receipts History Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
          Receipt History & Trip Comparisons
        </h3>

        {loadingHistory ? (
          <p className="text-xs text-[#5B6B7A]">Loading purchase history...</p>
        ) : receipts.length === 0 ? (
          <p className="text-xs text-[#5B6B7A]">No past receipts recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {receipts.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#2E2E2E] dark:text-white">{r.store_name}</span>
                    <span className="text-[11px] text-[#5B6B7A]">({r.receipt_date})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(r.categorySummary || {}).map(([cat, amt]: any) => (
                      <span key={cat} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[#5B6B7A]">
                        {cat}: ₹{Math.round(amt)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-[#2E2E2E] dark:text-white">
                    ₹{r.total_amount.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-[#2E7D6B] font-medium">+₹{(r.total_amount * 0.075).toFixed(0)} Bite Currency</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
