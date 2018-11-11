import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import '../../css/App.css'

class Chat extends Component {
    handleSend() {
        const { firebase, uid, user } = this.props;
        if (this.input.value !== '' && user !== null) {
            const date = new Date();
            const mes = this.input.value;
            firebase.push('/chat/' + uid + '/' + user.id, { sent: true, message: mes, date: date.toJSON() })
                .then(() => firebase.set('/chat/' + uid + '/' + user.id + '/lastChat', date.toJSON()));
            firebase.push('/chat/' + user.id + '/' + uid, { sent: false, message: mes, date: date.toJSON() })
                .then(() => firebase.set('/chat/' + user.id + '/' + uid + '/lastChat', date.toJSON()));
            firebase.set('/users/' + uid + '/lastOnline', date.toJSON());
            this.input.value = '';
        }
        else {
            if (user === null) {
                alert('Please select user');
            }
        }

    }
    render() {
        const { handleUpload, star, starPerson, user, messages, mesLoaded, mesEmpty, uid } = this.props;
        if (!user || !uid) {
            return (
                <div className="chat">
                    <div className="chat-header clearfix" style={{ height: 100 }}>
                        <div className="chat-about">
                            <div className="chat-with">Please select user or sign in to continue</div>
                            <div className="chat-num-messages" />
                        </div>
                    </div>
                    <div className="chat-history" ref={(el) => { this.messagesEnd = el }} />
                    <div className="chat-message clearfix">
                        <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3" ref={ref => { this.input = ref }}></textarea>
                        <i className="fa fa-file-image-o"></i>
                        <button>Send</button>
                    </div>
                </div>
            );
        }
        else {
            let classStar = 'fa fa-star fa-star-untoggle';
            if (star)
                if (star[uid + '_' + user.id])
                    classStar = 'fa fa-star fa-star-toggle';
            const sendButton =
                <div className="chat-message clearfix">
                    <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3" onKeyDown={(e) => {
                        if ((e.keyCode === 10 || e.keyCode === 13) && e.ctrlKey)
                            this.handleSend();
                    }} ref={ref => { this.input = ref }}></textarea>
                    <i className="fa fa-file-image-o" onClick={() => {
                        let input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/png, image/jpeg, image/bmp, image/gif';
                        input.onchange = (e) => { handleUpload(e.target.files[0]) };
                        input.click();
                    }}></i>
                    <button onClick={() => this.handleSend()}>Send</button>
                </div>
            const empt = (
                <div className="chat">
                    <div className="chat-header clearfix">
                        <img src={user.avatarUrl} width='55' height='55' alt="avatar" />
                        <div className="chat-about">
                            <div className="chat-with">Chat with {user.displayName}</div>
                            <div className="chat-num-messages">already 0 messages</div>
                        </div>
                        <i className={classStar} onClick={() => starPerson(user)}></i>
                    </div>
                    <div className="chat-history" ref={(el) => { this.messagesEnd = el }} />
                    {sendButton}
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
                    if (!messages[uid][user.id]) {
                        return (empt);
                    }
                    const mesArr = Object.keys(messages[uid][user.id]).filter((mes) => {
                        if (mes === 'lastChat')
                            return false;
                        return true;
                    });
                    const mesObj = messages[uid][user.id];
                    return (
                        <div className="chat">
                            <div className="chat-header clearfix">
                                <img src={user.avatarUrl} width='55' height='55' alt="avatar" />
                                <div className="chat-about">
                                    <div className="chat-with">Chat with {user.displayName}</div>
                                    <div className="chat-num-messages">already {mesArr.length} messages</div>
                                </div>
                                <i className={classStar} onClick={() => starPerson(user)}></i>
                            </div>
                            <Message displayName={user.displayName} mesArr={mesArr} mesObj={mesObj} />
                            {sendButton}
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
    user: PropTypes.object,
    messages: PropTypes.object,
    mesEmpty: PropTypes.bool,
    mesLoaded: PropTypes.bool,
    starPerson: PropTypes.func.isRequired,
    star: PropTypes.object
}

export default Chat;