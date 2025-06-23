#!/bin/bash

# Setup script for pre-commit hooks
echo "🚀 Setting up pre-commit hooks for The Vista Project..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."
    pip install pre-commit
else
    echo "✅ pre-commit is already installed"
fi

# Install pre-commit hooks
echo "🔧 Installing pre-commit hooks..."
pre-commit install

# Install Python dependencies for backend formatting
echo "🐍 Installing Python formatting dependencies..."
cd apps/backend
pip install black isort flake8

# Install Node.js dependencies for frontend formatting
echo "📦 Installing Node.js formatting dependencies..."
cd ../../apps/frontend
npm install --save-dev prettier

echo "✅ Pre-commit setup complete!"
echo ""
echo "📋 What this setup includes:"
echo "  • Black (Python code formatter)"
echo "  • isort (Python import sorter)"
echo "  • flake8 (Python linter)"
echo "  • Prettier (TypeScript/JavaScript formatter)"
echo "  • ESLint (TypeScript/JavaScript linter)"
echo "  • General file checks (trailing whitespace, merge conflicts, etc.)"
echo ""
echo "🔧 The hooks will now run automatically on every commit!"
echo "💡 To run formatting manually: npm run format"
echo "💡 To run all checks manually: npm run pre-commit:run"
