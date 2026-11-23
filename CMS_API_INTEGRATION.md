# Modern CMS public API connection

This React app is the public Metrogarden website. Editors manage content in Modern CMS; the website reads published content from the CMS public API. It does not use the admin API or an admin access token.

## Local connection settings

Set these values in the ignored `.env.local` file and restart Vite:

```env
VITE_API_URL=https://cms-api.hanbeyoglu.com
VITE_CMS_PUBLIC_API_KEY=
VITE_CMS_TENANT_ID=
VITE_CMS_MALL_ID=
VITE_CMS_LOCALE=tr
```

Get the public key from the CMS Developer API settings, and copy the tenant and mall IDs for the Metrogarden location. The API key is intended for public websites; restrict its allowed domains in the CMS to the deployed site and local development host. Keep these values out of source control. Configure the API's CORS allowlist for the website origin too.

The app sends `x-api-key`, `x-tenant-id`, `x-mall-id`, `Accept: application/json`, and the currently selected `locale` (`tr` or `en`) with public requests. Store and cinema/session routes require a mall ID. If a required setting is missing or a request fails, the site falls back to local demo content.

## CMS routes used here

The base URL is the API origin; routes include `/public`:

| Route | Website use |
| --- | --- |
| `GET /public/site-config` | Mall identity, contact details, location, map coordinates |
| `GET /public/home` | Featured stores, active campaigns, upcoming events, today's movie sessions |
| `GET /public/sliders?placement=HOME&channel=WEB` | Homepage hero slides |
| `GET /public/stores?page=1&limit=100` | Store directory; all response pages are fetched |
| `GET /public/stores/:slug` | Store details |
| `GET /public/campaigns?page=1&limit=50` | Campaign directory; all response pages are fetched |
| `GET /public/campaigns/:slug` | Campaign details |
| `GET /public/events?page=1&limit=50` | Event list; all response pages are fetched |
| `GET /public/events/:slug` | Event details |
| `GET /public/movie-sessions?limit=200` | Cinema movies and current sessions |
| `GET /public/movie-sessions?date=YYYY-MM-DD&limit=200` | Sessions for a selected date |
| `GET /public/pages/:slug` | CMS page record adapter |

Public endpoints return `{ success: true, data, ... }`; list routes also return pagination metadata. The frontend unwraps the envelope, follows list pages, and maps the CMS's camelCase and media objects into this site's display types in `src/api/cmsAdapters.ts`.

The API currently has no public contact-form submission route. The contact page therefore opens an email draft to the address from `site-config`. About and legal pages read published CMS page records (`about`, `kvkk`, `privacy`, and `cookie-policy`) when present and retain their local layouts/content as a fallback.
