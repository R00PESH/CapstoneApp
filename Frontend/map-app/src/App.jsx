// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import MapSearch from './components/MapSearch';
// import Login from './components/Login';
// import CustomerFooter from './Customer/CustomerFooter';
// import CustomerHeader from './Customer/CustomerHeader';
// import CustomerDashboard from './Customer/CustomerDashBoard';


// function App() {

//   return <Login/>
//   return <CustomerDashboard/>;

  
// }

// export default App;

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Login from './components/Login';
import CustomerDashboard from './Customer/CustomerDashBoard';

import DashboardLayout from './components/Provider/ProviderDashBoard';
import MapSearch from './components/MapSearch';
import UnifiedLoginPage from './components/OfficialLogin';
import AdminDashboard from './components/Admin/AdminDashBoard';
import InsuranceDashBoard from './components/InsuranceTeam/InsuranceDashBoard';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("aadhaar"));

  // Optional: force check on mount
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("aadhaar"));
  }, []);

  function handleLoginSuccess(aadhaar) {
    setLoggedIn(true);
    localStorage.setItem("aadhaar", aadhaar);
    // Optionally, fetch customer here and save as well
    fetch(`http://localhost:9090/customers/${aadhaar}`)
      .then(resp => resp.ok ? resp.json() : null)
      .then(profile => {
        if (profile) {
          localStorage.setItem("customer", JSON.stringify(profile));
        }
      });
  }

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem("aadhaar");
    localStorage.removeItem("customer");
  }

  return (
    <BrowserRouter>
      {/* <Routes>
        <Route
          path="/"
          element={
            loggedIn
              ? <Navigate to="/dashboard" replace />
              : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/dashboard"
          element={
            loggedIn
              ? <CustomerDashboard onLogout={handleLogout} />
              : <Navigate to="/" replace />
          }
        />
      </Routes> */}
      <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/provider" element={<DashboardLayout />} />
      <Route path="/official" element={<UnifiedLoginPage />}
/>      <Route path="/customer" element={<CustomerDashboard/>} />
      <Route path="/map" element={<MapSearch/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/insurance" element={<InsuranceDashBoard/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
