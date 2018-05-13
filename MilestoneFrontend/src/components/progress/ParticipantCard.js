/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { Link } from 'react-router-dom';

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
            <Link to={"/progress/people/goals/:id" + this.props.id}  className="c-participant-card-wrapper">
                <div className="c-participant-card">
                    <div className="c-participant-card-image">
                        <img src={ fakeuser } alt=''/>
                    </div>
                    <h4 className="c-participant-card-name">{ this.props.fullName }</h4>
                </div>
            </Link>
        );
    }
}

export default ParticipantCard;