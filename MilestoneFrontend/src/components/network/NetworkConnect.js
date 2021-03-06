/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Contacts from './Contacts.js';

/////////////////////////////////////////
/// Images & Styles
import '../../css/network/NetworkConnect.css';
import users from '../../img/users.png';

/////////////////////////////////////////
/// Code

//allows users to search for new connections
class NetworkConnect extends React.Component {

    //searches for new connections based on search input
    handleSearch(e) {
        e.preventDefault();
        var input = document.getElementById('networkConnectionSearch');
        var userType = 'participants';
        var searchQuery = input.value;
        input.value = '';
        if (this.props.accountType === 'participant') {
            userType = 'serviceproviders';
        }
        if (searchQuery.trim() !== "") {
            this.props.userController.searchForConnections(userType, searchQuery)
            .then(data => {
                this.setState({
                    users: data
                });
            })
        }
    }
    render() {
        var content = <div>
                        <img className="c-connection-placeholder" src={users} alt="three people icon"/>
                        <h3 className="c-connection-placeholder-text">Look for new connections!</h3>
                      </div>
        if (this.state && this.state.users && this.state.users.length !== 0) {
            content = <Contacts isDesktopInvitation={this.props.isDesktopInvitation} showContacts={true} 
                            userController= { this.props.userController } showRequests={false} content={this.state.users} currUser={this.props.currUser} />
        }
        return (
            <div className="newInvitation">
                <h3 className="c-contact-connections-header">New Invitation</h3>
                <form onSubmit={ (e) => this.handleSearch(e)} className="[ form-inline ] c-connections-search">
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