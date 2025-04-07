import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import { useState, useContext } from 'react';
import { AuthProvider, useAuth } from './auth/authentication.jsx';
import AppNavBar from './components/navbar/AppNavBar';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AccommodationPage from './pages/AccommodationList.jsx';
import ArticleViewComponent from './pages/ArticleView.jsx';

function PrivateRoute({ element, ...rest }) {
  const { userLoggedIn } = useAuth();

  return userLoggedIn ? element : <Navigate to="/*" replace={true} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavBar />
        <div className="content-wrapper">
          <Container fluid>
            <Routes>
              <Route path="/infoguideapp/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/infoguideapp/admin" element={<AdminDashboard />} />
              <Route path="/infoguideapp/accommodations" element={<AccommodationPage />} />
              <Route path="/infoguideapp/:collectionName/:dataId" element={<ArticleViewComponent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
