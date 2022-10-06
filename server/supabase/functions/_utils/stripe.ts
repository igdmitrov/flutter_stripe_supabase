// esm.sh is used to compile stripe-node to be compatible with ES modules.
import { Stripe } from "https://esm.sh/stripe@10.12.0?target=deno&no-check";

export const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2022-08-01",
});

export const createPaymentIntent = async (orderId: string, amount: number) => {
  const { client_secret } = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "eur",
    payment_method_types: ["card"],
    description: "Test payment",
    metadata: { "orderId": orderId, "amount": amount },
  });

  return client_secret as string;
}

export const cryptoProvider = Stripe.createSubtleCryptoProvider();