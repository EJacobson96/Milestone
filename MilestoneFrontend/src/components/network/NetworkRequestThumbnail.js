/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/Contacts.css';
import '../../css/NetworkRequestThumbnail.css';

/////////////////////////////////////////
/// Code

class NetworkRequestThumbnail extends React.Component {
    constructor(props) {
        super(props);
    
	}
	
	componentDidMount() {
		if (this.props.id) {
			this.props.userController.getContact(this.props.id)
			.then((data) => {
				this.setState({
					user: data
				})
			})
		}
	}

    render() {
		var fullName;
		if (this.state && this.state.user) {
			fullName = this.state.user.fullName
		}
		return (
			<Link 
				to={{
					pathname: this.props.path
				}}
				className='c-network-request-thumbnail-link-wrapper' 
			>
				<div className="c-network-request-thumbnail">
					<div className="c-network-request-thumbnail__user-img">
						<img src={ fakeuser } alt=''/>
					</div>
					<div className="c-network-request-thumbnail__details">
						<p className="c-network-request-thumbnail__details__full-name">
							{ fullName }
						</p>
					</div>
					<div className='c-network-request-thumbnail__button-wrapper'>
						<Button className='c-network-request-thumbnail__button'>View Request</Button>
					</div>
				</div>
			</Link>
		);
	} 
}

export default NetworkRequestThumbnail;