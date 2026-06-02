import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PetName from './pages/PetName';
import PetPage from './pages/PetPage';
import FossilPage from './pages/FossilPage';
import DistractionPage from './pages/DistractionPage';
import './App.css';

function readStoredSession() {
  const savedUser = localStorage.getItem('user');
  const savedUserId = localStorage.getItem('userId');
  const savedPetName = localStorage.getItem('petName');
  const savedPetId = localStorage.getItem('petId');

  if (!savedUser || !savedUserId) {
    return { user: null, userId: null, petName: null, petId: null };
  }

  return {
    user: { username: savedUser },
    userId: parseInt(savedUserId, 10),
    petName: savedPetName || null,
    petId: savedPetId ? parseInt(savedPetId, 10) : null,
  };
}

export default function App() {
  const [session] = useState(readStoredSession);
  const [user, setUser] = useState(session.user);
  const [petName, setPetName] = useState(session.petName);
  const [userId, setUserId] = useState(session.userId);
  const [petId, setPetId] = useState(session.petId);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user.username);
      localStorage.setItem('userId', userId);
      if (petName) localStorage.setItem('petName', petName);
      else localStorage.removeItem('petName');
      if (petId) localStorage.setItem('petId', petId);
      else localStorage.removeItem('petId');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('petName');
      localStorage.removeItem('petId');
    }
  }, [user, userId, petName, petId]);

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
                  setPetName(userData.petName || null);
                  setPetId(userData.petId ?? null);
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
              : <PetName
                  username={user.username}
                  userId={userId}
                  onName={setPetName}
                  onPetId={setPetId}
                />
          }
        />
        <Route
          path="/pet"
          element={
            !user || !petName
              ? <Navigate to="/" replace />
              : <PetPage username={user.username} userId={userId} petName={petName} onPetId={setPetId} onLogout={() => {
                  setUser(null);
                  setUserId(null);
                  setPetName(null);
                  setPetId(null);
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
                  setPetId(null);
                }} />
          }
        />
        <Route
          path="/distractions"
          element={
            !user || !petName
              ? <Navigate to="/" replace />
              : <DistractionPage
                  username={user.username}
                  userId={userId}
                  petId={petId}
                  petName={petName}
                  onPetId={setPetId}
                  onLogout={() => {
                    setUser(null);
                    setUserId(null);
                    setPetName(null);
                    setPetId(null);
                  }}
                />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}