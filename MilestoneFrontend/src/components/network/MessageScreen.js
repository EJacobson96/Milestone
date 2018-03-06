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

class MessageScreen extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };
    }


    componentDidMount() {
        this.scrollToBottom();
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
        console.log("hello");
    }

    render() {
        var members = "";
        var messages = "";
        var conversation;
        var displayMembers;
        var displayMessages;
        if (this.state.conversation) {
            conversation = this.state.conversation;
            for (var i = 1; i < conversation.members.length; i++) {
                let memberLength = conversation.members.length;
                if (i === (memberLength - 1)) {
                    members += conversation.members[i].fullName;
                } else {
                    members += conversation.members[i].fullName + ", ";
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
                        <FormControl componentClass="input" placeholder="Message..."/>
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