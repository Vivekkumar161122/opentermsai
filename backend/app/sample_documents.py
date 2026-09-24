from typing import List, Dict, Any
from app.schemas import PageText

SAMPLE_DOCUMENTS: Dict[str, Dict[str, Any]] = {
    "commercial-lease": {
        "id": "commercial-lease",
        "title": "Standard Commercial Property Lease Agreement",
        "documentType": "Commercial Lease Agreement",
        "defaultPerspective": "Tenant",
        "availablePerspectives": ["Tenant", "Landlord"],
        "description": "A tri-party commercial retail space lease with strict maintenance and indemnity covenants.",
        "pages": [
            PageText(
                pageNumber=1,
                text="""COMMERCIAL REAL ESTATE LEASE AGREEMENT
This Commercial Lease Agreement (the "Lease") is entered into as of October 1, 2024, by and between APEX COMMERCIAL HOLDINGS LLC ("Landlord"), and METRO INNOVATIONS INC. ("Tenant").

1. PREMISES & LEASE TERM
Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the commercial retail suite known as Unit 402, located at 850 Market Street, San Francisco, CA (the "Premises"). The term shall commence on November 1, 2024, and expire on October 31, 2029 (the "Term").

2. BASE RENT & PASS-THROUGH OPERATING EXPENSES
Tenant shall pay monthly base rent of $12,500.00 in advance on the first day of each month. In addition to base rent, Tenant shall pay 100% of all proportional Common Area Maintenance (CAM), property insurance increases, municipal taxes, and structural repairs as additional pass-through operating expenses without limitation or cap.

3. SECURITY DEPOSIT & FORFEITURE
Upon execution, Tenant shall deposit $37,500.00 as a Security Deposit. In the event of any minor default or rent delay exceeding 48 hours, Landlord reserves the absolute right to forfeit the entire security deposit as liquidated damages without itemized accounting."""
            ),
            PageText(
                pageNumber=2,
                text="""4. INDEMNIFICATION & THIRD-PARTY LIABILITY
Tenant covenants and agrees to defend, indemnify, and hold harmless Landlord, its agents, contractors, and affiliates from and against any and all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or related to any occurrence in or about the Premises, regardless of whether caused in part by Landlord's ordinary negligence. Tenant's liability under this section shall be uncapped and unconditional.

5. LANDLORD ENTRY & INSPECTION
Landlord, its agents, and prospective buyers or mortgagees may enter the Premises at any hour of the day or night, with or without prior notice to Tenant, to inspect the premises or exhibit the same, without abatement of rent or liability for disruption to Tenant's business operations.

6. TERMINATION, DEFAULT & CURE PERIOD
If Tenant fails to pay rent when due or breaches any covenant herein, Landlord may terminate this Lease immediately upon three (3) days written notice. Tenant expressly waives any statutory right to notice or redemption under state law. Upon termination, all remaining rent due for the balance of the 5-year term shall accelerate and become immediately payable."""
            ),
        ]
    },
    "freelance-msa": {
        "id": "freelance-msa",
        "title": "Master Professional Services & Contractor Agreement",
        "documentType": "Independent Contractor Agreement",
        "defaultPerspective": "Freelancer",
        "availablePerspectives": ["Freelancer", "Client"],
        "description": "A comprehensive software engineering contractor contract with restrictive covenants.",
        "pages": [
            PageText(
                pageNumber=1,
                text="""MASTER SERVICES AGREEMENT (INDEPENDENT CONTRACTOR)
This Master Services Agreement ("Agreement") is made between NEXUS GLOBAL VENTURES INC. ("Client") and JANE DOE CONSULTING ("Contractor").

1. SCOPE OF SERVICES & PAYMENT TERMS
Contractor agrees to perform cloud architecture and full-stack software development services. Client shall pay Contractor $135.00 per hour. Invoicing shall occur monthly, and payment terms shall be Net 90 calendar days following Client's internal audit and receipt of funds from Client's end-customer ("Pay-When-Paid"). Contractor shall not be entitled to interest on late disbursements.

2. INTELLECTUAL PROPERTY & WORK MADE FOR HIRE
All code, software artifacts, architectures, documentation, and inventions conceived or created by Contractor during the term of this Agreement shall constitute a 'Work Made for Hire' exclusively owned by Client. Contractor hereby irrevocably assigns all right, title, interest, copyright, and patent rights worldwide, without reservation of Contractor's pre-existing developer tooling or background libraries."""
            ),
            PageText(
                pageNumber=2,
                text="""3. INDEMNIFICATION & THIRD-PARTY LIABILITY
Contractor shall defend, indemnify, and hold harmless Client and its officers, directors, and customers from any third-party claims, losses, or legal liabilities arising from Contractor's deliverables, code defects, or performance. Contractor's indemnification obligations shall be unlimited and not subject to any limitation of liability or fee cap.

4. NON-COMPETE & RESTRICTIVE COVENANTS
For a duration of twenty-four (24) months following termination of this Agreement, Contractor shall not directly or indirectly provide consulting, software development, or advisory services to any company operating in the enterprise software, cloud infrastructure, or fintech domains worldwide.

5. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement or any Statement of Work at any time, with or without cause, effective immediately upon electronic notice. Contractor may only terminate upon sixty (60) days advance written notice for material uncured breach."""
            ),
        ]
    },
    "employment-agreement": {
        "id": "employment-agreement",
        "title": "Executive Employment Agreement",
        "documentType": "Employment Agreement",
        "defaultPerspective": "Employee",
        "availablePerspectives": ["Employee", "Employer"],
        "description": "Senior technology leadership employment contract with restrictive covenants and IP assignment.",
        "pages": [
            PageText(
                pageNumber=1,
                text="""EXECUTIVE EMPLOYMENT AGREEMENT
This Executive Employment Agreement is made between STRATOS AI CORP. ("Employer") and ALEX MERCER ("Executive").

1. POSITION, DUTIES & AT-WILL STATUS
Executive shall serve as Vice President of Engineering. Executive's employment is strictly at-will. Employer may terminate Executive's employment at any time, with or without cause, and without prior notice or severance compensation.

2. INVENTIONS ASSIGNMENT & INTELLECTUAL PROPERTY
Executive agrees to assign and hereby assigns to Employer all inventions, discoveries, software code, algorithm designs, and copyrightable works created during Executive's tenure, regardless of whether developed during normal business hours or utilizing Employer equipment."""
            ),
            PageText(
                pageNumber=2,
                text="""3. NON-COMPETITION & NON-SOLICITATION
During the term of employment and for eighteen (18) months thereafter, Executive shall not engage in any business activity or become employed by any organization competing directly or indirectly with Employer. Executive further agrees not to solicit any employee or customer of Employer for two (2) years post-termination.

4. GOVERNING LAW & MANDATORY ARBITRATION WAIVER
This Agreement shall be governed by Delaware law. Any dispute shall be resolved through confidential binding arbitration. Executive expressly waives any right to a jury trial or participation in class-action proceedings."""
            ),
        ]
    }
}
