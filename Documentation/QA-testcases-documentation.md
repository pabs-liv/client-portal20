
# QA Test Cases for Documentation Feature

## Test Case: TC-001 - Search Functionality in "All Documents" Tab

**Objective:** To verify that the search functionality in the "All Documents" tab correctly filters the documents based on the user's input.

**Preconditions:**
- The user is logged into the application.
- The user has navigated to the "Documents" page.
- The "All Documents" tab is selected.

**Test Steps:**

1.  **Navigate to the Documents Page:**
    - Open the application and log in.
    - Click on the "Documents" link in the sidebar.
    - The URL should be `http://localhost:5173/documents`.

2.  **Observe the Initial State:**
    - The "All Documents" tab should be selected by default.
    - A table with a list of documents should be displayed.
    - **Screenshot:** `initial_documents_page.png`

3.  **Enter a Search Term:**
    - Locate the search bar with the placeholder "Search documents".
    - Enter a search term that is expected to match one or more documents in the table (e.g., "Benefit").

4.  **Verify the Search Results:**
    - As the user types, the table should automatically filter the results.
    - The table should only display the documents that match the search term.
    - **Screenshot:** `filtered_documents_page.png`

**Expected Results:**

- The table of documents is filtered in real-time as the user types in the search bar.
- Only the documents containing the search term in their name or other properties are displayed in the table.

**Actual Results:**

- (To be filled in after test execution)

**Status:**

- (Pass/Fail)
