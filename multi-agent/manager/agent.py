import asyncio
from typing import Annotated

from google.adk.agents import LlmAgent
from google.adk.tools import AgentTool, FunctionTool, ToolContext
from pydantic import BaseModel, Field

from .sub_agents.berkus_analyst.agent import BerkusAnalystAgent
from .sub_agents.bill_payne_analyst.agent import PayneAnalystAgent
from .sub_agents.berkus_analyst.agent import StartupData as StartupDataBerkus
from .sub_agents.bill_payne_analyst.agent import StartupDataPayne

# Instantiate specialist agents
# NOTE: The specialist agents will inherit credentials from the root_agent at runtime.
berkus_agent = BerkusAnalystAgent()
payne_agent = PayneAnalystAgent()

# Create a dictionary of tools for easy lookup by name.
agent_tools = {
    "berkus_analyst": AgentTool(agent=berkus_agent),
    "bill_payne_analyst": AgentTool(agent=payne_agent),
}

root_agent = LlmAgent(
    name="manager",
    model="gemini-2.5-pro",
    description="Manager agent that routes valuation requests to specialist agents (Berkus and Bill Payne).",
    # The LlmAgent expects a list of tools.
    tools=list(agent_tools.values()),
)


class FullStartupData(BaseModel):
    """Comprehensive startup data for both Berkus and Bill Payne valuation models."""
    idea: Annotated[str, Field(description="Description of the startup's core idea.")]
    prototype: Annotated[str, Field(description="Details about the working prototype.")]
    team: Annotated[str, Field(description="Information about the management team.")]
    relationships: Annotated[str, Field(description="Strategic relationships the startup has.")]
    sales_plan: Annotated[str, Field(description="The sales and marketing plan.")]
    opportunity: Annotated[str, Field(description="The scale of the market opportunity.")]
    competition: Annotated[str, Field(description="The competitive environment.")]
    funding_needs: Annotated[str, Field(description="The likelihood of needing more funding.")]
    avg_valuation: Annotated[int, Field(description="Average pre-money valuation for similar startups.")]


async def run_full_valuation(startup_data: FullStartupData, tool_context: ToolContext) -> dict:
    """
    Performs a comprehensive startup valuation by running both the Berkus and Bill Payne models in parallel.
    """
    berkus_input = StartupDataBerkus(
        idea=startup_data.idea,
        prototype=startup_data.prototype,
        team=startup_data.team,
        relationships=startup_data.relationships,
        sales_plan=startup_data.sales_plan
    )

    payne_input = StartupDataPayne(
        team=startup_data.team,
        opportunity=startup_data.opportunity,
        product=startup_data.prototype, # Payne's 'product' maps to Berkus' 'prototype'
        competition=startup_data.competition,
        marketing=startup_data.sales_plan, # Payne's 'marketing' maps to Berkus' 'sales_plan'
        funding_needs=startup_data.funding_needs,
        avg_valuation=startup_data.avg_valuation
    )

    # Run both analyses concurrently
    # We need to call the specific tool within each agent, not the AgentTool wrapper.
    # The tool within BerkusAnalystAgent is likely named 'berkus_analysis_tool'.
    # The tool within PayneAnalystAgent is named 'payne_analysis_tool'.
    berkus_tool = berkus_agent.tools[0] # Assuming it's the first and only tool
    payne_tool = payne_agent.tools[0]   # Assuming it's the first and only tool

    berkus_task = berkus_tool.run_async(args={"startup_data": berkus_input}, tool_context=tool_context)
    payne_task = payne_tool.run_async(args={"startup_data": payne_input}, tool_context=tool_context)

    berkus_result, payne_result = await asyncio.gather(berkus_task, payne_task)

    # Combine the reports
    combined_report = (
        f"# Comprehensive Startup Valuation Analysis\n\n"
        f"{berkus_result.get('report', 'Berkus analysis failed.')}\n\n"
        f"---\n\n"
        f"{payne_result.get('report', 'Bill Payne analysis failed.')}"
    )

    # Construct the JSON response with scores
    scores_json = {
        "berkus_model": {
            "total_score_out_of_100": berkus_result.get("total_score"),
            "factor_scores": berkus_result.get("factor_scores"),
        },
        "bill_payne_model": {
            "total_weighted_score_out_of_100": payne_result.get("total_weighted_score"),
            "calculated_valuation": payne_result.get("calculated_valuation"),
        }
    }

    return {"report": combined_report, "scores": scores_json}


# Add the new combined tool to the root agent's tools
agent_tools["run_full_valuation"] = FunctionTool(func=run_full_valuation)
root_agent.tools = list(agent_tools.values())

# Update the root agent's instruction to use the new tool
root_agent.instruction = """
You are a manager agent responsible for delegating startup valuation requests.
- If the user asks for a "full", "comprehensive", or "combined" valuation, or mentions both "Berkus" and "Bill Payne", use the `run_full_valuation` tool.
- If the user requests only a Berkus model valuation, use the `berkus_analyst` tool.
- If the user requests only a Bill Payne style valuation, use the `bill_payne_analyst` tool.
"""
