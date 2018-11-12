import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../../css/style.css'
class User extends Component {
    minutes_between(time1, time2) {
        const ONE_MINUTE = 1000 * 60;
        const difference_ms = Math.abs(time1.getTime() - time2.getTime());
        return Math.round(difference_ms / ONE_MINUTE);
    }
    render() {
        const { user, loadChat } = this.props;
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
}

User.propTypes = {
    user: PropTypes.object,
    loadChat: PropTypes.func.isRequired
}
export default User;