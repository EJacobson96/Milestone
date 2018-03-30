/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import ContactThumbnail from './ContactThumbnail';

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
                displayConnectionsCount = <h4 className="c-contacts-count">Contacts ({this.props.content.length})</h4>;
            }
            connections = this.props.content.map((connection) => {
                return (
                    // <Link 
                    //     to={{
                    //         pathname: "/Network/Contacts/Profile/:id" + connection.id,
                    //     }}
                    //     className='c-contact-card-link-wrapper' 
                    //     key={connection.id}
                    // >
                    //     <div className="c-contact-card" key={connection.id} >
                    //         <div className="c-contact-card__user-img">
                    //             <img src={fakeuser} alt=''/>
                    //         </div>
                    //         <div className="c-contact-card__details">
                    //             <span className="c-contact-card__details__full-name">
                    //                 {connection.FullName}
                    //             </span>
                    //         </div>
                    //     </div>
                    // </Link>
                    <ContactThumbnail
                        path={ "/Network/Contacts/Profile/:id" + connection.id }
                        id={ connection.id }
                        fullName={ connection.FullName }
                    />
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