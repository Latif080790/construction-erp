import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  AttachMoney as BudgetIcon,
  Group as TeamIcon,
  Description as DocumentIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchProjectById } from '@/store/slices/projectSlice';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ProjectTimeline from './components/ProjectTimeline';
import ProjectBudget from './components/ProjectBudget';
import ProjectTeam from './components/ProjectTeam';
import ProjectDocuments from './components/ProjectDocuments';
import ProjectTasks from './components/ProjectTasks';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: '24px' }}>
    {value === index && children}
  </div>
);

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state: RootState) => state.projects);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDelete = () => {
    // Implement project deletion logic
    setDeleteDialogOpen(false);
    navigate('/projects');
  };

  if (loading || !currentProject) {
    return <LinearProgress />;
  }

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
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/projects" color="inherit">
            Projects
          </Link>
          <Typography color="text.primary">{currentProject.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {currentProject.name}
            </Typography>
            <Chip
              label={currentProject.status}
              size="small"
              sx={{
                backgroundColor: getStatusColor(currentProject.status),
                color: '#fff',
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary" component="span">
              Due: {new Date(currentProject.end_date).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={currentProject.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="h6">{currentProject.progress}%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Budget
              </Typography>
              <Typography variant="h4">
                ${currentProject.budget.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentProject.spent_percentage}% spent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Team Members
              </Typography>
              <Typography variant="h4">{currentProject.team_count}</Typography>
              <Typography variant="body2" color="text.secondary">
                Active members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tasks
              </Typography>
              <Typography variant="h4">
                {currentProject.completed_tasks}/{currentProject.total_tasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<TimelineIcon />} label="Timeline" />
          <Tab icon={<BudgetIcon />} label="Budget" />
          <Tab icon={<TeamIcon />} label="Team" />
          <Tab icon={<DocumentIcon />} label="Documents" />
          <Tab icon={<TaskIcon />} label="Tasks" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ProjectTimeline project={currentProject} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ProjectBudget project={currentProject} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ProjectTeam project={currentProject} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ProjectDocuments project={currentProject} />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <ProjectTasks project={currentProject} />
      </TabPanel>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Project"
        content="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default ProjectDetails;
