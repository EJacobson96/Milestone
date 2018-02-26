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
        if (this.props.content) {
            connections = this.props.content.map((connection) => {
                return (
                    <Link 
                        to={{
                            pathname: "/Network/Contacts/:id" + connection.id,
                            state: {showSearch: false}
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
        } else {
            connections = <p></p>;
        }
        return (
            <div className="l-contacts"> 
                <div className="">
                    {connections}
                </div>
            </div>
        );
    }
}

export default withRouter(Contacts);