"""
Kairos + CrewAI Integration

Records every CrewAI agent task, tool call, and decision.

pip install kairos-trace crewai
"""

from crewai import Agent, Task, Crew, Process
from crewai.agents.parser import AgentAction, AgentFinish
from kairos import create_kairos
import time


class KairosCrewCallback:
    """
    CrewAI callback that records execution to Kairos.

    Usage:
        crew = Crew(
            agents=[researcher, writer],
            tasks=[research_task, write_task],
            callbacks=[KairosCrewCallback(workflow_name="content-crew")]
        )
    """

    def __init__(self, workflow_name: str = "crewai-crew"):
        self._kairos = create_kairos()
        self._workflow_name = workflow_name
        self._exec = None
        self._task_start = {}

    def on_crew_start(self, crew, inputs=None):
        self._exec = self._kairos.execution(workflow_name=self._workflow_name)
        if inputs:
            self._exec.set_prompt(str(inputs)[:500])

    def on_task_start(self, task, agent):
        self._task_start[task.id] = time.time()
        if self._exec:
            self._exec.event("task.started", {
                "task": task.description[:200],
                "agent": agent.role,
            })

    def on_task_end(self, task, output, agent):
        if self._exec:
            latency = int((time.time() - self._task_start.get(task.id, time.time())) * 1000)
            self._exec.tool_call(
                f"task:{agent.role}",
                input={"task": task.description[:200]},
                output={"result": str(output)[:300]},
                latency_ms=latency,
            )

    def on_agent_action(self, action: AgentAction, agent):
        if self._exec:
            self._exec.decision(
                reasoning=f"{agent.role}: {action.thought[:200]}",
                confidence=0.85,
            )

    def on_tool_use(self, agent, tool_name, tool_input):
        if self._exec:
            self._exec.event("tool.called", {
                "agent": agent.role,
                "tool": tool_name,
                "input": str(tool_input)[:200],
            })

    def on_crew_end(self, crew, output):
        if self._exec:
            self._exec.complete(str(output)[:500])
            self._exec = None


# ── Example ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    from crewai_tools import SerperDevTool

    search_tool = SerperDevTool()
    kairos_callback = KairosCrewCallback(workflow_name="research-crew")

    researcher = Agent(
        role="Research Analyst",
        goal="Find accurate and up-to-date information",
        backstory="Expert at researching complex topics",
        tools=[search_tool],
    )

    task = Task(
        description="Research the key requirements of the EU AI Act",
        expected_output="A clear summary of EU AI Act requirements",
        agent=researcher,
    )

    crew = Crew(
        agents=[researcher],
        tasks=[task],
        process=Process.sequential,
        callbacks=[kairos_callback],
    )

    result = crew.kickoff()
    print(result)
    print("\nReplay this execution at: https://withkairos.dev/app")
