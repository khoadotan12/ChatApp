import { firebaseConnect, withFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import {
    compose,
    withProps,
    withHandlers
} from 'recompose'
import { connect } from 'react-redux'

export default compose(
    firebaseConnect(['chat', 'star']),
    connect(({ firebase, firebase: { auth } }) => ({
        messages: firebase.data.chat,
        star: firebase.data.star,
        uid: auth.uid
    })),
    withFirebase,
    withHandlers({
        starPerson: props => user => {
            const { firebase, uid, star } = props;
            const date = new Date();
            firebase.set('/users/' + uid + '/lastOnline', date.toJSON());
            if (!star)
                return firebase.set('/star/' + uid + '_' + user.id, true);
            if (!star[uid + '_' + user.id])
                return firebase.set('/star/' + uid + '_' + user.id, true);
            return firebase.remove('/star/' + uid + '_' + user.id);
        }
    }),
    withProps(({ messages }) => ({
        mesLoaded: isLoaded(messages),
        mesEmpty: isEmpty(messages)
    })),
)