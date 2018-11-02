import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoogleButton from 'react-google-button'
import './App.css'
import OnlineList from './OnlineList'
class Navbar extends Component {
  render() {
    const { avatarUrl,
      displayName,
      authExists,
      authLoaded,
      handleLogout,
      googleLogin
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
                <button className="button" onClick={handleLogout}>Sign out</button><br />
                <OnlineList />
              </div>
            ) : (
                <div>
                  <GoogleButton onClick={googleLogin} />
                  <OnlineList />
                </div>
              )}
          </div>) : (null)}
      </div>
    );
  }
}
Navbar.propTypes = {
  displayName: PropTypes.string,
  avatarUrl: PropTypes.string,
  authExists: PropTypes.bool,
  handleLogout: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
}

export default Navbar
