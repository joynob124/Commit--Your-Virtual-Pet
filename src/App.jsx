import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PetName from './pages/PetName';
import PetPage from './pages/PetPage';
import FossilPage from './pages/FossilPage';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);    
  const [petName, setPetName] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserId = localStorage.getItem('userId');
    const savedPetName = localStorage.getItem('petName');
    
    if (savedUser && savedUserId) {
      setUser({ username: savedUser });
      setUserId(parseInt(savedUserId));
      if (savedPetName) {
        setPetName(savedPetName);
      }
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user.username);
      localStorage.setItem('userId', userId);
      if (petName) {
        localStorage.setItem('petName', petName);
      } else {
        localStorage.removeItem('petName');
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('petName');
    }
  }, [user, userId, petName]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user
              ? <Navigate to={petName ? '/pet' : '/name'} replace />
              : <Login onLogin={(userData) => {
                  setUser({ username: userData.username });
                  setUserId(userData.userId);
                  if (userData.petName) setPetName(userData.petName);
                }} />
          }
        />
        <Route
          path="/name"
          element={
            !user
              ? <Navigate to="/" replace />
              : petName
              ? <Navigate to="/pet" replace />
              : <PetName username={user.username} userId={userId} onName={setPetName} />
          }
        />
        <Route
          path="/pet"
          element={
            !user || !petName
              ? <Navigate to="/" replace />
              : <PetPage username={user.username} userId={userId} petName={petName} onLogout={() => {
                  setUser(null);
                  setUserId(null);
                  setPetName(null);
                }} />
          }
        />
        <Route
          path="/fossils"
          element={
            !user || !petName
              ? <Navigate to="/" replace />
              : <FossilPage username={user.username} userId={userId} petName={petName} onLogout={() => {
                  setUser(null);
                  setUserId(null);
                  setPetName(null);
                }} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}