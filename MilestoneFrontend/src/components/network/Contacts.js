/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import ContactThumbnail from './ContactThumbnail';
import NetworkRequestThumbnail from './NetworkRequestThumbnail';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/Contacts.css';
import fakeRequests from '../testdata/fakerequests.json';

/////////////////////////////////////////
/// Code

class Contacts extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {

        };
    }

    componentDidMount() {
        this.setState({
            requests: fakeRequests.requests
        });
    }

    render() {
        var connections;
        var requests;
        var displayConnectionsCount;
        var displayConnections;
        if (this.props.content) {
            console.log(this.props.content);
            console.log(this.state.requests);
            if(this.state.requests.length > 0) {
                var numRequests = <span>, Requests ({ this.state.requests.length })</span>
            }
            if (!this.props.showContacts) { 
                displayConnectionsCount = <h4 className="c-contacts-count">
                                            Contacts ({this.props.content.length})
                                            { numRequests }
                                          </h4>;
            }
            requests = this.state.requests.map((request) => {
                return (
                    <NetworkRequestThumbnail 
                        path = { '/' }
                        id = { request.id }
                        fullName = { request.FullName }
                    />
                );
            })
            connections = this.props.content.map((connection) => {
                return (
                    <ContactThumbnail
                        path={ "/Network/Contacts/Profile/:id" + connection.id }
                        id={ connection.id }
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