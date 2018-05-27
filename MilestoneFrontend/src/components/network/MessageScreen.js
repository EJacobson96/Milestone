/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { FormControl, FormGroup, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Axios from 'axios'

/////////////////////////////////////////
/// Images & Styles
import '../../css/network/MessageScreen.css';

/////////////////////////////////////////
/// Code

//initialize websocket that listens for any new changes
const websocket = new WebSocket("wss://api.milestoneapp.org/ws");

//displays all messages from a message thread
class MessageScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        if (id === "") {
            var user;
            this.props.userController.getUser()
            .then(oldData => {
                user = oldData;
                this.props.messageController.getMessages('', oldData.id)
                .then(newData => {
                    this.setState({
                        currUser: user,
                        conversation: newData[0] 
                    })
                })
            })
        } 
        //re-renders page when a message is sent using websockets
        this.scrollToBottom();
        websocket.addEventListener("message", function(event) { 
            var data = JSON.parse(event.data);
            if (this.state.currUser && data.payload.id == this.state.currUser.id) {
                this.renderConversations();
            }
        }.bind(this));  
        this.renderConversations(id); 

    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillReceiveProps(nextProps) {
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        if (currID !== nextID && nextID) {
            this.props.messageController.getSpecificConversation(nextID)
            .then(data => {
                this.setUserData(data);
            })
        }
    }

    //scrolls to bottom of message feed
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    renderConversations() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        if (id) {
            this.props.messageController.getSpecificConversation(id)
            .then(data => {
                this.setUserData(data);
            })
        }
    }

    setUserData(currConversation) {
        this.props.userController.getUser()
            .then(data => {
                this.setState({
                    currUser: data,
                    conversation: currConversation
                });
            })
    }

    //posts a new notification for all users that just received a message in order to refresh
    //their page to see live message updates
    postNotification(conversation, message) {
        for (let i = 0; i < conversation.members.length; i++) {
            if (conversation.members[i].id !== this.state.currUser.id) {
                this.props.userController.getContact(conversation.members[i].id)
                .then((data) => {
                    let notifications = data.notifications;
                    let newNotification = {
                        Sender: "" + this.state.currUser.id,
                        TimeSent: new Date(),
                        Read: false,
                        Body: message,
                        ContentType: "message",
                        ContentRoute: "/network/messages/conversation/:id" + conversation.id,
                    }
                    console.log(newNotification);
                    notifications.push(newNotification);
                    this.props.userController.postNotification(notifications, data.id)
                    .then((data) => {
                        console.log(data);
                    })
                });
            }
        }
    }

    //posts a new message
    handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        var input = this.textInput.value;
        this.textInput.value = "";
        if (input && this.state.currUser.id && this.state.conversation.id) {
            this.props.messageController.postMessage(this.state.currUser.id, this.state.conversation.id, input)
            .then(data => {
                this.setState({
                    conversation: data
                }, () => {
                    this.postNotification(data, input);
                });
            })
        }
    }

    render() {
        var members = "";
        var messages = "";
        var conversation;
        var displayMembers;
        var displayMessages;
        if (this.state && this.state.conversation) {
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
                <form onSubmit={ (e) => this.handleSubmit(e) }>
                    <FormGroup controlId="formControlsTextarea" className="c-messages-input-form">
                        <div className="input-group c-messages-input-group">
                            <FormControl 
                                inputRef={input => this.textInput = input} 
                                componentClass="input" placeholder="Message..." 
                                className="messageInput"
                                autoComplete='off'
                            />
                            <span className="input-group-addon" id="basic-addon1">
                                <Glyphicon glyph="circle-arrow-right" onClick={(e) => this.handleSubmit(e)} />
                            </span>
                        </div>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

export default withRouter(MessageScreen);