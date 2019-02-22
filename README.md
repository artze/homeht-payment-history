# homeht-payment-history

## Set up project
1. Clone repo
2. At project root, install dependencies with `npm install`
3. At project root, run application with `npm start`
4. At project root, run tests with `npm test`

Note: Application establishes connection with mongoDB hosted on mlab

## API usage instructions
- Fetch list of payments with constraints: `contractId`, `startDate`, `endDate`
  - Access API by sending a `GET` request to `http://localhost:3000/contracts/{contractId}/payments?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}`
  - Both `startDate` and `endDate` must be present with format: `YYYY-MM-DD`
  - Example: send `GET` request to `http://localhost:3000/contracts/5c6c513b5e0e2d5e4b9e91bd/payments?startDate=2018-01-01&endDate=2019-09-09`

- Add a new Payment
  - Access API by sending a `POST` request to `http://localhost:3000/contracts/{contractId}/payments`
  - Request body must contain payment details in the following format:
  ```
  {
    description: 'Rent for October 2018',        // String
    value: 300,                                  // Number
    time: '2019-02-22T15:08:55.478Z'             // Date in ISO String
  }
  ```
  - Example: send `POST` request to `http://localhost:3000/contracts/5c6c513b5e0e2d5e4b9e91bd/payments`

- Update existing Payment
  - Access API by sending a `PATCH` request to `http://localhost:3000/contracts/{contractId}/payments/{paymentId}`
  - Request body must contain either of the following fields:
  ```
  {
    description: 'Rent for October 2018',        // String
    value: 300,                                  // Number
    time: '2019-02-22T15:08:55.478Z',            // Date in ISO String
    isImported: true                             // Boolean
  }
  ```
  - Example: send `PATCH` request to `http://localhost:3000/contracts/5c6c513b5e0e2d5e4b9e91bd/payments/5c6c513c5e0e2d5e4b9e91bf`

- Delete existing Payment
  - Access API by sending a `DELETE` request to `http://localhost:3000/contracts/{contractId}/payments/{paymentId}`
  - Example: send `DELETE` request to `http://localhost:3000/contracts/5c6c513b5e0e2d5e4b9e91bd/payments/5c6c513c5e0e2d5e4b9e91bf`

## Notes
- `.env` file is checked in version control for convenience so database connection could be established without further setup
- When creating a new Payment entity, `isDeleted` and `isImported` fields are automatically created with default value of `false`
- Updating payment is only allowed for the following fields to prevent manipulation of critical fields such as `contractId`: 
  - `description`
  - `value`
  - `time`
  - `isImported`
- Update payment is allowed for Payment entities marked as deleted to allow fixing of deleted items that are still in database

## Technical / Design Decisions
- Routes and Controlles are separated for better code organization. Available Routes are more visible
- Database operations are abstracted into db service to allow database layer to be swapped out without touching other areas
- API input validation and transformation of Payment query result format are extracted into separate modules to ensure Single Responsibility Principle for validation, data format transformation and controller

## What Could be Improved if There Was More Time
- Further refactor `validate` module for better code organization
- Write jsDOC for `validate` module
- Forbid delete of payment items that are already marked as deleted
- Enable CORS