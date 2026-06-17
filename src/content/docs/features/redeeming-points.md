---
title: Redeeming Points
description: Detailed guide on configuring checkout point redemption, application modes, and double-spend security.
---

LoyaltyBay Pro allows customers to redeem points for monetary discounts at checkout. The system supports Block and Classic checkouts, and handles transactions with database-level security.

---

## How Redemption Works

1.  **Checkout Panel**: When a logged-in customer goes to checkout, the plugin checks if their balance meets the **Minimum Points to Redeem** threshold.
2.  **Input & Slider**: The customer specifies the point amount they wish to apply.
3.  **AJAX Application**: Clicking **Apply Discount** sends a REST API request to the server, which validates the points and stores the pending discount in the WooCommerce session.
4.  **Checkout Finalization**: When the order is placed, a database-level lock is acquired. The customer's points are debited from the ledger, their cached balance is updated, and the order is completed.

---

## Session Management

*   **Session Key**: Pending redemptions are saved in the WooCommerce session under `loyaltybay_points_redemption`.
*   **Properties**: The session object tracks:
    *   `points`: The number of points applied.
    *   `discount`: The calculated monetary value of the points.
    *   `user_id`: The ID of the customer applying the points.
*   **Session Lifecycle**: The session value is cleared immediately after the order is processed (`woocommerce_checkout_order_processed`) or if items are added/removed from the cart in a way that makes the applied points invalid (e.g. cart subtotal drops below the discount value).

---

## Redemption Modes (Under the Hood)

You can select the redemption framework in **WooCommerce > Settings > Loyalty Points > Redemption Rules**.

### 1. Cart Fee Mode (`fee`)
*   **How it works**: The discount is applied as a negative fee to the cart.
*   **Backend Implementation**: Hooks into `woocommerce_cart_calculate_fees`. It retrieves the applied points from the session, calculates the negative value (e.g. `-$5.00`), and adds it to the cart:
    ```php
    $cart->add_fee( __( 'Points Discount', 'loyaltybay' ), -$discount_amount );
    ```
*   **Tax Considerations**: Some third-party tax calculation plugins do not read negative fees. If you notice incorrect tax totals, switch to Coupon Mode.

### 2. Virtual Coupon Mode (`coupon`)
*   **How it works**: Generates a temporary virtual coupon on the fly.
*   **Backend Implementation**:
    1.  Hooks into `woocommerce_get_shop_coupon_data` (priority 10). If the coupon code requested starts with `loyaltybay_points_`, the plugin intercepts the request and generates a virtual `WC_Coupon` object populated with dynamic settings (discount type: `fixed_cart`, discount amount: matching the session value, individual use: `true`).
    2.  Hooks into `woocommerce_before_calculate_totals` to verify the virtual coupon is present in the cart, adding or removing it based on session state.
*   **Tax Considerations**: This is the most reliable mode for tax calculations because it uses WooCommerce's native coupon framework.

---

## Double-Spend & Race Condition Protection

To prevent checkout exploits (for example, if a customer runs concurrent checkout scripts or clicks "Place Order" simultaneously in multiple browser tabs to spend the same points twice), LoyaltyBay executes redemption inside an atomic database lock.

During order finalization, the checkout processor (`Checkout\CheckoutProcessor`) handles the transaction using the following sequence:

### Step 1: Open DB Transaction
```sql
START TRANSACTION; -- Opens a database transaction
```

### Step 2: Acquire Row-Level Lock
The processor selects the customer's cached balance row from the InnoDB cache table using a write lock:
```sql
SELECT balance FROM wp_loyaltybay_ledger_cache WHERE user_id = 5 FOR UPDATE;
```
*   **Blocking behavior**: Any concurrent checkout request for user ID `5` will be forced to wait at this line until the first transaction is either committed or rolled back.

### Step 3: Re-Verify Balance
The system checks if the locked balance is greater than or equal to the points applied at checkout.

### Step 4: Write to Ledger & Cache
If the balance is valid, the system processes the credit/debit:
1.  Inserts a new debit row into the ledger table `{prefix}_loyaltybay_ledger` with `reference_type = 'order'`.
2.  Calculates the new balance and updates the cache row in `{prefix}_loyaltybay_ledger_cache`.
3.  Updates the redundant cache in `wp_usermeta` under key `loyaltybay_balance`.

### Step 5: Commit or Rollback
*   **Success**: The transaction is committed:
    ```sql
    COMMIT;
    ```
*   **Failure**: If the balance check fails (e.g. the customer's points were already debited by a concurrent transaction), the database rolls back all writes:
    ```sql
    ROLLBACK;
    ```
    The order is halted, the applied discount is removed, and WordPress returns an error notice to the checkout page: *"Insufficient points balance to complete this purchase."*
