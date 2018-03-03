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
        var time;
        if (this.props.content) {
            conversations = this.props.content.map((conversation) => {
                var members = "";
                for (let i = 0; i < conversation.members.length; i++) {
                    let memberLength = conversation.members.length;
                    if (this.props.currUser !== conversation.members[i].id && memberLength === 2) {
                        members += conversation.members[i].fullName;
                        i = memberLength;
                    } else if (this.props.currUser !== conversation.members[i].id) {
                        members += conversation.members[i].fullName + " & " + (memberLength - 1) + " others";;
                    }
                }
                // time = moment(conversation.messages[0].createdAt).calendar(null,{
                //     sameDay: 'HH:MM',
                //     lastDay: 'Yesterday',
                //     sameElse: 'DD/MM/YYYY'
                // });
                time = conversation.messages[0].createdAt;
                if (moment(time).calendar().startsWith('Today')) {
                    time = moment(time).format('hh:mm');
                } else if (moment(time).calendar().startsWith('Yesterday')) {
                    time = 'Yesterday';
                } else {
                    time = moment(time).format('MM/DD/YYYY');
                }
                return (
                    // <Grid className="conversationCard" key={conversation.id}>
                    //     <Row className="show-grid">
                    //         <Col xs={3} md={4}>
                    //             <img className="avatar img-rounded img-responsive" src={fakeuser} alt="Responsive image"/>
                    //         </Col>
                    //         <Col className="messageContent" xs={9} md={8}>
                    //             <h4>{members}</h4>
                    //             <span className="messageTime">{time}</span>
                    //             <p>{conversation.messages[0].textBody}</p>
                    //         </Col>
                    //     </Row>
                    // </Grid>
                    <div className="c-conversation-card" key={conversation.id} >
                        <div className="c-conversation-card__user-img">
                            <img src={fakeuser} alt="User Avatar"/>
                        </div>
                        <div className="c-conversation-card__details">
                            <div className="c-conversation-card__details__name-and-date">
                                <span className="c-conversation-card__details__name">{members}</span>
                                <span className="c-conversation-card__details__date">{time}</span>
                            </div>
                            <p>{conversation.messages[0].textBody}</p>
                        </div>
                    </div>
                );
            });
        } else {
            conversations = <p className="c-no-conversations"></p>;
        }

        return (
            <div className="l-conversations"> 
                {conversations}
            </div>
        );
    }
}

export default Messages;