# 🎯 Implementation Checklist

## Phase 1: Prepare (5 minutes)

- [ ] Read `QUICK_START.md`
- [ ] Have your Google Account ready
- [ ] Copy code from Step 2 in QUICK_START.md
- [ ] Copy your Google Sheet link

---

## Phase 2: Create Google Apps Script (5 minutes)

### Create New Project
- [ ] Go to https://script.google.com
- [ ] Click "New Project"
- [ ] Name: "AnyTime Tiffin Data Logger"

### Add Code
- [ ] Clear default code
- [ ] Copy basic code from `QUICK_START.md` Step 2
- [ ] Click "Save"
- [ ] Project should be saved

### Deploy as Web App
- [ ] Click "Deploy" button (top right)
- [ ] Select "New deployment"
- [ ] Click gear icon (⚙️) in "Select type"
- [ ] Choose "Web app"
- [ ] Fill:
  - Execute as: `[Your Google Account]`
  - Who has access: `Anyone`
- [ ] Click "Deploy"
- [ ] **Copy the deployment URL** (you'll need this)
- [ ] Click "Done"

---

## Phase 3: Verify Setup (2 minutes)

### Check Google Sheet
- [ ] Open Google Sheet (should auto-create)
- [ ] Click on it to open
- [ ] Verify it has columns: "Timestamp", "Event Type", "Data"
- [ ] Empty sheet is ready

### Test Connection
- [ ] Go to your AnyTime Tiffin website
- [ ] Open browser console (F12)
- [ ] Look for messages like: `✓ Data sent to Google Apps Script`

---

## Phase 4: Test With Real Actions (5 minutes)

Try these on your website:

- [ ] **Check pincode**
  - Enter "122004" and submit
  - Look in console for `PINCODE_CHECK`

- [ ] **Apply coupon**
  - Add items to cart
  - Try coupon "MOMLOVE"
  - Look in console for `COUPON_APPLIED`

- [ ] **User login**
  - Click account → Login
  - Enter name and mobile
  - Look in console for `USER_LOGIN`

- [ ] **Place order**
  - Add items to cart
  - Fill checkout form
  - Click "Place Order"
  - Look in console for `ORDER_PLACED`

- [ ] **Subscribe**
  - Click "Choose Plan" on any meal
  - Look in console for `SUBSCRIPTION_CREATED`

### Check Google Sheet
- [ ] Refresh your Google Sheet
- [ ] You should see **new rows** for each action
- [ ] Each row has: Timestamp | Event Type | Data (JSON)

---

## Phase 5: Verify Data Quality (3 minutes)

### Order Data
- [ ] Order ID is recorded correctly
- [ ] Customer name appears
- [ ] Total amount matches
- [ ] Items list is complete
- [ ] Payment mode shows

### User Data
- [ ] Mobile number is correct
- [ ] Preferences saved
- [ ] Name appears correctly

### All Events
- [ ] Timestamps look correct
- [ ] All events appear
- [ ] No error messages in console

---

## Phase 6: (Optional) Advanced Setup

### Option A: Email Notifications
- [ ] Copy code from `ADVANCED_EXAMPLES.md` Example 2
- [ ] Paste in Apps Script
- [ ] Update email: `owner@example.com` → your email
- [ ] Deploy again
- [ ] Test: Place order → Should get email

### Option B: Separate Sheets Per Event
- [ ] Replace Apps Script with code from Example 1
- [ ] Deploy again
- [ ] Test: Should create sheets for each event type

### Option C: Daily Summary Report
- [ ] Add code from Example 3
- [ ] Create trigger: Click Triggers (left sidebar)
- [ ] New trigger:
  - Function: `sendDailySummary`
  - Event: Time-driven → Daily
  - Time: 8 PM
- [ ] Save
- [ ] Will send daily report at 8 PM

### Option D: Slack Integration
- [ ] Get Slack webhook URL (see ADVANCED_EXAMPLES.md)
- [ ] Add code from Example 4
- [ ] Update webhook URL
- [ ] Deploy
- [ ] Test: Place order → Should get Slack notification

---

## Phase 7: Go Live ✅

### Before Launch
- [ ] All tests passed
- [ ] Data appearing in Google Sheet
- [ ] No console errors
- [ ] Website functions normally
- [ ] Optional features (if desired) working

### Launch
- [ ] Website is live
- [ ] Share with customers
- [ ] Monitor first orders
- [ ] Check Google Sheet for data

### Post-Launch
- [ ] First order received? ✓
- [ ] Data in Google Sheet? ✓
- [ ] Create charts/reports? ✓
- [ ] Set up automations? ✓

---

## Troubleshooting During Setup

### Problem: No data appearing

**Check #1: Apps Script Deployed?**
- [ ] Go back to Apps Script project
- [ ] Click "Deploy" → Check if green checkmark shows
- [ ] If not, click "Deploy" again

**Check #2: Correct Permissions?**
- [ ] In deployment settings, confirm: "Who has access: Anyone"
- [ ] Re-deploy if needed

**Check #3: Google Sheet Exists?**
- [ ] Apps Script should auto-create a sheet
- [ ] If not found, manually create:
  - New Google Sheet
  - Add headers: "Timestamp" | "Event Type" | "Data"

**Check #4: Website Console Errors?**
- [ ] F12 → Console tab
- [ ] Look for any red errors
- [ ] If error about webhook, verify URL is correct

### Problem: Website is slow

**Solution:**
- This is normal with Google Apps Script
- Requests are async (background)
- No blocking of user interaction

### Problem: Coupon tracking not working

**Solution:**
- Verify coupons are in COUPONS object
- Check console for coupon events
- Try valid coupon: "MOMLOVE" or "TIFFIN50"

### Problem: Subscription not tracking

**Solution:**
- Must be logged in first
- Then click "Choose Plan"
- Check `USER_LOGIN` happened first

---

## Verification Checklist (Final)

**Website Functionality:**
- [ ] Menu loads
- [ ] Cart works
- [ ] Login works
- [ ] Orders place
- [ ] Subscriptions work
- [ ] No errors on console

**Data Tracking:**
- [ ] PINCODE_CHECK → Google Sheet
- [ ] USER_LOGIN → Google Sheet
- [ ] ORDER_PLACED → Google Sheet
- [ ] SUBSCRIPTION_CREATED → Google Sheet
- [ ] COUPON_APPLIED → Google Sheet
- [ ] CART_CLEARED → Google Sheet

**Data Quality:**
- [ ] Timestamps are correct
- [ ] Customer info matches
- [ ] Amounts are accurate
- [ ] All fields populated
- [ ] No corrupted data

---

## Success Criteria ✅

Your integration is successful when:

1. ✅ Website works normally
2. ✅ Customer can place orders
3. ✅ Data appears in Google Sheet
4. ✅ No console errors
5. ✅ Timestamps are accurate
6. ✅ All events tracked

---

## Next Steps After Success

1. **Monitor**: Check sheet daily for first week
2. **Analyze**: Review customer patterns
3. **Automate**: Set up email notifications
4. **Enhance**: Add dashboards/reports
5. **Scale**: Handle higher order volumes

---

## Emergency Contacts / Resources

- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Google Sheets API**: https://developers.google.com/sheets
- **Browser Console**: F12 key (check for errors)
- **Google Support**: https://support.google.com

---

## 🎉 Ready to Launch?

Once you've completed all checks above, you're ready to go live!

**Your AnyTime Tiffin website is now equipped with complete data tracking.**

Start accepting orders and watch the data flow! 📊
