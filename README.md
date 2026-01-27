# Payment Intent API

A Node.js + Express backend service for handling real-estate booking payment intents.

## Features

- **Create Payment Intent**: Mock implementation of payment provider integration.
- **Idempotency**: Prevents duplicate processing of the same request using `Idempotency-Key` header.
- **Duplicate Payment Prevention**: Ensures a user cannot pay for the same property multiple times.
- **File-based Persistence**: Stores transactions and keys in local JSON files (`data/`).

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository or navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the server on port 3000:

```bash
node index.js
```

## API Documentation

### Create Payment Intent

**URL**: `/api/payments/create-intent`
**Method**: `POST`

**Headers**:
- `Content-Type`: `application/json`
- `Idempotency-Key`: `string` (Optional but recommended)

**Body**:
```json
{
  "propertyId": "string",
  "userId": "string",
  "amount": number,
  "currency": "USD" | "EUR"
}
```

**Success Response (201 Created / 200 OK)**:
```json
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_...",
  "status": "PENDING"
}
```

**Error Responses**:
- `400 Bad Request`: Missing fields or invalid amount.
- `409 Conflict`: Duplicate payment detected.

## Testing

A verification script is included to test the API scenarios using `curl`.

```bash
sh verify.sh
```

This will run tests for:
1. Valid Request
2. Idempotency Check (Retrying with same key)
3. Duplicate Payment Check (Same user, same property)
4. Invalid Input
