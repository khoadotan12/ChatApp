import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
} from 'recompose'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
import GoogleButton from 'react-google-button'
import './App.css'
export const Navbar = ({
  avatarUrl,
  displayName,
  authExists,
  authLoaded,
  googleLogin,
  handleLogout
}) => (
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
  )

Navbar.propTypes = {
  displayName: PropTypes.string, // from enhancer (flattenProps - profile)
  // avatarUrl: PropTypes.string, // from enhancer (flattenProps - profile)
  authExists: PropTypes.bool, // from enhancer (withProps - auth)
  handleLogout: PropTypes.func.isRequired, // from enhancer (withHandlers - firebase)
}

export default compose(
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  // Add props.firebase (used in handlers)
  withFirebase,
  withHandlers({
    handleLogout: props => () => {
      props.firebase.logout()
    },
    googleLogin: ({ firebase, showError, router }) => event =>
      firebase
        .login({ provider: 'google', type: 'popup' })
        .catch(err => console.log(err.message)),
  }),
  withProps(({ auth, profile }) => ({
    authExists: !isEmpty(auth),
    authLoaded: isLoaded(auth)
  })),
  // Flatten profile so that avatarUrl and displayName are available
  flattenProp('profile')
)(Navbar)
