# POLITICA

### Understand Your Political Thinking.

**One world. Many ideologies. Discover the ideas and values that shape your political worldview.**

POLITICA is an independent, non-partisan political self-assessment platform designed to help individuals explore and reflect on their political beliefs across multiple dimensions.

Political beliefs rarely fit neatly into a single left-to-right spectrum. POLITICA approaches political thinking through seven dimensions, helping users understand their positions, mixed preferences and competing values.

🌐 **Live Website:** https://politica-ynnr.onrender.com/

---

## Overview

POLITICA provides an interactive assessment consisting of **35 questions** across seven dimensions of political thinking. The assessment takes approximately **10–15 minutes**.

Rather than asking users which political party they support, the platform explores their perspectives on economics, society, culture, democracy, governance, international outlook and personal values.

The objective is political self-understanding, not political persuasion.

## Seven Dimensions of Political Thinking

| No. | Dimension                 | What it explores                                         |
| --- | ------------------------- | -------------------------------------------------------- |
| 01  | Economic Philosophy       | Markets, taxation and welfare                            |
| 02  | Social Philosophy         | Freedom, equality and responsibilities                   |
| 03  | Cultural Outlook          | Tradition, cultural change and personal freedoms         |
| 04  | Democratic Values         | Dissent, accountability and democratic institutions      |
| 05  | Government & Liberty      | State power, individual rights and freedom               |
| 06  | National & Global Outlook | International cooperation, national identity and borders |
| 07  | Personal Principles       | Merit, justice and responsibility                        |

These dimensions are evaluated independently because individuals can hold different or competing positions across different areas of political thought.

## Features

### Interactive Landing Page

* Premium dark visual design.
* Animated dotted globe.
* Network connections and particle effects.
* Floating geometric elements.
* Cursor-responsive and scroll-based visual effects.
* Seven-dimension framework introduction.
* Dedicated Seven Dimensions information page.
* Reduced-motion accessibility support.

### Political Self-Assessment

* 35 assessment questions.
* Five-point agreement scale.
* One-question-at-a-time interface.
* Seven-dimensional scoring framework.
* Explicit scoring direction for each question.
* Question data separated from scoring and application logic.
* Automatic progress tracking.
* Resume assessment after refreshing the page.
* Restore completed results after refreshing.
* Clear saved answers and retake assessment options.

### Results and Interpretation

* Individual results across seven dimensions.
* Plain-language result summaries.
* Exploratory ideological similarities.
* Explanations showing the dimension scores and thresholds behind similarities.
* Balanced descriptions of different political tendencies.
* Printable assessment results.
* Copy answers with an accompanying AI-analysis prompt.

These similarities are exploratory comparisons, not definitive political identity labels.

### Privacy and Accessibility

* No account registration required.
* Assessment progress stored locally in the browser.
* Automatic deletion of saved progress after 30 days.
* No backend or database required.
* No automatic transmission of assessment answers to an AI service.
* Privacy warning before copying answers for external AI analysis.
* Keyboard accessibility and skip-to-content navigation.
* Responsive desktop and mobile layouts.
* Support for reduced-motion preferences.

## How It Works

**1. Answer**

Respond to 35 political statements using a five-point scale, from strongly disagree to strongly agree. Some questions include short scenarios.

**2. Explore**

Review your positions across seven dimensions and read explanations of what your answers suggest.

**3. Reflect**

Explore the similarities, mixed preferences and competing values in your answers. Political beliefs are complex and cannot always be represented through a single label.

## Technology Stack

POLITICA is a lightweight static web application built using:

| Technology         | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| HTML5              | Page structure and content                            |
| CSS3               | Responsive styling, animations and visual design      |
| Vanilla JavaScript | Assessment logic, scoring, rendering and interactions |
| Canvas API         | Animated globe and visual effects                     |
| localStorage       | Browser-based assessment progress                     |
| GitHub             | Source code management                                |
| Render             | Static website hosting                                |

The current version does not require a backend server, database, account system or external AI API.

## Project Structure

```text
politica/
│
├── index.html
├── assessment.html
├── seven-dimensions.html
├── README.md
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
    └── transition.js
```

### Main JavaScript Files

| File            | Responsibility                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `questions.js`  | Answer options, dimensions and all 35 questions, including their scoring directions            |
| `scoring.js`    | Question-data validation, assessment scoring, dimension calculations and result interpretation |
| `storage.js`    | Saving and restoring assessment progress using question IDs and localStorage                   |
| `render.js`     | Rendering assessment questions, progress and results                                           |
| `app.js`        | Assessment application state, navigation, result handling and export interactions              |
| `landing.js`    | Homepage interactions and saved-progress resume functionality                                  |
| `fx.js`         | Landing-page visual effects                                                                    |
| `globe.js`      | Animated globe                                                                                 |
| `transition.js` | Page transition effects                                                                        |

**Important:** Keep question IDs stable when editing `questions.js`. Saved answers are associated with question IDs, so changing or reusing IDs can affect previously saved progress.

## Running Locally

POLITICA requires no package installation or backend configuration.

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.

For more representative testing, serve the project through a local static HTTP server.

## Deployment

POLITICA is hosted on Render as a static website.

* **Repository:** https://github.com/hazimshakir/politica
* **Branch:** `main`
* **Live website:** https://politica-ynnr.onrender.com/

The website is deployed from the repository's root directory.

## Privacy

POLITICA currently does not require registration or collect assessment answers through a backend.

Assessment progress is stored locally in the user's browser using localStorage and automatically expires after 30 days.

Assessment answers are not automatically transmitted to a server or AI service.

If users choose to copy their answers and an AI-analysis prompt, they are responsible for deciding whether and where to share that information. Political views can be personal and sensitive, so users should exercise care when sharing them.

Users can clear their saved answers using the available control on the assessment page.

## Political Neutrality

POLITICA is designed as an independent, non-partisan educational project.

It:

* Does not endorse political parties or candidates.
* Does not recommend voting choices.
* Does not ask users to identify their party affiliation.
* Does not judge users for their political views.
* Does not assign a definitive political identity.
* Encourages independent thinking and critical reflection.

## Important Disclaimer

POLITICA is an experimental educational and self-reflection tool.

Its questionnaire is not scientifically validated. Results are descriptive and provisional, not a definitive assessment of someone's political identity.

Ideological similarities are illustrative comparisons based on the platform's experimental scoring framework. They should not be interpreted as proof that a person belongs to a particular political tradition.

POLITICA is not a scientific diagnosis, political recommendation or substitute for independent research.

## Future Development

Planned improvements include:

* More detailed explanations of the seven assessment dimensions.
* Improved result summaries and export options.
* Downloadable and shareable visual result cards.
* Optional AI-powered political analysis.
* Comparisons with historical and contemporary political leaders and thinkers based on documented political positions.
* Political philosophy and political science book recommendations.
* Explanations of ideological similarities and differences.
* An optional assessment-aware AI assistant.
* Multilingual support in English, Malayalam and Hindi.
* Further accessibility and interface improvements.

Future AI features will require a privacy-conscious architecture, secure API-key management and explicit user consent before transmitting assessment information to external services.

These are development goals and are not all available in the current version.

---

**POLITICA — Understand your political thinking.**

*One world. Many ideologies.*
