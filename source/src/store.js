import { createStore, compose } from 'redux'
import rootReducer from './reducer'
import { firebase as fbConfig } from './config'
import { reactReduxFirebase } from 'react-redux-firebase'
import firebase from 'firebase'

const rrfConfig = { userProfile: 'users', enableLogging: false }
firebase.initializeApp(fbConfig);
export default function configureStore (initialState, history) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(reactReduxFirebase(firebase, rrfConfig))
  )

  return store
}
