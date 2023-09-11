import { createStore, AnyAction } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { io } from 'socket.io-client';
import { ip } from '../utils/ip';


// Define the AppState interface
interface AppState {
  user: {
    id: number;
    id_42: number;
    displayname: string;
    email: string | null;
    twofactoremail: string | null;
    avatarurl: string;
    isverified: boolean | null;
    istwofactorenabled: boolean;
    wins: number;
    losses: number;
    status:number
  } | null;
}

// Define the initial state
const initialState: AppState = {
  user: null,
};

// Define the SET_USER action type constant
const SET_USER = 'SET_USER';

const SOCKET_CONNECT = 'SOCKET_CONNECT'
// Define the SetUserAction interface
interface SetUserAction extends AnyAction {
  payload: AppState['user'];
}


// Define the reducer function
function reducer(state = initialState, action: SetUserAction): AppState {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

// Define the persist config
const persistConfig = {
  key: 'root',
  storage,
};

export function setUser(user: AppState['user']): SetUserAction {
  console.log("payload",user);
  return {
    type: SET_USER,
    payload: user,
  };
}

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Create the Redux store
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export const connectSocket = () => (dispatch, getState) => {
  const { user } = getState(); // Assuming 'user' is stored in the Redux state

  const socket = io(`${ip}:4000/pong`, {
    auth: {
      headers: {
        'USER': JSON.stringify({ user }),
      },
    },
  });

  dispatch({
    type: SOCKET_CONNECT,
    payload: socket,
  });
};
// Export the store and persistor
export { store, persistor };