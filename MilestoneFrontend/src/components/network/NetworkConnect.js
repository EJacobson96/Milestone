/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
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

    buttonClicked() {
        console.log(this.props);
        this.props.history.goBack();
    }

    handleSearch(event) {
        var input = document.getElementById('networkConnectionSearch');
        var userType = 'participants';
        var searchQuery = input.value;
        input.value = '';
        if (this.props.accountType == 'participant') {
            userType = 'serviceproviders';
        }
        if (searchQuery.trim() != "") {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/' + userType + '?q=' + searchQuery,  
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
    }
    render() {
        var content = <div>
                        <img className="c-connection-placeholder" src={users} />
                        <h3 className="c-connection-placeholder-text">Look for new connections!</h3>
                      </div>
        if (this.state.users && this.state.users.length != 0) {
            content = <Contacts showContacts={true} content={this.state.users} />
        }
        return (
            <div>
                <div className="c-contact-connections-header">
                    <Button onClick={() => this.buttonClicked()} className="c-contact-profile__header__back-btn">
                        <Glyphicon glyph="chevron-left" />
                    </Button>
                    <h3 className="c-connections-header">New Invitation</h3>
                </div>
                <form onSubmit={this.handleSearch} className="[ form-inline ] c-connections-search">
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

export default withRouter(NetworkConnect);