import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/slices/uiSlice';
import SearchBar from '../common/SearchBar';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state: RootState) => state.ui);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = React.useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {showSearch ? (
          <SearchBar onClose={() => setShowSearch(false)} />
        ) : (
          <>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: theme.palette.text.primary }}
            >
              Construction ERP
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="large"
              onClick={() => setShowSearch(true)}
              sx={{ color: theme.palette.text.secondary }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              size="large"
              onClick={() => dispatch(toggleTheme())}
              sx={{ color: theme.palette.text.secondary }}
            >
              {currentTheme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton
              size="large"
              sx={{ color: theme.palette.text.secondary }}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar
                alt="User Profile"
                src="/avatar.png"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
