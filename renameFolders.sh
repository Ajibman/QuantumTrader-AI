```js

echo "Starting safe renaming..."

Rename SRC to src
if [ -d "SRC" ]; then
  mv SRC temp_src && mv temp_src src
  echo "Renamed SRC → src"
else
  echo "Folder SRC not found"
fi

Rename Assets to assets
if [ -d "Assets" ]; then
  mv Assets temp_assets && mv temp_assets assets
  echo "Renamed Assets → assets"
else
  echo "Folder Assets not found"
fi

Git staging
git add .
git commit -m "Renamed SRC to src and Assets to assets (case normalization)"
git push

echo "Done."

chmod +x renameFolders.sh
```
