# Editorial Policy

## Primary principle

Authenticity takes priority over quantity. No religious content is invented, inferred, translated automatically, or published without identifiable provenance.

## Required fields for every published religious item

1. Original Arabic text where applicable.
2. Translation with named source and edition.
3. Source name and authoritative identifier.
4. Surah/Ayah number or Hadith collection/book/chapter/number.
5. Hadith grade with grader, grading source, edition, and notes where applicable.
6. Explanation with supporting references.
7. Reviewer identity and approval status.
8. License/attribution record.
9. Content version snapshot.

## Separation of evidence

The following must remain separate database entities:

- Quranic source text
- Hadith source text
- Translation
- Transliteration
- Scholarly interpretation
- Editorial explanation
- Scholarly opinions and differences

## Publishing workflow

```text
draft -> translated -> referenced -> reviewed -> approved -> published -> archived
```

Transition enforcement is server-side. UI buttons are never the control point.

Requirements:

- A translator cannot approve their own translation.
- A content editor cannot independently approve religious authenticity.
- Only authorized Research Reviewers may grant religious approval.
- Publication requires a version snapshot and administrator publish permission.
- Every transition creates an immutable audit record.

## Hadith rules

- No fabricated Hadith may be entered.
- A bare grade such as "Sahih" is never displayed without provenance.
- Grading is stored as grade, grader, grading source, edition, notes, and verification status.
- Disputed grading must be identified as disputed.

## Prophet stories

- Quranic evidence is clearly labeled.
- Reliable Hadith evidence is clearly labeled.
- Unverified historical details and Isra'iliyyat are not presented as established fact.
- Scholarly context is shown where relevant.

## Myth vs Fact

- Established facts, scholarly differences, and unresolved matters are distinguished.
- No disputed matter is presented as universally agreed.

## Corrections

Public correction submissions are evidence intake only. They never modify published content directly. Reviewer assignment, resolution notes, and audit history are required.
