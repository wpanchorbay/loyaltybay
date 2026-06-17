---
title: Earning Points
description: Detailed guide on configuring points earning rules, calculations, product/category exclusions, notices, and refund clawbacks.
---

LoyaltyBay Pro provides a robust points earning engine. Customers can earn points automatically for purchase orders, account registrations, and product reviews.

---

## How Points Are Earned

Points are written to the database ledger through two main paths:

1.  **Automated System Hooks**: Standard customer actions trigger background calculations and ledger updates.
2.  **Manual Adjustments**: Administrators manually credit accounts (e.g., for customer service resolution).

---

## Earning Settings & Trigger Hooks

Settings are managed in **WooCommerce > Settings > Loyalty Points > Earning Points**.

### Order Status Trigger
*   **Settings Key**: `earning_orderStatusTrigger`
*   **Behavior**: When a customer's order transitions, WordPress hooks into the order lifecycle.
*   **Backend Implementation**: Subscribes to the order status transition hook. By default, this is `woocommerce_order_status_completed` (priority 20). If you set the trigger to "Processing" in settings, it will hook into `woocommerce_order_status_processing`.
*   **Order Meta**: Once points are awarded, the order meta key `_loyaltybay_points_earned` is written to prevent duplicate processing.

### Account Registration Bonus
*   **Settings Key**: `earning_pointsForRegistration`
*   **Behavior**: Credits points once to a customer upon registration.
*   **Backend Implementation**: Hooks into the WordPress native `user_register` action (priority 20).
*   **Referrals Integration**: If the registering user was referred, this hook also triggers `ReferralManager` to link the new account to the referrer using the tracking cookie.

### Product Review Bonus
*   **Settings Key**: `earning_pointsForReview`
*   **Behavior**: Credits points when a logged-in user submits an approved product review.
*   **Backend Implementation**: Hooks into `comment_approved_comment` and `wp_insert_comment` (to handle auto-approved reviews).
*   **Exclusions & Guards**:
    *   The comment type must be `review` (WooCommerce product review).
    *   The commenter must be a logged-in user (points cannot be awarded to guest reviewers).
    *   It must be the user's first approved review for this specific product (prevents points spamming). This is checked by querying the ledger for an entry matching `reference_type = 'review'` and `reference_id = [Product_ID]`.

---

## Earn Calculation & Mathematical Examples

Point earning uses the following mathematical logic:

$$\text{Points} = \text{floor}(\text{Eligible Subtotal} \times \text{Earning Ratio} \times \text{VIP Multiplier})$$

### 1. Eligible Subtotal Definition
The eligible subtotal is the base monetary amount used to calculate points.
*   **Excluded**: Shipping costs, taxes, coupon discounts, and points redeemed at checkout are subtracted.
*   **Base Formula**:
    $$\text{Eligible Subtotal} = \text{Subtotal} - \text{Discount Value} - \text{Excluded Items Value}$$

### 2. Earning Ratio
Defined by the *Points per dollar* (`earning_pointsPerDollar`) setting.

### 3. VIP Multiplier
Determined by the customer's current level in the VIP Tiers manager (e.g. `1.5` for Silver, `2.0` for Gold).

---

### Mixed-Cart Calculation Example

A Gold Tier customer (2.0x earning multiplier) makes a purchase with the following cart composition:

*   **Standard Product A**: $80.00 (Eligible)
*   **Sale Product B**: $40.00 (Eligible)
*   **Excluded Product C**: $30.00 (Excluded via Product Exclusions setting)
*   **Coupon Code Discount**: $10.00 (Applied to cart)
*   **Shipping Fee**: $15.00
*   **VAT Tax**: $10.00
*   **Earning Ratio Setting**: 1 point per $1

#### Subtotal Calculation:
1.  **Gross Items Subtotal**: $\$80.00 + \$40.00 + \$30.00 = \$150.00$
2.  **Deduct Exclusions**: Subtract Excluded Product C ($\$30.00$) -> $\$120.00$
3.  **Deduct Coupon**: Subtract Discount ($\$10.00$) -> $\$110.00$
4.  **Ignore Shipping & Tax**: Shipping ($\$15.00$) and Tax ($\$10.00$) are ignored.
5.  **Eligible Subtotal** = $\$110.00$

#### Points Earning Calculation:
$$\text{Base Points} = \$110.00 \times 1\text{ pt/\$} = 110\text{ points}$$
$$\text{Gold Multiplier} = 110 \times 2.0 = 220\text{ points}$$
$$\text{Final Earning} = \mathbf{220\text{ points}}$$

---

## Database Idempotency Mechanics

To prevent double-crediting if a page is refreshed, an order is re-saved, or an order status transitions back and forth:

*   **Composite Unique Key**: The custom database ledger table (`{prefix}_loyaltybay_ledger`) enforces a unique composite constraint:
    ```sql
    UNIQUE KEY unique_transaction (user_id, reference_type, reference_id, transaction_type)
    ```
*   **Execution Safeguard**: Before writing a credit entry to the database, `LedgerService` queries the ledger to check if an entry with `reference_type = 'order'` and `reference_id = [Order_ID]` already exists. If found, the write is aborted, preventing duplicate earnings.

---

## Refund Clawbacks

If a customer returns a product, the points they earned from that order are debited to prevent loops.

*   **Hook**: Hooks into `woocommerce_order_refunded` (priority 20), which covers both full and partial refunds.
*   **Calculations**:
    *   *Full Refund*: Credits are fully debited.
    *   *Partial Refund*: Points are debited proportionally based on the refund ratio:
        $$\text{Debit Amount} = \text{floor}\left( \frac{\text{Refund Value}}{\text{Original Order Total}} \times \text{Points Earned} \right)$$
*   **Negative Balance Handling**: If the customer has already spent the points earned from that order, the clawback will still execute, pulling their balance below zero (e.g. `-120 points`). Their balance must return to positive before they can redeem points again.
