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
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
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

// --- Main Responsive Layout Component (Authenticated POS Shell) ---
function ResponsiveLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
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
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Login Route (Full Screen, Guest Only) */}
            <Route
              path={ROUTE.LOGIN}
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />

            {/* Protected Routes: All other pages are strictly blocked unless authenticated */}
            <Route
              element={
                <ProtectedRoute>
                  <ResponsiveLayout />
                </ProtectedRoute>
              }
            >
              <Route path={ROUTE.HOME} element={<CashierPage />} />
              <Route path={ROUTE.CASHIER} element={<CashierPage />} />
              <Route path={ROUTE.PRODUCT} element={<ProductPage />} />

              {/* User Registration: Strictly restricted to Admin & Super Admin */}
              <Route
                path={ROUTE.REGISTER}
                element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Any unhandled route redirects to Home, which will bounce to /login if unauthenticated */}
            <Route path="*" element={<Navigate to={ROUTE.HOME} replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
