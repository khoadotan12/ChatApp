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
        uid: auth.uid,
    })),
    withFirebase,
    withHandlers({
        handleUpload: props => file => {
            const { firebase, uid, user } = props;
            const options = {
                metadataFactory: response => {
                    const { metadata: {
                        cacheControl,
                        contentLanguage,
                        customMetadata,
                        ...data
                    } } = response
                    return data
                }
            }
            const date = new Date();
            return firebase.uploadFile('images/' + uid, file, 'users/' + uid + '/images', options)
                .then(result => {
                    firebase.push('/chat/' + uid + '/' + user.id, { sent: true, message: result.downloadURL, date: date.toJSON() })
                        .then(() => firebase.set('/chat/' + uid + '/' + user.id + '/lastChat', date.toJSON()));
                    firebase.push('/chat/' + user.id + '/' + uid, { sent: false, message: result.downloadURL, date: date.toJSON() })
                        .then(() => firebase.set('/chat/' + user.id + '/' + uid + '/lastChat', date.toJSON()));
                });
        },
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