




export default (state = {}, action: any) => {
    switch (action.type) {
        case 'AUTHENTICATED':
            return {
                ...action.data, errorMessage: '',
            };
        case 'UNAUTHENTICATED':
            return {  errorMessage: '' };
        case 'AUTHENTICATION_ERROR':
            return { ...state, errorMessage: action.error };
        default:
            return state;
    }
};
