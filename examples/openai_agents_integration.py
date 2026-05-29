"""
Kairos + OpenAI Agents SDK Integration

Traces any OpenAI agent automatically.

pip install kairos-sdk openai-agents
"""

import time
from openai.agents import Agent, Runner, function_tool
from kairos import create_kairos


def kairos_trace(workflow_name: str = "openai-agent"):
    """
    Decorator that wraps an OpenAI Agents Runner to record execution to Kairos.

    Usage:
        runner = Runner(agent)
        with KairosTracer(runner, workflow_name="my-agent") as tracer:
            result = tracer.run("What is the EU AI Act?")
    """

    class KairosTracer:
        def __init__(self, runner: Runner, name: str):
            self._runner = runner
            self._name = name
            self._kairos = create_kairos()
            self._exec = None

        def __enter__(self):
            self._exec = self._kairos.execution(workflow_name=self._name)
            return self

        def run(self, prompt: str, **kwargs):
            if self._exec:
                self._exec.set_prompt(prompt)
            start = time.time()
            result = self._runner.run(prompt, **kwargs)
            latency = int((time.time() - start) * 1000)

            if self._exec:
                output = getattr(result, "final_output", str(result))
                self._exec.complete(str(output)[:500])
            return result

        def __exit__(self, exc_type, exc_val, exc_tb):
            if exc_type and self._exec:
                self._exec.fail(str(exc_val))
            return False

    return KairosTracer

# ── Example ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":

    @function_tool
    def search_web(query: str) -> str:
        """Search the web for information."""
        return f"Search results for: {query}"

    agent = Agent(
        name="Research Agent",
        instructions="You are a helpful research assistant.",
        tools=[search_web],
    )

    runner = Runner(agent)
    Tracer = kairos_trace()

    with Tracer(runner, workflow_name="research-agent") as tracer:
        result = tracer.run("What is the EU AI Act and what are its key requirements?")
        print(result.final_output)

    print("\nReplay this execution at: https://kairos-web-lyart.vercel.app/app")
