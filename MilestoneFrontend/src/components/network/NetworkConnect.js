/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

/////////////////////////////////////////
/// Images & Styles
import '../../css/NetworkConnect.css';

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
        this.props.toggleSearchAndNav();
    }

    componentWillUnmount() {
        this.props.toggleSearchAndNav();
    }
    handleSearch(event) {
        const searchQuery = document.getElementById('networkConnectionSearch').value;
        Axios.get(
            'https://milestoneapi.eric-jacobson.me/participants',  
            {
                // headers: {
                //     'Authorization' : localStorage.getItem('Authorization')
                // }    
            })
            .then(response => {
                return response.data;
            })
            .then(data => {

            })
            .catch(error => {
                console.log(error);
            }
        );
    }
    render() {
        return (
            <div >
                <form onSubmit={this.handleSearch} className="[ form-inline ]">
					<input id="networkConnectionSearch" className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search"/>
					<Button className="btn btn-outline-success my-2 my-sm-0" onClick={(e) => this.handleSearch(e)}>
						<Glyphicon glyph="search" /> 
					</Button>
				</form>
                <div className="c-contact-profile__header__profile-name-wrapper">
                    <h3 className="c-contact-profile__header__profile-name"></h3>
                </div>
            </div>
        );
    }
}

export default NetworkConnect;