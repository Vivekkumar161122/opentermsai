import { FullAnalysisOutput, SampleDocumentMeta, PageText } from "@/types";

export const DEMO_SAMPLE_METAS: SampleDocumentMeta[] = [
  {
    id: "commercial-lease",
    title: "Standard Commercial Property Lease Agreement",
    documentType: "Commercial Real Estate Lease",
    defaultPerspective: "Tenant",
    availablePerspectives: ["Tenant", "Landlord"],
    description: "A 5-year commercial retail lease with uncapped operating expense pass-throughs, strict forfeiture, and unilateral entry clauses.",
  },
  {
    id: "freelance-msa",
    title: "Master Professional Services & Contractor Agreement",
    documentType: "Independent Contractor Agreement",
    defaultPerspective: "Freelancer",
    availablePerspectives: ["Freelancer", "Client"],
    description: "A software engineering contractor agreement with pay-when-paid payment terms, broad uncapped indemnity, and global 24-month non-compete.",
  },
  {
    id: "employment-agreement",
    title: "Executive Employment Agreement",
    documentType: "Executive Employment Contract",
    defaultPerspective: "Employee",
    availablePerspectives: ["Employee", "Employer"],
    description: "Senior leadership agreement with sweeping IP inventions assignment, strict at-will status without severance, and mandatory arbitration waivers.",
  },
];

export const DEMO_PAGES_MAP: Record<string, PageText[]> = {
  "commercial-lease": [
    {
      pageNumber: 1,
      text: `COMMERCIAL REAL ESTATE LEASE AGREEMENT
This Commercial Lease Agreement (the "Lease") is entered into as of October 1, 2024, by and between APEX COMMERCIAL HOLDINGS LLC ("Landlord"), and METRO INNOVATIONS INC. ("Tenant").

1. PREMISES & LEASE TERM
Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the commercial retail suite known as Unit 402, located at 850 Market Street, San Francisco, CA (the "Premises"). The term shall commence on November 1, 2024, and expire on October 31, 2029 (the "Term").

2. BASE RENT & PASS-THROUGH OPERATING EXPENSES
Tenant shall pay monthly base rent of $12,500.00 in advance on the first day of each month. In addition to base rent, Tenant shall pay 100% of all proportional Common Area Maintenance (CAM), property insurance increases, municipal taxes, and structural repairs as additional pass-through operating expenses without limitation or cap.

3. SECURITY DEPOSIT & FORFEITURE
Upon execution, Tenant shall deposit $37,500.00 as a Security Deposit. In the event of any minor default or rent delay exceeding 48 hours, Landlord reserves the absolute right to forfeit the entire security deposit as liquidated damages without itemized accounting.`,
    },
    {
      pageNumber: 2,
      text: `4. INDEMNIFICATION & THIRD-PARTY LIABILITY
Tenant covenants and agrees to defend, indemnify, and hold harmless Landlord, its agents, contractors, and affiliates from and against any and all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or related to any occurrence in or about the Premises, regardless of whether caused in part by Landlord's ordinary negligence. Tenant's liability under this section shall be uncapped and unconditional.

5. LANDLORD ENTRY & INSPECTION
Landlord, its agents, and prospective buyers or mortgagees may enter the Premises at any hour of the day or night, with or without prior notice to Tenant, to inspect the premises or exhibit the same, without abatement of rent or liability for disruption to Tenant's business operations.

6. TERMINATION, DEFAULT & CURE PERIOD
If Tenant fails to pay rent when due or breaches any covenant herein, Landlord may terminate this Lease immediately upon three (3) days written notice. Tenant expressly waives any statutory right to notice or redemption under state law. Upon termination, all remaining rent due for the balance of the 5-year term shall accelerate and become immediately payable.`,
    },
  ],
  "freelance-msa": [
    {
      pageNumber: 1,
      text: `MASTER SERVICES AGREEMENT (INDEPENDENT CONTRACTOR)
This Master Services Agreement ("Agreement") is made between NEXUS GLOBAL VENTURES INC. ("Client") and JANE DOE CONSULTING ("Contractor").

1. SCOPE OF SERVICES & PAYMENT TERMS
Contractor agrees to perform cloud architecture and full-stack software development services. Client shall pay Contractor $135.00 per hour. Invoicing shall occur monthly, and payment terms shall be Net 90 calendar days following Client's internal audit and receipt of funds from Client's end-customer ("Pay-When-Paid"). Contractor shall not be entitled to interest on late disbursements.

2. INTELLECTUAL PROPERTY & WORK MADE FOR HIRE
All code, software artifacts, architectures, documentation, and inventions conceived or created by Contractor during the term of this Agreement shall constitute a 'Work Made for Hire' exclusively owned by Client. Contractor hereby irrevocably assigns all right, title, interest, copyright, and patent rights worldwide, without reservation of Contractor's pre-existing developer tooling or background libraries.`,
    },
    {
      pageNumber: 2,
      text: `3. INDEMNIFICATION & THIRD-PARTY LIABILITY
Contractor shall defend, indemnify, and hold harmless Client and its officers, directors, and customers from any third-party claims, losses, or legal liabilities arising from Contractor's deliverables, code defects, or performance. Contractor's indemnification obligations shall be unlimited and not subject to any limitation of liability or fee cap.

4. NON-COMPETE & RESTRICTIVE COVENANTS
For a duration of twenty-four (24) months following termination of this Agreement, Contractor shall not directly or indirectly provide consulting, software development, or advisory services to any company operating in the enterprise software, cloud infrastructure, or fintech domains worldwide.

5. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement or any Statement of Work at any time, with or without cause, effective immediately upon electronic notice. Contractor may only terminate upon sixty (60) days advance written notice for material uncured breach.`,
    },
  ],
  "employment-agreement": [
    {
      pageNumber: 1,
      text: `EXECUTIVE EMPLOYMENT AGREEMENT
This Executive Employment Agreement is made between STRATOS AI CORP. ("Employer") and ALEX MERCER ("Executive").

1. POSITION, DUTIES & AT-WILL STATUS
Executive shall serve as Vice President of Engineering. Executive's employment is strictly at-will. Employer may terminate Executive's employment at any time, with or without cause, and without prior notice or severance compensation.

2. INVENTIONS ASSIGNMENT & INTELLECTUAL PROPERTY
Executive agrees to assign and hereby assigns to Employer all inventions, discoveries, software code, algorithm designs, and copyrightable works created during Executive's tenure, regardless of whether developed during normal business hours or utilizing Employer equipment.`,
    },
    {
      pageNumber: 2,
      text: `3. NON-COMPETITION & NON-SOLICITATION
During the term of employment and for eighteen (18) months thereafter, Executive shall not engage in any business activity or become employed by any organization competing directly or indirectly with Employer. Executive further agrees not to solicit any employee or customer of Employer for two (2) years post-termination.

4. GOVERNING LAW & MANDATORY ARBITRATION WAIVER
This Agreement shall be governed by Delaware law. Any dispute shall be resolved through confidential binding arbitration. Executive expressly waives any right to a jury trial or participation in class-action proceedings.`,
    },
  ],
};

// Rich analysis map keyed by [sampleId + "_" + perspective]
export const DEMO_ANALYSIS_MAP: Record<string, FullAnalysisOutput> = {
  // 1. Commercial Lease - TENANT
  "commercial-lease_Tenant": {
    documentContext: {
      title: "Standard Commercial Property Lease Agreement",
      documentType: "Commercial Real Estate Lease",
      analyzedPerspective: "Tenant",
      overallRiskScore: "CRITICAL",
      executiveSummary:
        "This lease agreement represents an exceptionally hazardous, one-sided arrangement for the Tenant. Operating expenses and CAM fees are entirely uncapped, transferring structural building maintenance costs to the Tenant. The indemnification clause holds the Landlord harmless even for their own ordinary negligence, while default provisions allow instant deposit forfeiture and 5-year rent acceleration after a nominal 3-day notice window.",
    },
    analyzedClauses: [
      {
        clauseId: "lease-sec-2",
        clauseTitle: "Base Rent & Uncapped Pass-Through Operating Expenses",
        originalText:
          "Tenant shall pay 100% of all proportional Common Area Maintenance (CAM), property insurance increases, municipal taxes, and structural repairs as additional pass-through operating expenses without limitation or cap.",
        simplifiedText:
          "On top of your monthly rent, you must pay for building repairs, property taxes, and insurance with zero maximum spending limit. If the roof leaks or taxes skyrocket, you are forced to pay the bill.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Uncapped pass-through expenses expose the Tenant to uncontrollable financial liabilities. Landlords can pass along capital improvements and major building repairs without any annual escalation ceiling.",
        pageNumber: 1,
        recommendedAction:
          "Cap annual controllable CAM increases at 3% to 5% per year, and explicitly exclude capital expenditures, structural foundation/roof replacements, and Landlord's executive overhead.",
      },
      {
        clauseId: "lease-sec-3",
        clauseTitle: "Security Deposit & Liquidated Damages Forfeiture",
        originalText:
          "In the event of any minor default or rent delay exceeding 48 hours, Landlord reserves the absolute right to forfeit the entire security deposit as liquidated damages without itemized accounting.",
        simplifiedText:
          "If your rent check is just two days late, the landlord can instantly seize your entire $37,500 deposit without proving they actually lost any money or giving you a receipt.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "This is an unenforceable penalty clause disguised as liquidated damages. Forfeiture of $37,500 over a 48-hour delay is grossly disproportionate and deprives Tenant of customary cure rights.",
        pageNumber: 1,
        recommendedAction:
          "Require a mandatory 10-day written cure notice before any default, and mandate that deposit deductions be limited strictly to actual unpaid sums supported by itemized invoices.",
      },
      {
        clauseId: "lease-sec-4",
        clauseTitle: "Uncapped Indemnification & Negligence Shift",
        originalText:
          "Tenant covenants and agrees to defend, indemnify, and hold harmless Landlord... regardless of whether caused in part by Landlord's ordinary negligence. Tenant's liability under this section shall be uncapped and unconditional.",
        simplifiedText:
          "You must pay for all legal defense and damages if anyone gets injured or sues the landlord on the property, even if the accident was caused by the landlord's own carelessness.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Requiring the Tenant to indemnify the Landlord for the Landlord's own negligence is commercially uninsurable and violates common-law public policy in many jurisdictions.",
        pageNumber: 2,
        recommendedAction:
          "Make indemnification strictly mutual, carve out Landlord's negligence or willful misconduct, and cap liability to the proceeds of commercially required insurance.",
      },
      {
        clauseId: "lease-sec-5",
        clauseTitle: "Landlord Entry Without Prior Notice",
        originalText:
          "Landlord, its agents, and prospective buyers or mortgagees may enter the Premises at any hour of the day or night, with or without prior notice to Tenant... without abatement of rent or liability for disruption.",
        simplifiedText:
          "The landlord and prospective buyers can walk into your business at any time of day or night without telling you first, even if it disrupts your customers or operations.",
        perspectiveRiskLevel: "YELLOW",
        riskReasoning:
          "Severely infringes upon the Tenant's covenant of quiet enjoyment and creates physical security, confidentiality, and operational disruption risks.",
        pageNumber: 2,
        recommendedAction:
          "Require at least twenty-four (24) hours advance written notice for all non-emergency entries, restrict visits to standard business hours, and require an authorized Tenant escort.",
      },
      {
        clauseId: "lease-sec-6",
        clauseTitle: "Summary Termination & 5-Year Rent Acceleration",
        originalText:
          "Landlord may terminate this Lease immediately upon three (3) days written notice... Upon termination, all remaining rent due for the balance of the 5-year term shall accelerate and become immediately payable.",
        simplifiedText:
          "If you miss a deadline, you only get 3 days to fix it before being evicted. Once evicted, you immediately owe all 5 years of future rent all at once ($750,000+).",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Unmitigated rent acceleration without an obligation for the Landlord to re-let the premises creates devastating existential financial exposure for the Tenant.",
        pageNumber: 2,
        recommendedAction:
          "Extend default notice to thirty (30) days for non-monetary defaults and ten (10) business days for monetary defaults. Delete full acceleration or condition it on discounted present value minus Landlord's duty to mitigate.",
      },
    ],
    lawyerConsultationPack: {
      criticalRedFlags: [
        "Uncapped pass-through CAM and operating expenses including structural and capital replacements.",
        "Security deposit seizure ($37,500) triggered after an unreasonable 48-hour delay without accounting.",
        "Unilateral indemnification covering Landlord's own ordinary negligence without liability caps.",
        "Unmitigated 5-year accelerated rent clause without statutory landlord mitigation obligations.",
      ],
      missingProtections: [
        "No Quiet Enjoyment warranty or rent abatement provisions for Landlord utility outages.",
        "Absence of Landlord maintenance obligations for structural roof, foundation, and HVAC systems.",
        "Lack of sublease and assignment rights without Landlord's arbitrary consent.",
        "No Force Majeure clause protecting against business disruptions, natural disasters, or pandemics.",
      ],
      questionsForCounsel: [
        "Is the 48-hour security deposit forfeiture clause legally enforceable as liquidated damages under California Civil Code § 1950.7?",
        "Can we enforce an exclusion of capital improvements and an annual 4% cap on controllable CAM pass-throughs?",
        "How can we restructure Section 4 to ensure Landlord retains sole liability for injuries stemming from common-area defects?",
        "What standard language should we propose to guarantee Landlord's statutory duty to mitigate damages in the event of lease termination?",
      ],
    },
    disclaimer:
      "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
  },

  // 1b. Commercial Lease - LANDLORD
  "commercial-lease_Landlord": {
    documentContext: {
      title: "Standard Commercial Property Lease Agreement",
      documentType: "Commercial Real Estate Lease",
      analyzedPerspective: "Landlord",
      overallRiskScore: "LOW",
      executiveSummary:
        "From the Landlord's perspective, this lease agreement provides near-total legal and economic insulation. Pass-through operating expenses protect property yield against municipal tax hikes and inflation, while broad indemnification shifts premise liability onto the Tenant. Accelerated rent provisions provide maximum leverage during creditor settlement proceedings.",
    },
    analyzedClauses: [
      {
        clauseId: "lease-sec-2",
        clauseTitle: "Base Rent & Pass-Through Operating Expenses",
        originalText:
          "Tenant shall pay 100% of all proportional Common Area Maintenance (CAM), property insurance increases, municipal taxes, and structural repairs as additional pass-through operating expenses without limitation or cap.",
        simplifiedText:
          "The tenant covers all building operating costs, tax spikes, and maintenance, safeguarding your net operating income against inflation.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Protects net rental income and guarantees that all physical and financial overhead is fully absorbed by the commercial tenant.",
        pageNumber: 1,
        recommendedAction:
          "Preserve the pass-through structure, but ensure clear annual audit procedures to defend against tenant withholding disputes.",
      },
      {
        clauseId: "lease-sec-3",
        clauseTitle: "Security Deposit & Forfeiture",
        originalText:
          "In the event of any minor default or rent delay exceeding 48 hours, Landlord reserves the absolute right to forfeit the entire security deposit as liquidated damages without itemized accounting.",
        simplifiedText:
          "Provides immediate cash liquidity upon tenant breach, discouraging delayed rental payments.",
        perspectiveRiskLevel: "YELLOW",
        riskReasoning:
          "While highly advantageous on paper, courts frequently strike down blanket deposit forfeitures as unlawful penalties unless tethered to actual incurred damages.",
        pageNumber: 1,
        recommendedAction:
          "Adjust language to specify that the deposit will be applied toward actual damages, legal fees, and re-leasing costs to ensure court enforceability.",
      },
      {
        clauseId: "lease-sec-4",
        clauseTitle: "Indemnification & Third-Party Liability",
        originalText:
          "Tenant covenants and agrees to defend, indemnify, and hold harmless Landlord... regardless of whether caused in part by Landlord's ordinary negligence.",
        simplifiedText:
          "Transfers premise liability and third-party lawsuit defense costs directly onto the tenant and their commercial insurance carrier.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Shields Landlord from premise injury claims and legal defense costs incurred within the leased commercial suite.",
        pageNumber: 2,
        recommendedAction:
          "Verify that Tenant names Landlord as an Additional Insured on a primary and non-contributory commercial general liability policy with at least $2M per occurrence.",
      },
      {
        clauseId: "lease-sec-5",
        clauseTitle: "Landlord Entry & Inspection",
        originalText:
          "Landlord, its agents, and prospective buyers or mortgagees may enter the Premises at any hour of the day or night, with or without prior notice...",
        simplifiedText:
          "Gives you unfettered access to show the unit to buyers, appraisers, or lenders whenever necessary.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Maximizes property liquidity and allows immediate inspection without administrative notice delays.",
        pageNumber: 2,
        recommendedAction:
          "Consider offering a customary 24-hour notice concession for routine visits to avoid tenant quiet enjoyment litigation, while maintaining immediate emergency access.",
      },
      {
        clauseId: "lease-sec-6",
        clauseTitle: "Termination, Default & Rent Acceleration",
        originalText:
          "Upon termination, all remaining rent due for the balance of the 5-year term shall accelerate and become immediately payable.",
        simplifiedText:
          "Allows you to claim the entire remainder of the 5-year lease value if the tenant breaks the contract.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Provides maximum negotiating power and proof of claim in tenant bankruptcy or restructuring proceedings.",
        pageNumber: 2,
        recommendedAction:
          "Ensure acceleration language includes discounting future rent to present value to ensure enforceability under state commercial code.",
      },
    ],
    lawyerConsultationPack: {
      criticalRedFlags: [
        "Risk of judicial invalidation of the 48-hour security deposit forfeiture clause as an unlawful penalty.",
        "Potential unenforceability of indemnification for Landlord's ordinary negligence under state real property statutes.",
      ],
      missingProtections: [
        "No explicit requirement for Tenant to deliver annual audited financial statements upon Landlord request.",
        "Missing personal guarantor or corporate parent guarantee agreement.",
        "Absence of subordination, non-disturbance, and attornment (SNDA) clauses required by commercial mortgage lenders.",
      ],
      questionsForCounsel: [
        "How can we modify the security deposit liquidated damages clause to survive judicial scrutiny in California?",
        "Does our lease draft satisfy our institutional lender's standard SNDA and estoppel certificate requirements?",
        "Should we mandate a corporate parent guaranty given the startup nature of the commercial tenant?",
      ],
    },
    disclaimer:
      "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
  },

  // 2. Freelance MSA - FREELANCER
  "freelance-msa_Freelancer": {
    documentContext: {
      title: "Master Professional Services & Contractor Agreement",
      documentType: "Independent Contractor Agreement",
      analyzedPerspective: "Freelancer",
      overallRiskScore: "CRITICAL",
      executiveSummary:
        "This agreement imposes critical commercial hazards on the Freelancer. The Net 90 'Pay-When-Paid' clause forces the contractor to act as an uncompensated bank for the Client, with zero payment guarantee if the end-customer defaults. Simultaneously, the sweeping IP assignment strips pre-existing developer tooling, the indemnification has no fee cap, and a 24-month worldwide non-compete would severely handicap future livelihood.",
    },
    analyzedClauses: [
      {
        clauseId: "msa-sec-1",
        clauseTitle: "Payment Terms & Pay-When-Paid Provision",
        originalText:
          "Payment terms shall be Net 90 calendar days following Client's internal audit and receipt of funds from Client's end-customer ('Pay-When-Paid'). Contractor shall not be entitled to interest on late disbursements.",
        simplifiedText:
          "You must wait at least 3 months to get paid. Even worse, if the client's customer doesn't pay them, the client doesn't have to pay you anything at all. No interest on late payments.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Extremely predatory. Contingent payment shifts enterprise credit risk onto an individual contractor who has zero control over the client's customer relationship.",
        pageNumber: 1,
        recommendedAction:
          "Demand Net 15 or Net 30 payment terms tied strictly to invoice delivery, eliminate the 'Pay-When-Paid' contingency, and include a 1.5% monthly late fee.",
      },
      {
        clauseId: "msa-sec-2",
        clauseTitle: "Total IP Assignment & Loss of Tooling",
        originalText:
          "All code, software artifacts, architectures, documentation... shall constitute a 'Work Made for Hire' exclusively owned by Client... without reservation of Contractor's pre-existing developer tooling or background libraries.",
        simplifiedText:
          "The client owns everything you write, plus they take ownership of your personal software tools, code snippets, and reusable libraries that you created before this project.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Assigning pre-existing developer libraries or utilities creates fatal IP encumbrances on all past and future software projects.",
        pageNumber: 1,
        recommendedAction:
          "Carve out 'Background IP' and developer tools, granting Client a non-exclusive license while retaining Contractor's sole ownership of pre-existing frameworks.",
      },
      {
        clauseId: "msa-sec-3",
        clauseTitle: "Uncapped Indemnification & Code Liability",
        originalText:
          "Contractor shall defend, indemnify, and hold harmless Client... from any third-party claims, losses, or legal liabilities arising from Contractor's deliverables... shall be unlimited and not subject to any limitation of liability.",
        simplifiedText:
          "If a bug or issue in your software causes the client's system to lose money or get sued, you must pay all legal fees and damages with zero dollar limit.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "An uncapped indemnity exposes a solo developer to multi-million-dollar consequential and third-party damages that exceed contract value by orders of magnitude.",
        pageNumber: 2,
        recommendedAction:
          "Cap total liability to the aggregate fees paid under the contract in the preceding 6 months, and limit indemnity strictly to proven gross negligence.",
      },
      {
        clauseId: "msa-sec-4",
        clauseTitle: "24-Month Global Non-Compete Covenant",
        originalText:
          "For a duration of twenty-four (24) months following termination... Contractor shall not directly or indirectly provide consulting, software development, or advisory services to any company operating in the enterprise software, cloud infrastructure, or fintech domains worldwide.",
        simplifiedText:
          "After finishing this contract, you cannot work for any other software or cloud company in the entire world for 2 whole years.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "A 24-month worldwide non-compete for an independent contractor is commercially predatory and prevents the contractor from practicing their trade.",
        pageNumber: 2,
        recommendedAction:
          "Delete the non-compete in its entirety. Replace with a reasonable 6-month non-solicitation of direct client employees only.",
      },
      {
        clauseId: "msa-sec-5",
        clauseTitle: "Unilateral Termination for Convenience",
        originalText:
          "Client may terminate this Agreement... at any time, with or without cause, effective immediately upon electronic notice. Contractor may only terminate upon sixty (60) days advance written notice.",
        simplifiedText:
          "The client can fire you in 1 second with an email, but you must give them 60 days of written notice if you ever need to leave.",
        perspectiveRiskLevel: "YELLOW",
        riskReasoning:
          "Unbalanced termination rights create business volatility and make project capacity planning impossible.",
        pageNumber: 2,
        recommendedAction:
          "Make termination for convenience mutual with fourteen (14) days written notice and payment for all completed work in progress plus non-refundable kill fees.",
      },
    ],
    lawyerConsultationPack: {
      criticalRedFlags: [
        "Contingent 'Pay-When-Paid' clause and Net 90 payment delay.",
        "Uncapped indemnification for software bugs without liability ceiling.",
        "Overreaching 24-month global non-compete restricting contractor livelihood.",
        "Forfeiture of pre-existing software developer libraries and background IP.",
      ],
      missingProtections: [
        "No Kill Fee or guaranteed minimum retainer for scheduled development sprints.",
        "Missing explicit clause stating work acceptance criteria (e.g. deemed accepted after 5 business days).",
        "Absence of reciprocal limitation of liability protecting Contractor against lost client profits.",
        "No warranty disclaimer against unforeseen third-party cloud infrastructure downtime.",
      ],
      questionsForCounsel: [
        "Is the 24-month worldwide non-compete enforceable against an independent 1099 contractor in our jurisdiction?",
        "What is the standard Background IP reservation clause we can substitute into Section 2?",
        "Can we enforce prompt payment statutory protections to void the Net 90 Pay-When-Paid provision?",
      ],
    },
    disclaimer:
      "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
  },

  // 2b. Freelance MSA - CLIENT
  "freelance-msa_Client": {
    documentContext: {
      title: "Master Professional Services & Contractor Agreement",
      documentType: "Independent Contractor Agreement",
      analyzedPerspective: "Client",
      overallRiskScore: "LOW",
      executiveSummary:
        "For the Client, this contract provides commanding commercial control. The Pay-When-Paid clause preserves corporate working capital and prevents cash outflows before end-customer disbursements are secured. Broad IP assignments guarantee clean ownership for future venture capital due diligence.",
    },
    analyzedClauses: [
      {
        clauseId: "msa-sec-1",
        clauseTitle: "Payment Terms & Pay-When-Paid Provision",
        originalText:
          "Payment terms shall be Net 90 calendar days following Client's internal audit and receipt of funds from Client's end-customer ('Pay-When-Paid').",
        simplifiedText:
          "Guarantees that your firm only pays the contractor after your own customer pays you, preserving working capital.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Protects corporate cash flow by matching revenue timing to contractor expense outflows.",
        pageNumber: 1,
        recommendedAction:
          "Maintain the condition precedent, but monitor state prompt-pay regulations that may limit contingent contractor pay intervals.",
      },
      {
        clauseId: "msa-sec-2",
        clauseTitle: "Total IP Assignment & Work Made for Hire",
        originalText:
          "All code, software artifacts, architectures, documentation... exclusively owned by Client... without reservation of Contractor's pre-existing developer tooling.",
        simplifiedText:
          "Gives your company 100% clean, unencumbered ownership of all software deliverables, critical for investors and M&A audits.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Eliminates copyright ambiguity and secures all code assets needed for institutional funding or acquisition.",
        pageNumber: 1,
        recommendedAction:
          "Consider allowing a narrow carve-out for open-source libraries to avoid litigation over non-infringing third-party utilities.",
      },
      {
        clauseId: "msa-sec-3",
        clauseTitle: "Uncapped Indemnification & Code Liability",
        originalText:
          "Contractor shall defend, indemnify, and hold harmless Client... from any third-party claims, losses, or legal liabilities arising from Contractor's deliverables...",
        simplifiedText:
          "Ensures the contractor is financially responsible if their code infringes third-party patents or causes major system outages.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Shifts third-party legal liability onto the contractor and incentivizes diligent quality assurance.",
        pageNumber: 2,
        recommendedAction:
          "Require the contractor to maintain professional errors & omissions (E&O) and cyber liability insurance.",
      },
      {
        clauseId: "msa-sec-4",
        clauseTitle: "24-Month Restrictive Covenant",
        originalText:
          "For a duration of twenty-four (24) months following termination... Contractor shall not directly or indirectly provide consulting... to any company operating in the enterprise software...",
        simplifiedText:
          "Prevents the developer from taking your system insights and building competing software for your industry rivals.",
        perspectiveRiskLevel: "YELLOW",
        riskReasoning:
          "While protective, courts frequently invalidate overbroad 24-month global contractor non-competes. A blue-pencil court review could invalidate the clause.",
        pageNumber: 2,
        recommendedAction:
          "Narrow the restriction to direct competitors with whom Client competed in the preceding 12 months to increase legal enforceability.",
      },
      {
        clauseId: "msa-sec-5",
        clauseTitle: "Unilateral Termination for Convenience",
        originalText:
          "Client may terminate this Agreement... at any time, with or without cause, effective immediately upon electronic notice.",
        simplifiedText:
          "Allows you to end contractor engagements immediately if budget shifts or performance dips occur.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Maximizes enterprise agility and prevents long-term contractor retainers if product priorities pivot.",
        pageNumber: 2,
        recommendedAction:
          "Ensure termination notices are formally delivered via confirmed email and physical post to establish clean cutoff dates.",
      },
    ],
    lawyerConsultationPack: {
      criticalRedFlags: [
        "Risk that the 24-month global non-compete is ruled void under FTC or state worker protection laws.",
        "Potential misclassification claims if Client exercises excessive direction over independent contractor hours.",
      ],
      missingProtections: [
        "No explicit requirement for Contractor to hold minimum $1,000,000 E&O liability insurance policy.",
        "Missing data privacy and security compliance representations (SOC2, GDPR, CCPA).",
      ],
      questionsForCounsel: [
        "How can we redraft Section 4 as an enforceable non-disclosure and non-solicitation agreement rather than a blanket non-compete?",
        "Does our current workflow create any 1099 independent contractor misclassification exposure?",
      ],
    },
    disclaimer:
      "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
  },

  // 3. Employment Agreement - EMPLOYEE
  "employment-agreement_Employee": {
    documentContext: {
      title: "Executive Employment Agreement",
      documentType: "Executive Employment Contract",
      analyzedPerspective: "Employee",
      overallRiskScore: "HIGH",
      executiveSummary:
        "This agreement severely disadvantages the incoming Executive. While holding a high-stakes VP role, the executive is subject to strict at-will status without any severance guarantee or golden parachute. The broad inventions assignment claims works created during off-hours, while mandatory arbitration waives class action and public trial rights.",
    },
    analyzedClauses: [
      {
        clauseId: "emp-sec-1",
        clauseTitle: "At-Will Employment Without Severance",
        originalText:
          "Executive's employment is strictly at-will. Employer may terminate Executive's employment at any time, with or without cause, and without prior notice or severance compensation.",
        simplifiedText:
          "The company can fire you at any minute for no reason with zero days notice and zero severance payout, even after you relocate or give up your previous job.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Completely customary for junior roles, but unacceptable for an executive VP position where a 6-12 month severance parachute is standard industry practice.",
        pageNumber: 1,
        recommendedAction:
          "Negotiate a formal 'Termination Without Cause' provision granting six (6) to twelve (12) months base salary severance plus accelerated stock vesting.",
      },
      {
        clauseId: "emp-sec-2",
        clauseTitle: "Sweeping Off-Hours Inventions Assignment",
        originalText:
          "Executive agrees to assign and hereby assigns to Employer all inventions... regardless of whether developed during normal business hours or utilizing Employer equipment.",
        simplifiedText:
          "The company automatically owns everything you create in your private free time on weekends, even if you used your own computer and it's unrelated to the company.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Overreaches beyond state statutory protections (such as Cal. Lab. Code § 2870) and confiscates independent personal innovation.",
        pageNumber: 1,
        recommendedAction:
          "Incorporate a statutory carve-out for inventions developed entirely on personal time without company resources that do not relate to Employer's actual business.",
      },
      {
        clauseId: "emp-sec-3",
        clauseTitle: "18-Month Non-Compete & Non-Solicit",
        originalText:
          "During the term of employment and for eighteen (18) months thereafter, Executive shall not engage in any business activity or become employed by any organization competing directly or indirectly...",
        simplifiedText:
          "For a year and a half after leaving, you cannot work for any competitor in the United States, effectively freezing your executive career.",
        perspectiveRiskLevel: "RED",
        riskReasoning:
          "Dramatically hinders executive career mobility and post-departure market value without providing paid garden leave compensation.",
        pageNumber: 2,
        recommendedAction:
          "Eliminate the post-employment non-compete, or require full base salary continuation (garden leave) for the entire 18-month duration.",
      },
      {
        clauseId: "emp-sec-4",
        clauseTitle: "Mandatory Arbitration & Class Action Waiver",
        originalText:
          "Any dispute shall be resolved through confidential binding arbitration. Executive expressly waives any right to a jury trial or participation in class-action proceedings.",
        simplifiedText:
          "You give up your constitutional right to take the company to open court before a jury. All disputes are handled in secret arbitration.",
        perspectiveRiskLevel: "YELLOW",
        riskReasoning:
          "Confidential arbitration deprives the executive of public leverage and appellate review in discrimination, wrongful termination, or equity vesting disputes.",
        pageNumber: 2,
        recommendedAction:
          "Ensure Employer pays all arbitration filing fees and arbitrator retainers, with judicial review retained for equitable injunctive relief.",
      },
    ],
    lawyerConsultationPack: {
      criticalRedFlags: [
        "Executive termination without cause pays $0 severance and no COBRA continuation.",
        "Overreaching IP clause assigns personal inventions created outside working hours.",
        "18-month post-employment non-compete without paid garden leave.",
      ],
      missingProtections: [
        "No Double-Trigger Change of Control equity acceleration if company is acquired.",
        "Absence of Good Reason resignation rights (e.g., if duties, title, or compensation are reduced).",
        "No D&O (Directors & Officers) insurance coverage and indemnification agreement.",
      ],
      questionsForCounsel: [
        "What is the market standard severance package for a VP of Engineering in a series-funded technology startup?",
        "Does the blanket IP assignment violate state labor code protections for independent personal projects?",
        "How can we structure a separate D&O indemnification agreement before signing?",
      ],
    },
    disclaimer:
      "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
  },

  // 3b. Employment Agreement - EMPLOYER
  "employment-agreement_Employer": {
    documentContext: {
      title: "Executive Employment Agreement",
      documentType: "Executive Employment Contract",
      analyzedPerspective: "Employer",
      overallRiskScore: "LOW",
      executiveSummary:
        "This agreement provides comprehensive protection for the Employer. At-will status protects capital efficiency if performance targets are missed, comprehensive IP assignment insulates core technology assets, and non-solicitation prevents executive raiding of engineering talent.",
    },
    analyzedClauses: [
      {
        clauseId: "emp-sec-1",
        clauseTitle: "At-Will Employment Without Severance",
        originalText:
          "Executive's employment is strictly at-will. Employer may terminate Executive's employment at any time, with or without cause, and without prior notice or severance compensation.",
        simplifiedText:
          "Preserves maximum organizational flexibility to replace leadership without incurring mandatory severance expenses.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Protects startup runway and board governance flexibility if executive alignment fails.",
        pageNumber: 1,
        recommendedAction:
          "Be prepared for pushback during executive negotiation; offering 3-6 months severance for 'Without Cause' termination is standard to close top talent.",
      },
      {
        clauseId: "emp-sec-2",
        clauseTitle: "Inventions Assignment & IP Ownership",
        originalText:
          "Executive agrees to assign and hereby assigns to Employer all inventions... regardless of whether developed during normal business hours or utilizing Employer equipment.",
        simplifiedText:
          "Secures company ownership over all technical inventions, algorithms, and models developed during tenure.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Essential for institutional investors and patent portfolio defensibility.",
        pageNumber: 1,
        recommendedAction:
          "Attach an Exhibit A for 'Prior Inventions' to prevent future ownership disputes over pre-existing software tools.",
      },
      {
        clauseId: "emp-sec-3",
        clauseTitle: "Non-Competition & Non-Solicitation",
        originalText:
          "During the term of employment and for eighteen (18) months thereafter, Executive shall not engage in any business activity... competing directly or indirectly...",
        simplifiedText:
          "Protects proprietary company algorithms and prevents executive from poaching your key engineers or enterprise customers.",
        perspectiveRiskLevel: "YELLOW",
        riskReasoning:
          "Non-competes are void in California and facing nationwide FTC restrictions. Non-solicitation of clients is more readily enforceable.",
        pageNumber: 2,
        recommendedAction:
          "Strengthen the trade secret and customer non-solicitation provisions as primary defense lines against executive departures.",
      },
      {
        clauseId: "emp-sec-4",
        clauseTitle: "Mandatory Arbitration & Class Action Waiver",
        originalText:
          "Any dispute shall be resolved through confidential binding arbitration. Executive expressly waives any right to a jury trial...",
        simplifiedText:
          "Keeps employment disputes confidential and shields company from public courtroom exposure and runaway jury verdicts.",
        perspectiveRiskLevel: "GREEN",
        riskReasoning:
          "Minimizes PR damage and reduces the cost and duration of executive employment litigation.",
        pageNumber: 2,
        recommendedAction:
          "Ensure Employer pays all forum costs to avoid unconscionability challenges under state arbitration jurisprudence.",
      },
    ],
    lawyerConsultationPack: {
      criticalRedFlags: [
        "Enforceability risks regarding the 18-month non-compete in non-compete ban jurisdictions.",
      ],
      missingProtections: [
        "No Clawback policy for executive incentive bonuses in event of financial restatement.",
        "Missing clear definition of 'Cause' termination (felony, fraud, material neglect).",
      ],
      questionsForCounsel: [
        "How should our arbitration agreement be updated to comply with the federal Ending Forced Arbitration of Sexual Assault and Sexual Harassment Act?",
        "What non-solicitation covenants offer the highest enforceability in our headquarters state?",
      ],
    },
    disclaimer:
      "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
  },
};
