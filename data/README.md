# Phase 1–3: repository audit, research scope and data model

## Phase 1 — audit snapshot (4 November 2026)

- Application is a static HTML/CSS/vanilla-JavaScript site hosted on Render; no application backend or database is required for this data expansion.
- Assessment answers and progress remain in browser localStorage. The 35-question, seven-dimension assessment is intentionally out of scope for this change.
- Existing knowledge surfaces are `ideologies.html`, `thinkers-library.html`, `js/thinkers.js`, `js/thinkers-phase9.js`, and `js/library.js`.
- Existing thinker data contains provisional interpretations and some score mappings. This phase does not change, rescore or silently validate them.
- Existing navigation already links the ideology guide and library. New data is additive and can be wired into those surfaces in a later implementation phase.

## Phase 2 — research and editorial scope

This initial catalogue covers 27 international and Indian traditions/concepts. It is an educational index, not an exhaustive taxonomy. Entries state recurring ideas, internal debates and classification cautions. The research basis includes the Stanford Encyclopedia of Philosophy and Oxford/Cambridge academic publications; see `sources.json`.

### Exclusion rule

Standalone religion-centred ideological families are excluded at the user's direction. Religious history or context may be discussed within a person's biography or a movement's historical setting only where materially relevant. This does not exclude a thinker solely because they had a religious background. No religion-centred ideology category is created in this dataset.

### Editorial safeguards

- Distinguish ideology, political concept, movement, party, state and governing practice.
- Avoid treating a tradition as internally uniform or as a contemporary party recommendation.
- Distinguish an author's own writing from later movements claiming the author's legacy.
- Treat fascism as a historical authoritarian and ultranationalist tradition; describe violence and repression plainly.
- Treat populism as a contested cross-cutting concept, not a complete left/right ideology.
- Do not assign numerical ideological scores in the knowledge catalogue.
- Indian traditions are not presented as one homogeneous national school; caste, class, gender, region and colonial context matter.

## Phase 3 — data model

Files in this folder:

- `ideologies.json`: 27 structured ideology/tradition/concept records.
- `people.json`: person records linked to existing thinker profile IDs where known.
- `relationships.json`: typed person–tradition relationships; relationship descriptions preserve caveats.
- `sources.json`: source registry for academic and reference material.
- `schemas/`: JSON Schema contracts for ideology, person and relationship records.

IDs are stable kebab-case strings. Unknown information should be represented as null (where allowed), not guessed. Empty arrays mean no references are currently attached, not that no references exist. Relationship records are separate from person and ideology records so that a person can have multiple, changing or critical relationships with a tradition.

## Limitations and next steps

This is an initial research-backed catalogue, not peer-reviewed scholarship. Some Indian tradition entries need additional regionally grounded scholarship and primary-source citations before being treated as comprehensive. Person-to-ideology relationships are deliberately sparse and cautious. Next phase: render these records on the site, add tests for schema integrity and links, and review each source locator. Assessment scoring, saved answers and matching remain unchanged.
