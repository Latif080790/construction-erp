import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  onUpload: (files: File[]) => Promise<void>;
}

interface UploadingFile extends File {
  id: string;
  progress: number;
  error?: string;
  uploaded?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  onUpload,
}) => {
  const theme = useTheme();
  const [files, setFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate file upload
      newFiles.forEach((file) => {
        const upload = async () => {
          try {
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
              await new Promise((resolve) => setTimeout(resolve, 200));
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id ? { ...f, progress: i } : f
                )
              );
            }

            // Call the actual upload function
            await onUpload([file]);

            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, uploaded: true } : f
              )
            );
          } catch (error) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, error: error.message } : f
              )
            );
          }
        };

        upload();
      });
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (file: UploadingFile) => {
    if (file.error) return <ErrorIcon color="error" />;
    if (file.uploaded) return <SuccessIcon color="success" />;
    return <FileIcon />;
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: `2px dashed ${
            isDragActive ? theme.palette.primary.main : theme.palette.divider
          }`,
          borderRadius: 1,
          backgroundColor: isDragActive
            ? theme.palette.action.hover
            : theme.palette.background.paper,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <UploadIcon
            sx={{
              fontSize: 48,
              color: isDragActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          />
          <Typography variant="h6" component="div" align="center">
            {isDragActive
              ? 'Drop the files here'
              : 'Drag and drop files here, or click to select files'}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Maximum file size: {maxSize / (1024 * 1024)}MB
            {accept && (
              <>
                <br />
                Accepted file types:{' '}
                {Object.entries(accept)
                  .map(([key, value]) => value.join(', '))
                  .join(', ')}
              </>
            )}
          </Typography>
        </Box>
      </Paper>

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeFile(file.id)}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <ListItemIcon>{getFileIcon(file)}</ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  <Box sx={{ width: '100%' }}>
                    {!file.uploaded && !file.error && (
                      <LinearProgress
                        variant="determinate"
                        value={file.progress}
                        sx={{ mt: 1 }}
                      />
                    )}
                    {file.error && (
                      <Typography variant="caption" color="error">
                        {file.error}
                      </Typography>
                    )}
                    {file.uploaded && (
                      <Typography variant="caption" color="success.main">
                        Upload complete
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUpload;
