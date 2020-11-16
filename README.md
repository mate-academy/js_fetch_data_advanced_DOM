1. Replace `<your_account>` with your Github username in the link
    - [DEMO LINK](https://<your_account>.github.io/js_fetch_data_advanced_DOM/)
2. Follow [this instructions](https://mate-academy.github.io/layout_task-guideline/)
    - There are no tests for this task so use `npm run lint` command instead of `npm test`

### Task: Fetch data (advanced)

API Url:
- Details URL: https://mate-academy.github.io/phone-catalogue-static/api/phones/:phoneId.json

The main goal of this task is an advanced using of Promises.

Create next functions:
- `getFirstReceivedDetails` which takes array of phone's ID and `resolves` with the first receiving detail (the fastest response NOT the first in the list). Ignore the other responses;
- `getAllSuccessfulDetails` which takes array of phones' IDs and `resolves` with an array of all successfully received details (errors should be ignored).

(optional) `getThreeFastestDetails` which takes array of phones IDs and `resolves` with an array of the details for the first 3 responses (the fastest).

Hints: 
- You have to use DOM to notify users about resolved or rejected promises. 
- Your elements should have classes `first-received` and `all-successful`.
- `First Received` and `All Successful` should have <h3> headings.
- Names of phones should be <h4> and uppercase.
- All IDs should be in <li> elements.
