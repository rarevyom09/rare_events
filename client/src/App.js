import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePage from './pages/CreatePage';
import DashboardPage from './pages/DashboardPage';
import Body from './components/Body';
import CarouselComponent from './components/CarouselComponent';
import { AuthContextProvider } from './AuthContext';
import EventDetail from './pages/EventDetail';
import AvatarPage from './pages/AvatarPage';
import "./App.css";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        {/* Wrap your app with AuthProvider */}
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <CarouselComponent />
                  <HeroSection />
                  {/* <CarouselComponent /> */}
                  <Body />
                </Layout>
              }
            />
            <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
            {/* <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout><RegisterPage /></Layout>} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/avatar" element={<AvatarPage />} />
            <Route path="/create" element={<Layout><CreatePage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route
              path="/event/:id"
              element={
                <Layout>
                  {/* Pass event data by fetching it based on the id parameter */}
                  <EventDetail />
                </Layout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
