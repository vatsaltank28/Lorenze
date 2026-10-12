/* ==========================================================================
   DEVEREUX EDITS — SITE CONFIGURATION
   Every piece of content on the site lives here. Edit this file only.
   Rule: never fill a field with a guess. Leave it null / '' and the site
   hides that part automatically. See CLIENT_CHECKLIST.md for what's missing.
   ========================================================================== */

/* ---------- Contact ----------
   whatsapp: digits only incl. country code, e.g. '17165551234'  (not supplied yet)
   email:    e.g. 'hello@devereuxedits.com'                     (not supplied yet) */
const CONTACT = {
  discord: 'lorenzo_devereux',
  whatsapp: '',
  email: '',
  tiktok: 'https://www.tiktok.com/@devereux_digital_hub',
  facebook: 'https://www.facebook.com/share/1M8XFMZTkR/?mibextid=wwXIfr',
  domain: 'devereuxedits.com',
};

/* ---------- Working hours (PDF) — rendered timezone-aware, DST handled by Intl ---------- */
const HOURS = {
  timeZone: 'America/New_York',
  start: 7,                  // 7 AM
  end: 22,                   // 10 PM
  workDays: [1, 2, 3, 4, 5], // Mon–Fri (no editing on weekends; bookings still accepted)
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
  niches: ['Roblox', 'Minecraft', 'Other gaming', 'Podcast / interview', 'Ranking videos', 'Commercial / product ad', 'Other'],
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
};
/* Long-form: replace a null with V('long', 1, 1920, 1080, 600) (file in assets/video)
   or { id:'yt-1', src:'https://youtu.be/XXXXXXXXXXX', poster:'assets/video/long-1.jpg', w:1920, h:1080, dur:600 }.
   The long-form section stays hidden while every entry is null. */
const LONG_FORM = [null, null, null];

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
    id: 'subs-11k', title: 'Subscriber surge', niche: null, client: null,
    img: 'assets/img/win-4.jpg', wide: true, platform: 'YouTube',
    metric: { value: '+11.8K', unit: 'subscribers', definition: 'YouTube Studio net subscribers', period: '28 days · Sep 1 – Sep 28, 2026' },
    extra: [['1.68M', 'views (shown as 16.8L)'], ['+620%', 'watch time vs previous 28 days'], ['$681.91', 'estimated revenue']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
  {
    id: 'tiktok-321k', title: 'Single TikTok edit', niche: null, client: null,
    img: 'assets/img/win-1.jpg', wide: false, platform: 'TikTok',
    metric: { value: '321.6K', unit: 'video views', definition: 'TikTok Studio “Video views” for one post', period: 'At time of screenshot (chart spans the first ~38 hours)' },
    extra: [['27.64%', 'watched the full video'], ['30.2s', 'average watch time'], ['+362', 'new followers']],
    challenge: null, contribution: null, strategy: null, video: null, testimonial: null, permission: true,
  },
];

/* ---------- Testimonials — quotes are verbatim from the supplied Discord screenshots ----------
   showName:false replaces the handle with "Client" (confirm each person is happy to be named). */
const TESTIMONIALS = [
  { img: 'assets/img/fb-2.jpg', quote: 'Your edits are breathtaking', name: 'SoulsLikeGamer', showName: true, context: 'Discord DM' },
  { img: 'assets/img/fb-1.jpg', quote: 'Looks good bro. Already better then the previous video', name: 'pabloNFFLS', showName: true, context: 'Discord DM · feedback on a work-in-progress edit' },
  { img: 'assets/img/fb-3.jpg', quote: 'Thank you … Later today ill add all socials to my yt', name: 'FizzyRipz', showName: true, context: 'Discord DM' },
];

const NICHES = ['Roblox', 'Grow a Garden', 'Minecraft', 'Steal a Brainrot', 'Podcasts', 'Ranking Videos', 'Gaming YouTube', 'Product Ads', 'TikTok', 'YouTube Shorts'];

/* ---------- FAQ (PDF) ---------- */
const FAQ = [
  ["What is Devereux Edits?", "Devereux Edits is a premium one-person video editing studio focused on high-retention YouTube content. I specialize in gaming and creator videos, with every edit built for watch time, audience retention, and long-term channel growth."],
  ["Do you edit Roblox and Minecraft videos?", "Yes. Gaming is my core focus. I edit Roblox content (including trending titles like Grow a Garden and Steal a Brainrot), Minecraft videos, and gaming YouTube channels of all sizes — both long form and short form."],
  ["How much do you charge?", "Short-form videos start from $9.99 and long-form videos start from $29.99. Final pricing depends on video length, complexity, and edit style. Send me your channel and requirements for a detailed quote."],
  ["Do you work on a monthly contract basis?", "Yes. Message me to book a free 15-minute call so we can design the right monthly setup for your channel."],
  ["Do you do test edits or free samples?", "For bulk and monthly orders I offer a paid sample first. I don't provide free samples due to limited availability. You can review my existing work above to see the quality and style in each niche."],
  ["How do I know you're legit?", "I'm verified with both a verified role and verified service role across major Discord editing servers. You can also review my work, client results, and testimonials on this page."],
  ["How do payments work?", "Payment is upfront. You can pay via card, PayPal, bank transfer, crypto, or Remitly. For first-time orders, we can also run the project through a protected platform if preferred."],
  ["What's your refund policy?", "Once work has started, refunds are not available unless I cancel the project. Revisions are unlimited, so we continue until you're fully satisfied with the final video."],
  ["How many revisions do I get?", "Unlimited. I revise until the video matches your vision and performs for your audience."],
  ["What is your usual turnaround time?", "Standard YouTube videos are typically delivered in 2 to 3 business days. More complex projects may take longer — I'll always confirm the exact timeline before starting. I keep a limited client roster to protect quality and deadlines."],
  ["How fast do you reply?", "I work 7 AM to 10 PM New York time and usually reply within 10 minutes, depending on the platform. For the fastest response, message me on WhatsApp or Discord. You can book services on weekends, but I don't edit on weekends."],
  ["How can I order?", "Send me a brief of what you need via Discord, WhatsApp, or email. Include details about your channel and the video, and I'll reply with a quote and next steps."],
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
  { slug: 'commercial-ad-editing', title: 'Commercial & Product Ad Editing', cats: ['Commercials & Ads'], faq: [2, 6, 8, 9], enabled: true,
    intro: 'Product ads and commercials driven by motion graphics and animated copy.' },
  { slug: 'long-form-youtube-editing', title: 'Long-form YouTube Editing', cats: [], faq: [0, 2, 3, 9], enabled: false,
    intro: 'Unpublished until long-form samples are added to LONG_FORM.' },
];

/* ---------- Analytics ----------
   No provider is installed. If Plausible / GA4 / GTM is added to the page later,
   events are forwarded automatically. No names, contacts or brief text are ever sent. */
const ANALYTICS = { enabled: true, debug: false };
