import { connect } from 'react-redux'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
} from 'recompose'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'

export default compose(
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  withFirebase,
  withHandlers({
    googleLogin: props => event => {
      const { firebase } = props;
      const date = new Date();
      firebase
        .login({ provider: 'google', type: 'popup' })
        .then((result) => firebase.set('/users/' + result.user.uid + '/lastOnline', date.toJSON()))
        .catch(err => console.log(err.message));
    }
  }),
  withProps(({ auth }) => ({
    authExists: !isEmpty(auth),
    authLoaded: isLoaded(auth)
  })),
  flattenProp('profile')
)