#!/usr/bin/env bash
set -euo pipefail

echo "This script scaffolds Android native project files for the React Native app."
echo "It will run npx react-native init into the current directory."

if [ ! -f package.json ]; then
  echo "Run this script from apps/mobile-app"
  exit 1
fi

read -p "Proceed to create Android/iOS native projects here? This may overwrite files. (y/N) " yn
if [ "${yn,,}" != "y" ]; then
  echo "Aborted"
  exit 0
fi

# Use template typescript to scaffold native projects
npx react-native init mobile-app --directory . --template react-native-template-typescript

echo "Native scaffolding created. Run 'pnpm android' from this folder to build on Android." 
