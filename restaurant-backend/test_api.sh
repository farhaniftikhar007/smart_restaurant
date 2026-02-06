#!/bin/bash

echo "🔐 Testing Authentication & All Features..."
echo ""

# 1. Login as customer
echo "1️⃣ Logging in as customer..."
CUSTOMER_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"customer123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "✅ Customer token obtained"
echo ""

# 2. Place an order
echo "2️⃣ Placing an order..."
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "table_number": "12",
    "notes": "Test order",
    "items": [
      {"menu_item_id": 4, "quantity": 1},
      {"menu_item_id": 6, "quantity": 2}
    ]
  }')

ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "✅ Order created with ID: $ORDER_ID"
echo ""

# 3. View customer orders
echo "3️⃣ Viewing customer orders..."
curl -s -X GET http://localhost:8000/api/orders \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  | python3 -m json.tool | head -20
echo ""

# 4. Login as admin
echo "4️⃣ Logging in as admin..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "✅ Admin token obtained"
echo ""

# 5. View restaurant stats
echo "5️⃣ Viewing restaurant statistics..."
curl -s -X GET http://localhost:8000/api/restaurant/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | python3 -m json.tool
echo ""

# 6. Update order status
if [ ! -z "$ORDER_ID" ]; then
  echo "6️⃣ Updating order status to 'confirmed'..."
  curl -s -X PATCH http://localhost:8000/api/orders/$ORDER_ID/status \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{"status": "confirmed"}' \
    | python3 -m json.tool | head -10
  echo ""
fi

# 7. Get menu categories
echo "7️⃣ Getting menu categories..."
curl -s http://localhost:8000/api/menu/categories/all | python3 -m json.tool
echo ""

echo "✅ All tests completed!"
