import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.7";

export const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

export const activateOrder = async (orderId: string, customerId: string, amount: number) => {
    const response = await supabaseAdmin.rpc('activate_order', { 'order_id': orderId, 'amount': amount, 'customer_id': customerId });

    if(response.error != null) {
        throw new Error(`Order Id: ${orderId}, error: ${response.error.message}`);
    }

    return response.data as unknown as boolean;
}