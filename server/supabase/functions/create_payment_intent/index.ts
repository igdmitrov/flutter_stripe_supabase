import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createPaymentIntent } from "../_utils/stripe.ts";

serve(async (req) => {
  const minAmount = 1;
  const { orderId, amount } = await req.json();
  console.log(orderId + " / " + amount);

  if(amount < minAmount) {
    console.error('Incorrect amount, orderId: ' + orderId + ' / ' + amount);
    return new Response(JSON.stringify('Incorrect amount'), { status: 400 });
  }

  try {
    const customerId = await createPaymentIntent(orderId, amount);
    console.log('Customer Id: ' + customerId);

    return new Response(
      JSON.stringify(customerId),
      { headers: { "Content-Type": "application/json" } },
    );

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 400 });
  }
})
