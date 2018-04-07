/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { withRouter } from 'react-router-dom';

import ContactThumbnail from './ContactThumbnail';
import NetworkRequestThumbnail from './NetworkRequestThumbnail';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Contacts.css';
import fakeRequests from '../testdata/fakerequests.json';

/////////////////////////////////////////
/// Code

class Contacts extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            requests: []
        };
    }

    componentDidMount() {
        console.log(this.props.currUser);
        this.setState({
            requests: this.props.currUser.pendingRequests
        });
    }

    render() {
        var connections;
        var requests;
        var displayConnectionsCount;
        var displayConnections;
        if (this.props.content) {
            if(this.state.requests.length > 0) {
                var count = 0;
                for (let i = 0; i < this.state.requests.length; i++) {
                    if (this.state.requests[i].type === "received") {
                        count++;
                    }
                }
                var numRequests = <span>, Requests ({ count })</span>
            }
            if (!this.props.showContacts) { 
                displayConnectionsCount = <h4 className="c-contacts-count">
                                            Contacts ({this.props.content.length})
                                            { numRequests }
                                          </h4>;
            }
            if (this.props.showRequests) {
                requests = this.state.requests.map((request) => {
                    if (request.type === "received") {
                        return (
                            <NetworkRequestThumbnail 
                                path = { '/Network/Contacts/Profile/:id' + request.user }
                                id = { request.user }
                                key = { request.user }
                                // fullName = { request.FullName }
                            />
                        );
                    }
                })
            }
            connections = this.props.content.map((connection) => {
                return (
                    <ContactThumbnail
                        path={ "/Network/Contacts/Profile/:id" + connection.id }
                        id={ connection.id }
                        key={ connection.id }
                        fullName={ connection.FullName }
                    />
                );
            });
            displayConnections = <div className="l-contacts">
                                    { requests }
                                    { connections }
                                 </div>
        } 
        return (
            <div> 
                {displayConnectionsCount}
                {displayConnections}
            </div>
        );
    }
}

export default withRouter(Contacts);