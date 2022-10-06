create or replace function activate_order(order_id uuid, amount decimal, customer_id text)
returns bool
language plpgsql security invoker
as
$$
  begin

    update public.order_table
    set modified_at = timezone('utc'::text, now()), enabled = true
    where ( public.order_table.id = $1 );

    return true;
  end;
$$;