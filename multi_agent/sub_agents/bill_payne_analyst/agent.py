import textwrap
from typing import Annotated
from pydantic import BaseModel, Field
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
import json

class BillPayneModelAnalyst:
    """
    This class encapsulates the core logic for performing a Bill Payne Model analysis.
    It is designed to be independent of any specific agent framework.
    """

    def __init__(self, model: GenerativeModel):
        self.model = model

        # Define the key factors and weights of the Bill Payne Model
        self.factors = {
            "Management Team": {
                "description": "Strength, experience, and completeness of the management team.",
                "weight": 0.30,
            },
            "Size of Opportunity": {
                "description": "The scale of the market opportunity the startup is targeting.",
                "weight": 0.25,
            },
            "Product or Technology": {
                "description": "The strength, uniqueness, and defensibility of the product or technology.",
                "weight": 0.15,
            },
            "Competitive Environment": {
                "description": "The number and strength of competitors and the startup's competitive advantage.",
                "weight": 0.10,
            },
            "Marketing and Sales": {
                "description": "The clarity and viability of the go-to-market, marketing, and sales strategy.",
                "weight": 0.10,
            },
            "Need for Additional Investment": {
                "description": "The likelihood of needing more funding in the future.",
                "weight": 0.05,
            },
        }
        self.max_total_weight = sum(f["weight"] for f in self.factors.values())
        self.max_score_per_factor = 100

    def _evaluate_factor(self, factor_name: str, evidence: str) -> int:
        """Uses an LLM to evaluate the evidence and assign a score (0 to 100)."""
        if not evidence or not evidence.strip() or evidence == "{}":
            return 0

        factor_info = self.factors[factor_name]
        description = factor_info["description"]

        prompt = f"""
        You are an expert venture capital analyst using the Bill Payne valuation method.
        Your task is to compare a startup's provided evidence for a specific factor against a hypothetical 'average' startup in the same pre-revenue stage.

        Factor to evaluate: "{factor_name}"
        Description of the factor: "{description}"

        Evidence provided by the startup:
        ---
        {evidence}
        ---

        Please provide a comparative score from 0 to 100 based on the evidence:
        - 100: Exceptionally strong, far superior to an average startup.
        - 75: Very strong, significantly better than average.
        - 50: Average, what you would typically expect.
        - 25: Slightly below average or weak.
        - 0: Non-existent or completely irrelevant evidence.

        Respond with ONLY a JSON object containing the key "score" and your integer score as the value. For example: {{"score": 75}}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=GenerationConfig(temperature=0.0, response_mime_type="application/json"),
            )
            result = json.loads(response.text)
            return int(result.get("score", 0))
        except (ValueError, json.JSONDecodeError, AttributeError) as e:
            print(f"Error evaluating factor '{factor_name}': {e}")
            return 0

    def analyze_startup(self, team, opportunity, product, competition, marketing, funding_needs, avg_valuation):
        """
        Analyzes the startup based on the Bill Payne factors and generates a report.
        """
        ratings = {
            "Management Team": self._evaluate_factor("Management Team", team),
            "Size of Opportunity": self._evaluate_factor("Size of Opportunity", opportunity),
            "Product or Technology": self._evaluate_factor("Product or Technology", product),
            "Competitive Environment": self._evaluate_factor("Competitive Environment", competition),
            "Marketing and Sales": self._evaluate_factor("Marketing and Sales", marketing),
            "Need for Additional Investment": self._evaluate_factor("Need for Additional Investment", funding_needs),
        }

        # The total max weighted score is 100 (max_score_per_factor) * 1.0 (total_weight) = 100
        total_weighted_score = 0
        for factor, score in ratings.items():
            total_weighted_score += self.factors[factor]["weight"] * score

        # The valuation is the weighted score percentage of the average valuation.
        # A perfect score of 100 would yield 2.5x the average valuation.
        calculated_valuation = (total_weighted_score / self.max_score_per_factor) * avg_valuation * 2.5

        # --- Generate Markdown Report ---
        report = []
        report.append("# Bill Payne Method Startup Valuation")
        report.append("\n---\n")
        report.append("## Executive Summary")
        report.append(f"Based on an average pre-money valuation of **${avg_valuation:,.0f}** for similar companies, the calculated valuation for this startup is **${calculated_valuation:,.0f}**.")
        report.append(f"This is derived from a final weighted score of **{total_weighted_score:.2f} / 100**.")
        report.append("\n---\n")
        report.append("## Detailed Breakdown")
        report.append("| Factor                         | Weight | Score (0-100) | Weighted Score |")
        report.append("|--------------------------------|--------|---------------|----------------|")

        for factor, details in self.factors.items():
            score = ratings[factor]
            weighted_score = details['weight'] * score
            report.append(f"| {factor:<30} | {details['weight']:.2f}   | {score:<13} | {weighted_score:<14.2f} |")

        report.append("\n---\n")
        report.append("### Disclaimer")
        report.append(
            textwrap.dedent("""
            This valuation is a high-level estimate based on the Bill Payne scorecard method and the information provided.
            It is intended for pre-revenue companies and should not be considered a formal investment recommendation.
            Further due diligence is required for any investment decision.
            """)
        )

        return {
            "report": "\n".join(report),
            "calculated_valuation": calculated_valuation,
            "total_weighted_score": total_weighted_score,
        }

# --- ADK Implementation ---

class StartupDataPayne(BaseModel):
    """Input data for Bill Payne Model analysis."""
    team: Annotated[str, Field(description="Information about the management team.")]
    opportunity: Annotated[str, Field(description="The scale of the market opportunity.")]
    product: Annotated[str, Field(description="The strength and uniqueness of the product or technology.")]
    competition: Annotated[str, Field(description="The competitive environment and the startup's advantage.")]
    marketing: Annotated[str, Field(description="The go-to-market and sales strategy.")]
    funding_needs: Annotated[str, Field(description="The likelihood of needing more funding in the future.")]
    avg_valuation: Annotated[int, Field(description="The average pre-money valuation for similar pre-revenue startups in the same region and industry.")]

vertexai.init()
evaluation_llm = GenerativeModel("gemini-2.5-pro")
payne_analyst = BillPayneModelAnalyst(model=evaluation_llm)

def run_payne_analysis(startup_data: StartupDataPayne) -> dict[str, str | int | float]:
    """
    Performs a Bill Payne Model valuation analysis on pre-revenue startup data
    and returns a dictionary with the markdown report and the calculated valuation.
    """
    return payne_analyst.analyze_startup(
        team=startup_data.team,
        opportunity=startup_data.opportunity,
        product=startup_data.product,
        competition=startup_data.competition,
        marketing=startup_data.marketing,
        funding_needs=startup_data.funding_needs,
        avg_valuation=startup_data.avg_valuation
    )

payne_analysis_tool = FunctionTool(func=run_payne_analysis)

class PayneAnalystAgent(LlmAgent):
    """An agent that can perform a Bill Payne Model valuation analysis."""
    name: str = "bill_payne_analyst"
    model: str = "gemini-2.5-pro"
    instruction: str = "You are a venture capital analyst. Use your tools to analyze startups using the Bill Payne method."
    tools: list[FunctionTool] = [payne_analysis_tool]
