/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/network/NetworkRequestThumbnail.css';

/////////////////////////////////////////
/// Code

//displays all the pending connection requests for the current user
class NetworkRequestThumbnail extends React.Component {
	
	componentDidMount() {
		this.props.userController.getContact(this.props.id)
		.then((data) => {
			this.setState({
				user: data
			})
		})
	}

    render() {
		var fullName;
		var userImg;
		if (this.state && this.state.user) {
			fullName = this.state.user.fullName
			userImg = this.state.user.photoURL
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
						<img src={ userImg } alt=''/>
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