/////////////////////////////////////////
/// Pre-baked Component
import React from 'react';
import Axios from 'axios';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/NetworkRequestCard.css';

/////////////////////////////////////////
/// Code

class NetworkRequestCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
			user: null
		};
    }

    componentDidMount() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)

        for (let i = 0; i < this.props.requests.requests.length; i++) {
			if(this.props.requests.requests[i].id === id) {
                this.setState({
                    user: this.props.requests.requests[i]
                });
			}
        }
    }

    getCurrentUser(contactInfo) {
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/users/me', 
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
                    contactInfo: contactInfo,
                    userData: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    approveRequest() {
        // Call create connection route here
        // Also remove request from server
        // Refresh frontend
    }

    denyRequest() {
        // Remove request from server
        // Refresh frontend
    }

    render() {
        var name;
        var email;
        if (this.state.user) {
            name = <HeaderBar
                        text={this.state.user.FullName}
                    />
            email = this.state.user.email;
        }

        return (
            <div className='c-request-profile'>
                { name }          
                <div className="c-request-profile__profile-img">
                    <img src={ fakeuser } alt="User Avatar"/>
                </div>
				<div className='c-request-profile__button-wrapper'>
					<Button className='c-request-profile__button c-request-profile__button--approve' onClick={ () => { this.approveRequest() } }>Approve Request</Button>
					<Button className='c-request-profile__button c-request-profile__button--deny' onClick={ () => { this.denyRequest() } }>Deny Request</Button>
				</div>
                <div className='c-request-profile__profile-info'>
                    <p className='c-request-profile__field-label'><strong>Email: </strong>{ email }</p>
                    <h5>Description: </h5>
                    <p>
                        Dolore do eiusmod sit qui veniam cillum. Cupidatat qui excepteur magna ea laboris. 
                        Consequat tempor dolor eiusmod consectetur. Id aliquip voluptate ea minim non pariatur 
                        minim aliqua pariatur reprehenderit pariatur sint. Mollit cillum ea adipisicing velit eu 
                        voluptate ipsum velit fugiat sint minim est minim elit.
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(NetworkRequestCard);