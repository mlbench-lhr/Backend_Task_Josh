#!/bin/bash

BASE_URL="http://localhost:3000/api/payments"

echo "--- 1. Valid Request ---"
curl -X POST "$BASE_URL/create-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop_123",
    "userId": "user_456",
    "amount": 500,
    "currency": "USD"
  }'
echo "\n"

echo "--- 2. Idempotency Check (Same Key) ---"
# Utilizing a unique key for this test
KEY="idemp_$(date +%s)"
curl -v -X POST "$BASE_URL/create-intent" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -d '{
    "propertyId": "prop_789",
    "userId": "user_101",
    "amount": 1000,
    "currency": "USD"
  }'
echo "\nRETRY:"
curl -v -X POST "$BASE_URL/create-intent" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -d '{
    "propertyId": "prop_789",
    "userId": "user_101",
    "amount": 1000,
    "currency": "USD"
  }'
echo "\n"

echo "--- 3. Duplicate Payment Check (Same User, Same Property) ---"
curl -X POST "$BASE_URL/create-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop_123",
    "userId": "user_456",
    "amount": 500,
    "currency": "USD"
  }'
echo "\n"

echo "--- 4. Invalid Input ---"
curl -X POST "$BASE_URL/create-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop_000"
  }'
echo "\n"
