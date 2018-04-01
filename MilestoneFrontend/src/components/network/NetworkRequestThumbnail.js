/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import plus from '../../img/plus.png';
import '../../css/Contacts.css';
import '../../css/NetworkRequestThumbnail.css';

/////////////////////////////////////////
/// Code

class NetworkRequestThumbnail extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };
    }

    render() {
		return (
			<Link 
				to={{
					pathname: this.props.path
				}}
				className='c-network-request-thumbnail-link-wrapper' 
				key={ this.props.id }
			>
				<div className="c-network-request-thumbnail" key={ this.props.id } >
					<div className="c-network-request-thumbnail__user-img">
						<img src={ plus } alt=''/>
					</div>
					<div className="c-network-request-thumbnail__details">
						<span className="c-network-request-thumbnail__details__full-name">
							{ this.props.fullName }
						</span>
					</div>
					<div className='c-network-request-thumbnail__button-wrapper'>
						<Button className='c-network-request-thumbnail__button'>See Request</Button>
					</div>
				</div>
			</Link>
		);
	} 
}

export default NetworkRequestThumbnail;