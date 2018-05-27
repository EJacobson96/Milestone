/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

import Axios from 'axios';
import { withRouter, Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ContactsList.css';

/////////////////////////////////////////
/// Code

function ContactsList(props) {

    function getQuery() {
        var searchQuery = props.location.pathname;
        if (searchQuery.includes('contacts')) {
            searchQuery = searchQuery.substring(31, searchQuery.length)
        } else {
            searchQuery = searchQuery.substring(22, searchQuery.length)
        }
        return searchQuery;
    }

    var contactList = props.contacts.map((contact) => {
        var query = getQuery();
        return (
            <Link 
                to={{
                    pathname: '/network/messages/new/' + query +  ' ' + contact.id,
                }}
                className='c-contact-card-list-link-wrapper' 
                key={ contact.id }
            >
                <div className="c-contact-card c-contact-list-card" key={ contact.id } >
                    <div className="c-contact-card__details">
                        <h4>{ contact.fullName }</h4>
                    </div>
                </div>
            </Link>
        );
    })
    return (
        <div className="c-contact-list">
            <h3 className="c-contact-list-header">Contacts</h3>
            <div className="l-contacts">
                {contactList}
            </div>
        </div>
    );
}

export default withRouter(ContactsList);