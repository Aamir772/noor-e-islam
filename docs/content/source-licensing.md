# Source and Licensing Management

## Registry requirements

Every source record must include:

- Source name
- Author or institution
- Publisher
- Edition
- Copyright holder
- License type
- Attribution requirements and exact attribution text
- Usage permissions
- Source URL or documentation
- Verification status

Verification status values: `UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`.

## Publication gate

A content item cannot publish when:

- Its source is missing or unverified.
- Its license record is missing or unverified.
- Attribution requirements are unresolved.
- Translation provenance is absent.
- Reviewer approval is absent.
- A version snapshot has not been created.

## Prohibited practices

- Scraping copyrighted translations without permission.
- Assuming publicly accessible text is free to redistribute.
- Copying commercial tafsir or Hadith translations without a license record.
- Replacing one translation with another silently.
- Publishing Quranic or Hadith text from an unidentified edition.

## Current state

The seed script inserts only a `Demonstration Placeholder` source and `Demonstration Only` license. Both are unverified and contain no religious text. No production source is approved yet.
