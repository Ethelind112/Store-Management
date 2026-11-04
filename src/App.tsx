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
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
