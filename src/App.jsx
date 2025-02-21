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
import AppNavBar from './components/AppNavBar';
import AddStories from './admin/AddStories';

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
              {/* <Route path="/" element={<Home />}/> */}
              <Route path="/" element={<AddStories />}/>
              <Route path="/home" element={<Home />}/>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </Container >
      </Router>
    </AuthProvider>
  );  
}

export default App;
