---
title: Points Expiry
description: Overview of the points expiration system, database support, and planned cron workflows.
---

To keep loyalty balances active and control financial liabilities, LoyaltyBay includes architectural support for automatic point expiration.

---

## Current Status

> [!IMPORTANT]
> **Points expiration is currently a partially implemented feature.** 
> The database schema fully supports expiration timestamps, and the cron logging system is ready. However, the automated background worker that cleans up expired balances is scheduled for a future release.

---

## Planned Expiry Settings

When fully enabled, expiration settings will be managed in the admin dashboard:

*   **Enable Expiry**: Globally toggle points expiration.
*   **Expiry Period (Days)**: The number of days points remain active after being earned (e.g. `365` days).
*   **Notification Period (Days)**: How many days before expiration a warning email should be sent to the customer.

![Planned Expiry Admin Settings](/assets/screenshots/expiry-admin-settings.png)

---

## Database & Cron Infrastructure

The foundational code for expiration is already active in the plugin's backend:

### 1. Database Columns
The `{prefix}_loyaltybay_ledger` table includes a nullable `expires_at` column.
*   When a customer earns points on a purchase and expiry is enabled, the system calculates `expires_at` as `NOW() + ExpiryPeriod` and saves it with the credit entry.
*   If expiry is disabled, `expires_at` is set to `NULL` (never expires).

### 2. Expiry Execution (WP-Cron)
A background service (`Services\ExpiryService`) is designed to run daily via WP-Cron (`loyaltybay_check_expiry` event):

1.  **Scan**: It queries the ledger for credit entries where `expires_at` is in the past (`expires_at < NOW()`).
2.  **Calculate**: It checks if those points have already been debited (spent or refunded).
3.  **Debit**: For any remaining unspent points that have expired, the system creates a debit entry with `reference_type = 'expiry'`.
4.  **Cache Sync**: Recalculates and updates the customer's cached balance.
5.  **Audit Logs**: Writes the job state to the `{prefix}_loyaltybay_cron_log` table.
