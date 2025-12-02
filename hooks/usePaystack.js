import { useEffect } from 'react';

/**
 * Custom hook to load Paystack inline script
 */
export const usePaystackScript = () => {
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) return;

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
};

/**
 * Initialize Paystack payment
 * @param {Object} config - Payment configuration
 * @param {string} config.email - Customer email
 * @param {number} config.amount - Amount in kobo (₦1 = 100 kobo)
 * @param {string} config.publicKey - Paystack public key
 * @param {Function} config.onSuccess - Success callback
 * @param {Function} config.onClose - Close callback
 */
export const initializePayment = (config) => {
  if (!window.PaystackPop) {
    console.error('Paystack script not loaded');
    return;
  }

  const handler = window.PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    currency: 'NGN',
    ref: config.reference || `${Date.now()}`,
    metadata: config.metadata || {},
    callback: (response) => {
      if (config.onSuccess) {
        config.onSuccess(response);
      }
    },
    onClose: () => {
      if (config.onClose) {
        config.onClose();
      }
    },
  });

  handler.openIframe();
};
