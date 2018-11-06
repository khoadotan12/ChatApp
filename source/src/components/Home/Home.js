import React, { Component } from 'react'
import '../../css/App.css'
import Navbar from './Navbar'

let updateLastOnline = false;
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatWith: null
    }
  }
  loatChat(profile) {
    const { authExists } = this.props;
    if (authExists) {
      this.setState({
        chatWith: profile
      })
    }
  }
  handleLogout = () => {
    const { firebase } = this.props;
    firebase.logout();
    this.setState({
      chatWith: null
    });
  }
  updateLastOnline() {
    const { firebase, auth } = this.props;
    const now = new Date();
    firebase.set('/users/' + auth.uid + '/lastOnline', now.toJSON());
    updateLastOnline = true
  }
  render() {
    const { avatarUrl,
      displayName,
      authExists,
      authLoaded,
      googleLogin,
    } = this.props;
    if (authExists && authLoaded && !updateLastOnline)
      this.updateLastOnline()
    return (
      <Navbar user={this.state.chatWith} loadChat={(user) => this.loatChat(user)} googleLogin={googleLogin} authLoaded={authLoaded} authExists={authExists} displayName={displayName} avatarUrl={avatarUrl} handleLogout={() => this.handleLogout()} />
    )
  }
}

export default Home
