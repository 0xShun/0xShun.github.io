# Writeup front matter

Writeups are Markdown files named `YYYY-MM-DD-title.md`. Add an optional
`summary` to provide the text shown on post cards:

```yaml
---
title: "Example Writeup"
summary: "A short overview of the investigation."
categories: [Malware Analysis]
tags: [DFIR, PDF]
image: "/assets/img/example-cover.jpg"
---
```

Write the summary as plain text. If `summary` is omitted or empty, cards use
the post's automatically generated excerpt. The image is also optional; posts
without one use a generated cover.
