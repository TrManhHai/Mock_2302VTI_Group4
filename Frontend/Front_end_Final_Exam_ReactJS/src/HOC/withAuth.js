import React from 'react';
import { Redirect } from 'react-router-dom';
import Storage from '../Storage/Storage';

function withAuth(AuthenticatedComponent) {

    class HOC extends React.Component {
        render() {
            return (
                !Storage.isAuth() ?
                    <Redirect
                        to={{
                            pathname: "/auth/sign-in"
                        }}
                    />
                    :
                    <AuthenticatedComponent {...this.props} />
            );
        }
    }
    return HOC;
}

export default withAuth;

