# 🏦 Virtual Banking Platform MVP — Features Document

> **Project Name:** PaySphere — Virtual Banking & Payments Platform  
> **Version:** 1.0 MVP  
> **Last Updated:** April 22, 2026

---

## 📋 Table of Contents

1. [Authentication & Security](#1-authentication--security)
2. [Consumer Dashboard](#2-consumer-dashboard)
3. [Merchant Dashboard](#3-merchant-dashboard)
4. [KYC Verification Workflow](#4-kyc-verification-workflow)
5. [Payment Flow (Scan & Pay)](#5-payment-flow-scan--pay)
6. [Service Payments (14 Services)](#6-service-payments-14-services)
7. [Documentation Viewer](#7-documentation-viewer)
8. [Navigation & App Shell](#8-navigation--app-shell)
9. [Backend API (Spring Boot)](#9-backend-api-spring-boot)
10. [Tech Stack](#10-tech-stack)

---

## 1. Authentication & Security

### 1.1 Login Page
- Email + Password based login form
- Dummy authentication (any credentials accepted for MVP)
- Animated entrance with `motion/react`
- Loading spinner during login processing
- Stores `currentUser` in `localStorage` for session tracking

### 1.2 Protected Routes
- Route guard (`ProtectedRoute`) checks for authenticated user
- Unauthenticated users are redirected to `/login`
- Session-based access via `localStorage`

### 1.3 OTP Verification System
- 6-digit OTP input for payment confirmations
- Show/Hide OTP toggle
- OTP verification gate before finalizing transactions
- Simulated OTP processing with loading states

### 1.4 Biometric Security (Simulated)
- Fingerprint authentication screen for payment approval
- Animated biometric scan feedback
- PaySphere Secure Shield protection messaging

---

## 2. Consumer Dashboard

### 2.1 Wallet Card
- Real-time balance display (₹ formatted with Indian locale)
- Gradient background with glassmorphism effects
- **Add Money** — Multi-step modal for wallet top-up (amount selection, bank choice, UPI PIN)
- **Transfer** — Multi-step modal for P2P/P2M transfers (recipient details, amount, review, UPI PIN)
- Balance persisted in `localStorage` and synced with backend API

### 2.2 Add Money Flow
- **Step 1: Amount** — Input field with quick-select chips (₹500, ₹1000, etc.)
- **Step 2: Bank Selection** — Radio cards for mock linked banks (SBI, HDFC, ICICI, Kotak) with masked account numbers
- **Step 3: UPI PIN** — 4-digit masked PIN input for authorization
- **Processing & Success** — Animated processing spinner followed by a success screen with transaction reference number

### 2.3 Transfer Money Flow
- **Step 1: Recipient Details** — Toggle between Phone Number and Bank Account. Phone requires 10 digits; Bank requires Name, Account Number, and IFSC
- **Step 2: Amount & Note** — Amount input with balance check and optional transfer note
- **Step 3: Review** — Summary screen showing transfer details for confirmation
- **Step 4: UPI PIN** — 4-digit masked PIN input for authorization
- **Processing & Success** — Animated processing spinner followed by a success screen with transaction reference number

### 2.4 Promotional Banner
- Cashback offer banner with animated QR code icon
- "Scan Now" call-to-action button

### 2.5 Quick Services Grid
- Embedded `ServicesSection` component with all 14 services
- Category-based filtering (All / Utilities / Financial / Lifestyle)
- Color-coded service cards with icons

### 2.6 Recent Activity / Transaction History
- Displays last 4 transactions
- Category-based icons (Shopping, Transfer, Utility, Food, Mobile, Refund, Add Money)
- Shows payee/payer, date, amount, and status
- Search/filter transactions by name
- Data sourced from Spring Boot API with fallback to mock data
- "See All" button for full transaction view

### 2.7 KYC Access
- Shield icon link to KYC verification workflow
- Accessible from the wallet card

---

## 3. Merchant Dashboard

### 3.1 Merchant Profile Header
- Store name, verification badge, and location
- QR code generation button (accent-colored)

### 3.2 Summary Cards
- **Total Sales** — ₹49.8k with +12% weekly growth indicator
- **Customers** — 342 total with +8 new today

### 3.3 Services Section
- Full `ServicesSection` integrated for merchant operations
- All 14 service payment flows available

### 3.4 Weekly Performance Chart
- Bar chart powered by `Recharts` library
- 7-day sales visualization
- Color-coded bars (high/low performance)
- Interactive tooltips showing exact values
- Time period filter (Last 7 Days / Last 30 Days)

### 3.5 Top Customers
- Horizontal scrollable customer cards
- Customer initials, name, and total sales
- Color-coded avatars

### 3.6 Settlements
- **Available for Payout** card with gradient design
- Payout amount display (₹8,420.00)
- "Settle Now to Bank" action button
- "View All" link for settlement history

### 3.7 Recent Payments
- List of recent incoming payments
- Status badges (Success / Pending)
- User name, time ago, and amount
- Interactive tap animations

---

## 4. KYC Verification Workflow

### 4.1 Step 1 — Identity Check (PAN Verification)
- PAN number input with tracking-spaced formatting
- Date of Birth input with date picker
- Progress bar (3-step indicator)
- "Verify Identity" button with loading state

### 4.2 Step 2 — Video KYC
- Simulated camera/video preview interface
- Live preview indicator with pulsing red dot
- Glassmorphism tip overlay for lighting guidance
- "Start Video Call" button for agent verification

### 4.3 Step 3 — KYC Success
- Animated success checkmark with shield badge
- Monthly limit unlocked: ₹1,00,000
- KYC Status: FULL
- Summary card with limits and status
- "Back to Dashboard" navigation

---

## 5. Payment Flow (Scan & Pay)

### 5.1 Input Stage
- Merchant info card (name, UPI ID)
- Large amount input field with ₹ prefix
- Quick-add amount buttons (+₹1, ₹2, ₹5, ₹10, ₹20, ₹50)
- Available wallet balance indicator
- "Proceed to Pay" button

### 5.2 Confirmation Stage
- Payment summary card with rounded design
- Payee name and payment method (Wallet)
- PaySphere Secure Shield protection badge
- "Pay ₹X Securely" confirmation button

### 5.3 PIN / Biometric Stage
- Security check with biometric icon
- Animated fingerprint approval button
- Pulsing border animation
- "Awaiting Biometric Approval..." status

### 5.4 Success Stage
- Full-screen green success view
- Transaction ID display (e.g., PS_948291048)
- Payment summary with payee and amount
- Glassmorphism card design
- "Back to Home" navigation
- Toast notification ("Payment Successful!")

---

## 6. Service Payments (14 Services)

### Service Flow Engine
All 14 services share a unified **ServiceFlowEngine** with:
- Multi-step form wizard (3–5 steps per service)
- Real-time form validation
- Step progress indicator
- **Rich Custom Data Views**: Beautiful data-fetching mock screens for specific bills (Electricity, Gas, Broadband, FASTag, Credit Card, Loans) before payment
- Summary review before payment
- OTP verification (6-digit)
- Transaction reference generation (unique per transaction)
- Success screen with receipt details
- Receipt download option (UI ready)
- Balance deduction from main account

---

### UTILITIES (6 Services)

#### 6.1 Mobile Recharge
- 10-digit phone number input with validation
- Operator selection: Airtel, Vi, Jio, BSNL
- Plan selection: ₹99 / ₹199 / ₹299 / ₹499
- OTP verification → Success with balance update message

#### 6.2 Electricity Bill Payment
- Consumer ID input
- Auto-fetched bill details (₹2,450)
- Amount, due date, and consumer details display
- OTP verification → Receipt sent to email

#### 6.3 DTH Recharge
- Subscriber ID input
- Provider selection: Dish TV, Tata Sky, Sun Direct
- Package selection: Basic (₹249) / Popular (₹449) / Premium (₹799)
- OTP verification → Subscription renewed

#### 6.4 FASTag Recharge
- Vehicle registration number input with format validation
- Current balance display
- Recharge amount input (₹100–₹10,000 range)
- OTP verification → Balance updated

#### 6.5 Gas Booking
- Consumer number input
- Delivery date selection
- Time slot selection: Morning / Afternoon / Evening
- OTP verification → Booking confirmed (2–4 hour delivery)

#### 6.6 Broadband Bill Payment
- Account number input
- Auto-fetched bill details
- Multiple broadband provider support
- OTP verification → Receipt generated

---

### FINANCIAL (6 Services)

#### 6.7 Credit Card Payment
- Card last 4 digits input
- Outstanding balance display (₹8,450)
- Payment options: Minimum (₹2,500) / Full (₹8,450) / Custom
- OTP verification → Payment recorded

#### 6.8 Loan EMI Payment
- Loan Account ID input
- EMI details: amount (₹12,500), due date, interest breakdown
- OTP verification → EMI receipt with download option

#### 6.9 Insurance Premium
- Policy number input
- Premium auto-calculated (₹5,000)
- Renewal date auto-set
- OTP verification → Policy renewed, coverage active

#### 6.10 Mutual Fund Investment
- Fund selection: Liquid (5.2%) / ELSS (12.5%) / Balanced (10.8%)
- Investment amount input (Min: ₹500)
- Investment confirmation
- OTP verification → Units added to portfolio

#### 6.11 Demand Draft (DD)
- Beneficiary name input
- Bank branch & payable city
- DD amount input
- Payment mode: Account / Cash
- OTP verification → DD issued
- Auto-generated draft number, 6-month validity
- Branch pickup within 24 hours

#### 6.12 NEFT Transfer
- Beneficiary name, account number, IFSC code, bank name
- Transfer amount input
- Payment method: Account / UPI / NetBanking
- Review summary step
- OTP verification → Transfer initiated (~2 hours)
- Beneficiary saved for future use

---

### LIFESTYLE (2 Services)

#### 6.13 Bookings (Travel & Events)
- Booking type: Flights / Hotels / Events
- Dates & details input
- Total amount review
- OTP verification → Ticket generated (email delivery)
- Cancellation support

#### 6.14 Food & Delivery
- Menu browsing & item addition
- Cart review
- Delivery address input
- OTP verification → Order tracking activated
- Live order tracking, restaurant ratings, loyalty rewards

---

## 7. Documentation Viewer

### 7-Tab Documentation System
The DocsViewer provides a tabbed in-app documentation hub:

| Tab | Content |
|-----|---------|
| **Executive** | Mission statement, target region (Thane, MH), initial target (50k MAU), key objectives |
| **Product Spec** | Core flows — merchant onboarding, consumer wallet, settlement management |
| **Architecture** | Cloud-native layered design — API gateway, payment orchestration, monitoring |
| **Sprint Plan** | Delivery milestones — QR rollout, KYC workflows, settlement reconciliation |
| **Security** | RBI/NPCI compliance — encrypted storage, role-based controls, AML screening |
| **Operations** | T+1 reconciliation, support playbook (failed debits, KYC delays) |
| **KPIs** | Activation ≥20%, Fraud <0.1%, GMV ₹5Cr+, Retention >70%, Latency <1.2s, NPS >45 |

---

## 8. Navigation & App Shell

### 8.1 Top Navigation Bar
- PaySphere logo and branding
- Global transaction search bar
- Location tag display
- Hamburger menu button

### 8.2 Bottom Navigation Bar (5 Tabs)
| Icon | Label | Route | Description |
|------|-------|-------|-------------|
| 🏠 Home | Home | `/` | Consumer Dashboard |
| ⚡ Zap | Services | `/services` | Service Payments |
| 📱 QR | Scan | `/pay` | Payment Flow (center elevated button) |
| 📊 Dashboard | Merchant | `/merchant` | Merchant Dashboard |
| 📄 Docs | Docs | `/docs` | Documentation Viewer |

### 8.3 Page Transitions
- Animated route transitions using `motion/react`
- Fade + slide animations between pages
- `AnimatePresence` for smooth exit/enter

---

## 9. Backend API (Spring Boot)

### 9.1 Technology
- **Framework:** Spring Boot (Java)
- **Database:** MySQL
- **ORM:** JPA / Hibernate with Lombok
- **Port:** 8081

### 9.2 Data Models

#### User Entity
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Primary key |
| `balance` | Double | Account balance |

#### Transaction Entity
| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Primary key |
| `userId` | Long | Foreign key to User |
| `type` | String | Transaction type (paid/received/bill) |
| `to` | String | Payee/Payer name |
| `amount` | String | Transaction amount |
| `date` | String | Date string |
| `category` | String | Category (Shopping, Transfer, etc.) |

### 9.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/{userId}/balance` | Get user balance (returns dummy ₹12,450.45 if user not found) |
| `GET` | `/api/users/{userId}/transactions` | Get user's transaction list |

### 9.4 CORS Configuration
- Cross-origin requests enabled via `WebConfig.java`
- Frontend (localhost:5173/5174) → Backend (localhost:8081)

### 9.5 Graceful Fallback
- Frontend falls back to mock data if the backend is unreachable
- Balance stored in `localStorage` as backup

---

## 10. Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| React Router | 7.13 | Client-side Routing |
| Vite | 6.3 | Build Tool & Dev Server |
| Tailwind CSS | 4.1 | Utility-first Styling |
| Motion/React | 12.23 | Animations & Transitions |
| Lucide React | 0.487 | Icon Library |
| Recharts | 2.15 | Data Visualization / Charts |
| Radix UI | Various | Headless UI Components |
| Sonner | 2.0 | Toast Notifications |
| clsx + tailwind-merge | Latest | Conditional Class Utilities |

### Backend
| Technology | Purpose |
|------------|---------|
| Spring Boot | REST API Framework |
| MySQL | Relational Database |
| JPA / Hibernate | ORM Layer |
| Lombok | Boilerplate Reduction |

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Services | 14 |
| Service Categories | 4 (All, Utilities, Financial, Lifestyle) |
| Frontend Components | 11+ |
| Form Steps | 50+ |
| Form Fields | 40+ |
| Validation Rules | 15+ |
| API Endpoints | 2 |
| Backend Entities | 2 (User, Transaction) |
| Animation Types | 8+ |
| Unique Color Schemes | 14 |
| App Routes | 7 (login, home, merchant, docs, kyc, pay, services) |
| Lines of Code | 2,000+ (Frontend) |

---

## 🆕 Smart Wallet Features (New)

### 11.1 Real-Time Balance Sync
- Balance auto-refreshes when user navigates back to dashboard
- `visibilitychange` event listener for tab switching
- `balanceUpdated` custom events for cross-component sync
- `storage` event listener for cross-tab synchronization
- All payment flows (ServiceFlowEngine, PaymentFlow, ServicePayments) deduct from centralized balance

### 11.2 Persistent Transaction History
- All completed payments automatically saved to `localStorage`
- Each entry records: service name, amount, reference number, timestamp, category, status
- History capped at 100 entries (newest first)
- Fallback to mock data if no real transactions exist
- Searchable transaction list in "Recent Activity"

### 11.3 Spending Analytics Mini-Card
- **Spent This Month** — total amount spent in current month
- **Transactions** — count of successful transactions
- **Top Category** — highest spend category (e.g., Mobile, Utility)
- Only displayed after first real transaction
- Auto-updates with each new payment

### 11.4 In-App Notification System
- **Notification Bell** in header with unread count badge (red dot)
- **Slide-out Panel** with all notifications listed chronologically
- Payment notifications auto-generated on every successful payment
- Quest completion notifications
- Pocket Shield top-up notifications
- "Mark All as Read" functionality
- Capped at 50 notifications
- Real-time updates via custom events

### 11.5 Pocket Shield (UPI Lite Micro-Wallet)
- Secondary ₹500 max balance for small payments
- **PIN-free** transactions under ₹200
- Toggle on/off from dashboard
- **Top Up** from main wallet balance
- Auto-refill option when balance is low
- Daily spend tracking with automatic reset at midnight
- Separate balance display on dashboard card

### 11.6 Auto-Bill Scout
- Predictive bill alerts based on transaction history
- Analyzes past payments to estimate next due dates (30-day cycle)
- Shows bills due within 10 days
- Displays: service name, predicted amount, due date, days until due
- One-tap "Pay Now" link to services
- Overdue bill highlighting

### 11.7 Savings Quests (Gamification)
- **4 Weekly Quests** with cashback rewards:

| Quest | Description | Target | Reward |
|-------|-------------|--------|--------|
| 📱 Recharge Rally | Complete 3 mobile recharges | 3 | ₹25 |
| ⚡ Bill Master | Pay 5 utility bills | 5 | ₹50 |
| 🏆 Power User | Make 10 transactions of any type | 10 | ₹100 |
| 📷 Scan Star | Complete 5 scan-and-pay transactions | 5 | ₹40 |

- **Progress bars** with animated fill
- **Claim button** appears when quest is complete (pulsing animation)
- Claimed rewards added directly to wallet balance
- Auto-reset when all quests expire (7-day cycle)
- Quest progress tracked across all payment flows

### 11.8 Centralized Wallet Utilities (`walletUtils.ts`)
- Shared module for all localStorage operations
- Custom event dispatching for reactive updates
- Balance management: `getBalance()`, `setBalance()`, `deductBalance()`
- Transaction CRUD: `addTransaction()`, `getTransactionHistory()`
- Notification system: `addNotification()`, `getUnreadCount()`, `markAllNotificationsRead()`
- Pocket Shield management: `getPocket()`, `topUpPocket()`, `payFromPocket()`
- Quest system: `getQuests()`, `progressQuest()`, `claimQuestReward()`
- Analytics: `getSpendingAnalytics()`, `getBillPredictions()`

---

## 📊 Updated Project Statistics

| Metric | Value |
|--------|-------|
| Total Services | 14 |
| Service Categories | 4 (All, Utilities, Financial, Lifestyle) |
| Frontend Components | 14+ |
| New Feature Modules | 7 (Balance Sync, History, Analytics, Notifications, Pocket Shield, Bill Scout, Quests) |
| Form Steps | 50+ |
| Form Fields | 40+ |
| Validation Rules | 15+ |
| API Endpoints | 2 |
| Backend Entities | 2 (User, Transaction) |
| Animation Types | 12+ |
| Unique Color Schemes | 14 |
| App Routes | 7 (login, home, merchant, docs, kyc, pay, services) |
| Lines of Code | 3,500+ (Frontend) |
| Savings Quests | 4 weekly challenges |
| Max Notifications | 50 stored |
| Transaction History | 100 entries max |

---

## 🔮 Future Enhancements (Planned)

- [ ] Real payment gateway integration (Razorpay / Stripe)
- [ ] Actual OTP via SMS (Twilio / MSG91)
- [ ] Email receipts and notifications
- [ ] Scheduled / recurring transactions
- [ ] Saved beneficiaries and favorites
- [ ] Two-factor authentication (2FA)
- [ ] Biometric login (real fingerprint/face)
- [ ] Push notifications (FCM)
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Dark mode theme
- [x] AI Fraud Prevention & Spending Buddy chatbot
- [ ] Family Share Vault (group expenses)
- [ ] Real UPI Lite NPCI integration

---

> **Status:** ✅ MVP Complete & Functional  
> **Build:** ✅ Successful  
> **Dev Server:** `http://localhost:5173/`  
> **Backend Server:** `http://localhost:8081/`  
> **Last Updated:** April 22, 2026

