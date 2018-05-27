/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/network/Contacts.css';

/////////////////////////////////////////
/// Code

//displays all of the contact cards
class ContactThumbnail extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			userPhoto: '' 
		}
	}

	componentDidMount() {
		this.props.userController.getContact(this.props.id)
		.then((data) => {
			if (data) {
				this.setState({
					userPhoto: data.photoURL
				})
			}
		})
	}

	render() {
		return (
			<Link 
				to={{
					pathname: this.props.path
				}}
				className= 'c-contact-card-link-wrapper'
				key={ this.props.id }
			>
				<div className={"c-contact-card " + this.props.className} key={ this.props.id } >
					<div className="c-contact-card__user-img">
						<img src={ this.state.userPhoto } alt=''/>
					</div>
					<div className="c-contact-card__details">
						<span className="c-contact-card__details__full-name">
							{ this.props.fullName }
						</span>
					</div>
				</div>
			</Link>
		);
	}
}

export default withRouter(ContactThumbnail);