
# Developer Guide for Client Portal 2.0

## 1. Introduction

Welcome to the Client Portal 2.0 project! This guide provides all the necessary information for developers to get started with the frontend codebase. It covers everything from setting up the local environment to understanding the project's architecture and conventions.

---

## 2. Core Technologies

The frontend is built with a modern, component-based architecture using the following technologies:

- **Vue.js 3:** The core JavaScript framework.
- **Vite:** The build tool and development server.
- **TypeScript:** For static typing and improved code quality.
- **Vuetify 3:** The UI component library.
- **Pinia:** The state management solution.
- **Vue Router 4:** For client-side routing.
- **Sass (SCSS):** For advanced CSS styling.
- **ApexCharts:** For data visualization and charts.
- **Lucide Icons:** For a lightweight and consistent icon set.

---

## 3. Getting Started

To get the frontend running on your local machine, follow these steps:

1.  **Prerequisites:**
    -   Node.js (v18 or higher recommended)
    -   npm (usually comes with Node.js)

2.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd 'Client Portal 2.0/frontend'
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

5.  **Build for Production:**
    ```bash
    npm run build
    ```
    This command generates a `dist` directory with the optimized production assets.

---

## 4. Project Structure

The `frontend/src/` directory is organized as follows:

-   **`assets/`**: Static assets like images and fonts.
-   **`components/`**: Reusable Vue components.
    -   **`common/`**: Components that are used across multiple pages and are specific to this application (e.g., `ReportDataTable`, `SummaryWidget`).
    -   **`layout/`**: Components that define the main structure of the application (e.g., `Sidebar`, `Header`).
    -   **`ui/`**: Generic, reusable UI components that are not specific to any particular page (e.g., `Button`, `Card`, `Dialog`).
-   **`composables/`**: Reusable Vue Composition API functions (e.g., `useUserType`, `useApi`).
-   **`plugins/`**: Vue plugins, such as `vuetify.ts`.
-   **`router/`**: Routing configuration using Vue Router.
-   **`services/`**: Modules for interacting with external APIs.
-   **`stores/`**: Pinia store modules for state management.
-   **`styles/`**: Global styles and SCSS variables.
-   **`utils/`**: Utility functions and type definitions.
-   **`views/`**: Top-level components that represent the pages of the application.

---

## 5. State Management (Pinia)

State management is handled by Pinia. The stores are located in the `frontend/src/stores/` directory.

-   **`user.ts`**: Manages the user's session and type (internal/external).

**Creating a New Store:**

1.  Create a new file in the `stores` directory (e.g., `reports.ts`).
2.  Define your store using the `defineStore` function.
3.  Import and use the store in your components.

---

## 6. Styling

Styling is done using SCSS. Global styles and variables are defined in `frontend/src/style.scss`. Component-specific styles are co-located with their respective components in `<style lang="scss" scoped>` blocks.

The Vuetify theme is configured in `frontend/src/plugins/vuetify.ts`.

---

## 7. API Integration

All API interactions should be handled in the `frontend/src/services/` directory. The `useApi.ts` composable can be used to make API calls from components.

For detailed information about the available API endpoints, refer to the `API.txt` documentation file.

---

## 8. Testing

Currently, there are no tests in the project. A testing strategy should be established to ensure code quality and prevent regressions. The recommended approach is:

-   **Framework:** [Vitest](https://vitest.dev/) for its speed and compatibility with Vite.
-   **Component Testing:** Use `@vue/test-utils` to mount and test components in isolation.
-   **Unit Testing:** Write unit tests for composables, services, and utility functions.
-   **Test Location:** Test files should be co-located with the files they are testing (e.g., `MyComponent.spec.ts` next to `MyComponent.vue`).

---

## 9. Contribution Guidelines

To contribute to the project, please follow these guidelines:

1.  **Branching:** Create a new branch for each feature or bug fix (e.g., `feature/new-dashboard` or `bugfix/login-error`).
2.  **Commits:** Write clear and concise commit messages.
3.  **Pull Requests:** Open a pull request to the `main` branch when your work is ready for review.
4.  **Code Review:** All pull requests must be reviewed and approved by at least one other developer before being merged.
