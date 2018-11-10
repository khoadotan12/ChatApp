import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import '../../css/App.css'

class Message extends Component {
    scrollToBottom = () => {
        const messagesEnd = ReactDOM.findDOMNode(this.messagesEnd);
        messagesEnd.scrollTop = messagesEnd.scrollHeight;
    }
    days_between(date1, date2) {
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();
        const difference_ms = Math.abs(date1_ms - date2_ms);
        return Math.round(difference_ms / ONE_DAY);
    }
    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    render() {
        const { mesArr, mesObj, displayName } = this.props;
        return (
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
                                        {mesObj[mes].message.split("\n").map((item, key) => {
                                            try {
                                                new URL(item);
                                                return (
                                                    <div key={key}>
                                                        <a href={item} target="_blank">{item}</a>
                                                    </div>);
                                            } catch (e) {
                                            }
                                            return <div key={key}>{item}<br /></div>
                                        })}
                                    </div>
                                </li>);
                        return (
                            <li key={mes}>
                                <div className="message-data">
                                    <span className="message-data-name"><i className="fa fa-circle online"></i> {displayName}</span>
                                    <span className="message-data-time">{date.toLocaleTimeString()}, {this.days_between(date, today) === 0 ? 'Today' : date.toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="message my-message">
                                    {mesObj[mes].message.split("\n").map((item, key) => {
                                        try {
                                            new URL(item);
                                            return <a key={key} href={item} target="_blank">{item}</a>
                                        } catch (e) {
                                        }
                                        return <div key={key}>{item}<br /></div>
                                    })}
                                </div>
                            </li>
                        )
                    }
                    )}
                </ul>
            </div>
        );
    }
}

Message.propTypes = {
    user: PropTypes.object,
    mesArr: PropTypes.array,
    mesObj: PropTypes.object
}

export default Message