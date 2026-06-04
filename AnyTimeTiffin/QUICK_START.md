# Quick Reference: Google Apps Script Integration

## ✅ What's Integrated

Your AnyTime Tiffin website now sends the following events to Google Apps Script:

| Event | Triggers | Data |
|-------|----------|------|
| 📦 ORDER_PLACED | Customer places order | All order details, items, customer info |
| 🔄 SUBSCRIPTION_CREATED | Customer starts subscription | Plan type, user details, preferences |
| 👤 USER_LOGIN | Customer logs in | Name, mobile, preferences |
| ⚙️ PREFERENCES_UPDATED | Customer changes preferences | Updated spice level, delivery slot, allergies |
| ⏸️ SUBSCRIPTION_STATUS_CHANGED | Customer pauses/resumes | Subscription ID, new status |
| 📍 PINCODE_CHECK | Customer checks pincode | Pincode, serviceability status |
| 🎟️ COUPON_APPLIED | Valid coupon used | Coupon code, discount amount |
| ❌ COUPON_ATTEMPTED | Invalid coupon or min not met | Failed coupon details, reason |
| 🗑️ CART_CLEARED | Customer empties cart | Items list, cart total |

---

## 🚀 Quick Setup (5 minutes)

### 1. Go to Google Apps Script
```
https://script.google.com → New Project
```

### 2. Paste This Code
```javascript
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Event Type", "Data"]);
    }
    
    sheet.appendRow([
      new Date(),
      payload.eventType,
      JSON.stringify(payload.data)
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Deploy as Web App
- Click "Deploy" → "New deployment"
- Type: "Web app"
- Execute as: Your account
- Access: "Anyone"
- Click "Deploy"

### 4. Done! ✅
Data will start flowing to your Google Sheet automatically.

---

## 📊 Expected Data Flow

```
Customer Action → JavaScript Event → Google Apps Script → Google Sheet
     ↓                  ↓                      ↓                  ↓
  Places order    ORDER_PLACED        POST to webhook      Sheet row added
  Logs in         USER_LOGIN          + Timestamp          + Event logged
  Uses coupon     COUPON_APPLIED      + Event data         + Time tracked
```

---

## 📝 Sample Sheet Structure

| Timestamp | Event Type | Data |
|-----------|-----------|------|
| 6/4/2024 10:30 AM | ORDER_PLACED | {"orderId": "ATT-123456", "total": 275, ...} |
| 6/4/2024 10:31 AM | USER_LOGIN | {"userName": "John", "mobile": "98765..."} |
| 6/4/2024 10:35 AM | COUPON_APPLIED | {"couponCode": "MOMLOVE", "discount": 20} |

---

## 🔧 Advanced: Create Separate Sheets Per Event

```javascript
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const eventType = payload.eventType;
  
  let sheet = ss.getSheetByName(eventType);
  if (!sheet) {
    sheet = ss.insertSheet(eventType);
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(["Timestamp", "Data"]);
  }
  
  sheet.appendRow([new Date(), JSON.stringify(payload.data)]);
  
  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 🎯 Use Cases

### Real-time Order Notifications
- Monitor new orders as they come in
- Set up filters to see only specific areas
- Create alerts for high-value orders

### Customer Insights
- Track which coupons work best
- See popular delivery times
- Analyze spice preferences
- Monitor subscription churn

### Business Analytics
- Daily order count
- Revenue tracking
- Customer acquisition
- Pincode analysis

### Automated Actions
- Send confirmation emails
- Create calendar events
- Update inventory
- Generate invoices

---

## ❓ FAQ

**Q: Will this break my website?**
A: No! It uses `no-cors` mode and won't affect functionality.

**Q: Can I see errors?**
A: Yes, open DevTools (F12) → Console tab for logs.

**Q: How do I stop tracking?**
A: Remove the `sendToGoogleAppsScript()` calls from script.js.

**Q: Can I use with another service?**
A: Yes, modify the webhook URL and payload format.

**Q: Is my customer data safe?**
A: Only you have access to your Google Sheet. Ensure proper Google Account security.

---

## 📞 Support

If data isn't appearing:
1. Check Google Sheet has proper permissions
2. Check Apps Script deployment is "Anyone" access
3. Open browser console (F12) for error messages
4. Verify webhook URL matches in config

---

## 🎉 You're All Set!

Your website now automatically tracks:
- ✅ All orders
- ✅ User activity  
- ✅ Subscriptions
- ✅ Preferences
- ✅ Coupon usage
- ✅ Cart interactions
- ✅ Pincode inquiries

Start taking orders and watch the data roll in! 📊
