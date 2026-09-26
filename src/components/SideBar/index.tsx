import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: open ? MenuWidth : 100 },
          }}
          open={true}
          onClose={handleDrawerToggle}
        >
            <div>
              <Toolbar
                disableGutters
                sx={{ paddingX: 2, justifyContent: open ? 'space-between' : 'flex-start'}} >
                  {
                    open && 
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Bright Print
                    </Typography>
                  }
                

                <IconButton onClick={handleDrawerToggle} sx={{ p:0 }}>
                  <MenuIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List disablePadding>
                {MenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => {
                        navigate(item.path);
                      }}
                      sx={{
                        paddingX: 2, 
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
                      <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
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