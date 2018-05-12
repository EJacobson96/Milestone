/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantCard.css';
import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

class ParticipantCard extends React.Component {
    constructor(props) {
        super(props);
            
        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <div className="c-participant-card">
            	<div className="c-participant-card-image">
					<img src={ fakeuser } alt=''/>
				</div>
                <h4 className="c-participant-card-name">{ this.props.fullName }</h4>
            </div>
        );
    }
}

export default ParticipantCard;