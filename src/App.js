import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homepage/home';
import ThreeDRaffleWheel from './pages/spinPage/spin';
import AdminLogin from './pages/auth/adminLogin';
import AdminLandingPage from './pages/dashboard/adminDashboard';
import VerifyPage from './pages/verify/attendance';
import AddUser from './pages/newUser/add';
import Footer from './components/footer/footer';

const customTheme = extendTheme({
  fonts: {
    heading: 'Sometype Mono, monospace',
    body: 'Sometype Mono, monospace',
  },
  styles: {
    global: {
      body: {
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'Sometype Mono, monospace',
        margin: 0,
      },
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={customTheme}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/spin" element={<ThreeDRaffleWheel />} />
          <Route exact path="/auth" element={<AdminLogin />} />
          <Route exact path="/dashboard" element={<AdminLandingPage />} />
          <Route exact path="/attendance" element={<VerifyPage />} />
          <Route exact path="/add" element={<AddUser />} />


          
        </Routes>
        <Footer />
      </Router>
    </ChakraProvider>
  );
};

export default App;
