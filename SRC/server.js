// SRC/server.js
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

# Requires: pip install cryptography
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import constant_time
from cryptography.hazmat.primitives import serialization
import os
import time
import hmac
import secrets

# --- Helpers (implement these for your environment) ---
def get_device_fingerprint() -> bytes:
    """
    Must return a stable, reasonably-unique, non-secret device fingerprint.
    Combine multiple facts (TPM public key, CPU serial if available, OS attestation).
    Do not rely on easily spoofable fields alone.
    """
    # placeholder — replace with TPM public key / attestation data
    return b"device-fp-v1-REPLACE_WITH_REAL_ATTESTATION"

def get_master_key_from_hsm() -> bytes:
    """
    Best practice: return a short-lived unwrapped master key from HSM/KMS or
    perform key operation inside HSM (preferred).
    This function must NOT read a long-term key from disk.
    """
    # placeholder: in prod call KMS/HSM API to unwrap or derive key
    return b"hsm-derived-master-key-32bytes-len!!"[:32]

def load_encrypted_payload() -> dict:
    """
    Example payload container (binary). Your actual format may vary.
    Return dict with nonce, wrapped_key (if using envelope), ciphertext, aad.
    """
    # For example purposes we assume the encrypted payload serialized externally
    # Real code will parse file / DB field
    return {
        "nonce": os.urandom(12),
        "ciphertext": b"...",   # ciphertext || tag (AESGCM returns tag appended)
        "aad": b"quantumtrader:core_logic:v1",
        "wrapped_key": b"...",  # if using envelope encryption
    }

def verify_attestation():
    """
    Optional: perform remote attestation or TPM check to ensure runtime is trusted.
    Return True if attestation checks pass.
    """
    # placeholder
    return True

def lockdown_and_notify(reason: str):
    """
    On critical failure: revoke access, zero KMS tokens, alert SOC, disable accounts,
    and preserve forensic artifacts (non-writable copy).
    """
    # Implement your SOC/KMS calls here
    print("ALERT:", reason)
    # e.g., call SIEM, revoke tokens, rotate keys, set flags, etc.


# --- Secure decrypt routine ---
def decrypt_core_logic(secret_salt: bytes, max_attempts: int = 5):
    # Rate-limit / retry protection, per-device/stateful counter (must be persisted)
    attempts = 0
    while attempts < max_attempts:
        attempts += 1
        try:
            # 1) Optional: check attestation before unwrapping
            if not verify_attestation():
                raise RuntimeError("Attestation failed")

            # 2) Obtain stable device info and a hardware-backed master secret
            fingerprint = get_device_fingerprint()       # non-secret, but device-bound
            master_key = get_master_key_from_hsm()      # hardware-backed or unwrapped short-lived

            # 3) Derive an ephemeral symmetric key using HKDF (bind master + device)
            hkdf = HKDF(
                algorithm=SHA256(),
                length=32,
                salt=secret_salt,               # explicit salt stored/managed safely
                info=b"QuantumTrader-AESGCM-Context:" + fingerprint,
            )
            derived_key = hkdf.derive(master_key)       # 32 bytes -> AES-256 key

            # 4) Load encrypted blob (nonce, ciphertext, aad)
            blob = load_encrypted_payload()
            nonce = blob["nonce"]
            ciphertext = blob["ciphertext"]
            aad = blob.get("aad", None)

            # 5) Decrypt using AES-GCM (authenticated)
            aesgcm = AESGCM(derived_key)
            plaintext = aesgcm.decrypt(nonce, ciphertext, aad)  # raises if tampered

            # 6) Use plaintext immediately in memory-safe way
            try:
                run_core_logic(plaintext)   # keep run_core_logic short & careful
            finally:
                # 7) Best-effort zeroization of sensitive buffers
                if isinstance(plaintext, (bytearray, memoryview)):
                    for i in range(len(plaintext)):
                        plaintext[i] = 0
                else:
                    # overwrite with a bytearray then del
                    z = bytearray(len(plaintext))
                    for i in range(len(z)):
                        z[i] = 0
                    del z
                del plaintext

            return True  # success

        except Exception as exc:
            # Authentication/tamper or other failure
            print(f"Decryption attempt {attempts} failed:", str(exc))
            time.sleep(0.3 * attempts)   # small backoff to slow automated attacks

    # If we exhausted attempts: lockdown, zero local secrets, alert
    lockdown_and_notify("Decryption failures exceeded threshold")
    return False


# --- Placeholder for actual payload execution: keep minimal and secure ---
def run_core_logic(data: bytes):
    """
    Very small, time-limited execution context that reads the payload.
    Preferably, this should be a call into a verified, signed binary or enclave.
    """
    # Example: decode or load a signed module, but do NOT persist this to disk
    print("Core logic would run now (length):", len(data))
import sounddevice as sd
import numpy as np

def detect_loudspeaker_blast(threshold_db=85, window=2.0):
    """Return True if loudspeaker-like noise detected."""
    fs = 44100
    samples = int(fs * window)
    audio = sd.rec(samples, samplerate=fs, channels=1, dtype='float32')
    sd.wait()

    # Compute RMS dB
    rms = np.sqrt(np.mean(audio**2))
    db = 20 * np.log10(rms + 1e-12)

    # Optionally run a classifier on the spectrum here
    if db >= threshold_db:
        return True, db
    return False, db

# Usage
detected, level = detect_loudspeaker_blast()
if detected:
    engage_anc_filters()
    notify_security(level)


def peace_mode():
    noise_level = measure_noise()
    if noise_level > threshold_db:
        if detect_loudspeaker_pattern(noise_sample):
            activate_noise_cancellation()
            notify_user("Peace Mode activated: environmental noise suppressed")


