# Database Migrations with Alembic

This project uses Alembic for database migrations. This document explains how to use it.

## Prerequisites

1. Ensure your database is running and accessible
2. Environment variables are properly set (DATABASE_URL)
3. All required Python packages are installed (`pip install -r requirements.txt`)

## Basic Commands

### Creating a New Migration

To create a new migration file:

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "description of changes"

# Create empty migration file (manual)
alembic revision -m "description of changes"
```

### Running Migrations

To apply migrations to your database:

```bash
# Upgrade to latest migration
alembic upgrade head

# Upgrade to specific revision
alembic upgrade <revision_id>

# Upgrade by one version
alembic upgrade +1
```

### Checking Migration Status

```bash
# Show current migration status
alembic current

# Show migration history
alembic history

# Show what migrations would be run
alembic show <revision_id>
```

### Rolling Back Migrations

```bash
# Downgrade by one version
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade <revision_id>

# Downgrade to base (no migrations)
alembic downgrade base
```

## Important Notes

1. **Always review generated migrations** before running them, especially auto-generated ones
2. **Test migrations** on a copy of production data before applying to production
3. **Back up your database** before running migrations in production
4. **Never edit migration files** after they've been committed and shared with the team

## Project-Specific Setup

This project is configured for:
- **Async SQLModel/SQLAlchemy** with PostgreSQL
- **Environment variable** database URL configuration
- **Auto-generation** support for model changes

## Migration Workflow

1. Make changes to your models in `app/models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review the generated migration file
4. Test the migration on development database
5. Commit the migration file
6. Apply to production: `alembic upgrade head`

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL environment variable is set
- Check that database is running and accessible
- Verify connection string format

### Auto-generation Not Working
- Ensure all models are imported in `alembic/env.py`
- Check that `target_metadata = SQLModel.metadata` is set correctly
- Verify model changes are significant enough to detect

### Migration Conflicts
- Use `alembic merge` to combine conflicting migration branches
- Coordinate with team when multiple developers create migrations simultaneously

## Best Practices

1. **Descriptive names**: Use clear, descriptive migration names
2. **Small changes**: Keep migrations focused on single logical changes
3. **Data migrations**: Separate schema and data migrations when possible
4. **Testing**: Always test both upgrade and downgrade paths
5. **Documentation**: Add comments to complex migrations
