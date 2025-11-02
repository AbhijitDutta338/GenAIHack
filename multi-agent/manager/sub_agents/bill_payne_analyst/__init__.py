from .agent import PayneAnalystAgent

# The ADK framework looks for an object named `root_agent` in your package's
# __init__.py to know which agent to run.
root_agent = PayneAnalystAgent()
