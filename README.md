# POLITICA

Explore your political beliefs across seven dimensions with POLITICA, a free, non-partisan self-reflection tool.

**Run locally (proposed):** `git clone https://github.com/hazimshakir/politica.git && cd politica && python -m http.server 8000`

<!-- Add a 5–10 second demo GIF here -->

[![Tests](https://github.com/hazimshakir/politica/actions/workflows/tests.yml/badge.svg)](https://github.com/hazimshakir/politica/actions/workflows/tests.yml)

[**Try the live assessment →**](https://politica-ynnr.onrender.com/assessment.html) · [Website](https://politica-ynnr.onrender.com/) · [Report a bug](https://github.com/hazimshakir/politica/issues/new?template=bug_report.yml)

POLITICA is an experimental educational project. It is not scientifically validated and does not recommend parties, candidates or votes.

## What it does

- 35 statements across seven dimensions: economic philosophy, social philosophy, cultural outlook, democratic values, government and liberty, national and global outlook, and personal principles.
- A five-point response scale and separate dimension scores.
- Explanations of results and exploratory comparisons with political thinkers and books.
- Progress saved in your browser, with a 30-day expiry; no account required.
- Printable results and text/JSON export options.

**Privacy:** assessment answers are stored in browser `localStorage`. The app has no backend and does not automatically transmit answers to an AI service. If you choose to copy or share your results elsewhere, you decide where that information goes.

## Try it

The easiest way is the [live website](https://politica-ynnr.onrender.com/).

### Run locally

Requirements: Python 3 (for the built-in static server) and a modern browser. No npm install or backend is needed.

```bash
git clone https://github.com/hazimshakir/politica.git
cd politica
python -m http.server 8000
```

Open http://localhost:8000 in your browser. On systems where the command is named `python3`, use `python3 -m http.server 8000`.

### Run the tests

Requirements: Node.js 20 or later. The current dependency-free matching test suite can be run with:

```bash
node tests/matching.test.js
```

## Seven dimensions

| Dimension | Focus |
|---|---|
| Economic Philosophy | Markets, taxation and welfare |
| Social Philosophy | Freedom, equality and responsibilities |
| Cultural Outlook | Tradition, cultural change and personal freedoms |
| Democratic Values | Dissent, accountability and democratic institutions |
| Government & Liberty | State power, individual rights and freedom |
| National & Global Outlook | International cooperation, national identity and borders |
| Personal Principles | Merit, justice and responsibility |

The dimensions are evaluated independently. A mixed profile is not a problem to be corrected, and POLITICA does not assign one definitive political identity.

## Project structure

```text
politica/
├── index.html
├── assessment.html
├── seven-dimensions.html
├── assets/
├── css/
├── js/
│   ├── questions.js
│   ├── scoring.js
│   ├── storage.js
│   ├── thinkers.js
│   ├── books.js
│   ├── matching.js
│   ├── render.js
│   ├── app.js
│   ├── landing.js
│   ├── fx.js
│   ├── globe.js
│   ├── transition.js
│   └── arrive.js
├── tests/
│   └── matching.test.js
└── .github/
    └── workflows/
```

Keep question IDs stable when editing `js/questions.js`: saved answers are associated with those IDs.

## Technology

HTML5, CSS3, vanilla JavaScript, Canvas API and browser `localStorage`. The current app is static and does not require a database, account system or external AI API.

## Contributing

Bug reports, accessibility feedback, careful wording improvements and test contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Please keep changes non-partisan and evidence-conscious.

## Political neutrality and limitations

- POLITICA does not endorse parties or candidates or recommend voting choices.
- Thinker and book comparisons are interpretive, provisional estimates—not claims about a user's identity or proof of agreement.
- Some historical figures' views changed over time; the data may use phases or leave dimensions unscored where evidence is insufficient.
- The questionnaire and scoring framework have not undergone scientific validation or independent psychometric testing.
- Do not use results as a substitute for reading primary sources or for consequential decisions.

## Privacy and sensitive information

Political opinions can be sensitive. The assessment runs in your browser and saves progress locally for up to 30 days. Clear saved answers using the control in the assessment. Do not post screenshots or exports containing personal information unless you intend to share them.

## Deployment

The public demo is hosted as a static site on Render and is deployed from the `main` branch. Hosting availability is separate from the source code; if the demo is unavailable, you can run the project locally using the instructions above.

## License

Original source code is made available under the MIT License. See [LICENSE](LICENSE). Third-party materials, if any, remain subject to their own terms and notices.
