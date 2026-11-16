# IQ Create website

A responsive, multi-page TypeScript + React + Vite website for IQ Create, a PromptIQ creative production house.

## Pages

1. **Home** — positioning, services overview, audience use cases, interactive monthly production estimator.
2. **What we create** — films, series, soap operas, podcasts, advertising, music videos, animation, documentaries and digital content.
3. **Our work** — visual direction / moodboard page. The current imagery is illustrative and is explicitly not represented as client work.
4. **How it works** — inquiry, scoping, production, review and delivery process.
5. **Contact** — inquiry form, quote handoff from the estimator, click-to-call and WhatsApp.
6. **Privacy** and **Terms** — starter legal pages that should be reviewed before launch.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase connection

The frontend connects to the existing shared IQ Supabase project using its public project URL and publishable/anon key. It only writes to a new isolated table called `public.iq_create_inquiries`.

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` to the existing IQ Supabase project URL.
3. Set `VITE_SUPABASE_ANON_KEY` to that project's publishable/anon key (or legacy anon key).
4. Run `supabase/migrations/202611160001_iq_create_inquiries.sql` against the existing project using the Supabase SQL Editor or your migration workflow.
5. Do not put a `service_role` key in a `VITE_` variable or anywhere in the browser bundle.

The migration enables RLS, explicitly grants INSERT to `anon` and `authenticated`, and provides an insert-only policy. Public visitors cannot select or read submitted inquiries. Read and manage leads through a trusted admin environment or a server-side Edge Function with server-only credentials.

The form intentionally fails with a clear WhatsApp fallback if Supabase environment variables are missing. It does not silently pretend that an inquiry was saved.

## Vercel deployment

- Import this folder/repository into Vercel.
- Framework preset: **Vite**.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and optionally `VITE_WHATSAPP_NUMBER` in Vercel Project Settings → Environment Variables.
- Redeploy after adding or changing environment variables.

Vercel's Vite SPA fallback normally handles client-side routes. If deep links return 404 in your project configuration, add a `vercel.json` rewrite (included in this project).

## Quote estimator

The estimator is a planning aid, not a binding quote. It calculates finished minutes from episodes per week × minutes per episode × production weeks per month. It applies editable-in-code indicative rates by content category. Update the `rates` map in `src/components/Estimator.tsx` after IQ Create finalises its pricing policy. Complexity, creative requirements, revisions and delivery expectations should be confirmed manually before a final quotation.

## Before launch

- Replace illustrative image references with approved IQ Create portfolio stills and ensure you have rights to use them.
- Review the indicative rate model and quote language.
- Review the Privacy Policy and Terms with appropriate legal advice.
- Consider adding CAPTCHA / Turnstile and server-side rate limiting or an Edge Function before exposing the public form widely. The honeypot in the current form is only a basic spam deterrent.
- Add an authenticated internal lead-management screen or use a protected backend workflow to view and update inquiries. This public website deliberately has no admin view.
