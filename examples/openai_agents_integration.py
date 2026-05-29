"""
Kairos + OpenAI Agents SDK Integration

Traces any OpenAI agent automatically — prompts, tool calls, decisions, failures.

pip install kairos-trace openai-agents
"""

import time
from contextlib import contextmanager
from kairos import create_kairos


@contextmanager
def kairos_trace(workflow_name: str = "openai-agent"):
    """
    Context manager that records an OpenAI agent run to Kairos.

    Usage:
        with kairos_trace("my-agent") as tracer:
            result = await Runner.run(agent, "What is the EU AI Act?")
            tracer.record_result(result)
    """
    kairos = create_kairos()
    exec_ = kairos.execution(workflow_name=workflow_name)
    try:
        yield _KairosRunRecorder(exec_)
    except Exception as e:
        exec_.fail(str(e))
        raise


class _KairosRunRecorder:
    def __init__(self, exec_):
        self._exec = exec_

    def record_prompt(self, prompt: str, model: str | None = None):
        self._exec.set_prompt(prompt, model)

    def record_tool(self, name: str, input=None, output=None, latency_ms: int | None = None):
        self._exec.tool_call(name, input=input, output=output, latency_ms=latency_ms)

    def record_result(self, result, output_attr: str = "final_output"):
        output = getattr(result, output_attr, str(result))
        self._exec.complete(str(output)[:500])

    def fail(self, error: str):
        self._exec.fail(error)


# ── Hook-based integration (recommended for tool call visibility) ─────────────

def make_kairos_hooks(workflow_name: str = "openai-agent"):
    """
    Returns an AgentHooks instance that records every step to Kairos.

    Usage:
        from openai.agents import AgentHooks
        hooks = make_kairos_hooks("research-agent")
        result = await Runner.run(agent, prompt, hooks=hooks)
    """
    from openai.agents import AgentHooks

    kairos = create_kairos()
    exec_ = kairos.execution(workflow_name=workflow_name)
    _tool_starts: dict[str, float] = {}

    class KairosHooks(AgentHooks):
        async def on_start(self, context, agent):
            exec_.set_prompt(str(context.input) if hasattr(context, "input") else "")

        async def on_tool_start(self, context, agent, tool):
            _tool_starts[tool.name] = time.time()

        async def on_tool_end(self, context, agent, tool, result):
            latency = int((time.time() - _tool_starts.pop(tool.name, time.time())) * 1000)
            exec_.tool_call(
                name=tool.name,
                input=getattr(tool, "input", None),
                output=str(result)[:500],
                latency_ms=latency,
            )

        async def on_end(self, context, agent, output):
            exec_.complete(str(output)[:500])

    return KairosHooks()


# ── Example ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import asyncio
    from openai.agents import Agent, Runner, function_tool

    @function_tool
    def search_web(query: str) -> str:
        """Search the web for information."""
        return f"Search results for: {query}"

    agent = Agent(
        name="Research Agent",
        instructions="You are a helpful research assistant.",
        tools=[search_web],
    )

    async def main():
        # Option A: context manager (simple)
        with kairos_trace("research-agent") as tracer:
            tracer.record_prompt("What is the EU AI Act?")
            result = await Runner.run(agent, "What is the EU AI Act?")
            tracer.record_result(result)
            print(result.final_output)

        # Option B: hooks (full tool call visibility)
        hooks = make_kairos_hooks("research-agent-hooks")
        result = await Runner.run(agent, "Summarize the EU AI Act.", hooks=hooks)
        print(result.final_output)

        print("\nReplay at: https://withkairos.dev/app")

    asyncio.run(main())
