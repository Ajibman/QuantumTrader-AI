 name: Backup Index
on:
  push:
    paths:
      - "index.html"

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Create backup folder
        run: mkdir -p backup

      - name: Copy index.html to backup
        run: cp index.html backup/index.html

      - name: Commit and push backup
        run: |
          git config --global user.name "github-actions"
          git config --global user.email "github-actions@github.com"
          git add backup/index.html
          git commit -m "Auto-backup: index.html"
          git push
