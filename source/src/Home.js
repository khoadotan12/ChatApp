import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar'
import { connect } from 'react-redux'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
} from 'recompose'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatWith: null
    }
  }
  loatChat(user) {
    const { authExists } = this.props;
    if (authExists) {
      this.setState({
        chatWith: user
      })
    }
  }
  handleLogout = () => {
    const { firebase, auth } = this.props;
    firebase.logout();
    firebase
      .remove('/online/' + auth.uid)
      .catch(err => {
        console.error('Error:', err)
        Promise.reject(err)
      })
    this.setState({
      chatWith: null
    });
  }
  render() {
    const { avatarUrl,
      displayName,
      authExists,
      authLoaded,
      googleLogin,
    } = this.props;
    return (
      <Navbar user={this.state.chatWith} loadChat={(user) => this.loatChat(user)} googleLogin={googleLogin} authLoaded={authLoaded} authExists={authExists} displayName={displayName} avatarUrl={avatarUrl} handleLogout={() => this.handleLogout()} />
    )
  }
}

export default compose(
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  withFirebase,
  withHandlers({
    googleLogin: props => event => {
      const { firebase } = props;
      firebase
        .login({ provider: 'google', type: 'popup' })
        .then((result) => firebase.set('/online/' + result.user.uid, { profile: result.profile, uid: result.user.uid }))
        .catch(err => console.log(err.message));
    }
  }),
  withProps(({ auth }) => ({
    authExists: !isEmpty(auth),
    authLoaded: isLoaded(auth)
  })),
  flattenProp('profile')
)(Home)
