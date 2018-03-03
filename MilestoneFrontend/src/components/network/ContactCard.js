/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import Axios from 'axios';
import { Button, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import message from '../../img/messagebubble.png';
import phone from '../../img/phoneicon.png';
import fakeuser from '../../img/fakeuser.png';
import '../../css/ContactCard.css';

/////////////////////////////////////////
/// Code

class ContactCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    componentDidMount() {
        this.props.toggleSearchAndNav();

        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/contact/?id=' + id, 
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
                    contactInfo: data
                });
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    componentWillUnmount() {
        this.props.toggleSearchAndNav();
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props);
        console.log(nextProps);
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        console.log(currID);
        console.log(nextID);
        if (currID !== nextID) {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/contact/?id=' + nextID, 
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
                        contactInfo: data
                    });
                })
                .catch(error => {
                    console.log(error);
                }
            );
        }
    }

    buttonClicked() {
        console.log('wut');
        this.props.history.goBack();
    }

    render() {
        var name;
        var email;
        // var profileImage;
        if (this.state.contactInfo) {
            name = 
                <div className="c-contact-profile__header__profile-name-wrapper">
                    <h3 className="c-contact-profile__header__profile-name">{this.state.contactInfo.FullName}</h3>
                </div>;
            email = this.state.contactInfo.email;
        }
        return (
            <div className='c-contact-profile'>
                <div className="c-contact-profile__header">
                    <Button onClick={() => this.buttonClicked()} className="c-contact-profile__header__back-btn">
                        <Glyphicon glyph="chevron-left" />
                    </Button>
                    {name}            
                </div>
                <div className="c-contact-profile__profile-img">
                    <img src={fakeuser} alt="User Avatar"/>
                </div>
                <div className='c-contact-profile__contact-icons'>
                    <div className='c-contact-profile__contact-icons__phone'>
                        <a href="tel:5555555555"><img src={phone} alt="phone icon"/></a>
                    </div>
                    <div className='c-contact-profile__contact-icons__msg'> 
                        <img src={message} alt="messaging icon"/>
                    </div>
                </div>
                <div className='c-contact-profile__profile-info'>
                    <p className='c-contact-profile__field-label'><strong>Email: </strong>{ email }</p>
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

export default withRouter(ContactCard);