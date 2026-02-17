#!/bin/bash
# clean-all.sh: Recursively delete dist, build, .next, and node_modules folders from all apps, packages, and the project root.

set -e

ROOT_DIR="$(dirname "$0")/../"

# Patterns to clean
delete_patterns=("dist" "build" ".next" "node_modules")

# Folders to search in
search_dirs=("apps" "packages" ".")

for dir in "${search_dirs[@]}"; do
  abs_dir="$ROOT_DIR$dir"
  if [ -d "$abs_dir" ]; then
    for pattern in "${delete_patterns[@]}"; do
      echo "Searching for $pattern in $abs_dir..."
      find "$abs_dir" -type d -name "$pattern" -prune -exec rm -rf '{}' +
    done
  fi
done

echo "Cleanup complete."
