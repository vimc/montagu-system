import React, { Component } from 'react';
import { connect } from 'react-redux';

interface RequireAuthProps {
    authenticated: boolean;
    history: any;
}

export default (AuthedComponent) => {
    class RequireAuth extends Component {
        componentWillMount() {
            if (!this.props.authenticated) {
                this.props.history.push('/login');
            }
        }
        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                this.props.history.push('/login');
            }
        }
        render() {
            return <AuthedComponent {...this.props} />;
        }
    }



    const mapStateToProps = state =>
        ({ authenticated: state.auth.authenticated });

    return connect(mapStateToProps)(RequireAuth);
};
