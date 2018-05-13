/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import Axios from 'axios';

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
        var userGoals = {};
        var connections = this.props.connections;
        for (let i = 0; i < connections.length; i++) {
            Axios.get(
                'https://milestoneapi.eric-jacobson.me/goals?id=' + connections[i].id)
                .then(response => {
                    return response.data;
                })
                .then(data => {
                    userGoals['' + connections[i].id] = data;
                    if (i == connections.length - 1) {
                        this.setState({
                            goals: userGoals,
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                }
            );  
        }
    }

    render() {
        var connectionList = this.props.connections.map((connection) => {
            return (
                <ParticipantCard 
                    key={ connection.id }
                    id={ connection.id }
                    fullName={ connection.fullName }
                />
            )
        })
        if (this.state.goals) {
            console.log(this.state.goals);
            return (
                <div className="c-participant-list">
                    { connectionList }
                </div>
            );
        } else {
            return <p></p>
        }
    }
}

export default ParticipantList;