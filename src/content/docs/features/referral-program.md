---
title: Referral Program
description: Guide to the built-in refer-a-friend system, referral links, and reward policies in LoyaltyBay.
---

The LoyaltyBay Referral Program turns your customers into brand advocates by rewarding them when they introduce new customers to your store.

---

## How It Works

1.  **Share**: Logged-in customers copy their unique referral URL from the **My Account > Loyalty Points** dashboard.
2.  **Visit**: A new visitor clicks the referral link and browses your site. The system drops a tracking cookie.
3.  **Register**: The new visitor registers an account on your store.
4.  **Purchase**: The new customer completes their first order.
5.  **Reward**:
    *   The **Referrer** receives bonus points (e.g. 1,000 points).
    *   The **Referee** (new customer) receives their first-order discount.

---

## Technical Architecture & Cookie Capture

### Database Meta Keys
The referral system tracks associations using default WordPress user metadata:
*   `loyaltybay_referral_code` — Unique alphanumeric identifier code assigned to each customer.
*   `loyaltybay_referred_by` — Stores the User ID of the referrer inside the referee's user metadata.
*   `loyaltybay_referral_rewarded` — A boolean check flag stored in the referee's metadata preventing multiple referral reward triggers.

### Cookie Tracking Flow
When a visitor arrives at the site:
1.  **Hook**: The plugin hooks into `init` during `template_redirect` execution.
2.  **Check**: It checks if the URL contains the query parameter `?ref=CODE`.
3.  **Validate**: It queries the database to find the User ID matching the referral code.
4.  **Cookie Drop**: If valid, it drops a browser cookie named `loyaltybay_ref` storing the Referrer ID with a 30-day lifespan (configurable via `referrals_cookieDuration`).
5.  **User Link**: When the visitor registers a user account, the plugin checks for the `loyaltybay_ref` cookie. If found, it writes the Referrer ID to the new user's meta under `loyaltybay_referred_by` and deletes the cookie.

---

## Referral Reward Validation

Rewards are finalized when the referee places their first order:

### 1. Order Completion Hook
The processing logic hooks into `woocommerce_order_status_completed` at priority 30 (after base purchase points are already awarded).

### 2. Validation Checks
Before crediting points, the referral processor (`Referrals\ReferralProcessor`) runs the following checks:
*   **Referred Check**: Verifies if the buyer has the `loyaltybay_referred_by` meta key.
*   **Double Trigger Check**: Confirms the buyer does not have meta `loyaltybay_referral_rewarded` set to `true`.
*   **Self-Referral Prevention**: Verifies that the Referrer ID does not equal the Buyer ID (e.g., a customer trying to use their own referral link).
*   **First Order Verification**: Runs a WooCommerce query to verify this is the customer's first completed purchase:
    ```php
    $order_count = count( wc_get_orders( [
        'customer' => $buyer_id,
        'status'   => [ 'completed', 'processing' ],
        'limit'    => 2,
    ] ) );
    ```
    If `$order_count` is greater than `1`, the referral reward is rejected.

### 3. Credit Transaction
If all validations pass:
1.  Credits the referrer with points (reference type: `referral`, reference ID: Order ID).
2.  Updates the referee's metadata: `loyaltybay_referral_rewarded = true`.
3.  Fires a custom WordPress action hook: `loyaltybay_referral_processed`.

---

## Key Rules & Policies

### One-Time Earning Limit
Referral rewards are strictly **one-time** incentives. Points are only awarded to the referrer on the **first completed order** of the referee. Subsequent orders placed by the referee do not award additional points to the referrer.

### Refund Isolation Policy
To protect referrer relationships and maintain customer trust, the system enforces a strict isolation policy:

> [!NOTE]
> If a referred customer (referee) requests a refund on their first order, the referee's earned points are clawed back, but the **referrer's referral bonus points are NOT deducted**. This ensures referrers are not penalized for the return behavior of their referred friends.
