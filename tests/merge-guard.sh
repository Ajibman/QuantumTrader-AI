# Do work inside step4-start
git add .
git commit -m "Step 4: [describe milestone change]"

# Merge tested work into main
git checkout main
git merge step4-start
git push origin main
