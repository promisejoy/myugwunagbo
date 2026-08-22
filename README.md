# Ugwunagbo service-pricing fix

## Files
- `ApplyForService.jsx` — user-facing service application; no hard-coded prices.
- `AdminPage.jsx` — existing admin functionality retained, with a more modern shell and corrected service-price response handling.
- `service.routes.js` — authoritative pricing is read from `service_prices`; submitted applications receive their price from the database.
- `client.js` — API client, retained with the service-price methods.
- `service_pricing_migration.sql` — required Supabase schema migration.

## Important
Run `service_pricing_migration.sql` in Supabase SQL Editor before deploying the backend.

Then replace:
- frontend/src/pages/ApplyForService.jsx
- frontend/src/pages/AdminPage.jsx
- frontend/src/api/client.js
- backend/routes/service.routes.js

The backend route assumes it is mounted at `/api/service-applications`.

There are intentionally NO hard-coded fallback prices. If an administrator has not configured a service, users are told that the service is unavailable for application until a price is configured.

The browser does not submit the authoritative amount. The backend looks it up from `service_prices` and saves a snapshot in `service_applications.service_price`.
