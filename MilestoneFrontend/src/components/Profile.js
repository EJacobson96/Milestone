import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import UserController from '../controllers/UserController';

import '../css/Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currUser: {}
        }
    }

    enableEditForm(event) {
        event.target.className += ' hide';

        document.querySelector('input[type=submit]').className += ' show';

        document.querySelectorAll('input[type=text]').forEach((input) => {
            input.disabled = false;
        })

    }

    handleChange(event, key) {
        this.setState({
            ...this.state,
            [key]: event.target.value 
        })
    }
    
    componentDidMount() {
        UserController.getUser().then((user) => {
            console.log(user)
            this.setState({
                currUserPhotoUrl: user.photoURL,
                currUserFullName: user.fullName,
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
                    <img src={this.state.currUserPhotoUrl} />
                    <input type="text" className="c-username" value={this.state.currUserFullName} onChange={(event) => this.handleChange(event, 'currUserFullName')} disabled />
                    {
                        this.state.currUserAddress && 
                        <div>
                            <h4>Address</h4>
                            <input type="text" value={this.state.currUserAddress} onChange={(event) => this.handleChange(event, 'currUserAddress')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserDob && 
                        <div>
                            <h4>Brithday</h4>
                            <input type="text" value={this.state.currUserDob} onChange={(event) => this.handleChange(event, 'currUserDob')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserEmail && 
                        <div>
                            <h4>Email</h4>
                            <input type="text" value={this.state.currUserEmail} onChange={(event) => this.handleChange(event, 'currUserEmail')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserPhone && 
                        <div>
                            <h4>Phone Number</h4>
                            <input type="text" value={this.state.currUserPhone} onChange={(event) => this.handleChange(event, 'currUserPhone')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserOrganization &&
                        <div>
                            <h4>Organization</h4>
                            <input type="text" value={this.state.currUserOrganization} onChange={(event) => this.handleChange(event, 'currUserOrganization')} disabled />
                        </div>
                    }
                    <input type="button" className="c-edit-button" onClick={(event) => this.enableEditForm(event)} value="Edit"/>
                    <input type="submit" className="c-edit-button hide" value="Submit" onClick={(event) => this.disableEditForm(event)}/>
                </form>
            </div>
        )
    }
}

export default Profile;