import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import { useState, useContext } from 'react';
import { AuthProvider, useAuth} from './auth/authentication.jsx';
import AppNavBar from './components/navbar/AppNavBar';
import AddStories from './components/AddStories.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function PrivateRoute({ element, ...rest }) {
  const { userLoggedIn } = useAuth();

  return userLoggedIn ? (
    element
  ) : (
    <Navigate to="/*" replace={true} />
  );
}

function App() {
  return (
    < AuthProvider>
      <Router>  
        <AppNavBar />
          <Container fluid>
            <Routes>
              <Route path="/" element={<AdminDashboard />}/>
              {/* <Route path="/" element={<Home />}/> */}
              <Route path="/home" element={<Home />}/>
              <Route path="*" element={<NotFound />}/>
              {/* to be private */}
              <Route path="/stories+form" element={<AddStories />}/>
            </Routes>
          </Container >
      </Router>
    </AuthProvider>
  );  
}

export default App;
