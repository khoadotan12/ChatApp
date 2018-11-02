import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar';
import { connect } from 'react-redux'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
  withStateHandlers,
} from 'recompose'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
class Home extends Component {
  render() {
    const { avatarUrl,
      displayName,
      authExists,
      authLoaded,
      handleLogout,
      googleLogin
    } = this.props;
    return (
      <div className="container clearfix">
        <Navbar googleLogin={googleLogin} authLoaded={authLoaded} authExists={authExists} displayName={displayName} avatarUrl={avatarUrl} handleLogout={handleLogout} />
      </div>
    )
  }
}

export default compose(
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  withFirebase,
  withStateHandlers(
    ({ initialState = '' }) => ({
      oid: initialState
    }),
    {
      setOid: ({ oid }) => (newid) => ({
        oid: newid
      })
    }
  ),
  withHandlers({
    handleLogout: props => () => {
      const { firebase, oid, auth } = props;
      firebase.logout()
      return firebase
        .remove('/online/' + oid)
        .catch(err => {
          console.error('Error:', err)
          return Promise.reject(err)
        })
    },
    googleLogin: props => event => {
      const { firebase, setOid } = props;
      firebase
        .login({ provider: 'google', type: 'popup' })
        .then((result) => firebase.push('/online', { profile: result.profile })
        .then((result) => setOid(result.key)))
        .catch(err => console.log(err.message));
    }
  }),
  withProps(({ auth, profile }) => ({
    authExists: !isEmpty(auth),
    authLoaded: isLoaded(auth)
  })),
  flattenProp('profile')
)(Home)
