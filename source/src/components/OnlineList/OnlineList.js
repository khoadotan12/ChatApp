import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../css/style.css'
class OnlineList extends Component {
    minutes_between(time1, time2) {
        const ONE_MINUTE = 1000 * 60;
        const difference_ms = Math.abs(time1.getTime() - time2.getTime());
        return Math.round(difference_ms / ONE_MINUTE);
    }
    renderUser(user) {
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
        return (<li key={user.id} onClick={() => loadChat(user)} className="clearfix">
            <img src={user.avatarUrl} width='55' height='55' alt="avatar" />
            <div className="about">
                <div className="name">{user.displayName}</div>
                {status}
            </div>
        </li>);
    }
    render() {
        const { uemail, online, messages, uid } = this.props;
        let renderList;
        if (online) {
            let temp = Object.keys(online).map((user) => {
                online[user].id = user;
                return (
                    online[user]
                )
            })
            if (messages)
                temp = temp.filter((user) => {
                    if (uid === user.id)
                        return false;
                    return true;
                }).map((user) => {
                    if (messages[uid]) {
                        if (messages[uid][user.id])
                            user.lastChat = messages[uid][user.id].lastChat;
                        else
                            user.lastChat = 0;
                    }
                    else
                        user.lastChat = 0;
                    return user
                }).sort((a, b) => {
                    if (a.lastChat === 0 && b.lastChat === 0)
                        return (a.id.localeCompare(b.id));
                    if (b.lastChat === 0)
                        return -1;
                    if (a.lastChat === 0)
                        return 1;
                    const t1 = new Date(a.lastChat);
                    const t2 = new Date(b.lastChat);
                    return t2 - t1;
                })
            renderList = temp.filter(user => {
                if (uemail === user.email)
                    return false;
                return true;
            }).map((user) => this.renderUser(user));
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
    loadChat: PropTypes.func.isRequired
}

export default OnlineList