"""
Kairos + LangChain Integration

Automatically traces any LangChain chain, agent, or tool.
Drop-in: add KairosCallbackHandler to any existing LangChain code.

pip install kairos-trace langchain langchain-openai
"""

from typing import Any, Dict, List, Optional, Union
from langchain.callbacks.base import BaseCallbackHandler
from langchain_core.messages import BaseMessage
from langchain_core.outputs import LLMResult
from kairos import create_kairos


class KairosCallbackHandler(BaseCallbackHandler):
    """
    LangChain callback handler that records execution to Kairos.

    Usage:
        from langchain_openai import ChatOpenAI
        from kairos_langchain import KairosCallbackHandler

        handler = KairosCallbackHandler(workflow_name="my-agent")
        llm = ChatOpenAI(callbacks=[handler])

        # Every chain/agent run is automatically recorded and replayable.
    """

    def __init__(self, workflow_name: str = "langchain-agent", agent_id: Optional[str] = None):
        self._kairos = create_kairos()
        self._workflow_name = workflow_name
        self._agent_id = agent_id
        self._exec = None
        self._tool_start_times: Dict[str, float] = {}

    def on_chat_model_start(self, serialized: Dict, messages: List[List[BaseMessage]], **kwargs) -> None:
        import time
        if self._exec is None:
            self._exec = self._kairos.execution(
                workflow_name=self._workflow_name,
                agent_id=self._agent_id,
            )
        self._llm_start = time.time()
        model = serialized.get("id", ["unknown"])[-1]
        prompt = " ".join(m.content for msgs in messages for m in msgs if hasattr(m, "content"))
        self._exec.set_prompt(prompt[:500], model=model)

    def on_llm_start(self, serialized: Dict, prompts: List[str], **kwargs) -> None:
        import time
        if self._exec is None:
            self._exec = self._kairos.execution(workflow_name=self._workflow_name)
        self._llm_start = time.time()
        model = serialized.get("id", ["unknown"])[-1]
        self._exec.set_prompt(prompts[0][:500] if prompts else "", model=model)

    def on_llm_end(self, response: LLMResult, **kwargs) -> None:
        import time
        if self._exec is None:
            return
        latency = int((time.time() - getattr(self, "_llm_start", time.time())) * 1000)
        usage = getattr(response, "llm_output", {}) or {}
        token_usage = usage.get("token_usage", {})
        if token_usage:
            self._exec.set_tokens(
                prompt_tokens=token_usage.get("prompt_tokens", 0),
                completion_tokens=token_usage.get("completion_tokens", 0),
            )

    def on_tool_start(self, serialized: Dict, input_str: str, **kwargs) -> None:
        import time
        self._tool_start_times[serialized.get("name", "tool")] = time.time()

    def on_tool_end(self, output: str, **kwargs) -> None:
        import time
        if self._exec is None:
            return
        tool_name = kwargs.get("name", "tool")
        start = self._tool_start_times.pop(tool_name, time.time())
        latency = int((time.time() - start) * 1000)
        self._exec.tool_call(
            tool_name,
            input={"input": kwargs.get("input", "")},
            output={"output": str(output)[:500]},
            latency_ms=latency,
        )

    def on_agent_action(self, action: Any, **kwargs) -> None:
        if self._exec is None:
            return
        self._exec.decision(
            reasoning=f"Action: {action.tool} — {str(action.tool_input)[:200]}",
            confidence=0.9,
        )

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs) -> None:
        if self._exec is None:
            return
        output = str(outputs.get("output", outputs))[:500]
        self._exec.complete(output)
        self._exec = None  # Reset for next chain

    def on_chain_error(self, error: Union[Exception, KeyboardInterrupt], **kwargs) -> None:
        if self._exec is None:
            return
        self._exec.fail(str(error))
        self._exec = None


# ── Example usage ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    from langchain_openai import ChatOpenAI
    from langchain.agents import AgentExecutor, create_openai_tools_agent
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.tools import tool

    @tool
    def search(query: str) -> str:
        """Search the web for information."""
        return f"Results for: {query}"

    handler = KairosCallbackHandler(workflow_name="research-agent")

    llm = ChatOpenAI(model="gpt-4o-mini", callbacks=[handler])
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant."),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_openai_tools_agent(llm, [search], prompt)
    executor = AgentExecutor(agent=agent, tools=[search], callbacks=[handler])

    result = executor.invoke({"input": "What is the EU AI Act?"})
    print(result["output"])
    print("\nExecution recorded. Open your Kairos dashboard to replay it.")
    print("https://withkairos.dev/app")
