import SignupCard from '../Components/SignupCard.js'
import { withRouter } from "../Hooks/withRouter.js";

const SignupPage = ({setOnHomePage}) => {
    setOnHomePage(false);
    
    return (
        <SignupCard/>
    )
}

export default withRouter(SignupPage);