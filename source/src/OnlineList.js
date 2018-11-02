import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './style.css';
import { connect } from 'react-redux'
import {
    withHandlers,
    withStateHandlers,
    compose,
    withProps,
    flattenProp,
} from 'recompose'
import { firebaseConnect, withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
class OnlineList extends Component {
    render() {
        const { online, uemail } = this.props;
        return (<div className="people-list" id="people-list">
            <div className="search">
                <input type="text" placeholder="search" />
                <i className="fa fa-search"></i>
            </div>
            <ul className="list">
                {online ? Object.keys(online).map((user) =>
                    (
                        uemail !== online[user].email ?
                            <li key={user} onClick={() => console.log('click')} className="clearfix">
                                <img src={online[user].avatarUrl} width='55' height='55' alt="avatar" />
                                <div className="about">
                                    <div className="name">{online[user].displayName}</div>
                                    <div className="status">
                                        <i className="fa fa-circle online"></i> online
                             </div>
                                </div>
                            </li> : uemail
                    )
                ) : <p>No user online</p>}
            </ul>
        </div>);
    }
}

OnlineList.propTypes = {
    online: PropTypes.object,
    uemail: PropTypes.string,
}

export default compose(
    firebaseConnect(['users']),
    connect(({ firebase }) => ({
        online: firebase.data.users,
        uemail: firebase.auth.email,
    })),
    withFirebase,
    withStateHandlers(
        ({ initialState = '' }) => ({
            oid: initialState
        }),
        {
            setOid: ({ oid }) => (newid) => ({
                oid: newid
            })
        }
    ),
    // Flatten profile so that avatarUrl and displayName are available
    flattenProp('profile')
)(OnlineList)