---
title: VIP Tiers
description: Detailed guide on VIP customer tiers, rolling points checks, and developer hooks.
---

VIP Tiers allow you to reward your most loyal customers with increased earning rates. Customers automatically progress through tiers as they earn points on your store.

---

## Default VIP Tiers

By default, the plugin includes the following tier configuration:

| Tier Level | Required Points (Lifetime) | Earning Multiplier | Description |
|---|---|---|---|
| **Bronze** | `0` points | `1.0x` | Standard tier for all registered users. |
| **Silver** | `1,000` points | `1.5x` | Earns 50% more points on purchases. |
| **Gold** | `5,000` points | `2.0x` | Earns double points on purchases. |
| **Platinum** | `10,000` points | `3.0x` | Earns triple points on purchases. |

---

## How VIP Tiers Work

### 1. Lifetime Points Qualification
Unlike current balance (which decreases when points are spent), VIP Tiers are calculated using the customer's **total lifetime credits** (all earned points) over a rolling 365-day period.

### 2. Multiplier Application
When a customer makes a purchase, the system calculates their base points and multiplies the total by their current tier's earning multiplier.
*   *Example*: A customer in the **Gold** tier (2.0x) places an order with a subtotal of $100.
    *   Base points earned: 100 points.
    *   Tier points credited: $100 \times 1 \text{ pt/\$} \times 2.0 = 200$ points.

---

## Technical Details & Database Queries

### Meta Storage
*   The customer's active tier slug (e.g. `gold`) is saved in the WordPress `wp_usermeta` table under the metadata key **`loyaltybay_vip_tier`**.

### The Recalculation Query
To determine a customer's tier, the system runs a sum query on the custom ledger table:

```sql
SELECT SUM(amount) 
FROM wp_loyaltybay_ledger 
WHERE user_id = %d 
  AND transaction_type = 'credit' 
  AND created_at >= DATE_SUB(NOW(), INTERVAL 365 DAY);
```
*This rolling check ensures that customers remain active to maintain their VIP privileges.*

---

## Automatic Recalculation (WP-Cron)

Tiers are recalculated in the background automatically:

*   **Real-time Upgrades**: When a customer is credited with points (e.g. after order completion), the system checks if their lifetime points qualify them for a higher tier. If so, they are upgraded immediately, their user meta (`loyaltybay_vip_tier`) is updated, and a custom action `loyaltybay_tier_changed` is fired.
*   **Daily Batch Recalculation**: A scheduled daily background job (`loyaltybay_cron_recalculate_tiers`) executes to audit all user accounts. This ensures that users who should drop tiers due to points expiring, or who qualify for upgrades through non-purchase actions, are updated.
*   **Execution Logs**: Admins can audit tier recalculation cron runs in the database log table `{prefix}_loyaltybay_cron_log`.

---

## Developer Customization: Adding Custom Tiers

Developers can override the default VIP levels entirely by hooking into the **`loyaltybay_vip_tiers`** filter. 

Add the following helper function to your child theme's `functions.php` file to register a custom tier:

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
            'multiplier' => 1.2,
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
*This code registers a new "Diamond VIP" tier and adjusts the Silver/Gold multiplier rates.*
