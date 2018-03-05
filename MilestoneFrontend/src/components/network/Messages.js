/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import moment from 'moment';

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

    render() {
        var conversations;
        var displayConversations;
        var messagesCount;
        var time;
        if (this.props.content) {
            // if (!this.props.showContacts) { 
                messagesCount = <h4 className="c-messages-count">Messages ({this.props.content.length})</h4>;
            // }
            conversations = this.props.content.map((conversation) => {
                var members = "";
                for (let i = 0; i < conversation.members.length; i++) {
                    let memberLength = conversation.members.length;
                    if (this.props.currUser !== conversation.members[i].id && memberLength === 2) {
                        members += conversation.members[i].fullName;
                        i = memberLength;
                    } else if (this.props.currUser !== conversation.members[i].id && memberLength == 3) {
                        members += conversation.members[i].fullName + " & " + (memberLength - 2) + " other";
                        i = memberLength;
                    } else if (this.props.currUser !== conversation.members[i].id && memberLength > 3) {
                        members += conversation.members[i].fullName + " & " + (memberLength - 2) + " others";
                        i = memberLength;
                    }
                }
                time = conversation.messages[0].createdAt;
                if (moment(time).calendar().startsWith('Today')) {
                    time = moment(time).format('hh:mm');
                } else if (moment(time).calendar().startsWith('Yesterday')) {
                    time = 'Yesterday';
                } else {
                    time = moment(time).format('MM/DD/YYYY');
                }
                return (
                    <div className="c-conversation-card" key={conversation.id} >
                        <div className="c-conversation-card__user-img">
                            <img src={fakeuser} alt="User Avatar"/>
                        </div>
                        <div className="c-conversation-card__details">
                            <div className="c-conversation-card__details__name-and-date">
                                <span className="c-conversation-card__details__name">{members}</span>
                                <span className="c-conversation-card__details__date">{time}</span>
                            </div>
                            <p className="c-conversation-card-body">{conversation.messages[0].textBody}</p>
                        </div>
                    </div>
                );
            });
            displayConversations = <div className="l-conversations">{conversations}</div>
        } else {
            conversations = <p className="c-no-conversations"></p>;
        }

        return (
            <div>
                {messagesCount}
                {displayConversations}
            </div>
        );
    }
}

export default Messages;