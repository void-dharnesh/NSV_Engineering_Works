create table if not exists public.enquiries (
  id text primary key,
  submitted_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  requirement_type text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint enquiries_full_name_not_blank check (length(btrim(full_name)) > 0),
  constraint enquiries_phone_not_blank check (length(btrim(phone)) > 0),
  constraint enquiries_requirement_type_valid check (
    requirement_type in (
      'CNC Machining',
      'Cast Component Finishing',
      'Precision Polishing',
      'Industrial Job Work',
      'General Enquiry'
    )
  ),
  constraint enquiries_message_min_length check (length(btrim(message)) >= 10)
);

create index if not exists enquiries_submitted_at_idx
  on public.enquiries (submitted_at desc);

alter table public.enquiries enable row level security;

drop policy if exists "Service role can manage enquiries" on public.enquiries;

create policy "Service role can manage enquiries"
  on public.enquiries
  for all
  to service_role
  using (true)
  with check (true);
