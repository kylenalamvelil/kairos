"""
Kairos + AutoGen Integration

Records every agent message, tool call, and conversation turn in an AutoGen workflow.

pip install kairos-trace pyautogen
"""

import time
from typing import Any
from autogen import ConversableAgent, GroupChat, GroupChatManager
from kairos import create_kairos


class KairosAgentHook:
    """
    Hooks into AutoGen's message flow to record every turn to Kairos.

    Usage:
        hook = KairosAgentHook(workflow_name="autogen-workflow")
        hook.attach(agent)
    """

    def __init__(self, workflow_name: str = "autogen-agent"):
        self._kairos = create_kairos()
        self._exec = self._kairos.execution(workflow_name=workflow_name)
        self._message_count = 0

    def attach(self, agent: ConversableAgent) -> ConversableAgent:
        original_receive = agent.receive

        exec_ = self._exec

        def traced_receive(message, sender, request_reply=None, silent=False):
            exec_.event("message_received", {
                "from": sender.name if hasattr(sender, "name") else str(sender),
                "to": agent.name,
                "content": str(message)[:300] if isinstance(message, str) else str(message.get("content", ""))[:300],
            })
            return original_receive(message, sender, request_reply, silent)

        agent.receive = traced_receive
        return agent

    def record_tool(self, name: str, input: Any = None, output: Any = None, latency_ms: int | None = None):
        self._exec.tool_call(name, input=input, output=output, latency_ms=latency_ms)

    def complete(self, output: str = ""):
        self._exec.complete(output)

    def fail(self, error: str):
        self._exec.fail(error)


def kairos_groupchat(manager: GroupChatManager, workflow_name: str = "autogen-groupchat") -> GroupChatManager:
    """
    Wraps a GroupChatManager to record the full multi-agent conversation to Kairos.

    Usage:
        manager = kairos_groupchat(GroupChatManager(groupchat=gc, llm_config=...))
    """
    kairos = create_kairos()
    exec_ = kairos.execution(workflow_name=workflow_name)

    original_run_chat = manager.run_chat

    def traced_run_chat(messages=None, sender=None, config=None):
        if messages:
            first_msg = messages[0] if isinstance(messages, list) else messages
            content = first_msg.get("content", str(first_msg)) if isinstance(first_msg, dict) else str(first_msg)
            exec_.set_prompt(content[:500])

        start = time.time()
        try:
            result = original_run_chat(messages, sender, config)
            latency = int((time.time() - start) * 1000)
            exec_.event("groupchat_completed", {"latency_ms": latency})
            exec_.complete()
            return result
        except Exception as e:
            exec_.fail(str(e))
            raise

    manager.run_chat = traced_run_chat
    return manager


# ── Example ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    llm_config = {"model": "gpt-4o-mini"}

    assistant = ConversableAgent(
        "assistant",
        system_message="You are a helpful AI assistant. Reply TERMINATE when done.",
        llm_config=llm_config,
    )
    user_proxy = ConversableAgent(
        "user_proxy",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=3,
        is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
        llm_config=False,
    )

    # Attach Kairos hook to both agents
    hook = KairosAgentHook(workflow_name="research-conversation")
    hook.attach(assistant)
    hook.attach(user_proxy)

    try:
        user_proxy.initiate_chat(assistant, message="What is the EU AI Act? Keep it brief.")
        hook.complete("Conversation finished.")
    except Exception as e:
        hook.fail(str(e))
        raise

    print("\nReplay at: https://withkairos.dev/app")
