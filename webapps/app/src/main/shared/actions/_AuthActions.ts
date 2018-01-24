// import services from './services';

export const loginAction = (login :string, password: string) => (dispatch: any) => {
    console.log('lgon', 111)
    try {
        // const res = await services().login({ login, password });
        // cookie.save('user', res.data.user, { path: '/' });
        // cookie.save('userToken', res.data.userToken, { path: '/' });
        dispatch({ type: 'AUTHENTICATED' });
        // history.push('/');
    } catch (error) {
        dispatch({
            type: 'AUTHENTICATION_ERROR',
            payload: 'Invalid email or password',
        });
    }
};

export const logoutUser = () => {
    // cookie.remove('user', { path: '/' });
    // cookie.remove('userToken', { path: '/' });
    return {
        type: 'UNAUTHENTICATED',
    };
};

