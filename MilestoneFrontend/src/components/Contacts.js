/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../img/fakeuser.png';
import '../css/Contacts.css';

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
                    <div className=".col-xs- connectionCard" key={connection.id}>
                        <img className="avatar img-rounded img-responsive" src={fakeuser} alt="Responsive image"/>
                        <h4>{connection.FullName}</h4>
                    </div>
                );
            });
        } else {
            connections = <p>No connections yet.</p>;
        }
        return (
            <div className="connections .container-fluid"> 
                <div className="">
                    {connections}
                </div>
            </div>
        );
    }
}

export default Contacts;