import SubPage from './SubPage';
//import styled from 'styled-components';
//import Paper from '@mui/material/Paper';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<SubPage />} />
            <Route path="/ItemManagement" element={<SubPage />}/>
        </Routes>
    </Router>
     
  );
}

export default App;
