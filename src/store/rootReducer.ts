import { combineReducers } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import authReducer from '@/components/auth/store/authSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
})
