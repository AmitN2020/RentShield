### 1. Specific Clause Categorization System

Based on the reference guidelines, rental agreement clauses are broken down into **17 exact functional categories** for granular analysis:

1. **Parties Involved** *(Full names, addresses, and IDs like Aadhaar/PAN of landlord and tenant)*
2. **Property Details** *(Exact address, property type, size/sq.ft, floor, amenities, and inclusions)*
3. **Rent and Security Deposit** *(Monthly rent amount, due date, payment mode, deposit size, refund timeline, and lawful deduction terms)*
4. **Lease Duration** *(Start and end dates, 11-month term to avoid mandatory registration under Registration Act 1908, and renewal terms)*
5. **Maintenance and Repairs** *(Demarcation of minor repair limits for tenant vs. major structural/plumbing repairs for landlord)*
6. **Utilities** *(Responsibility for electricity, water, gas, internet, and society charges)*
7. **Termination and Notice Period** *(Notice period duration, early termination rules, and delivery method like email or written letter)*
8. **Subletting** *(Rules and permissions regarding subletting or unauthorized occupants)*
9. **Pets** *(Explicit rules regarding pets, allowed types, or prior approval requirements)*
10. **Penalty for Late Payment** *(Daily fine or percentage penalty for rent paid after the due date)*
11. **Food Habits & Lifestyle** *(Restrictions on non-vegetarian food, alcohol, drugs, or community norms)*
12. **Lock-in Period** *(Minimum stay duration during which neither party can terminate without penalty)*
13. **Overstay Consequences** *(Financial penalties for occupying the property post-lease expiration without renewal)*
14. **Dispute Resolution** *(Process for resolving conflicts, including mediation and court jurisdiction)*
15. **Governing Law** *(Reference to applicable laws, such as Karnataka Rent Act 1999 / Karnataka tenancy framework)*
16. **Witnesses** *(Signatures, names, and addresses of two witnesses validating the agreement)*
17. **Other / Miscellaneous** *(Any additional clauses, indemnities, fixture installation rules, broker fee lines, or catch-all terms)*

---

### 2. Mandatory Clauses Checklist (Missing Clause Identification)

The app cross-references extracted contracts against this **exact 11-item mandatory checklist**. If any of these essential provisions are missing or vague, the app flags them as **"Missing Mandatory Clause (High Risk)"**:

* Parties Involved: Full names, addresses, and identity numbers (PAN/Aadhaar) for landlord and tenant.
* Property Details: Complete address, property type, unit number, and physical description.
* Lease Duration: Clear start/end dates (typically 11 months) and renewal terms.
* Rent and Security Deposit: Stated monthly rent, due date, payment method, deposit amount, and refund conditions.
* Penalty for Late Payment: Defined grace period and reasonable late fee structure.
* Lock-in Period: Stated minimum stay duration (e.g., 3–6 months) and exit penalty terms.
* Termination and Notice Period: Advance notice requirement (e.g., 30–60 days) and exit conditions.
* Maintenance and Repairs: Explicit division between minor tenant repairs and major landlord repairs.
* Utilities: Clear allocation of electricity, water, gas, and society maintenance payments.
* Subletting: Explicit rule barring or allowing subletting with written consent.
* Dispute Resolution: Clear path for handling disputes (e.g., mediation, Bangalore court jurisdiction).

---

### 3. Comprehensive Rule-Based Scoring System (All 17 Categories)

Every clause is evaluated on a scale from **1 (Safe / Tenant-Friendly)** to **10 (Critical Risk / Unlawful)** based on grounded rules and Karnataka standards.

#### **1. Parties Involved**
* **Score 1:** Complete names, permanent addresses, and official IDs (Aadhaar/PAN) provided for both parties.
* **Score 5:** Names provided but missing permanent addresses or ID numbers.
* **Score 9:** Missing landlord details, unverified representative signing without Power of Attorney (POA), or third-party/broker listed as receiving deposit.

#### **2. Property Details**
* **Score 1:** Exact address, unit/flat number, floor, square footage, parking allocation, and detailed inclusions (e.g., furnished kitchen items).
* **Score 4:** General address provided but missing flat number, parking specifics, or inventory list.
* **Score 8:** Vague address or mismatch between agreement schedule and physical property being leased.

#### **3. Rent and Security Deposit**
* **Score 1:** Security deposit $\le 2$ months' rent, fully refundable within $\le 15$–30 days of lease end, clear payment mode and due date.
* **Score 6:** Security deposit 3 to 5 months' rent, or refund timeline tied vaguely to "finding a replacement tenant."
* **Score 10:** Security deposit $> 5$ months' rent, explicit "non-refundable deposit" wording, blank refund fields, or arbitrary forfeiture clauses.

#### **4. Lease Duration**
* **Score 1:** Clear 11-month term with explicit start/end dates and "renewable with mutual consent" clause.
* **Score 5:** Lease exceeding 12 months without registration mention, or vague auto-renewal without opt-out notice window.
* **Score 9:** Unspecified start/end dates, or clause allowing landlord to shorten lease duration unilaterally without breach.

#### **5. Maintenance and Repairs**
* **Score 1:** Clear threshold (e.g., tenant handles minor repairs up to ₹1,000; landlord covers major plumbing, electrical, and structural repairs).
* **Score 6:** Vague repair division without cost caps or clear distinction between minor and structural issues.
* **Score 10:** Clause forcing tenant to bear structural repairs, roof leakage, or society building capital improvement fees.

#### **6. Utilities**
* **Score 1:** Explicit listing of all utilities (electricity, water, gas, internet, society maintenance) with direct payment responsibility defined.
* **Score 5:** Minor ambiguity on who pays society maintenance or shared water charges.
* **Score 9:** Vague utility bundling allowing landlord to unilaterally adjust utility charges or cut off supply during disputes.

#### **7. Termination and Notice Period**
* **Score 1:** Symmetric 30-to-60-day written notice for both parties with clear delivery method (e.g., email or letter).
* **Score 7:** Asymmetric notice (e.g., tenant must give 60 days notice, but landlord can vacate in 15 days).
* **Score 9:** Unspecified notice period, or terms allowing landlord to evict instantly without cause.

#### **8. Subletting**
* **Score 1:** Standard restriction barring subletting without landlord's prior written consent while allowing normal family/roommate occupancy.
* **Score 5:** Strict subletting ban without provision for adding co-tenants or roommates with consent.
* **Score 8:** Predatory subletting penalties (e.g., instant eviction and complete deposit forfeiture for having a guest stay over).

#### **9. Pets**
* **Score 1:** Explicit permission for pets or reasonable conditional approval terms (e.g., small pets allowed).
* **Score 4:** Explicit pet prohibition clearly stated upfront.
* **Score 8:** Arbitrary pet penalties or mid-tenancy pet bans enforced after agreement execution.

#### **10. Penalty for Late Payment**
* **Score 1:** Reasonable late fee (e.g., ₹100–₹500 flat fee or nominal interest) after a 5-day grace period post-due date.
* **Score 6:** Excessive daily fines (e.g., $> ₹500$/day) starting immediately on the 1st of the month without a grace period.
* **Score 10:** Compounding high-interest rates, immediate lease termination, or instant deposit forfeiture for short delays.

#### **11. Food Habits & Lifestyle**
* **Score 1:** Clear, reasonable lifestyle guidelines discussed upfront (e.g., non-veg allowed, no illegal substances).
* **Score 6:** Restrictive food/dietary prohibitions (e.g., strict prohibition of specific foods) imposed on private living space.
* **Score 9:** Overreaching moral or personal conduct curfews, total visitor bans, or invasive society/landlord policing.

#### **12. Lock-in Period**
* **Score 1:** Reasonable lock-in ($\le 6$ months) explicitly paired with a job-transfer or emergency relocation exemption.
* **Score 6:** Standard 6-to-11-month lock-in period with a 1-month rent exit penalty.
* **Score 10:** Full lease duration lock-in requiring payment of all remaining rent upon early exit, with zero exceptions.

#### **13. Overstay Consequences**
* **Score 1:** Reasonable daily overstay fee (e.g., double rent) applied after lease expiration without renewal.
* **Score 6:** Unusually high overstay penalties (4 times daily rent) without grace period for moving out.
* **Score 9:** Clause allowing landlord self-help eviction, lock changing, or illegal seizure of tenant belongings for overstay.

#### **14. Dispute Resolution**
* **Score 1:** Preference for amicable resolution through mediation, followed by legal recourse under Bangalore court jurisdiction.
* **Score 5:** Direct litigation clause without mediation mention.
* **Score 9:** Dispute resolution jurisdiction set in a remote city outside Karnataka or unfair binding arbitration costs borne solely by tenant.

#### **15. Governing Law**
* **Score 1:** Explicitly states agreement follows Karnataka laws, including the Karnataka Rent Act 1999 / state rent rules.
* **Score 5:** States general Indian contract law without referencing Karnataka-specific tenancy legislation.
* **Score 8:** References wrong state laws or attempts to contract out of statutory tenant protections under Karnataka law.

#### **16. Witnesses**
* **Score 1:** Names, signatures, and addresses of two independent, verifiable witnesses included.
* **Score 5:** Only one witness signature provided or missing witness addresses.
* **Score 8:** Complete absence of witness signatures and details.

#### **17. Other / Miscellaneous**
* **Score 1:** Fair general clauses (e.g., tenant pays direct replacement cost for lost keys; reasonable fixture installation allowed).
* **Score 6:** Prohibitions on basic livability installations (e.g., cannot install AC, water purifier, or washing machine).
* **Score 10:** Hidden brokerage commission lines billed to tenant, blanket indemnity forcing tenant to pay for landlord's legal fees, or arbitrary penalty clauses.

---

### 4. Overall Weighted Risk Scoring Framework

The **Overall Agreement Risk Score ($S_{overall}$)** is calculated using a **Weighted Multi-Factor Model** across all 17 categories, prioritizing financial risks, exit traps, and maintenance liabilities:

$$
S_{overall} = \sum_{i=1}^{17} (Score_i \times Weight_i)
$$

#### **Category Weight Distribution ($W_i$):**

| Category | Weight ($W_i$) | Rationale |
| :--- | :---: | :--- |
| **3. Rent and Security Deposit** | **20%** ($0.20$) | Direct cash exposure & refund dispute risk. |
| **12. Lock-in Period** | **15%** ($0.15$) | Major financial trap upon job transfer/relocation. |
| **7. Termination and Notice Period** | **12%** ($0.12$) | Controls transition safety and exit flexibility. |
| **5. Maintenance and Repairs** | **10%** ($0.10$) | Dictates repair liabilities and hidden exit costs. |
| **6. Utilities** | **8%** ($0.08$) | Controls recurring monthly bill splits. |
| **10. Penalty for Late Payment** | **6%** ($0.06$) | Late fee exposure and grace period protection. |
| **13. Overstay Consequences** | **5%** ($0.05$) | Exit transition penalty risk. |
| **8. Subletting** | **4%** ($0.04$) | Occupancy rules and co-tenant terms. |
| **11. Food Habits & Lifestyle** | **4%** ($0.04$) | Daily living conditions and privacy impact. |
| **17. Other / Miscellaneous** | **4%** ($0.04$) | Hidden charges, broker fees, and fixture rules. |
| **4. Lease Duration** | **3%** ($0.03$) | Tenure clarity and 11-month validity. |
| **14. Dispute Resolution** | **3%** ($0.03$) | Legal process for conflict handling. |
| **15. Governing Law** | **2%** ($0.02$) | State law enforceability. |
| **1. Parties Involved** | **1.5%** ($0.015$) | Identity verification. |
| **2. Property Details** | **1.5%** ($0.015$) | Property description & inclusions. |
| **9. Pets** | **0.5%** ($0.005$) | Pet policy guidelines. |
| **16. Witnesses** | **0.5%** ($0.005$) | Formal execution validity. |
| **Total Weight** | **100%** ($1.00$) | |

---

#### **Overall Risk Score Thresholds & Action Matrix:**

* **1.0 – 3.0 (Low Risk / Tenant-Friendly):** Safe, balanced agreement adhering to standard Karnataka practices. Ready to sign.
* **3.1 – 6.0 (Moderate Risk / Standard Market Template):** Standard agreement containing customary friction (e.g., 6–11 month lock-in, standard minor repair terms). Minor negotiation recommended.
* **6.1 – 8.0 (High Risk / Unfair Terms):** High financial exposure, mandatory repainting penalties, asymmetric notice, or excessive late fees. **Negotiation required before signing.**
* **8.1 – 10.0 (Critical Risk / Unlawful):** Predatory terms (illegal non-refundable deposit, excessive deposit size, utility cut-off rights, overstay forfeiture). **Do not sign; demand a rewrite or walk away.**