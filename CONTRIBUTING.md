# Contributing to POLITICA

Thanks for considering a contribution. POLITICA is a non-partisan educational self-reflection project. Contributions should improve clarity, accessibility, reliability or transparency without turning the project into a party or candidate recommendation service.

## Before you start

1. Search existing issues and pull requests to avoid duplicate work.
2. For substantial changes, open an issue first and describe the problem and proposed approach.
3. Keep pull requests focused. Explain what changed, why, and how you tested it.
4. Do not include personal political answers, private information, API keys or other secrets in issues, commits or screenshots.

## Local setup

Requirements: Python 3 for serving the static site; Node.js 20+ for the current test suite.

```bash
git clone https://github.com/hazimshakir/politica.git
cd politica
python -m http.server 8000
```

Open http://localhost:8000. To run the matching tests:

```bash
node tests/matching.test.js
```

No npm install or backend is currently required.

## Contribution guidelines

- Preserve political neutrality. Do not add party, candidate or voting recommendations.
- Do not present the questionnaire as scientifically validated.
- Keep the seven dimensions distinct; do not introduce a single left–right composite score without a documented methodological review.
- Treat thinker and book scores as interpretive estimates. Cite primary sources and exact locators where possible; use null when evidence does not support a score.
- Clearly label provisional or AI-assisted assessments. Never describe them as independent human reviews.
- Preserve privacy claims accurately. Assessment answers should remain local unless a future change is separately reviewed for consent, security and data minimisation.
- Keep the interface keyboard-accessible, responsive and respectful of reduced-motion preferences.
- Keep question IDs stable. Changing IDs can disconnect previously saved answers from their questions.

## Pull request checklist

- [ ] The change has a clear, limited purpose.
- [ ] I tested the relevant flow in a browser.
- [ ] `node tests/matching.test.js` passes, if matching/scoring data is affected.
- [ ] I checked responsive layout and keyboard use where relevant.
- [ ] I added or updated tests for changed behaviour.
- [ ] I did not add secrets, private data or unlicensed assets.
- [ ] I updated documentation when behaviour or setup changed.

## Issues and response expectations

Please provide reproducible steps, expected behaviour and actual behaviour. The maintainer aims to acknowledge actionable issues within 24 hours when available, but this is a best-effort target, not a guaranteed service level. Complex reports may take longer to investigate.

## Code of conduct

Be respectful, assume good faith, criticise ideas rather than people, and do not harass contributors for their political views. Disagreement is welcome; abuse and discriminatory conduct are not.
