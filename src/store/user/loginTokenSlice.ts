import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface loginTokenState {
  value: string
}

const initialState: loginTokenState = {
  value: ''
}

export const loginTokenSlice = createSlice({
  name: 'loginToken',
  initialState,
  reducers: {
    setLoginToken (state, action: PayloadAction<string>) {
      state.value = action.payload
    }
  }
})

export const { setLoginToken } = loginTokenSlice.actions

export const loginTokenReducer = loginTokenSlice.reducer
