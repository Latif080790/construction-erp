import React from 'react';
import { Backdrop, CircularProgress, Typography, Box, useTheme } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Loading...',
}) => {
  const theme = useTheme();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={48} />
        <Typography variant="h6" component="div">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
