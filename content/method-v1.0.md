# The Probity Method v1.0

*How we call FDA catalysts, and how we keep score.*

### What this is

A fixed, versioned procedure for predicting FDA catalyst outcomes. AdCom votes first, then PDUFAs, then readouts. Every brief runs the same 7 gates in the same order. Every gate is scored with cited evidence. The verdict is a probability, not a hot take. When we're wrong, we point to exactly which gate failed and fix it in the next version. That public error log is the product.

### The 7 gates (run in order)

**Gate 1: Efficacy.** Does it work?

- Drugs: did the trials hit their primary endpoints? Effect size? One trial or two? Clinical or surrogate endpoint?

- Diagnostics: clinical validity. When the test says positive, how often is disease actually there? Sensitivity *by stage* matters more than overall sensitivity.

**Gate 2: Safety.** What are the harms?

- Drugs: adverse events (severity, frequency, reversibility, boxed-warning risk).

- Diagnostics: the harms are the errors. False positives → invasive follow-ups, anxiety, cost, at population scale. False negatives → false reassurance, delayed care.

**Gate 3: Precedent.** What has FDA done before in this situation?

- First-of-kind products face a higher bar. Find the closest prior panel votes and final FDA decisions. **Weight committee-specific precedent heaviest** (which of the 33 committees is hearing this matters, since each has its own culture and voting patterns). If FDA broke precedent before, note exactly why. If there's no precedent, score it a Toss-up instead of guessing.

**Gate 4: Panel.** Who's voting?

- Roster, specialties, past votes, public statements, recusals, temporary members. A panel heavy on biostatisticians votes differently than one heavy on patient representatives.

**Gate 5: The tell.** What is the FDA worried about?

- Read the FDA briefing document's discussion questions FIRST, before any other gate, and re-read them last. The agency literally publishes its anxieties. If the questions cluster on safety, safety decides the vote. This gate outranks your own read of the data.

**Gate 6: Unmet need.** How badly is this wanted?

- No approved alternatives + serious disease + organized patient voice → regulators tolerate more uncertainty. Score the disease, not the drug.

**Gate 7: Commercial reality.** If it wins, does the world change?

- Payer coverage path, sponsor's ability to launch, real-world uptake. Low weight on the vote itself, high weight on what the call is *worth* to a subscriber.

### How the gates combine

Not all evidence is equal, so the gates aren't either. Each gate carries a weight set by how well it has predicted past outcomes: the gates that point the right way most often count the most. The weighted evidence produces one published probability rather than a bare yes or no, and when the evidence is balanced, the brief says it's a coin flip. If the FDA's own materials can't be read on a key question, confidence is capped no matter what the other gates say. The weights aren't fixed: after every event, each gate is graded on whether it pointed the right way, and the weights are re-set on what actually worked. Every brief stamps the method version that produced it.

### Analyst override

The analyst may override any gate score or the final probability, but must state *which* gate, changed from what to what, and *why*, in the published brief. Overrides are logged and graded like everything else. If overrides consistently beat the machine, the weights change.

### Calibration and versioning

- Every brief stamps its method version (v1.0).
- After each event: grade every gate (did it point the right way?). Log it.
- After 10 scored events: re-weight gates on what actually predicted outcomes. Ship v1.1 with a public changelog. The changelog is the moat.

### Diagnostics translation (debut: GRAIL Galleri PMA, Sep 23 2026)

Via the ACCE framework: Gate 1 → clinical validity (stage-by-stage sensitivity, specificity, cancer-signal-origin accuracy); Gate 2 → harms of misclassification at scale (PPV in a 50+ screening population, procedures per true positive); Gate 3 → has FDA ever approved a first-of-kind multi-cancer screening test (no; say so); Gate 5 → FDA's PMA questions, expect clinical-utility probing; Gate 6 → cancers with no screening today (Galleri's strongest card); Gate 7 → Medicare coverage gateway.
