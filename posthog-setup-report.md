<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js App Router portfolio. PostHog is now initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve reliability. A server-side client (`src/lib/posthog-server.ts`) handles event capture from Server Actions. Environment variables are stored in `.env.local`.

Sixteen events are tracked: visitor engagement events (contact form, CV download, LinkedIn click), admin authentication events (login funnel with identify), and content management events (project, experience, export/import operations). The admin is identified as `"portfolio_admin"` on the server side and via `posthog.identify()` on the client after OTP login. On sign-out, `posthog.reset()` is called to clear the session.

| Event | Description | File |
|---|---|---|
| `contact_form_submitted` | Visitor successfully sends a contact message | `src/components/forms/contact-form.tsx` |
| `resume_downloaded` | Visitor clicks the Download CV button | `src/components/hero.tsx` |
| `linkedin_profile_viewed` | Visitor clicks the LinkedIn icon on the profile card | `src/components/hero.tsx` |
| `dashboard_access_requested` | Admin triggers the auth popup via the secret key | `src/components/forms/contact-form.tsx` |
| `dashboard_login_succeeded` | Admin successfully verifies the OTP code | `src/components/forms/contact-form.tsx` |
| `dashboard_login_failed` | OTP code verification fails during admin login | `src/components/forms/contact-form.tsx` |
| `signed_out` | Admin ends their session | `src/components/dashboard/signout-card.tsx` |
| `contact_message_sent` | Server confirms contact message was emailed (server-side) | `src/actions/contact-action.ts` |
| `project_added` | Admin adds a new portfolio project (server-side) | `src/actions/project-action.ts` |
| `project_updated` | Admin updates an existing portfolio project (server-side) | `src/actions/project-action.ts` |
| `project_deleted` | Admin deletes a portfolio project (server-side) | `src/actions/project-action.ts` |
| `experience_added` | Admin adds a new work experience entry (server-side) | `src/actions/experience-action.ts` |
| `experience_updated` | Admin updates a work experience entry (server-side) | `src/actions/experience-action.ts` |
| `experience_deleted` | Admin deletes a work experience entry (server-side) | `src/actions/experience-action.ts` |
| `data_exported` | Admin exports all portfolio data as JSON (server-side) | `src/actions/export-action.ts` |
| `data_imported` | Admin imports portfolio data from JSON (server-side) | `src/actions/import-action.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/200015/dashboard/742373)
- [Contact Form Submissions](https://eu.posthog.com/project/200015/insights/59UqXq4h) — Daily contact form submission trend
- [CV Downloads](https://eu.posthog.com/project/200015/insights/ARUl5w1F) — Daily resume download trend
- [Admin Login Funnel](https://eu.posthog.com/project/200015/insights/oxlZ3RPD) — Conversion: access requested → login succeeded
- [Visitor Engagement Overview](https://eu.posthog.com/project/200015/insights/NcMNH7Qj) — Contact submissions + CV downloads side by side
- [Portfolio Content Changes](https://eu.posthog.com/project/200015/insights/z3vKKE12) — Weekly breakdown of project add/update/delete activity

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
