import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './index'

// ─── Typed Redux Hooks ────────────────────────────────────────────────────────
// Always use these instead of the plain useDispatch / useSelector
// so TypeScript knows the full shape of the store.

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
