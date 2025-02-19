import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  AvatarGroup,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowRight as CollapseIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Error as BlockedIcon,
  PlayArrow as InProgressIcon,
} from '@mui/icons-material';
import { Project, Task } from '@/types';

interface ProjectTasksProps {
  project: Project;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <CompletedIcon />;
    case 'in_progress':
      return <InProgressIcon />;
    case 'blocked':
      return <BlockedIcon />;
    default:
      return <PendingIcon />;
  }
};

const getStatusColor = (status: string, theme: any) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return theme.palette.success.main;
    case 'in_progress':
      return theme.palette.info.main;
    case 'blocked':
      return theme.palette.error.main;
    default:
      return theme.palette.warning.main;
  }
};

const getPriorityColor = (priority: string, theme: any) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return theme.palette.error.main;
    case 'medium':
      return theme.palette.warning.main;
    case 'low':
      return theme.palette.success.main;
    default:
      return theme.palette.grey[500];
  }
};

const ProjectTasks: React.FC<ProjectTasksProps> = ({ project }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const handleTaskExpand = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  return (
    <Box>
      {/* Header with search and filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Project Tasks</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search tasks..."
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
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Task Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">
                {project.tasks.length}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(project.completed_tasks / project.tasks.length) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                {project.completed_tasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((project.completed_tasks / project.tasks.length) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" color="info.main">
                {project.tasks.filter(task => task.status === 'in_progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Blocked
              </Typography>
              <Typography variant="h4" color="error.main">
                {project.tasks.filter(task => task.status === 'blocked').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tasks List */}
      {project.tasks.map((task) => (
        <Card key={task.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleTaskExpand(task.id)}
                  sx={{ mt: 0.5, mr: 1 }}
                >
                  {expandedTasks.includes(task.id) ? (
                    <ExpandIcon />
                  ) : (
                    <CollapseIcon />
                  )}
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      icon={getStatusIcon(task.status)}
                      label={task.status}
                      sx={{
                        backgroundColor: getStatusColor(task.status, theme),
                        color: '#fff',
                      }}
                    />
                    <Chip
                      size="small"
                      label={`Priority: ${task.priority}`}
                      sx={{
                        backgroundColor: getPriorityColor(task.priority, theme),
                        color: '#fff',
                      }}
                    />
                    {task.tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="small"
                        label={tag}
                      />
                    ))}
                  </Box>
                  <Collapse in={expandedTasks.includes(task.id)}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                            Assignees:
                          </Typography>
                          <AvatarGroup max={4} sx={{ display: 'inline-flex' }}>
                            {task.assignees.map((assignee) => (
                              <Avatar
                                key={assignee.id}
                                alt={assignee.name}
                                src={assignee.avatar}
                                sx={{ width: 24, height: 24 }}
                              />
                            ))}
                          </AvatarGroup>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Progress:
                        </Typography>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={task.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {task.progress}%
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, task)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Task Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit Task</MenuItem>
        <MenuItem onClick={handleMenuClose}>Change Status</MenuItem>
        <MenuItem onClick={handleMenuClose}>Assign Members</MenuItem>
        <MenuItem onClick={handleMenuClose}>Add Comment</MenuItem>
        <MenuItem onClick={handleMenuClose}>View History</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: theme.palette.error.main }}>
          Delete Task
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={handleFilterClose}>All Tasks</MenuItem>
        <MenuItem onClick={handleFilterClose}>Completed Tasks</MenuItem>
        <MenuItem onClick={handleFilterClose}>In Progress</MenuItem>
        <MenuItem onClick={handleFilterClose}>Blocked Tasks</MenuItem>
        <MenuItem onClick={handleFilterClose}>High Priority</MenuItem>
        <MenuItem onClick={handleFilterClose}>Assigned to Me</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProjectTasks;
