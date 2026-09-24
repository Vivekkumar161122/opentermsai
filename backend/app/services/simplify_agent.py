import logging

logger = logging.getLogger(__name__)

class SimplifyAgent:
    """
    Translation Agent (simplifyAgent):
    Converts complex legal jargon, archaic phrasing, and dense clauses
    into clean, 8th-grade readability level summaries.
    """

    SYSTEM_INSTRUCTION = """You are OpenTerms AI's Translation & Simplification Agent (simplifyAgent).
Your objective is to translate dense legalese into crystal-clear, plain English at an 8th-grade reading level.

CRITICAL INSTRUCTIONS:
1. No legal Latin or jargon (e.g. replace 'inter alia', 'indemnify', 'liquidated damages' with plain everyday terms).
2. Use active voice and simple, direct sentences.
3. Be concise: summarize the exact legal effect in 2 to 4 clear sentences.
4. Ground strictly in the original clause text—never invent obligations not present in the excerpt.
"""

    def build_simplify_prompt(self, clause_title: str, original_text: str) -> str:
        return f"""Translate the following contract clause into simple, 8th-grade level English:

Clause Title: {clause_title}
Original Legalese:
\"\"\"{original_text}\"\"\"

Provide only the simplified explanation:"""

    def simplify_offline(self, clause_title: str, text: str) -> str:
        """Rule-based 8th-grade simplified summaries for standard clause archetypes."""
        t_lower = text.lower()
        title_lower = clause_title.lower()

        if "non-compete" in title_lower or "non-compete" in t_lower:
            return (
                "You are forbidden from working for any competing company or starting a similar business "
                "for a specified period after leaving. This limits your career options unless revised."
            )
        elif "indemnif" in title_lower or "hold harmless" in t_lower:
            return (
                "If someone sues the other party over work related to this agreement, you have to pay all their legal fees, "
                "settlements, and court damages out of your own pocket."
            )
        elif "intellectual property" in title_lower or "work made for hire" in title_lower or "inventions" in t_lower:
            return (
                "Everything you write, design, or create under this contract immediately belongs to the other party. "
                "You cannot reuse your own code or designs without written permission unless specifically carved out."
            )
        elif "termination" in title_lower:
            return (
                "This explains how and when each party can end the contract. It spells out whether advance notice is required "
                "and what happens to unpaid money or ongoing duties."
            )
        elif "security deposit" in title_lower:
            return (
                "This details how much money is held as a security deposit, under what conditions the landlord can keep it, "
                "and how many days after moving out they must return whatever is left."
            )
        elif "payment" in title_lower or "rent" in title_lower:
            return (
                "This outlines exactly when money is due, how invoices must be paid, and whether extra fees apply if payment is late."
            )
        elif "confidential" in title_lower:
            return (
                "Both parties agree to keep private business details secret and not share customer, financial, or technical secrets with outside parties."
            )
        else:
            return (
                f"This section ({clause_title}) sets ground rules for mutual duties, standards of conduct, "
                "and how disagreements must be handled under the law."
            )

simplify_agent = SimplifyAgent()
