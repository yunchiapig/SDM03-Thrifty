import SubPage from './SubPage';
import Navbar from '../components/Navbar';
import LogInContainer from './LogInContainer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element = {<LogInContainer />}/>
        <Route path="/signup" element = {<LogInContainer />}/>
        <Route path="/mainpage">
          <Route path="Profile" element={<Navbar children = {<SubPage />} />}/>
          <Route path="ProductManagement" element={<Navbar children = {<SubPage />} />}/>
          <Route path="Settings" element={<Navbar children = {<SubPage />} />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


