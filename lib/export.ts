import type { GeneratedSpec } from "./validators";

export function specToMarkdown(spec: GeneratedSpec): string {
  let markdown = `# ${spec.title}\n\n`;
  markdown += `${spec.summary}\n\n`;

  markdown += `## User Stories\n\n`;
  spec.userStories.forEach((story, index) => {
    markdown += `### ${index + 1}. ${story.story}\n\n`;
    markdown += `**Priority:** ${story.priority}  \n`;
    markdown += `**Complexity:** ${story.complexity}\n\n`;
    markdown += `**Tasks:**\n\n`;
    story.tasks.forEach((task, taskIndex) => {
      markdown += `${taskIndex + 1}. ${task.description}\n`;
    });
    markdown += `\n`;
  });

  if (spec.risks.length > 0) {
    markdown += `## Risks\n\n`;
    spec.risks.forEach((risk) => {
      markdown += `- ${risk}\n`;
    });
    markdown += `\n`;
  }

  if (spec.unknowns.length > 0) {
    markdown += `## Unknowns\n\n`;
    spec.unknowns.forEach((unknown) => {
      markdown += `- ${unknown}\n`;
    });
    markdown += `\n`;
  }

  return markdown;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}