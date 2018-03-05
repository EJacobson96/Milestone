/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/Contacts.css';

/////////////////////////////////////////
/// Code

class Contacts extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };
    }

    render() {
        var connections;
        var displayConnectionsCount;
        var displayConnections;
        if (this.props.content) {
            if (!this.props.showContacts) { 
                displayConnectionsCount = <h5 className="c-contacts-count">Contacts ({this.props.content.length})</h5>;
            }
            connections = this.props.content.map((connection) => {
                return (
                    <Link 
                        to={{
                            pathname: "/Network/Contacts/Profile/:id" + connection.id,
                        }}
                        className='c-contact-card-link-wrapper' 
                        key={connection.id}
                    >
                        <div className="c-contact-card" key={connection.id} >
                            <div className="c-contact-card__user-img">
                                <img src={fakeuser} alt=''/>
                            </div>
                            <div className="c-contact-card__details">
                                <span className="c-contact-card__details__full-name">
                                        {connection.FullName}
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            });
            displayConnections = <div className="l-contacts">{connections}</div>
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