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
        document.querySelector('input[type=file]').className += ' show';

        document.querySelectorAll('input[type=text]').forEach((input) => {
            input.disabled = false;
        })

    }

    handleInputChange(event, key) {
        this.setState({
            ...this.state,
            [key]: event.target.value 
        })
    }

    handleSubmit(e) {
        e.preventDefault();
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
            }, () => {
                this.props.history.push("/profile");
            });
        })
    }
    
    componentDidMount() {
        UserController.getUser().then((user) => {
            console.log(user)
            this.setState({
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
                        <img src={this.state.currUserPhotoUrl}/>
                        <input type="file" name="PhotoURL" className="hide form-control" />
                        <input type="text" name="" className="c-username form-control" value={this.state.currUserFullName} onChange={(event) => this.handleInputChange(event, 'currUserFullName')} disabled />
                    </div>
                    {
                        this.state.currUserAddress && 
                        <div>
                            <h4>Address</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserAddress} onChange={(event) => this.handleInputChange(event, 'currUserAddress')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserDob && 
                        <div>
                            <h4>Brithday</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserDob} onChange={(event) => this.handleInputChange(event, 'currUserDob')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserEmail && 
                        <div>
                            <h4>Email</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserEmail} onChange={(event) => this.handleInputChange(event, 'currUserEmail')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserPhone && 
                        <div>
                            <h4>Phone Number</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserPhone} onChange={(event) => this.handleInputChange(event, 'currUserPhone')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserOrganization &&
                        <div>
                            <h4>Organization</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserOrganization} onChange={(event) => this.handleInputChange(event, 'currUserOrganization')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserFirstName &&
                        <div>
                            <h4>First Name</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserFirstName} onChange={(event) => this.handleInputChange(event, 'currUserFirstName')} disabled />
                        </div>
                    }
                    {
                        this.state.currUserLastName &&
                        <div>
                            <h4>Last Name</h4>
                            <input type="text" name="" className="form-control" value={this.state.currUserLastName} onChange={(event) => this.handleInputChange(event, 'currUserLastName')} disabled />
                        </div>
                    }
                    <input type="button" className="c-edit-button" onClick={(event) => this.enableEditForm(event)} value="Edit"/>
                    <input type="submit" className="c-edit-button hide" value="Submit" onClick={(e) => this.handleSubmit(e)} />
                </form>
            </div>
        )
    }
}

export default withRouter(Profile);