---
title: FAQ
description: Frequently asked questions about the LoyaltyBay WooCommerce plugin.
---

Here are answers to the most common questions about configuring, using, and extending LoyaltyBay.

---

## General Questions

### What is LoyaltyBay?
LoyaltyBay is a high-performance customer retention and rewards engine for WooCommerce. It lets customers earn points for purchases, account registrations, and product reviews, which they can redeem for discounts during checkout.

### Does it work with the WooCommerce Block Checkout?
Yes. LoyaltyBay is fully compatible with modern, React-based WooCommerce Checkout Blocks. It registers a custom points slider block in the checkout flow. It also supports traditional WooCommerce Classic Checkout templates.

### Does it support guest checkout?
Customers must have a registered account to earn or redeem points. Guests cannot earn points. However, LoyaltyBay displays helpful notices at checkout encouraging guest shoppers to create an account to secure the points their order would generate.

---

## Point Earning Questions

### When are points credited to a customer's account?
Points are credited automatically when an order's status changes to the configured trigger value. By default, this is set to **Completed**, but it can be changed to **Processing** in the plugin settings.

### Can I exclude certain products or categories from earning points?
Yes. Earning rules allow you to exclude specific products or entire categories. If a customer checks out with a mixed cart, the system automatically subtracts the excluded items' value before calculating points.

### What happens if an order is refunded?
If an order is fully or partially refunded, the points earned from that order are automatically debited (clawed back). If the customer has already spent those points, their balance is allowed to go **negative** to prevent return-policy exploitation.

---

## Point Redemption Questions

### How do customers redeem points?
Logged-in customers who meet the minimum point balance requirement will see a points slider or input field at checkout. They can choose how many points to apply, see a live preview of the discount, and apply it to their cart.

### What is the difference between Fee and Coupon redemption modes?
*   **Cart Fee (Fee) Mode**: Applies the discount as a negative fee to the cart. It offers a very clean presentation but can conflict with third-party automated tax software.
*   **Virtual Coupon Mode**: Generates a temporary coupon code on the fly. This has 100% compatibility with third-party automated tax and multi-currency services.

### Can customers partially redeem their points?
Yes. If enabled in settings, customers can use a slider at checkout to select exactly how many points they wish to redeem, up to their available balance or the maximum allowed order discount.

### How are concurrent double-spend attempts prevented?
LoyaltyBay opens a database transaction and requests a row lock (`SELECT ... FOR UPDATE`) on the user's balance cache. If a second request tries to redeem the same points before the first commits, the database blocks it until the first completes. The second transaction then reads the new, depleted balance and safely aborts.

---

## Technical Questions

### What database tables does the plugin create?
LoyaltyBay creates three custom database tables on activation:
1.  `wp_loyaltybay_ledger` — Logs every credit and debit transaction.
2.  `wp_loyaltybay_ledger_cache` — Caches user balances for high performance.
3.  `wp_loyaltybay_cron_log` — Tracks scheduled background jobs.

### Is data deleted when the plugin is uninstalled?
By default, plugin data is preserved. It will only be permanently deleted if the **Delete All on Uninstall** option is checked in the plugin's admin settings prior to deletion.
