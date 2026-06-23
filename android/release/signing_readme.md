# QuantumTrader-AI Release Signing Guide

## Purpose
This module handles production signing for Google Play Store deployment.

---

## Step 1 — Generate Keystore

Run:

```bash
keytool -genkeypair \
 -v \
 -keystore quantumtrader-release.jks \
 -keyalg RSA \
 -keysize 2048 \
 -validity 10000 \
 -alias quantumtrader
