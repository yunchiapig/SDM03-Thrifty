import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Box, Button, VisuallyHidden } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";

function GoogleSSO(setCurrentUserInfo) {

    const navigate = useNavigate();

    const handleGoogleSubmit = (credentialResponse) => {
        // e.preventDefault();
        const data = {'clientId': credentialResponse.clientId, 'credential': credentialResponse.credential};
        axios.post('http://52.193.252.15/api/1.0/user/google', data, { crossdomain: true })
            .then(response => {
                console.log(jwt_decode(response.data.message));
                setCurrentUserInfo.setCurrentUserInfo(jwt_decode(response.data.message));
                localStorage.setItem('user', jwt_decode(response.data.message).name);
                window.alert('Login successfully!');
                navigate('/');
            })
            .catch(error => { window.alert('Login failed!');
            console.log(error);});
    }

    return (
        <Button key={'Google'} width="full" bgColor={'white'} >
            <GoogleOAuthProvider clientId="636917912441-ftgs48a9v4s8m0gr5kibu7ih440clecv.apps.googleusercontent.com">
                <GoogleLogin
                // render={renderProps => (
                //     <button onClick={renderProps.onClick}>This is my custom Google button</button>
                // )}
                onSuccess={credentialResponse => handleGoogleSubmit(credentialResponse)}
                onError={() => {
                    console.log('Login Failed');
                }}
                />
            </GoogleOAuthProvider>
        </Button>
    );
}

export default GoogleSSO;