---
title: Changelog
description: Version release history for the LoyaltyBay WooCommerce plugin.
---

This page logs the updates, features, and fixes released for the LoyaltyBay plugin.

---

## v1.0.0 — Initial Release

Released on June 17, 2026.

### Features
*   **Points Earning**:
    *   Automatic points calculation and crediting on WooCommerce order status completions.
    *   Exclusion list support for specific products and categories.
    *   Optional points rewards for user registrations and approved product reviews.
    *   Earning limits cap configuration.
*   **Points Redemption**:
    *   Points slider and numeric input for checkout redemption.
    *   Supports WooCommerce Block Checkout and WooCommerce Classic Checkout layouts.
    *   Flexible redemption modes: Cart Fee (Fee) mode and Virtual Coupon (Coupon) mode.
    *   Minimum point threshold and maximum checkout discount percentage settings.
*   **Database & Core**:
    *   Immutable, append-only points transaction ledger (`wp_loyaltybay_ledger`).
    *   High-performance user balance cache tables.
    *   Double-spend race condition protection using InnoDB row-level database locking.
    *   Fail-safe background cron infrastructure with auto-retry and logging.
*   **Admin Tools**:
    *   React-powered admin dashboard and configuration tab.
    *   Detailed transaction log table with user, type, and date-range filters.
    *   One-click manual adjustments (credits and debits) with reason logging.
    *   CSV data export matching current filters.
*   **Loyalty Features**:
    *   VIP Earning Tiers (Bronze, Silver, Gold, Platinum) with customizable lifetime point thresholds and multipliers.
    *   Referral tracking system using unique customer URLs and cookies.
    *   Customer My Account "Loyalty Points" dashboard showing history, tier, and copy-link panels.
*   **Security & Uninstall**:
    *   Full sanitization, escaping, and WP nonce validation.
    *   Graceful uninstall option to completely purge tables and metadata.
