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
import ListViewPageComponent from './pages/ListViewPage.jsx';
import ArticleViewComponent from './pages/ArticleView.jsx';
import ItemViewComponent from './pages/ItemViewPage.jsx';
import ListViewPageComponent2 from './pages/ListViewPage2.jsx';
import CarouselListPage from './pages/CarouselListPage.jsx';
import ListViewPageComponent3 from './pages/ListViewPage3.jsx';

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
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/80f8f289ebacddaab14d76de7ef8fb715bce4aaf/admin" element={<AdminDashboard />} />
              <Route path="/enterprises/:collectionName" element={<ListViewPageComponent />} />
              <Route path="/update/:collectionName" element={<ListViewPageComponent2 />} />
              <Route path="/slideshow/:collectionName" element={<CarouselListPage />} />
              <Route path="/listview/:collectionName" element={<ListViewPageComponent3 />} />
              <Route path="/read/:collectionName/:dataId" element={<ArticleViewComponent />} />
              <Route path="/view/:collectionName/:dataId" element={<ItemViewComponent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
