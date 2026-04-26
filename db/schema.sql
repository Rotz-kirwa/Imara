create table if not exists loan_applications (
  id bigserial primary key,
  reference text not null unique,
  first_name text not null,
  last_name text not null,
  id_number text not null,
  phone text not null,
  loan_amount text not null,
  monthly_income numeric(14, 2) not null,
  employment text not null,
  loan_term text not null,
  status text not null default 'submitted',
  payment_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists loan_applications_phone_idx
  on loan_applications (phone);

create table if not exists mpesa_payments (
  id bigserial primary key,
  checkout_request_id text not null unique,
  merchant_request_id text,
  reference text references loan_applications(reference) on delete set null,
  phone text,
  amount numeric(14, 2),
  status text not null default 'pending',
  result_code text,
  result_desc text,
  mpesa_receipt_number text,
  transaction_date bigint,
  raw_callback jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mpesa_payments_reference_idx
  on mpesa_payments (reference);

create index if not exists mpesa_payments_status_idx
  on mpesa_payments (status);
