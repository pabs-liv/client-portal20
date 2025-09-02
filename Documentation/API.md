
# API Documentation for Client Portal 2.0

This document outlines the necessary API endpoints and data structures required to connect the frontend of the Client Portal 2.0 application to a backend service.

---

## 1. Authentication

### 1.1. User Session

- **Endpoint:** `/api/auth/session`
- **Method:** `GET`
- **Description:** Retrieves the current user's session information, including their user type (internal or external).
- **Response Body:**
  ```json
  {
    "userType": "internal"
  }
  ```
  or
  ```json
  {
    "userType": "external"
  }
  ```
- **Approach**
  - This will be reworked to use Auth0, we won't be using AspNetUsers going forward

### 1.2. Login

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and establishes a session.
- **Request Body:**
  ```json
  {
    "username": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Body:**
  ```json
  {
    "success": true,
    "userType": "internal"
  }
  ```
- **Approach**
  - This will be reworked to use Auth0, we won't be using AspNetUsers going forward

### 1.3. Logout

- **Endpoint:** `/api/auth/logout`
- **Method:** `POST`
- **Description:** Terminates the current user's session.
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```
- **Approach**
  - This will be reworked to use Auth0, we won't be using AspNetUsers going forward
    
---

## 2. Home Page (`/`)

### 2.1. Get Home Page Data

- **Endpoint:** `/api/home`
- **Method:** `GET`
- **Description:** Retrieves all the necessary data for the home page dashboard.
- **Response Body:**
  ```json
  {
    "welcomeMessage": "Welcome back, Pablo!", --> This will need to use the user's name
    "summaryWidgets": [
      {
        "title": "Pending Approvals",
        "count": 5,
        "description": "Reports waiting for your approval",
        "icon": "CircleCheckBig",
        "iconBackgroundColor": "#E6F4EA",
        "iconColor": "#4CAF50",
        "link": "/reports"
      },
      {
        "title": "High-Cost Claims",
        "count": 2,
        "description": "New claims requiring attention",
        "icon": "ChartNoAxesCombined",
        "iconBackgroundColor": "#FFF3E0",
        "iconColor": "#FF9800",
        "link": "/approvals"
      },
      {
        "title": "Prior Authorizations",
        "count": 8,
        "description": "Requests needing review",
        "icon": "RotateCcwKey",
        "iconBackgroundColor": "#E0F2F7",
        "iconColor": "#2196F3",
        "link": "/prior-auths"
      }
    ],
    "implementationStatus": {
      "new": 5,
      "inProgress": 12,
      "pendingAction": 7,
      "completed": 20
    },
    "upcomingImplementations": [
      { "accountName": "Acme Corp", "implementationStatus": "Pending Documents", "goLiveDate": "2025-07-20" },
      { "accountName": "Globex Inc.", "implementationStatus": "Clinical Setup", "goLiveDate": "2025-08-05" }
    ],
    "reportExplorer": {
      "headers": [
        { "title": "Account Name", "key": "accountName" },
        { "title": "Report Name", "key": "reportName" },
        { "title": "Type", "key": "type" },
        { "title": "Reporting Period", "key": "reportingPeriod" },
        { "title": "Last Edited By", "key": "lastEditedBy" },
        { "title": "Status", "key": "status" },
        { "title": "", "key": "actions", "sortable": false, "align": "end" }
      ],
      "items": [
        { "id": 1, "accountName": "Acme Corp", "reportName": "Monthly Value Report", "type": "Monthly", "reportingPeriod": "July 2025", "lastEditedBy": "John Doe", "status": "Completed" },
        { "id": 2, "accountName": "Globex Inc.", "reportName": "Quarterly Executive Summary", "type": "Quarterly", "reportingPeriod": "Q2 2025", "lastEditedBy": "Jane Smith", "status": "Approved" }
      ],
      "filters": [
        { "type": "tab", "value": "all", "label": "All", "isActive": true },
        { "type": "tab", "value": "quarterly", "label": "Quarterly" },
        { "type": "tab", "value": "monthly", "label": "Monthly" }
      ]
    }
  }
  ```

---

## 3. Reports (`/reports`)

### 3.1. Get Reports

- **Endpoint:** `/api/reports`
- **Method:** `GET`
- **Description:** Retrieves a list of all reports.
- **Query Parameters:**
  - `search` (string, optional): A search term to filter reports by name, type, or keyword.
  - `type` (string, optional): The type of report to filter by (e.g., 'quarterly', 'monthly').
  - `status` (string, optional): The status of the report to filter by (e.g., 'pending approval').
- **Response Body:** See `reportExplorer.items` in the Home Page Data section for the structure of a report item.
- **Approach**
  - ReportTypes - dbo.ReportTypes
  - Reports - dbo.Reports
  - Need to determine if we want to move these tables over to Solo 1 PbmOperations
  - Think report status is only for Liviniti employees - based on dbo.Reports.IsApproved
  - - We don't have a Pending Approval, options are IsApproved 1 or 0, so Approved = 1 or Pending Approval = 0
  - Probably want to add discriminator to the query parameters so users can look for Quarterly reports from Q1 2024, etc. - dbo.Reports.Discriminator
  - dbo.Reports.IsDeleted should be taken into account when showing reports, this does happen for reports that need to be corrected
    
---

## 4. Approvals (`/approvals`)

### 4.1. Get Approvals

- **Endpoint:** `/api/approvals`
- **Method:** `GET`
- **Description:** Retrieves a list of all items awaiting approval.
- **Response Body:** Similar to the reports endpoint, but filtered for items with a "Pending Approval" status.
- **Approach**
  - ReportTypes - dbo.ReportTypes
  - Pull all Reports based on a selected Discriminator - dbo.Reports/dbo.Reports.Discriminator
  - Need to determine if we want to move these tables over to Solo 1 PbmOperations
  - dbo.Reports.IsDeleted should be taken into account when showing reports, this does happen for reports that need to be corrected
  - Will want to show who approved and when - dbo.Reports.ApprovedBy/dbo.Reports.EditedDate
  - Probably want to add a filter for reports that have not been approved, but have ability to see all so they can see which ones they've already approved

---

## 5. High-Cost Claims (`/high-cost-claims`)

### 5.1. Get High-Cost Claims

- **Endpoint:** `/api/high-cost-claims`
- **Method:** `GET`
- **Description:** Retrieves a list of high-cost claims.
- **Response Body:**
  ```json
  {
    "claims": [
      {
        "accountName": "Blue Cross Blue Shield",
        "eocId": "EOC12345",
        "drugName": "Drug A",
        "cost": "$1,200.00",
        "claimDate": "2025-07-15",
        "status": "Pending"
      }
    ],
    "summary": {
      "pendingApproval": 3,
      "totalCost": "$5,000.00",
      "averageCost": "$1,666.67"
    },
    "topAccounts": {
      "categories": ["Blue Cross Blue Shield", "Aetna", "Cigna"],
      "series": [{ "name": "Claim Amount", "data": [2500, 1500, 1000] }]
    }
  }
  - **Approach**
  - Could use PbmOperations.PHI.PriorAuthorizationsAgadia by checking the IngredientCost for the list of claims with PAs
  - Account high cost notification amount - ACT.Accounts.HighCostClaimNotifyAmount
  - Claims that show here should be any claims with IngredientCost over the set HighCostClaimNotifyAmount
  
  ```

### 5.2. Update High-Cost Claim Status

- **Endpoint:** `/api/high-cost-claims/{claimId}`
- **Method:** `PUT`
- **Description:** Updates the status of a high-cost claim (e.g., approve, reject, request info).
- **Request Body:**
  ```json
  {
    "status": "approved"
  }
  ```
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```
  - **Approach**
  - Could use PbmOperations.PHI.PriorAuthorizationsAgadia by checking the IngredientCost for the list of claims with PAs
  - If NextStep = Client Sign-off > this means it's ready for review by client (we shoudl show the approve, reject and request info buttons)
  - Otherwise, think we could use Outcome for Approved or Denied
  - Do we want to move dbo.HighCostClaims from PbmCustomers to PbmOperations? This tells us if it's been approved/denied by client
    
---

## 6. Prior Authorizations (`/prior-auths`)

### 6.1. Get Prior Authorizations

- **Endpoint:** `/api/prior-auths`
- **Method:** `GET`
- **Description:** Retrieves a list of prior authorizations.
- **Response Body:**
  ```json
  {
    "authorizations": [
      {
        "accountName": "Blue Cross Blue Shield",
        "eocId": "EOC12345",
        "drugName": "Drug A",
        "status": "Pending",
        "submissionDate": "2025-07-01"
      }
    ],
    "summary": {
      "pending": 5,
      "approved": 10,
      "denied": 2
    }
  }
  ```
  - **Approach**
  - Use PbmOperations.PHI.PriorAuthorizationsAgadia by AccountId for all PAs
  - EocId = EocId
  - DrugName = ServiceName
  - Status = Outcome
  - Submission Date = EventStartDate  

### 6.2. Request Information for Prior Authorization

- **Endpoint:** `/api/prior-auths/{authId}/request-info`
- **Method:** `POST`
- **Description:** Sends a request for more information about a prior authorization.
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```
 - **Approach**
 - Do we want to move HighCostClaimCommunications over to PbmOperations? This tracks communications when user requests info
    
---

## 7. Documents (`/documents`)

### 7.1. Get Documents

- **Endpoint:** `/api/documents`
- **Method:** `GET`
- **Description:** Retrieves a list of documents.
- **Query Parameters:**
  - `category` (string, optional): The category of documents to filter by (e.g., 'PHI Documents', 'Billing').
- **Response Body:**
  ```json
  [
    { "id": 1, "documentName": "2025 Benefit Guide", "type": "pdf", "uploadDate": "2025-01-15", "lastModifiedBy": "Admin", "status": "Published", "category": "All Documents" }
  ]
  ```
  - **Approach**
  - Do we want to move Documents over to PbmOperations

### 7.2. Upload Document

- **Endpoint:** `/api/documents/upload`
- **Method:** `POST`
- **Description:** Uploads a new document.
- **Request Body:** `multipart/form-data` with the file and document type.
- **Response Body:**
  ```json
  {
    "success": true,
    "document": { "id": 8, "documentName": "New Document.pdf", "type": "pdf", "uploadDate": "2025-08-01", "lastModifiedBy": "User", "status": "Published", "category": "PHI Documents" }
  }
  ```

 
---

## 8. Settings (`/settings`)

### 8.1. Get Account Settings

- **Endpoint:** `/api/settings/accounts/{accountId}`
- **Method:** `GET`
- **Description:** Retrieves the settings for a specific account.
- **Response Body:** See the `companyData` object in `frontend/src/views/SettingsPage.vue` for the detailed structure.

### 8.2. Update Account Settings

- **Endpoint:** `/api/settings/accounts/{accountId}`
- **Method:** `PUT`
- **Description:** Updates the settings for a specific account.
- **Request Body:** A partial or full `CompanyData` object with the updated fields.
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```
  - **Approach**
  - Need to specify which fields show here. I think it's account name, DBA, legal name, address and high cost claim amount. All should be pulled from ACT.Accounts and ACT.AccountAddressXRef

### 8.3. Get User Administration Data

- **Endpoint:** `/api/settings/user-admin`
- **Method:** `GET`
- **Description:** Retrieves the user administration data for the selected account.
- **Response Body:**
  ```json
  [
    {
      "accountName": "Stark Industries",
      "user": "Tony Stark",
      "role": "Admin",
      "email": "tony.stark@starkindustries.com",
      "permissions": "All",
      "activated": true,
      "mainPoc": true,
      "surveyContact": false
    }
  ]
  ```
  - **Approach**
  - This will all be based on Auth0 and redesign of contacts

### 8.4. Get Claim Edit Rules

- **Endpoint:** `/api/settings/claim-edit-rules`
- **Method:** `GET`
- **Description:** Retrieves the claim edit rules for the selected account.
- **Response Body:**
  ```json
  [
    {
      "ruleName": "Rule 1",
      "ruleStatus": "Active",
      "ruleAction": "Approve",
      "changeLogDetails": [
        { "change": "Created", "changeDescription": "Initial rule creation", "editedBy": "John Doe", "editDate": "2023-01-01" }
      ]
    }
  ]
  ```

---

## 9. Added Value Page (`/added-value`)

### 9.1. Get Added Value Programs

- **Endpoint:** `/api/added-value/programs`
- **Method:** `GET`
- **Description:** Retrieves the available added value programs.
- **Response Body:**
  ```json
  [
    { "id": 1, "title": "Anti-Obesity Management Program", "subtitle": "Wellness", "description": "...", "selected": false },
    { "id": 2, "title": "Liviniti Pharmacogenomics", "subtitle": "Wellness", "description": "...", "selected": false }
  ]
  ```

### 9.2. Get Account Programs

- **Endpoint:** `/api/added-value/accounts/{accountId}/programs`
- **Method:** `GET`
- **Description:** Retrieves the added value programs for a specific account.
- **Response Body:**
  ```json
  {
    "inUse": [
      { "id": 1, "title": "Anti-Obesity Management Program", "subtitle": "Wellness" }
    ],
    "available": [
      { "id": 3, "title": "Liviniti Delivery on Demand", "subtitle": "Savings", "description": "...", "selected": false }
    ]
  }
  ```

### 9.3. Request Program Details

- **Endpoint:** `/api/added-value/programs/request-details`
- **Method:** `POST`
- **Description:** Requests more details about selected added value programs.
- **Request Body:**
  ```json
  {
    "programIds": [2, 3]
  }
  ```
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```

---

## 10. Plan Explorer Page (`/plan-explorer`)

### 10.1. Get Implementation Steps

- **Endpoint:** `/api/plan-explorer/accounts/{accountId}/steps`
- **Method:** `GET`
- **Description:** Retrieves the implementation steps for a specific account.
- **Response Body:**
  ```json
  [
    {
      "title": "Plan Setup",
      "description": "Initial setup of the plan details and configurations.",
      "status": "completed",
      "startDate": "2025-01-01",
      "endDate": "2025-01-15",
      "assignedTo": "John Doe"
    }
  ]
  ```

### 10.2. Update Implementation Step

- **Endpoint:** `/api/plan-explorer/steps/{stepId}`
- **Method:** `PUT`
- **Description:** Updates the status of an implementation step.
- **Request Body:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```

---

## 11. Test Results Page (`/test-results`)

### 11.1. Get Test Results

- **Endpoint:** `/api/test-results`
- **Method:** `GET`
- **Description:** Retrieves a list of test results.
- **Response Body:**
  ```json
  [
    {
      "accountName": "Blue Cross Blue Shield",
      "reportType": "Configuration",
      "report": "Plan Design 2025",
      "dateRange": "2025-01-01 - 2025-12-31",
      "status": "Approved",
      "approvedBy": "John Doe",
      "approvedDate": "2025-07-20"
    }
  ]
  ```

### 11.2. Update Test Result Status

- **Endpoint:** `/api/test-results/{resultId}`
- **Method:** `PUT`
- **Description:** Updates the status of a test result (e.g., approve, reject).
- **Request Body:**
  ```json
  {
    "status": "approved"
  }
  ```
- **Response Body:**
  ```json
  {
    "success": true
  }
  ```

---

## 12. Billing Page (`/billing`)

### 12.1. Get Billing Data

- **Endpoint:** `/api/billing`
- **Method:** `GET`
- **Description:** Retrieves billing data, including invoices and statements.
- **Response Body:**
  ```json
  {
    "billingData": [
      {
        "accountName": "Blue Cross Blue Shield",
        "billingType": "Invoice",
        "id": "INV001",
        "detail": "Monthly Services",
        "billingPeriod": "2025-06",
        "amount": "$1,500.00"
      }
    ],
    "billedAmountOverTime": {
      "categories": ["2025-01", "2025-02", "2025-03"],
      "series": [{ "name": "Billed Amount", "data": [1000, 1200, 1500] }]
    }
  }
  ```
