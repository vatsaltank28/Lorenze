# Devereux Edits — what's still needed

All content is edited in `config.js`. Empty fields hide themselves on the site.

## Contact (blocking)
- [ ] WhatsApp number → `CONTACT.whatsapp` (digits with country code). Enables the WhatsApp button and estimator option.
- [ ] Email address → `CONTACT.email`. Enables the Email button and estimator option.

## Permissions (please confirm)
- [ ] Each channel owner is OK with their analytics screenshots being public (`CASE_STUDIES[].permission`). Two of them show revenue.
- [ ] SoulsLikeGamer, pabloNFFLS and FizzyRipz are OK being named (`TESTIMONIALS[].showName`).

## Content that would make case studies complete
For each case study: niche, channel name (if approved), the original challenge, Lorenzo's role, the editing strategy and the finished video.

## Media
- [ ] Long-form samples → `LONG_FORM` (mp4 in `assets/video` or a YouTube link). The section stays hidden until one exists.
- [ ] Genuine raw footage + its final edit for a before/after comparison → `BEFORE_AFTER` (component not built yet; hidden).
- [ ] Optional: a photo of Lorenzo for the "Who you'll work with" card.

## Pricing
- [ ] Any rules beyond the starting prices ($9.99 short / $29.99 long): rush fees, bulk or monthly rates → `ESTIMATOR.confirmedRules`. None are shown until confirmed.

## Analytics
- [ ] Choose a provider (Plausible, GA4 or GTM) if wanted. Events are already wired through `track()` in `app.js` and contain no personal data.

## How to add things
- **Short-form video:** put `name.mp4` and a `name.jpg` poster in `assets/video`, then add `V('cat', n, width, height, seconds)` under its category in `SHORT_FORM`.
- **Long-form video:** replace a `null` in `LONG_FORM` with the same `V(...)` entry or a YouTube object.
- **Case study / testimonial:** copy an existing object in `CASE_STUDIES` / `TESTIMONIALS` and fill only verified fields.
