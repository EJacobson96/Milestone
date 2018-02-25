/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

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
                    // <div className=".col-xs- connectionCard" key={connection.id}>
                    //     <img className="avatar img-rounded img-responsive" src={fakeuser} alt="Responsive image"/>
                    //     <h4>{connection.FullName}</h4>
                    // </div>
                    <div className="c-contact-card" key={connection.id} >
                        <div className="c-contact-card__user-img">
                            <img src={fakeuser} alt="Responsive image"/>
                        </div>
                        <div className="c-contact-card__details">
                            <span className="c-contact-card__details__full-name">{connection.FullName}</span>
                        </div>
                    </div>
                );
            });
        } else {
            connections = <p></p>;
        }
        return (
            <div className="[ .container-fluid ] l-contacts"> 
                <div className="">
                    {connections}
                </div>
            </div>
        );
    }
}

export default Contacts;