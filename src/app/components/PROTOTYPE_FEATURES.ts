/**
 * Payment App Prototype - Complete Service Flows
 * 
 * This file contains all 14 service flows with detailed step-by-step implementations.
 * Each service has its own workflow that guides users through the payment process.
 */

import { SERVICE_FLOWS } from './ServiceFlowEngine';

export const PROTOTYPE_FEATURES = {
  services: {
    count: 14,
    categories: ['Utilities', 'Financial', 'Lifestyle'],
    flows: ['Multi-step forms', 'OTP verification', 'Transaction history', 'Receipt generation'],
  },
  
  /**
   * 1. MOBILE RECHARGE & BILLS
   * Steps:
   * - Enter mobile number (10 digits)
   * - Select operator (Airtel, Vi, Jio, BSNL)
   * - Choose recharge plan (₹99 to ₹499)
   * - Verify OTP → Payment success
   * 
   * Success Message: "Mobile recharge successful! Your balance will be updated shortly."
   */
  mobile: {
    name: 'Mobile Recharge',
    steps: 4,
    fields: ['Mobile Number', 'Operator Selection', 'Plan Selection', 'OTP Verification'],
    successMessage: 'Mobile recharge successful! Your balance will be updated shortly.'
  },

  /**
   * 2. ELECTRICITY BILL PAYMENT
   * Steps:
   * - Enter consumer ID
   * - System fetches bill details (amount: ₹2,450, due date: 30 Apr)
   * - Confirm bill amount
   * - Verify OTP → Payment success → Receipt generated
   * 
   * Success Message: "Electricity bill paid successfully! Receipt has been sent to your registered email."
   */
  electricity: {
    name: 'Electricity Bill',
    steps: 4,
    fields: ['Consumer ID', 'Bill Details (Auto-fetched)', 'Confirmation', 'OTP Verification'],
    successMessage: 'Electricity bill paid successfully! Receipt has been sent to your registered email.'
  },

  /**
   * 3. CREDIT CARD MANAGEMENT
   * Steps:
   * - Enter card last 4 digits
   * - Display outstanding balance (₹8,450)
   * - Choose payment type (Minimum: ₹2,500 or Full: ₹8,450)
   * - Verify OTP → Payment success → Transaction history updated
   * 
   * Success Message: "Credit card payment processed successfully!"
   */
  creditcard: {
    name: 'Credit Card Payment',
    steps: 4,
    fields: ['Card Number (Last 4)', 'Card Details', 'Payment Amount Selection', 'OTP Verification'],
    successMessage: 'Credit card payment processed successfully!'
  },

  /**
   * 4. DTH & CABLE
   * Steps:
   * - Enter subscriber ID
   * - Select DTH provider (Dish TV, Tata Sky, Sun Direct)
   * - Choose package (Basic/Popular/Premium)
   * - Verify OTP → Subscription renewed
   * 
   * Success Message: "DTH subscription renewed successfully for 1 month!"
   */
  dth: {
    name: 'DTH Recharge',
    steps: 4,
    fields: ['Subscriber ID', 'Provider Selection', 'Package Selection', 'OTP Verification'],
    successMessage: 'DTH subscription renewed successfully for 1 month!'
  },

  /**
   * 5. FASTAG RECHARGE
   * Steps:
   * - Enter vehicle registration number
   * - Display current FASTag balance
   * - Enter recharge amount (₹100-₹10,000)
   * - Verify OTP → Balance updated
   * 
   * Success Message: "FASTag recharge completed! Balance updated successfully."
   */
  fastag: {
    name: 'FASTag Recharge',
    steps: 4,
    fields: ['Vehicle Number', 'Current Balance Display', 'Recharge Amount', 'OTP Verification'],
    successMessage: 'FASTag recharge completed! Balance updated successfully.'
  },

  /**
   * 6. GAS BOOKING
   * Steps:
   * - Enter LPG consumer number
   * - Select delivery date
   * - Choose delivery slot (Morning/Afternoon/Evening)
   * - Verify OTP → Booking confirmed
   * 
   * Success Message: "Gas cylinder booked successfully! Expected delivery: 2-4 hours."
   */
  gas: {
    name: 'Gas Booking',
    steps: 4,
    fields: ['Consumer Number', 'Delivery Date', 'Delivery Slot', 'OTP Verification'],
    successMessage: 'Gas cylinder booked successfully! Expected delivery: 2-4 hours.'
  },

  /**
   * 7. BROADBAND BILL PAYMENT
   * Steps:
   * - Enter account/customer ID
   * - System fetches bill details
   * - Confirm bill amount
   * - Verify OTP → Receipt generated
   * 
   * Success Message: "Broadband bill paid successfully!"
   */
  broadband: {
    name: 'Broadband Bill',
    steps: 4,
    fields: ['Account Number', 'Bill Details (Auto-fetched)', 'Confirmation', 'OTP Verification'],
    successMessage: 'Broadband bill paid successfully!'
  },

  /**
   * 8. LOANS - EMI PAYMENT
   * Steps:
   * - Enter loan account ID
   * - Display EMI details (Amount due: ₹12,500, Due date: 15 Apr)
   * - Confirm EMI payment
   * - Verify OTP → Receipt generated
   * 
   * Success Message: "Loan EMI paid successfully!"
   */
  loans: {
    name: 'Loan Payment',
    steps: 4,
    fields: ['Loan Account ID', 'EMI Details', 'Confirmation', 'OTP Verification'],
    successMessage: 'Loan EMI paid successfully!'
  },

  /**
   * 9. INSURANCE PREMIUM
   * Steps:
   * - Enter policy number
   * - Display premium due (Amount: ₹5,000, Due date: 20 Apr)
   * - Confirm premium payment
   * - Verify OTP → Policy renewed
   * 
   * Success Message: "Insurance premium paid successfully! Policy renewed."
   */
  insurance: {
    name: 'Insurance Premium',
    steps: 4,
    fields: ['Policy Number', 'Premium Details', 'Confirmation', 'OTP Verification'],
    successMessage: 'Insurance premium paid successfully! Policy renewed.'
  },

  /**
   * 10. MUTUAL FUND INVESTMENT
   * Steps:
   * - Select mutual fund (Liquid/ELSS/Balanced)
   * - Enter investment amount (₹500 minimum)
   * - Confirm investment
   * - Verify OTP → Units added to portfolio
   * 
   * Success Message: "Investment successful! Units added to your portfolio."
   */
  investments: {
    name: 'Mutual Fund Investment',
    steps: 4,
    fields: ['Fund Selection', 'Investment Amount', 'Confirmation', 'OTP Verification'],
    successMessage: 'Investment successful! Units added to your portfolio.'
  },

  /**
   * 11. BOOKINGS (Travel & Events)
   * Steps:
   * - Select booking type (Flights/Hotels/Events)
   * - Enter travel dates and seats
   * - Review total amount
   * - Verify OTP → Ticket generated
   * 
   * Success Message: "Booking confirmed! Ticket details will be sent to your email."
   */
  bookings: {
    name: 'Bookings',
    steps: 4,
    fields: ['Booking Type', 'Travel Details', 'Confirmation', 'OTP Verification'],
    successMessage: 'Booking confirmed! Ticket details will be sent to your email.'
  },

  /**
   * 12. FOOD & DELIVERY
   * Steps:
   * - Browse menu and add items
   * - Review cart and delivery address
   * - Enter payment details
   * - Verify OTP → Order tracking activated
   * 
   * Success Message: "Order placed successfully! Track your order in real-time."
   */
  fooddelivery: {
    name: 'Food & Delivery',
    steps: 4,
    fields: ['Menu Selection', 'Delivery Address', 'Order Review', 'OTP Verification'],
    successMessage: 'Order placed successfully! Track your order in real-time.'
  },

  /**
   * 13. DEMAND DRAFT (NEW SERVICE)
   * Steps:
   * 1. Enter beneficiary details:
   *    - Beneficiary name
   *    - Bank branch
   *    - Payable city
   *    - DD amount
   * 
   * 2. Choose payment mode:
   *    - Debit from account
   *    - Cash deposit (dummy for prototype)
   * 
   * 3. Review and confirm
   * 
   * 4. Verify OTP → DD generated
   * 
   * Success Message: "Demand Draft issued successfully! You can collect it from your branch in 24 hours."
   * 
   * Transaction Details Generated:
   * - Draft number (auto-generated)
   * - Beneficiary details
   * - Amount
   * - Issuing branch
   * - Issue date
   */
  demandraft: {
    name: 'Demand Draft',
    steps: 4,
    fields: [
      'Beneficiary Details (Name, Bank Branch, Payable City, Amount)',
      'Payment Mode Selection',
      'Confirmation',
      'OTP Verification'
    ],
    successMessage: 'Demand Draft issued successfully! You can collect it from your branch in 24 hours.',
    output: {
      draftNumber: 'Auto-generated',
      beneficiaryDetails: 'Captured',
      amount: 'Specified',
      issuingBranch: 'From account holder\'s branch',
      validityPeriod: '6 months'
    }
  },

  /**
   * 14. NEFT TRANSFER (NEW SERVICE)
   * Steps:
   * 1. Enter beneficiary details:
   *    - Name
   *    - Account number
   *    - IFSC code
   *    - Bank name
   * 
   * 2. Enter transfer amount
   * 
   * 3. Choose payment method:
   *    - Debit from account
   *    - UPI (dummy for prototype)
   *    - Net Banking (dummy for prototype)
   * 
   * 4. Review transfer summary:
   *    - Beneficiary details
   *    - Amount
   *    - Charges (if any)
   * 
   * 5. Verify OTP → NEFT initiated
   * 
   * Success Message: "NEFT transfer initiated successfully! Amount will reach within 2 hours."
   * 
   * Transaction Details Generated:
   * - Transaction reference number
   * - Beneficiary account details
   * - Amount transferred
   * - Charges applied
   * - Estimated delivery time
   * - Transaction history entry updated
   */
  neft: {
    name: 'NEFT Transfer',
    steps: 5,
    fields: [
      'Beneficiary Information (Name, Account, IFSC, Bank)',
      'Transfer Amount',
      'Payment Method Selection',
      'Review Summary',
      'OTP Verification'
    ],
    successMessage: 'NEFT transfer initiated successfully! Amount will reach within 2 hours.',
    output: {
      referenceNumber: 'TXN + Timestamp + Random',
      beneficiaryAccount: 'Captured',
      transfer Amount: 'Specified',
      charges: 'Calculated',
      estimatedDelivery: '2 hours',
      transactionStatus: 'Initiated'
    }
  },

  /**
   * COMMON FEATURES ACROSS ALL SERVICES:
   * - Real-time form validation
   * - Step-by-step guidance
   * - OTP verification (6-digit code)
   * - Transaction summary before OTP
   * - Success screen with transaction reference
   * - Receipt download option
   * - Transaction history integration
   * - Error handling and retry logic
   * - Loading states during processing
   * - Visual feedback (success/error/pending)
   */
  commonFeatures: [
    'Multi-step form workflows',
    'Real-time input validation',
    'OTP verification (6-digit)',
    'Transaction summary review',
    'Success screen with reference number',
    'Receipt generation',
    'Transaction history tracking',
    'Smooth animations and transitions',
    'Mobile-responsive design',
    'Error handling and retries',
    'Loading states during processing',
    'Date/time inputs where applicable',
    'Dropdown selections for providers/types',
    'Amount range validation',
    'Field-specific error messages'
  ],

  /**
   * PROTOTYPE WORKFLOW SUMMARY:
   * 
   * User Flow:
   * 1. Open app → Select Service Category
   * 2. Browse Services Grid (All/Utilities/Financial/Lifestyle)
   * 3. Click Service → View Details in Modal
   * 4. Click "Get Started" → Launch Service Flow Engine
   * 5. Fill Step 1 → Validate → Click Next
   * 6. Fill Step 2 → Validate → Click Next
   * 7. Fill Step N → Review Summary → Click "Proceed to Payment"
   * 8. Enter OTP → Click "Verify & Pay"
   * 9. Success Screen → View Transaction Reference
   * 10. Download Receipt or Make Another Payment
   * 
   * Data Flow:
   * - Form Data → Validation → Summary → OTP Entry → Payment Processing
   * - Payment Confirmed → Transaction Reference Generated
   * - Transaction Saved to History
   * - Receipt Generated with All Details
   */
  workflowSummary: {
    totalServices: 14,
    servicesBy Category: {
      utilities: 6,  // Mobile, Electricity, DTH, Fastag, Gas, Broadband
      financial: 6,  // Credit Card, Loans, Insurance, Investments, DD, NEFT
      lifestyle: 2,  // Bookings, Food & Delivery
    },
    averageSteps: 4,
    verification: 'OTP-based (6-digit)',
    transactionTracking: 'Enabled for all services',
    receiptGeneration: 'Available for all services',
    responsiveDesign: 'Mobile-first approach',
    animationFramework: 'Motion/React',
    uiFramework: 'Tailwind CSS + Shadcn/ui',
  }
};

export { SERVICE_FLOWS };
