import { firebaseConnect, withFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import {
    compose,
    withProps
} from 'recompose'
import { connect } from 'react-redux'

export default compose(
    firebaseConnect(['chat']),
    connect(({ firebase, firebase: { auth } }) => ({
        messages: firebase.data.chat,
        uid: auth.uid
    })),
    withFirebase,
    withProps(({ messages }) => ({
        mesLoaded: isLoaded(messages),
        mesEmpty: isEmpty(messages)
    })),
)