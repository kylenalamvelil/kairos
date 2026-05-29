"""
Kairos + LangGraph Integration

Records every node execution, tool call, and state transition in a LangGraph agent.

pip install kairos-sdk langgraph langchain-openai
"""

import time
from typing import Any
from kairos import create_kairos


class KairosLangGraphTracer:
    """
    Wraps a LangGraph StateGraph to record every node and edge to Kairos.

    Usage:
        tracer = KairosLangGraphTracer(workflow_name="my-graph")
        app = tracer.wrap(graph.compile())
        result = app.invoke({"messages": [...]})
    """

    def __init__(self, workflow_name: str = "langgraph-agent"):
        self._workflow_name = workflow_name
        self._kairos = create_kairos()
        self._exec = None

    def wrap(self, compiled_graph):
        exec_ = self._kairos.execution(workflow_name=self._workflow_name)
        self._exec = exec_

        original_invoke = compiled_graph.invoke
        original_stream = compiled_graph.stream

        tracer = self

        def traced_invoke(input_state, config=None, **kwargs):
            exec_.set_prompt(str(input_state)[:500])
            start = time.time()
            try:
                result = original_invoke(input_state, config, **kwargs)
                latency = int((time.time() - start) * 1000)
                exec_.event("graph_completed", {"output": str(result)[:500], "latency_ms": latency})
                exec_.complete(str(result)[:500])
                return result
            except Exception as e:
                exec_.fail(str(e))
                raise

        def traced_stream(input_state, config=None, **kwargs):
            exec_.set_prompt(str(input_state)[:500])
            node_starts: dict[str, float] = {}
            chunks = []

            for chunk in original_stream(input_state, config, **kwargs):
                for node_name, node_output in chunk.items():
                    latency = int((time.time() - node_starts.get(node_name, time.time())) * 1000)
                    exec_.event("node_executed", {
                        "node": node_name,
                        "output": str(node_output)[:300],
                        "latency_ms": latency,
                    })
                chunks.append(chunk)
                yield chunk

            exec_.complete(str(chunks[-1])[:500] if chunks else None)

        compiled_graph.invoke = traced_invoke
        compiled_graph.stream = traced_stream
        return compiled_graph

    def record_tool(self, name: str, input: Any = None, output: Any = None, latency_ms: int | None = None):
        if self._exec:
            self._exec.tool_call(name, input=input, output=output, latency_ms=latency_ms)


def kairos_node(node_fn, workflow_name: str = "langgraph-agent"):
    """
    Decorator for individual LangGraph nodes.

    Usage:
        @kairos_node
        def call_model(state):
            ...
    """
    kairos = create_kairos()
    exec_ = kairos.execution(workflow_name=workflow_name)

    def wrapped(state):
        start = time.time()
        try:
            result = node_fn(state)
            latency = int((time.time() - start) * 1000)
            exec_.event("node_executed", {
                "node": node_fn.__name__,
                "latency_ms": latency,
            })
            return result
        except Exception as e:
            exec_.fail(str(e))
            raise

    return wrapped


# ── Example ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    from typing import Annotated, TypedDict
    from langgraph.graph import StateGraph, END
    from langgraph.prebuilt import ToolNode
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, BaseMessage
    from langchain_core.tools import tool
    import operator

    @tool
    def search(query: str) -> str:
        """Search for information about a topic."""
        return f"Results for '{query}': The EU AI Act is a regulation..."

    class AgentState(TypedDict):
        messages: Annotated[list[BaseMessage], operator.add]

    model = ChatOpenAI(model="gpt-4o-mini").bind_tools([search])
    tool_node = ToolNode([search])

    def call_model(state: AgentState):
        return {"messages": [model.invoke(state["messages"])]}

    def should_continue(state: AgentState):
        last = state["messages"][-1]
        return "tools" if getattr(last, "tool_calls", None) else END

    graph = StateGraph(AgentState)
    graph.add_node("agent", call_model)
    graph.add_node("tools", tool_node)
    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", should_continue)
    graph.add_edge("tools", "agent")

    # Wrap with Kairos
    tracer = KairosLangGraphTracer(workflow_name="research-graph")
    app = tracer.wrap(graph.compile())

    result = app.invoke({"messages": [HumanMessage(content="What is the EU AI Act?")]})
    print(result["messages"][-1].content)
    print("\nReplay at: https://withkairos.dev/app")
