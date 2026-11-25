# Backup and Recovery

## Objectives

- Protect published content, editorial audit history, user accounts, and donation records.
- Preserve point-in-time recoverability.
- Verify restores before relying on backups.

## Required backups

| Data | Method | Frequency |
|---|---|---|
| PostgreSQL | `pg_dump` or managed provider snapshot | Daily |
| PostgreSQL WAL | Provider continuous archiving | Continuous |
| Uploaded assets | Object storage versioning | Continuous |
| Configuration | Encrypted repository | On change |
| Secrets | Secret manager versioning | On change |

## Backup command

```powershell
pg_dump "$env:DATABASE_URL" --format=custom --file=noor-e-islam.backup
```

Store the backup encrypted in a location separate from the database host.

## Restore drill

1. Create an isolated PostgreSQL instance.
2. Restore the latest backup:

```powershell
pg_restore --clean --if-exists --dbname="$env:RESTORE_DATABASE_URL" noor-e-islam.backup
```

3. Apply migrations:

```powershell
$env:DATABASE_URL = $env:RESTORE_DATABASE_URL
npm run prisma:migrate:deploy
```

4. Verify:
   - Published content counts match the source database.
   - Audit log entries are intact.
   - Users can authenticate.
   - Search indexes return expected results.
   - Donation records reconcile with provider reports.

5. Record the drill result, duration, and issues.

## Retention

- Daily backups: 14 days.
- Weekly backups: 8 weeks.
- Monthly backups: 12 months.
- Delete backups according to the privacy policy and legal requirements.

## Failure handling

- Treat a failed backup as a high-severity incident.
- Never delete the last known-good backup during a restore attempt.
- Restrict restore permissions to a dedicated operations role.
- Log every restore operation.
