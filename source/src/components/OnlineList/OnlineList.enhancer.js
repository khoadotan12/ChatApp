import { connect } from 'react-redux'
import {
    compose,
} from 'recompose'
import { firebaseConnect, withFirebase } from 'react-redux-firebase'
export default compose(
    firebaseConnect([{
        path: '/users',
        queryParams: ['orderByChild=email', 'notParsed']
    }]),
    connect(({ firebase }) => ({
        online: firebase.data.users,
        uemail: firebase.auth.email,
    })),
    withFirebase,
)