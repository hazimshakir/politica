# POLITICA — Project Handover

**Repository:** https://github.com/hazimshakir/politica
**Branch:** `main`
**Live website:** https://politica-ynnr.onrender.com/
**Hosting:** Render Static Site
**Last updated:** November 2026

---

## 1. Project Overview

POLITICA — Understand Your Political Thinking — is an independent, non-partisan political self-assessment platform.

It helps users explore their political beliefs across seven dimensions rather than reducing their worldview to a single left-to-right spectrum.

The assessment contains 35 questions and takes approximately 10–15 minutes.

### Core principles

* Political neutrality.
* No party or candidate recommendations.
* No definitive political identity labels.
* Transparent and explainable scoring.
* Privacy-first, browser-based assessment.
* No backend or database in the current version.

---

## 2. Current Deployment Status

The following pages are deployed:

| Page                    | Purpose                             |
| ----------------------- | ----------------------------------- |
| `index.html`            | Homepage and landing experience     |
| `assessment.html`       | Interactive political assessment    |
| `seven-dimensions.html` | Explanation of the seven dimensions |

All three pages have been deployed and their basic navigation and styling checked by the project owner.

### SEO status

* Google Search Console ownership verified.
* `robots.txt` deployed.
* `sitemap.xml` submitted successfully.
* Canonical URLs configured.
* Title and description metadata updated.
* Open Graph and Twitter metadata configured.
* Structured data added.
* Homepage indexing confirmed previously.
* Assessment and seven-dimensions indexing requests submitted.

Search indexing and ranking are subject to Google's crawling and indexing decisions.

---

## 3. Completed Development Phases

### Phase 1 — Assessment Reliability and Privacy

Completed and deployed.

Changes:

* Explicit scoring direction for every question.
* Removed fragile index-based scoring direction calculations.
* Preserved existing scoring behaviour.
* Renamed "AI-style interpretation" to "Summary of your answers".
* Added a privacy warning before copying answers and an AI-analysis prompt.
* Added confirmation before copying potentially sensitive political answers.

Existing localStorage persistence and 30-day expiry were retained.

### Phase 2 — Question Data Architecture

Completed and deployed.

Changes:

* Created `js/questions.js`.
* Moved answer options, dimensions and all 35 questions into a dedicated data file.
* Each question contains an ID, dimension, scoring direction, text and optional scenario.
* Updated scoring to consume the question data.
* Added question-data validation.
* Changed saved-answer association from question position to question ID.
* Preserved compatibility with older saved progress.
* Made progress maximum dynamic.

The original questions, answer options, dimensions and scoring outcomes were preserved.

### Phase 3 — Part 1: Results and Ideological Similarities

Completed and deployed.

Changes:

* Added a `finished` flag to saved assessment data.
* Restores completed results after refreshing.
* Clears the completion state when restarting or starting over.
* Preserves the existing 30-day expiry.
* Renamed the results section to "Themes in your answers".
* Added an explanation that similarities are exploratory, not identity labels.
* Added dimension scores and triggering thresholds to theme explanations.
* Moved theme thresholds into named constants in `scoring.js`.
* Improved balance between left- and right-oriented descriptions.

A syntax check and smoke test were performed by Claude. Full browser testing was not performed by Claude; the project owner completed manual deployment checks.

---

## 4. Current Architecture

POLITICA is a static website using HTML5, CSS3 and Vanilla JavaScript.

It does not currently use React, Next.js, Vue, a backend server or a database.

### Project structure

```text
politica/
│
├── index.html
├── assessment.html
├── seven-dimensions.html
├── README.md
├── PROJECT_HANDOVER.md
├── robots.txt
├── sitemap.xml
│
├── assets/
│   ├── favicon.svg
│   └── og-image.png
│
├── css/
│   ├── base.css
│   ├── landing.css
│   ├── assessment.css
│   └── article.css
│
└── js/
    ├── questions.js
    ├── scoring.js
    ├── storage.js
    ├── render.js
    ├── app.js
    ├── landing.js
    ├── fx.js
    ├── globe.js
    ├── transition.js
    └── arrive.js
```

Verify actual filenames before making structural changes.

### JavaScript responsibilities

| File            | Responsibility                                                             |
| --------------- | -------------------------------------------------------------------------- |
| `questions.js`  | Question data, answer options, dimensions and scoring directions           |
| `scoring.js`    | Data validation, scoring, dimension calculations and result interpretation |
| `storage.js`    | localStorage persistence, restoration and 30-day expiry                    |
| `render.js`     | Assessment interface and results rendering                                 |
| `app.js`        | Assessment state, navigation, result handling and export interactions      |
| `landing.js`    | Homepage interactions and saved-progress resume                            |
| `fx.js`         | Landing-page particle and visual effects                                   |
| `globe.js`      | Animated globe                                                             |
| `transition.js` | Page transition effects                                                    |
| `arrive.js`     | Assessment arrival transition                                              |

### Important implementation rules

1. Load `questions.js` before `scoring.js`.
2. Keep script dependencies in their existing order.
3. Do not change question IDs casually; saved answers depend on stable IDs.
4. Keep scoring direction explicit in question data.
5. Preserve the existing public function and data interfaces used by other JavaScript files.
6. Do not duplicate question data in multiple files.
7. Keep progress restoration and the 30-day expiry intact.

---

## 5. Assessment Framework

The seven dimensions are:

1. Economic Philosophy
2. Social Philosophy
3. Cultural Outlook
4. Democratic Values
5. Government & Liberty
6. National & Global Outlook
7. Personal Principles

The questionnaire uses a five-point agreement scale.

The assessment is experimental and non-validated. Its scores and ideological similarities are descriptive and provisional.

No political party or voting recommendations are provided.

---

## 6. Privacy and Data Handling

Current architecture:

* No account registration.
* No backend database.
* No automatic AI calls.
* Assessment progress stored in browser localStorage.
* Saved progress expires after 30 days.
* Users can clear saved answers.
* Copying answers for external AI analysis requires a warning and confirmation.

Political views are potentially sensitive personal information.

Any future external AI integration must:

* Obtain explicit user consent.
* Explain exactly what information is transmitted.
* Protect API keys using server-side environment variables.
* Avoid unnecessary retention of political profiles.
* Preserve a usable non-AI assessment experience.

Never expose API keys in frontend JavaScript.

---

## 7. Current Known Limitations

* The questionnaire is not scientifically validated.
* Ideological similarities are experimental comparisons, not proven classifications.
* The current system does not use an external AI model.
* Refreshing completed results is supported through the saved completion flag.
* Some static homepage text, such as the question count, may need manual updating if the questionnaire changes.
* Older index-based saved answers rely on the original question order for compatibility.

Do not claim that untested features work without verifying them.

---

## 8. Development Roadmap

### Phase 3 — Part 2: Results and Export Improvements

Pending.

* Add plain-language explanations for all seven dimensions.
* Explain the meaning of both ends of each scale.
* Explain central scores.
* Add privacy information to JSON exports and print views.
* Add export version and date.
* Add a "Copy summary (text only)" option that excludes raw answers.

### Phase 4: AI-Powered Political Analysis

Planned.

* Optional AI analysis of seven-dimensional results.
* Explain dominant tendencies and mixed views.
* Identify similarities with historical and contemporary political thinkers.
* Explain similarities and differences using documented positions.
* Recommend relevant political philosophy and political science books.
* Include contrasting ideological perspectives.
* Explain why each recommendation is relevant.

Before implementation, design a secure backend or serverless architecture.

Do not expose API keys or transmit political data without explicit consent.

### Phase 5: Shareable Result Cards

Planned.

* Generate visual result cards using Canvas.
* Include all seven dimensions.
* Allow PNG downloads.
* Keep generation local to the browser.

### Phase 6: UI and Accessibility

Planned.

* Refine question transitions.
* Improve keyboard focus indicators.
* Improve result-bar visualisation.
* Review dark-mode support.
* Respect reduced-motion preferences.
* Improve mobile accessibility.

### Phase 7: Multilingual Support

Planned.

* English.
* Malayalam.
* Hindi.

Translations must preserve political neutrality and the original meaning of assessment questions.

---

## 9. Development Workflow and Constraints

The project owner primarily uses GitHub's web interface and ZIP uploads for deployment.

Follow this workflow:

1. Work on one development phase at a time.
2. Inspect the latest project files before editing.
3. Preserve the existing website architecture.
4. Avoid unnecessary redesigns or unrelated changes.
5. Provide only modified and newly created files in a ZIP.
6. Preserve the original folder structure.
7. Provide exact GitHub upload instructions.
8. Explain how to verify the Render deployment.
9. Include a short manual testing checklist.
10. Never commit, push or deploy without explicit permission.

### Claude usage constraints

The project owner has limited Claude usage.

* Use minimal tokens.
* Inspect only relevant files.
* Avoid repeated audits.
* Avoid unnecessary terminal commands and extensive testing.
* Complete related changes in one focused pass.
* Keep explanations concise.
* Do not inspect the entire repository repeatedly.

---

## 10. Instructions for the Next Development Session

The next planned task is:

**Phase 3 — Part 2: Results Explanation and Export Improvements.**

Start from the latest deployed project files, including all completed Phase 1, Phase 2 and Phase 3 Part 1 changes.

Do not redo completed work.

Do not begin the AI integration until its architecture, privacy implications and hosting requirements have been reviewed.

---

**POLITICA — Understand Your Political Thinking.**

*One world. Many ideologies.*
