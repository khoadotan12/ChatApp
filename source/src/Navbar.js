import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoogleButton from 'react-google-button'
import './App.css'
import OnlineList from './OnlineList'
import Chat from './Chat'
import logo from './logo.svg'
class Navbar extends Component {
  render() {
    const { avatarUrl,
      displayName,
      authExists,
      authLoaded,
      handleLogout,
      googleLogin,
      loadChat,
      user
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
                <div className="info">
                  <p><img className="avatar" src={avatarUrl} alt="avatar" /> {displayName}</p>
                  <button className="button" onClick={handleLogout}>Sign out</button>
                </div>
                <div className="container clearfix">
                  <OnlineList loadChat={(user) => loadChat(user)} />
                  <Chat user={user} />
                </div>
              </div>
            ) : (
                <div className='App'>
                  <div className='App-header'>
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                      Welcome
          </p><br />
                    <GoogleButton onClick={googleLogin} />
                  </div>
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
  authLoaded: PropTypes.bool,
  handleLogout: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  loadChat: PropTypes.func.isRequired
}

export default Navbar