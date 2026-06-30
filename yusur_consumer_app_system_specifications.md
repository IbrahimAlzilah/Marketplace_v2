# YUSUR Healthcare Marketplace Consumer Web Application
## Enterprise Solution Architecture & Business Workflow Specifications

---

## 1. System-Wide Architectural Overview

The **YUSUR Consumer App** is built as a Next.js single-page application utilizing React client components. 
- **Routing:** Supported via Next.js App Router.
- **State Management:** Leveraged via a central React Context Provider (`AppContext.js`) that persists core states (active session, cart items, loyalty points, wallet ledger, addresses, and search history) and handles localStorage/sessionStorage hydration sync.
- **Styling:** Controlled by a semantic Vanilla CSS design system (`globals.css`) containing light/dark mode variables and high-contrast accessibility options.
- **Compliance Gating:** Integrated MOH (Ministry of Health) and SFDA (Saudi Food & Drug Authority) safety rules directly in the checkout, cart, and product detail components.

---

## 2. Feature-by-Feature Functional & Technical Specifications

---

# Feature 1: Splash Screen & Connection Check

## 1. Functional Analysis
The Splash Screen acts as the immediate entry point, rendering the brand logo and executing basic startup validation checks. If the application detects that the device is offline, it blocks UI progression and loads a modal overlay giving options to "Retry Connection" or "Continue in Demo Mode".

## 2. Technical Analysis
- **Entry Points:** App URL tap.
- **Exit Points:** Onboarding Carousel (first-time users) or Home Dashboard (returning users).
- **Component File:** [HomePage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/home/page.js#L464-L546) (rendered as conditional overlay).
- **State Management:** `showSplash` (boolean), `isOffline` (boolean, hooked to `navigator.onLine`).
- **Timing:** 2.5-second duration on initial startup.

## 3. Business Analysis
- **Purpose:** Immediate branding and security validation.
- **User Goal:** Rapid app startup and visibility.
- **Business Goal:** Ensure order integrity by preventing users from initiating checkouts while offline.
- **Regulatory Rules:** Compliance check on network states before contacting secure MOH/SFDA APIs.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([App Launched]) --> CheckNetwork{Network Online?}
    
    CheckNetwork -- No --> ShowOfflineOverlay[Show Offline Warning & Spinner]
    ShowOfflineOverlay --> UserChoice{User Action}
    UserChoice -- Tap Retry --> CheckNetwork
    UserChoice -- Tap Demo Mode --> BypassOffline[Bypass Offline Alert] --> CheckSplashSeen
    
    CheckNetwork -- Yes --> ShowSplashAnimation[Render Pulsing Logo & Version]
    ShowSplashAnimation --> LoadSessionData[Hydrate localStorage Session]
    LoadSessionData --> CheckSplashSeen{Splash Seen Before?}
    
    CheckSplashSeen -->|No, 2.5s Timeout| CheckOnboardingSeen{Onboarding Completed?}
    CheckSplashSeen -->|Yes, Instant| CheckOnboardingSeen
    
    CheckOnboardingSeen -- No --> RedirectOnboarding[Redirect to Onboarding Carousel]
    CheckOnboardingSeen -- Yes --> RedirectHome[Redirect to Home Dashboard]
    
    BypassOffline --> CheckOnboardingSeen
    RedirectOnboarding --> End([End Node])
    RedirectHome --> End
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Listens to `window` online/offline events; renders pulsing shimmers and overlays.
- **Backend:** N/A (startup validation phase).

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant App as Client (SPA)
    participant LS as LocalStorage
    
    User->>App: Launch URL
    App->>App: Check navigator.onLine status
    alt Device Offline
        App->>User: Display Offline Modal with "Retry"
    else Device Online
        App->>LS: Check isLoggedIn & hasSeenOnboarding
        LS-->>App: Return flags
        App->>User: Transition to Home or Onboarding
    end
```

## 7. Edge Cases & Risks
- **Edge Case:** Flapping connection during load. *Mitigation:* App listens to network changes dynamically.
- **Risk:** Session hydration locks due to browser localStorage blockages. *Mitigation:* Hydration-safe client-side check protects UI loads.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Add an explicit API-driven ping endpoint check rather than relying solely on `navigator.onLine` to identify captive portals (e.g. airport Wi-Fi).

---

# Feature 2: Onboarding Carousel

## 1. Functional Analysis
An interactive introduction demonstrating local pharmacy indexing, cold-chain refrigeration logistics, and digital wallet rewards. Features a language toggle (English/Arabic) in the upper corner and navigation triggers ("Skip" and "Next/Get Started").

## 2. Technical Analysis
- **Entry Points:** Splash screen exit.
- **Exit Points:** Login Panel / Home Page.
- **Component File:** [HomePage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/home/page.js#L548-L616) (rendered as conditional onboarding overlay).
- **State Management:** `showOnboarding` (boolean), `onboardingStep` (integer, 0-2).
- **Behavior:** Slide mirroring for RTL (Right-To-Left) Arabic layouts.

## 3. Business Analysis
- **Purpose:** Educating first-time users on core USPs.
- **User Goal:** Quickly understand application value.
- **Business Goal:** Highlight cold-chain capabilities to promote chronic medicine orders.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Onboarding Overlay Mounted]) --> ShowSlide[Render Active Onboarding Slide]
    ShowSlide --> LanguageCheck{Language Selected?}
    LanguageCheck -- English --> SetLTR[Align Content LTR]
    LanguageCheck -- Arabic --> SetRTL[Align Content RTL & Mirror Swipe]
    
    SetLTR --> UserAction{User Option}
    SetRTL --> UserAction
    
    UserAction -- Tap Language Toggle --> ToggleLanguage[Switch Language State] --> ShowSlide
    UserAction -- Tap Skip --> SaveOnboardingFlag[Set hasSeenOnboarding = true] --> ExitOnboarding[Close Carousel Overlay]
    UserAction -- Tap Next --> IncrementStep[onboardingStep + 1] --> CheckLast{Is Last Slide?}
    
    CheckLast -- No --> ShowSlide
    CheckLast -- Yes --> ChangeBtnLabel[Rename Button: Get Started] --> UserGetStarted[Tap Get Started] --> SaveOnboardingFlag
    
    ExitOnboarding --> End([End Node])
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Transitions slides; switches RTL/LTR layout based on active languages.
- **Backend:** N/A.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant App as Client (SPA)
    participant LS as LocalStorage
    
    User->>App: Interact with slide
    alt Toggle Language
        App->>App: Toggle language state (en/ar)
        App->>App: Set documentElement.dir (ltr/rtl)
    else Tap Skip / Get Started
        App->>LS: Set hasSeenOnboarding = true
        App->>App: Unmount Onboarding Modal
    end
```

## 7. Edge Cases & Risks
- **Edge Case:** Swipe directions not mirroring properly. *Mitigation:* Explicit `.dir` check changes flex alignments dynamically.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Cache chosen language immediately to avoid reset on login transitions.

---

# Feature 3: Authentication (Login, Register, OTP & Forgot Password)

## 1. Functional Analysis
Enforces user authentication utilizing Saudi Mobile Numbers (`+966`). Registration validates password complexity rules in real-time. Verification steps are managed via SMS OTP with a countdown retry timer. Forgot Password initiates password resets via SMS codes.

## 2. Technical Analysis
- **Entry Points:** Top Navbar "Login" CTA, Checkout Location/Auth gates.
- **Exit Points:** Home Page (authenticated status) or Checkout Page.
- **Component File:** [AuthModal.js](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/components/AuthModal.js).
- **State Management:** `step` (login, register, otp, forgot, otp-forgot, reset), `otpDigits` (4-digit array), `timer` (OTP resend cooldown).
- **Test Bypass Code:** Code `4921`, `1234`, or `9999` bypasses SMS validation for demonstration.

## 3. Business Analysis
- **Purpose:** Restrict pharmaceutical shopping to registered patients.
- **Business Goal:** Match orders with validated identities in line with MOH prescriptions policies.
- **Regulatory Rules:** Real-time MOH terms acceptance checkpoint during registration.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Auth Modal Opened]) --> DefaultStep[Render Login Form]
    
    DefaultStep --> LoginAction{User Options}
    
    LoginAction -- Input Details & Submit --> ValidateLogin[Validate Mobile Format & Credentials]
    ValidateLogin --> API_CheckUser{API: User Registered?}
    API_CheckUser -- Yes --> SendOTP[API: Dispatch OTP SMS] --> TransitionOTP[Transition to OTP Step]
    API_CheckUser -- No --> ShowAuthError[Show Error Outline on Field] --> DefaultStep
    
    LoginAction -- Tap Register Link --> RenderRegister[Render Register Form]
    RenderRegister --> TypePassword[Type Password]
    TypePassword --> RealtimeCheck{8 Chars & 1 Number?}
    RealtimeCheck -- Pass --> ShowCheckmark[Highlight Checkmarks Green]
    RealtimeCheck -- Fail --> ShowCross[Highlight Checkmarks Red]
    
    RenderRegister -- Submit Registration --> CheckMOHAgreement{MOH Checked?}
    CheckMOHAgreement -- No --> ShowRegisterError[Show Agreement Error] --> RenderRegister
    CheckMOHAgreement -- Yes --> RegisterAPI[API: Create Account] --> SendOTP
    
    LoginAction -- Tap Forgot Link --> RenderForgot[Render Forgot Password Form]
    RenderForgot -- Submit Mobile --> API_ForgotCheck{API: Registered?}
    API_ForgotCheck -- Yes --> SendForgotOTP[API: Dispatch Cooldown SMS] --> TransitionForgotOTP[Transition to Forgot OTP Step]
    API_ForgotCheck -- No --> ShowForgotError[Show Error: User Not Found] --> RenderForgot
    
    TransitionOTP --> EnterOTP[Enter 4-Digit SMS Code]
    TransitionForgotOTP --> EnterOTP
    
    EnterOTP --> AutoFocusNext[Focus Shift to Next Box]
    EnterOTP -- Backspace --> ShiftFocusBack[Focus Shift Backwards]
    
    EnterOTP -- Submit Code --> ValidateOTP{OTP == 4921 / 1234 / 9999?}
    ValidateOTP -- No --> ShowOTPError[Show Invalid OTP Msg]
    ValidateOTP -- Yes --> CheckStepType{Step Type?}
    
    CheckStepType -- Login/Register Step --> SetLoggedIn[Set isLoggedIn = true & Cache Session] --> EndAuth[Close Modal & Return Success]
    CheckStepType -- Forgot Password Step --> TransitionReset[Transition to Reset Password Form]
    
    TransitionReset -- Submit New Credentials --> MatchPasswords{Passwords Match?}
    MatchPasswords -- No --> ShowResetError[Show Password Mismatch Error]
    MatchPasswords -- Yes --> UpdateCredentials[API: Update Password] --> SetLoggedIn
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Manages local sub-steps; auto-focuses OTP digits; checks password checks dynamically; sets Saudi code selector.
- **Backend:** Dispatches SMS OTP; confirms hashed credentials; registers user records; issues JWT authorization cookies.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (AuthModal)
    participant BE as Backend API
    participant SMS as SMS Gateway
    
    User->>FE: Inputs credentials + Submits
    FE->>BE: POST /api/auth/login { phone, password }
    Note right of BE: Validates phone structure + hashes
    BE->>SMS: Request OTP Dispatch
    SMS-->>User: SMS Verification Code (e.g. 4921)
    BE-->>FE: Return status (Pending OTP)
    FE->>User: Render OTP boxes (60s countdown)
    User->>FE: Inputs 4-digit code
    FE->>BE: POST /api/auth/verify { phone, code }
    BE-->>FE: Return session JWT cookie
    FE->>FE: set isLoggedIn = true
    FE-->>User: Auth Success, redirect
```

## 7. Edge Cases & Risks
- **Edge Case:** SMS delay. *Mitigation:* Countdown timer locks Resend button for 60 seconds to prevent API spam.
- **Risk:** Scripted brute-forcing of OTP box. *Mitigation:* Bypass limits allow only test codes; production enforces rate limiting.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Implement native iOS/Android SMS OTP autofill properties (`autocomplete="one-time-code"`).

---

# Feature 4: Home Dashboard & Discovery

## 1. Functional Analysis
The Home Dashboard serves as the content directory:
- Header coordinates delivery location tag selections and updates a notification center.
- Promos slider executes continuous banner transitions.
- Categories grid directs users to listing filters.
- Nearby pharmacies carousel indexes local branches by proximity.
- Best sellers and recently viewed products sections showcase personalized items.

## 2. Technical Analysis
- **Entry Points:** Successful authentication redirect / URL launch.
- **Exit Points:** Search Results Page, Pharmacy storefront, PDP.
- **Component File:** [HomePage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/home/page.js).
- **State Management:** `recentlyViewed` (array of product IDs), `currentAddress` (hydrated active address).

## 3. Business Analysis
- **Purpose:** Core conversion hub.
- **User Goal:** Quickly search items, find local pharmacies, and redeem deals.
- **Business Goal:** Personalize item discovery to maximize average order value (AOV).

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Home Mounted]) --> LoadBanners[Load Promotion Banners]
    LoadBanners --> RunBannerTimer[Start 4s Auto-Slide Interval]
    RunBannerTimer --> LoadCategories[Load 8 Main Categories]
    LoadCategories --> FetchNearby[Fetch Nearby Pharmacies]
    FetchNearby --> FetchOffers[Fetch Best Offers & Discounts]
    FetchOffers --> FetchRecentlyViewed[Retrieve recentlyViewed from AppContext]
    
    FetchRecentlyViewed --> RenderUI[Render Dashboard Interface]
    
    RenderUI --> Interaction{User Option}
    
    Interaction -- Click Location Selector --> ShowAddressPopup[Show Saved Address Sheet]
    ShowAddressPopup -- Select Address --> SetActiveAddress[Update currentAddress State] --> RenderUI
    
    Interaction -- Click Search Bar --> RedirectSearch[Redirect to Global Search suggestions]
    Interaction -- Click Notification Bell --> ToggleNotifDropdown[Toggle Notifications list]
    
    Interaction -- Click Category Icon --> FilterSearchCat[Redirect: /search?cat=category_id]
    Interaction -- Click Pharmacy Card --> RedirectPharmacyStore[Redirect: /pharmacies/pharmacy_id]
    Interaction -- Click Product Card --> RedirectPDP[Redirect: /product/product_id]
    
    RedirectSearch --> End([End Node])
    RedirectPharmacyStore --> End
    RedirectPDP --> End
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Manages banner slide transitions; displays shimmer loading states; handles local search redirects.
- **Backend:** Resolves user coordinate locations; returns sorted nearby pharmacies; filters personalized best sellers.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend (HomePage)
    participant BE as Backend API
    
    FE->>BE: GET /api/dashboard?lat=24.77&lng=46.62
    Note right of BE: Matches geolocation for Riyadh Al-Malqa
    BE-->>FE: Return { promos, nearbyPharmacies, recommendedProducts }
    FE->>FE: Render layouts & unmount shimmer loaders
```

## 7. Edge Cases & Risks
- **Edge Case:** Geolocation lookup timeout. *Mitigation:* Defaults to Riyadh (Al-Malqa) national coordinates.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Add pull-to-refresh mobile gesture support to reload deals and catalog listings.

---

# Feature 5: Category Catalog

## 1. Functional Analysis
Provides a directory of catalog indexes. A split-column viewport groups parent medical catalog categories on the left, which dynamically update subcategory cards on the right.

## 2. Technical Analysis
- **Entry Points:** Home Navbar "View All" categories CTA.
- **Exit Points:** Product Listing Page (PLP) / Search results.
- **Component File:** [CategoriesPage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/categories/page.js).
- **State Management:** `activeCat` (string, defaults to "medications").

## 3. Business Analysis
- **Purpose:** Organic catalog search catalog indexing.
- **User Goal:** Navigate catalog indexes without typing search queries.
- **Business Goal:** Clean navigation catalog directory representation.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Category Catalog Mounted]) --> ShowShimmers[Render Sidebar & Content Grid Shimmers]
    ShowShimmers -->|1.0s Simulation Timeout| RenderLayout[Render Left Sidebar & Right Subcategory Grid]
    
    RenderLayout --> UserOption{User Action}
    
    UserOption -- Click Sidebar Parent Category --> SetActiveCategory[Update activeCat State] --> RenderSubcategories[Render New Subcategory Cards]
    UserOption -- Click Subcategory Card --> RedirectPLP[Redirect: /search?cat=parent_id&sub=subcategory_en]
    UserOption -- Click Back Header --> RedirectHome[Redirect: /home]
    
    RedirectPLP --> End([End Node])
    RedirectHome --> End
```

---

# Feature 6: Global Search, PLP & Advanced Filters

## 1. Functional Analysis
Enables users to search products and pharmacies:
- Tracks recent queries.
- Incorporates trending tags.
- Provides barcode scanning triggers.
- Search results split into "Products" and "Pharmacies" tabs.
- Incorporates filters for prices, specific pharmacies, brand criteria, and Rx requirements.
- Features sorting (Low-to-high, high-to-low, best rating).

## 2. Technical Analysis
- **Entry Points:** Search input field inside home dashboard/header.
- **Exit Points:** PDP, Pharmacy storefront profile.
- **Component File:** [SearchContent](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/search/page.js).
- **State Management:** `query` (search string), `activeTab` ("products"/"pharmacies"), price inputs, tag selection arrays (`selectedBrands`, `selectedPharmacies`), `rxFilter` ("all"/"rx"/"otc").

## 3. Business Analysis
- **Purpose:** Core search validation funnel.
- **Business Goal:** Direct buyers to available inventory quickly.
- **Regulatory Rules:** Explicit Rx/Prescription badges highlight legal gating rules.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Search Screen Loaded]) --> CheckURLParameters[Parse Search URL parameters]
    CheckURLParameters --> FetchQueryHistory[Load Recent Search Terms]
    
    FetchQueryHistory --> SearchInputStatus{Search Query Input?}
    
    SearchInputStatus -- Empty Input -- ShowHistoryTrending[Render Recent Queries & Trending Tags]
    SearchInputStatus -- Typing Query -- QuerySuggestions[API: Fetch Autocomplete Suggestions] --> ShowSuggestions[Render Suggestion list]
    
    ShowHistoryTrending --> TapTerm[Tap Search Tag / Enter Term] --> ProcessSearch[Add Query to history & Execute API Search]
    ShowSuggestions --> TapSuggestion[Tap Suggestion Card] --> ProcessSearch
    
    ProcessSearch --> LoadResults[API: Fetch Matching Products & Vendors]
    LoadResults --> RenderSearchTabs[Render Products vs. Pharmacies Tabs]
    
    RenderSearchTabs --> SelectionTab{Active View Tab?}
    
    SelectionTab -- Pharmacies Tab --> FilterPharmaciesList[Filter Pharmacy matches] --> RenderPharmacies[Render Pharmacy cards]
    
    SelectionTab -- Products Tab --> ApplyActiveFilters[Apply Price, Brand, Pharmacy & Rx Filters]
    ApplyActiveFilters --> ApplySorting[Apply Sort: price, rating, reviews]
    ApplySorting --> CheckResultsEmpty{Results List Empty?}
    
    CheckResultsEmpty -- Yes --> ShowNoResults[Render 'No Results found' alternative options]
    CheckResultsEmpty -- No --> RenderProducts[Render Products grid]
    
    RenderProducts --> ProductAction{User Option}
    ProductAction -- Tap Filter Drawer button --> ShowFilterSheet[Open Bottom sheet Filter Options]
    ShowFilterSheet -- Update Filter Choices --> ApplyActiveFilters
    
    ProductAction -- Click Add to Cart --> ValidateRxGating{Is Rx Medication?}
    ValidateRxGating -- Yes --> RedirectPDP[Redirect to PDP for Prescription Upload]
    ValidateRxGating -- No --> CartAdd[Insert to AppContext Cart]
    
    CartAdd --> SuccessToast[Display Add to Cart Toast]
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Manages local sorting; updates checked checkboxes; updates URL search parameters; manages responsive filter drawers.
- **Backend:** Fuzzy search logic; processes matches by prefix matching; returns categorized index counts.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    actor Patient
    participant FE as Search Layout
    participant BE as Search API Database
    
    Patient->>FE: Type "Panadol" in input
    FE->>BE: GET /api/search/suggest?q=Panadol
    BE-->>FE: Return autocomplete recommendations
    Patient->>FE: Tap Filter: "Nahdi Pharmacy" + Sort: "Price low to high"
    FE->>BE: GET /api/search?q=Panadol&pharmacyId=ph-2&sort=priceAsc
    BE-->>FE: Return matching items catalog
    FE->>Patient: Render filtered sorted results
```

---

# Feature 7: Product Details & POM/Rx Safety Gating

## 1. Functional Analysis
Details product dosages, warnings, and ingredients in accordion lists. Displays guaranteed expiries and alternative sellers. If the item is marked as a Prescription-Only Medicine (POM/Rx):
- Standard "Add to Cart" is gated.
- A red alert warns the user.
- Floating CTA changes to "Upload Prescription".
- Launches a Chatbot Helpline to consult with a licensed pharmacist.

## 2. Technical Analysis
- **Entry Points:** Product listings.
- **Exit Points:** Shopping Cart Page / Back to list.
- **Component File:** [ProductDetailPage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/product/%5Bid%5D/page.js).
- **State Management:** `selectedVendorId` (dynamically updates pricing variables), `isPrescriptionLinked`, `showRxModal` (controls prescription upload overlay).

## 3. Business Analysis
- **Purpose:** Strict pharmaceutical compliance interface.
- **User Goal:** View detailed instructions and upload medical approvals.
- **Business Goal:** Securely sell POM items while maintaining legal compliance.
- **Regulatory Rules:** Safety certification warnings from SFDA must be displayed for Rx items.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([PDP Mounted]) --> LoadPDPData[Fetch Product Details]
    LoadPDPData --> RenderPDPLayout[Render Gallery, Description Accordions & Seller Picker]
    
    RenderPDPLayout --> CheckRxMedication{Is Prescription Item Rx?}
    
    CheckRxMedication -- Yes --> ShowRxAlert[Render Red Rx Warning Alert] --> AdjustFloatingCTA[Change CTA to Upload Prescription]
    CheckRxMedication -- No --> ShowStandardPricing[Render Standard Price Tags] --> ShowStandardCTA[Render Standard Add to Cart CTA]
    
    AdjustFloatingCTA --> PDPInteraction{User Options}
    ShowStandardCTA --> PDPInteraction
    
    PDPInteraction -- Select Alternative Seller --> UpdatePricing[Update Product Price to Selected Vendor] --> RenderPDPLayout
    PDPInteraction -- Click Ask Pharmacist --> OpenHelperDrawer[Open chat helpline drawer]
    OpenHelperDrawer --> TypeQuestions[Interact with Chatbot Doctor Hisham]
    
    PDPInteraction -- Click Add to Cart -- OTC --> ProcessAddToCart[Add item directly to AppContext Cart]
    
    PDPInteraction -- Click Add to Cart -- Rx Item --> CheckActiveRxAttached{Is Prescription File Attached?}
    
    CheckActiveRxAttached -- Yes --> ProcessAddToCart
    CheckActiveRxAttached -- No --> TriggerRxModal[Open Prescription Selection Modal]
    
    TriggerRxModal --> ChooseUploadMethod{Upload Method}
    ChooseUploadMethod -- Select File/Camera --> InputFile[Choose Image/PDF] --> ConfirmAttachment[Attach fileName to product details]
    ChooseUploadMethod -- Digital Link --> FetchSehaty[API Query MOH Sehaty database] --> SelectDigitalRx[Select active prescription card] --> ConfirmAttachment
    
    ConfirmAttachment --> AddCustomCart[Add item and attached Rx to Cart] --> ShowCartSuccess[Show Cart Success Alert]
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Locks checkout/cart buttons based on Rx status; coordinates pharmacist chatbot helper questions; manages alternative pricing calculations.
- **Backend:** Performs coordinate checks to confirm vendor stock; retrieves valid prescriptions from the MOH Sehaty database via National ID.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant PDP as Frontend (PDP Screen)
    participant MOH as Ministry of Health (Wasfaty API)
    participant BE as YUSUR Database API
    
    User->>PDP: Tap "Check Wasfaty Prescriptions"
    PDP->>BE: GET /api/prescriptions/sehaty?nationalId=10928374
    BE->>MOH: Query digital prescriptions index
    MOH-->>BE: Return active prescription codes
    BE-->>PDP: Return saved prescription cards list
    User->>PDP: Selects card & Confirms
    PDP->>PDP: Attach file code to item details
    PDP-->>User: Enable product insertion to cart
```

## 7. Edge Cases & Risks
- **Edge Case:** Pharmacy closed. *Mitigation:* Store closed simulated gating disables cart actions and shows a warning banner.
- **Risk:** Expired prescription. *Mitigation:* The backend validates prescription dates during order processing.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Add warnings for therapeutic duplications (e.g. alert if trying to add two different brands containing Paracetamol to the cart).

---

# Feature 8: Unified Multi-Vendor Shopping Cart

## 1. Functional Analysis
Aggregates cart items and groups them by pharmacy. Features include quantity adjustments, trash triggers, progression bars towards free delivery targets, split shipping cost breakout overlay, and modal sheets to upload or link digital Wasfaty prescriptions.

## 2. Technical Analysis
- **Entry Points:** Top navigation links / PDP successes.
- **Exit Points:** Secure Checkout Page.
- **Component File:** [CartPage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/cart/page.js).
- **Calculations:**
  - Standard Delivery Fee: 10 SAR per pharmacy.
  - Cold-Chain Delivery Fee: 25 SAR per pharmacy (for items like insulin).
  - Free Delivery Threshold: Subtotal >= 100 SAR (per pharmacy group).

## 3. Business Analysis
- **Purpose:** Consolidated invoice manager.
- **User Goal:** Review items, identify shipping fees, and attach doctor approvals.
- **Business Goal:** Encourage cart consolidation (subtotal >= 100 SAR) to reduce delivery logistics costs.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Cart Loaded]) --> GroupItems[Group Cart Items by Pharmacy ID]
    GroupItems --> CalculateGroupSubtotals[Calculate Subtotals for each Pharmacy Group]
    
    CalculateGroupSubtotals --> EvaluateShipping{Subtotal >= 100 SAR?}
    
    EvaluateShipping -- Yes --> SetGroupShippingFree[Delivery Fee = 0 SAR] --> RenderFreeMsg[Show 'Free Delivery unlocked' banner]
    EvaluateShipping -- No --> CheckColdChain{Any Cold-Chain items in group?}
    
    CheckColdChain -- Yes --> SetGroupShippingCold[Delivery Fee = 25 SAR]
    CheckColdChain -- No --> SetGroupShippingStandard[Delivery Fee = 10 SAR]
    
    SetGroupShippingCold --> RenderProgressMeter[Render progress percentage towards 100 SAR]
    SetGroupShippingStandard --> RenderProgressMeter
    
    RenderFreeMsg --> CalculateAggregateTotals[Sum subtotals, shipping splits, and 15% VAT]
    RenderProgressMeter --> CalculateAggregateTotals
    
    CalculateAggregateTotals --> RenderCartLayout[Render Groups, Billing breakdown & Checkout button]
    
    RenderCartLayout --> CartInteraction{User Action}
    
    CartInteraction -- Modify Quantity --> UpdateQty[Update quantity state in Context] --> GroupItems
    CartInteraction -- Tap Trash --> RemoveItem[Remove item from AppContext] --> GroupItems
    CartInteraction -- Click Delivery Split Link --> ShowSplitModal[Show Delivery split breakout per pharmacy]
    CartInteraction -- Click Upload Rx Badge --> OpenRxModal[Show Prescription Upload overlay]
    
    CartInteraction -- Click Proceed to Checkout --> CheckAddresses{Saved Address Selected?}
    
    CheckAddresses -- No --> ShowAddressPicker[Show Address Gating popup] --> SelectAddress[Set currentAddress] --> CheckAddresses
    CheckAddresses -- Yes --> CheckAuthStatus{Is User Authenticated?}
    
    CheckAuthStatus -- No --> ShowLoginModal[Open Auth Modal gating checkout] --> CompleteLogin[Authenticate] --> CheckAuthStatus
    CheckAuthStatus -- Yes --> RedirectCheckoutPage[Redirect to secure checkout screen]
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Groups items dynamically; calculates progress bar percentages; opens prescription modals; updates context states.
- **Backend:** Calculates real-time delivery fee overrides based on active courier availability.

## 6. Edge Cases & Risks
- **Edge Case:** Mixed cold chain items. *Mitigation:* If any item in a group requires refrigeration, the entire group upgrades to insulated cold-chain delivery.

---

# Feature 9: Secure Checkout & Scenario Engine

## 1. Functional Analysis
Secure checkout handles delivery confirmation, payment methods, wallet balances, loyalty points, coupons, and SFDA certifications. Incorporates an **Evaluation Toggle** to simulate review scenarios:
- **Scenario A (Partial Approval):** Whites Pharmacy rejects due to out-of-stock, while Nahdi/Al-Dawaa approve.
- **Scenario B (Full Rejection):** All pharmacies reject the order.
- **Scenario C (Full Approval):** All pharmacies approve the order.

## 2. Technical Analysis
- **Entry Points:** Cart proceed verification.
- **Exit Points:** Active orders dashboard / Home Page.
- **Component File:** [CheckoutPage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/checkout/page.js).
- **State Machine Steps:** `review` -> `processing_approval` -> `approval_status` / `rejection_status` -> `payment` -> `processing_payment` -> `confirmation` -> `tracking`.
- **Loyalty Point Conversion Rate:** 50 points = 1 SAR cashback.

## 3. Business Analysis
- **Purpose:** Transaction settlement.
- **User Goal:** Authenticate legal approvals, apply discounts, and complete payments.
- **Business Goal:** Minimize checkout friction while complying with Saudi payment regulations (Mada, Apple Pay) and pharmaceutical distribution checks.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Checkout Page Loaded]) --> ReviewDetails[Render Checkout Step: review]
    
    ReviewDetails --> SelectEvaluationScenario[Choose Simulation Scenario: A, B, or C]
    SelectEvaluationScenario --> SFDA_Check{SFDA safety accepted?}
    
    SFDA_Check -- No --> DisableProceedButton[Proceed Button Locked]
    SFDA_Check -- Yes --> EnableProceedButton[Unlock Proceed button]
    
    EnableProceedButton -- Tap Proceed --> ProcessPharmacyApproval[Transition to processing_approval]
    
    ProcessPharmacyApproval --> RunSimulatedTimer[Start Countdown Timer & Progress Bar]
    RunSimulatedTimer --> CheckScenarioChoice{Chosen Scenario?}
    
    CheckScenarioChoice -- Scenario B: Full Rejection --> RejectAll[All Pharmacies reject order] --> TransitionRejection[Transition to rejection_status]
    TransitionRejection --> AutoUpdateCart[Clear Rejected Items & Update Cart] --> RedirectHome[CTA: Return to Home/Catalog]
    
    CheckScenarioChoice -- Scenario A: Partial Success --> ApprovePart[Approve Nahdi/Dawaa, Reject Whites] --> TransitionApprovalStatus[Transition to approval_status]
    CheckScenarioChoice -- Scenario C: Full Success --> ApproveAll[Approve All Pharmacies] --> TransitionApprovalStatus
    
    TransitionApprovalStatus --> RenderApprovedRejected[Render Approved & Rejected groups]
    RenderApprovedRejected -- Tap Confirm Order --> TransitionPaymentForm[Transition to payment step]
    
    TransitionPaymentForm --> ManageDiscounts{User Action}
    
    ManageDiscounts -- Toggle Wallet Cashback --> ApplyWalletDeductions[Deduct walletBalance from Total]
    ManageDiscounts -- Toggle Loyalty Rewards --> ConvertPoints[Deduct points balance from Total]
    ManageDiscounts -- Submit Promo Code --> CheckPromoValid{Code == WELCOME20?}
    CheckPromoValid -- Yes --> ApplyPromoDiscount[Apply 20% discount on Subtotal]
    CheckPromoValid -- No --> DisplayInvalidPromo[Show Invalid Coupon Error]
    
    ManageDiscounts -- Select Payment Card --> UpdatePaymentMethod[Set Card: Visa, Mada, ApplePay, Cash]
    
    UpdatePaymentMethod --> PayAction[Tap Pay & Confirm]
    ApplyWalletDeductions --> PayAction
    ConvertPoints --> PayAction
    
    PayAction --> TransitionPaymentSession[Transition to processing_payment]
    TransitionPaymentSession -->|2s Processing Timeout| CreateOrders[API: Place Orders, Deduct Wallet, Add Points]
    CreateOrders --> TransitionConfirmation[Transition to confirmation]
    
    TransitionConfirmation --> RenderConfirmationDetails[Render Confirmation screen, split order IDs & receipt link]
    RenderConfirmationDetails -- Click Track Orders --> TransitionTracking[Transition to tracking step]
    RenderConfirmationDetails -- Click View Receipt --> OpenReceiptModal[Show Receipt Modal overlay]
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Manages step-based views; handles simulation scenarios; calculates wallet deductions; converts loyalty points; validates promo codes.
- **Backend:** Handles split payment processing; adjusts client wallets; awards loyalty points; updates inventory levels.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    actor Patient
    participant FE as Checkout Screen
    participant BE as YUSUR Orders Service
    participant Pay as Saudi Payment Gateway (Mada)
    
    Patient->>FE: Selects payment options & Tap Pay
    FE->>BE: POST /api/orders/place { cart, walletApplied, pointsRedeemed, scenario }
    Note right of BE: Matches Scenario A, B, or C simulation
    BE->>Pay: Initiate payment session (Mada)
    Pay-->>BE: Payment Successful
    BE->>BE: Create split orders per pharmacy
    BE->>BE: Deduct Wallet & award loyalty points
    BE-->>FE: Return { ordersList, paymentReceipt }
    FE->>Patient: Render success page & split order IDs
```

## 7. Edge Cases & Risks
- **Edge Case:** Wallet balance is larger than order totals. *Mitigation:* Wallet deductions are capped at the total payable value, leaving a 0 SAR net card charge.
- **Risk:** Failed card authentication. *Mitigation:* Checkout step transitions back to payment selection, preserving cart contents.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Add an explicit Tabby/Tamara split payment simulator, as installment plans are common in Saudi e-commerce.

---

# Feature 10: Orders & Live Delivery Tracking

## 1. Functional Analysis
Organizes active deliveries and completed order history. Active order tracking includes:
- Live progress timeline map pins.
- Milestone stepper tracker (Placed -> Preparing -> Out for Delivery -> Arrived).
- Courier driver details.
- Licensed pharmacist helpline consultation banners.

## 2. Technical Analysis
- **Entry Points:** Bottom navigation links / Checkout confirmation success page.
- **Exit Points:** Details PDP / Home.
- **Component File:** [OrdersPage](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/orders/page.js).
- **State Management:** `activeTab` ("active"/"history"), `trackingOrder` (order object).

## 3. Business Analysis
- **Purpose:** Post-purchase trust verification.
- **User Goal:** Monitor package arrivals and request medical guidance.
- **Business Goal:** Reduce delivery inquiries (Where is my order?) through transparent tracking.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Orders Page Mounted]) --> FetchUserOrders[API: Get User Orders List]
    FetchUserOrders --> ToggleActiveHistory{Select Active or History tab}
    
    ToggleActiveHistory -- Active Orders --> FilterActive[Get pending_rx & delivering orders] --> RenderOrdersList[Render order card panels]
    ToggleActiveHistory -- History Orders --> FilterHistory[Get completed orders] --> RenderOrdersList
    
    RenderOrdersList --> ClickAction{User Action}
    
    ClickAction -- Click Reorder --> AddAllToCart[Add history items to Cart] --> RedirectCart[Redirect: /cart]
    ClickAction -- Click Live Tracking --> SetTrackingOrder[Set active order tracking state] --> ShowTrackingModal[Open live tracking stepper dialog]
    
    ShowTrackingModal --> MapVisual[Render Map route & vehicle pin]
    MapVisual --> RenderMilestones[Render Stepper progress checklist]
    RenderMilestones --> RenderDriverDetails[Render Driver Contact info]
    
    ShowTrackingModal --> ContactAction{User Option}
    ContactAction -- Click Call Driver --> TriggerPhoneCall[Initiate phone contact call]
    ContactAction -- Click Ask Pharmacist --> RedirectPharmacistHelp[Connect with licensed pharmacist helpline]
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Updates stepper indicator progress states; triggers phone dialers; renders map pins.
- **Backend:** Dispatches real-time GPS locations; updates milestone progress states.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    participant FE as Client Tracking Screen
    participant BE as YUSUR Tracking Service
    participant Driver as Courier Application
    
    Driver->>BE: POST /api/delivery/update-gps { lat, lng }
    BE->>FE: Push GPS coordinates via WebSocket
    FE->>FE: Update courier vehicle pin on tracking map
```

---

# Feature 11: Profile, Geolocation Map Dropper & Account Management

## 1. Functional Analysis
The Profile Dashboard organizes settings, saved addresses, wishlist items, saved cards, and policy directories. The saved address picker provides:
- A draggable map interface to drop pins.
- Geolocation coordinate fetchers.
- Inputs for street details, building numbers, national address codes, and delivery notes.

## 2. Technical Analysis
- **Entry Points:** Profile navigation tab.
- **Exit Points:** Home Page.
- **Component File:** [ProfileContent](file:///c:/Users/IBRAHIM/Documents/Marketplace_v2/src/app/profile/page.js).
- **State Management:** `activePanel` (profile, addresses, wishlist, support, wallet, payment, privacy), `addresses` (array), `isAddingAddress` (boolean).

## 3. Business Analysis
- **Purpose:** User account and address book management.
- **User Goal:** Set delivery address pins accurately and manage payment methods.
- **Business Goal:** Ensure delivery address accuracy to prevent delivery failures.

## 4. Mermaid Flowchart
```mermaid
flowchart TD
    Start([Profile Page Mounted]) --> CheckResolution{Screen Resolution?}
    CheckResolution -- Mobile View < 1024px --> RenderMobileMenu[Show Menu Index list]
    CheckResolution -- Desktop View >= 1024px --> RenderSplitDashboard[Show Sidebar Menu & Active Tab Panel]
    
    RenderMobileMenu --> SelectTab{User Panel Option}
    RenderSplitDashboard --> SelectTab
    
    SelectTab -- Settings --> RenderProfileDetails[Show Profile Name/Email Edit fields]
    SelectTab -- Addresses --> RenderAddresses[Show Address Book list]
    SelectTab -- Wishlist --> RenderWishlist[Show Wishlist products grid]
    SelectTab -- Support --> RenderSupport[Show Help FAQs & Hotline numbers]
    SelectTab -- Wallet & Loyalty --> RenderWalletLoyalty[Show Wallet Ledger & points conversion forms]
    SelectTab -- Payment Methods --> RenderCards[Show Saved Credit cards list]
    SelectTab -- Privacy Rules --> RenderPrivacy[Show MOH policies info sheet]
    
    RenderAddresses -- Click Add New Address --> RenderMapSelector[Show Map Pin Dropper overlay]
    RenderMapSelector -- Click Drop Pin --> TriggerGPS[Simulate Geolocation Coord coordinates query]
    TriggerGPS --> GetAddressData[Fetch Address text & national codes] --> FillAddressForm[Autofill form fields]
    FillAddressForm -- Save Address --> AppendAddresses[Save address to AppContext] --> RenderAddresses
```

## 5. Frontend & Backend Responsibilities
- **Frontend:** Operates map rendering; performs client-side validation; updates language toggles.
- **Backend:** Converts coordinates to street addresses (reverse geocoding); saves profiles; manages payment tokens.

## 6. API Sequence Diagram
```mermaid
sequenceDiagram
    participant FE as Profile Client Screen
    participant BE as Geocoding API Service
    
    FE->>BE: GET /api/geo/reverse-geocode?lat=24.7742&lng=46.6264
    Note right of BE: Maps coordinates to Riyadh Al-Malqa
    BE-->>FE: Return { street: "Al-Malqa Road", Building: "14", City: "Riyadh" }
    FE->>FE: Autofill address inputs
```

## 7. Edge Cases & Risks
- **Edge Case:** Geolocation returns empty address data. *Mitigation:* Falls back to manual address entry fields.

## 8. Missing Scenarios & Suggestions
- **Suggestion:** Add biometric validation (FaceID/TouchID) for fast checkouts and card lookups.

---

## 3. Comprehensive Solution Architecture Review

| Architecture Review Area | Status & Observations | Risks & Debts |
| :--- | :--- | :--- |
| **Folder Structure** | Standard Next.js App Router layout (`src/app/`, `src/components/`, `src/context/`, `src/mock/`). | Pages like `checkout/page.js` and `profile/page.js` are large (70KB-80KB) and should be split into smaller sub-components. |
| **State Management** | Centralized context (`AppContext.js`) maps global variables (cart, wallet, loyalty points). | Context re-renders the entire app on any cart change. Recommend moving state to Zustand for optimized rendering. |
| **Routing** | App Router redirects `/` to `/home` properly. | Deep dynamic route structures should utilize layout sub-files for route protection. |
| **Performance** | Simulated client-side shimmers improve perceived performance. | Large code bundles can delay initial loads on slow networks. |
| **Security** | Auth bypass codes (`4921`) are explicitly exposed. | Ensure bypass codes are removed in production environments. |
| **Caching** | `sessionStorage`/`localStorage` caching for onboarding and splash pages. | Clear cache management triggers are required for user logs. |
| **Error Handling** | Splash and checkout steps check connection status and API failures. | Explicit global Next.js boundary handlers (`error.js`) need implementation. |

---

## 4. Operational Responsibilities Summary

### Frontend Responsibilities
1. **Dynamic Groupings:** Group cart and checkout items by pharmacy branch ID.
2. **Delivery Progress Meters:** Calculate progress percentages for free shipping on orders over 100 SAR.
3. **Prescription Rules:** Enforce POM/Rx warnings and lock add-to-cart actions unless a prescription file is uploaded or linked.
4. **Checkout Scenario Selection:** Handle scenario simulations (rejection, partial approval, full success) to update local states dynamically.
5. **Language Direction:** Update `document.documentElement.dir` (`rtl`/`ltr`) when switching languages.
6. **Geolocation & Map Pin Dropping:** Handle map visual displays and coordinate updates.

### Backend Responsibilities
1. **Split Fulfillment:** Receive split orders and coordinate fulfillment schedules with individual pharmacies.
2. **Prescription Integrations:** Query MOH database structures to verify patient prescriptions.
3. **Loyalty Conversions:** Enforce the 50 points = 1 SAR conversion rate and adjust wallets securely.
4. **Fuzzy Search:** Filter product catalog requests and return sorted near-me vendor indexes.
5. **Security tokens:** Issue secure JWT validation tokens and enforce API rate limits.

---

## 5. Sequence Diagram: Consolidated Checkout & Simulation Engine

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant FE as Secure Checkout Screen
    participant BE as YUSUR Core Service
    participant MOH as MOH database (Sehaty)
    participant Pharm as Pharmacy Vendor Terminal
    participant PG as Payment Gateway
    
    Patient->>FE: Review items & Select Scenario A (Partial)
    FE->>FE: Verify SFDA Accept Checkbox Checked
    FE->>BE: POST /api/orders/verify-prescription { cart }
    BE->>MOH: Cross-reference attached prescription files
    MOH-->>BE: Validate prescription authentic ✓
    BE-->>FE: Prescription OK
    Patient->>FE: Tap Continue to Pharmacy Review
    FE->>FE: Transition step: processing_approval
    FE->>BE: POST /api/checkout/simulate-review { cart, scenario: "partial_success" }
    
    rect rgb(240, 240, 240)
        Note over BE, Pharm: Simulation loops matching Scenario A
        BE->>Pharm: Request stock checks
        Pharm-->>BE: Al-Dawaa/Nahdi: STOCK APPROVED
        Pharm-->>BE: Whites Pharmacy: REJECTED (Out of stock)
    end
    
    BE-->>FE: Return review results
    FE->>FE: Transition step: approval_status
    FE->>Patient: Display Approved list & Rejected warnings
    Patient->>FE: Tap Continue to Payment
    FE->>FE: Transition step: payment
    Patient->>FE: Toggle: Use Wallet & Redeem Loyalty
    FE->>FE: Calculate net payable total
    Patient->>FE: Select: Mada Card & Tap Pay
    FE->>FE: Transition step: processing_payment
    FE->>BE: POST /api/checkout/pay { orderTotal, paymentMethod: "mada" }
    BE->>PG: Auth card credentials (Mada)
    PG-->>BE: Authorization Success ✓
    BE->>BE: Create Order YS-812 (Al-Dawaa)
    BE->>BE: Create Order YS-813 (Nahdi)
    BE->>BE: Refund Whites rejected items back to Wallet
    BE->>BE: Award loyalty points & clear Cart
    BE-->>FE: Return split Order IDs & Receipt PDF
    FE->>FE: Transition step: confirmation
    FE->>Patient: Render Confirmation screen with Receipt
```

---

## 6. Risks, Recommendations & Improvement Plans

1. **Client-Side Simulation Exposure**
   - **Risk:** Scenario simulation parameters and bypass codes are handled on the client side.
   - **Recommendation:** Move simulation logic to server-side mock microservices to prevent leaks.
2. **Context Render Bottlenecks**
   - **Risk:** Large cart arrays trigger full app re-renders on quantity updates.
   - **Recommendation:** Migrate state to Zustand or Redux Toolkit to isolate state updates.
3. **Biometric Authentication**
   - **Risk:** Manual credential entry during gated checkout checks.
   - **Recommendation:** Implement WebAuthn parameters to support FaceID/TouchID in KSA.
4. **Therapeutic Duplication Checks**
   - **Risk:** Patients can order conflicting medications simultaneously.
   - **Recommendation:** Implement automated checks during prescription review to alert users of potential conflicts.
