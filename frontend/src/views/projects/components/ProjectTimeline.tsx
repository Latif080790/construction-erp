import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Flag as MilestoneIcon,
  Assignment as TaskIcon,
  Event as EventIcon,
  Build as WorkIcon,
} from '@mui/icons-material';
import { Project, TimelineEvent } from '@/types';

interface ProjectTimelineProps {
  project: Project;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'milestone':
      return <MilestoneIcon />;
    case 'task':
      return <TaskIcon />;
    case 'event':
      return <EventIcon />;
    default:
      return <WorkIcon />;
  }
};

const getEventColor = (type: string, theme: any) => {
  switch (type) {
    case 'milestone':
      return theme.palette.success.main;
    case 'task':
      return theme.palette.info.main;
    case 'event':
      return theme.palette.warning.main;
    default:
      return theme.palette.primary.main;
  }
};

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Project Timeline</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
        >
          Add Event
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Timeline position="alternate">
            {project.timeline.map((event: TimelineEvent, index: number) => (
              <TimelineItem key={event.id}>
                <TimelineOppositeContent color="text.secondary">
                  {new Date(event.date).toLocaleDateString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: getEventColor(event.type, theme) }}>
                    {getEventIcon(event.type)}
                  </TimelineDot>
                  {index < project.timeline.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Card
                    sx={{
                      bgcolor: theme.palette.background.default,
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" component="div">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          {event.assignee && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Assigned to: {event.assignee}
                            </Typography>
                          )}
                        </Box>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      {event.status && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: event.status === 'completed'
                                ? theme.palette.success.light
                                : theme.palette.info.light,
                              color: event.status === 'completed'
                                ? theme.palette.success.dark
                                : theme.palette.info.dark,
                            }}
                          >
                            {event.status}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectTimeline;
