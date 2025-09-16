// --- Self-Healing Integrity Module ---
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const ENGINE_FILE = path.resolve('./Trader_Routing_Engine.js');
const BACKUP_FILE = path.resolve('./backup/Trader_Routing_Engine.js');

// Compute SHA256 checksum of a file
function computeHash(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Self-healing function
function selfHeal() {
  try {
    const currentHash = computeHash(ENGINE_FILE);
    const backupHash = computeHash(BACKUP_FILE);

    if (currentHash !== backupHash) {
      console.warn("⚠️ Integrity mismatch detected in Trader_Routing_Engine.js!");
      console.log("🔄 Restoring from backup...");
      
      // Overwrite with backup
      fs.copyFileSync(BACKUP_FILE, ENGINE_FILE);

      console.log("✅ Self-healing complete.");
    } else {
      console.log("✔️ Integrity check passed.");
    }
  } catch (err) {
    console.error("❌ Self-healing error:", err.message);
  }
}

// Run on startup
selfHeal();

// selfHeal.js
// Self-healing / self-repair module for Trader_Routing_Engine.js
// Usage: const selfHeal = require('./selfHeal'); await selfHeal.startSelfHeal({ /*opts*/ });

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

// Use your existing logger if available, otherwise minimal fallback
let logger;
try {
  // try to reuse logger from host module (assumes host sets global.logger or exports logger)
  logger = global.logger || require('./logger') || console;
} catch (e) {
  logger = console;
}

// Config (override with env or opts)
const BACKUP_DIR = process.env.SELFHEAL_BACKUP_DIR || path.resolve(__dirname, 'backup');
const ENGINE_FILE = process.env.SELFHEAL_ENGINE_FILE || path.resolve(__dirname, 'Trader_Routing_Engine.js');
const REMOTE_BACKUP_URL = process.env.SELFHEAL_REMOTE_URL || process.env.REMOTE_RECOVERY_URL || null;
const ENABLE_REMOTE = (process.env.SELFHEAL_ENABLE_REMOTE || 'false').toLowerCase() === 'true';
const ROTATE_BACKUPS = parseInt(process.env.SELFHEAL_ROTATE || '3', 10); // number of rotated backups to keep
const HEAL_INTERVAL_SECONDS = parseInt(process.env.SELFHEAL_INTERVAL || '300', 10); // periodic check interval
const ALLOW_AUTO_PATCH = (process.env.SELFHEAL_ALLOW_AUTO_PATCH || 'true').toLowerCase() === 'true';
const VERIFY_AFTER_RESTORE = (process.env.SELFHEAL_VERIFY_AFTER_RESTORE || 'true').toLowerCase() === 'true';

// Helpers
function computeHashFromString(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}
function computeFileHash(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return computeHashFromString(data);
  } catch (err) {
    return null;
  }
}
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Backup file naming: backup-<timestamp>-<index>.js  - keep ROTATE_BACKUPS latest
function getBackupPath(ts = Date.now(), idx = 0) {
  return path.join(BACKUP_DIR, `backup-${ts}-${idx}.js`);
}
function listBackupsSorted() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-') && f.endsWith('.js'))
    .map(f => ({ name: f, path: path.join(BACKUP_DIR, f), mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
    .sort((a,b)=> b.mtime - a.mtime);
}

// Write a new backup (rotate older)
function writeBackupFromEngine() {
  try {
    ensureBackupDir();
    const ts = Date.now();
    const dest = getBackupPath(ts, 0);
    fs.copyFileSync(ENGINE_FILE, dest);
    logger.info?.(`[SELFHEAL] Wrote backup ${dest}`);
    rotateBackups();
    return dest;
  } catch (err) {
    logger.error?.(`[SELFHEAL] Failed to write backup: ${err.message}`);
    return null;
  }
}
function rotateBackups() {
  try {
    const backups = listBackupsSorted();
    // keep ROTATE_BACKUPS (most recent), delete the rest
    for (let i = ROTATE_BACKUPS; i < backups.length; i++) {
      try { fs.unlinkSync(backups[i].path); logger.info?.(`[SELFHEAL] Rotated out ${backups[i].name}`); } catch(e){/*ignore*/}
    }
  } catch (err) {
    logger.error?.(`[SELFHEAL] Backup rotation error: ${err.message}`);
  }
}

// Restore from a chosen backup file
function restoreFromBackup(backupPath) {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error('backup missing');
    }
    // copy backup to engine file (atomic replace)
    const tmp = ENGINE_FILE + '.tmp';
    fs.copyFileSync(backupPath, tmp);
    fs.renameSync(tmp, ENGINE_FILE);
    logger.info?.(`[SELFHEAL] Restored engine from backup: ${backupPath}`);
    return true;
  } catch (err) {
    logger.error?.(`[SELFHEAL] Restore failed: ${err.message}`);
    return false;
  }
}

// Fetch remote backup (expects raw text content)
async function fetchRemoteBackup() {
  if (!ENABLE_REMOTE || !REMOTE_BACKUP_URL) {
    logger.info?.('[SELFHEAL] Remote backup not enabled or URL missing.');
    return null;
  }
  try {
    logger.info?.(`[SELFHEAL] Attempting remote fetch from ${REMOTE_BACKUP_URL}`);
    const res = await axios.get(REMOTE_BACKUP_URL, { timeout: 15000, responseType: 'text' });
    if (res.status === 200 && res.data) {
      // Safety: simple sanity check — ensure content has "Trader_Routing_Engine" or expected token
      const text = res.data.toString();
      if (!text.includes('Trader_Routing_Engine')) {
        logger.warn?.('[SELFHEAL] Remote fetch content failed sanity check (missing token).');
        return null;
      }
      ensureBackupDir();
      const ts = Date.now();
      const dest = getBackupPath(ts, 'remote');
      fs.writeFileSync(dest, text, 'utf8');
      logger.info?.(`[SELFHEAL] Remote backup saved to ${dest}`);
      rotateBackups();
      return dest;
    } else {
      logger.warn?.(`[SELFHEAL] Remote fetch returned status ${res.status}`);
      return null;
    }
  } catch (err) {
    logger.error?.(`[SELFHEAL] Remote fetch error: ${err.message}`);
    return null;
  }
}

// Verify an engine file (by hash or quick parse)
function verifyEngineFile(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    // basic syntax check: attempt to parse for "module.exports" or "require("
    if (!txt || txt.length < 50) return false;
    if (!txt.includes('module.exports') && !txt.includes('export')) {
      return false;
    }
    // compute and return hash as verification token
    const h = computeHashFromString(txt);
    return { ok: true, hash: h };
  } catch (err) {
    return { ok: false, err: err.message };
  }
}

// Core check & heal logic (one-shot)
async function checkAndHealOnce() {
  try {
    if (!fs.existsSync(ENGINE_FILE)) {
      logger.warn?.('[SELFHEAL] Engine file missing. Attempting recovery...');
      // Try remote first
      let recovered = false;
      if (ENABLE_REMOTE && REMOTE_BACKUP_URL) {
        const remote = await fetchRemoteBackup();
        if (remote) recovered = restoreFromBackup(remote);
      }
      // fallback to any local backup
      if (!recovered) {
        const backups = listBackupsSorted();
        if (backups.length > 0) {
          recovered = restoreFromBackup(backups[0].path);
        }
      }
      if (!recovered) throw new Error('Unable to recover missing engine file');
      // after restore, optional verification
      if (VERIFY_AFTER_RESTORE) {
        const v = verifyEngineFile(ENGINE_FILE);
        if (!v.ok) throw new Error('Restored file failed verification');
      }
      logger.info?.('[SELFHEAL] Recovery of missing engine file completed.');
      return true;
    }

    // if engine exists: compare its hash to the most recent backup (if any)
    const engineHash = computeFileHash(ENGINE_FILE);
    const backups = listBackupsSorted();
    let latestBackupHash = null;
    if (backups.length > 0) {
      latestBackupHash = computeFileHash(backups[0].path);
    }

    // If no backups exist, create one immediately from current engine
    if (!backups.length) {
      writeBackupFromEngine();
      logger.info?.('[SELFHEAL] No backups found — created initial backup');
      return true;
    }

    // If engine hash differs from latest backup -> possible corruption or legitimate update
    if (engineHash !== latestBackupHash) {
      logger.warn?.('[SELFHEAL] Engine file hash differs from latest backup. Determining action...');

      // Verify current engine file itself (quick sanity)
      const currentVerify = verifyEngineFile(ENGINE_FILE);
      if (currentVerify.ok) {
        // The current file is syntactically valid — treat this as an intentional update.
        logger.info?.('[SELFHEAL] Current engine passes verification. Treating as new valid version.');
        if (ALLOW_AUTO_PATCH) {
          // create new backup from engine (adopt new version)
          writeBackupFromEngine();
          logger.info?.('[SELFHEAL] New engine version backed up (auto-patch accepted).');
        } else {
          logger.warn?.('[SELFHEAL] Auto-patch disabled; leaving current file but not backing up.');
        }
        return true;
      } else {
        // Current engine is invalid -> attempt restore from latest backup
        logger.warn?.('[SELFHEAL] Current engine failed verification. Restoring from backup...');
        const restored = restoreFromBackup(backups[0].path);
        if (!restored && ENABLE_REMOTE && REMOTE_BACKUP_URL) {
          // attempt remote
          const remote = await fetchRemoteBackup();
          if (remote) {
            const ok = restoreFromBackup(remote);
            if (ok) {
              logger.info?.('[SELFHEAL] Engine restored from remote backup.');
              return true;
            }
          }
        }
        if (restored) {
          logger.info?.('[SELFHEAL] Engine restored from local backup.');
          return true;
        }
        logger.error?.('[SELFHEAL] Unable to restore a valid engine file from backups.');
        return false;
      }
    } else {
      // hashes match: all good
      logger.info?.('[SELFHEAL] Engine integrity OK (hash matches latest backup).');
      return true;
    }
  } catch (err) {
    logger.error?.(`[SELFHEAL] checkAndHealOnce error: ${err.message}`);
    return false;
  }
}

// Start periodic monitoring
let _intervalHandle = null;
async function startSelfHeal(opts = {}) {
  // merge opts
  if (opts.backupDir) opts.backupDir = BACKUP_DIR;
  logger.info?.('[SELFHEAL] Starting self-heal monitor...');
  ensureBackupDir();

  // On first-run ensure at least one backup exists (bootstrap from engine)
  const backups = listBackupsSorted();
  if (!backups.length && fs.existsSync(ENGINE_FILE)) {
    writeBackupFromEngine();
    logger.info?.('[SELFHEAL] Bootstrap backup created from current engine.');
  }

  // run immediate check & heal
  await checkAndHealOnce();

  // Schedule periodic checks
  if (_intervalHandle) clearInterval(_intervalHandle);
  _intervalHandle = setInterval(async () => {
    await checkAndHealOnce();
  }, Math.max(1000, (opts.intervalSeconds || HEAL_INTERVAL_SECONDS) * 1000));

  return {
    stop: () => {
      if (_intervalHandle) clearInterval(_intervalHandle);
      _intervalHandle = null;
      logger.info?.('[SELFHEAL] Self-heal monitor stopped.');
    },
    runNow: async () => await checkAndHealOnce()
  };
}

// Expose functions
module.exports = {
  startSelfHeal,
  checkAndHealOnce,
  writeBackupFromEngine,
  restoreFromBackup,
  fetchRemoteBackup,
  listBackupsSorted
};
