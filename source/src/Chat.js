import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {
    compose,
    withProps
} from 'recompose'
import './style.css'
import { firebaseConnect, withFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
class Chat extends Component {
    handleSend() {
        const { firebase, uid, user } = this.props;
        if (this.input.value !== '' && user !== null) {
            const date = new Date();
            const mes = this.input.value;
            firebase.push('/chat/' + uid + '/' + user.uid, { sent: true, message: mes, date: date.toJSON() });
            firebase.push('/chat/' + user.uid + '/' + uid, { sent: false, message: mes, date: date.toJSON() });
            firebase.set('/users/' + uid + '/lastOnline', date.toJSON());
            this.input.value = '';
        }
        else {
            if (user === null) {
                alert('Please select user');
            }
        }

    }
    days_between(date1, date2) {
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();
        const difference_ms = Math.abs(date1_ms - date2_ms);
        return Math.round(difference_ms / ONE_DAY);
    }
    scrollToBottom = () => {
        const messagesEnd = ReactDOM.findDOMNode(this.messagesEnd);
        messagesEnd.scrollTop = messagesEnd.scrollHeight;
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    render() {
        const { user, messages, mesLoaded, mesEmpty, uid } = this.props;
        if (!user || !uid) {
            return (
                <div className="chat">
                    <div className="chat-header clearfix" style={{ height: 100 }}>
                        <div className="chat-about">
                            <div className="chat-with">Please select user or sign in to continue</div>
                            <div className="chat-num-messages" />
                        </div>
                        <i className="fa fa-star"></i>
                    </div>
                    <div className="chat-history" ref={(el) => { this.messagesEnd = el }} />
                    <div className="chat-message clearfix">
                        <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3" ref={ref => { this.input = ref }}></textarea>
                        <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
      <i className="fa fa-file-image-o"></i>
                        <button>Send</button>
                    </div>
                </div>
            );
        }
        else {
            const empt = (
                <div className="chat">
                    <div className="chat-header clearfix">
                        <img src={user.profile.avatarUrl} width='55' height='55' alt="avatar" />

                        <div className="chat-about">
                            <div className="chat-with">Chat with {user.profile.displayName}</div>
                            <div className="chat-num-messages">already 0 messages</div>
                        </div>
                        <i className="fa fa-star"></i>
                    </div>
                    <div className="chat-history" ref={(el) => { this.messagesEnd = el }} />
                    <div className="chat-message clearfix">
                        <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3" ref={ref => { this.input = ref }}></textarea>
                        <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
    <i className="fa fa-file-image-o"></i>
                        <button onClick={() => this.handleSend()}>Send</button>
                    </div>
                </div>
            );
            if (mesEmpty) {
                return (
                    empt
                )
            }
            else {
                if (mesLoaded) {
                    if (!messages[uid])
                        return (empt);
                    if (!messages[uid][user.uid]) {
                        return (empt);
                    }
                    const mesArr = Object.keys(messages[uid][user.uid]);
                    const mesObj = messages[uid][user.uid];
                    return (
                        <div className="chat">
                            <div className="chat-header clearfix">
                                <img src={user.profile.avatarUrl} width='55' height='55' alt="avatar" />

                                <div className="chat-about">
                                    <div className="chat-with">Chat with {user.profile.displayName}</div>
                                    <div className="chat-num-messages">already {mesArr.length} messages</div>
                                </div>
                                <i className="fa fa-star"></i>
                            </div>
                            <div className="chat-history" ref={(el) => { this.messagesEnd = el }}>
                                <ul>
                                    {mesArr.map((mes) => {
                                        const date = new Date(mesObj[mes].date);
                                        const today = new Date();
                                        if (mesObj[mes].sent)
                                            return (
                                                <li key={mes} className="clearfix">
                                                    <div className="message-data align-right">
                                                        <span className="message-data-time" >{date.toLocaleTimeString()}, {this.days_between(date, today) === 0 ? 'Today' : date.toLocaleDateString('vi-VN')}</span> &nbsp;
            <span className="message-data-name" >Me </span> <i className="fa fa-circle me"></i>

                                                    </div>
                                                    <div className="message other-message float-right">
                                                        {mesObj[mes].message}
                                                    </div>
                                                </li>);
                                        return (
                                            <li key={mes}>
                                                <div className="message-data">
                                                    <span className="message-data-name"><i className="fa fa-circle online"></i> {user.profile.displayName}</span>
                                                    <span className="message-data-time">{date.toLocaleTimeString()}, {this.days_between(date, today) === 0 ? 'Today' : date.toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="message my-message">
                                                    {mesObj[mes].message}
                                                </div>
                                            </li>
                                        )
                                    }
                                    )}
                                </ul>
                            </div>
                            <div className="chat-message clearfix">
                                <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3" ref={ref => { this.input = ref }}></textarea>
                                <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
      <i className="fa fa-file-image-o"></i>
                                <button onClick={() => this.handleSend()}>Send</button>
                            </div>
                        </div>
                    );
                } else {
                    return (<div></div>)
                }
            }
        }
    }
}

Chat.propTypes = {
    uid: PropTypes.string,
    messages: PropTypes.object,
    mesEmpty: PropTypes.bool,
    mesLoaded: PropTypes.bool
}

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
)(Chat);