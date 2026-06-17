---
title: Hooks & Filters
description: Developer guide to customizing and extending LoyaltyBay using WordPress actions and filters.
---

LoyaltyBay is built following WordPress extensibility standards. Developers can use custom actions and filters to hook into point events, alter calculations, or custom-define loyalty tiers.

---

## Action Hooks

Action hooks let you trigger custom code when specific events occur within the plugin.

### `loyaltybay_points_credited`
Fires immediately after points are successfully credited to a customer's balance.
*   **Parameters**:
    *   `$user_id` (int): Customer User ID.
    *   `$amount` (float): Points credited.
    *   `$reference_type` (string): Credit source (`order`, `review`, `registration`, `referral`, `admin`).
    *   `$reference_id` (int): Source database ID (e.g. Order ID, User ID, Comment ID).

### `loyaltybay_points_debited`
Fires immediately after points are successfully debited (subtracted) from a customer's balance.
*   **Parameters**: Same parameters as `loyaltybay_points_credited`.

### `loyaltybay_tier_changed`
Fires when a customer qualifies for a new VIP loyalty tier and their meta is updated.
*   **Parameters**:
    *   `$user_id` (int): Customer User ID.
    *   `$new_tier` (string): Slug of the newly assigned tier.
    *   `$old_tier` (string): Slug of the previous tier.

### `loyaltybay_referral_processed`
Fires when a new referral has been successfully registered and credited to the referrer.
*   **Parameters**:
    *   `$referrer_id` (int): Referrer User ID.
    *   `$referee_id` (int): Referee (buyer) User ID.
    *   `$order_id` (int): Qualifying order ID.

---

## Filter Hooks

Filter hooks let you modify values or structures used by LoyaltyBay before they are processed or saved.

### `loyaltybay_calculate_order_points`
Allows you to alter the point amount calculated for a WooCommerce order before it is written to the ledger.
*   **Parameters**:
    *   `$points` (float): Calculated points.
    *   `$order_total` (float): Order total subtotal.
    *   `$user_id` (int): Customer User ID.

### `loyaltybay_order_excluded`
Allows you to programmatically exclude an order from earning points.
*   **Parameters**:
    *   `$excluded` (bool): Default is `false` (or `true` if category/product settings exclude it).
    *   `$order_id` (int): WooCommerce Order ID.

### `loyaltybay_earning_order_total`
Filters the order subtotal amount used for the base point calculation.
*   **Parameters**:
    *   `$order_total` (float): Subtotal value.
    *   `$order` (WC_Order): Full WooCommerce order object.

### `loyaltybay_vip_tiers`
Allows custom tier configurations (names, thresholds, multipliers) to be injected.
*   **Parameters**:
    *   `$tiers` (array): Array of active tiers.

### `loyaltybay_cron_jobs`
Allows developers to hook custom classes into the plugin's self-healing cron engine.
*   **Parameters**:
    *   `$jobs` (array): Array of registered cron job class strings.

---

## WooCommerce Hook Integrations

For debugging compatibility, here are the main WooCommerce hooks that LoyaltyBay subscribes to:

*   `woocommerce_order_status_completed`: Credits points to customer accounts.
*   `woocommerce_order_refunded`: Triggers refund point clawbacks.
*   `woocommerce_checkout_order_processed`: Finalizes point redemptions and ledger debits.
*   `woocommerce_cart_calculate_fees`: Applies point discounts (Fee Mode).
*   `woocommerce_get_shop_coupon_data`: Injects virtual coupons (Coupon Mode).

---

## Developer Code Examples

Place these code snippets in your child theme's `functions.php` file or a custom site-specific utility plugin.

### Example 1: Exclude Items on Sale from Earning Points

Prevent customers from earning loyalty points on products that are currently marked down or on sale.

```php
add_filter( 'loyaltybay_calculate_order_points', 'exclude_sale_items_from_loyalty_earning', 10, 3 );

function exclude_sale_items_from_loyalty_earning( $points, $order_total, $user_id ) {
    // Return 0 if the customer has items on sale in their order
    // You can implement custom loops checking order items for is_on_sale()
    return $points; 
}
```

### Example 2: Double Points on Weekends

Run a weekend promotion where purchases earn twice the standard point rate.

```php
add_filter( 'loyaltybay_calculate_order_points', 'double_points_on_weekends', 10, 3 );

function double_points_on_weekends( $points, $order_total, $user_id ) {
    $day_of_week = date('N'); // 1 (Monday) through 7 (Sunday)
    
    if ( in_array( $day_of_week, [ 6, 7 ] ) ) {
        $points = $points * 2;
    }
    
    return $points;
}
```

### Example 3: Customizing VIP Tiers

Developers can override the default VIP levels entirely by hooking into the **`loyaltybay_vip_tiers`** filter.

```php
add_filter( 'loyaltybay_vip_tiers', 'custom_loyaltybay_vip_tiers' );

function custom_loyaltybay_vip_tiers( $tiers ) {
    return [
        'bronze' => [
            'name'       => 'Bronze Member',
            'threshold'  => 0,
            'multiplier' => 1.0,
        ],
        'silver' => [
            'name'       => 'Silver VIP',
            'threshold'  => 500,
            'multiplier' => 1.25,
        ],
        'gold' => [
            'name'       => 'Gold VIP',
            'threshold'  => 2000,
            'multiplier' => 1.5,
        ],
        'diamond' => [
            'name'       => 'Diamond VIP',
            'threshold'  => 5000,
            'multiplier' => 2.0,
        ],
    ];
}
```

### Example 4: Registering a Custom Background Cron Job

Add a custom scheduled task to LoyaltyBay's cron manager (`Core\Cron`) with error logging:

```php
add_filter( 'loyaltybay_cron_jobs', 'register_my_custom_loyalty_cron' );

function register_my_custom_loyalty_cron( $jobs ) {
    $jobs[] = \MyCustomNamespace\MyCustomCronJob::class;
    return $jobs;
}

// Custom Class Definition
namespace MyCustomNamespace;

class MyCustomCronJob {
    public static function run() {
        // Run scheduled tasks here...
        // Use loyaltybay_log() to write execution output
        loyaltybay_log( "MyCustomCronJob executed successfully." );
    }
}
```
*This integrates your custom job into the self-healing cron runner.*
