import LoginCard from '../Components/LoginCard.jsx'
import { withRouter } from "../Hooks/withRouter.js";

const LoginPage = () => {
    return (
        <LoginCard/>
    )
}

export default withRouter(LoginPage);