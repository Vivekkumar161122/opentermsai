import pytest
from app.services.risk_agent import risk_agent
from app.services.orchestrator import orchestrator
from app.schemas import PageText, FullAnalysisOutput
from app.config import LEGAL_DISCLAIMER

def test_risk_agent_flips_non_compete():
    """
    Test requirement from SDLC Phase 5:
    Ensure the riskAgent successfully flips risk scores (RED to GREEN)
    when the same clause is analyzed from opposing perspectives (Employee vs. Employer).
    """
    clause_title = "Non-Compete & Restrictive Covenants"
    clause_text = (
        "During the term of employment and for twenty-four (24) months thereafter, "
        "the individual shall not directly or indirectly engage in any business competing "
        "with the company within the continental United States."
    )

    # 1. Perspective: Employee
    employee_eval = risk_agent.evaluate_clause_offline(clause_title, clause_text, "Employee")
    assert employee_eval["level"] == "RED", f"Expected RED for Employee, got {employee_eval['level']}"
    assert "restrictions on Employee's ability to earn a living" in employee_eval["reasoning"]

    # 2. Perspective: Employer (Opposing role)
    employer_eval = risk_agent.evaluate_clause_offline(clause_title, clause_text, "Employer")
    assert employer_eval["level"] == "GREEN", f"Expected GREEN for Employer, got {employer_eval['level']}"
    assert "Safeguards company" in employer_eval["reasoning"]

def test_risk_agent_flips_indemnification():
    """
    Ensures uncapped indemnification flips from RED for Freelancer to GREEN for Client.
    """
    clause_title = "Indemnification & Third-Party Liability"
    clause_text = (
        "Contractor agrees to defend, indemnify, and hold harmless Client from any and all "
        "third-party claims, liabilities, damages, and defense costs without any liability cap or fee limitation."
    )

    freelancer_eval = risk_agent.evaluate_clause_offline(clause_title, clause_text, "Freelancer")
    assert freelancer_eval["level"] == "RED", f"Expected RED for Freelancer, got {freelancer_eval['level']}"

    client_eval = risk_agent.evaluate_clause_offline(clause_title, clause_text, "Client")
    assert client_eval["level"] == "GREEN", f"Expected GREEN for Client, got {client_eval['level']}"

def test_risk_agent_flips_lease_entry():
    """
    Ensures Landlord entry without notice flips from RED for Tenant to GREEN for Landlord.
    """
    clause_title = "Termination, Default & Entry"
    clause_text = (
        "Landlord may enter the premises at any hour without notice and terminate immediately upon default "
        "without cause or right to cure."
    )

    tenant_eval = risk_agent.evaluate_clause_offline(clause_title, clause_text, "Tenant")
    assert tenant_eval["level"] == "RED", f"Expected RED for Tenant, got {tenant_eval['level']}"

    landlord_eval = risk_agent.evaluate_clause_offline(clause_title, clause_text, "Landlord")
    assert landlord_eval["level"] == "GREEN", f"Expected GREEN for Landlord, got {landlord_eval['level']}"

def test_orchestrator_schema_compliance_and_disclaimer():
    """
    Validates end-to-end output against strict Pydantic FullAnalysisOutput schema
    and confirms the presence of the mandatory legal disclaimer.
    """
    raw_text = """COMMERCIAL LEASE
Section 1: Payment Terms
Tenant pays $5,000 monthly.
Section 2: Indemnification & Third-Party Liability
Tenant indemnifies Landlord uncapped for all claims.
Section 3: Termination, Default & Cure Period
Landlord can terminate with zero days notice without cause."""

    pages = [PageText(pageNumber=1, text=raw_text)]
    output = orchestrator.analyze_document(
        raw_text=raw_text,
        pages=pages,
        perspective="Tenant",
        doc_title="Commercial Lease Test",
        doc_type="Commercial Lease Agreement"
    )

    assert isinstance(output, FullAnalysisOutput)
    assert output.documentContext.analyzedPerspective == "Tenant"
    assert output.documentContext.overallRiskScore in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert len(output.analyzedClauses) > 0
    assert len(output.lawyerConsultationPack.criticalRedFlags) > 0
    assert output.disclaimer == LEGAL_DISCLAIMER
