import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { connect } from 'react-redux'
import {
    compose,
    flattenProp,
} from 'recompose'
import { firebaseConnect, withFirebase } from 'react-redux-firebase'
class OnlineList extends Component {
    render() {
        const { online, uemail, loadChat } = this.props;
        return (<div className="people-list" id="people-list">
            <div className="search">
                <input type="text" placeholder="search" />
                <i className="fa fa-search"></i>
            </div>
            <ul className="list">
                {online ? Object.keys(online).map((user) =>
                    (
                        uemail !== online[user].profile.email ?
                            <li key={user} onClick={() => loadChat(online[user])} className="clearfix">
                                <img src={online[user].profile.avatarUrl} width='55' height='55' alt="avatar" />
                                <div className="about">
                                    <div className="name">{online[user].profile.displayName}</div>
                                    <div className="status">
                                        <i className="fa fa-circle online"></i> online
                             </div>
                                </div>
                            </li> : ''
                    )
                ) : <p>No user online</p>}
            </ul>
        </div>);
    }
}

OnlineList.propTypes = {
    online: PropTypes.object,
    uemail: PropTypes.string,
    loadChat: PropTypes.func.isRequired
}

export default compose(
    firebaseConnect(['online']),
    connect(({ firebase }) => ({
        online: firebase.data.online,
        uemail: firebase.auth.email,
    })),
    withFirebase,
    flattenProp('profile')
)(OnlineList)