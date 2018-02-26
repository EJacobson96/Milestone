/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import Axios from 'axios';

/////////////////////////////////////////
/// Images & Styles
import message from '../img/messagebubble.png';
import phone from '../img/phoneicon.png';
import fakeuser from '../img/fakeuser.png';
import '../css/ContactCard.css';

/////////////////////////////////////////
/// Code

class ContactCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        var id = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/contact/' + '?id=' + id, 
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

    componentWillReceiveProps(nextProps) {
        console.log(this.props);
        console.log(nextProps);
        var currID = this.props.match.params.id.substring(3, this.props.match.params.id.length)
        var nextID = nextProps.match.params.id.substring(3, nextProps.match.params.id.length)
        console.log(currID);
        console.log(nextID);
        if (currID !== nextID) {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/contact/' + '?id=' + nextID, 
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

    render() {
        var name;
        var profileImage;
        if (this.state.contactInfo) {
            name = <h3 className="profileName">{this.state.contactInfo.FullName}</h3>;
        }
        return (
            <div className='profilePage'>
                {name}
                <div className="profileImage">
                    <img src={fakeuser} alt="Responsive image"/>
                </div>
                <div className='profileContact'>
                    <div className='profilePhone'>
                        <a href="tel:5555555555"><img src={phone}/></a>
                    </div>
                    <div className='profileMessage'> 
                        <img src={message} />
                    </div>
                </div>
                <div className='profileInfo'>
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

export default ContactCard;