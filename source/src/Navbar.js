import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
  withStateHandlers,
  renderComponent
} from 'recompose'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
import GoogleButton from 'react-google-button'
import './App.css'
class Navbar extends Component {
  render() {
    const { avatarUrl,
      displayName,
      authExists,
      authLoaded,
      googleLogin,
      handleLogout
    } = this.props;
    return (
      <div>
        {authLoaded ? (
          <div>
            {authExists ? (
              // <AccountMenu
              //   avatarUrl={avatarUrl}
              //   displayName={displayName}
              //   onLogoutClick={handleLogout}
              //   goToAccount={goToAccount}
              //   closeAccountMenu={closeAccountMenu}
              //   handleMenu={handleMenu}
              //   anchorEl={anchorEl}
              // />
              <div>
                <p><img className="avatar" src={avatarUrl} alt="avatar" /> {displayName}</p>
                <button className="button" onClick={handleLogout}>Sign out</button>
              </div>
            ) : (
                <GoogleButton onClick={googleLogin} />
              )}
          </div>) : (null)}
      </div>
    );
  }
}
Navbar.propTypes = {
  key: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrl: PropTypes.string,
  authExists: PropTypes.bool,
  handleLogout: PropTypes.func.isRequired,
}

export default compose(
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  // Add props.firebase (used in handlers)
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
      // firebase
      //   .remove('users/' + auth.uid)
      //   .catch(err => {
      //     console.error('Error:', err)
      //     return Promise.reject(err)
      //   })
      firebase.logout()
    },
    googleLogin: props => event => {
      const { firebase, setOid } = props;
      firebase
        .login({ provider: 'google', type: 'popup' })
            .catch(err => console.log(err.message));
    }
  }),
  withProps(({ auth, profile }) => ({
    authExists: !isEmpty(auth),
    authLoaded: isLoaded(auth)
  })),
  flattenProp('profile')
)(Navbar)
