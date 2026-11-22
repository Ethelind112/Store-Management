import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { MenuItems, AdminMenuItems, MenuWidth } from "./constant";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ROUTE } from "../../constants/route";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTE.LOGIN);
  };

  const isAdminOrSuper = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const roleLabel =
    user?.role === 'SUPER_ADMIN'
      ? 'Super Admin'
      : user?.role === 'ADMIN'
      ? 'Admin Toko'
      : 'Kasir';

  const roleBgColor =
    user?.role === 'SUPER_ADMIN'
      ? '#fce4ec'
      : user?.role === 'ADMIN'
      ? '#fff3e0'
      : 'primary.light';

  const roleTextColor =
    user?.role === 'SUPER_ADMIN'
      ? '#c2185b'
      : user?.role === 'ADMIN'
      ? '#e65100'
      : 'primary.contrastText';

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        width: open ? MenuWidth : 72,
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: open ? MenuWidth : 72,
          height: '100vh',
          position: 'relative',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
      open={true}
      onClose={handleDrawerToggle}
    >
      {/* Top Section */}
      <Box>
        <Toolbar
          disableGutters
          sx={{
            px: open ? 3 : 0,
            justifyContent: open ? 'space-between' : 'center',
          }}
        >
          {open && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 'bold', color: 'primary.main', cursor: 'pointer' }}
              onClick={() => navigate(ROUTE.HOME)}
            >
              Bright Print
            </Typography>
          )}

          <IconButton onClick={handleDrawerToggle} sx={{ p: 0.5 }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Regular Menu Items */}
        <List disablePadding>
          {MenuItems.map((item) => (
            <ListItem key={item.text} sx={{ px: 1, py: 0.25 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                }}
                sx={{
                  justifyContent: open ? 'flex-start' : 'center',
                  borderRadius: 3,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                    justifyContent: 'center',
                  }}
                >
                  {<item.icon />}
                </ListItemIcon>

                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Admin Only Menu Items */}
        {isAdminOrSuper && (
          <>
            <Box sx={{ px: 2, pt: 2, pb: 0.5 }}>
              {open ? (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    letterSpacing: 0.8,
                  }}
                >
                  Administrasi
                </Typography>
              ) : (
                <Divider sx={{ my: 0.5 }} />
              )}
            </Box>

            <List disablePadding>
              {AdminMenuItems.map((item) => (
                <ListItem key={item.text} sx={{ px: 1, py: 0.25 }}>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                      navigate(item.path);
                    }}
                    sx={{
                      justifyContent: open ? 'flex-start' : 'center',
                      borderRadius: 3,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                        justifyContent: 'center',
                      }}
                    >
                      {<item.icon />}
                    </ListItemIcon>

                    {open && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* Bottom User / Authentication Section */}
      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ mb: 1.5 }} />

        {isAuthenticated && user ? (
          open ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                borderRadius: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}
                  >
                    {user.username}
                  </Typography>
                  <Chip
                    label={roleLabel}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      mt: 0.25,
                      bgcolor: roleBgColor,
                      color: roleTextColor,
                    }}
                  />
                </Box>
              </Box>

              <Tooltip title="Keluar (Logout)" arrow>
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' },
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip title={`Keluar (${user.username} - ${roleLabel})`} arrow placement="right">
                <IconButton
                  size="medium"
                  onClick={handleLogout}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        ) : open ? (
          <ListItemButton
            onClick={() => navigate(ROUTE.LOGIN)}
            sx={{
              borderRadius: 2.5,
              justifyContent: 'flex-start',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.main',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  Masuk (Login)
                </Typography>
              }
            />
          </ListItemButton>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Masuk (Login)" arrow placement="right">
              <IconButton
                color="primary"
                onClick={() => navigate(ROUTE.LOGIN)}
                sx={{
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': { bgcolor: 'primary.main', color: '#ffffff' },
                }}
              >
                <LoginIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SideBar;
