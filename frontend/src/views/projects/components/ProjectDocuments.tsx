import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Project, Document } from '@/types';

interface ProjectDocumentsProps {
  project: Project;
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return <PdfIcon />;
    case 'image':
      return <ImageIcon />;
    case 'document':
      return <DocumentIcon />;
    default:
      return <FileIcon />;
  }
};

const getFileColor = (type: string, theme: any) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return theme.palette.error.main;
    case 'image':
      return theme.palette.success.main;
    case 'document':
      return theme.palette.info.main;
    default:
      return theme.palette.grey[500];
  }
};

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ project }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocument(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Header with search and filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Project Documents</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {/* Document Categories */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DocumentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">All Documents</Typography>
              </Box>
              <Typography variant="h4">{project.documents.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total files
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PdfIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                <Typography variant="h6">PDFs</Typography>
              </Box>
              <Typography variant="h4">
                {project.documents.filter(doc => doc.type === 'pdf').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ImageIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6">Images</Typography>
              </Box>
              <Typography variant="h4">
                {project.documents.filter(doc => doc.type === 'image').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Image files
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FileIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography variant="h6">Others</Typography>
              </Box>
              <Typography variant="h4">
                {project.documents.filter(doc => !['pdf', 'image'].includes(doc.type)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Other files
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Documents Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Last Modified</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {project.documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          mr: 2,
                          color: getFileColor(document.type, theme),
                        }}
                      >
                        {getFileIcon(document.type)}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          {document.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {document.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={document.type.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getFileColor(document.type, theme),
                        color: '#fff',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatFileSize(document.size)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={document.uploaded_by.avatar}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                      {document.uploaded_by.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(document.last_modified).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={document.status}
                      size="small"
                      color={document.status === 'approved' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, document)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Document Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Rename</MenuItem>
        <MenuItem onClick={handleMenuClose}>Move</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: theme.palette.error.main }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={handleFilterClose}>All Files</MenuItem>
        <MenuItem onClick={handleFilterClose}>PDFs</MenuItem>
        <MenuItem onClick={handleFilterClose}>Images</MenuItem>
        <MenuItem onClick={handleFilterClose}>Documents</MenuItem>
        <MenuItem onClick={handleFilterClose}>Recently Modified</MenuItem>
        <MenuItem onClick={handleFilterClose}>Pending Approval</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProjectDocuments;
