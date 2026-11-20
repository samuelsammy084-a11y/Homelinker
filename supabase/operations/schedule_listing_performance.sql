-- Run after the migration as the database owner with Supabase Cron enabled.
-- Monday 08:00 SAST is 06:00 UTC. The named job can be reapplied safely.
select cron.schedule(
  'homelinker-weekly-listing-performance',
  '0 6 * * 1',
  'select public.send_weekly_listing_performance();'
);
