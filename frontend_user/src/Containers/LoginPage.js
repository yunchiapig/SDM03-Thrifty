import { useEffect } from 'react';
import LoginCard from '../Components/LoginCard.jsx'
import { withRouter } from "../Hooks/withRouter.js";

const LoginPage = ({currentUserInfo, setCurrentUserInfo, setOnHomePage}) => {
    useEffect(()=>{
        setOnHomePage(false);
    },[])
    
    const handleLogin = (user) => {
        setCurrentUserInfo(user);
    }

    return (
        <LoginCard currentUserInfo={currentUserInfo} setCurrentUserInfo={handleLogin}/>
    )
}

export default withRouter(LoginPage);