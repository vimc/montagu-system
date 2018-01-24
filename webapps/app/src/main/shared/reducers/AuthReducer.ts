export default (state = {}, action: any) => {
    switch (action.type) {
        case 'AUTHENTICATED':
            return {
                ...state, authenticated: true, errorMessage: '',
            };
        case 'UNAUTHENTICATED':
            return { ...state, authenticated: false, errorMessage: '' };
        case 'AUTHENTICATION_ERROR':
            return { ...state, errorMessage: action.payload };
        default:
            return state;
    }
};
