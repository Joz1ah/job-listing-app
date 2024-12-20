import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QMsGlFCh69SpK2kpR1Y1qGEkVzVy2gLDHJkLjIx8rQSJhyl8qQwG3nFVqjVL4E4JoeVhez3a0HAkyN94YhqcpKG00PsoOvCI8');

type StripeProviderProps = {
  children: React.ReactNode;
};

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/secret');
        const { client_secret: secret } = await response.json();
        setClientSecret(secret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };

    fetchClientSecret();
  }, []);

  const options: StripeElementsOptions | undefined = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe', // Ensure this matches the expected type: "stripe" | "night" | "flat" | undefined
        },
      }
    : undefined;

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          {children}
        </Elements>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};