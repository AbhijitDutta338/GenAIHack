from .agent import BerkusAnalystAgent

# The ADK framework looks for an object named `root_agent` in a package's
# __init__.py. By defining it here, this agent could be run directly,
# but in our new structure, the top-level __init__.py is the main entry point.
root_agent = BerkusAnalystAgent()
