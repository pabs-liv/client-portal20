# API Endpoints for HomePage.vue

This document outlines the necessary API endpoints to populate the `HomePage.vue` component with dynamic data.

## 1. Dashboard Summary Counts

This single endpoint should provide the counts for all the summary widgets on the dashboard.

*   **Endpoint:** `GET /api/dashboard/summary`
*   **Description:** Retrieves the counts for pending approvals, high-cost claims, and prior authorizations. The data should be scoped to the authenticated user's entity if they are an `external` user. `internal` users should see aggregate data across all entities they have access to.
*   **Request:**
    *   Method: `GET`
    *   Headers: `Authorization: Bearer <token>`
*   **Success Response (200 OK):**
    ```json
    {
      "pendingApprovals": {
        "count": 5
      },
      "highCostClaims": {
        "count": 2
      },
      "priorAuthorizations": {
        "count": 8
      }
    }
    ```

## 2. Implementations Overview

This endpoint provides the data for the "Implementations Overview" chart.

*   **Endpoint:** `GET /api/implementations/status-overview`
*   **Description:** Retrieves the count of implementations grouped by their status (`new`, `inProgress`, `pendingAction`, `completed`). Data should be scoped for `external` vs. `internal` users.
*   **Request:**
    *   Method: `GET`
    *   Headers: `Authorization: Bearer <token>`
*   **Success Response (200 OK):**
    ```json
    {
      "new": 5,
      "inProgress": 12,
      "pendingAction": 7,
      "completed": 20
    }
    ```

## 3. Upcoming Implementations

This endpoint provides the data for the "Upcoming Implementations Next 90 Days" table.

*   **Endpoint:** `GET /api/implementations/upcoming`
*   **Description:** Retrieves a list of implementations scheduled to go live within the next 90 days.
*   **Query Parameters:**
    *   `limit` (number, optional): The maximum number of implementations to return. Defaults to 5.
*   **Request:**
    *   Method: `GET`
    *   Headers: `Authorization: Bearer <token>`
*   **Success Response (200 OK):**
    ```json
    {
      "implementations": [
        {
          "id": 1,
          "planName": "Innovate Health Plan",
          "goLiveDate": "2025-09-15",
          "status": "On Track"
        },
        {
          "id": 2,
          "planName": "FutureCare Plus",
          "goLiveDate": "2025-10-01",
          "status": "Pending Client Action"
        },
        {
          "id": 3,
          "planName": "NextGen Benefits",
          "goLiveDate": "2025-10-20",
          "status": "Delayed"
        }
      ]
    }
    ```

## 4. Report Explorer

This endpoint provides the data for the "Report Explorer" data table. It needs to support filtering and pagination.

*   **Endpoint:** `GET /api/reports`
*   **Description:** Retrieves a paginated and filterable list of reports.
*   **Query Parameters:**
    *   `page` (number, optional): The page number to retrieve. Defaults to 1.
    *   `limit` (number, optional): The number of items per page. Defaults to 10.
    *   `type` (string, optional): Filters reports by type (e.g., "quarterly", "monthly", "ad-hoc", "rebate", "caa").
    *   `status` (string, optional): Filters reports by status (e.g., "pending approval", "completed", "approved").
    *   `search` (string, optional): A search term to filter reports by account name or report name.
*   **Request:**
    *   Method: `GET`
    *   Headers: `Authorization: Bearer <token>`
*   **Success Response (200 OK):**
    ```json
    {
      "pagination": {
        "totalItems": 150,
        "totalPages": 15,
        "currentPage": 1,
        "pageSize": 10
      },
      "reports": [
        {
          "id": 1,
          "accountName": "Acme Corp",
          "reportName": "Monthly Value Report",
          "type": "Monthly",
          "reportingPeriod": "July 2025",
          "lastEditedBy": "John Doe",
          "status": "Completed"
        },
        {
          "id": 2,
          "accountName": "Globex Inc.",
          "reportName": "Quarterly Executive Summary",
          "type": "Quarterly",
          "reportingPeriod": "Q2 2025",
          "lastEditedBy": "Jane Smith",
          "status": "Approved"
        }
      ]
    }
    ```
