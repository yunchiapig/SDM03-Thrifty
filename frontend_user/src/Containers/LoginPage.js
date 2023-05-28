import { useEffect } from 'react';
import LoginCard from '../Components/LoginCard.jsx'
import { withRouter } from "../Hooks/withRouter.js";

const LoginPage = ({ setOnHomePage }) => {
    useEffect(()=>{
        setOnHomePage(false);
    },[])
    
    // const handleLogin = (user) => {
    //     setCurrentUserInfo(user);
    // }

    return (
        <LoginCard />
    )
}

export default withRouter(LoginPage);