/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import Axios from 'axios';
import Contacts from './Contacts.js';

/////////////////////////////////////////
/// Images & Styles
import '../../css/NetworkConnect.css';
import users from '../../img/users.png';

/////////////////////////////////////////
/// Code

class NetworkConnect extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };

        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    
    handleSearch(event) {
        const searchQuery = document.getElementById('networkConnectionSearch').value;
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/participants?q=' + searchQuery,  
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                console.log(data);
                this.setState({ 
                    users: data 
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
    render() {
        var content = <img className="connectionPlaceholder" src={users} />
        if (this.state.users) {
            content = <Contacts content={this.state.users} />
        }
        return (
            <div>
                <form onSubmit={this.handleSearch} className="[ form-inline ]">
					<input id="networkConnectionSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
					<Button className="btn btn-outline-success my-2 my-sm-0" onClick={(e) => this.handleSearch(e)}>
						<Glyphicon glyph="search" /> 
					</Button>
				</form>
                <div className="c-contact-profile__header__profile-name-wrapper">
                    {content}
                </div>
            </div>
        );
    }
}

export default NetworkConnect;