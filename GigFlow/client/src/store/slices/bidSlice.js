import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const createBid = createAsyncThunk(
  'bids/createBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bids', bidData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit bid'
      );
    }
  }
);

export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/bids/my?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bids'
      );
    }
  }
);

export const fetchGigBids = createAsyncThunk(
  'bids/fetchGigBids',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bids/gig/${gigId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bids'
      );
    }
  }
);

export const withdrawBid = createAsyncThunk(
  'bids/withdrawBid',
  async (bidId, { rejectWithValue }) => {
    try {
      await api.delete(`/bids/${bidId}`);
      return bidId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to withdraw bid'
      );
    }
  }
);

export const hireBid = createAsyncThunk(
  'bids/hireBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bids/${bidId}/hire`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to hire freelancer'
      );
    }
  }
);

export const fetchBidStats = createAsyncThunk(
  'bids/fetchBidStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bids/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch statistics'
      );
    }
  }
);

const initialState = {
  myBids: [],
  gigBids: [],
  stats: null,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  isHiring: false,
  error: null,
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGigBids: (state) => {
      state.gigBids = [];
    },
    addNewBid: (state, action) => {
      // Add bid to gig bids if viewing that gig
      state.gigBids.unshift(action.payload);
    },
    updateBidStatuses: (state, action) => {
      const { hiredBidId, gigId } = action.payload;
      // Update bids in gigBids
      state.gigBids = state.gigBids.map((bid) => {
        if (bid._id === hiredBidId) {
          return { ...bid, status: 'hired' };
        }
        if (bid.gig === gigId || bid.gig?._id === gigId) {
          return { ...bid, status: 'rejected' };
        }
        return bid;
      });
      // Update bids in myBids
      state.myBids = state.myBids.map((bid) => {
        if (bid._id === hiredBidId) {
          return { ...bid, status: 'hired' };
        }
        if (bid.gig?._id === gigId && bid._id !== hiredBidId) {
          return { ...bid, status: 'rejected' };
        }
        return bid;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Bid
      .addCase(createBid.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.myBids.unshift(action.payload.bid);
        state.gigBids.unshift(action.payload.bid);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      // Fetch My Bids
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload.bids;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Gig Bids
      .addCase(fetchGigBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGigBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigBids = action.payload.bids;
      })
      .addCase(fetchGigBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Withdraw Bid
      .addCase(withdrawBid.fulfilled, (state, action) => {
        state.myBids = state.myBids.filter((b) => b._id !== action.payload);
        state.gigBids = state.gigBids.filter((b) => b._id !== action.payload);
      })
      // Hire Bid
      .addCase(hireBid.pending, (state) => {
        state.isHiring = true;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isHiring = false;
        // Update bid statuses
        const hiredBidId = action.payload.bid._id;
        state.gigBids = state.gigBids.map((bid) => ({
          ...bid,
          status: bid._id === hiredBidId ? 'hired' : 'rejected',
        }));
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isHiring = false;
        state.error = action.payload;
      })
      // Fetch Stats
      .addCase(fetchBidStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { clearError, clearGigBids, addNewBid, updateBidStatuses } =
  bidSlice.actions;

export default bidSlice.reducer;
