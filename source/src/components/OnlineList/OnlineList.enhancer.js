import { connect } from 'react-redux'
import {
    compose,
} from 'recompose'
import { firebaseConnect, withFirebase } from 'react-redux-firebase'
export default compose(
    firebaseConnect(['/users', '/chat', '/star']),
    connect(({ firebase, firebase: { auth } }) => ({
        online: firebase.data.users,
        uid: auth.uid,
        messages: firebase.data.chat,
        star: firebase.data.star,
        uemail: auth.email
    })),
    withFirebase,
)