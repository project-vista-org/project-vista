# Pre-commit Setup Guide

This project uses pre-commit hooks to ensure consistent code formatting across all contributors. The setup automatically formats and lint your code before each commit, preventing style inconsistencies.

## 🚀 Quick Setup

Run the setup script to install all required dependencies and pre-commit hooks:

```bash
./scripts/setup-pre-commit.sh
```

## 📋 What's Included

### Python Backend (apps/backend/)
- **Black**: Code formatter with 88-character line length
- **isort**: Import statement sorter (configured to work with Black)
- **flake8**: Linter for code quality and style

### TypeScript/React Frontend (apps/frontend/)
- **Prettier**: Code formatter for consistent style
- **ESLint**: Linter for code quality and best practices

### General Checks
- Trailing whitespace removal
- End-of-file newline enforcement
- YAML/JSON/TOML validation
- Large file detection
- Merge conflict detection
- Case conflict detection
- Debug statement detection

## 🔧 Manual Usage

### Format Code Manually

**Frontend (TypeScript/React):**
```bash
npm run format                    # Format all frontend files
npm run format:check             # Check formatting without changing files
```

**Backend (Python):**
```bash
cd apps/backend
black .                          # Format Python files
isort .                          # Sort imports
flake8 .                         # Lint Python files
```

**All files:**
```bash
npm run pre-commit:run           # Run all pre-commit checks on all files
```

### Skip Pre-commit Hooks (Emergency Only)

If you need to bypass pre-commit hooks in an emergency:

```bash
git commit --no-verify -m "Emergency commit"
```

⚠️ **Warning**: Only use this for true emergencies. Regular commits should always go through the formatting process.

## 📁 Configuration Files

- `.pre-commit-config.yaml`: Main pre-commit configuration
- `apps/frontend/.prettierrc`: Prettier configuration for frontend
- `apps/backend/pyproject.toml`: Black and isort configuration for backend

## 🎯 Style Guidelines

### Python (Backend)
- Line length: 88 characters (Black default)
- String quotes: Double quotes (configurable)
- Import sorting: Automatic with isort
- Code style: PEP 8 compliant

### TypeScript/React (Frontend)
- Line length: 80 characters
- Quotes: Single quotes
- Semicolons: Yes
- Trailing commas: ES5 style
- JSX quotes: Single quotes

## 🔄 Updating Dependencies

To update pre-commit hooks and formatters:

```bash
pre-commit autoupdate
```

## 🐛 Troubleshooting

### Pre-commit Hook Fails
1. Check the error message for specific issues
2. Run `npm run pre-commit:run` to see all issues
3. Fix the issues and try committing again

### Formatting Conflicts
If you have formatting conflicts with existing code:

1. Run the formatters manually to fix the issues
2. Commit the formatting changes separately
3. Then commit your feature changes

### Performance Issues
If pre-commit hooks are slow:

1. Ensure you're only committing relevant files
2. Consider using `.gitignore` to exclude unnecessary files
3. Run `pre-commit run --all-files` occasionally to clean up the entire codebase

## 📚 Additional Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [Black Documentation](https://black.readthedocs.io/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/)
