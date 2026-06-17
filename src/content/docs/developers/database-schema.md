---
title: Database Schema
description: Technical reference for LoyaltyBay custom database tables, user metadata, and options.
---

LoyaltyBay extends the default WordPress database with custom tables to log transactions, cache balances, and track background jobs.

---

## Database Requirements

*   **Prefix**: All tables inherit the active WordPress database prefix (e.g. `wp_`).
*   **Engine**: Custom tables are created using the **InnoDB** storage engine.
    
> [!CAUTION]
> The InnoDB engine is mandatory for transaction processing. LoyaltyBay relies on row-level locking (`SELECT ... FOR UPDATE`) during checkout processing to guarantee race-condition safety. If converted to MyISAM, table locks will fail, allowing double-spending of points.

---

## Custom Database Tables

Upon plugin activation, three custom tables are created via the WordPress `dbDelta()` system:

### 1. `{prefix}_loyaltybay_ledger`
This table is an append-only log of every individual point transaction (credits and debits) in the system.

| Column Name | Data Type | Null | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `bigint(20) unsigned` | No | PRI | *Auto-increment* | Unique ledger entry ID. |
| `user_id` | `bigint(20) unsigned` | No | MUL | | WordPress User ID. |
| `transaction_type` | `varchar(20)` | No | | | Either `credit` or `debit`. |
| `amount` | `decimal(10,2)` | No | | | Point value (fractional support). |
| `reference_type` | `varchar(50)` | No | | | Event source: `order`, `refund`, `registration`, `review`, `referral`, `admin`, `expiry`. |
| `reference_id` | `bigint(20) unsigned` | No | | | Event source database ID. |
| `description` | `varchar(255)` | Yes | | `NULL` | Plain-text description. |
| `expires_at` | `datetime` | Yes | | `NULL` | Expiration timestamp (planned). |
| `created_at` | `datetime` | No | | `CURRENT_TIMESTAMP` | Transaction timestamp. |

*   **Idempotency Index**: A unique index `unique_transaction` is defined on `(user_id, reference_type, reference_id, transaction_type)`. This DB-level restriction prevents duplicate credits or debits for the same event (such as refreshing a checkout page).
*   **Performance Index**: Index `idx_user_created` is defined on `(user_id, created_at)` to optimize customer dashboard history queries.

---

### 2. `{prefix}_loyaltybay_ledger_cache`
This table caches the calculated point balance for each customer to avoid executing expensive sum queries across the entire ledger.

| Column Name | Data Type | Null | Key | Default | Description |
|---|---|---|---|---|---|
| `user_id` | `bigint(20) unsigned` | No | PRI | | WordPress User ID. |
| `balance` | `decimal(10,2)` | No | | `0.00` | Current available points balance. |
| `last_updated` | `datetime` | No | | `CURRENT_TIMESTAMP` | Last cache update timestamp. |

*   **Cache Updates**: When a points transaction is committed, `LedgerService` updates this table's balance row. In addition, user meta `loyaltybay_balance` is denormalized in parallel for sub-20ms reads.

---

### 3. `{prefix}_loyaltybay_cron_log`
Logs the execution history and status of all scheduled background jobs.

| Column Name | Data Type | Null | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `bigint(20) unsigned` | No | PRI | *Auto-increment* | Log ID. |
| `job_name` | `varchar(100)` | No | | | Registered cron job handle. |
| `status` | `varchar(20)` | No | MUL | | Job state: `started`, `completed`, `failed`. |
| `payload` | `text` | Yes | | `NULL` | JSON string of job arguments. |
| `error_message` | `text` | Yes | | `NULL` | PHP error message string if failed. |
| `retry_count` | `tinyint(4)` | No | | `0` | Number of automated retries executed. |
| `started_at` | `datetime` | No | | | Job start timestamp. |
| `completed_at` | `datetime` | Yes | | `NULL` | Job completion timestamp. |

---

## User Metadata Keys

LoyaltyBay stores user-specific state in the default WordPress `wp_usermeta` table:

*   **`loyaltybay_balance`**: Denormalized balance cache (float) for fast read operations.
*   **`loyaltybay_vip_tier`**: The slug of the customer's active VIP loyalty level (e.g. `gold`).
*   **`loyaltybay_referral_code`**: Unique alpha-numeric string assigned to the user for referral links.
*   **`loyaltybay_referred_by`**: The User ID of the customer who referred this user.
*   **`loyaltybay_referral_rewarded`**: Boolean check tracking if the referrer has been rewarded for this signup.

---

## WordPress Options Keys

Stored in `wp_options`:

*   **`loyaltybay`**: Serialized array containing all active settings.
*   **`loyaltybay_version`**: The database version string (used by `Activator` to trigger database migrations on upgrade).

---

## Data Lifecycle & Uninstallation

*   **Deactivation**: Keeps all database tables, options, and user meta intact. Deactivation only clears scheduled cron jobs and removes customer rewrite endpoints.
*   **Uninstallation**: Deletes all data only if **Delete All on Uninstall** (`advanced_deleteAllOnUninstall`) is checked in settings. If enabled, deleting the plugin will:
    1.  Execute `DROP TABLE` on the three custom loyalty tables.
    2.  Delete options `loyaltybay` and `loyaltybay_version`.
    3.  Clear all associated user meta.
    4.  Remove the `manage_loyaltybay` capability from all WordPress user roles.
