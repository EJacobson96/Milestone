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
function Messages(props) {
    var conversations;
    var displayConversations;
    var messagesCount;
    var time;
    var firstMessage;
    var search;
    if (props.renderSearch) {
        var networkSearch = <NetworkSearch 
            id="networkSearch"
            handleSearch={props.handleSearch}
        />
    }
    messagesCount = <h4 className={props.content.length === 0 ? " c-message-count-border" : " c-messages-count" }>Messages ({props.content.length})</h4>;
    conversations = props.content.map((conversation, i) => {
        //selects the most recent message thread
        firstMessage = "";
        if (props.match.params.id) {
            var id = props.match.params.id.substring(3, props.match.params.id.length);
            if (id === "" && i === 0) {
                firstMessage = " selectedMessage"
            }
        }
        var members = "";
        for (let i = 0; i < conversation.members.length; i++) {
            let memberLength = conversation.members.length;
            if (conversation.members[i].id != props.currUser.id && members != "") {
                members += ", " + conversation.members[i].fullName;
            } else if (conversation.members[i].id != props.currUser.id) {
                members += conversation.members[i].fullName;
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
                <div className={`c-conversation-card ${firstMessage} ${props.match.params.id == ":id" + conversation.id && 'selectedMessage'}`} key={conversation.id} >
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

    return (
        <div className="l-conversations">
            {messagesCount}
            {networkSearch}
            {conversations}
        </div>
    );
}

export default withRouter(Messages);