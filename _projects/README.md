# Projects Collection

This directory contains all project files that will be displayed on the `/projects` page.

## How to Add a New Project

1. Create a new markdown file in this directory (e.g., `my-awesome-project.md`)
2. Add the following frontmatter:

```yaml
---
title: "Your Project Title"
description: "A brief description of your project (1-2 sentences)"
repo_url: "https://github.com/yourusername/your-repo"
technologies: ["Python", "Flask", "Docker"]  # List of technologies used
category: ["Cybersecurity", "Network Security"]  # Single or multiple categories
date: 2024-12-01  # Project completion/publication date
image: "/assets/img/projects/project-screenshot.png"  # Optional: project image
---
```

3. Save the file - it will automatically appear on the projects page!

## Frontmatter Fields

- **title** (required): Project name displayed on the card
- **description** (required): Brief project description (shows on card)
- **repo_url** (required): GitHub repository URL (where users will be redirected)
- **technologies** (required): Array of technology names (displayed as tags)
- **category** (required): Single category string OR array of categories
  - Single: `category: "Cybersecurity"`
  - Multiple: `category: ["Cybersecurity", "Machine Learning"]`
- **date** (required): Project date (YYYY-MM-DD format)
- **image** (optional): Path to project screenshot/image

## Available Categories

- Cybersecurity
- Network Security
- IoT Security
- Data Science
- Data Analytics
- Machine Learning
- CTF
- Digital Forensics
- Malware Analysis
- Web Development

## Example Project File

### Single Category:
```markdown
---
title: "Network Traffic Analyzer"
description: "Real-time network packet analysis tool with anomaly detection and visualization dashboard built with Python and Scapy."
repo_url: "https://github.com/0xShun/network-analyzer"
technologies: ["Python", "Scapy", "Flask", "Chart.js"]
category: "Network Security"
date: 2024-11-20
image: "/assets/img/projects/network-analyzer.png"
---
```

### Multiple Categories:
```markdown
---
title: "AI-Powered Threat Detection"
description: "Machine learning system for detecting cybersecurity threats using neural networks and behavioral analysis."
repo_url: "https://github.com/0xShun/ai-threat-detection"
technologies: ["Python", "TensorFlow", "Scikit-learn", "Flask"]
category: ["Cybersecurity", "Machine Learning", "Data Science"]
date: 2024-12-15
---
```

## Notes

- Projects are automatically sorted by date (newest first)
- Clicking a project card redirects to the GitHub repository
- Images are optional but make projects more visually appealing
- Keep descriptions concise (1-2 sentences max)
- Technologies appear as styled tags below the description
