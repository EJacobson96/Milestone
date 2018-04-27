/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { FormControl, FormGroup, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Axios from 'axios'

/////////////////////////////////////////
/// Images & Styles
import '../../css/MessageScreen.css';

/////////////////////////////////////////
/// Code
const websocket = new WebSocket("wss://milestoneapi.eric-jacobson.me/ws");

class MessageScreen extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };
    }

    renderConversations() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/conversations/?id=' + id, 
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.getCurrentUser(data);
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    componentDidMount() {
        this.scrollToBottom();
        websocket.addEventListener("message", function(event) { 
            var data = JSON.parse(event.data);
            console.log(data.payload.contentType);
            if (data.payload.contentType === "new message") {
                console.log(this.props);
                this.renderConversations();
            }
        }.bind(this));  
        this.renderConversations();
    }

    componentDidUpdate() {
        this.scrollToBottom();
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
                    conversation: currConversation
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    postNotification(conversation, message) {
        Axios.patch(
            'https://milestoneapi.eric-jacobson.me/notifications',
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                },
                Read: false,
                Body: message,
                ContentType: "new message",
                ContentID: conversation.id,
                Users: conversation.Users,
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                this.setState({
                    conversation: conversation
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        if (currID !== nextID) {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/conversations/?id=' + nextID, 
                {
                    // headers: {
                    //     'Authorization' : localStorage.getItem('Authorization')
                    // }    
                })
                .then(response => {
                    return response.data;
                })
                .then(data => {
                    console.log(data);
                    this.setState({
                        conversation: data
                    });
                })
                .catch(error => {
                    console.log(error);
                }
            );
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    handleSubmit(e) {
        e.preventDefault();
        var input = this.textInput.value;
        this.textInput.value = "";
        Axios.post(
            'https://milestoneapi.eric-jacobson.me/messages?id=' + this.state.currUser.id, 
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }  
                id: this.state.conversation.id,
                TextBody: input 
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.postNotification(data, input);
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        var members = "";
        var messages = "";
        var conversation;
        var displayMembers;
        var displayMessages;
        if (this.state.conversation && this.state.currUser) {
            conversation = this.state.conversation;
            for (var i = 0; i < conversation.members.length; i++) {
                let memberLength = conversation.members.length;
                if (conversation.members[i].id !== this.state.currUser.id && members !== "") {
                    members += ", " + conversation.members[i].fullName;
                } else if (conversation.members[i].id !== this.state.currUser.id) {
                    members += conversation.members[i].fullName;
                }
            }
            messages = this.state.conversation.messages.map((message) => {
                var textBody = message.textBody;
                var classType;
                if (this.state.currUser.id === message.creator) {
                    classType = "c-messages-my-message";
                } else {
                    classType = "c-messages-not-my-message";
                }
                return (
                    <div key={message.id} className={classType}>
                        {textBody}
                    </div>
                );
            });
            displayMessages = messages;
            displayMembers = <h3 className="c-messages-screen-header">{members}</h3>
        }
        return (
            <div className="c-messages-screen-wrapper">
                <div className="c-messages-header-wrapper"> 
                    {displayMembers}
                </div>
                <div className="c-messages-container">
                    {displayMessages}
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>                    
                </div>
                <FormGroup controlId="formControlsTextarea" className="c-messages-input-form">
                    <div className="input-group c-messages-input-group">
                        <FormControl inputRef={input => this.textInput = input} componentClass="input" placeholder="Message..." className="messageInput"/>
                        <span className="input-group-addon" id="basic-addon1">
                            <Glyphicon glyph="circle-arrow-right" onClick={(e) => this.handleSubmit(e)} />
                        </span>
                    </div>
                </FormGroup>
            </div>
        );
    }
}

export default withRouter(MessageScreen);