/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { withRouter } from 'react-router-dom';

import ContactThumbnail from './ContactThumbnail';
import NetworkRequestThumbnail from './NetworkRequestThumbnail';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Contacts.css';

/////////////////////////////////////////
/// Code

class Contacts extends React.Component {

    render() {
        var connections, 
            requests, 
            displayConnectionsCount, 
            displayConnections, 
            numRequests, 
            displayRequests,
            firstContact;
        if (this.props.content) {
            if(this.props.currUser.pendingRequests.length > 0 && this.props.showRequests) {
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
            connections = this.props.content.map((connection, i) => {
                // firstContact = "";
                // if (this.props.match.params.id) {
                //     var id = this.props.match.params.id.substring(3, this.props.match.params.id.length);
                //     if (id === "" && i === 0) {
                //         firstContact = " selectedMessage "
                //     }
                // }
                return (
                    <ContactThumbnail
                        path={ this.props.isDesktopInvitation ? "/Network/Contacts/Connect/Profile/:id" + connection.id : "/Network/Contacts/Profile/:id" + connection.id }
                        id={ connection.id }
                        key={ connection.id }
                        fullName={ connection.fullName }
                        className = {this.props.match.params.id == ":id" + connection.id && ' selectedMessage '} 
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
            <div className="contacts"> 
                {!this.props.isDesktopInvitation && numRequests}
                {!this.props.isDesktopInvitation && displayRequests}
                {displayConnectionsCount}
                {displayConnections}
            </div>
        );
    }
}

export default withRouter(Contacts);