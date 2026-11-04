# POLITICA

**Explore political ideas. Understand your own positions. Think beyond party labels.**

POLITICA is a free, non-partisan political self-assessment and learning website. It helps users reflect on their views across seven political dimensions, explore political thinkers and books, and learn about political ideologies and traditions.

- **Live website:** https://politica-ynnr.onrender.com/
- **Start the assessment:** https://politica-ynnr.onrender.com/assessment.html
- **Thinkers & Library:** https://politica-ynnr.onrender.com/thinkers-library.html
- **Political Ideologies:** https://politica-ynnr.onrender.com/ideologies.html
- **Source repository:** https://github.com/hazimshakir/politica

[![Tests](https://github.com/hazimshakir/politica/actions/workflows/tests.yml/badge.svg)](https://github.com/hazimshakir/politica/actions/workflows/tests.yml)

> **Important:** POLITICA is an experimental educational and self-reflection project. Its questionnaire, scoring and thinker comparisons are not scientifically or psychometrically validated. Results are provisional and must not be treated as a definitive political identity, party recommendation or voting recommendation.

## Features

### Political self-assessment

- 35 statements across seven dimensions.
- Five-point response scale and separate dimension results.
- Explanations designed to help users interpret mixed or nuanced positions.
- Keyboard navigation: use the arrow keys to move between answer choices and Enter to continue when an answer is selected.
- Progress is saved locally in the browser, with a 30-day expiry; no account is required.
- Results can be printed or exported as text/JSON.

### Results and discovery

- Evidence-gated comparisons with political thinker profiles.
- A diversified shortlist to reduce repetitive recommendations.
- Additional rotating discovery suggestions from the wider collection.
- Discovery suggestions are explicitly exploratory; they are not presented as measured similarity matches.
- Profiles or dimensions without sufficient evidence are left unscored rather than assigned invented values.

### Thinkers & Library

- A browsable collection of political thinkers and political leaders.
- Biographical context, portraits where available, and related reading.
- Book-cover lookups use Open Library where available, with a designed fallback when a cover cannot be retrieved.
- Missing portraits use an initials fallback rather than leaving an empty image area.
- The collection is an educational starting point, not an exhaustive or definitive canon.

### Political Ideologies

- A structured catalogue of **27 international and Indian political traditions, ideologies and concepts**.
- Searchable catalogue with regional filters and individual detail pages.
- Entries cover recurring ideas, internal debates, classification cautions and linked references.
- The catalogue avoids numerical ideological scores.
- Standalone religion-centred ideological families are excluded from the catalogue by editorial scope. Religious context may still appear in a biography or historical explanation when relevant.

## The seven assessment dimensions

| Dimension | Focus |
|---|---|
| Economic Philosophy | Markets, taxation, welfare and economic organisation |
| Social Philosophy | Freedom, equality and social responsibilities |
| Cultural Outlook | Tradition, cultural change and personal freedoms |
| Democratic Values | Dissent, accountability and democratic institutions |
| Government & Liberty | State power, individual rights and freedom |
| National & Global Outlook | International cooperation, national identity and borders |
| Personal Principles | Merit, justice and responsibility |

The dimensions are considered independently. A mixed profile is not a problem to be corrected, and the assessment does not force every user into one political label.

## Privacy and local data

- Assessment answers and progress are stored in the browser's `localStorage`; the app does not require an account or application backend.
- Saved assessment progress expires after 30 days. Expired or invalid saved data is cleared when the assessment is next opened.
- The assessment's temporary discovery-rotation history is stored in `sessionStorage`.
- The reset/retake action clears both saved assessment progress and the session discovery history.
- The application does not automatically transmit assessment answers to an AI service. If you copy, export or share your results elsewhere, you choose where that information goes.

Political opinions can be sensitive. Avoid sharing screenshots or exports containing personal information unless you intend to disclose it.

## Run locally

The site is a static HTML/CSS/JavaScript application. No application server, database, npm build step or API key is required to run the core site.

**Requirements:** Python 3 and a modern browser.

```bash
git clone https://github.com/hazimshakir/politica.git
cd politica
python -m http.server 8000
```

Open http://localhost:8000. On systems where the command is named `python3`, run `python3 -m http.server 8000`.

## Tests and quality checks

**Requirements for local test suites:** Node.js 22 (the CI workflow uses Node.js 22).

Run the dependency-free test suites:

```bash
node tests/matching.test.js
node tests/site-integrity.test.cjs
```

The browser smoke suite uses Playwright and Chromium. It runs in GitHub Actions and exercises key browser journeys, including:

- Assessment keyboard navigation and answer progression.
- Ideology catalogue loading, search and detail-page navigation.
- Thinkers & Library search, including the Kautilya profile.
- Checks that excluded profiles do not reappear in the catalogue.

The GitHub Actions workflow runs three jobs on pushes and pull requests targeting `main`:

1. **Matching test suite** — checks the assessment matching logic.
2. **Static site integrity** — checks sitemap paths, page metadata/canonical references and catalogue integrity.
3. **Browser smoke test** — checks selected end-to-end journeys in Chromium.

The automated tests provide regression coverage; they do not replace a full manual review of the live deployment, factual content, accessibility or cross-device behaviour.

## Project structure

```text
politica/
├── .github/
│   └── workflows/
│       └── tests.yml
├── assets/                 # Portraits and other static assets
├── css/                    # Site, assessment and catalogue styles
├── data/
│   ├── ideologies.json     # 27 ideology/tradition/concept records
│   ├── people.json         # Person registry
│   ├── relationships.json  # Person–tradition relationships
│   ├── sources.json        # Academic and reference sources
│   ├── schemas/            # JSON Schema contracts
│   └── README.md           # Data model, scope and editorial safeguards
├── js/                     # Assessment, scoring, matching and page logic
├── tests/
│   ├── matching.test.js
│   ├── site-integrity.test.cjs
│   └── browser.smoke.cjs
├── index.html
├── assessment.html
├── seven-dimensions.html
├── thinkers-library.html
├── ideologies.html
├── ideology.html
├── sitemap.xml
└── robots.txt
```

Keep question IDs stable when editing the assessment question data: saved answers are associated with those IDs.

## Technology

- HTML5 and CSS3
- Vanilla JavaScript
- Browser `localStorage` and `sessionStorage`
- Canvas API for selected visual elements
- JSON data files for the ideology knowledge catalogue
- Node.js for automated tests
- Playwright and Chromium for browser smoke tests
- Render static-site hosting

The core application is static and does not require a database, account system or external AI API.

## Research, neutrality and limitations

- POLITICA does not endorse political parties or candidates and does not recommend voting choices.
- Thinker comparisons are interpretive and provisional. They are not proof that a user agrees with a thinker or belongs to an ideology.
- A person's views may have changed over time; profiles may distinguish historical periods or leave dimensions unscored where evidence is insufficient.
- Political traditions are internally diverse. The catalogue distinguishes ideologies, concepts, movements, parties, states and governing practices rather than treating them as interchangeable.
- The Indian political tradition entries are not presented as one homogeneous national school. Caste, class, gender, region and colonial context matter.
- The ideology catalogue is an initial research-backed educational index, not an exhaustive taxonomy or peer-reviewed publication. Some entries require further regionally grounded scholarship and primary-source research.
- Do not use assessment results as a substitute for reading primary sources or for consequential political decisions.

See [data/README.md](data/README.md) for the catalogue's data model, source approach, editorial safeguards and known limitations.

## Accessibility and security safeguards

The assessment includes keyboard controls, accessible labels and live announcements for relevant state changes. Results can receive keyboard focus after completion. Dynamic assessment content is escaped before rendering, saved-progress expiry is validated, and catalogue/source links are restricted to HTTPS.

These safeguards reduce common risks but should not be interpreted as a formal accessibility certification, security audit or penetration test.

## Deployment

The public site is hosted on Render as a static website and is configured to deploy from the `main` branch. The source of truth is the GitHub repository. A successful merge or CI run does not, by itself, prove that the latest version has finished deploying or that every feature works on the public site.

If the hosted demo is unavailable, run the project locally using the instructions above.

## Contributing

Bug reports, accessibility feedback, careful wording improvements, research references and test contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Keep contributions non-partisan, evidence-conscious and transparent about uncertainty.

For security-related concerns, see [SECURITY.md](SECURITY.md).

## License

Original source code is made available under the MIT License. See [LICENSE](LICENSE). Third-party images, books, references and other materials remain subject to their respective licences, copyright and usage terms.
