import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.minBudget) queryParams.append('minBudget', params.minBudget);
      if (params.maxBudget) queryParams.append('maxBudget', params.maxBudget);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/gigs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gigs'
      );
    }
  }
);

export const fetchGig = createAsyncThunk(
  'gigs/fetchGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/gigs/${gigId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gig'
      );
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await api.post('/gigs', gigData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create gig'
      );
    }
  }
);

export const updateGig = createAsyncThunk(
  'gigs/updateGig',
  async ({ gigId, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/gigs/${gigId}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update gig'
      );
    }
  }
);

export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (gigId, { rejectWithValue }) => {
    try {
      await api.delete(`/gigs/${gigId}`);
      return gigId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete gig'
      );
    }
  }
);

export const fetchMyPostedGigs = createAsyncThunk(
  'gigs/fetchMyPostedGigs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/gigs/my/posted?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your gigs'
      );
    }
  }
);

export const completeGig = createAsyncThunk(
  'gigs/completeGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/gigs/${gigId}/complete`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete gig'
      );
    }
  }
);

const initialState = {
  gigs: [],
  currentGig: null,
  myPostedGigs: [],
  pagination: null,
  isLoading: false,
  isCreating: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    sort: 'newest',
  },
};

const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateGigBidsCount: (state, action) => {
      const { gigId, increment } = action.payload;
      const gig = state.gigs.find((g) => g._id === gigId);
      if (gig) {
        gig.bidsCount = (gig.bidsCount || 0) + (increment ? 1 : -1);
      }
      if (state.currentGig?._id === gigId) {
        state.currentGig.bidsCount =
          (state.currentGig.bidsCount || 0) + (increment ? 1 : -1);
      }
    },
    updateCurrentGigStatus: (state, action) => {
      if (state.currentGig) {
        state.currentGig.status = action.payload.status;
        state.currentGig.assignedFreelancer = action.payload.assignedFreelancer;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Gigs
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload.gigs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Gig
      .addCase(fetchGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGig = action.payload.gig;
      })
      .addCase(fetchGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Gig
      .addCase(createGig.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isCreating = false;
        state.gigs.unshift(action.payload.gig);
        state.myPostedGigs.unshift(action.payload.gig);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update Gig
      .addCase(updateGig.fulfilled, (state, action) => {
        const index = state.gigs.findIndex(
          (g) => g._id === action.payload.gig._id
        );
        if (index !== -1) {
          state.gigs[index] = action.payload.gig;
        }
        if (state.currentGig?._id === action.payload.gig._id) {
          state.currentGig = { ...state.currentGig, ...action.payload.gig };
        }
      })
      // Delete Gig
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.gigs = state.gigs.filter((g) => g._id !== action.payload);
        state.myPostedGigs = state.myPostedGigs.filter(
          (g) => g._id !== action.payload
        );
      })
      // Fetch My Posted Gigs
      .addCase(fetchMyPostedGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyPostedGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPostedGigs = action.payload.gigs;
      })
      .addCase(fetchMyPostedGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Complete Gig
      .addCase(completeGig.fulfilled, (state, action) => {
        const index = state.myPostedGigs.findIndex(
          (g) => g._id === action.payload.gig._id
        );
        if (index !== -1) {
          state.myPostedGigs[index].status = 'completed';
        }
        if (state.currentGig?._id === action.payload.gig._id) {
          state.currentGig.status = 'completed';
        }
      });
  },
});

export const {
  clearError,
  clearCurrentGig,
  setFilters,
  updateGigBidsCount,
  updateCurrentGigStatus,
} = gigSlice.actions;

export default gigSlice.reducer;
