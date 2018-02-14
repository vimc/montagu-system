import thunk from 'redux-thunk';
const configureReduxMockStore  = require('redux-mock-store');

export const createMockStore = (initialState: any = {}) => {
    const middlewares: any = [thunk]
    const mockStore = configureReduxMockStore(middlewares);
    return mockStore(initialState);
}