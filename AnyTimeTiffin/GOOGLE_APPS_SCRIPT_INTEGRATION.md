# Google Apps Script Integration Guide

## Overview
Your AnyTime Tiffin website is now fully integrated with Google Apps Script to automatically track and store customer data. All operations and submissions are sent to your webhook URL.

## Webhook URL
```
https://script.google.com/macros/s/AKfycbzP6yDvx6q5D1pAvr1rGNR0zaiFjj6JhZhz5mQ9eyg2sTtjKq_a4XmTuYuzVR2COZvhiw/exec
```

---

## Tracked Events

### 1. **ORDER_PLACED** ✅
**When:** When a customer completes and places an order through the checkout form.

**Data Sent:**
- Order ID
- Customer name, mobile, location, pincode, tower, flat, floor
- Delivery slot and preferences (spice level, allergies)
- Order items with quantities and prices
- Subtotal, discount, total amount
- Coupon used
- Payment mode (UPI, Cash, etc.)

**Example:**
```json
{
  "timestamp": "2024-06-04T10:30:00Z",
  "eventType": "ORDER_PLACED",
  "data": {
    "orderId": "ATT-123456",
    "customerName": "John Doe",
    "customerMobile": "9876543210",
    "customerLocation": "M3M Soulitude",
    "items": [
      {"title": "Standard Home Tiffin", "quantity": 2, "price": 129},
      {"title": "Plain Roti", "quantity": 3, "price": 7}
    ],
    "total": 275
  }
}
```

---

### 2. **SUBSCRIPTION_CREATED** ✅
**When:** When a customer creates a new subscription (Daily, Weekly, or Monthly plan).

**Data Sent:**
- Subscription ID
- User name and mobile
- Plan type (daily/weekly/monthly)
- Plan title and price
- Meal title
- Preferences (spice level, delivery slot, allergies)

**Example:**
```json
{
  "eventType": "SUBSCRIPTION_CREATED",
  "data": {
    "subscriptionId": "SUB-654321",
    "userName": "Jane Doe",
    "userMobile": "9876543210",
    "planType": "daily",
    "planTitle": "Daily Tiffin Pass",
    "planPrice": "From Rs. 129/day",
    "mealTitle": "Standard Home Tiffin",
    "spiceLevel": "Medium",
    "deliverySlot": "Lunch: 12:00 PM - 2:00 PM"
  }
}
```

---

### 3. **USER_LOGIN** ✅
**When:** When a customer logs in with their name and mobile number.

**Data Sent:**
- User name and mobile
- User preferences (spice level, delivery slot, allergies)

**Example:**
```json
{
  "eventType": "USER_LOGIN",
  "data": {
    "userName": "John Doe",
    "userMobile": "9876543210",
    "preferences": {
      "spiceLevel": "Medium",
      "deliverySlot": "Lunch: 12:00 PM - 2:00 PM",
      "allergies": "None"
    }
  }
}
```

---

### 4. **PREFERENCES_UPDATED** ✅
**When:** When a logged-in customer updates their delivery preferences.

**Data Sent:**
- User name and mobile
- Updated preferences (spice level, delivery slot, allergies)

**Example:**
```json
{
  "eventType": "PREFERENCES_UPDATED",
  "data": {
    "userName": "John Doe",
    "userMobile": "9876543210",
    "preferences": {
      "spiceLevel": "Spicy",
      "deliverySlot": "Dinner: 6:00 PM - 8:00 PM",
      "allergies": "Peanuts"
    }
  }
}
```

---

### 5. **SUBSCRIPTION_STATUS_CHANGED** ✅
**When:** When a customer pauses or resumes their subscription.

**Data Sent:**
- Subscription ID
- User name and mobile
- New status (Active or Paused)
- Plan title

**Example:**
```json
{
  "eventType": "SUBSCRIPTION_STATUS_CHANGED",
  "data": {
    "subscriptionId": "SUB-654321",
    "userName": "John Doe",
    "userMobile": "9876543210",
    "newStatus": "Paused",
    "planTitle": "Daily Tiffin Pass"
  }
}
```

---

### 6. **PINCODE_CHECK** ✅
**When:** When a customer checks if their pincode is serviceable.

**Data Sent:**
- Pincode entered
- Whether it's serviceable (true/false)
- Check timestamp

**Example:**
```json
{
  "eventType": "PINCODE_CHECK",
  "data": {
    "pincode": "122004",
    "isServiceable": true,
    "checkTime": "2024-06-04T10:30:00Z"
  }
}
```

---

### 7. **COUPON_APPLIED** ✅
**When:** When a customer successfully applies a coupon code.

**Data Sent:**
- Coupon code
- Discount amount
- Cart subtotal
- Discount percentage

**Example:**
```json
{
  "eventType": "COUPON_APPLIED",
  "data": {
    "couponCode": "MOMLOVE",
    "discountAmount": 20,
    "subtotal": 500,
    "discountPercentage": "4.00"
  }
}
```

---

### 8. **COUPON_ATTEMPTED** ✅
**When:** When a customer tries to use a coupon but fails (invalid or min value not met).

**Data Sent:**
- Coupon code attempted
- Reason for failure
- Relevant order amounts

**Example:**
```json
{
  "eventType": "COUPON_ATTEMPTED",
  "data": {
    "couponCode": "TIFFIN50",
    "success": false,
    "reason": "Minimum value not met",
    "subtotal": 200,
    "minimumRequired": 300
  }
}
```

---

### 9. **CART_CLEARED** ✅
**When:** When a customer clears their shopping cart.

**Data Sent:**
- Number of items removed
- Cart total before clearing
- List of items that were in the cart

**Example:**
```json
{
  "eventType": "CART_CLEARED",
  "data": {
    "itemsCount": 3,
    "cartTotal": 250,
    "itemsList": [
      {"title": "Standard Home Tiffin", "quantity": 1, "price": 129},
      {"title": "Butter Roti", "quantity": 2, "price": 9}
    ]
  }
}
```

---

## Setting Up Your Google Apps Script

### Step 1: Open Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name it "AnyTime Tiffin Data Logger"

### Step 2: Create a Handler Function
Copy this code into your Apps Script:

```javascript
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Log the full event
    const timestamp = payload.timestamp;
    const eventType = payload.eventType;
    const data = JSON.stringify(payload.data);
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Event Type", "Data (JSON)"]);
    }
    
    // Append the new event
    sheet.appendRow([timestamp, eventType, data]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Data received and logged" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Select "Type" → "Web app"
3. Set "Execute as" → Your Google account
4. Set "Who has access" → "Anyone"
5. Click "Deploy"
6. Copy the deployment URL

### Step 4: (Optional) Create a Better Structure
For better organization, you can create separate sheets for each event type:

```javascript
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const eventType = payload.eventType;
    
    let sheet = ss.getSheetByName(eventType);
    if (!sheet) {
      sheet = ss.insertSheet(eventType);
      sheet.appendRow(getHeaderRow(eventType));
    }
    
    const dataRow = getDataRow(eventType, payload.data);
    sheet.appendRow(dataRow);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getHeaderRow(eventType) {
  const headers = {
    "ORDER_PLACED": ["Timestamp", "Order ID", "Customer Name", "Mobile", "Location", "Total Amount", "Items", "Payment Mode"],
    "USER_LOGIN": ["Timestamp", "User Name", "Mobile", "Spice Level", "Delivery Slot"],
    "SUBSCRIPTION_CREATED": ["Timestamp", "Subscription ID", "User Name", "Mobile", "Plan Type", "Status"],
    "PINCODE_CHECK": ["Timestamp", "Pincode", "Serviceable", "User Mobile"],
    "COUPON_APPLIED": ["Timestamp", "Coupon Code", "Discount Amount", "Subtotal"],
  };
  return headers[eventType] || ["Timestamp", "Data"];
}

function getDataRow(eventType, data) {
  switch(eventType) {
    case "ORDER_PLACED":
      return [new Date(data.createdAt), data.orderId, data.customerName, data.customerMobile, data.customerLocation, data.total, JSON.stringify(data.items), data.paymentMode];
    case "USER_LOGIN":
      return [new Date(), data.userName, data.userMobile, data.preferences.spiceLevel, data.preferences.deliverySlot];
    // Add more cases as needed
    default:
      return [new Date(), JSON.stringify(data)];
  }
}
```

---

## Viewing Your Data

### In Google Sheets
1. Open your Google Sheet
2. All events are logged with timestamps
3. Each row contains: Timestamp | Event Type | Data (as JSON)

### In Google Sheets Dashboard
You can create pivot tables and charts:
1. Go to "Data" → "Pivot table"
2. Create reports by Event Type, Date, or Customer

---

## Testing the Integration

### Manual Test
Open browser console and run:
```javascript
sendToGoogleAppsScript('TEST_EVENT', {
  message: "Testing integration",
  timestamp: new Date().toISOString()
})
```

You should see logs in console and data in your Google Sheet.

---

## Important Notes

⚠️ **CORS Note:** The integration uses `mode: 'no-cors'` to work with Google Apps Script's limitations. You won't see the response in the browser, but the data will be received.

✅ **Data Persistence:** All data is stored in your Google Sheet automatically.

✅ **Real-time Tracking:** Events are logged in real-time as customers interact with your site.

🔄 **Retry Logic:** Failed requests log to browser console for debugging.

---

## Troubleshooting

### Data Not Appearing?
1. Check browser console for errors (F12)
2. Verify Google Apps Script deployment URL is correct
3. Ensure Apps Script is deployed with "Anyone" access
4. Check Google Sheet permissions

### Getting CORS Errors?
This is normal! The data is still being sent. Check your Google Sheet to confirm it's there.

### Need to Modify Events?
Edit the `sendToGoogleAppsScript()` function in `script.js` or modify the data sent in each event handler.

---

## Next Steps

1. ✅ Deploy Google Apps Script
2. ✅ Create Google Sheet 
3. ✅ Test with sample orders
4. ✅ Set up Google Forms for additional data collection
5. ✅ Create automated email notifications for new orders
6. ✅ Build dashboards in Google Data Studio

Your website is now ready to fully track all customer operations! 🎉
