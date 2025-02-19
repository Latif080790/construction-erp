import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Project, Phase, Task, PaginatedResponse, ApiError } from '@/types';
import api from '@/services/api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

export const fetchProjects = createAsyncThunk<
  PaginatedResponse<Project>,
  { page?: number; search?: string },
  { rejectValue: ApiError }
>('projects/fetchProjects', async ({ page = 1, search = '' }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/?page=${page}&search=${search}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchProjectById = createAsyncThunk<
  Project,
  number,
  { rejectValue: ApiError }
>('projects/fetchProjectById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createProject = createAsyncThunk<
  Project,
  Partial<Project>,
  { rejectValue: ApiError }
>('projects/createProject', async (projectData, { rejectWithValue }) => {
  try {
    const response = await api.post('/projects/', projectData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateProject = createAsyncThunk<
  Project,
  { id: number; data: Partial<Project> },
  { rejectValue: ApiError }
>('projects/updateProject', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/projects/${id}/`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createPhase = createAsyncThunk<
  Phase,
  { projectId: number; data: Partial<Phase> },
  { rejectValue: ApiError }
>('projects/createPhase', async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/projects/${projectId}/phases/`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createTask = createAsyncThunk<
  Task,
  { phaseId: number; data: Partial<Task> },
  { rejectValue: ApiError }
>('projects/createTask', async ({ phaseId, data }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/phases/${phaseId}/tasks/`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateTask = createAsyncThunk<
  Task,
  { taskId: number; data: Partial<Task> },
  { rejectValue: ApiError }
>('projects/updateTask', async ({ taskId, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch projects';
      })
      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch project';
      })
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.totalCount += 1;
      })
      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      // Create Phase
      .addCase(createPhase.fulfilled, (state, action) => {
        if (state.currentProject) {
          state.currentProject.phases.push(action.payload);
        }
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        if (state.currentProject) {
          const phase = state.currentProject.phases.find(p => p.id === action.payload.phase);
          if (phase) {
            phase.tasks.push(action.payload);
          }
        }
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        if (state.currentProject) {
          const phase = state.currentProject.phases.find(p => p.id === action.payload.phase);
          if (phase) {
            const taskIndex = phase.tasks.findIndex(t => t.id === action.payload.id);
            if (taskIndex !== -1) {
              phase.tasks[taskIndex] = action.payload;
            }
          }
        }
      });
  },
});

export const { clearProjectError, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
