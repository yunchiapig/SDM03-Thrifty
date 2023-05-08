import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";

function GoogleSSO() {

    const navigate = useNavigate();

    return (
        <GoogleOAuthProvider clientId="636917912441-ftgs48a9v4s8m0gr5kibu7ih440clecv.apps.googleusercontent.com">
            <GoogleLogin
            // render={renderProps => (
            //     <button onClick={renderProps.onClick}>This is my custom Google button</button>
            // )}
            onSuccess={credentialResponse => {
                const data = {'clientId': credentialResponse.clientId, 'credential': credentialResponse.credential};
                axios.post('http://52.193.252.15/api/1.0/user/google', data, { crossdomain: true })
                    .then(response => {
                        console.log(jwt_decode(response.data.message));
                        // setCurrentUserInfo(jwt_decode(response.data.message));
                        window.alert('Login successfully!');
                        navigate('/');
                    })
                    .catch(error => { window.alert('Login failed!');
                    console.log(error);});
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            />
        </GoogleOAuthProvider>
    );
}

export default GoogleSSO;