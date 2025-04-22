import { configureStore } from '@reduxjs/toolkit';
import ideReducer from './ideslice';

export const store = configureStore({
  reducer: {
    ide: ideReducer,
  },
});
