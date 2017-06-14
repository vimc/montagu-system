# Notes on testing
* Test plain old classes the normal way (but currently, I believe we have zero of these!)
* Test **components**:
    - Test rendering by passing in properties and checking that they render the right DOM elements (using React shallow rendering mode to keep sub-components out of the picture)
    - Test actions by simulating user actions and checking that the correct actions are generated
* Test **stores** by setting a store in a given state and then triggering actions and checking that the store mutates in the correct way
* Test **sources** by:
    - Mocking out the sources, triggering 'fetch' actions, and checking the sources get invoked, and that the appropriate child actions get triggered (check both success and failure responses)
    - Full integration test where we just directly invoke the Source.fetch method and check it returns expected data