# Requirements Document

## Introduction

The Expense & Budget Visualizer is a single-page web application (index.html) that allows users to track personal expenses, set category budgets, and visualize spending through interactive charts and a summary dashboard. The app runs entirely in the browser with no backend — all data is persisted in the browser's localStorage. The three core areas are: an expense entry form, budget charts, and a summary dashboard.

## Glossary

- **App**: The Expense & Budget Visualizer single-page web application.
- **Expense**: A record of money spent, consisting of a description, amount, category, and date.
- **Budget**: A user-defined spending limit assigned to a specific category for the current period.
- **Category**: A label used to group expenses (e.g., Food, Transport, Entertainment, Health, Other).
- **Expense_Form**: The UI component that accepts user input to create a new Expense record.
- **Expense_List**: The UI component that displays all recorded Expense entries.
- **Chart_View**: The UI component that renders visual charts of spending data.
- **Dashboard**: The UI component that displays a summary of budget vs. actual spending per category.
- **LocalStorage**: The browser's Web Storage API used to persist Expense and Budget data between sessions.
- **Validator**: The logic responsible for validating user input in the Expense_Form and Budget settings.

---

## Requirements

### Requirement 1: Add an Expense

**User Story:** As a user, I want to add an expense with a description, amount, category, and date, so that I can keep a record of my spending.

#### Acceptance Criteria

1. THE Expense_Form SHALL contain input fields for description (text), amount (number), category (select), and date (date picker).
2. WHEN the user submits the Expense_Form with all fields filled in, THE App SHALL add the new Expense to the Expense_List and persist it to LocalStorage.
3. WHEN the user submits the Expense_Form with all fields filled in, THE Expense_Form SHALL reset all fields to their default empty/placeholder state.
4. IF the user submits the Expense_Form with any required field empty, THEN THE Validator SHALL display an inline error message identifying the missing field and prevent the Expense from being saved.
5. IF the user enters a non-positive number or non-numeric value in the amount field, THEN THE Validator SHALL display an inline error message and prevent the Expense from being saved.
6. WHEN the page loads, THE App SHALL pre-populate the date field with the current date.

---

### Requirement 2: View and Delete Expenses

**User Story:** As a user, I want to view all my recorded expenses and remove incorrect entries, so that my expense list stays accurate.

#### Acceptance Criteria

1. THE Expense_List SHALL display all recorded Expense entries, each showing description, amount, category, and date.
2. THE Expense_List SHALL display entries in reverse-chronological order (most recent first).
3. WHEN the user clicks the delete button on an Expense entry, THE App SHALL remove that Expense from the Expense_List and from LocalStorage.
4. WHILE the Expense_List contains no entries, THE App SHALL display a placeholder message indicating no expenses have been recorded.

---

### Requirement 3: Set Category Budgets

**User Story:** As a user, I want to set a spending budget for each category, so that I can track whether I am staying within my limits.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field for each Category that allows the user to set a Budget amount.
2. WHEN the user saves a Budget amount for a Category, THE App SHALL persist the Budget value to LocalStorage.
3. WHEN the page loads, THE App SHALL restore all previously saved Budget values from LocalStorage.
4. IF the user enters a non-positive number or non-numeric value as a Budget amount, THEN THE Validator SHALL display an inline error message and prevent the Budget from being saved.
5. WHERE a Budget has not been set for a Category, THE Dashboard SHALL display that Category's Budget as zero.

---

### Requirement 4: Visualize Spending with Charts

**User Story:** As a user, I want to see charts of my spending, so that I can quickly understand where my money is going.

#### Acceptance Criteria

1. THE Chart_View SHALL render a pie chart (or doughnut chart) showing the proportion of total spending per Category.
2. THE Chart_View SHALL render a bar chart comparing the Budget amount versus actual spending for each Category.
3. WHEN an Expense is added or deleted, THE Chart_View SHALL update all charts to reflect the current data without requiring a page reload.
4. WHILE the Expense_List contains no entries, THE Chart_View SHALL display a message indicating there is no data to visualize instead of rendering empty charts.
5. THE Chart_View SHALL label each chart segment or bar with the corresponding Category name and value.

---

### Requirement 5: Summary Dashboard

**User Story:** As a user, I want a summary dashboard showing budget vs. actual spending per category, so that I can see at a glance where I am over or under budget.

#### Acceptance Criteria

1. THE Dashboard SHALL display a summary row for each Category showing: Category name, Budget amount, total amount spent, and remaining balance (Budget minus spent).
2. WHEN the total amount spent in a Category exceeds the Budget for that Category, THE Dashboard SHALL visually highlight that Category row to indicate an over-budget state.
3. THE Dashboard SHALL display the overall total of all expenses across all categories.
4. WHEN an Expense is added or deleted, THE Dashboard SHALL update all summary values to reflect the current data without requiring a page reload.
5. WHEN a Budget value is saved, THE Dashboard SHALL update the remaining balance and over-budget indicators immediately.

---

### Requirement 6: Data Persistence Across Sessions

**User Story:** As a user, I want my expenses and budgets to be saved between browser sessions, so that I do not lose my data when I close or refresh the page.

#### Acceptance Criteria

1. WHEN the page loads, THE App SHALL read all Expense records from LocalStorage and populate the Expense_List.
2. WHEN the page loads, THE App SHALL read all Budget values from LocalStorage and populate the Dashboard budget inputs.
3. WHEN the page loads, THE App SHALL render the Chart_View and Dashboard using the restored data.
4. IF LocalStorage is unavailable or returns a parse error, THEN THE App SHALL initialize with empty Expense and Budget data and display a non-blocking warning message to the user.
