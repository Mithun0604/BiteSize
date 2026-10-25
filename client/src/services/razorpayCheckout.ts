export interface RazorpayCheckoutOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  plan: { name: string };
}

const loadRazorpayScript = (): Promise<void> => new Promise((resolve, reject) => {
  if ((window as any).Razorpay) return resolve();

  const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]');
  if (existing) {
    existing.addEventListener('load', () => resolve(), { once: true });
    existing.addEventListener('error', () => reject(new Error('Razorpay Checkout could not be loaded.')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.dataset.razorpayCheckout = 'true';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded.'));
  document.body.appendChild(script);
});

export const openRazorpayCheckout = async (order: RazorpayCheckoutOrder): Promise<any | null> => {
  await loadRazorpayScript();
  const Razorpay = (window as any).Razorpay;

  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'BiteSize',
      description: order.plan.name,
      order_id: order.orderId,
      theme: { color: '#C75A3B' },
      handler: (payment: any) => resolve(payment),
      modal: { ondismiss: () => resolve(null) }
    });
    checkout.on('payment.failed', (event: any) => {
      reject(new Error(event?.error?.description || 'Razorpay payment failed.'));
    });
    checkout.open();
  });
};
