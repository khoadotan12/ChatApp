import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../css/style.css'
import User from './User'
class OnlineList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }
    }
    render() {
        const { star, uemail, online, messages, uid, loadChat } = this.props;
        let renderList = <p></p>;
        if (online) {
            let temp = Object.keys(online).map((user) => {
                online[user].id = user;
                return online[user];
            })
            if (messages)
                temp = temp.filter((user) => {
                    if (uid === user.id)
                        return false;
                    if (this.state.search !== '')
                        if (user.displayName.toLowerCase().search(this.state.search) !== -1)
                            return true;
                        else
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
                    if (star) {
                        if (star[uid + '_' + a.id] && !star[uid + '_' + b.id])
                            return -1;
                        if (star[uid + '_' + b.id] && !star[uid + '_' + a.id])
                            return 1;
                    }
                    if (a.lastChat === 0 && b.lastChat === 0)
                        return (a.displayName.localeCompare(b.displayName));
                    if (b.lastChat === 0)
                        return -1;
                    if (a.lastChat === 0)
                        return 1;
                    const t1 = new Date(a.lastChat);
                    const t2 = new Date(b.lastChat);
                    if (t2 - t1 !== 0)
                        return t2 - t1;
                    return a.displayName.localeCompare(b.displayName);
                })
            else
                temp = temp.filter((user) => {
                    if (uid === user.id)
                        return false;
                    if (this.state.search !== '')
                        if (user.displayName.toLowerCase().search(this.state.search) !== -1)
                            return true;
                        else
                            return false;
                    return true;
                }).map((user) => {
                        user.lastChat = 0;
                    return user
                }).sort((a, b) => {
                    if (star) {
                        if (star[uid + '_' + a.id] && !star[uid + '_' + b.id])
                            return -1;
                        if (star[uid + '_' + b.id] && !star[uid + '_' + a.id])
                            return 1;
                    }
                    return a.displayName.localeCompare(b.displayName);
                })
            renderList = temp.filter(user => {
                if (uemail === user.email)
                    return false;
                return true;
            }).map((user) => <User key={user.id} user={user} loadChat={loadChat} />);
        }
        return (<div className="people-list" id="people-list">
            <div className="search">
                <input type="text" placeholder="search" onChange={(e) => this.setState({
                    search: e.target.value.replace(new RegExp("\\\\", "g"), "\\\\").toLowerCase()
                })} />
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
    loadChat: PropTypes.func.isRequired,
    uemail: PropTypes.string,
    messages: PropTypes.object,
    uid: PropTypes.string,
    star: PropTypes.object
}

export default OnlineList