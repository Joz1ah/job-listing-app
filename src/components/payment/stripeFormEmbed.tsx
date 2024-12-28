import React, { useEffect, useState, useCallback, useRef } from 'react';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QMsGlFCh69SpK2kpR1Y1qGEkVzVy2gLDHJkLjIx8rQSJhyl8qQwG3nFVqjVL4E4JoeVhez3a0HAkyN94YhqcpKG00PsoOvCI8');

const StripeTokenizedForm: React.FC = React.memo(() => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Ref to hold the card element
  const cardElementRef = useRef<StripeCardElement | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      if (stripeInstance) {
        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);
        
        const card = elementsInstance.create('card');
        card.mount('#card-element');
        cardElementRef.current = card; // Assign to the ref
        console.log('initialized stripe payment form');
        console.log(card);
      }
    };

    initializeStripe();

    // Cleanup on unmount
    return () => {
      if (cardElementRef.current) {
        cardElementRef.current.unmount();
      }
    };
  }, []); // Only run on mount

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || !cardElementRef.current) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElementRef.current,
      });

      if (error) {
        console.error('Error creating payment method:', error);
        setErrorMessage(error.message || 'An unknown error occurred');
      } else {
        console.log('Payment Method:', paymentMethod);
        setPaymentMethodId(paymentMethod.id);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred while processing the payment.');
    } finally {
      setLoading(false);
    }
  }, [stripe, elements]);

  return (
    <div className="container mx-auto">
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-4 lg:overflow-visible lg:px-0">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold text-gray-900">Stripe Tokenized Form</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 mb-5">
                This form generates a token as a payment method ID to be included in the API payload.
              </p>
              <p className="max-w-2xl text-lg text-black-500 mb-10">
                Product monthly subscription priced at $1.
              </p>
            </div>

            <form id="payment-form" onSubmit={handleSubmit}>
              <div id="card-element" style={{ height: '40px', border: '1px solid #ccc' }}></div>
              <div id="card-errors" role="alert" className="text-red-500">{errorMessage}</div>
              <button
                id="submit-button"
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                Submit Payment
                <svg className="-mr-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
              </button>

              {loading && (
                <p id="loading-indicator" className="mt-4 text-sm text-blue-500">
                  Getting payment method ID, please wait...
                </p>
              )}
              {paymentMethodId && (
                <p id="paymentMethodId" className="mt-5 max-w-2xl text-sm text-red-500 mb-10">
                  Your Payment Method ID: {paymentMethodId}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StripeTokenizedForm;
