---
id: 6
title: "React Fundamentals: Counter & Expense Tracker"
size: "S"
tech: ["HTML", "CSS", "JavaScript", "React"]
summary: "A pair of React projects used to learn state management, component structure, and passing data with props and context."
link: "#"
image: "../../assets/projects/Expense-Tracker.png"
showMoreButton: true
---

# React Fundamentals: Counter & Expense Tracker

These two projects were built back-to-back to learn React from the ground up: starting with a simple counter to understand state and events, then moving to an expense tracker to practice passing data between components and managing more complex UI state.

## Project Overview

The Counter app was the first React project and focused on core ideas like `useState`, event handling, and rendering state changes in real time. The Expense Tracker followed as a second project, where the goal was to move beyond a single component and use props and context to connect multiple parts of the application (inputs, filters, and summary).

## Key Features

- **Counter App**
  - Increment and decrement controls, including larger step changes via buttons.
  - Custom input to adjust the counter directly.
  - Simple layout designed to keep attention on state updates and interaction logic.

- **Expense Tracker**
  - Add new expense records with relevant fields.
  - Filter expenses by name, category, and value to narrow down records.
  - Toggle between “create” and “filter” modes for a cleaner interface.
  - Display total number of records and aggregate expense value.

## Technical Implementation

- **React & State Management**: Used `useState` to manage the counter value and expense data, updating the UI instantly when values change.
- **Components & Data Flow**: Split the Expense Tracker into components for inputs, filters, and summaries, passing data via props and, where needed, context to avoid excessive prop drilling.
- **HTML/CSS Foundations**: Built the UI with hand-written HTML and CSS, including responsive layout work and layout tweaks as more elements were added.
- **Planning & Structure**: For the Expense Tracker, sketched out component structure and data flow before writing code to avoid confusion once the app grew beyond a single component.

## Challenges & What I Learned

The main difficulty in the Expense Tracker was passing data cleanly between components and deciding where state should live so each part of the UI had the data it needed without duplication. Both projects also highlighted how quickly layout and styling become more complex as features are added, which pushed a more deliberate approach to planning structure and CSS instead of adjusting everything ad hoc.

## Future Improvements

Potential next steps include adding edit and delete capabilities to the Expense Tracker, improving the styling of both apps, and persisting data (for example, with local or session storage) so values survive page reloads. These changes would make the projects feel closer to production tools while continuing to build on the same React fundamentals.

## Visuals

![Expense Tracker Main View](/projects/Expense-Tracker.png)  
![Expense Tracker Filter View](/projects/Expense-filtered.png)  
![Counter App](/projects/counter1.png)

## Links

- Expense Tracker Repository: [https://github.com/CD-Chief/ExpenseProj](https://github.com/CD-Chief/ExpenseProj)  
- Counter Repository: [https://github.com/CD-Chief/counter-proj](https://github.com/CD-Chief/counter-proj)
