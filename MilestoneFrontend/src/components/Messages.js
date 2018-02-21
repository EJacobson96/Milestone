/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../img/fakeuser.png';
import '../css/Contacts.css';

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
        var messages;
        if (this.props.content) {
            messages = this.props.content.map((connection) => {
                return (
                    <div className=".col-xs- connectionCard" key={connection.id}>
                        <img className="avatar img-rounded img-responsive" src={fakeuser} alt="Responsive image"/>
                        <h4>{connection.FullName}</h4>
                    </div>
                );
            });
        } else {
            messages = <p>No messages found.</p>;
        }
        return (
            <div className="connections .container-fluid"> 
                <div className="">
                    {messages}
                </div>
            </div>
        );
    }
}

export default Messages;