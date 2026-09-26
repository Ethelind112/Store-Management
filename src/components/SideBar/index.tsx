import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { MenuItems, MenuWidth } from "./constant";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

// interface sidebarProps {
//   mobileOpen: boolean,
//   setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
      setOpen(!open);
    };

    return (
        <>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: open ? MenuWidth : 72,
            flexShrink: 0,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: open ? MenuWidth : 72,
              height: "100vh",
              position: 'relative',
              overflowX: 'hidden',
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            },
          }}
          open={true}
          onClose={handleDrawerToggle}
        >
            <div>
              <Toolbar
                disableGutters
                sx={{
                  px: open ? 3 : 0,
                  justifyContent: open ? 'space-between' : 'center',
                }} >
                  {
                    open && 
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Bright Print
                    </Typography>
                  }
                

                <IconButton onClick={handleDrawerToggle} sx={{ p: 0 }}>
                  <MenuIcon />
                </IconButton>
              </Toolbar>

              <List disablePadding>
                {MenuItems.map((item) => (
                  <ListItem key={item.text} sx={{ px: 1, py: 0.25 }} >
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
                      <ListItemIcon sx={{
                        color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                        justifyContent: 'center',
                      }}>
                        {<item.icon />}
                      </ListItemIcon>

                      {open && <ListItemText primary={item.text} />}
                      
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </Drawer>
        </>
    )
}

export default SideBar
