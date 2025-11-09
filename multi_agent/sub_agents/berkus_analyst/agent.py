import textwrap
from typing import Annotated
from pydantic import BaseModel, Field
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
import json

class BerkusModelAnalyst:
    """
    This class encapsulates the core logic for performing a Berkus Model analysis.
    It is designed to be independent of any specific agent framework.
    """

    def __init__(self, model: GenerativeModel):
        self.model = model

        # Define the five key factors of the Berkus Model and their max values
        self.factors = [
            "Sound Idea",
            "Prototype",
            "Quality Management Team",
            "Strategic Relationships",
            "Product Rollout or Sales"
        ]
        self.max_score_per_factor = 20
        self.max_total_score = 100

    def _evaluate_factor(self, factor_name: str, evidence: str) -> int:
        """
        Analyzes a single Berkus Model factor and assigns a score (0-100)
        based strictly on the provided data.
        """
        if not evidence or not evidence.strip() or evidence == "{}":
            return 0

        prompt = f"""
        You are an expert venture capital analyst. Your task is to evaluate a startup based on one of the five factors of the Berkus Model.

        Factor to evaluate: "{factor_name}"
        Maximum possible score for this factor: {self.max_score_per_factor}

        Evidence provided by the startup for this factor:
        ---
        {evidence}
        ---

        Based on the evidence, please provide a score from 0 to {self.max_score_per_factor}.
        A score of 0 means the evidence is non-existent, irrelevant, or extremely weak.
        A score of {self.max_score_per_factor} means the evidence is exceptionally strong and convincing.

        Respond with ONLY a JSON object containing the key "score" and your integer score as the value. For example: {{"score": 80}}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=GenerationConfig(temperature=0.0, response_mime_type="application/json")
            )
            result = json.loads(response.text)
            return int(result.get("score", 0))
        except (ValueError, json.JSONDecodeError, AttributeError) as e:
            print(f"Error evaluating factor '{factor_name}': {e}")
            return 0

    def analyze_startup(
        self, idea: str, prototype: str, team: str, relationships: str, sales_plan: str
    ) -> dict[str, str | int]:
        """
        Calculates the Berkus Model score and generates the final report.
        """
        scores = {
            "Sound Idea": self._evaluate_factor("Sound Idea", idea),
            "Prototype": self._evaluate_factor("Prototype", prototype),
            "Quality Management Team": self._evaluate_factor("Quality Management Team", team),
            "Strategic Relationships": self._evaluate_factor("Strategic Relationships", relationships),
            "Product Rollout or Sales": self._evaluate_factor("Product Rollout or Sales", sales_plan),
        }

        total_score = sum(scores.values())

        # Format the Final Report
        report = []
        report.append("# Berkus Model Startup Analysis")
        report.append("\n---\n")
        report.append("## Executive Summary")
        report.append(f"**Total Score: {total_score:.0f}/{self.max_total_score}**")
        report.append("This score is based on an assessment of five key risk factors for a pre-revenue company.")
        report.append("\n---\n")
        report.append("## Detailed Breakdown")
        report.append("| Factor                    | Max Score | Assigned Score |")
        report.append("|---------------------------|-----------|----------------|")

        for factor in self.factors:
            assigned = scores[factor]
            report.append(f"| {factor:<30} | {self.max_score_per_factor:<9} | {assigned:<14} |")

        report.append("\n---\n")
        report.append("### Disclaimer")
        report.append(
            textwrap.dedent("""
            This valuation is a high-level estimate based on the Berkus Model and the information provided.
            It is intended for pre-revenue companies and should not be considered a formal investment recommendation.
            Further due diligence is required for any investment decision.
            """)
        )

        return {
            "report": "\n".join(report),
            "total_score": total_score,
            "factor_scores": scores,
        }

# --- ADK v1.17.0 Implementation ---

class StartupData(BaseModel):
    """Input data for Berkus Model analysis."""
    idea: Annotated[str, Field(description="Description of the startup's idea.")]
    prototype: Annotated[str, Field(description="Details about the current prototype.")]
    team: Annotated[str, Field(description="Information about the management team.")]
    relationships: Annotated[str, Field(description="Strategic relationships the startup has.")]
    sales_plan: Annotated[str, Field(description="The product rollout or sales plan.")]

vertexai.init()
evaluation_llm = GenerativeModel("gemini-2.5-pro")
berkus_analyst = BerkusModelAnalyst(model=evaluation_llm)

def run_berkus_analysis(startup_data: StartupData) -> dict[str, str | int | dict]:
    """
    Performs a Berkus Model valuation analysis on pre-revenue startup data
    and returns a dictionary with the markdown report and the total score.
    """
    return berkus_analyst.analyze_startup(
        idea=startup_data.idea,
        prototype=startup_data.prototype,
        team=startup_data.team,
        relationships=startup_data.relationships,
        sales_plan=startup_data.sales_plan
    )

berkus_analysis_tool = FunctionTool(func=run_berkus_analysis)

class BerkusAnalystAgent(LlmAgent):
    """
    An agent that can perform a Berkus Model valuation analysis.
    """
    name: str = "berkus_analyst"
    model: str = "gemini-2.5-pro"
    instruction: str = "You are a venture capital analyst. Use your tools to analyze startups using the Berkus method."
    tools: list[FunctionTool] = [berkus_analysis_tool]
