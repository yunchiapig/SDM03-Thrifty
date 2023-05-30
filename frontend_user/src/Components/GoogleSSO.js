import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";

function GoogleSSO() {

    const navigate = useNavigate();

    const handleGoogleSubmit = (credentialResponse) => {
        // e.preventDefault();
        const data = {'clientId': credentialResponse.clientId, 'credential': credentialResponse.credential};
        axios.post('https://thrifty-tw.shop/api/1.0/user/google', data, { crossdomain: true })
            .then(response => {
                // console.log(jwt_decode(response.data.message));
                // setCurrentUserInfo.setCurrentUserInfo(jwt_decode(response.data.message));
                localStorage.setItem('_id', jwt_decode(response.data.message)._id);
                localStorage.setItem('name', jwt_decode(response.data.message).name);
                localStorage.setItem('email', jwt_decode(response.data.message).email);
                localStorage.setItem('favorite_stores', jwt_decode(response.data.message).favorite_stores);
                localStorage.setItem('iat', jwt_decode(response.data.message).iat);
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