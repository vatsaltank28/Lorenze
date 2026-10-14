/* ==========================================================================
   DEVEREUX EDITS — SITE CONFIGURATION
   Every piece of content on the site lives here. Edit this file only.
   Rule: never fill a field with a guess. Leave it null / '' and the site
   hides that part automatically. See CLIENT_CHECKLIST.md for what's missing.
   ========================================================================== */

/* ---------- Contact ----------
   THE ONLY PLACE contact details live. Change a value here and every button,
   footer link and estimator option on the site updates automatically.
   Leave a field '' and its button is hidden (never shown as a dead link).
   whatsapp:  digits only incl. country code — builds https://wa.me/<digits>
   discordId: numeric Discord user ID — opens https://discord.com/users/<id>
   twitter:   full profile URL, e.g. 'https://x.com/yourhandle'  (NOT supplied yet)
   facebook:  full profile/page URL */
const CONTACT = {
  discord: 'lorenzo_devereux',          // username shown on the site
  discordId: '1323213896240205845',
  whatsapp: '16827938815',
  email: 'devereuxedits.01@gmail.com',
  twitter: '',
  tiktok: 'https://www.tiktok.com/@devereux_digital_hub',
  facebook: 'https://www.facebook.com/share/1M8XFMZTkR/?mibextid=wwXIfr',
  domain: 'devereuxedits.com',
};

/* ---------- Availability (client-provided claim — edit freely) ---------- */
const AVAILABILITY = {
  label: 'Online 24/7',
  typicalReply: '~10 minutes', // an estimate, not a guarantee
};

/* ---------- Pricing (PDF) — starting references only ---------- */
const PRICING = {
  currency: 'USD',
  shortFrom: 9.99,
  longFrom: 29.99,
  note: 'Final pricing depends on video length, complexity and edit style.',
};

/* ---------- Estimator rules ----------
   Only the starting prices above are confirmed. No rush fees, discounts or
   package prices exist — add them here only once Lorenzo confirms them. */
const ESTIMATOR = {
  niches: ['Roblox', 'Minecraft', 'Other gaming', 'Podcast / interview', 'Ranking videos', 'Commercial / product ad', 'UGC', 'Other'],
  requirements: ['Captions', 'Sound design / SFX', 'Motion graphics', 'Transitions', 'Colour correction'],
  maxVideos: 100,
  confirmedRules: [], // e.g. { label: 'Rush (24h)', perVideo: 5 } — leave empty until confirmed
};

/* ---------- Video library ---------- */
const V = (cat, n, w, h, dur) => ({ id: `${cat}-${n}`, src: `assets/video/${cat}-${n}.mp4`, poster: `assets/video/${cat}-${n}.jpg`, w, h, dur });
const SHORT_FORM = {
  'Roblox':              [V('roblox', 1, 1920, 1080, 22), V('roblox', 2, 720, 960, 43)],
  'Minecraft':           [V('minecraft', 1, 2560, 1080, 18), V('minecraft', 2, 1080, 1080, 61), V('minecraft', 3, 576, 1024, 42)],
  'Other Games':         [V('gaming', 1, 1920, 1080, 23), V('gaming', 2, 2340, 1080, 41)],
  'Podcast & Interview': [V('podcast', 1, 576, 1024, 11), V('podcast', 2, 1280, 720, 37), V('podcast', 3, 576, 1024, 62)],
  'Ranking Videos':      [V('ranking', 1, 576, 1024, 33), V('ranking', 2, 576, 1024, 60), V('ranking', 3, 576, 1024, 42)],
  'Commercials & Ads':   [V('ads', 1, 1280, 720, 19), V('ads', 2, 1906, 1080, 24), V('ads', 3, 1280, 720, 31)],
  'UGC':                 [V('ugc', 1, 576, 1024, 17), V('ugc', 2, 270, 480, 21), V('ugc', 3, 270, 480, 20)],
};
/* Long-form: web-optimised H.264 copies in assets/video (originals untouched in "Long Forms-…").
   Grouped by heading. To stream one from YouTube instead of the hosted file (saves bandwidth and helps slow
   phones), add the link: { ...V('long', 3, 852, 480, 1589), yt: 'https://youtu.be/XXXXXXXXXXX' }.
   Add V('long', n, width, height, seconds) or a YouTube object
   { id:'yt-1', src:'https://youtu.be/XXXXXXXXXXX', poster:'assets/video/long-1.jpg', w:1920, h:1080, dur:600 }. */
const LONG_FORM = {
  'Commentary & Storytelling': [V('long', 1, 262, 480, 147), V('long', 2, 1280, 960, 363), V('long', 3, 852, 480, 1589), V('long', 4, 1280, 720, 1850)],
  'Gaming': [V('long', 5, 1024, 576, 277), V('long', 6, 576, 1024, 201), V('long', 7, 576, 1024, 424), V('long', 8, 576, 1024, 297), V('long', 9, 576, 1024, 302)],
};

/* ---------- Featured work ----------
   Descriptions only state what is visible in each video — no invented clients or results. */
const FEATURED = [
  { video: 'minecraft-1', niche: 'Minecraft', format: '21:9 widescreen', style: ['Cinematic', 'Widescreen'], desc: 'A cinematic, widescreen Minecraft sequence built around sweeping aerial shots.' },
  { video: 'podcast-3', niche: 'Podcast & Interview', format: '9:16 vertical', style: ['Captions', 'Vertical cut'], desc: 'A vertical interview clip with bold on-screen captions, cut for Shorts and Reels.' },
  { video: 'ranking-1', niche: 'Ranking Videos', format: '9:16 vertical', style: ['Title card', 'Numbered list'], desc: 'A top-5 ranking short with a title card and a numbered list that fills in as it plays.' },
  { video: 'ads-2', niche: 'Commercials & Ads', format: '16:9 landscape', style: ['Motion graphics', 'Kinetic type'], desc: 'A product ad driven by animated copy and motion graphics.' },
  { video: 'gaming-1', niche: 'Other Games', format: '16:9 landscape', style: ['Cinematic', 'Gameplay'], desc: 'A cinematic gameplay edit with a dark, atmospheric grade.' },
];

/* ---------- Before / after ----------
   Only add a pair when you have the genuine raw footage AND its finished edit.
   The section is hidden from the public while this list is empty
   (add ?dev to the URL to see the development placeholder).
   { title, raw:'assets/video/ba-1-raw.mp4', final:'assets/video/ba-1-final.mp4',
     poster:'assets/video/ba-1-final.jpg', w:1080, h:1920,
     notes:['Hook', 'Pacing', 'Captions', 'Sound design'] } */
const BEFORE_AFTER = [];

/* ---------- Case studies ----------
   Metrics are copied from the supplied analytics screenshots; periods are read from them.
   Fields left null are hidden. Fill challenge / contribution / strategy / video / testimonial
   only with information Lorenzo confirms. permission:false hides a case study entirely.
   (Currently true because the screenshots were supplied for the site — confirm with each channel.) */
const CASE_STUDIES = [
  {
    id: 'channel-17m', title: 'Shorts channel takes off', niche: null, client: null,
    img: 'assets/img/win-7.jpg', wide: true, platform: 'YouTube',
    metric: { value: '17M', unit: 'views', definition: 'YouTube Studio channel views — 15.4M more than usual', period: '28 days · Aug 9 – Sep 5, 2026' },
    extra: [['43.7K', 'watch hours'], ['+2.4K', 'subscribers'], ['$354', 'estimated revenue']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
  {
    id: 'week-7m', title: 'One week, 7.9M views', niche: null, client: null,
    img: 'assets/img/win-8.jpg', wide: true, platform: 'YouTube',
    metric: { value: '7.9M', unit: 'views in 7 days', definition: 'YouTube Studio channel views', period: '7 days · Aug 29 – Sep 4, 2026' },
    extra: [['29.3K', 'watch hours'], ['+2.3K', 'subscribers'], ['$1,001', 'estimated revenue']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
  {
    id: 'channel-3m', title: 'Revenue switched on', niche: null, client: null,
    img: 'assets/img/win-6.jpg', wide: true, platform: 'YouTube',
    metric: { value: '3.5M', unit: 'views', definition: 'YouTube Studio channel views — 779.9K more than usual', period: '28 days · Aug 4 – Aug 31, 2026' },
    extra: [['13.2K', 'watch hours'], ['+1.3K', 'subscribers'], ['>999%', 'revenue vs previous 28 days']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
  {
    id: 'shorts-10m', title: 'Shorts channel breakout', niche: null, client: null,
    img: 'assets/img/win-2.jpg', wide: false, platform: 'YouTube Shorts',
    metric: { value: '10.4M', unit: 'engaged views', definition: 'YouTube Studio “Engaged views from Shorts”', period: '28 days · Sep 12 – Oct 9, 2026' },
    extra: [['+29,600%', 'vs previous 28 days']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
  {
    id: 'channel-12m', title: 'Channel-wide growth month', niche: null, client: null,
    img: 'assets/img/win-3.jpg', wide: true, platform: 'YouTube',
    metric: { value: '12.3M', unit: 'views', definition: 'YouTube Studio channel views', period: '28 days · Aug 29 – Sep 25, 2026' },
    extra: [['43.9K', 'watch hours'], ['+3.6K', 'subscribers'], ['$1,455', 'estimated revenue']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
  {
    id: 'geo-us', title: 'Audience geography', niche: null, client: null,
    img: 'assets/img/win-5.jpg', wide: true, platform: 'YouTube',
    metric: { value: '60.5%', unit: 'of views from the US', definition: 'YouTube Studio “Geography” — views by country', period: 'Last 28 days (dates not shown in screenshot)' },
    extra: [['5.0%', 'United Kingdom'], ['4.4%', 'Canada']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
];

/* ---------- Testimonials — quotes are verbatim from the supplied Discord screenshots ----------
   showName:false replaces the handle with "Client" (confirm each person is happy to be named). */
const TESTIMONIALS = [
  { img: 'assets/img/fb-2.jpg', quote: 'Your edits are breathtaking', name: 'SoulsLikeGamer', showName: true, context: 'Discord DM' },
  { img: 'assets/img/fb-1.jpg', quote: 'Looks good bro. Already better then the previous video', name: 'pabloNFFLS', showName: true, context: 'Discord DM · feedback on a work-in-progress edit' },
  { img: 'assets/img/fb-6.jpg', quote: 'Video looks good bro', name: 'pabloNFFLS', showName: true, context: 'Discord DM · after delivery' },
  { img: 'assets/img/fb-3.jpg', quote: 'Thank you … Later today ill add all socials to my yt', name: 'FizzyRipz', showName: true, context: 'Discord DM' },
];

/* ---------- Creators worked with (from "Devereux Edits website Workflow 2") ----------
   title = channel name, avatar = official YouTube profile picture (assets/img/creators),
   subs = public subscriber count as of Oct 2026 (null hides it). Add/remove entries freely. */
const CREATORS = [
  { title: 'Lynix', name: 'lynix', subs: '1.64M', avatar: 'assets/img/creators/lynix.jpg', url: 'https://youtube.com/@lynix' },
  { title: 'ROBLOX GAMING 1M', name: 'robloxgaming1m-y5i', subs: '109K', avatar: 'assets/img/creators/robloxgaming1m-y5i.jpg', url: 'https://youtube.com/@robloxgaming1m-y5i' },
  { title: 'Minecraft Moments', name: 'minecraftmomentsfr', subs: '52.1K', avatar: 'assets/img/creators/minecraftmomentsfr.jpg', url: 'https://youtube.com/@minecraftmomentsfr' },
  { title: 'Rank It Shorts', name: 'rank-it-shorts', subs: '34.2K', avatar: 'assets/img/creators/rank-it-shorts.jpg', url: 'https://youtube.com/@rank-it-shorts' },
  { title: 'Form Roblox', name: 'robloxform', subs: null, avatar: 'assets/img/creators/robloxform.jpg', url: 'https://youtube.com/@robloxform' },
  { title: 'Funny Ranking Shorts', name: 'funnyrankingshort_kk', subs: null, avatar: 'assets/img/creators/funnyrankingshort_kk.jpg', url: 'https://youtube.com/@funnyrankingshort_kk' },
];

const NICHES = ['Roblox', 'Commentary', 'UGC', 'Brands & Businesses', 'Grow a Garden', 'Minecraft', 'Steal a Brainrot', 'Podcasts', 'Ranking Videos', 'Gaming YouTube', 'Product Ads', 'TikTok', 'YouTube Shorts'];

/* ---------- FAQ (PDF) ---------- */
const FAQ = [
  ["What is Devereux Edits?", "Devereux Edits is a video-editing agency for YouTubers, content creators, gaming channels, Roblox, Minecraft, ranking, commentary, UGC, brands, businesses and service providers. Every edit is built for watch time and audience retention."],
  ["Do you edit Roblox and Minecraft videos?", "Yes. Gaming is my core focus. I edit Roblox content (including trending titles like Grow a Garden and Steal a Brainrot), Minecraft videos, and gaming YouTube channels of all sizes — both long form and short form."],
  ["How much do you charge?", "Short-form videos start from $9.99 and long-form videos start from $29.99. Final pricing depends on video length, complexity, and edit style. Send me your channel and requirements for a detailed quote."],
  ["Do you work on a monthly contract basis?", "Yes. Message me to book a free 15-minute call so we can design the right monthly setup for your channel."],
  ["Do you do test edits or free samples?", "For bulk and monthly orders I offer a paid sample first. I don't provide free samples due to limited availability. You can review my existing work above to see the quality and style in each niche."],
  ["How do I know you're legit?", "I'm verified with both a verified role and verified service role across major Discord editing servers. You can also review my work, client results, and testimonials on this page."],
  ["How do payments work?", "Payment is upfront. You can pay via card, PayPal, bank transfer, crypto, or Remitly. For first-time orders, we can also run the project through a protected platform if preferred."],
  ["What's your refund policy?", "Once work has started, refunds are not available unless I cancel the project. Revisions are unlimited, so we continue until you're fully satisfied with the final video."],
  ["How many revisions do I get?", "Unlimited. I revise until the video matches your vision and performs for your audience."],
  ["What is your usual turnaround time?", "Standard YouTube videos are typically delivered in 2 to 3 business days. More complex projects may take longer — I'll always confirm the exact timeline before starting."],
  ["How fast do you reply?", "We're online 24/7 and usually reply within about 10 minutes, depending on the platform. For the fastest response, message us on WhatsApp or Discord."],
  ["How can I order?", "Use the project estimator on this page, or send a brief via WhatsApp, Discord or email. Include details about your channel and the video, and I'll reply with a quote and next steps."],
];

/* ---------- Niche pages (generated into /work by build_niches.py) ----------
   faq: indexes into FAQ above. enabled:false keeps a page unpublished. */
const NICHE_PAGES = [
  { slug: 'roblox-video-editing', title: 'Roblox Video Editing', cats: ['Roblox'], faq: [1, 2, 9, 10], enabled: true,
    intro: 'Gaming is my core focus. I edit Roblox content — including trending titles like Grow a Garden and Steal a Brainrot — for channels of all sizes, long form and short form.' },
  { slug: 'minecraft-video-editing', title: 'Minecraft Video Editing', cats: ['Minecraft'], faq: [1, 2, 9, 10], enabled: true,
    intro: 'Minecraft edits built for watch time — from cinematic widescreen sequences to vertical Shorts.' },
  { slug: 'gaming-shorts-editing', title: 'Gaming Shorts Editing', cats: ['Roblox', 'Minecraft', 'Other Games'], faq: [1, 2, 4, 9], enabled: true,
    intro: 'Short-form gaming edits for YouTube Shorts and TikTok across Roblox, Minecraft and other titles.' },
  { slug: 'podcast-interview-editing', title: 'Podcast & Interview Clip Editing', cats: ['Podcast & Interview'], faq: [2, 8, 9, 11], enabled: true,
    intro: 'Vertical and landscape clips from podcasts and interviews, captioned for scrolling audiences.' },
  { slug: 'ranking-video-editing', title: 'Ranking Video Editing', cats: ['Ranking Videos'], faq: [2, 8, 9, 11], enabled: true,
    intro: 'Top-5 style ranking shorts with title cards and numbered lists that build toward number one.' },
  { slug: 'ugc-video-editing', title: 'UGC Video Editing', cats: ['UGC'], faq: [2, 8, 9, 11], enabled: true,
    intro: 'Vertical UGC edits for brands — fast hooks, clean captions and pacing built for paid and organic social.' },
  { slug: 'commercial-ad-editing', title: 'Commercial & Product Ad Editing', cats: ['Commercials & Ads'], faq: [2, 6, 8, 9], enabled: true,
    intro: 'Product ads and commercials driven by motion graphics and animated copy.' },
  { slug: 'long-form-youtube-editing', title: 'Long-form YouTube Editing', cats: [], faq: [0, 2, 3, 9], enabled: false,
    intro: 'Unpublished until long-form samples are added to LONG_FORM.' },
];

/* ---------- Analytics ----------
   No provider is installed. If Plausible / GA4 / GTM is added to the page later,
   events are forwarded automatically. No names, contacts or brief text are ever sent. */
const ANALYTICS = { enabled: true, debug: false };
