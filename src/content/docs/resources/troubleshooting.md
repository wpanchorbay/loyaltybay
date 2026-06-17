---
title: Troubleshooting
description: Diagnostic guides and solutions for common issues in LoyaltyBay.
---

This page provides troubleshooting guidelines for resolving common configuration, display, or database issues.

---

## Earning Issues

### Points Are Not Being Awarded on Purchases
If completed orders are not crediting points to customers, perform the following checks:

1.  **Check Order Status**: Verify that the order's status matches your **Order Status Trigger** setting (default is **Completed**). If the order is in "Processing" or "Pending" status, points will not be awarded.
2.  **Verify Customer Registration**: Guests cannot earn points. Check if the order was placed by a registered user.
3.  **Check Exclusions**: Ensure the items purchased were not in excluded categories or products. Exclusions deduct the item value before calculation.
4.  **Audit Ledger for Duplicates**: Check the ledger in **WooCommerce > Loyalty**. If points were already awarded for that order ID, the database blocks subsequent attempts to prevent double-crediting.
5.  **Check DB Engine**: Confirm your MySQL tables use InnoDB. If they use MyISAM, transactional commits might fail.

---

## Redemption Issues

### Redemption Form Does Not Appear at Checkout
If the points slider or entry form is missing at checkout, verify:

1.  **User Login**: Ensure the customer is logged in. Guests cannot redeem points.
2.  **Point Balance vs. Minimum Threshold**: Ensure the customer's balance is equal to or greater than the **Minimum Points to Redeem** setting (default is `100` points).
3.  **Compatibility check**:
    *   If using WooCommerce Blocks Checkout, confirm that your theme supports the block layout registry.
    *   If using Classic Checkout, ensure your theme calls the `woocommerce_checkout_before_order_review` hook. If your custom theme has stripped default hooks, select a different **Widget Position** hook in settings.

---

## Integration Conflicts

### Tax Calculations Are Wrong When Points Are Redeemed
Redeeming points on storefronts that use automated tax calculation plugins (such as TaxJar, Avalara, or custom tax structures) can sometimes create calculation conflicts.

*   **Symptom**: Tax rates calculate on the subtotal *before* the discount is subtracted, or the checkout API returns errors.
*   **Solution**: Switch your **Redemption Mode** from **Cart Fee (Fee)** to **Virtual Coupon (Coupon)** in settings. In Coupon mode, the discount is processed as a standard WooCommerce coupon, which tax automation plugins support natively.

---

## Admin Dashboard Issues

### The Loyalty Admin Screen Is Blank
If the ledger or settings panel fails to load:

1.  **Check Browser Console**: Right-click the page, click **Inspect**, and view the **Console** tab. Look for JavaScript load errors.
2.  **REST API Blocked**: Confirm that your server does not block the WordPress REST API. LoyaltyBay's admin screens are written in React and fetch all data via `/wp-json/loyaltybay/v1/`. Security plugins (e.g. Wordfence, Web Application Firewalls) sometimes block REST requests.
3.  **Missing Script Locales**: Check if your theme is calling `wp_footer()` or `wp_head()` correctly. Admin bundles require WordPress scripts to be enqueued.

---

## Debug Mode & Logs

If you encounter an unexplained error, enable debug logging to capture verbose trace messages.

### 1. Enabling Debug Logging
1.  Navigate to **WooCommerce > Settings > Loyalty Points > Display & System**.
2.  Check the **Debug Mode** checkbox.
3.  Click **Save Changes**.

![Debug Mode Admin Setting Toggle](/assets/screenshots/troubleshooting-debug-toggle.png)

### 2. Log Location
When debug logging is enabled, logs are written to:
```text
wp-content/uploads/loyaltybay-logs/plugin-log-YYYY-MM-DD.log
```
*If debug mode is disabled, only critical system errors (`ERROR` level) are recorded in this log file.*
