/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/network/Messages.css';

import NetworkSearch from './NetworkSearch';
/////////////////////////////////////////
/// Code

//displays the messages screen, handles search and renders message threads
class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    componentDidMount() {
        var userImages = {};
        if (this.props.content) {
            for (let i = 0; i < this.props.content.length; i++) {
                let conversation = this.props.content[i];
                for (let j = 0; j < conversation.members.length; j++) {
                    if (conversation.members[j].id !== this.props.currUser.id) {
                        this.props.userController.getContact(conversation.members[j].id)
                        .then((data) => {
                            userImages['' + data.id] = data.photoURL;
                            this.setState({
                                images: userImages
                            })
                        })
                        j = conversation.members.length;
                    } 
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        var userImages = {};
        for (let i = 0; i < this.props.content.length; i++) {
            let conversation = this.props.content[i];
            for (let j = 0; j < conversation.members.length; j++) {
                if (conversation.members[j].id !== this.props.currUser.id) {
                    this.props.userController.getContact(conversation.members[j].id)
                    .then((data) => {
                        userImages['' + data.id] = data.photoURL;
                        this.setState({
                            images: userImages
                        })
                    })
                    j = conversation.members.length;
                } 
            }
        }
    }

    render() {
        var conversations;
        var messagesCount;
        var time;
        var userImg;
        var firstMessage;
        if (this.props.renderSearch) {
            var networkSearch = <NetworkSearch 
                id="networkSearch"
                handleSearch={this.props.handleSearch}
            />
        }
        if (this.state.images) {
            messagesCount = <h4 className={this.props.content.length === 0 ? " c-message-count-border" : " c-messages-count" }>Messages ({this.props.content.length})</h4>;
            conversations = this.props.content.map((conversation, i) => {
                //selects the most recent message thread
                firstMessage = "";
                if (this.props.match.params.id) {
                    var id = this.props.match.params.id.substring(3, this.props.match.params.id.length);
                    if (id === "" && i === 0) {
                        firstMessage = " selectedMessage"
                    }
                }
                var members = "";
                for (let i = 0; i < conversation.members.length; i++) {
                    if (conversation.members[i].id !== this.props.currUser.id && members !== "") {

                        members += ", " + conversation.members[i].fullName;
                    } else if (conversation.members[i].id !== this.props.currUser.id) {
                        members += conversation.members[i].fullName;
                    }
                }
                for (let i = 0; i < conversation.members.length; i++) {
                    if (conversation.members[i].id !== this.props.currUser.id) {
                        userImg = this.state.images[conversation.members[i].id];
                        i = conversation.members.length
                    } 
                }
                //handles formatting the time when the last message was sent
                time = conversation.lastMessage;
                if (moment(time).calendar().startsWith('Today')) {
                    if (moment(time).format('hh:mm A').startsWith('0')) {
                        time = moment(time).format('h:mm A');
                    } else {
                        time = moment(time).format('hh:mm A');
                    }
                } else if (moment(time).calendar().startsWith('Yesterday')) {
                    time = 'Yesterday';
                } else {
                    if (moment(time).format('MM/DD/YYYY').startsWith('0')){
                        time = moment(time).format('M/DD/YYYY');
                    } else {
                        time = moment(time).format('MM/DD/YYYY');
                    }
                }
                return (
                    <Link 
                        to={{
                            pathname: "/network/messages/conversation/:id" + conversation.id,
                        }}
                        className='c-contact-card-link-wrapper'  
                        key={conversation.id}
                    >
                        <div className={`c-conversation-card ${firstMessage} ${this.props.match.params.id === ":id" + conversation.id && 'selectedMessage'}`} key={conversation.id} >
                            <div className="c-conversation-card__user-img">
                                <img src={userImg} alt="User Avatar"/>
                            </div>
                            <div className="c-conversation-card__details">
                                <div className="c-conversation-card__details__name-and-date">
                                    <span className="c-conversation-card__details__name">{members}</span>
                                    <span className="c-conversation-card__details__date">{time}</span>
                                </div>
                                <p className="c-conversation-card-body">{conversation.messages[conversation.messages.length - 1].textBody}</p>
                            </div>
                        </div>
                    </Link>
                );
            });
        }

        return (
            <div className="l-conversations">
                {messagesCount}
                {networkSearch}
                {conversations}
            </div>
        );
    }
}

export default withRouter(Messages);