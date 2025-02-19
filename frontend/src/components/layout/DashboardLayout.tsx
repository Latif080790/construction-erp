import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationCenter from './NotificationCenter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen ? '280px' : '64px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Navbar />
        <Box
          sx={{
            p: 3,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
      <NotificationCenter />
    </Box>
  );
};

export default DashboardLayout;
