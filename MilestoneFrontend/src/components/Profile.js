import React from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import '../css/Profile.css';

//displays a user's profile screen
class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currUser: {}
        }
    }

    //allows users to edit form
    enableEditForm(event) {
        event.target.classList.remove('show');
        event.target.className += ' hide';
        document.querySelector('input[type=submit]').className += ' show';
        document.querySelectorAll('input[type=text]').forEach((input) => {
            input.disabled = false;
        })

    }

    //changes state based on user input
    handleInputChange(event, key) {
        this.setState({
            ...this.state,
            [key]: event.target.value 
        })
    }

    //updates user with user input from form
    handleSubmit(event) {
        event.preventDefault();
        event.target.classList.remove('show');
        event.target.className += ' hide';
        document.querySelector('input[type=button]').className += ' show';
        document.querySelectorAll('input[type=text]').forEach((input) => {
            input.disabled = true;
        })
        this.props.userController.updateUser(this.state.userID, this.state.currUserEmail, this.state.currUserFirstName, 
                                                this.state.currUserLastName, this.state.currUserPhone)
        .then((data) => {
            this.setState({
                currUserPhotoUrl: data.photoURL,
                currUserFullName: data.fullName,
                currUserAddress: data.address,
                currUserDob: data.dob,
                currUserEmail: data.email,
                currUserPhone: data.phone,
                currUserOrganization: data.organization,
            })
        })
    }
    
    componentDidMount() {
        this.props.userController.getUser()
        .then((user) => {
            this.setState({
                userID: user.id,
                currUserPhotoUrl: user.photoURL,
                currUserFullName: user.fullName,
                currUserFirstName: user.firstName,
                currUserLastName: user.lastName,
                currUserAddress: user.address,
                currUserDob: user.dob,
                currUserEmail: user.email,
                currUserPhone: user.phone,
                currUserOrganization: user.organization,
            }) 
        })
    }

    render() {
        return (
            <div className="container c-profile-container">
                <form className="c-profile">
                    <div>
                        <img src={this.state.currUserPhotoUrl} alt="user logged in"/>
                        <p className="gravatar-link">Upload a photo to <a target="_blank" href="http://en.gravatar.com/">Gravatar</a> to change your profile photo.</p>
                        <input type="file" name="PhotoURL" className="hide form-control" />
                        <h2>{this.state.currUserFullName}</h2>
                    </div>
                        <div>
                            <h4>First Name</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserFirstName} onChange={(event) => this.handleInputChange(event, 'currUserFirstName')} disabled />
                        </div>

                        <div>
                            <h4>Last Name</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserLastName} onChange={(event) => this.handleInputChange(event, 'currUserLastName')} disabled />
                        </div>
                        <div>
                            <h4>Email</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserEmail} onChange={(event) => this.handleInputChange(event, 'currUserEmail')} disabled />
                        </div>
                        <div>
                            <h4>Phone Number</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserPhone} onChange={(event) => this.handleInputChange(event, 'currUserPhone')} disabled />
                        </div>
                    <input type="button" className="c-edit-button" onClick={(event) => this.enableEditForm(event)} value="Edit"/>
                    <input type="submit" className="c-edit-button hide" value="Save Changes" onClick={(e) => this.handleSubmit(e)} />
                    <Button className="c-profile-log-out" onClick={(e) => this.props.logOut(e)}>Log Out </Button>
                </form>
            </div>
        )
    }
}

export default withRouter(Profile);