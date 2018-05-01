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
    
    }

    componentDidMount() {
    }

    render() {
        var connections, 
            requests, 
            displayConnectionsCount, 
            displayConnections, 
            numRequests, 
            displayRequests;
        if (this.props.content) {
            if(this.props.currUser.pendingRequests.length > 0) {
                var count = 0;
                for (let i = 0; i < this.props.currUser.pendingRequests.length; i++) {
                    if (this.props.currUser.pendingRequests[i].type === "received") {
                        count++;
                    }
                }
                numRequests = <h4 className="c-contacts-count"> Requests ({ count })</h4>
            }
            if (!this.props.showContacts) { 
                displayConnectionsCount = <h4 className="c-contacts-count">
                                            Contacts ({this.props.content.length})
                                          </h4>;
            }
            if (this.props.showRequests) {
                requests = this.props.currUser.pendingRequests.map((request) => {
                    if (request.type === "received") {
                        return (
                            <NetworkRequestThumbnail 
                                path = { '/Network/Contacts/Profile/:id' + request.user }
                                id = { request.user }
                                key = { request.user }
                                fullName = { request.fullName }
                                email = { request.email }
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
                        fullName={ connection.fullName }
                    />
                );
            });
            displayConnections = <div className="l-contacts">
                                    { connections }
                                 </div>
            displayRequests = <div className="l-contacts"> 
                                    {requests}
                              </div>
        } 
        return (
            <div> 
                {numRequests}
                {displayRequests}
                {displayConnectionsCount}
                {displayConnections}
            </div>
        );
    }
}

export default withRouter(Contacts);