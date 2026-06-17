---
title: Points Ledger
description: Admin guide for navigating and auditing the customer points transaction ledger in LoyaltyBay.
---

The Points Ledger is the central source of truth for all points activity in LoyaltyBay. It lists every credit and debit transaction in an immutable, append-only table.

---

## Admin Ledger Overview

To view the ledger:
1.  Log in to your WordPress admin panel.
2.  Navigate to **WooCommerce > Loyalty**.
3.  The main panel displays the **Points Ledger** table, built with a modern, responsive React interface.

![Admin Ledger Table Overview](/assets/screenshots/ledger-admin-main.png)

### Ledger Table Columns

*   **ID**: The unique transaction database ID.
*   **User**: The customer's display name and email address.
*   **Type**: Indicated by distinct color badges:
    *   `Credit` (Green): Points added to the balance.
    *   `Debit` (Red): Points deducted from the balance.
*   **Amount**: The number of points added or subtracted.
*   **Reference Type**: The source event that triggered the transaction. Valid references are:
    *   `order` — Points earned on a WooCommerce purchase.
    *   `refund` — Points deducted due to a full or partial refund.
    *   `registration` — Registration bonus points.
    *   `review` — Bonus points for an approved product review.
    *   `referral` — Points credited for referring a customer.
    *   `admin` — Points manually adjusted by an administrator.
    *   `expiry` — Points removed due to expiration.
*   **Reference ID**: The database ID of the source event (e.g. WooCommerce Order ID, WordPress User ID, Comment ID).
*   **Description**: Explanation of the transaction (e.g. *"Points earned for order #1234"*).
*   **Date**: The exact timestamp the transaction was written.

---

## Filtering Options

To search and audit transactions, use the filter panel located above the ledger table:

![Ledger Filters Panel](/assets/screenshots/ledger-filters.png)

*   **Search User**: An autocomplete multi-select field. Search by username, display name, or email. You can filter by multiple users simultaneously.
*   **Transaction Type**: Dropdown to filter by `Credit` only or `Debit` only.
*   **Reference Type**: Filter by specific event sources (e.g. view only `refund` or `admin` entries).
*   **Date Range**: Date selectors to limit results to a specific timeframe (Start Date and End Date).

Filters combine dynamically and update the ledger table instantly via the REST API.

---

## CSV Export

You can export ledger reports for accounting, auditing, or marketing operations:

1.  Apply any desired filters in the filter panel.
2.  Click the **Export to CSV** button in the top right action bar.
3.  The browser will automatically download the CSV file containing the filtered records.

![CSV Export Button](/assets/screenshots/ledger-export-btn.png)

*The CSV export query matches the active ledger filters exactly but ignores table pagination limits, exporting the entire filtered dataset.*
