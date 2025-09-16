<!-- Backup & Restore Script -->
<script>
  const filesToBackup = [
    { src: "index.html", dest: "repo2/backup/index.html" },
    { src: "assets/coming-soon-logo.png", dest: "repo2/backup/assets/coming-soon-logo.png" }
  ];

  // Backup function
  function backupFiles() {
    filesToBackup.forEach(file => {
      fetch(file.src)
        .then(response => {
          if (!response.ok) throw new Error("Fetch failed: " + file.src);
          return response.blob();
        })
        .then(blob => {
          const a = document.createElement("a");
          const fileName = file.dest.split("/").pop(); // keep original filename
          a.download = fileName;
          a.href = URL.createObjectURL(blob);
          a.click();
        })
        .catch(err => console.error("Backup failed for", file.src, err));
    });
  }

  // Restore function (manual copy back for now)
  function restoreFiles() {
    alert("⚠️ Restore is manual. Use the GitHub restore workflow or local script to copy files back.");
  }

  // Bind Ctrl+B for backup
  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "b") {
      event.preventDefault();
      backupFiles();
    }
  });
</script>
