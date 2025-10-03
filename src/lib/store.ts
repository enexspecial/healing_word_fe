import { configureStore } from '@reduxjs/toolkit'
import churchReducer from './slices/churchSlice'
import adminAuthReducer from './slices/adminAuthSlice'

export const store = configureStore({
  reducer: {
    church: churchReducer,
    adminAuth: adminAuthReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
