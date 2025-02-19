import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { fetchProjects } from '@/store/slices/projectSlice';
import { Project } from '@/types';

const ProjectList: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state: RootState) => state.projects);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects({ page: 1 }));
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'delayed':
        return theme.palette.warning.main;
      case 'on hold':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Projects</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { color: theme.palette.primary.main },
                      }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      {project.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, project)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(project.status),
                        color: '#fff',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(project.end_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/projects/${selectedProject?.id}`);
            handleMenuClose();
          }}
        >
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/projects/${selectedProject?.id}/edit`);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            // Handle project deletion
            handleMenuClose();
          }}
          sx={{ color: theme.palette.error.main }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProjectList;
