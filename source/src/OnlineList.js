import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { connect } from 'react-redux'
import {
    compose,
} from 'recompose'
import { firebaseConnect, withFirebase } from 'react-redux-firebase'
class OnlineList extends Component {
    minutes_between(time1, time2) {
        const ONE_MINUTE = 1000 * 60;
        const difference_ms = Math.abs(time1.getTime() - time2.getTime());
        return Math.round(difference_ms / ONE_MINUTE);
    }
    renderUser(user, id) {
        const { loadChat } = this.props;
        const now = new Date();
        const date = new Date(user.lastOnline);
        const left = this.minutes_between(now, date)
        let status = '';
        if (left <= 1)
            status = (<div className="status"><i className="fa fa-circle online"></i> online</div>);
        else
            if (left < 60)
                status = (<div className="status"><i className="fa fa-circle offline"></i> left {left} mins ago </div>);
            else
                if (left < (60 * 24))
                    status = (
                        <div className="status">
                            <i className="fa fa-circle offline"></i> left {Math.round(left / 60)} {Math.round(left / 60) === 1 ? ' hour' : ' hours'}  ago
                            </div>
                    );
                else
                    status = (<div className="status">
                        <i className="fa fa-circle offline"></i> left {Math.round(left / (60 * 24))} {Math.round(left / (60 * 24)) === 1 ? ' day' : ' days'}  ago
                            </div>
                    );
        return (<li key={id} onClick={() => loadChat(user, id)} className="clearfix">
            <img src={user.avatarUrl} width='55' height='55' alt="avatar" />
            <div className="about">
                <div className="name">{user.displayName}</div>
                {status}
            </div>
        </li>);
    }
    render() {
        const { online, uemail } = this.props;
        let renderList;
        if (online) {
            const temp = Object.keys(online).map((user) => {

                return (
                    online[user].id = user,
                    online[user]
                )
            }).sort((a, b) => b.email.localeCompare(a.email));
            console.log(temp);
            renderList = Object.keys(online).map((user) =>
                (
                    uemail !== online[user].email ?
                        this.renderUser(online[user], user) : ''
                ));
        }
        else
            renderList = <p>No user online</p>
        return (<div className="people-list" id="people-list">
            <div className="search">
                <input type="text" placeholder="search" />
                <i className="fa fa-search"></i>
            </div>
            <ul className="list">
                {renderList}
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
    firebaseConnect([{
        path: '/users',
        queryParams: ['orderByChild=email', 'notParsed']
    }]),
    connect(({ firebase }) => ({
        online: firebase.data.users,
        uemail: firebase.auth.email,
    })),
    withFirebase,
)(OnlineList)