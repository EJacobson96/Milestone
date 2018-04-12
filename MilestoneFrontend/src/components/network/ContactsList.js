/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

import Axios from 'axios';
import { withRouter, Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ContactsList.css';
import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

class ContactsList extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/connections?&id=' + this.props.user.id, 
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
                    contacts: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    getQuery() {
        var searchQuery = this.props.location.pathname;
        searchQuery = searchQuery.substring(31, searchQuery.length)
        return searchQuery;
    }

    render() {
        var contactList;
        if (this.state.contacts) {
            contactList = this.state.contacts.map((contact) => {
                var query =  this.getQuery();
                return (
                    <Link 
                        to={{
                            pathname: '/Network/Messages/New/' + query +  ' ' + contact.id,
                        }}
                        className='c-contact-card-link-wrapper' 
                        key={ contact.id }
                    >
                        <div className="c-contact-card" key={ contact.id } >
                            <div className="c-contact-card__user-img">
                                <img src={fakeuser} alt=''/>
                            </div>
                            <div className="c-contact-card__details">
                                <span className="c-contact-card__details__full-name">
                                    { contact.fullName }
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })
        }
        return (
            <div>
                <h3 className="c-contact-list-header">Contacts</h3>
                <div>
                    {contactList}
                </div>
            </div>
        );

    }
}

export default withRouter(ContactsList);