  ```js
   #!/data/data/com.termux/files/usr/bin/bash
   echo "Validating folder names..."
   for dir in src assets public; do
     if [ ! -d "dir" ]; then
       echo "Missing:dir"
     else
       echo "Found: $dir"
     fi
   done
   ```

   Save that as `validateFolderNames.sh` in the root (`~/QuantumTrader-AI/`), then:
   ```bash
   chmod +x validateFolderNames.sh
   ./validateFolderNames.sh
   ```

