import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleSSO() {

    return (
        <GoogleOAuthProvider clientId="636917912441-ftgs48a9v4s8m0gr5kibu7ih440clecv.apps.googleusercontent.com">
            <GoogleLogin
            // render={renderProps => (
            //     <button onClick={renderProps.onClick}>This is my custom Google button</button>
            // )}
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            />
        </GoogleOAuthProvider>
    );
}

export default GoogleSSO;