# Devereux Edits — handover & what's still needed

## Change contact details (no coding needed)
Edit `config.js` → `CONTACT` and redeploy. Every button, footer link and estimator option updates.
- WhatsApp number → `CONTACT.whatsapp` (digits incl. country code, e.g. `16827938815`)
- Email → `CONTACT.email` · Discord → `CONTACT.discordId` (opens discord.com/users/<id>)
- X/Twitter → `CONTACT.twitter` (full URL) · Facebook → `CONTACT.facebook`
- Empty fields are hidden automatically. Availability text → `AVAILABILITY`.

## Website messages ("Send from website" in the estimator)
Briefs are emailed to devereuxedits.01@gmail.com by `api/contact.js` (Vercel function, via Resend).
Setup: create a free account at resend.com **using devereuxedits.01@gmail.com**, create an API key, then in
Vercel → Project → Settings → Environment Variables add `RESEND_API_KEY` (secret) and redeploy.
Optional: `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (needs a verified domain in Resend).
Until the key is set, the site tells visitors to use WhatsApp instead; nothing is silently lost.
Reply to a brief by contacting the person on the method/handle shown in the email.

## Hosting
Live at https://devereux.vercel.app/ (Vercel). To give Lorenzo access: Vercel → Project → Settings →
Members (invite), or transfer the project to his own Vercel account. Updates deploy by pushing to the
connected Git repo (or `vercel --prod`). Never share the `RESEND_API_KEY` value.

## Still needed from Lorenzo
- [ ] X/Twitter profile URL
- [x] Replacement analytics screenshot → win-5.jpg (geography card)
- [ ] Extra channel-win and client-feedback screenshots he mentioned
- [x] Long-form videos: 9 web copies in assets/video/long-1..9 (~340 MB). Consider unlisted YouTube links later to save Vercel bandwidth.
- [ ] Confirm channel owners are OK with public analytics / being named
- [ ] fb-5.jpg shows a Google Drive folder link — confirm OK to show publicly (or blur it)
