#!/bin/bash

# Script to bump version in app.json
# Usage: ./scripts/bump-version.sh [major|minor|patch]

if [ -z "$1" ]; then
  echo "Usage: ./scripts/bump-version.sh [major|minor|patch]"
  echo "Example: ./scripts/bump-version.sh minor"
  exit 1
fi

TYPE=$1
APP_JSON="app.json"

# Get current version
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' $APP_JSON | cut -d'"' -f4)
CURRENT_VERSION_CODE=$(grep -o '"versionCode": [0-9]*' $APP_JSON | grep -o '[0-9]*')

echo "Current version: $CURRENT_VERSION (versionCode: $CURRENT_VERSION_CODE)"

# Split version into parts
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Bump version based on type
case $TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
  *)
    echo "Invalid type: $TYPE"
    echo "Use: major, minor, or patch"
    exit 1
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
NEW_VERSION_CODE=$((CURRENT_VERSION_CODE + 1))

echo "New version: $NEW_VERSION (versionCode: $NEW_VERSION_CODE)"

# Update app.json
sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" $APP_JSON
sed -i.bak "s/\"versionCode\": $CURRENT_VERSION_CODE/\"versionCode\": $NEW_VERSION_CODE/" $APP_JSON

# Remove backup file
rm -f $APP_JSON.bak

echo "✅ Version bumped successfully!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff $APP_JSON"
echo "2. Update CHANGELOG.md"
echo "3. Commit: git commit -am 'chore: bump version to $NEW_VERSION'"
echo "4. Merge to main to trigger APK build"
