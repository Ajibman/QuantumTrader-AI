# Check Modules 01–15 for README.md and __init__.py
for i in {1..15}
do
  module_dir="Modules/Module$(printf "%02d" $i)"
  mkdir -p "$module_dir"

  # Create README.md if missing
  if [ ! -f "$module_dir/README.md" ]; then
    cat > "$module_dir/README.md" <<EOL
# Module $(printf "%02d" $i)

This is the placeholder for Module $(printf "%02d" $i) of QuantumTrader-AI.

- Purpose: (to be defined)
- Inputs: (to be defined)
- Outputs: (to be defined)
- Links to other modules: (to be defined)
EOL
    echo "✅ Added README.md in $module_dir"
  fi

  # Create __init__.py if missing
  if [ ! -f "$module_dir/__init__.py" ]; then
    echo "# Init file for Module $(printf "%02d" $i)" > "$module_dir/__init__.py"
    echo "✅ Added __init__.py in $module_dir"
  fi
done

# Check Archive folder
mkdir -p Modules/Archive
[ ! -f Modules/Archive/README.md ] && echo "# Archive for old work" > Modules/Archive/README.md
[ ! -f Modules/Archive/__init__.py ] && echo "# Init file for Archive" > Modules/Archive/__init__.py

echo "🎯 Sanity check completed. All modules are Python & docs ready."
