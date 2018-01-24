import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/Reducers';

export default function configureStore() {
    const store = createStore(
        reducers,
        applyMiddleware(thunk),
    );
    return store;
}
