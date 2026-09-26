import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import { HashRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { MenuItems } from './components/SideBar/constant';
import SideBar from './components/SideBar';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

// --- Route Components ---
const Home = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom>Home</Typography>
    <Typography variant="body1">
      Welcome to the Home page! This is a responsive sidebar template using Material-UI and React Router.
    </Typography>
  </Box>
);

const Dashboard = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom>Dashboard</Typography>
    <Typography variant="body1">
      Here is your dashboard overview. Resize the window to see the sidebar collapse into a mobile-friendly drawer.
    </Typography>
  </Box>
);

// --- Main Layout Component ---
function ResponsiveLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', height: "100vh" }}>
      <CssBaseline />

      <Box
        component="nav"
        sx={{ flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
          <SideBar />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <AppBar
          position="static"
          sx={{
            ml: { sm: `${drawerWidth}px` },
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {MenuItems.find(item => item.path === location.pathname)?.text || 'App'}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, overflow: "auto" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

// --- App Root ---
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Parent Route: The Layout */}
          <Route element={<ResponsiveLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}