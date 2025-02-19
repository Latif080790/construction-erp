import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as ProjectsIcon,
  AccountBalance as FinanceIcon,
  Build as ResourcesIcon,
  People as HRIcon,
  Description as DocumentsIcon,
  AssignmentTurnedIn as QualityIcon,
  Assessment as ReportsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/slices/uiSlice';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
  { text: 'Finance', icon: <FinanceIcon />, path: '/finance' },
  { text: 'Resources', icon: <ResourcesIcon />, path: '/resources' },
  { text: 'HR', icon: <HRIcon />, path: '/hr' },
  { text: 'Documents', icon: <DocumentsIcon />, path: '/documents' },
  { text: 'Quality', icon: <QualityIcon />, path: '/quality' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? 280 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 280 : 64,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-end' : 'center',
          padding: theme.spacing(1),
          minHeight: 64,
        }}
      >
        {sidebarOpen && (
          <Box
            component="img"
            sx={{
              height: 32,
              marginRight: 'auto',
              marginLeft: theme.spacing(2),
            }}
            alt="Logo"
            src="/logo.png"
          />
        )}
        <IconButton onClick={() => dispatch(toggleSidebar())}>
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: sidebarOpen ? 'initial' : 'center',
                px: 2.5,
                backgroundColor:
                  location.pathname === item.path
                    ? theme.palette.action.selected
                    : 'transparent',
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  color:
                    location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: sidebarOpen ? 1 : 0,
                    color:
                      location.pathname === item.path
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
