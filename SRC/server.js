 const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Path to the backup server.js
const backupFilePath = path.join(__dirname, 'backup', 'server.js');
const originalFilePath = path.join(__dirname, 'server.js');

// Expected hash (checksum) of the original server.js to detect corruption
const expectedChecksum = 'yourExpectedChecksumValueHere'; // Generate this checksum for the original server.js

// Function to perform self-repair
function performSelfRepair() {
    // Check if the file is editable (if it’s not, do a self-repair)
    fs.access(originalFilePath, fs.constants.W_OK, (err) => {
        if (err) {
            console.log('File is not writable. Triggering self-repair...');
            restoreBackup();
        } else {
            console.log('File is writable. Checking for corruption...');

            // Check for file corruption
            checkForCorruption();
        }
    });
}

// Function to check if server.js has been corrupted
function checkForCorruption() {
    fs.readFile(originalFilePath, (err, data) => {
        if (err) {
            console.error('Error reading server.js:', err);
            return;
        }

        const currentChecksum = getChecksum(data);

        // Compare the current checksum with the expected one
        if (currentChecksum !== expectedChecksum) {
            console.log('Server.js is corrupted. Triggering self-repair...');
            restoreBackup();
        } else {
            console.log('Server.js is intact. No repair needed.');
        }
    });
}

// Function to generate a checksum (hash) of the file content
function getChecksum(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to restore the backup version of the server.js
function restoreBackup() {
    fs.copyFile(backupFilePath, originalFilePath, (err) => {
        if (err) {
            console.error('Failed to restore backup:', err);
        } else {
            console.log('Self-repair completed. Restored from backup.');
        }
    });
}

// Trigger self-repair if necessary
performSelfRepair();
