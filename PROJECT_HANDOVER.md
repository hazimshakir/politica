# POLITICA — Project handover (end of Phase 3)

Repo: github.com/hazimshakir/politica (main) · Live: https://politica-ynnr.onrender.com (Render static site, root)

## Status
- Phase 1 (two-page architecture, shared saved progress): live.
- Phase 2 (premium landing page, globe, SEO tags): uploaded and working live (confirmed by owner).
- Phase 3 (cinematic transition + dark assessment redesign): built and tested locally; ZIP delivered; **NOT yet confirmed uploaded or live**.
- Claude's reads of GitHub/Render were cached in-chat and are not reliable; owner's live checklist is the source of truth.

## Phase 3 — what changed (files)
New: `js/transition.js`, `js/arrive.js`, `PROJECT_HANDOVER.md`
Modified: `index.html` (loads transition.js), `assessment.html` (dark theme body class, arrival overlay, head script, arrive.js), `css/base.css` (overlay styles, scroll-padding), `css/assessment.css` (dark theme inside `@media screen`, question animations, pips), `js/app.js` (slide direction + animation hooks), `js/render.js` (section pips), `js/globe.js` (pause/resume events)
Unchanged: `js/scoring.js`, `js/storage.js`, `js/landing.js`, `js/fx.js`, `css/landing.css`, all questions and scoring.

## Behaviour
- "Begin assessment" (all 4 CTAs) plays a ~1.5 s overlay (network sweep, globe emblem draws on, POLITICA wordmark), then opens assessment.html, which fades the same overlay away (~2.5 s total including load).
- Skipped (normal link): reduced motion, data-saver, Ctrl/Cmd/Shift/Alt-click, middle click, JavaScript off. Any key or click during the overlay skips ahead. Browser Back removes the overlay and resumes the globe.
- Assessment page: dark theme (screen only; printed report unchanged and verified pixel-identical), serif question text, mint selected state, animated progress bar, sidebar pips, question content slides in on Continue/Back/section jump (not when choosing an answer).

## Tests performed (headless Chromium, local)
- Phase 3 suite: 36 checks (overlay timing 33 ms, canvas drawn, navigation ~1.5 s, arrival fade, skip key, Ctrl+click new tab, all 4 CTAs, Back button, saved progress through transition, reduced motion, no-JS, animation classes, mobile 390 px, print inputs, contrast) — ALL PASS.
- Phase 1 regression suite: 33 checks (keyboard-only 35 questions, cross-page progress, tampered/blocked storage, behaviour) — ALL PASS, rerun after final CSS polish.
- Landing suite: all pass. Printed report: 3 pages, identical to verified version.
- Not tested: Safari/Firefox, real phones, real screen readers, live Render site.
- Test-harness lessons: popup URL starts as about:blank (wait for URL); `.tx.arrival` exists on assessment page; start the local server from the project root.

## Deployment status
ZIP delivered (changed files only). GitHub commit: not confirmed. Render deploy: not confirmed. After upload delete unused `css/style.css` if still present.

## Remaining / known issues
- README outdated; privacy text must change when AI is added.
- A -100 score draws an empty bar (use centred marker in dashboard redesign).
- Results headings level (h1 then h3); JS smooth scroll ignores reduced-motion.
- No robots.txt / sitemap.xml yet (Phase 5). og-image is ~540 KB (optimise later).
- Assessment quality issues (see next section).

## FUTURE PHASE — ASSESSMENT QUESTION REDESIGN (owner requirement; do NOT build during other phases)
1. Rewrite all questions in a standardised, professionally designed format.
2. Neutral, clear, unbiased wording; each question measures ONE belief or position.
3. Avoid double-barrelled, confusing or leading items; balanced representation of ideological perspectives.
4. Consistent five-point agreement scale.
5. Add an answer option: **"Not familiar enough to judge"**. It must NOT be treated as neutral/middle; it is EXCLUDED from the relevant scoring calculation; it must not distort classification; results must show reduced confidence when too few answers remain; users must be able to tell lack of knowledge from genuine neutrality.
6. Review reverse-keyed items, scoring balance (known acquiescence bias: all-Agree => centre-left; most dimensions have 4/5 items keyed the same way), mis-keyed items (Social Q1, Culture Q4, Liberty Q1), unscored Values Q3/Q5, asymmetric headline labels, and the reliability limits of the assessment. Do not change weights arbitrarily; document every change.
7. Saved-progress format will need a version bump when the question set changes.

## Roadmap
Phase 4 classification (left … right bands with confidence, evidence from answers) — depends on the question redesign above; Phase 5 SEO files + Search Console; Phase 6+ Express backend, consent, AI report, curated knowledge base (thinkers, books), chatbot, EN/ML/HI, PDF/share.

## Decisions / constraints
No political flags, party logos or symbols (final). Globe is dotted land only, no borders. Neutral, non-partisan; no voting advice; consent before sending answers to any AI provider; API keys only in Render environment; free AI pools (FreeLLMAPI, OmniRoute) were unconfigured and are Claude-side tools, not usable by a Render backend; test data only on free tiers. GitHub web interface + ZIP uploads; one phase at a time.
