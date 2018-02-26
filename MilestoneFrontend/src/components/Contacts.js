/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link } from 'react-router-dom';

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
                    // <div className=".col-xs- connectionCard" key={connection.id}>
                    //     <img className="avatar img-rounded img-responsive" src={fakeuser} alt="Responsive image"/>
                    //     <h4>{connection.FullName}</h4>
                    // </div>
                    <Link className='contactCardLinks' to={'/contacts/:id' + connection.id} >
                        <div className='contactCard' key={connection.id} >
                            <div className='userImage'>
                                <img src={fakeuser} alt='Responsive image'/>
                            </div>
                            <div className='contactDetails'>
                                <h4>{connection.FullName}</h4>
                            </div>
                        </div>
                    </Link>
                );
            });
        } else {
            connections = <p></p>;
        }
        return (
            <div className='connections .container-fluid'> 
                {connections}
            </div>
        );
    }
}

export default Contacts;