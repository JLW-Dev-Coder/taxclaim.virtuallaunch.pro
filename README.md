# TaxClaim VLP — Hosted 843 Landing Page

This repository contains the canonical contracts for **TaxClaim Virtual Launch Pro (VLP)**. Each contract defines the flow-level source of truth for endpoints, payloads, authentication, validation, storage, and projections.

## Product Details (Stripe)

* **Product Name:** Virtual Launch Pro — Tax Claim Pro
* **Product ID:** `prod_UCK4SzsEnjp19U`
* **Price:** $10.00 USD / month
* **Price ID:** `price_1TDvQe9ROeyeXOqek1fpOWWH`
* **Product Tax Code:** General - Electronically Supplied Services (`txcd_10000000`)
* **Description:** Monthly subscription for tax professionals to host a Form 843 refund claim landing page for their taxpayers. Includes automated penalty tracking, IRS transcript access, and downloadable Form 843 PDFs.
* **Marketing Features:**

  1. Hosted 843 refund landing page
  2. Monthly Form 843 PDF generation
  3. Automated penalty & interest calculations
  4. Taxpayer dashboard access
  5. Fill-in revenue gaps year-round

## Repository Structure

* **/contracts** – JSON files following the canonical contract structure.

**Contract Sections:**

* **auth** – Authentication requirements.
* **contract** – Authority, title, version, pages, and validation rules.
* **delivery** – Endpoint, HTTP method, and signature rules.
* **effects** – Write targets, dedupe keys, canonical patch/upsert rules.
* **payload** – Schema for input data.
* **response** – Success, error, and deduped responses.
* **schema** – Schema name and version.

## Usage

1. Copy the `/contracts` folder into your project.
2. Ensure environment variables and R2 storage are configured.
3. POST or GET to the defined endpoints using the prescribed payloads.
4. Handle responses according to the response section in each contract.
5. Use Stripe `product ID` and `price ID` for checkout, subscription, or billing flows.

## License

All contracts, templates, and product definitions are proprietary to **TaxClaim Pro**.

---