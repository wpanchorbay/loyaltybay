# LoyaltyBay Documentation Screenshot Manifest

This file lists all the contextual screenshots required for the LoyaltyBay documentation. For each screenshot, there is a target filename, the page and section where it will be referenced, and details on what needs to be captured.

These screenshots should be saved in the docs repository under `/home/sdd/Documents/campaign-bay-testing/docs/loyaltybay/public/assets/screenshots/`.

---

## 1. Getting Started

### `getting-started-install-upload.png`
- **Used in**: `getting-started/installation.md` -> Section: *WordPress Admin Installation*
- **Description**: Screenshot of the WordPress `Plugins > Add New` admin page with the "Upload Plugin" form open and file chooser visible.
- **Key Highlight**: The "Choose File" button and "Install Now" button.

### `getting-started-install-activate.png`
- **Used in**: `getting-started/installation.md` -> Section: *Activation*
- **Description**: Screenshot of the Plugins list showing the `LoyaltyBay` card after uploading.
- **Key Highlight**: The blue "Activate" link/button for the LoyaltyBay plugin.

### `getting-started-menu-highlight.png`
- **Used in**: `getting-started/installation.md` -> Section: *Post-Installation*
- **Description**: Screenshot of the WordPress admin sidebar.
- **Key Highlight**: The `WooCommerce > Loyalty` submenu item highlighted/active.

### `setup-conversion-rates.png`
- **Used in**: `getting-started/initial-setup.md` -> Section: *Step 1: Earning Rules*
- **Description**: Settings page under Earning Points section.
- **Key Highlight**: The "Points per Dollar" input showing value `1` and "Point Value" showing `0.01`.

### `setup-redemption-mode.png`
- **Used in**: `getting-started/initial-setup.md` -> Section: *Step 2: Configure Redemption Rules*
- **Description**: Settings page under Redemption Rules section.
- **Key Highlight**: The "Redemption Mode" dropdown highlighting selection options (`Cart Fee` and `Virtual Coupon`).

### `setup-test-order-totals.png`
- **Used in**: `getting-started/initial-setup.md` -> Section: *Step 3: Test the Flow*
- **Description**: WooCommerce Order details page totals table in the backend admin for a test order.
- **Key Highlight**: Row indicating "Points Earned: X Points" in order totals.

---

## 2. Features

### `earning-status-trigger.png`
- **Used in**: `features/earning-points.md` -> Section: *Earning Settings*
- **Description**: Settings page, Earning Points section.
- **Key Highlight**: The dropdown for order status trigger (e.g. `Completed`).

### `earning-bonus-settings.png`
- **Used in**: `features/earning-points.md` -> Section: *Registration & Product Review Settings*
- **Description**: Settings page, Earning Points section.
- **Key Highlight**: The input boxes for "Points for Registration" and "Points for Product Review".

### `earning-checkout-notice.png`
- **Used in**: `features/earning-points.md` -> Section: *Checkout Earn Notice*
- **Description**: The checkout page frontend (Block Checkout layout).
- **Key Highlight**: The "Create an account to earn X points on this order!" notice box above the checkout button.

### `earning-refund-clawback.png`
- **Used in**: `features/earning-points.md` -> Section: *Refund Clawbacks*
- **Description**: WooCommerce Order detail screen in admin after a refund is processed.
- **Key Highlight**: The ledger row showing negative points adjustment matching the refund amount.

### `redemption-mode-setting.png`
- **Used in**: `features/redeeming-points.md` -> Section: *Fee Mode vs. Coupon Mode*
- **Description**: Settings page, Redemption Rules tab.
- **Key Highlight**: The "Redemption Mode" dropdown selector highlighting "Fee" or "Coupon".

### `redemption-min-points-setting.png`
- **Used in**: `features/redeeming-points.md` -> Section: *Minimum Points Limit*
- **Description**: Settings page, Redemption Rules tab.
- **Key Highlight**: The "Minimum Points to Redeem" input showing `100`.

### `redemption-checkout-block-slider.png`
- **Used in**: `features/redeeming-points.md` -> Section: *Redemption UI (Block Checkout)*
- **Description**: WooCommerce block checkout page on storefront.
- **Key Highlight**: The React points slider widget showing user balance, slider control, and "Apply Discount" button.

### `tiers-admin-repeater.png`
- **Used in**: `features/vip-tiers.md` -> Section: *VIP Tiers Configuration*
- **Description**: Settings page, Referrals & VIP Tiers tab.
- **Key Highlight**: The repeater rows containing fields for Tier Name, Threshold (Points), and Multiplier (e.g. Bronze, Silver, Gold, Platinum).

### `tiers-my-account-progress.png`
- **Used in**: `features/vip-tiers.md` -> Section: *Customer Account Tier display*
- **Description**: Customer's My Account -> My Rewards page dashboard.
- **Key Highlight**: The progress bar widget displaying the current VIP tier and progress/points remaining until the next tier.

### `referrals-admin-settings.png`
- **Used in**: `features/referral-program.md` -> Section: *Referral Settings*
- **Description**: Settings page, Referrals & VIP Tiers tab.
- **Key Highlight**: Checkbox for "Enable Referrals", and input for "Referral Bonus Points".

### `referrals-my-account-link.png`
- **Used in**: `features/referral-program.md` -> Section: *Customer My Account Referral panel*
- **Description**: Customer's My Account -> My Rewards page.
- **Key Highlight**: The Referral Link card featuring the unique URL `/?ref=X` and the "Copy URL" button.

### `dashboard-balance-widget.png`
- **Used in**: `features/customer-dashboard.md` -> Section: *Points Balance widget*
- **Description**: Customer's My Account -> My Rewards page.
- **Key Highlight**: The header widget card showing the large points balance, e.g. "1,250 Points".

### `dashboard-history-table.png`
- **Used in**: `features/customer-dashboard.md` -> Section: *Transaction History table*
- **Description**: Customer's My Account -> My Rewards page.
- **Key Highlight**: The transactions list table displaying transaction date, points amount (green/red badges), type, and description.

---

## 3. Admin Guide

### `ledger-admin-main.png`
- **Used in**: `admin/points-ledger.md` -> Section: *Admin Ledger Overview*
- **Description**: Admin screen at `WooCommerce > Loyalty`.
- **Key Highlight**: The main transactions ledger list showing paginated user point entries.

### `ledger-export-btn.png`
- **Used in**: `admin/points-ledger.md` -> Section: *CSV Export*
- **Description**: Top right action bar on the Admin Ledger page.
- **Key Highlight**: The "Export to CSV" button.

### `ledger-adjust-points-modal.png`
- **Used in**: `admin/manual-adjustments.md` -> Section: *Adjust Points Form*
- **Description**: Admin Ledger page with the inline manual adjustment form expanded.
- **Key Highlight**: Form inputs: search user autocomplete, action select (Credit/Debit), points amount, and reason.

### `ledger-manual-entry-log.png`
- **Used in**: `admin/manual-adjustments.md` -> Section: *Audit Logs in Ledger*
- **Description**: Admin Ledger table showing a manual transaction.
- **Key Highlight**: The ledger row indicating reference type as "admin" and the description showing the custom reason entered.

### `settings-tabs-overview.png`
- **Used in**: `admin/settings-reference.md` -> Section: *WooCommerce Integration Settings Tab*
- **Description**: WooCommerce Settings page showing the tabbed interface.
- **Key Highlight**: The tab bar containing "Earning Points", "Redemption Rules", "Referrals & VIP Tiers", and "Display & System".
