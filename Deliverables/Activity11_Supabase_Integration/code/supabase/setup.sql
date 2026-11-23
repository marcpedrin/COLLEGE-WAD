-- Activity 11: tables + sample data for the IPL ticket booking app
create table if not exists matches (
  id bigint generated always as identity primary key,
  team1 text not null,
  team2 text not null,
  match_date text not null,
  venue text not null,
  price integer not null,
  available_seats integer not null check (available_seats >= 0)
);

create table if not exists bookings (
  id bigint generated always as identity primary key,
  match_id bigint references matches(id),
  customer_name text not null,
  email text not null,
  tickets integer not null check (tickets between 1 and 10),
  total_amount integer not null,
  created_at timestamptz default now()
);

insert into matches (team1, team2, match_date, venue, price, available_seats) values
  ('CSK', 'MI',  '28 Mar 2026, 7:30 PM', 'Chennai',   800, 120),
  ('RCB', 'KKR', '29 Mar 2026, 7:30 PM', 'Bengaluru', 900, 95),
  ('MI',  'SRH', '30 Mar 2026, 3:30 PM', 'Mumbai',    850, 140),
  ('KKR', 'CSK', '31 Mar 2026, 7:30 PM', 'Kolkata',   750, 80);

-- row level security: let the publishable (anon) key read matches,
-- add bookings and update seats (demo app, no login)
alter table matches enable row level security;
alter table bookings enable row level security;

create policy "anyone can read matches"  on matches  for select using (true);
create policy "anyone can update seats"  on matches  for update using (true) with check (true);
create policy "anyone can add bookings"  on bookings for insert with check (true);
create policy "anyone can read bookings" on bookings for select using (true);

-- expose the tables to the Data API for the publishable key
grant usage on schema public to anon;
grant select, update on matches to anon;
grant select, insert on bookings to anon;

-- realtime: broadcast changes on these tables to subscribed clients
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table bookings;
