# Product Documentation

> **Home / Documentation**  
> A reference for every feature on the platform. Use **Download as PDF** in the web interface to save a copy you can share offline.  
> *Tip: Download as PDF prints in your browser — choose "Save as PDF" in the destination dropdown.*

---

## Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard](#2-dashboard)
3. [CRM](#3-crm)
4. [Team](#4-team)
5. [HR](#5-hr)
6. [Finance](#6-finance)
7. [Setup (Admin)](#7-setup-admin)
8. [Marketing](#8-marketing)
9. [Utilities](#9-utilities)
10. [Settings](#10-settings)

---

## 1. Getting Started

### Roles You Can Assign
The platform supports granular role-based access control with pre-configured archetypes:
* **Owner**
* **Manager**
* **Sales Agent**
* **Sales Manager**
* **Ops Manager**
* **Credit Manager**
* **Accountant**
* **Accounts Manager**
* **HR Manager**
* **Telesales**
* **Dealer**
* **Sub-DSA**
* **Connector**

Each role ships with a default permission set that you can tighten or extend in **Settings → Roles & Permissions**.

### First-Time Setup Order
To configure your organization from scratch, follow this recommended sequence:
1. **Company Profile**: Go to `Settings → Company` and enter your legal entity name, GSTIN, billing address, and authorized signatory.
2. **Branding**: Set your company logo, primary brand colours, Android APK URL, and white-label settings in `Settings → Branding`.
3. **Outbound Email**: Configure your custom SMTP host and credentials in `Settings → IVR / Email SMTP` so approval notifications and password resets send from your domain.
4. **Products & Banks**: Navigate to `Setup → Products` and `Setup → Banks` to configure loan categories (HL, LAP, BL, PL) and sync lender partners.
5. **Schemes**: Import schemes from the live Master Scheme Feed or build custom slab/percentage policies.
6. **Territories**: Define hierarchical geographic zones (`State → City → Branch`) in `Team → Territories`.
7. **Invite Employees & Partners**: Onboard your in-house team under `Team → Employees` and external distributors under `Team → Partners`.

---

## 2. Dashboard

### Insights Bell
The notification bell at the top right aggregates everything requiring urgent operational attention:
* Overdue lead follow-ups
* Pending approvals (leave applications & conveyance/expense claims)
* Today's scheduled tasks and drip reminders
* Stale leads requiring re-engagement
* Unassigned inbound leads
* Conversion-rate dips and SLA warnings

*Click any item in the insights feed to jump directly to the relevant record or workspace.*

### Quick Stats
Real-time KPI metric cards prominently displayed across your command center:
* **Pipeline by Stage**: Active leads and applications segmented across the origination funnel.
* **Today's Expected Disbursements**: Value and count of loans scheduled for release today.
* **Commissions Earned This Month**: Bank-side pay-in commissions tracked and accrued month-to-date.

---

## 3. CRM

Run your loan pipeline end-to-end: capture a lead, qualify it, file a loan application, track it to disbursement, and reconcile commission.

### Leads
* **Omnichannel Capture**: Add leads manually, bulk-import via CSV/Excel spreadsheets, or capture automatically via WhatsApp, Meta Lead Ads, and website embed forms.
* **11 Lead Profiles Tabs**: Comprehensive 360° lead dossier covering:
  1. *Info* (contact & channel origin)
  2. *Personal* (identity, PAN, DOB)
  3. *Address* (current & permanent residence)
  4. *Job* (employment & employer details)
  5. *Income* (salaried or self-employed banking figures)
  6. *Current Debt* (existing EMIs and obligations)
  7. *GST 3B* (business turnover data)
  8. *Co-applicants* (co-borrower and guarantor profiles)
  9. *Documents* (uploaded attachments and OCR verifications)
  10. *Activity Timeline* (full audit history and call logs)
  11. *Matching Schemes* (live lender product policy fit)
* **Configurable Funnel Stages**:  
  `New` → `Contacted` → `Followup` → `Documents` → `Application` → `Approved` → `Disbursed` (customizable per tenant).

### Loan Applications
Convert qualified leads into formal loan files with multi-bank routing:
* Track logged → sanctioned → disbursed files across multiple banks per applicant.
* Detailed bank-side sub-statuses for end-to-end ops visibility:
  * `Credit`
  * `Docs Closed`
  * `Login`
  * `Legal & Technical`
  * `Sanction`
  * `Booked`
  * `BT (Balance Transfer)`
  * `MODT`
  * `Disbursement`
  * `PDD (Post-Disbursement Documents)`

### Sanctioned Loans
Post-sanction management hub:
* Tracks disbursement entries, processing fees, PF GST, sanctioned loan amounts, disbursed amounts, MOA, and ROI.
* Any edits to disbursed or sanctioned amounts automatically trigger downstream commission recalculation.

### Cross Selling
* Automated intelligence engine identifying existing borrowers primed for secondary financial products (e.g., active Home Loan customers eligible for Personal Loan or Business Loan top-ups).
* Filter and target candidates by tenure, active ROI, and vintage.

### Direct Booking
* Fast-track manual entry for files that bypassed early CRM stages (e.g., when a banker submits a completed file directly to your desk).
* Enables commission tracking and payout splits without requiring multi-stage lead workflow.

### Tasks
* Lightweight to-dos attached directly to leads and loan applications.
* Auto-generated from follow-up dates, drip workflows, or manual assignment.
* Appears on the assignee's daily dashboard and alerts as overdue insights in the bell.

### Documents
* Dynamic document checklist generated per product scheme.
* Multiple upload channels: direct camera capture, file picker, or **"Send Docs Request"** (generates a secure, mobile-friendly magic-link page where customers upload files without logging in).

---

## 4. Team

### Users
* Manage users in `Settings → Users`.
* Invite teammates via email, assign granular roles, and dispatch one-time temporary passwords via Email or WhatsApp.
* Roles determine permissions; HR Manager archetypes can also provision user accounts.

### Partners
* External distributor network: Sub-DSAs, automobile/property dealers, and freelance connectors.
* Configurable commission rates and split rules per partner.
* Supports multi-tier parent-child partner hierarchies.
* Optional partner portal login linked to an authenticated user account.

### Employees
* In-house sales and operations workforce.
* Modeled under the hood with partner capabilities to ensure unified commission structures, hierarchies, and performance reporting.
* Link, unlink, or update user login accounts directly from the slide-out drawer.

### Team Tree
* Interactive visual organizational chart of employees and external partners.
* Drag-and-drop hierarchy reorganization.
* Backs the materialized hierarchy engine used for "see only my team" data scoping across all modules.

### Territories
* Three-tier geographic master: `State` → `City` → `Branch`.
* Map leads, partners, and employees to territories for geo-targeted reporting and automated routing rules.

---

## 5. HR

Run your in-house team's attendance, leave, salary, and reimbursements directly within the platform.

### Attendance
* Selfie verification and GPS geolocation check-in via mobile or web portal.
* Supervisor attendance adjustment and regularization tools.
* Automated calculation of half-days, late marks, and compensatory off (comp-off) based on tenant shift policies.

### Leave Management
* Configurable leave categories (Casual Leave, Sick Leave, Earned Leave) with annual quota allocations.
* Half-day leave support and multi-level approval workflows (reporting manager or role-based chains).
* Approvers receive real-time email alerts and in-app bell notifications.

### Salary Slips
* Automated monthly payroll calculation combining attendance, performance incentives, and approved reimbursements.
* Tenant-customizable salary slip templates.
* One-click downloadable PDF payslips for employees.

### Conveyance & Expenses
* Field travel tracking by distance with customizable per-kilometer rates.
* Ad-hoc expense claim submission with receipt image uploads.
* Manager review and approval integrated into the unified Approvals workspace and rolled into payroll.

### Holidays
* Tenant-specific holiday calendar.
* Automatically accounts for non-working days in leave day counts and attendance tracking.

---

## 6. Finance

### Payin (Bank Commissions)
* Automatic bank-side receivables calculation based on disbursed loan entries and scheme formulas.
* Status lifecycle: `Pending` → `Approved` → `Invoiced` → `Received`.
* Per-row rate override option when lender payout deviates from standard scheme terms.

### Payouts (Partner Commissions)
* Calculates net amounts owed to Sub-DSAs and connectors after hierarchy splits.
* Partner batching with automated bank payment utility file generation (ICICI, HDFC, RBL formats).
* One-click reconciliation against bank account statements.

### Platform Wallet
* Prepaid on-platform balance for running third-party verification APIs (Experian, Digitap, PAN, GST, Aadhaar), AI copilot calls, and optional add-ons.
* Instant top-up via Razorpay payment gateway; transparent deduction logs.

### Accounting Ledger
* Multi-tenant double-entry ledger.
* Auto-books entries for commission income, partner payout liabilities, and wallet transactions.
* Manual journal entries for adjustments and one-click export to Tally / CSV.

---

## 7. Setup (Admin)

### Scheme Feed
* Live syndicated feed of master loan schemes published by leading banks and NBFCs.
* Add pre-verified lender policies directly into your tenant account with a single click.

### Schemes
* Tenant commission scheme builder supporting:
  * Percentage of disbursement
  * Flat fee per file
  * Slab-based volume tiers
* Built-in **Product Policy Engine** (allowed programs, approved property types, FOIR & CIBIL thresholds, surrogate criteria, USPs) powering instant lead-to-scheme matching.

### Products
* Comprehensive loan taxonomy:
  * Home Loan (HL)
  * Loan Against Property (LAP)
  * Business Loan (BL)
  * Personal Loan (PL)
  * Gold Loan, Auto Loan, and custom sub-types
* Drives the product selector and required document checklist on all lead forms.

### Banks
* Master catalog of partner Banks and NBFCs.
* Sync from the national lender master in one click.
* Includes official branding assets so lender logos render across origination cards and sanction letters.

---

## 8. Marketing

### Campaigns
* Target saved lead cohorts with bulk WhatsApp drip campaigns, SMS notifications, and email blasts.
* Schedule dispatch times, track open/delivery/reply rates, and route prospect responses directly into active CRM conversations.

### Workflow Builder
* Visual event-driven automation engine:
  * Triggers: Status change, elapsed time, missed follow-up date, document upload.
  * Actions: Send WhatsApp/Email, create task, assign telecaller, fire webhook.

### IVR (Interactive Voice Response)
* Inbound call routing rules, automatic call recording, and intelligent agent dispatch.
* Automatically records incoming and outgoing calls to the lead's activity timeline.

### White-Label Website
* Ready-to-deploy branded borrower landing pages with embedded lead capture forms hosted on your custom subdomain.

### Festival Banners & Creatives
* Library of seasonal greetings, festive creatives, and promotional banners.
* Auto-branded with your company logo, primary brand color, and phone number.
* Download as high-res PNG or share directly to WhatsApp with one click.

---

## 9. Utilities

### Approvals
* Unified cross-module inbox for reviewing leave requests, travel conveyance claims, and ad-hoc expense submissions.
* Inline Approve / Reject with reason notes.
* Accessible to any user granted approval permissions regardless of base role archetype.

### Document Vault
* Centralized encrypted repository for internal legal documents: PAN, Aadhaar, company incorporation certificates, partner agreements, and vendor contracts.
* Per-document Access Control Lists (ACL) to restrict visibility to specific teammates (Owners and Accounts Managers retain master access).

### Reports & Analytics
* Deep reporting suite: Funnel conversion, bank-wise performance, scheme profitability, partner volume, employee productivity, and marketing ad attribution.
* Formatted exports in Excel (.xlsx) and CSV formats.

### Recycle Bin
* Safety net for soft-deleted leads, loans, and partner profiles.
* Retains deleted records for 30 days with instant restore or permanent purge capabilities.

### Refer & Earn
* Dedicated referral tracking portal.
* Earn 3 free months of platform subscription for every referred DSA that activates an account.

### Training Hub
* Onboarding video tutorials, operational runbooks, and step-by-step guides for training new staff.

### What's New (Changelog)
* Continuous product updates, new feature rollouts, API enhancements, and bug fixes shipped to the platform.

---

## 10. Settings

### Users
* Invite team members, configure roles, deactivate credentials, and dispatch instant password reset links.

### Roles & Permissions
* Granular matrix of resource × action toggles (View, Create, Edit, Delete, Export, Approve).
* Navigation auto-adaptation: Granular permission grants automatically render the corresponding sidebar items.

### Subscription
* Active plan details, allocated user seats, renewal timeline, and downloadable tax invoices.

### Company & Invoicing
* Corporate legal name, GSTIN, registered billing address, and authorized digital signatory.

### Branding
* Tenant logo upload, primary and secondary brand colors, white-label toggle, and custom Android APK download URL.

### Meta / Facebook Integration
* Connect corporate Facebook Pages to automatically stream lead generation form submissions into your CRM in real time.

### IVR & Email SMTP
* Custom IVR telephony provider configuration and outbound SMTP server credentials for company-branded system emails.

### Notifications
* Granular per-user toggles for drip nudges, daily morning summaries, and birthday, anniversary, and holiday reminders.

### API Access
* Generate and manage secure API keys for programmatic lead ingestion, status webhooks, and third-party integrations.

---
*Documentation maintained by SNIPER Lending Technologies India Pvt Ltd.*  
*Online portal: https://www.teleport.sniperelectric.in/docs*
