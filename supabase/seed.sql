-- ============================================
-- Prayer Request Manager - Schema + Seed Data
-- Run this once in your Supabase SQL Editor.
-- ============================================

-- Members table (create if not already created)
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text not null check (gender in ('Male', 'Female')),
  active boolean not null default true,
  created_at timestamp with time zone default now()
);

alter table members enable row level security;

drop policy if exists "Allow all for now" on members;
create policy "Allow all for now" on members
  for all using (true) with check (true);

-- Missionaries table
create table if not exists missionaries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  location text,
  active boolean not null default true,
  created_at timestamp with time zone default now()
);

alter table missionaries enable row level security;

drop policy if exists "Allow all for now" on missionaries;
create policy "Allow all for now" on missionaries
  for all using (true) with check (true);

-- ============================================
-- Seed: Members (from prayer-request-2026.pdf)
-- ============================================

insert into members (full_name, gender) values
  ('Bel', 'Female'),
  ('Gie', 'Female'),
  ('Vina', 'Female'),
  ('Vivian', 'Female'),
  ('Lucy', 'Female'),
  ('Marlyn Velasco', 'Female'),
  ('Mylene', 'Female'),
  ('Carol Lebantino', 'Female'),
  ('Minnie', 'Female'),
  ('Jennilyn', 'Female'),
  ('Lina', 'Female'),
  ('Glaiza', 'Female'),
  ('Mayet', 'Female'),
  ('Vicky', 'Female'),
  ('Joyce', 'Female'),
  ('Cecille', 'Female'),
  ('Menzi', 'Female'),
  ('Jerame', 'Female'),
  ('Winnie', 'Female'),
  ('Lolit Dagdag', 'Female'),
  ('Rosella', 'Female'),
  ('Racquel', 'Female'),
  ('Gigi', 'Female'),
  ('Gay Martin', 'Female'),
  ('Shemea', 'Female'),
  ('Hannah Agustin', 'Female'),
  ('Pamela', 'Female'),
  ('Glaizel Joy', 'Female'),
  ('Cacai', 'Female'),
  ('Lourdes', 'Female'),
  ('Leanne Nagano', 'Female'),
  ('Cel', 'Female'),
  ('Gwen', 'Female'),
  ('Carol Umipig', 'Female'),
  ('Cora', 'Female'),
  ('Mila', 'Female'),
  ('Lydia Racelis', 'Female'),
  ('Le-Anne Galinato', 'Female'),
  ('Estella', 'Female'),
  ('Gene', 'Female'),
  ('Aura', 'Female'),
  ('Minilva', 'Female'),
  ('Benditha', 'Female'),
  ('Raquel', 'Female'),
  ('Cael', 'Male'),
  ('Sean Reb', 'Male'),
  ('Arnold', 'Male'),
  ('Jezreel', 'Male'),
  ('Tony', 'Male'),
  ('Jason', 'Male');

-- ============================================
-- Seed: Missionaries (from prayer-request-2026.pdf)
-- ============================================

insert into missionaries (full_name, location) values
  ('Joel Marie Niepes', null),
  ('Edward Calibayan', null),
  ('Lomem Dela Cruz', null),
  ('Jessie Tingson', null),
  ('Ed Pamintuan', null),
  ('John Ryan Jadulco', null),
  ('Luis Yo Lane', null),
  ('Phaltua Thiangned', null),
  ('Joe Frank Gella', null),
  ('Marlon Dela Cruz', null),
  ('Jonito Coronel', null),
  ('Ron Camua', null),
  ('Marvin J. Lebria', null),
  ('John Mark Alisan', null),
  ('Benoit Junior', null),
  ('Tsegaye Wordofa', null),
  ('Norberto Corros', null),
  ('Phoebe Stella Giarua', null),
  ('Harvey Paguntalon', null),
  ('Julius Benjamin Peñas', null),
  ('Jenny Dangpilen', null),
  ('Harlly John Cataliño', null),
  ('Ricky Mabazza', null),
  ('Jiar Dela Rosa Villanueva', null),
  ('John Tran', null),
  ('Aguinaldo Angeles', null),
  ('Raymond Montero', null),
  ('Nonn Ratha', null),
  ('Joseph De Vera', null),
  ('Jude Pokopia', null),
  ('Jiphthael Fortin', null),
  ('Leo Ford Fellera', null),
  ('Jonas Paz', null),
  ('Gerald Magtangob', null),
  ('Marciano Gittabao', null),
  ('Mark Joseph Rebures', null),
  ('Emmanuel Sibug', 'Peru'),
  ('Braham Arizabal', null),
  ('Fred Mulenga Neymar Jr.', null),
  ('Bob Colon', null),
  ('Melody Ann Loro', null),
  ('Dan Lingcoran', null),
  ('Rodcelle Unay', null),
  ('Januario Montenegro', null),
  ('Richard Zimba', null),
  ('Raymundo Zacal', null),
  ('Pancho Galves', null),
  ('Kevinpet Ysula', null),
  ('Jonathan Latade', null),
  ('Vince Louie Callos', null),
  ('Allen Joshua Maravilla', null),
  ('Bee Chang', null),
  ('Rachel Ann Clavio', null),
  ('Ervie Bendoy', null),
  ('Adams Darko Addai', null);
