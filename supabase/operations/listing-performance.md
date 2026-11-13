# Listing performance rollout

1. Apply `20261112_listing_performance.sql` to staging. Confirm the deployed database uses the same property ID, owner ID, favourites, conversations and notification columns as the application.
2. With two staging accounts, open an active listing as a visitor with analytics accepted, save it and start an enquiry. Check the listing owner's report, and confirm the second account cannot read it.
3. Run `select public.send_weekly_listing_performance();` twice on staging. Confirm there is one in-app report per eligible owner for the previous South African calendar week. Use fixture accounts only for this check.
4. Apply the migration to production and deploy the app. Enable Supabase Cron if needed, then run `schedule_listing_performance.sql` as the database owner. Check the named job and its first run result in Supabase.

Views count consenting browsers once per listing per South African day. Returning on a different day counts another view. Signed-in owners are excluded. New favourites count each saver at most once per listing per week. Current favourites are a snapshot. Enquiries count distinct buyers who opened a HomeLinker conversation that week. The report excludes off-platform contact. Historical views and new favourites are unavailable before tracking begins. The weekly job retains nine calendar weeks of tracking records.

The weekly report is an in-app notification. It runs on Mondays at 08:00 SAST and links to the owner dashboard. To pause delivery, run `select cron.unschedule('homelinker-weekly-listing-performance');` as the database owner.
