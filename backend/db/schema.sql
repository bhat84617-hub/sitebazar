-- Run this once in Supabase Dashboard → SQL Editor → New Query → Run
-- Creates the two tables SiteBazar needs.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  free_landing_page_used boolean not null default false,
  unlocked_websites jsonb not null default '[]',
  subscription jsonb not null default '{"active": false, "plan": null, "startedAt": null, "expiresAt": null}',
  created_at timestamptz not null default now()
);

create table if not exists websites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  business_name text not null,
  business_type text not null,
  description text,
  generated_content jsonb not null,
  is_paid boolean not null default false,
  is_free_generation boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_websites_user_id on websites(user_id);
