---
title: Installation & License Activation
description: System requirements, installation, and activation steps for the LoyaltyBay Pro plugin.
---

LoyaltyBay Pro is a premium WooCommerce plugin distributed exclusively through the official website. It is **not** available in the WordPress.org plugin directory. This guide explains how to install the plugin, verify requirements, and activate your pro license.

---

## System Requirements

Before installation, verify that your server meets the following requirements:

*   **WordPress**: 6.2 or higher
*   **WooCommerce**: 8.0 or higher (required dependency)
*   **PHP**: 7.0 or higher (PHP 8.0+ recommended for optimal performance)
*   **Database**: MySQL 5.6+ or MariaDB 10.1+ with **InnoDB** engine support.
    
> [!CAUTION]
> **InnoDB Engine Requirement**: The `{prefix}_loyaltybay_ledger_cache` table utilizes InnoDB's row-level locking (`SELECT ... FOR UPDATE`) during checkout processing. If your database uses the MyISAM engine, table-level locks will occur instead, which will fail to prevent race conditions and can cause database deadlocks at checkout.

---

## Installation Steps

### Method 1: WordPress Admin Upload (Recommended)

1.  Log in to your **LoyaltyBay Account Dashboard** where you purchased the plugin.
2.  Download the latest release `.zip` archive of the plugin to your computer.
3.  Log in to your WordPress dashboard as an administrator.
4.  Navigate to **Plugins > Add New** and click the **Upload Plugin** button at the top of the page.
    
    ![Upload Plugin Interface](/assets/screenshots/getting-started-install-upload.png)

5.  Click **Choose File**, select the downloaded `loyaltybay.zip` file, and click **Install Now**.
6.  Once WordPress completes the upload and extraction, click the **Activate Plugin** button.

    ![Activate Plugin Card](/assets/screenshots/getting-started-install-activate.png)

### Method 2: Manual SFTP/FTP Installation

Use this method if your server restricts web-based file uploads or has low file-upload limits:

1.  Extract the downloaded `loyaltybay.zip` file on your computer. This will extract a folder named `loyaltybay`.
2.  Connect to your web server using your preferred SFTP/FTP client.
3.  Navigate to the `/wp-content/plugins/` directory of your WordPress installation.
4.  Upload the extracted `loyaltybay` directory there. Verify that the file permissions for the directory are set to `755` and files are set to `644`.
5.  Log in to your WordPress admin, go to **Plugins > Installed Plugins**, find **LoyaltyBay**, and click **Activate**.

---

## Post-Activation Processes

Upon activation, the plugin performs the following tasks automatically:

1.  **Database Migration**: Executes schema migrations to build three custom InnoDB tables:
    *   `{prefix}_loyaltybay_ledger` — Holds point transaction rows.
    *   `{prefix}_loyaltybay_ledger_cache` — Caches point balances for fast lookups.
    *   `{prefix}_loyaltybay_cron_log` — Tracks scheduled background jobs.
2.  **Add Menu Link**: Registers the **Loyalty** menu item under **WooCommerce**.
    
    ![WooCommerce Loyalty Menu Highlight](/assets/screenshots/getting-started-menu-highlight.png)

3.  **Register Custom Capabilities**: Adds the `manage_loyaltybay` capability to the `administrator` role.
4.  **Rewrite Rules**: Registers the `/my-account/my-rewards/` endpoint and flushes WordPress rewrite rules so the customer dashboard is immediately accessible.
5.  **Schedules Background Cron Events**:
    *   `loyaltybay_cron_recalculate_tiers` (daily)
    *   `loyaltybay_check_expiry` (daily)

---

## License Key Activation

Since LoyaltyBay is a Pro plugin, you must input your license key to enable automated updates:

1.  Navigate to **WooCommerce > Loyalty > Settings**.
2.  In the **Display & System** section, locate the **License Key** field.
3.  Enter the license key from your purchase receipt.
4.  Click **Save Changes**. The plugin will make an API call to verify the license and enable background updates.
