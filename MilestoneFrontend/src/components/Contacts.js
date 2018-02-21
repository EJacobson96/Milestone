/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import Axios from 'axios';

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
            value: ''
        };
        this.getUserConnections();
    }

    // componentDidMount() {
	// }

    getUserConnections() {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/connections', 
            {
                headers: {
                    'Authorization' : localStorage.getItem('Authorization')
                }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.setState({
                    connections: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    render() {
        var connections = <p>No connections yet.</p>;
        console.log(this.state.connections);
        if (this.state.connections) {
            connections = this.state.connections.map((connection) => {
                return (
                    <div className=".col-xs- connectionCard">
                        <img className ="avatar img-rounded img-responsive" src={fakeuser} alt="Responsive image"/>
                        <h4>{connection.FullName}</h4>
                    </div>
                );
            });
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