# YUSUR Consumer App — Screen Inventory & Low-Fidelity Wireframes

This document provides a detailed UX review and structured wireframes for all 24 screens in the YUSUR Consumer App.

---

# Screen Inventory Directory

### Group 1: Authentication & Onboarding
* [Screen 1: Splash Screen](#screen-1-splash-screen)
* [Screen 2: Onboarding Carousel](#screen-2-onboarding-carousel)
* [Screen 3: Login Screen](#screen-3-login-screen)
* [Screen 4: Registration Screen](#screen-4-registration-screen)
* [Screen 5: OTP Verification Screen](#screen-5-otp-verification-screen)
* [Screen 6: Forgot Password Screen](#screen-6-forgot-password-screen)

### Group 2: Home & Core Discovery
* [Screen 7: Home Dashboard](#screen-7-home-dashboard)
* [Screen 8: Main Categories Catalog](#screen-8-main-categories-catalog)
* [Screen 9: Product Listing Page (PLP) with Filters](#screen-9-product-listing-page-plp-with-filters)

### Group 3: Global Search
* [Screen 10: Search Input & Suggestions](#screen-10-search-input--suggestions)
* [Screen 11: Search Results Page](#screen-11-search-results-page)

### Group 4: Pharmacies Discovery
* [Screen 12: Near-Me Pharmacies (List & Map)](#screen-12-near-me-pharmacies-list--map)
* [Screen 13: Pharmacy Profile & Catalog](#screen-13-pharmacy-profile--catalog)

### Group 5: Product Details
* [Screen 14: Product Details Page (PDP) - OTC Standard](#screen-14-product-details-page-pdp---otc-standard)
* [Screen 15: Product Details Page (PDP) - POM / Rx Required](#screen-15-product-details-page-pdp---pom--rx-required)

### Group 6: Cart, Prescription & Checkout
* [Screen 16: Multi-Vendor Shopping Cart](#screen-16-multi-vendor-shopping-cart)
* [Screen 17: Prescription Upload & Selection](#screen-17-prescription-upload--selection)
* [Screen 18: Checkout & Payment Selector](#screen-18-checkout--payment-selector)
* [Screen 19: Order Success & Points Earned](#screen-19-order-success--points-earned)

### Group 7: Orders & Tracking
* [Screen 20: Order History & Active Orders Dashboard](#screen-20-order-history--active-orders-dashboard)
* [Screen 21: Real-time Order Tracking & Details](#screen-21-real-time-order-tracking--details)

### Group 8: Profile, Wallet & Settings
* [Screen 22: Profile Dashboard & Wishlist](#screen-22-profile-dashboard--wishlist)
* [Screen 23: Address Book & Map Pin Selector](#screen-23-address-book--map-pin-selector)
* [Screen 24: Wallet & Loyalty Rewards Dashboard](#screen-24-wallet--loyalty-rewards-dashboard)

---

# Screen-by-Screen Specifications & Wireframes

---

## Group 1: Authentication & Onboarding

### Screen 1: Splash Screen

#### Screen Overview
The initial entry point of the app, presenting the brand logo and checking auth states in the background.

#### User Goals
* Experience immediate app responsiveness.
* Verify security/branding.

#### Components
* Central Logo animation
* Version label at footer
* Background medical cross pattern overlay

#### States
* **Loading:** Pulsing logo.
* **Offline:** Dialog showing "No Internet Connection" with "Retry" action.

#### Actions
* **Primary:** Auto-routes to Onboarding or Home.

#### Navigation
* **Entry:** App icon tap.
* **Exit:** Onboarding (Screen 2) or Home (Screen 7).

#### Accessibility
* High contrast logo (4.5:1).
* Screen-reader screen announcements ("YUSUR, your healthcare partner, loading").

#### Mobile UX Notes
* Limit display to max 1.5 seconds. Prevent user key inputs during loading.

#### Wireframe
```
+------------------------------------------+
|                                          |
|                                          |
|                                          |
|                 [ YUSUR ]                |
|               (Brand Logo)               |
|                                          |
|                 (Spinner)                |
|                                          |
|                                          |
|             Version 1.0.0 (KSA)          |
+------------------------------------------+
```

---

### Screen 2: Onboarding Carousel

#### Screen Overview
Introductory slides showing features: Local Pharmacy network, Fast delivery, and Prescription management.

#### User Goals
* Understand platform value proposition.
* Switch to preferred language (Arabic/English) immediately.

#### Components
* Feature illustrations (e.g., cold-chain courier, pharmacies).
* Headline and body text.
* Interactive indicator dots.
* "Skip" and "Next" buttons.
* Language Toggle at top-end.

#### States
* **Default:** Light mode or Dark mode illustrations.

#### Actions
* **Primary:** "Next" (scrolls carousel) / "Get Started" (reaches final slide).
* **Secondary:** "Skip" (bypasses to Login), Language toggle.

#### Navigation
* **Entry:** Splash screen.
* **Exit:** Login (Screen 3) or Register (Screen 4).

#### Accessibility
* Tap targets for buttons are `48px x 48px` minimum.
* Slides support swipe gestures with screen reader descriptions.

#### Mobile UX Notes
* Mirror slides correctly based on RTL selection. English swipe is right-to-left; Arabic swipe is left-to-right.

#### Wireframe
```
+------------------------------------------+
|  [EN/AR Toggle]                          |
|                                          |
|            [ ILLUSTRATION ]              |
|        (Delivery Courier Vaccine)        |
|                                          |
|            Fast Refrigerated             |
|               Med Deliveries             |
|     Get items delivered under strict     |
|     cold-chain control within minutes.   |
|                                          |
|                 ( * o o )                |
|                                          |
|  [SKIP]                         [NEXT]   |
+------------------------------------------+
```

---

### Screen 3: Login Screen

#### Screen Overview
Allows users to enter credentials to login via KSA mobile number.

#### User Goals
* Quickly access active account.

#### Components
* Header (Logo, title).
* Phone Number Input with Saudi flag dropdown (`+966`).
* Password Input with visibility toggle.
* Forgot Password CTA link.
* Login CTA.
* "Register here" link.

#### States
* **Loading:** Disabled buttons with active indicator.
* **Error:** Red outline on inputs, error message ("Invalid password / user does not exist").

#### Actions
* **Primary:** "Login" button.
* **Secondary:** "Forgot Password" link, "Register" link.

#### Navigation
* **Entry:** Onboarding screen.
* **Exit:** OTP verification (Screen 5) or Profile (Screen 22).

#### Accessibility
* Input fields labeled clearly for screen-readers. Keyboard auto-selects numeric for phone.

#### Mobile UX Notes
* Auto-focus the phone number input on entry. Avoid keyboard covering the login button.

#### Wireframe
```
+------------------------------------------+
|  [<- Back]                               |
|                                          |
|                 [ YUSUR ]                |
|                                          |
|            Welcome Back!                 |
|            Please login to continue      |
|                                          |
|  Mobile Number                           |
|  [ +966 ] [ 50 123 4567               ]  |
|                                          |
|  Password                                |
|  [ *******                       ] (eye) |
|                                          |
|                        [Forgot Password?]|
|                                          |
|             [   LOGIN   ]                |
|                                          |
|         Don't have an account? [Register]|
+------------------------------------------+
```

---

### Screen 4: Registration Screen

#### Screen Overview
Creates a new account for first-time healthcare consumers.

#### User Goals
* Safely register personal details.

#### Components
* Full Name text field.
* Email input field.
* Mobile input field (`+966`).
* Password input (with complexity rules indicator: 8 chars, 1 number).
* Terms and Conditions checkbox (includes MOH privacy rules).
* Register button.

#### States
* **Default:** Enabled.
* **Error:** Flags password weakness, invalid email, or duplicate phone.

#### Actions
* **Primary:** "Create Account" button.
* **Secondary:** Terms & conditions link, "Login" redirection.

#### Navigation
* **Entry:** Login screen.
* **Exit:** OTP verification (Screen 5).

#### Accessibility
* Input validation announced dynamically via aria-live regions.

#### Mobile UX Notes
* Password input includes validation checkmarks that update in real-time as the user types.

#### Wireframe
```
+------------------------------------------+
|  [<- Back]                               |
|                                          |
|            Create Account                |
|                                          |
|  Full Name                               |
|  [ Ibrahim Al-Fahad                   ]  |
|                                          |
|  Email Address                           |
|  [ ibrahim@example.sa                 ]  |
|                                          |
|  Mobile Number                           |
|  [ +966 ] [ 50 123 4567               ]  |
|                                          |
|  Password                                |
|  [ ********                      ] (eye) |
|  (x) 8 Chars  (x) 1 Number               |
|                                          |
|  [x] I agree to MOH Terms & Conditions   |
|                                          |
|          [ CREATE ACCOUNT ]              |
+------------------------------------------+
```

---

### Screen 5: OTP Verification Screen

#### Screen Overview
Secure verification step for verification or login, using SMS OTP.

#### User Goals
* Rapidly enter verification code and proceed.

#### Components
* Descriptive text: "We sent a 4-digit code to +966 50****567".
* 4 single-digit OTP input boxes.
* Resend OTP timer (60s countdown).
* Verify button.

#### States
* **Loading:** Disables inputs, verifies code.
* **Error:** Clears boxes, highlights red, displays "Invalid OTP, please try again".

#### Actions
* **Primary:** "Verify" button.
* **Secondary:** "Resend Code" (enabled after countdown).

#### Navigation
* **Entry:** Login/Register.
* **Exit:** Home Dashboard (Screen 7).

#### Accessibility
* Auto-focus on first digit. Supports keyboard backspace for delete mapping.

#### Mobile UX Notes
* Uses iOS/Android OTP auto-fill (SMS user consent prompt). Numerical keyboard only.

#### Wireframe
```
+------------------------------------------+
|  [<- Back]                               |
|                                          |
|            Verify Number                 |
|   Enter 4-digit code sent to your phone  |
|                                          |
|         [ 4 ]  [ 9 ]  [ 2 ]  [   ]       |
|                                          |
|              Resend in 45s               |
|                                          |
|            [ VERIFY & CONTINUE ]         |
+------------------------------------------+
```

---

### Screen 6: Forgot Password Screen

#### Screen Overview
Allows password recovery using SMS verification.

#### User Goals
* Safely reset forgotten credentials.

#### Components
* Phone Number input.
* "Send OTP" button.

#### States
* **Default:** Enabled.
* **Error:** "Phone number not registered".

#### Actions
* **Primary:** "Send Code".

#### Navigation
* **Entry:** Login Screen.
* **Exit:** OTP screen -> Password Reset screen.

#### Wireframe
```
+------------------------------------------+
|  [<- Back]                               |
|                                          |
|            Forgot Password               |
|   Enter your mobile number to reset      |
|                                          |
|  Mobile Number                           |
|  [ +966 ] [ 50 123 4567               ]  |
|                                          |
|             [ SEND OTP CODE ]            |
+------------------------------------------+
```

---

## Group 2: Home & Core Discovery

### Screen 7: Home Dashboard

#### Screen Overview
The central hub of the app, designed for high product and pharmacy discovery.

#### User Goals
* Choose location for deliveries.
* Search for items or vendors globally.
* Discover discounts, promotions, nearby pharmacies, and product categories.

#### Components
* Top Header: Location selector ("Deliver to: Al-Malqa, Riyadh"), Notification Bell icon.
* Global Search Bar (with filter icon).
* Promo Banner Slider (e.g., Mother & Baby 20% Off).
* Categories Grid (Vitamins, Prescriptions, Mother & Baby, Daily Care).
* "Pharmacies Near Me" horizontal slider.
* "Offers & Deals" product carousel.
* "Featured Products" dynamic recommendations grid.
* Global Bottom Navigation (Home active).

#### States
* **Loading/Skeleton:** Shimmer boxes represent banners, categories, and product blocks.
* **Offline:** banner replacement card "You are browsing offline mode. Sync to purchase".

#### Actions
* **Primary:** Tap Category, Pharmacy Card, Product Card.
* **Secondary:** Search bar tap, change location.

#### Navigation
* **Entry:** Onboarding, Login, OTP.
* **Exit:** Search page (Screen 10), Product details (Screen 14), Pharmacy profile (Screen 13), Bottom nav tabs.

#### Accessibility
* Dynamic location label uses clear voiceover values.
* Custom category icons include detailed image alt texts (e.g. "Vitamins category").

#### Mobile UX Notes
* Scroll direction is vertical for page, horizontal for carousels. Header remains sticky on scroll.

#### Wireframe
```
+------------------------------------------+
| [PIN] Deliver to: Al-Malqa, Riyadh  [BELL]|
| [   Search medicines, pharmacies...    ] |
+------------------------------------------+
| +--------------------------------------+ |
| |        20% OFF ALL VITAMINS          | |
| |        (Mother & Baby Week)          | |
| +--------------------------------------+ |
|                 ( o * o )                |
+------------------------------------------+
| CATEGORIES                               |
|  [Rx]      [Vitamins]   [Baby]   [Skin]  |
+------------------------------------------+
| NEARBY PHARMACIES              [View All]|
| +-----------------+   +----------------+ |
| | Al-Dawaa (1.2k) |   | Nahdi (2.1k)   | |
| +-----------------+   +----------------+ |
+------------------------------------------+
| BEST SELLERS                   [View All]|
| +---------------+     +----------------+ |
| | Panadol Extra |     | Vitamin C      | |
| | 12.50 SAR     |     | 45.00 SAR      | |
| +---------------+     +----------------+ |
+------------------------------------------+
| [HOME] [PHARMACY]  [CART]  [ORDER] [PROF]|
+------------------------------------------+
```

---

### Screen 8: Main Categories Catalog

#### Screen Overview
Complete index of categories for organized item browsing.

#### User Goals
* Explore complete category listing without searching.

#### Components
* Header: Title ("Categories"), Search icon.
* Left-column (in LTR) or Right-column (in RTL): Main Categories.
* Main display grid: Sub-categories list under selected parent.

#### States
* **Skeleton:** Column list of categories placeholder.

#### Actions
* **Primary:** Select main category, tap sub-category.

#### Navigation
* **Entry:** Home tab.
* **Exit:** Product Listing Page (Screen 9).

#### Wireframe
```
+------------------------------------------+
| [<-] Categories                    [SRCH]|
+-------------------+----------------------+
|                   |                      |
| [X] Medications   |  MEDICATIONS         |
|     Vitamins      |                      |
|     Baby Care     |  - Chronic Meds      |
|     Beauty        |  - Pain Relief       |
|     Devices       |  - Antibiotics       |
|                   |  - Cold & Flu        |
|                   |                      |
+-------------------+----------------------+
| [HOME] [PHARMACY]  [CART]  [ORDER] [PROF]|
+------------------------------------------+
```

---

### Screen 9: Product Listing Page (PLP) with Filters

#### Screen Overview
Displays list of products based on category selection or filter application.

#### User Goals
* Filter items by price range, brand, pharmacy vendor, and prescription requirements.

#### Components
* Category Header title.
* Filter / Sort Bar: Button triggers bottom sheet filter options.
* Product Cards list/grid toggle.
* Quick Add to Cart action overlay.

#### States
* **Empty:** "No products found matching filters" with "Reset Filters" primary action.

#### Actions
* **Primary:** Filter selection, Sort selection (Price low-to-high, best rating).

#### Navigation
* **Entry:** Category catalog (Screen 8) or Search (Screen 11).
* **Exit:** Product Details Page (Screen 14 / 15).

#### Wireframe
```
+------------------------------------------+
| [<-] Pain Relief (142 Items)       [SRCH]|
| [ Sort: Popular v ]     [ Filter (3) v ] |
+------------------------------------------+
| +---------------+   +------------------+ |
| | Rx Badge      |   | Rx Badge         | |
| | [IMAGE]       |   | [IMAGE]          | |
| | Panadol Extra |   | Solpadeine Sol   | |
| | Al-Dawaa Pharm|   | Nahdi Pharmacy   | |
| | 12.50 SAR (+) |   | 18.00 SAR    (+) | |
| +---------------+   +------------------+ |
| +---------------+   +------------------+ |
| | [IMAGE]       |   | [IMAGE]          | |
| | Adol 500mg    |   | Panadol Joint    | |
| | Whites Pharm  |   | Al-Dawaa Pharm   | |
| | 8.50 SAR  (+) |   | 22.00 SAR    (+) | |
| +---------------+   +------------------+ |
+------------------------------------------+
| [HOME] [PHARMACY]  [CART]  [ORDER] [PROF]|
+------------------------------------------+
```

---

## Group 3: Global Search

### Screen 10: Search Input & Suggestions

#### Screen Overview
Full-screen search panel triggered on home bar click. Designed to capture intent quickly.

#### User Goals
* Immediately search items/pharmacies.
* Access recent searches.

#### Components
* Text input with auto-focus.
* Back/Cancel button.
* Scan Barcode icon.
* "Recent Searches" history list.
* "Trending Searches" tags.
* "Top Pharmacies" recommendations.

#### States
* **Default:** Displays recent/trending searches.
* **Typing:** Shows inline search auto-complete matches.

#### Actions
* **Primary:** Type search query, Tap scan barcode.
* **Secondary:** Clear search history.

#### Navigation
* **Entry:** Home Screen or Category search.
* **Exit:** Search results page (Screen 11).

#### Wireframe
```
+------------------------------------------+
| [<-] [ Search meds, brands...    ] [SCAN]|
+------------------------------------------+
| RECENT SEARCHES               [Clear All]|
| [x] Panadol Actifast                     |
| [x] Vitamin D3 1000IU                    |
+------------------------------------------+
| TRENDING SEARCHES                        |
| [# Flu Season]  [# Baby Milk]            |
| [# Vitamin C]   [# Mask KN95]            |
+------------------------------------------+
| POPULAR BRANDS                           |
| (Nahdi)   (Panadol)   (GNC)   (Bayer)    |
+------------------------------------------+
```

---

### Screen 11: Search Results Page

#### Screen Overview
Shows final results matching queries, segregated by Products vs Pharmacies.

#### User Goals
* Locate exact match of items or locate pharmacy vendor.

#### Components
* Search term header.
* Tab Selector: "Products (42)" | "Pharmacies (2)".
* Products list or Pharmacies list matching term.

#### States
* **Empty:** Custom illustration: "No results for 'Panadol Extra'. Check spelling or ask our pharmacist for alternatives."

#### Navigation
* **Entry:** Search suggestions.
* **Exit:** Product Detail (Screen 14), Pharmacy details (Screen 13).

#### Wireframe
```
+------------------------------------------+
| [<-] [ Panadol                           |
+------------------------------------------+
|    [ PRODUCTS (3) ]     [ PHARMACIES (1) ]|
+------------------------------------------+
| +--------------------------------------+ |
| | [IMG] Panadol Extra (Rx)             | |
| | Al-Dawaa | 12.50 SAR            [(+)]| |
| +--------------------------------------+ |
| +--------------------------------------+ |
| | [IMG] Panadol Joint                  | |
| | Nahdi  | 22.00 SAR              [(+)]| |
| +--------------------------------------+ |
| +--------------------------------------+ |
| | [IMG] Panadol Night                  | |
| | Whites | 15.00 SAR              [(+)]| |
| +--------------------------------------+ |
+------------------------------------------+
```

---

## Group 4: Pharmacies Discovery

### Screen 12: Near-Me Pharmacies (List & Map)

#### Screen Overview
Allows users to discover pharmacy branches near their location.

#### User Goals
* Find open pharmacies with shortest delivery times.
* Filter pharmacies by ratings or offers.

#### Components
* Map View overlay (top 40% of screen).
* Toggle button: "Map View" / "List View".
* Pharmacy Search input.
* Filter tags (Open 24/7, Free Delivery, Fast Delivery).
* Bottom list of Pharmacy cards.

#### States
* **Default:** Interactive map pins indicating locations.
* **Loading:** Maps shimmer placeholder cards.

#### Actions
* **Primary:** Tap pharmacy card.
* **Secondary:** Tap map pin.

#### Navigation
* **Entry:** Bottom Navigation Tab 2 ("Pharmacies").
* **Exit:** Pharmacy Catalog details (Screen 13).

#### Wireframe
```
+------------------------------------------+
| [PIN] Riyadh, Al-Malqa                   |
+------------------------------------------+
|                                          |
|                [   MAP   ]               |
|            (Pharmacy pins)               |
|                                          |
+------------------------------------------+
| [X] Open 24/7    [ ] Free Del    [ ] Near|
+------------------------------------------+
| +--------------------------------------+ |
| | [LOGO] Al-Dawaa Pharmacy      (4.8*) | |
| | 1.2 km | 20-30 mins | Fee: 10 SAR    | |
| | [PROMO: Buy 2 Get 1 Free]            | |
| +--------------------------------------+ |
| +--------------------------------------+ |
| | [LOGO] Nahdi Pharmacy         (4.9*) | |
| | 2.1 km | 15-25 mins | Fee: 5 SAR     | |
| +--------------------------------------+ |
| [HOME] [PHARMACY]  [CART]  [ORDER] [PROF]|
+------------------------------------------+
```

---

### Screen 13: Pharmacy Profile & Catalog

#### Screen Overview
The main interface representing a specific vendor pharmacy branch, highlighting catalog search.

#### User Goals
* Browse specific catalog items of selected branch.
* Check delivery constraints.

#### Components
* Pharmacy banner header image.
* Branch details: Name, Open status, Rating stars, Location, Delivery ETA.
* Tabs: "All Products" | "Offers" | "Reviews (120)".
* Sub-categories sliding row.
* Product list specific to pharmacy.

#### States
* **Offline:** "Pharmacy offline. You cannot add products right now".

#### Actions
* **Primary:** Add item to cart.
* **Secondary:** View offers, read reviews.

#### Navigation
* **Entry:** Pharmacy list or search result.
* **Exit:** Product Detail (Screen 14).

#### Wireframe
```
+------------------------------------------+
| [<- Back]                     [Share] [H]|
| [IMAGE: Pharmacy Banner Storefront]      |
|                                          |
| Al-Dawaa Pharmacy - Al-Malqa Branch      |
| (4.8*) 120 Reviews   | [Open 24 Hours]   |
| Delivery: 20-30 mins | Fee: 10 SAR       |
+------------------------------------------+
|   [ PRODUCTS ]   [ OFFERS ]   [ REVIEWS ]|
+------------------------------------------+
| [All]  [Cold & Flu]  [Vitamins]  [Baby]  |
+------------------------------------------+
| +---------------+   +------------------+ |
| | [IMAGE]       |   | [IMAGE]          | |
| | Panadol Extra |   | Vitamin C 1000mg | |
| | 12.50 SAR (+) |   | 32.00 SAR    (+) | |
| +---------------+   +------------------+ |
+------------------------------------------+
```

---

## Group 5: Product Details

### Screen 14: Product Details Page (PDP) - OTC Standard

#### Screen Overview
Standard product page for wellness, cosmetics, or non-prescription products.

#### User Goals
* View product description, directions, reviews.
* Check expiry guarantees and active vendor options.

#### Components
* Image gallery slider (aspect ratio 1:1) with indicator dots.
* Product Name & dosage details.
* Price tag & Discount display.
* Expiry Date Guarantee card ("Guaranteed expiry after Dec 2027").
* Multi-vendor alternative sellers picker ("Also available at: Nahdi Pharmacy for 11.00 SAR").
* Product Description, Warnings, and Ingredients collapsible tabs.
* Add to Cart floating action button (bottom bar).

#### States
* **Loading:** Skeleton structure.
* **Success:** Toast notification: "Product added to Cart".

#### Actions
* **Primary:** "Add to Cart" button.
* **Secondary:** Add to Wishlist (Heart icon), Select alternative seller.

#### Navigation
* **Entry:** Product listings.
* **Exit:** Cart page (Screen 16) or back.

#### Accessibility
* Alternate texts for gallery images. Accordions are accessible via keyboard triggers.

#### Mobile UX Notes
* Sticky bottom bar holds price and Add CTA to ensure constant conversion route.

#### Wireframe
```
+------------------------------------------+
| [<- Back]                     [Wish] [SH]|
|                                          |
|                 [ IMAGE ]                |
|             (Vitamins bottle)            |
|                                          |
|                 ( * o o )                |
+------------------------------------------+
| Solgar Vitamin D3 1000 IU (90 Caps)      |
| Rating: 4.8 (85 Reviews)                 |
|                                          |
| 65.00 SAR  [Original: 80.00 SAR]         |
| [ GUARANTEE: Expiry date > 12 Months ]   |
+------------------------------------------+
| Select Vendor                            |
| (o) Al-Dawaa Pharmacy (Fastest - 20m)   |
| ( ) Nahdi Pharmacy (Cheaper - 60.00 SAR) |
+------------------------------------------+
| DESCRIPTION                          [v] |
| DIRECTIONS                           [v] |
+------------------------------------------+
| [Qty: - 1 +]            [ ADD TO CART ]  |
+------------------------------------------+
```

---

### Screen 15: Product Details Page (PDP) - POM / Rx Required

#### Screen Overview
Special layout for prescription-only medicine. Designed to enforce legal constraints.

#### User Goals
* Learn about the drug uses and legal verification process.
* Request pharmacist review/consultation.

#### Components
* Product Image gallery.
* Red "Rx / Prescription Required" Warning Alert.
* Product Description (educational, non-promotional).
* Interactive "Check Prescriptions" widget.
* Primary Floating CTA: "Select & Upload Prescription".
* Secondary CTA: "Consult Pharmacist" helpline button.

#### States
* **Disabled:** Add to Cart button is deactivated until prescription verification flow completes.

#### Actions
* **Primary:** "Upload Prescription".
* **Secondary:** Pharmacist Chat.

#### Navigation
* **Entry:** Product search/listings.
* **Exit:** Prescription Upload page (Screen 17).

#### Wireframe
```
+------------------------------------------+
| [<- Back]                     [Wish] [SH]|
|                                          |
|                 [ IMAGE ]                |
|               (Inhaler Box)              |
+------------------------------------------+
| Ventolin Inhaler 100mcg                  |
|                                          |
| ! PRESCRIPTION REQUIRED (SFDA REGULATED) |
| This medicine requires a valid medical   |
| prescription to be uploaded.             |
|                                          |
| Price: 24.30 SAR                         |
+------------------------------------------+
| MEDICAL INFORMATION                      |
| Indications, Dosages, Warnings.          |
+------------------------------------------+
| [ASK PHARMACIST]   [ UPLOAD PRESCRIPTION]|
+------------------------------------------+
```

---

## Group 6: Cart, Prescription & Checkout

### Screen 16: Multi-Vendor Shopping Cart

#### Screen Overview
The unified cart interface that aggregates and groups items by pharmacy vendor.

#### User Goals
* Review cart items and quantities.
* Understand delivery splits and shipping charges.
* Apply promotional coupons.

#### Components
* Cart Header showing total items.
* Vendor Sections (e.g. Pharmacy A and Pharmacy B). Each shows:
  - Pharmacy Name and delivery ETA.
  - Cart items with quantity adjusts and delete CTAs.
  - Free delivery progression bars.
* Coupon Code Input panel.
* Cost Summary panel showing split delivery details.
* Primary CTA: "Proceed to Checkout".

#### States
* **Empty:** Icon illustration with text "Your cart is empty. Search for medicines to get started."
* **Success:** Coupon code approved alert.

#### Actions
* **Primary:** "Proceed to Checkout".
* **Secondary:** Apply promo code, change quantities.

#### Navigation
* **Entry:** Global Cart tab or PDP.
* **Exit:** Checkout Screen (Screen 18) or Home (Screen 7).

#### Accessibility
* Quantity adjust buttons have clear labels ("Increase item count").

#### Mobile UX Notes
* Sticky footer lists checkout button with aggregate price value.

#### Wireframe
```
+------------------------------------------+
| Cart (3 Items)                           |
+------------------------------------------+
| PHARMACY 1: AL-DAWAA (ETA: 20-30 mins)   |
| [IMG] Panadol Extra | 12.50 SAR          |
|       Qty: [-] 2 [+]              [Trash]|
|                                          |
| (i) Add 20 SAR more for FREE delivery.   |
+------------------------------------------+
| PHARMACY 2: NAHDI PHARMACY (ETA: 1 Hour) |
| [IMG] Baby Milk Similac | 85.00 SAR      |
|       Qty: [-] 1 [+]              [Trash]|
+------------------------------------------+
| [ Enter Coupon Code         ]  [ APPLY ] |
+------------------------------------------+
| Subtotal:                     110.00 SAR |
| Delivery Fees (Split):         15.00 SAR |
| VAT (15%):                     18.75 SAR |
| TOTAL:                        143.75 SAR |
+------------------------------------------+
|             [ PROCEED TO CHECKOUT ]      |
+------------------------------------------+
```

---

### Screen 17: Prescription Upload & Selection

#### Screen Overview
Dedicated portal to select or upload doctor prescriptions for POM items.

#### User Goals
* Upload clear prescription picture or link existing digital prescriptions.

#### Components
* Header back button.
* Method Selector Tabs: "Upload Image" | "Select Saved".
* Photo upload container (triggers Camera or Photo Gallery selection).
* Saved Prescriptions list (history check).
* National Health ID input (link with Sehaty).
* "Confirm Prescription" button.

#### States
* **Loading:** Image processing status/validation bar.

#### Actions
* **Primary:** Take photo, upload file.

#### Navigation
* **Entry:** PDP Rx required page.
* **Exit:** Cart page (with valid Rx tag attached).

#### Wireframe
```
+------------------------------------------+
| [<- Back] Upload Prescription            |
+------------------------------------------+
| Select upload method:                    |
|                                          |
|   +----------------------------------+   |
|   |         [ CAMERA ICON ]          |   |
|   |          Take Photo of           |   |
|   |           Prescription           |   |
|   +----------------------------------+   |
|   |         [ GALLERY ICON ]         |   |
|   |        Upload PDF/Image          |   |
|   +----------------------------------+   |
|                                          |
|   Or link from MOH Sehaty Account:       |
|   [ Fetch Sehaty Prescriptions   ] (Go)  |
|                                          |
|              [ SUBMIT FOR REVIEW ]       |
+------------------------------------------+
```

---

### Screen 18: Checkout & Payment Selector

#### Screen Overview
Final order details, delivery selections, and payment method options page.

#### User Goals
* Confirm delivery addresses.
* Select payment methods (local KSA integrations).
* Use Wallet or Loyalty balances to deduct checkout cost.

#### Components
* Delivery Address section (shows current home tag with Edit button).
* Shipping options (Standard, Fast, Cold Chain).
* Payment Methods Selection: Mada, Apple Pay, STC Pay, Credit Card, Cash on Delivery.
* Wallet Switcher ("Use Wallet Balance: 45.00 SAR").
* Loyalty Switcher ("Redeem 500 Points for 10.00 SAR").
* Invoice summary breakdown.
* Legal Notice: "By checking out, you accept SFDA safety instructions".
* Place Order button.

#### States
* **Default:** Standard checkout balance.
* **Wallet Applied:** Recalculates remaining payment balance showing wallet deductions.

#### Actions
* **Primary:** "Place Order" (opens payment validation or success page).
* **Secondary:** Add Address, Add Payment.

#### Navigation
* **Entry:** Proceed checkout.
* **Exit:** Order Success (Screen 19) or Payment Authentication.

#### Wireframe
```
+------------------------------------------+
| [<-] Checkout                            |
+------------------------------------------+
| DELIVERY ADDRESS                         |
| Home: Al-Malqa Road, Building 14    [Edit]|
+------------------------------------------+
| PAYMENT METHOD                           |
| (o) [mada] Mada Card (Default)           |
| ( ) [ApplePay] Apple Pay                 |
| ( ) [stcpay] STC Pay                     |
+------------------------------------------+
| WALLET & REWARDS                         |
| [x] Apply Wallet (Bal: 45.50 SAR)        |
| [ ] Redeem Loyalty (Bal: 12.00 SAR)      |
+------------------------------------------+
| SUMMARY                                  |
| Items Total:                  110.00 SAR |
| Wallet Deduction:             -45.50 SAR |
| Delivery Total:                15.00 SAR |
| VAT (15%):                     18.75 SAR |
| Total Payable:                 98.25 SAR |
+------------------------------------------+
|             [ PLACE ORDER ]              |
+------------------------------------------+
```

---

### Screen 19: Order Success & Points Earned

#### Screen Overview
Order confirmation success splash screen showing split order mappings and earned rewards.

#### User Goals
* Verify successful order transaction.
* Understand next steps (pharmacist validation, delivery ETAs).

#### Components
* Large green success icon checkmark.
* Headline: "Order Placed Successfully!".
* Subtitle: "Your order has been split into 2 shipments: #YS-812 and #YS-813".
* Delivery ETAs list.
* Points Reward Card ("You earned +50 Loyalty Points!").
* CTAs: "Track Orders" and "Continue Shopping".

#### States
* **Success:** Green theme accents.

#### Actions
* **Primary:** "Track Order".
* **Secondary:** "Continue Shopping".

#### Navigation
* **Entry:** Place order success trigger.
* **Exit:** Track Orders (Screen 21) or Home (Screen 7).

#### Wireframe
```
+------------------------------------------+
|                                          |
|                  [check]                 |
|                                          |
|         Order Placed Successfully!       |
|    Thank you for ordering with YUSUR.    |
|                                          |
|  Order Shipment #YS-812 (Al-Dawaa)       |
|  ETA: 20-30 mins                         |
|                                          |
|  Order Shipment #YS-813 (Nahdi)          |
|  ETA: 1 Hour                             |
+------------------------------------------+
|  +------------------------------------+  |
|  | LOYALTY POINTS EARNED              |  |
|  | +50 Points added to your profile   |  |
|  +------------------------------------+  |
|                                          |
|            [ TRACK ORDERS ]              |
|          [ Continue Shopping ]           |
+------------------------------------------+
```

---

## Group 7: Orders & Tracking

### Screen 20: Order History & Active Orders Dashboard

#### Screen Overview
List of user's past transactions and ongoing active deliveries.

#### User Goals
* Check status of active shipments.
* Instantly repeat past purchases.

#### Components
* Screen Title.
* Filter tabs: "Active Orders" | "Order History".
* Order Cards list showing item summary, dates, totals, status tags, and action buttons.

#### States
* **Empty:** "No orders placed yet. Start ordering your healthcare needs today."
* **Loading:** Skeleton list.

#### Actions
* **Primary:** "Track Order" (for active orders), "Reorder" (for history).

#### Navigation
* **Entry:** Bottom Navigation Tab 4 ("Orders").
* **Exit:** Tracking page (Screen 21) or PDP details.

#### Wireframe
```
+------------------------------------------+
| Orders                                   |
+------------------------------------------+
|         [ ACTIVE ]       [ HISTORY ]     |
+------------------------------------------+
| Order #YS-812                            |
| Date: June 18, 2026                      |
| Status: [ Out For Delivery ]             |
| Al-Dawaa Pharmacy | 2 Items | 34.50 SAR  |
| [ REORDER ]              [ TRACK ORDER ] |
+------------------------------------------+
| Order #YS-705                            |
| Date: May 12, 2026                       |
| Status: [ Completed ]                    |
| Nahdi Pharmacy | 1 Item | 45.00 SAR      |
| [ REORDER ]              [ View Invoice ]|
+------------------------------------------+
| [HOME] [PHARMACY]  [CART]  [ORDER] [PROF]|
+------------------------------------------+
```

---

### Screen 21: Real-time Order Tracking & Details

#### Screen Overview
Live delivery updates page displaying driver routes and status progress.

#### User Goals
* View delivery rider location on map.
* Contact delivery driver or pharmacist support.

#### Components
* Tracking Header displaying Order ID.
* Live Map view tracking vehicle pin.
* Stepper Progress Tracker:
  - 1. Order Placed
  - 2. Prescription Approved (if POM)
  - 3. Preparing items
  - 4. Out for delivery (Driver Name / Contact call icon)
  - 5. Delivered
* Pharmacist Consultation Call Banner.
* Cancel Order Button (active only during steps 1 & 2).

#### States
* **Raining/Delay Alert:** Text banner warning "Delays due to local weather conditions".

#### Actions
* **Primary:** Call Driver, Call Pharmacist.
* **Secondary:** Cancel Order (if eligible).

#### Navigation
* **Entry:** Active orders list or checkout success.
* **Exit:** Orders list dashboard.

#### Wireframe
```
+------------------------------------------+
| [<-] Track Order #YS-812                 |
+------------------------------------------+
|                                          |
|                [  MAP  ]                 |
|             (Rider Route Pin)            |
|                                          |
+------------------------------------------+
| STATUS: OUT FOR DELIVERY                 |
| Rider: Ahmed Al-Harbi          [Call]    |
+------------------------------------------+
| PROGRESS:                                |
|  [x] Order Placed               11:15 AM |
|  [x] Preparing Shipment         11:25 AM |
|  [/] Out for Delivery (Rider)   11:35 AM |
|  [ ] Arriving                   11:45 AM |
+------------------------------------------+
| Need help with this medicine?            |
| [ Call Licensed Pharmacist Helpline ]    |
+------------------------------------------+
```

---

## Group 8: Profile, Wallet & Settings

### Screen 22: Profile Dashboard & Wishlist

#### Screen Overview
Core profile dashboard hosting user details, address settings, wishlist, and language configurations.

#### User Goals
* Toggle app language.
* Review wishlist items.
* Log out safely.

#### Components
* Avatar container with user Name, Phone, and Email.
* Settings Menus List:
  - Wishlist (with saved item counter).
  - Address Management.
  - Payment Details.
  - Language Settings (English / Arabic toggle).
  - Help & Support.
  - Privacy Policy.
* Log Out CTA.

#### States
* **Success:** Language switched confirmation reload.

#### Actions
* **Primary:** Navigation to child directories, Toggle Language.

#### Navigation
* **Entry:** Bottom Navigation Tab 5 ("Profile").
* **Exit:** Wishlist Screen (Section below), Address Book (Screen 23), Wallet/Loyalty Dashboard (Screen 24).

#### Wireframe
```
+------------------------------------------+
| Profile                                  |
+------------------------------------------+
| [AVATAR] Ibrahim Al-Fahad                |
|          ibrahim@example.sa | +96650123  |
+------------------------------------------+
| MENUS                                    |
| [Heart] My Wishlist (4 Items)        [>] |
| [Map]   My Delivery Addresses        [>] |
| [Card]  Saved Payment Methods        [>] |
| [Lang]  App Language: English (Change)[>]|
| [Help]  Support & Help Center        [>] |
| [Exit]  Log Out                      [>] |
+------------------------------------------+
| [HOME] [PHARMACY]  [CART]  [ORDER] [PROF]|
+------------------------------------------+
```

---

### Screen 23: Address Book & Map Pin Selector

#### Screen Overview
Addresses list panel and map picker to pinpoint new locations.

#### User Goals
* Set exact physical home/work delivery locations.

#### Components
* Address List panel (displays saved home/work cards).
* "Add New Address" CTA.
* Map screen overlay with Pin Drop picker.
* Address details sheet (Street name, villa/apartment, block details, National Address).

#### States
* **Loading:** Geolocation coordinate lookup.

#### Actions
* **Primary:** Add address, Drop map pin.

#### Navigation
* **Entry:** Profile -> Address list.
* **Exit:** Profile dashboard.

#### Wireframe
```
+------------------------------------------+
| [<-] Add Delivery Address                |
+------------------------------------------+
|                                          |
|            [ DROP PIN MAP ]              |
|        (Drag to set location)            |
|                                          |
+------------------------------------------+
| SET ADDRESS DETAILS                      |
| Street Name: Al-Malqa, Riyadh            |
| [ House / Villa ]   [ Apartment / Office ]|
| Building Number: [ 4812                ] |
| Additional Notes: [ Near pharmacy      ] |
|                                          |
|            [ SAVE ADDRESS ]              |
+------------------------------------------+
```

---

### Screen 24: Wallet & Loyalty Rewards Dashboard

#### Screen Overview
Centralized finance dashboard tracking monetary refunds, points balance, and loyalty progression.

#### User Goals
* Monitor cashback, refund credits, and loyalty point conversions.
* Review rules on earning/redeeming points.

#### Components
* Double Tab Widget: "YUSUR Wallet" | "Loyalty Rewards".
* Wallet Section:
  - Gradient Card displaying Balance (`245.50 SAR`).
  - Cash-back vs. Promo credit breakout breakdown.
  - "Top Up" input field and CTA.
  - Transaction ledger history.
* Loyalty Rewards Section:
  - Gold Member badge.
  - Points balance: `1,200 pts` (Equivalent to `24.00 SAR`).
  - Interactive Points conversion rules info slider.
  - History log of earned points.

#### States
* **Default:** Displays live balance.
* **Success:** Wallet balance successfully topped up alert.

#### Actions
* **Primary:** Top up wallet, redeem points.

#### Navigation
* **Entry:** Profile menu or checkout link.
* **Exit:** Profile screen.

#### Wireframe
```
+------------------------------------------+
| [<-] Wallet & Loyalty                    |
+------------------------------------------+
|      [ YUSUR WALLET ]     [ LOYALTY ]    |
+------------------------------------------+
| +--------------------------------------+ |
| | YUSUR WALLET                         | |
| | Balance: 245.50 SAR                  | |
| | [Refunds: 200 SAR | Promo: 45.50 SAR]| |
| +--------------------------------------+ |
| [ Top Up Wallet (Enter Amount) ] [GO]   |
+------------------------------------------+
| TRANSACTION LEDGER                       |
| - Refund Order #YS-701        +200.00 SAR|
| - Used at Checkout #YS-692     -50.00 SAR|
| - Top-up Mada card            +100.00 SAR|
+------------------------------------------+
```
