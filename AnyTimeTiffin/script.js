// Menu data and configuration.
// Keep these menu titles, prices, and includes unchanged.
const CONFIG = {
  serviceAreaName: 'M3M Soulitude, Sector 89',
  serviceAreaKey: 'M3M Soulitude',
  whatsappNumber: '918950378717',
  serviceablePincodes: ['122004', '122505'],
  googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbzP6yDvx6q5D1pAvr1rGNR0zaiFjj6JhZhz5mQ9eyg2sTtjKq_a4XmTuYuzVR2COZvhiw/exec'
}

const MENU = {
  plans: {
    standard: { title: 'Standard Home Tiffin', price: 129, includes: '4 Plain Rotis - Dal - Veg Sabzi - Rice - Salad' },
    premium: { title: 'Premium Home Tiffin', price: 169, includes: '5 Butter Rotis - Dal - Paneer Sabzi - Rice - Salad' }
  },
  addons: [
    { key: 'plain_roti', title: 'Plain Roti', price: 7 },
    { key: 'butter_roti', title: 'Butter Roti', price: 9 },
    { key: 'dal', title: 'Dal', price: 30 },
    { key: 'veg_sabzi', title: 'Veg Sabzi', price: 40 },
    { key: 'paneer_sabzi', title: 'Paneer Sabzi', price: 70 },
    { key: 'rice', title: 'Rice', price: 23 }
  ]
}

const ITEM_META = {
  standard: {
    label: 'Daily favorite',
    dietTags: ['veg'],
    popularity: 98,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
    alt: 'Home-style Indian thali with dal, sabzi, rice, salad, and rotis'
  },
  premium: {
    label: 'Paneer meal',
    dietTags: ['veg'],
    popularity: 94,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    alt: 'Fresh Indian meal with paneer curry and roti'
  },
  plain_roti: {
    label: 'Add-on',
    dietTags: ['veg', 'jain'],
    popularity: 86,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
    alt: 'Indian meal plate with fresh flatbread'
  },
  butter_roti: {
    label: 'Add-on',
    dietTags: ['veg'],
    popularity: 82,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
    alt: 'Warm Indian meal served with flatbread'
  },
  dal: {
    label: 'Add-on',
    dietTags: ['veg'],
    popularity: 90,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    alt: 'Home-style curry served with rice'
  },
  veg_sabzi: {
    label: 'Add-on',
    dietTags: ['veg'],
    popularity: 88,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    alt: 'Fresh Indian vegetable curry with rice'
  },
  paneer_sabzi: {
    label: 'Add-on',
    dietTags: ['veg'],
    popularity: 92,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    alt: 'Fresh paneer-style curry served hot'
  },
  rice: {
    label: 'Add-on',
    dietTags: ['veg', 'jain'],
    popularity: 84,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    alt: 'Steamed rice served with a home-style meal'
  }
}

const SUBSCRIPTION_PLANS = {
  daily: { title: 'Daily Tiffin Pass', price: 'From Rs. 129/day' },
  weekly: { title: 'Weekly Comfort Plan', price: 'Rs. 899/week' },
  monthly: { title: 'Monthly Home Meal Plan', price: 'Rs. 3499/month' }
}

const COUPONS = {
  MOMLOVE: { discount: 20, min: 100 },
  TIFFIN50: { discount: 50, min: 300 }
}

const LOCAL_KEYS = {
  cart: 'anytimeTiffin.cart',
  user: 'anytimeTiffin.user',
  orders: 'anytimeTiffin.orders',
  subscriptions: 'anytimeTiffin.subscriptions',
  addresses: 'anytimeTiffin.addresses'
}

const state = {
  quantities: { standard: 0, premium: 0 },
  addons: {},
  selectedLocation: CONFIG.serviceAreaKey,
  isAvailable: true,
  filters: { search: '', diet: 'all', maxPrice: 200, sort: 'featured' },
  coupon: { code: '', discount: 0 },
  paymentMode: 'UPI',
  user: null,
  orders: [],
  subscriptions: [],
  addresses: [],
  pendingSubscription: null,
  lastOrder: null,
  noticeTimer: null
}

// Google Apps Script Integration
async function sendToGoogleAppsScript(eventType, data) {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      eventType: eventType,
      data: data
    }

    const response = await fetch(CONFIG.googleAppsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log(`✓ Data sent to Google Apps Script: ${eventType}`, payload)
    return true
  } catch (error) {
    console.error(`✗ Error sending to Google Apps Script:`, error)
    return false
  }
}

document.addEventListener('DOMContentLoaded', init)

function init() {
  initializeAddons()
  loadStoredState()
  bindEvents()
  renderMenu()
  renderCart()
  updateAccountUI()
  renderDashboard()
  checkAvailability(false)
  refreshIcons()
}

function initializeAddons() {
  MENU.addons.forEach(addon => {
    state.addons[addon.key] = 0
  })
}

function bindEvents() {
  const navToggle = byId('navToggle')
  navToggle.addEventListener('click', () => {
    const nav = byId('primaryNav')
    const isOpen = nav.classList.toggle('open')
    navToggle.setAttribute('aria-expanded', String(isOpen))
  })

  document.querySelectorAll('#primaryNav a').forEach(link => {
    link.addEventListener('click', () => {
      byId('primaryNav').classList.remove('open')
      navToggle.setAttribute('aria-expanded', 'false')
    })
  })

  byId('orderNowBtn').addEventListener('click', scrollToMenu)
  byId('viewMenuBtn').addEventListener('click', scrollToMenu)
  byId('menuGrid').addEventListener('click', onMenuClick)
  byId('clearCart').addEventListener('click', clearCart)
  byId('reviewCart').addEventListener('click', () => openCheckout())
  byId('headerCartBtn').addEventListener('click', () => openCheckout())
  byId('stickyCartBtn').addEventListener('click', () => openCheckout())

  byId('menuSearch').addEventListener('input', event => {
    state.filters.search = event.target.value.trim().toLowerCase()
    renderMenu()
  })

  document.querySelectorAll('[data-diet]').forEach(button => {
    button.addEventListener('click', () => {
      state.filters.diet = button.dataset.diet
      document.querySelectorAll('[data-diet]').forEach(chip => chip.classList.toggle('active', chip === button))
      renderMenu()
    })
  })

  byId('priceRange').addEventListener('input', event => {
    state.filters.maxPrice = Number(event.target.value)
    byId('priceRangeLabel').textContent = formatCurrency(state.filters.maxPrice)
    renderMenu()
  })

  byId('sortMenu').addEventListener('change', event => {
    state.filters.sort = event.target.value
    renderMenu()
  })

  document.querySelectorAll('input[name="location"]').forEach(radio => {
    radio.addEventListener('change', event => {
      state.selectedLocation = event.target.value
      checkAvailability()
    })
  })

  byId('locCurrent').addEventListener('click', useCurrentLocation)
  byId('heroPincodeForm').addEventListener('submit', event => handlePincodeCheck(event, 'heroPincode', 'heroPinMessage'))
  byId('areaPincodeForm').addEventListener('submit', event => handlePincodeCheck(event, 'areaPincode', 'areaPinMessage'))

  byId('orderWhatsApp').addEventListener('click', onOrder)
  byId('checkoutWhatsApp').addEventListener('click', onOrder)
  byId('headerWhatsApp').addEventListener('click', openWhatsAppChat)
  byId('contactWhatsApp').addEventListener('click', openWhatsAppChat)
  byId('floatingWhatsApp').addEventListener('click', openWhatsAppChat)

  byId('couponForm').addEventListener('submit', applyCoupon)
  byId('placeOrderBtn').addEventListener('click', placeOrder)
  byId('successWhatsApp').addEventListener('click', () => {
    if (state.lastOrder) {
      openWhatsApp(buildWhatsAppMessage(state.lastOrder.customer, state.lastOrder), 'Order details are ready on WhatsApp.')
    } else {
      openWhatsAppChat()
    }
  })

  document.querySelectorAll('input[name="payment"]').forEach(input => {
    input.addEventListener('change', event => {
      state.paymentMode = event.target.value
    })
  })

  document.querySelectorAll('[data-subscription]').forEach(button => {
    button.addEventListener('click', () => startSubscription(button.dataset.subscription))
  })

  byId('accountBtn').addEventListener('click', () => {
    updateAccountUI()
    renderDashboard()
    openModal('accountModal')
  })
  byId('loginForm').addEventListener('submit', loginUser)
  byId('logoutBtn').addEventListener('click', logoutUser)
  byId('preferenceForm').addEventListener('submit', savePreferences)
  byId('subscriptionList').addEventListener('click', onSubscriptionAction)

  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal))
  })

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal(modal.id)
    })
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeOpenModal()
  })

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => toggleFaq(button))
  })
}

function renderMenu() {
  const menuGrid = byId('menuGrid')
  const items = getFilteredMenuItems()

  menuGrid.innerHTML = items.map(renderMenuCard).join('')
  byId('menuEmpty').hidden = items.length > 0
  syncQuantityInputs()
  refreshIcons()
}

function renderMenuCard(item) {
  const quantity = getQuantity(item.key)
  const selected = quantity > 0 ? ' selected' : ''
  const includes = item.includes ? `<p class="includes">${escapeHtml(item.includes)}</p>` : '<p class="includes"></p>'
  const subscribeButton = item.type === 'plan'
    ? `<button class="btn outline full-width" type="button" data-menu-subscribe="${escapeHtml(item.key)}"><i data-lucide="calendar-plus" aria-hidden="true"></i><span>Choose Plan</span></button>`
    : ''

  return `
    <article class="menu-card${selected}" data-key="${escapeHtml(item.key)}">
      <div class="menu-image">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy" onerror="this.closest('.menu-image').classList.add('image-fallback'); this.remove();">
      </div>
      <div class="menu-body">
        <div class="menu-meta">
          <span>${escapeHtml(item.label)}</span>
          <span class="veg">Veg</span>
          ${item.dietTags.includes('jain') ? '<span>Jain</span>' : ''}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        ${includes}
        <div class="menu-bottom">
          <span class="menu-price">${formatCurrency(item.price)}</span>
          <div class="qty">
            <button class="step minus" type="button" data-key="${escapeHtml(item.key)}" aria-label="Remove ${escapeHtml(item.title)}">-</button>
            <input class="qty-input" data-key="${escapeHtml(item.key)}" value="${quantity}" readonly aria-label="${escapeHtml(item.title)} quantity">
            <button class="step plus" type="button" data-key="${escapeHtml(item.key)}" aria-label="Add ${escapeHtml(item.title)}">+</button>
          </div>
        </div>
        ${subscribeButton}
      </div>
    </article>
  `
}

function getFilteredMenuItems() {
  let items = getAllMenuItems().filter(item => {
    const matchesSearch = !state.filters.search ||
      item.title.toLowerCase().includes(state.filters.search) ||
      (item.includes || '').toLowerCase().includes(state.filters.search)
    const matchesDiet = state.filters.diet === 'all' || item.dietTags.includes(state.filters.diet)
    const matchesPrice = item.price <= state.filters.maxPrice
    return matchesSearch && matchesDiet && matchesPrice
  })

  if (state.filters.sort === 'price-low') {
    items = items.sort((a, b) => a.price - b.price)
  } else if (state.filters.sort === 'price-high') {
    items = items.sort((a, b) => b.price - a.price)
  } else if (state.filters.sort === 'popular') {
    items = items.sort((a, b) => b.popularity - a.popularity)
  }

  return items
}

function getAllMenuItems() {
  const plans = Object.entries(MENU.plans).map(([key, plan]) => ({
    key,
    type: 'plan',
    title: plan.title,
    price: plan.price,
    includes: plan.includes,
    ...ITEM_META[key]
  }))

  const addons = MENU.addons.map(addon => ({
    key: addon.key,
    type: 'addon',
    title: addon.title,
    price: addon.price,
    includes: '',
    ...ITEM_META[addon.key]
  }))

  return [...plans, ...addons]
}

function onMenuClick(event) {
  const stepButton = event.target.closest('.step')
  if (stepButton) {
    updateQuantity(stepButton.dataset.key, stepButton.classList.contains('plus') ? 1 : -1)
    return
  }

  const subscribeButton = event.target.closest('[data-menu-subscribe]')
  if (subscribeButton) {
    startSubscription('daily', subscribeButton.dataset.menuSubscribe)
  }
}

function updateQuantity(key, delta) {
  if (Object.prototype.hasOwnProperty.call(state.quantities, key)) {
    state.quantities[key] = Math.max(0, state.quantities[key] + delta)
  } else if (Object.prototype.hasOwnProperty.call(state.addons, key)) {
    state.addons[key] = Math.max(0, state.addons[key] + delta)
  }

  syncQuantityInputs()
  renderCart()
  saveCart()
}

function syncQuantityInputs() {
  document.querySelectorAll('.qty-input').forEach(input => {
    input.value = getQuantity(input.dataset.key)
  })

  document.querySelectorAll('.menu-card').forEach(card => {
    card.classList.toggle('selected', getQuantity(card.dataset.key) > 0)
  })
}

function getQuantity(key) {
  if (Object.prototype.hasOwnProperty.call(state.quantities, key)) return state.quantities[key]
  if (Object.prototype.hasOwnProperty.call(state.addons, key)) return state.addons[key]
  return 0
}

function renderCart() {
  const cart = getCartItems()
  renderCartList(byId('cartItems'), cart)
  renderCartList(byId('checkoutItems'), cart)

  const subtotal = getSubtotal(cart)
  const discount = getDiscountAmount(subtotal)
  const total = Math.max(0, subtotal - discount)
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  byId('totalAmount').textContent = formatCurrency(total)
  byId('stickyTotal').textContent = formatCurrency(total)
  byId('stickyCount').textContent = itemCount
  byId('headerCartCount').textContent = itemCount
  byId('checkoutSubtotal').textContent = formatCurrency(subtotal)
  byId('checkoutDiscount').textContent = '-' + formatCurrency(discount)
  byId('checkoutTotal').textContent = formatCurrency(total)
  updateStickyVisibility(itemCount)

  const hasCart = cart.length > 0
  byId('placeOrderBtn').disabled = !hasCart || !state.isAvailable
  byId('checkoutWhatsApp').disabled = !hasCart || !state.isAvailable
}

function renderCartList(container, cart) {
  container.innerHTML = ''

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">No items selected yet. Add a tiffin or add-on to start your order.</div>'
    return
  }

  cart.forEach((item, index) => {
    const row = document.createElement('div')
    row.className = 'cart-item'
    row.innerHTML = `
      <div>
        <strong>${index + 1}. ${escapeHtml(item.title)} x ${item.qty}</strong>
        <small>${formatCurrency(item.price)} each</small>
      </div>
      <div><strong>${formatCurrency(item.qty * item.price)}</strong></div>
    `
    container.appendChild(row)
  })
}

function getCartItems() {
  const cart = []

  Object.entries(MENU.plans).forEach(([key, plan]) => {
    const qty = state.quantities[key]
    if (qty > 0) {
      cart.push({ key, title: plan.title, qty, price: plan.price })
    }
  })

  MENU.addons.forEach(addon => {
    const qty = state.addons[addon.key]
    if (qty > 0) {
      cart.push({ key: addon.key, title: addon.title, qty, price: addon.price })
    }
  })

  return cart
}

function getSubtotal(cart = getCartItems()) {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0)
}

function getDiscountAmount(subtotal = getSubtotal()) {
  return Math.min(state.coupon.discount, subtotal)
}

function clearCart() {
  const cartItems = getCartItems()
  const cartTotal = getSubtotal(cartItems)
  
  state.quantities.standard = 0
  state.quantities.premium = 0
  Object.keys(state.addons).forEach(key => {
    state.addons[key] = 0
  })
  state.coupon = { code: '', discount: 0 }
  byId('couponCode').value = ''
  byId('couponMessage').textContent = ''
  syncQuantityInputs()
  renderCart()
  saveCart()
  
  // Send cart cleared event
  sendToGoogleAppsScript('CART_CLEARED', {
    itemsCount: cartItems.length,
    cartTotal: cartTotal,
    itemsList: cartItems.map(item => ({
      title: item.title,
      quantity: item.qty,
      price: item.price
    }))
  })
  
  showNotice('Cart cleared.')
}

function applyCoupon(event) {
  event.preventDefault()
  const input = byId('couponCode')
  const message = byId('couponMessage')
  const code = input.value.trim().toUpperCase()

  if (!code) {
    state.coupon = { code: '', discount: 0 }
    message.textContent = 'Coupon removed.'
    renderCart()
    saveCart()
    return
  }

  const coupon = COUPONS[code]
  const subtotal = getSubtotal()
  if (!coupon) {
    state.coupon = { code: '', discount: 0 }
    message.textContent = 'Coupon not recognized.'
    renderCart()
    saveCart()
    
    // Send failed coupon attempt
    sendToGoogleAppsScript('COUPON_ATTEMPTED', {
      couponCode: code,
      success: false,
      reason: 'Not recognized'
    })
    return
  }

  if (subtotal < coupon.min) {
    state.coupon = { code: '', discount: 0 }
    message.textContent = `Minimum cart value is ${formatCurrency(coupon.min)}.`
    renderCart()
    saveCart()
    
    // Send failed coupon attempt
    sendToGoogleAppsScript('COUPON_ATTEMPTED', {
      couponCode: code,
      success: false,
      reason: 'Minimum value not met',
      subtotal: subtotal,
      minimumRequired: coupon.min
    })
    return
  }

  state.coupon = { code, discount: coupon.discount }
  message.textContent = `${code} applied.`
  renderCart()
  saveCart()
  
  // Send successful coupon application
  sendToGoogleAppsScript('COUPON_APPLIED', {
    couponCode: code,
    discountAmount: coupon.discount,
    subtotal: subtotal,
    discountPercentage: (coupon.discount / subtotal * 100).toFixed(2)
  })
}

function checkAvailability(showMessage = true) {
  state.isAvailable = state.selectedLocation === CONFIG.serviceAreaKey
  updateUIForLocation()

  if (!state.isAvailable && showMessage) {
    showNotice('Sorry, we are not available here yet. We will be coming soon to your area.')
  }

  renderCart()
}

function updateUIForLocation() {
  const canOrder = state.selectedLocation === CONFIG.serviceAreaKey && state.isAvailable

  ;['menuSection', 'cartSection'].forEach(id => {
    const section = byId(id)
    section.style.display = canOrder ? '' : 'none'
  })

  updateStickyVisibility()

  document.querySelectorAll('.loc-card').forEach(card => {
    const input = card.querySelector('input[name="location"]')
    card.classList.toggle('selected', Boolean(input && input.checked))
  })

  byId('orderWhatsApp').disabled = !canOrder
  byId('placeOrderBtn').disabled = !canOrder || getCartItems().length === 0
  byId('checkoutWhatsApp').disabled = !canOrder || getCartItems().length === 0
}

function updateStickyVisibility(itemCount = getCartItems().reduce((sum, item) => sum + item.qty, 0)) {
  const canOrder = state.selectedLocation === CONFIG.serviceAreaKey && state.isAvailable
  const sticky = document.querySelector('.sticky-order')
  sticky.style.display = canOrder && itemCount > 0 ? 'flex' : 'none'
}

function useCurrentLocation() {
  const locMsg = byId('locMessage')
  locMsg.textContent = 'Checking current location...'

  if (!navigator.geolocation) {
    locMsg.textContent = 'Geolocation is not supported by your browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(() => {
    locMsg.innerHTML = 'Please confirm if you are inside <strong>' + CONFIG.serviceAreaName + '</strong>.'
    if (window.confirm(`Are you inside ${CONFIG.serviceAreaName}? Click OK to confirm.`)) {
      document.querySelector(`input[name="location"][value="${CONFIG.serviceAreaKey}"]`).checked = true
      state.selectedLocation = CONFIG.serviceAreaKey
      locMsg.textContent = 'Location confirmed.'
    } else {
      document.querySelector('input[name="location"][value="Other"]').checked = true
      state.selectedLocation = 'Other'
      locMsg.textContent = 'Please select your society manually. Service is not available in other areas yet.'
    }
    checkAvailability()
  }, () => {
    locMsg.textContent = 'Unable to access location. Please select your society manually.'
  })
}

function handlePincodeCheck(event, inputId, messageId) {
  event.preventDefault()
  const pin = byId(inputId).value.trim()
  const message = byId(messageId)

  if (!/^[0-9]{6}$/.test(pin)) {
    message.textContent = 'Enter a valid 6-digit pincode.'
    return
  }

  const isServiceable = isServiceablePincode(pin)
  
  // Send pincode check to Google Apps Script
  sendToGoogleAppsScript('PINCODE_CHECK', {
    pincode: pin,
    isServiceable: isServiceable,
    checkTime: new Date().toISOString()
  })

  if (isServiceable) {
    message.textContent = 'Serviceable for M3M Soulitude. Please confirm your society above.'
    const customerPin = byId('custPincode')
    if (customerPin && !customerPin.value.trim()) customerPin.value = pin
    return
  }

  message.textContent = 'Not serviceable yet. You can still ask us on WhatsApp.'
}

function onOrder() {
  const customer = validateOrderForm()
  if (!customer) return

  openWhatsApp(buildWhatsAppMessage(customer), 'Your order is ready on WhatsApp. Please send the message to confirm.')
}

function placeOrder() {
  const customer = validateOrderForm()
  if (!customer) return

  const cart = getCartItems()
  const subtotal = getSubtotal(cart)
  const discount = getDiscountAmount(subtotal)
  const total = Math.max(0, subtotal - discount)
  const order = {
    id: 'ATT-' + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    customer,
    items: cart,
    subtotal,
    discount,
    total,
    coupon: state.coupon.code || '-',
    paymentMode: state.paymentMode
  }

  state.lastOrder = order
  state.orders.unshift(order)
  state.orders = state.orders.slice(0, 20)
  saveCurrentAddress(customer)
  writeLocal(LOCAL_KEYS.orders, state.orders)
  
  // Send order to Google Apps Script
  sendToGoogleAppsScript('ORDER_PLACED', {
    orderId: order.id,
    customerName: customer.name,
    customerMobile: customer.mobile,
    customerLocation: customer.location,
    customerPincode: customer.pincode,
    customerTower: customer.tower,
    customerFlat: customer.flat,
    customerFloor: customer.floor,
    deliverySlot: customer.slot,
    spiceLevel: customer.spice,
    allergies: customer.allergies,
    instructions: customer.instr,
    items: cart.map(item => ({
      title: item.title,
      quantity: item.qty,
      price: item.price
    })),
    subtotal: subtotal,
    discount: discount,
    total: total,
    coupon: state.coupon.code || '-',
    paymentMode: state.paymentMode
  })
  
  renderDashboard()
  closeModal('checkoutModal')
  byId('successMessage').textContent = `Order ${order.id} saved for ${formatCurrency(order.total)} via ${order.paymentMode}. Confirm it on WhatsApp when ready.`
  openModal('successModal')
}

function validateOrderForm() {
  clearFieldErrors()

  if (!state.isAvailable) {
    showNotice('Service is not available at the selected location.')
    return null
  }

  const customer = getCustomerDetails()
  let firstInvalid = null

  if (!customer.name) firstInvalid = showFieldError('errName', 'Name is required', firstInvalid, 'custName')
  if (!/^[0-9]{10}$/.test(customer.mobile)) firstInvalid = showFieldError('errMobile', 'Enter a valid 10-digit mobile number', firstInvalid, 'custMobile')
  if (!/^[0-9]{6}$/.test(customer.pincode)) firstInvalid = showFieldError('errPincode', 'Enter a valid 6-digit pincode', firstInvalid, 'custPincode')
  if (/^[0-9]{6}$/.test(customer.pincode) && !isServiceablePincode(customer.pincode)) {
    firstInvalid = showFieldError('errPincode', 'This pincode is not serviceable yet', firstInvalid, 'custPincode')
  }
  if (!customer.tower) firstInvalid = showFieldError('errTower', 'Tower / Block is required', firstInvalid, 'custTower')
  if (!customer.flat) firstInvalid = showFieldError('errFlat', 'Flat number is required', firstInvalid, 'custFlat')

  if (firstInvalid) {
    byId(firstInvalid).focus()
    byId(firstInvalid).scrollIntoView({ behavior: 'smooth', block: 'center' })
    return null
  }

  if (getCartItems().length === 0) {
    showNotice('Please select at least one item or tiffin plan.')
    scrollToMenu()
    return null
  }

  return customer
}

function getCustomerDetails() {
  return {
    name: byId('custName').value.trim(),
    mobile: byId('custMobile').value.trim(),
    pincode: byId('custPincode').value.trim(),
    tower: byId('custTower').value.trim(),
    flat: byId('custFlat').value.trim(),
    floor: byId('custFloor').value.trim(),
    instr: byId('custInstr').value.trim(),
    slot: byId('deliverySlot').value,
    spice: byId('spiceLevel').value,
    allergies: byId('custAllergies').value.trim(),
    location: state.selectedLocation === CONFIG.serviceAreaKey ? CONFIG.serviceAreaName : state.selectedLocation
  }
}

function buildWhatsAppMessage(customer, sourceOrder = null) {
  const cart = sourceOrder ? sourceOrder.items : getCartItems()
  const subtotal = sourceOrder ? sourceOrder.subtotal : getSubtotal(cart)
  const discount = sourceOrder ? sourceOrder.discount : getDiscountAmount(subtotal)
  const total = sourceOrder ? sourceOrder.total : Math.max(0, subtotal - discount)
  const coupon = sourceOrder ? sourceOrder.coupon : (state.coupon.code || '-')

  const lines = [
    'New Tiffin Order',
    '',
    'Customer Details:',
    'Name: ' + customer.name,
    'Mobile: ' + customer.mobile,
    'Location: ' + customer.location,
    'Pincode: ' + customer.pincode,
    'Tower/Block: ' + customer.tower,
    'Flat No: ' + customer.flat,
    'Floor: ' + (customer.floor || '-'),
    'Delivery Slot: ' + customer.slot,
    'Spice Level: ' + customer.spice,
    'Allergies/Preferences: ' + (customer.allergies || '-'),
    'Instructions: ' + (customer.instr || '-'),
    '',
    'Order Items:'
  ]

  cart.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.title} x ${item.qty} = Rs. ${item.qty * item.price}`)
  })

  lines.push('')
  lines.push('Subtotal: Rs. ' + subtotal)
  lines.push('Coupon: ' + coupon)
  lines.push('Discount: Rs. ' + discount)
  lines.push('Total Amount: Rs. ' + total)
  lines.push('Payment Option: ' + state.paymentMode)
  lines.push('')
  lines.push('Please confirm my order.')

  return lines.join('\n')
}

function openWhatsAppChat() {
  const cart = getCartItems()
  const lines = ['Hi AnyTime Tiffin, I want to order from M3M Soulitude.']

  if (cart.length > 0) {
    lines.push('')
    lines.push('Current cart:')
    cart.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.title} x ${item.qty} = Rs. ${item.qty * item.price}`)
    })
    lines.push('Total: Rs. ' + Math.max(0, getSubtotal(cart) - getDiscountAmount()))
  } else {
    lines.push('Please share today\'s availability.')
  }

  openWhatsApp(lines.join('\n'), 'Opening WhatsApp chat.')
}

function openWhatsApp(message, noticeText) {
  const encoded = encodeURIComponent(message)
  const url = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encoded}`
  const opened = window.open(url, '_blank', 'noopener')

  if (!opened) {
    window.location.href = url
  }

  showNotice(noticeText)
}

function startSubscription(planType, menuKey = 'standard') {
  if (!state.user) {
    state.pendingSubscription = { planType, menuKey }
    byId('loginMessage').textContent = 'Login to start this subscription.'
    updateAccountUI()
    openModal('accountModal')
    return
  }

  createSubscription(planType, menuKey)
}

function createSubscription(planType, menuKey = 'standard') {
  const plan = SUBSCRIPTION_PLANS[planType]
  const meal = MENU.plans[menuKey] || MENU.plans.standard
  const subscription = {
    id: 'SUB-' + Date.now().toString().slice(-6),
    title: plan.title,
    price: plan.price,
    mealTitle: meal.title,
    status: 'Active',
    createdAt: new Date().toISOString(),
    preferences: {
      spice: byId('spiceLevel').value,
      slot: byId('deliverySlot').value,
      allergies: byId('custAllergies').value.trim() || '-'
    }
  }

  state.subscriptions.unshift(subscription)
  writeLocal(LOCAL_KEYS.subscriptions, state.subscriptions)
  
  // Send subscription to Google Apps Script
  sendToGoogleAppsScript('SUBSCRIPTION_CREATED', {
    subscriptionId: subscription.id,
    userName: state.user ? state.user.name : 'Anonymous',
    userMobile: state.user ? state.user.mobile : 'N/A',
    planType: planType,
    planTitle: plan.title,
    planPrice: plan.price,
    mealTitle: meal.title,
    spiceLevel: subscription.preferences.spice,
    deliverySlot: subscription.preferences.slot,
    allergies: subscription.preferences.allergies,
    status: subscription.status
  })
  
  renderDashboard()
  updateAccountUI()
  openModal('accountModal')
  showNotice(`${plan.title} started.`)
}

function onSubscriptionAction(event) {
  const button = event.target.closest('[data-pause-subscription]')
  if (!button) return

  const subscription = state.subscriptions.find(item => item.id === button.dataset.pauseSubscription)
  if (!subscription) return

  subscription.status = subscription.status === 'Paused' ? 'Active' : 'Paused'
  writeLocal(LOCAL_KEYS.subscriptions, state.subscriptions)
  
  // Send subscription status update to Google Apps Script
  sendToGoogleAppsScript('SUBSCRIPTION_STATUS_CHANGED', {
    subscriptionId: subscription.id,
    userName: state.user ? state.user.name : 'Anonymous',
    userMobile: state.user ? state.user.mobile : 'N/A',
    newStatus: subscription.status,
    planTitle: subscription.title
  })
  
  renderDashboard()
}

function loginUser(event) {
  event.preventDefault()
  const name = byId('loginName').value.trim()
  const mobile = byId('loginMobile').value.trim()
  const message = byId('loginMessage')

  if (!name) {
    message.textContent = 'Enter your name.'
    byId('loginName').focus()
    return
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    message.textContent = 'Enter a valid 10-digit mobile number.'
    byId('loginMobile').focus()
    return
  }

  state.user = {
    name,
    mobile,
    preferences: {
      spice: byId('spiceLevel').value,
      slot: byId('deliverySlot').value,
      allergies: byId('custAllergies').value.trim()
    }
  }

  writeLocal(LOCAL_KEYS.user, state.user)
  
  // Send user login to Google Apps Script
  sendToGoogleAppsScript('USER_LOGIN', {
    userName: name,
    userMobile: mobile,
    preferences: {
      spiceLevel: state.user.preferences.spice,
      deliverySlot: state.user.preferences.slot,
      allergies: state.user.preferences.allergies
    }
  })
  
  message.textContent = ''
  updateAccountUI()

  if (state.pendingSubscription) {
    const pending = state.pendingSubscription
    state.pendingSubscription = null
    createSubscription(pending.planType, pending.menuKey)
  } else {
    renderDashboard()
  }
}

function logoutUser() {
  state.user = null
  localStorage.removeItem(LOCAL_KEYS.user)
  state.pendingSubscription = null
  byId('loginName').value = ''
  byId('loginMobile').value = ''
  byId('loginMessage').textContent = ''
  updateAccountUI()
}

function savePreferences(event) {
  event.preventDefault()
  if (!state.user) return

  state.user.preferences = {
    spice: byId('prefSpice').value,
    slot: byId('prefSlot').value,
    allergies: byId('prefAllergies').value.trim()
  }
  writeLocal(LOCAL_KEYS.user, state.user)

  // Send preference update to Google Apps Script
  sendToGoogleAppsScript('PREFERENCES_UPDATED', {
    userName: state.user.name,
    userMobile: state.user.mobile,
    preferences: {
      spiceLevel: state.user.preferences.spice,
      deliverySlot: state.user.preferences.slot,
      allergies: state.user.preferences.allergies
    }
  })

  byId('spiceLevel').value = state.user.preferences.spice
  byId('deliverySlot').value = state.user.preferences.slot
  byId('custAllergies').value = state.user.preferences.allergies
  showNotice('Preferences saved.')
}

function updateAccountUI() {
  const label = byId('accountLabel')
  const loginForm = byId('loginForm')
  const dashboard = byId('dashboardView')

  if (state.user) {
    label.textContent = firstName(state.user.name)
    loginForm.hidden = true
    dashboard.hidden = false
    byId('dashboardName').textContent = `${state.user.name} - ${state.user.mobile}`
  } else {
    label.textContent = 'Login'
    loginForm.hidden = false
    dashboard.hidden = true
  }
}

function renderDashboard() {
  if (!state.user) return

  const preferences = state.user.preferences || {}
  byId('prefSpice').value = preferences.spice || 'Medium'
  byId('prefSlot').value = preferences.slot || 'Lunch: 12:00 PM - 2:00 PM'
  byId('prefAllergies').value = preferences.allergies || ''

  renderDashboardList(byId('subscriptionList'), state.subscriptions, subscription => `
    <div>
      <strong>${escapeHtml(subscription.title)}</strong>
      <p>${escapeHtml(subscription.mealTitle)} - ${escapeHtml(subscription.price)} - ${escapeHtml(subscription.status)}</p>
    </div>
    <button class="btn outline compact" type="button" data-pause-subscription="${escapeHtml(subscription.id)}">${subscription.status === 'Paused' ? 'Resume' : 'Pause'}</button>
  `)

  renderDashboardList(byId('orderHistory'), state.orders.slice(0, 5), order => `
    <div>
      <strong>${escapeHtml(order.id)} - ${formatCurrency(order.total)}</strong>
      <p>${new Date(order.createdAt).toLocaleString()} - ${escapeHtml(order.paymentMode)}</p>
    </div>
  `)

  renderDashboardList(byId('savedAddresses'), state.addresses.slice(0, 5), address => `
    <div>
      <strong>${escapeHtml(address.flat)}, ${escapeHtml(address.tower)}</strong>
      <p>${escapeHtml(address.location)} - ${escapeHtml(address.pincode)}</p>
    </div>
  `)
}

function renderDashboardList(container, items, renderItem) {
  container.innerHTML = ''

  if (!items.length) {
    container.innerHTML = '<div class="empty-cart">Nothing saved yet.</div>'
    return
  }

  items.forEach(item => {
    const row = document.createElement('div')
    row.className = 'dashboard-item'
    row.innerHTML = renderItem(item)
    container.appendChild(row)
  })
}

function saveCurrentAddress(customer) {
  const address = {
    flat: customer.flat,
    tower: customer.tower,
    floor: customer.floor,
    pincode: customer.pincode,
    location: customer.location
  }
  const key = `${address.flat}|${address.tower}|${address.pincode}`.toLowerCase()
  state.addresses = state.addresses.filter(item => `${item.flat}|${item.tower}|${item.pincode}`.toLowerCase() !== key)
  state.addresses.unshift(address)
  state.addresses = state.addresses.slice(0, 8)
  writeLocal(LOCAL_KEYS.addresses, state.addresses)
}

function openCheckout() {
  renderCart()
  openModal('checkoutModal')
}

function openModal(id) {
  const modal = byId(id)
  modal.hidden = false
  document.body.classList.add('modal-open')
  refreshIcons()

  const focusable = modal.querySelector('button, input, select, textarea, [href]')
  if (focusable) focusable.focus()
}

function closeModal(id) {
  const modal = byId(id)
  if (!modal) return

  modal.hidden = true
  if (!document.querySelector('.modal:not([hidden])')) {
    document.body.classList.remove('modal-open')
  }
}

function closeOpenModal() {
  const modal = document.querySelector('.modal:not([hidden])')
  if (modal) closeModal(modal.id)
}

function toggleFaq(button) {
  const expanded = button.getAttribute('aria-expanded') === 'true'
  const answer = button.nextElementSibling
  button.setAttribute('aria-expanded', String(!expanded))
  answer.hidden = expanded
}

function showFieldError(id, message, firstInvalid, inputId) {
  const error = byId(id)
  if (error) error.textContent = message
  return firstInvalid || inputId
}

function clearFieldErrors() {
  ;['errName', 'errMobile', 'errPincode', 'errTower', 'errFlat'].forEach(id => {
    const error = byId(id)
    if (error) error.textContent = ''
  })
}

function showNotice(message) {
  const notice = byId('notice')
  notice.textContent = message
  notice.style.display = 'block'
  clearTimeout(state.noticeTimer)
  state.noticeTimer = setTimeout(() => {
    notice.style.display = 'none'
  }, 3600)
}

function scrollToMenu() {
  byId('menuSection').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function isServiceablePincode(pin) {
  return CONFIG.serviceablePincodes.includes(pin)
}

function formatCurrency(amount) {
  return '\u20b9' + Number(amount || 0).toLocaleString('en-IN')
}

function firstName(name) {
  return String(name || '').trim().split(/\s+/)[0] || 'Account'
}

function byId(id) {
  return document.getElementById(id)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function loadStoredState() {
  const storedCart = readLocal(LOCAL_KEYS.cart)
  if (storedCart) {
    state.quantities = { ...state.quantities, ...(storedCart.quantities || {}) }
    state.addons = { ...state.addons, ...(storedCart.addons || {}) }
    state.coupon = storedCart.coupon || state.coupon
  }

  state.user = readLocal(LOCAL_KEYS.user) || null
  state.orders = readLocal(LOCAL_KEYS.orders) || []
  state.subscriptions = readLocal(LOCAL_KEYS.subscriptions) || []
  state.addresses = readLocal(LOCAL_KEYS.addresses) || []
}

function saveCart() {
  writeLocal(LOCAL_KEYS.cart, {
    quantities: state.quantities,
    addons: state.addons,
    coupon: state.coupon
  })
}

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Unable to read localStorage key:', key, error)
    return null
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Unable to write localStorage key:', key, error)
  }
}

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons()
  }
}
