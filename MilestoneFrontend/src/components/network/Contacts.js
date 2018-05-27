/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { withRouter } from 'react-router-dom';

import ContactThumbnail from './ContactThumbnail';
import NetworkRequestThumbnail from './NetworkRequestThumbnail';
import NetworkSearch from './NetworkSearch';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Contacts.css';

/////////////////////////////////////////
/// Code

//displays all of a user's contacts and pending requests
function Contacts(props) {
    var connections, 
    requests, 
    displayConnectionsCount, 
    displayConnections, 
    numRequests, 
    displayRequests,
    firstContact,
    search;
    if (props.content) {
        if (props.renderSearch) {
            var networkSearch = <NetworkSearch 
                id="networkSearch"
                contentType={props.contentType}
                handleSearch={props.handleSearch}
            />
        }
        if(props.currUser.pendingRequests.length > 0 && props.showRequests) {
            var count = 0;
            for (let i = 0; i < props.currUser.pendingRequests.length; i++) {
                if (props.currUser.pendingRequests[i].type === "received") {
                    count++;
                }
            }
            numRequests = <h4 className="c-contacts-count"> Requests ({ count })</h4>
        }
        if (!props.showContacts) { 
            displayConnectionsCount = <h4 className="c-contacts-count">
                                        Contacts ({props.content.length})
                                    </h4>;
        }
        if (props.showRequests) {
            var count = 0;
            requests = props.currUser.pendingRequests.map((request) => {
                count++;
                if (request.type === "received") {
                    return (
                        <NetworkRequestThumbnail 
                            path = { '/network/contacts/profile/:id' + request.sender }
                            id = { request.sender }
                            key = { count }
                            userController={props.userController}
                        />
                    );
                }
            })
        }
        connections = props.content.map((connection, i) => {
            return (
                <ContactThumbnail
                    path={ props.isDesktopInvitation ? "/network/contacts/connect/profile/:id" + connection.id : "/network/contacts/profile/:id" + connection.id }
                    id={ connection.id }
                    key={ connection.id }
                    fullName={ connection.fullName }
                    className = {props.match.params.id == ":id" + connection.id && ' selectedMessage '} 
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
            {networkSearch}
            {!props.isDesktopInvitation && numRequests}
            {!props.isDesktopInvitation && displayRequests}
            {displayConnectionsCount}
            {displayConnections}
        </div>
    );
}

export default withRouter(Contacts);