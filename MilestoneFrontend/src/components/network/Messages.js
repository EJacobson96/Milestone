/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/Messages.css';

/////////////////////////////////////////
/// Code

class Messages extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    getCurrentUser(currConversation) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me', 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    currUser: data,
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        var conversations;
        var displayConversations;
        var messagesCount;
        var time;
        var firstMessage;
        if (this.props.content && this.state.currUser) {
            // var firstMessage = document.getElementsByClassName("c-conversation-card");
            // if (firstMessage.length > 0) {
            //     firstMessage.classList[0].remove("selectedMessage");
            // }
            messagesCount = <h4 className={this.props.content.length === 0 ? " c-message-count-border" : " c-messages-count" }>Messages ({this.props.content.length})</h4>;
            conversations = this.props.content.map((conversation, i) => {
                firstMessage = "";
                if (this.props.match.params.id) {
                    var id = this.props.match.params.id.substring(3, this.props.match.params.id.length);
                    if (id === "" && i === 0) {
                        firstMessage = " selectedMessage"
                    }
                }
                var members = "";
                for (let i = 0; i < conversation.members.length; i++) {
                    let memberLength = conversation.members.length;
                    if (conversation.members[i].id != this.state.currUser.id && members != "") {
                        members += ", " + conversation.members[i].fullName;
                    } else if (conversation.members[i].id != this.state.currUser.id) {
                        members += conversation.members[i].fullName;
                    }
                }
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
                            pathname: "/Network/Messages/Conversation/:id" + conversation.id,
                        }}
                        className='c-contact-card-link-wrapper'  
                        key={conversation.id}
                    >
                        <div className={`c-conversation-card ${firstMessage} ${this.props.match.params.id == ":id" + conversation.id && 'selectedMessage'}`} key={conversation.id} >
                            <div className="c-conversation-card__user-img">
                                <img src={fakeuser} alt="User Avatar"/>
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
            // displayConversations = <div className="l-conversations">{conversations}</div>
        } else {
            conversations = <p className="c-no-conversations"></p>;
        }

        return (
            <div className="l-conversations">
                {messagesCount}
                {conversations}
            </div>
        );
    }
}

export default withRouter(Messages);