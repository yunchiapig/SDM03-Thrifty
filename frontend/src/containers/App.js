import SubPage from './SubPage';
import Navbar from '../components/Navbar';
import LogInContainer from './LogInContainer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useStoreAdmin } from '../hooks/useStoreAdmin';



function App() {
  const {loading} = useStoreAdmin();
  return (
    <Router basename='/admin'>
      {loading && <Spinner/>}
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


