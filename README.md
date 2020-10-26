1. Replace `<your_account>` with your Github username in the link
    - [DEMO LINK](https://DmytroArkhypenko.github.io/js_fetch_data_advanced_DOM/)
2. Follow [this instructions](https://mate-academy.github.io/layout_task-guideline/)
    - There are no tests for this task so use `npm run lint` command instead of `npm test`

### Task: Fetch data (advanced)

API Url:
- Details URL: https://mate-academy.github.io/phone-catalogue-static/api/phones/:phoneId.json

The main goal of this task is an advanced using of Promises.

Create next functions:
- `getFirstReceivedDetails` which takes array of phones IDs and `resolves` with the first receiving detail (the fastest response NOT the first in the list). Ignore the other responses.
- `getAllSuccessfulDetails` which takes array of phones IDs and `resolves` with an array of all successfully received details. (errors should be ignored)

(optional) `getThreeFastestDetails` which takes array of phones IDs and `resolves` with an array of the details for the first 3 responses (the fastest).

Hint: It doesn't matter in what way you choose to notify users about resolved or rejected promises. You can use DOM or `console.log`.
