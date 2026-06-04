# Advanced Google Apps Script Examples

## Example 1: Organize by Event Type (Separate Sheets)

```javascript
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const eventType = payload.eventType;
    const data = payload.data;
    
    // Get or create sheet for this event type
    let sheet = ss.getSheetByName(eventType);
    if (!sheet) {
      sheet = ss.insertSheet(eventType);
      addHeaderRow(sheet, eventType);
    }
    
    // Add data row
    const row = formatDataRow(eventType, data);
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, sheet: eventType })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    logError(error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function addHeaderRow(sheet, eventType) {
  const headers = {
    "ORDER_PLACED": ["Timestamp", "Order ID", "Customer", "Mobile", "Total", "Items Count", "Payment Mode", "Location"],
    "USER_LOGIN": ["Timestamp", "Name", "Mobile", "Spice", "Slot", "Allergies"],
    "SUBSCRIPTION_CREATED": ["Timestamp", "Sub ID", "Name", "Mobile", "Plan Type", "Price", "Status"],
    "PINCODE_CHECK": ["Timestamp", "Pincode", "Serviceable", "Status"],
    "COUPON_APPLIED": ["Timestamp", "Coupon", "Discount", "Subtotal", "Percentage"],
    "COUPON_ATTEMPTED": ["Timestamp", "Coupon", "Reason", "Subtotal"],
    "CART_CLEARED": ["Timestamp", "Items Count", "Cart Total"],
    "PREFERENCES_UPDATED": ["Timestamp", "Name", "Mobile", "Spice", "Slot"],
    "SUBSCRIPTION_STATUS_CHANGED": ["Timestamp", "Sub ID", "Name", "New Status", "Plan"]
  };
  
  const header = headers[eventType] || ["Timestamp", "Event", "Data"];
  sheet.appendRow(header);
  
  // Format header
  const range = sheet.getRange(1, 1, 1, header.length);
  range.setBackground("#4285F4");
  range.setFontColor("white");
  range.setFontWeight("bold");
}

function formatDataRow(eventType, data) {
  const now = new Date();
  
  switch(eventType) {
    case "ORDER_PLACED":
      return [
        now,
        data.orderId,
        data.customerName,
        data.customerMobile,
        "Rs. " + data.total,
        data.items.length,
        data.paymentMode,
        data.customerLocation
      ];
    
    case "USER_LOGIN":
      return [
        now,
        data.userName,
        data.userMobile,
        data.preferences.spiceLevel,
        data.preferences.deliverySlot,
        data.preferences.allergies
      ];
    
    case "SUBSCRIPTION_CREATED":
      return [
        now,
        data.subscriptionId,
        data.userName,
        data.userMobile,
        data.planType,
        data.planPrice,
        data.status
      ];
    
    case "PINCODE_CHECK":
      return [
        now,
        data.pincode,
        data.isServiceable ? "Yes" : "No",
        data.isServiceable ? "Serviceable" : "Not Serviceable"
      ];
    
    case "COUPON_APPLIED":
      return [
        now,
        data.couponCode,
        "Rs. " + data.discountAmount,
        "Rs. " + data.subtotal,
        data.discountPercentage + "%"
      ];
    
    case "COUPON_ATTEMPTED":
      return [
        now,
        data.couponCode,
        data.reason,
        "Rs. " + data.subtotal
      ];
    
    case "CART_CLEARED":
      return [
        now,
        data.itemsCount,
        "Rs. " + data.cartTotal
      ];
    
    case "PREFERENCES_UPDATED":
      return [
        now,
        data.userName,
        data.userMobile,
        data.preferences.spiceLevel,
        data.preferences.deliverySlot
      ];
    
    case "SUBSCRIPTION_STATUS_CHANGED":
      return [
        now,
        data.subscriptionId,
        data.userName,
        data.newStatus,
        data.planTitle
      ];
    
    default:
      return [now, eventType, JSON.stringify(data)];
  }
}

function logError(error) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let errorSheet = ss.getSheetByName("Errors");
  if (!errorSheet) {
    errorSheet = ss.insertSheet("Errors");
    errorSheet.appendRow(["Timestamp", "Error Message", "Stack"]);
  }
  errorSheet.appendRow([new Date(), error.toString(), error.stack]);
}
```

---

## Example 2: Email Notifications for New Orders

Add this to your Apps Script:

```javascript
function onOrderPlaced(data) {
  const recipient = "owner@example.com"; // Change to your email
  const subject = `🍽️ New Order: ${data.orderId}`;
  
  const message = `
New Order Received!

📋 Order ID: ${data.orderId}
👤 Customer: ${data.customerName}
📱 Mobile: ${data.customerMobile}

📍 Location: ${data.customerLocation}, ${data.customerTower}/${data.customerFlat}
⏰ Delivery Slot: ${data.deliverySlot}

🌶️ Spice Level: ${data.spiceLevel}
❤️ Allergies: ${data.allergies || 'None'}

📦 Items:
${data.items.map((item, i) => `${i+1}. ${item.title} x${item.quantity} = Rs. ${item.qty * item.price}`).join('\n')}

💰 Subtotal: Rs. ${data.subtotal}
🎟️ Coupon: ${data.coupon}
💬 Discount: Rs. ${data.discount}
💵 Total: Rs. ${data.total}
💳 Payment: ${data.paymentMode}

${data.instructions ? `📝 Instructions: ${data.instructions}` : ''}

---
Check your spreadsheet for full details.
  `;
  
  GmailApp.sendEmail(recipient, subject, message);
}

// Modify doPost to call this
// In the "ORDER_PLACED" case, add:
// onOrderPlaced(data);
```

---

## Example 3: Daily Summary Report

```javascript
function sendDailySummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName("ORDER_PLACED");
  
  if (!ordersSheet) return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const data = ordersSheet.getDataRange().getValues();
  let totalOrders = 0;
  let totalRevenue = 0;
  const orders = [];
  
  for (let i = 1; i < data.length; i++) {
    const timestamp = new Date(data[i][0]);
    if (timestamp >= today) {
      totalOrders++;
      const total = parseFloat(data[i][4].replace("Rs. ", ""));
      totalRevenue += total;
      orders.push({
        orderId: data[i][1],
        customer: data[i][2],
        total: data[i][4]
      });
    }
  }
  
  const message = `
📊 Daily Summary Report

📅 Date: ${today.toLocaleDateString()}

📦 Total Orders: ${totalOrders}
💰 Total Revenue: Rs. ${totalRevenue}
📈 Average Order: Rs. ${(totalRevenue / totalOrders).toFixed(2)}

Top Orders:
${orders.slice(0, 5).map(o => `- ${o.orderId} | ${o.customer} | ${o.total}`).join('\n')}
  `;
  
  GmailApp.sendEmail("owner@example.com", "📊 Daily Summary", message);
}

// Schedule this to run daily:
// In Apps Script: Triggers → Create new trigger → Daily at 8 PM
```

---

## Example 4: Real-time Order Notification (Advanced)

```javascript
function sendSlackNotification(data) {
  // First, set up a Slack webhook:
  // 1. Go to https://api.slack.com/messaging/webhooks
  // 2. Create a new webhook and copy the URL
  
  const webhookUrl = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL";
  
  const payload = {
    text: "🍽️ New Order",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Order: ${data.orderId}*\n*Customer:* ${data.customerName}\n*Total:* Rs. ${data.total}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Mobile:*\n${data.customerMobile}`
          },
          {
            type: "mrkdwn",
            text: `*Location:*\n${data.customerTower}/${data.customerFlat}`
          }
        ]
      }
    ]
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(webhookUrl, options);
}
```

---

## Example 5: Customer Database

```javascript
function createCustomerDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let customerSheet = ss.getSheetByName("Customers");
  
  if (!customerSheet) {
    customerSheet = ss.insertSheet("Customers", 0);
    customerSheet.appendRow(["Mobile", "Name", "Orders", "Total Spent", "Last Order", "Preferences"]);
  }
}

function trackCustomer(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Customers");
  if (!sheet) return;
  
  const values = sheet.getDataRange().getValues();
  let found = false;
  
  // Check if customer exists
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.customerMobile) {
      // Update existing customer
      const orders = parseInt(values[i][2]) + 1;
      const spent = parseFloat(values[i][3]) + data.total;
      
      sheet.getRange(i + 1, 3).setValue(orders);
      sheet.getRange(i + 1, 4).setValue(spent);
      sheet.getRange(i + 1, 5).setValue(new Date());
      
      found = true;
      break;
    }
  }
  
  // Add new customer if not found
  if (!found) {
    sheet.appendRow([
      data.customerMobile,
      data.customerName,
      1,
      data.total,
      new Date(),
      JSON.stringify(data)
    ]);
  }
}

// Call trackCustomer(data) in ORDER_PLACED handler
```

---

## Example 6: Inventory Management

```javascript
function updateInventory(items) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let inventorySheet = ss.getSheetByName("Inventory");
  
  if (!inventorySheet) {
    inventorySheet = ss.insertSheet("Inventory", 0);
    inventorySheet.appendRow(["Item", "Standard Orders", "Premium Orders", "Rotis", "Dal", "Sabzi", "Rice"]);
    // Initialize with default items
  }
  
  const data = inventorySheet.getDataRange().getValues();
  
  items.forEach(item => {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].includes(item.title)) {
        const currentQty = parseInt(data[i][1]) || 0;
        inventorySheet.getRange(i + 1, 2).setValue(currentQty + item.quantity);
        break;
      }
    }
  });
}
```

---

## Tips for Production

1. **Security**: Use HMAC verification to ensure requests come from your website
2. **Backup**: Keep regular backups of your Google Sheet
3. **Limits**: Google Sheets has 10 million cells limit per sheet
4. **Archive**: Move old data to archive sheets after 6 months
5. **Monitoring**: Set up error alerts to catch issues early

All these functions work together to create a complete order management system!
