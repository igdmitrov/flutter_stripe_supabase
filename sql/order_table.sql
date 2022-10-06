create table public.order_table (
  id uuid default gen_random_uuid() primary key not null,
  description text check (char_length(description) > 0) not null,
  enabled boolean default false not null,
  modified_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.order_table enable row level security;

create policy "Users can insert order."
  on order_table for insert
  with check ( order_table.enabled = false );

create policy "All users can view order." 
  on order_table for select
  using ( true );

create policy "Users can update order."
  on order_table for update 
  using ( order_table.enabled = false );

create policy "Users can delete order." 
  on order_table for delete 
  using ( false );