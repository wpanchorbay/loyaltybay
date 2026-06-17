---
title: REST API Reference
description: Technical documentation for the LoyaltyBay WP REST API endpoints.
---

LoyaltyBay Pro exposes a series of REST API endpoints. This page details the authorization checks, validation systems, endpoint requests, and JSON payloads.

---

## Authentication & Authorization

All API endpoints require verification using standard WordPress REST API authentication headers.

*   **Admin Endpoints**: Require the `manage_loyaltybay` capability. By default, this is granted to WordPress users with the `administrator` role.
*   **Customer Endpoints**: Verify that the requester is a logged-in user (`is_user_logged_in()`) or has an active WooCommerce session token.
*   **CSRF Protection**: All calls must include a valid WordPress Nonce passed in the **`X-WP-Nonce`** header.

### Common Error Response Codes:
*   **`401 Unauthorized`**: Nonce header is missing, expired, or invalid.
*   **`403 Forbidden`**: The user is authenticated but lacks the required capabilities (e.g. non-admin trying to fetch settings).

---

## Input Validation & Error Handling

All controller routes inherit validation logic from the abstract base class `Api\ApiController`.

### 1. Rakit Validator
The plugin processes input validation using the **Rakit Validator** library inside PHP.
*   *Validation Rules*: Parameters check for data types (integer, numeric), format constraints (ISO dates), values boundaries (min/max), and requirements.

### 2. Validation Error Handling
If a request fails validation, the API returns a `422 Unprocessable Entity` status with a structured error array containing field-specific error messages.

#### Sample Validation Error Payload:
```json
{
  "code": "rest_invalid_param",
  "message": "Invalid parameter(s).",
  "data": {
    "status": 422,
    "errors": {
      "user_id": {
        "required": "The user_id field is required."
      },
      "amount": {
        "numeric": "The amount must be a number."
      }
    }
  }
}
```

*On the React frontend, the utility function `flattenErrors()` parses this object and maps the nested error fields into flat dot-notation structures (e.g. `"errors.user_id"`) to update form input fields in real time.*

---

## Endpoints Reference

### 1. Settings Endpoints

#### Retrieve Settings
*   **Route**: `GET /settings`
*   **Authorization**: `manage_loyaltybay`
*   **Response (200 OK)**:
    ```json
    {
      "earning_pointsPerDollar": 1,
      "earning_pointsForRegistration": 0,
      "earning_pointsForReview": 0,
      "redemption_pointsValue": 0.01,
      "redemption_mode": "fee",
      "redemption_minPoints": 100,
      "referrals_enabled": false,
      "referrals_bonusPoints": 1000,
      "referrals_newCustomerDiscount": 10.00,
      "tiers_enabled": false,
      "display_guestNoticeEnabled": true,
      "advanced_deleteAllOnUninstall": false,
      "debug_enableMode": false
    }
    ```

#### Update Settings
*   **Route**: `POST /settings`
*   **Authorization**: `manage_loyaltybay`
*   **Payload (JSON)**: Contains settings keys to update. Sanitized using WordPress settings validation schema.
*   **Response (200 OK)**: Full updated settings JSON object.

---

### 2. Ledger & User Points Endpoints

#### List Ledger Entries
*   **Route**: `GET /ledger`
*   **Authorization**: `manage_loyaltybay`
*   **Query Parameters**:
    *   `page` (int, default: 1): Pagination index.
    *   `per_page` (int, default: 20): Number of entries per page.
    *   `user_id` (int, optional): Filter by WordPress User ID.
    *   `transaction_type` (string, optional): `credit` or `debit`.
    *   `reference_type` (string, optional): `order`, `refund`, `registration`, `review`, `referral`, `admin`, `expiry`.
    *   `date_from` (string, optional): Filter start date (YYYY-MM-DD).
    *   `date_to` (string, optional): Filter end date (YYYY-MM-DD).
*   **Response Headers**:
    *   `X-WP-Total`: Total records matching query.
    *   `X-WP-TotalPages`: Total available pages.
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": 45,
        "user_id": 8,
        "transaction_type": "credit",
        "amount": "150.00",
        "reference_type": "order",
        "reference_id": 2045,
        "description": "Points earned for order #2045",
        "expires_at": null,
        "created_at": "2026-06-17 11:32:00"
      }
    ]
    ```

#### Adjust Customer Points
*   **Route**: `POST /user-points`
*   **Authorization**: `manage_loyaltybay`
*   **Payload (JSON)**:
    *   `user_id` (int, required): Target customer User ID.
    *   `amount` (int, required): Point adjust value (positive integer).
    *   `type` (string, required): `credit` or `debit`.
    *   `reason` (string, required): Saved in the description column (1-255 characters).
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Transaction completed successfully",
      "entry_id": 46,
      "new_balance": 1400
    }
    ```

#### Autocomplete User Search
*   **Route**: `GET /user-points/search-users`
*   **Authorization**: `manage_loyaltybay`
*   **Query Parameters**:
    *   `search` (string, required): Searches user table matching display name or email.
    *   `limit` (int, optional): Default: `10`.
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": 8,
        "display_name": "Finance Felix",
        "user_email": "felix@example.com",
        "balance": 1250
      }
    ]
    ```

#### CSV Export
*   **Route**: `GET /export/ledger`
*   **Authorization**: `manage_loyaltybay`
*   **Query Parameters**: Same as `GET /ledger` endpoint.
*   **Response (200 OK)**: Streams CSV file download directly.

---

### 3. Storefront Checkout Endpoints

#### Apply Points Redemption
*   **Route**: `POST /redeem`
*   **Authorization**: Logged-in Customer.
*   **Payload (JSON)**:
    *   `points` (int, required): The points amount to redeem. Must meet minimum point settings and must not exceed the customer's balance.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Discount applied successfully",
      "applied_points": 500,
      "discount_value": 5.00
    }
    ```

#### Remove Points Redemption
*   **Route**: `DELETE /redeem`
*   **Authorization**: Logged-in Customer.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Redemption removed successfully"
    }
    ```
