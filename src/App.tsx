import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import SideBar from './components/SideBar';
import ProductPage from './pages/product';
import CashierPage from './pages/cashier';
import { AuthProvider } from './context/AuthContext';
import { LoginPage, RegisterPage } from './pages/auth';
import { GuestRoute } from './components/Auth/GuestRoute';
import { ROUTE } from './constants/route';

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
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// --- Main Layout Component ---
function ResponsiveLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <Box component="nav" sx={{ flexShrink: 0 }}>
        <SideBar />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0',
          minWidth: 0,
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

// --- App Root ---
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes (Standalone, without POS sidebar) */}
            <Route
              path={ROUTE.LOGIN}
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path={ROUTE.REGISTER}
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />

            {/* App Layout Routes */}
            <Route element={<ResponsiveLayout />}>
              <Route path={ROUTE.HOME} element={<CashierPage />} />
              <Route path={ROUTE.CASHIER} element={<CashierPage />} />
              <Route path={ROUTE.PRODUCT} element={<ProductPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={ROUTE.HOME} replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
