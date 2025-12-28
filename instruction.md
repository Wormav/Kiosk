# Kiosk – Full-stack Case Study

Welcome, and thank you for your interest in Kiosk 👋  

This exercise is a **technical case study for a Full-stack** position.  
It is inspired by a real feature of our ESG/CSRD reporting product.

We are **not** looking for a “finished product at all costs”.  
We explicitly **prioritise quality over quantity**:
- clear architecture and trade-offs
- readable, maintainable code
- sensible UX
- ability to explain your decisions

It is **absolutely fine if you don’t implement everything**.  
If you run out of time, please document what you would do next.


## 1. Goal of the exercise

We want to simulate a small slice of the Kiosk product:

Given a catalog of questions stored in a CSV file, load and transform this data on the server, assemble it into a hierarchical structure, expose it to the frontend, and build a dynamic form experience that captures user answers.

A question may have related questions, which themselves can have related questions, and so on.
Your job is to interpret this structure and design a coherent way to model it, render it, and collect answers.

**Important clarification**

For this exercise, we expect a single form rendered on a single page, capable of handling:
- nested questions (arbitrary depth),
- table-like structures (or something visually close to an HTML table).
    - the question with `content = "table"` acts as a **table container**
    - its related child questions represent the **rows** of that table

The goal is not to design multiple screens or flows, but to demonstrate how you model, render, and manage a complex hierarchical form within one page.

It is totally OK to not implement everything; focus on clarity, structure, and trade-offs.

## 2. Tech stack & constraints

For information, our production stack is:

- **Node.js**
- **Remix**
- **TypeScript**
- **Mantine UI**
- **Prisma + PostgreSQL**

For this case study, please use:
- **React**
- **TypeScript**

You are free to use any libraries, tooling, framework etc you prefer
We intentionally keep the constraints minimal so you can choose the architecture and tools that make the most sense to you.

## 3. Deliverables

Please send us:
1. A link to your repository (GitHub, GitLab, etc.)
2. This README filled in with:
    - how to run the project
    - if you used AI, how you used it
        - if applicable, the main prompts you used with AI tools
    - what you would improve next
3. A simple Docker setup (e.g. Dockerfile or docker-compose) to run the app end-to-end


## 4. Structure of questions.csv

The file `questions.csv` contains the sample list of datapoints.

Here are the columns:
- id
- question label en / question label fr
- content
    - defines the expected input type for this question.
    - possible values:
        - "number" → numeric value
        - "text" → free-text input
        - "enum" → selectable value from a list
        - "table" → multi-row / multi-field structure (you may simplify this for the exercise)
        - "" (empty) → this question does not expect content; it is typically used as a structural or grouping question (e.g. section title).
- related question id
    - if present, this question is logically linked to another question.
    - typical use cases:
        - table rows
        - hierarchical visibility (nested follow-up questions)
- order
    - suggested position of the question within its group.
- unit
    - indicates a measurement unit (e.g. %, €, hours).
- enum fr / enum en
    - Applies only when content = "enum".
    - Contain semicolon-separated lists of possible values in French or English.


### Example:

| id   | question label en         | content | related question id  |
|------|---------------------------|---------|----------------------|
| Q100 | Employee details          | table   |                      |
| Q101 | Employee birth year       | number  | Q100                 |

Here:
- Q100 defines a table section.
- Q101 is a row/field of that table because it references Q100.

Example of how it could be rendered:

| Employee details   | Value      |
|--------------------|------------|
| Employee details   |     [input goes here]       |


## Questions about this case study

If anything is unclear, feel free to email `sabine@meetkiosk.com` or `mathys@meetkiosk.com`.
