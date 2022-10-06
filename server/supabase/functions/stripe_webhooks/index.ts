import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { activateOrder } from "../_utils/supabase.ts";
import { stripe, cryptoProvider } from "../_utils/stripe.ts";

serve(async (req) => {
  const parameters = req.clone();
  const { data } = await parameters.json();
  const body = await req.text();
  console.log(body);

  const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');
  const signature = req.headers.get('Stripe-Signature');
  console.log(signature);


  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret, undefined, cryptoProvider);
  }
  catch (err) {
    return new Response(JSON.stringify(`Webhook Error: ${err.message}`), { status: 400 });
  }

  switch (event.type) {
    // deno-lint-ignore no-case-declarations
    case 'payment_intent.succeeded':
      const orderId = data.object.metadata.orderId;
      const amount = data.object.metadata.amount;
      const client_secret = data.object.client_secret;
      console.log("Order Id: " + orderId + ' / ' + client_secret +  ' / amount: ' + amount);

      //Activate advert
      await activateOrder(orderId, client_secret, amount);
      
      console.log('PaymentIntent was successful!');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(
    JSON.stringify("OK"),
    { headers: { "Content-Type": "application/json" } },
  )
})