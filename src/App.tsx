import {
  Box,
  CssBaseline,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';
import ProductPage from './pages/product';
import CashierPage from './pages/cashier';

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

// --- Main Layout Component ---
function ResponsiveLayout() {

  return (
    <Box sx={{ display: 'flex', height: "100vh" }}>
        <CssBaseline />

        <Box 
            component="nav"
            sx={{ flexShrink: 0 }}
        >
            <SideBar />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0, overflowY: 'auto' }}>
            <Outlet />
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
          <Route element={<ResponsiveLayout />}>
            <Route path="/" element={<CashierPage />} />
            <Route path="/cashier" element={<CashierPage />} />
            <Route path="/product" element={<ProductPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
