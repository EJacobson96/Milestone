/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import fakeuser from '../../img/fakeuser.png';
import '../../css/Contacts.css';

/////////////////////////////////////////
/// Code

class ContactThumbnail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
		return (
			<Link 
				to={{
					pathname: this.props.path
				}}
				className='c-contact-card-link-wrapper' 
				key={ this.props.id }
			>
				<div className="c-contact-card" key={ this.props.id } >
					<div className="c-contact-card__user-img">
						<img src={fakeuser} alt=''/>
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