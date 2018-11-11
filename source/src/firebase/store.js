import { createStore, compose } from 'redux'
import rootReducer from './reducer'
import { firebase as fbConfig } from './config'
import { reactReduxFirebase } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

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
