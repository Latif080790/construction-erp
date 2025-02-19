import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeNotification } from '@/store/slices/uiSlice';

const NotificationCenter: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.ui.notifications);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: theme.spacing(8),
        right: theme.spacing(2),
        zIndex: theme.zIndex.snackbar,
        maxWidth: 400,
      }}
    >
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity={notification.type}
          sx={{
            mb: 1,
            width: '100%',
          }}
          onClose={() => handleClose(notification.id)}
        >
          {notification.message}
        </Alert>
      ))}
    </Box>
  );
};

export default NotificationCenter;
