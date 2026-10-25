/**
 * BiteSize Frontend API Service Client
 */

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('bitesize_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('bitesize_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('bitesize_token');
};

const authHeaders = (isFormData: boolean = false): HeadersInit => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Generic Fetch Wrapper
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  isFormData: boolean = false
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...authHeaders(isFormData),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// Authentication
export const authApi = {
  register: (body: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (email: string) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body: { email: string; newPassword: string; resetToken?: string }) =>
    apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (body: any) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  deleteAccount: () => apiRequest('/auth/account', { method: 'DELETE' })
};

// Meals
export const mealApi = {
  scanMeal: (formData: FormData) => apiRequest('/meals/scan', { method: 'POST', body: formData }, true),
  confirmMeal: (body: any) => apiRequest('/meals/confirm', { method: 'POST', body: JSON.stringify(body) }),
  getMeals: (date?: string) => apiRequest(`/meals${date ? `?date=${date}` : ''}`),
  getAllMeals: (limit: number = 50, search?: string) =>
    apiRequest(`/meals/all?limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
  deleteMeal: (id: number) => apiRequest(`/meals/${id}`, { method: 'DELETE' })
};

// Receipts
export const receiptApi = {
  scanReceipt: (formData: FormData) => apiRequest('/receipts/scan', { method: 'POST', body: formData }, true),
  confirmReceipt: (body: any) => apiRequest('/receipts/confirm', { method: 'POST', body: JSON.stringify(body) }),
  getReceipts: () => apiRequest('/receipts'),
  getReceiptDetails: (id: number) => apiRequest(`/receipts/${id}`),
  deleteReceipt: (id: number) => apiRequest(`/receipts/${id}`, { method: 'DELETE' })
};

// AI Coach
export const coachApi = {
  sendMessage: (message: string) => apiRequest('/coach/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getHistory: () => apiRequest('/coach/history'),
  clearHistory: () => apiRequest('/coach/history', { method: 'DELETE' })
};

// "What If I Changed This?"
export const compareApi = {
  calculate: (body: any) => apiRequest('/compare/calculate', { method: 'POST', body: JSON.stringify(body) }),
  getCurated: () => apiRequest('/compare/curated'),
  addToShopping: (foodId: string, quantity: number = 1) =>
    apiRequest('/compare/add-to-shopping', { method: 'POST', body: JSON.stringify({ foodId, quantity }) })
};

// Pantry & Recipes
export const pantryApi = {
  getPantry: () => apiRequest('/pantry'),
  addItem: (body: any) => apiRequest('/pantry', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (id: number, body: any) => apiRequest(`/pantry/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem: (id: number) => apiRequest(`/pantry/${id}`, { method: 'DELETE' }),
  getRecipes: () => apiRequest('/pantry/recipes'),
  cookRecipe: (recipeId: string) => apiRequest('/pantry/cook', { method: 'POST', body: JSON.stringify({ recipeId }) }),
  addMissing: (recipeId: string) => apiRequest('/pantry/add-missing', { method: 'POST', body: JSON.stringify({ recipeId }) })
};

// Shopping List
export const shoppingApi = {
  getList: () => apiRequest('/shopping'),
  addItem: (body: any) => apiRequest('/shopping', { method: 'POST', body: JSON.stringify(body) }),
  toggleItem: (id: number) => apiRequest(`/shopping/${id}/toggle`, { method: 'PUT' }),
  updateItem: (id: number, body: any) => apiRequest(`/shopping/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem: (id: number) => apiRequest(`/shopping/${id}`, { method: 'DELETE' }),
  clearCompleted: () => apiRequest('/shopping/clear/completed', { method: 'DELETE' })
};

// Subscriptions & Razorpay
export const subApi = {
  getStatus: () => apiRequest('/subscriptions/status'),
  createCheckout: (planId: string) => apiRequest('/subscriptions/create-order', { method: 'POST', body: JSON.stringify({ planId }) }),
  verifyPayment: (body: any) => apiRequest('/subscriptions/verify-payment', { method: 'POST', body: JSON.stringify(body) }),
  cancelSub: () => apiRequest('/subscriptions/cancel', { method: 'POST' })
};

// Rewards (Bite Currency)
export const rewardsApi = {
  getStatus: () => apiRequest('/rewards'),
  redeemVoucher: (voucherId: string) => apiRequest('/rewards/redeem', { method: 'POST', body: JSON.stringify({ voucherId }) })
};

// Dashboard Overview
export const dashboardApi = {
  getOverview: () => apiRequest('/dashboard/overview')
};

// Household (Shared Bite Family)
export const householdApi = {
  getHousehold: () => apiRequest('/household'),
  addMember: (body: any) => apiRequest('/household', { method: 'POST', body: JSON.stringify(body) }),
  removeMember: (id: number) => apiRequest(`/household/${id}`, { method: 'DELETE' })
};

// Reports & Data Export
export const reportsApi = {
  getAnalytics: () => apiRequest('/reports/analytics'),
  exportDataUrl: (format: 'json' | 'csv' = 'json') => `/api/reports/export?format=${format}`
};
