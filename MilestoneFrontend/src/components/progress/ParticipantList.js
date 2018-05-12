/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantList.css';
import ParticipantHeading from './ParticipantHeading';
import ParticipantCard from './ParticipantCard';

/////////////////////////////////////////
/// Code

class ParticipantList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        console.log(this.props.connections)
    }

    render() {
        var connectionList = this.props.connections.map((connection) => {
            return (
                <ParticipantCard 
                    id={ connection.id }
                    fullName={ connection.fullName }
                />
            )
        })
        return (
            <div className="c-participant-list">
                { connectionList }
            </div>
        );
    }
}

export default ParticipantList;