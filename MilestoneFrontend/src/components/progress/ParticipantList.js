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
            userGoals: ''
        };
    }

    componentDidMount() {
        this.getConnectionGoals();
    }

    componentDidUpdate(prevProps) {
        if(this.props !== prevProps) {
            this.getConnectionGoals();
        }
    }

    getConnectionGoals() {
        var userGoals = {};
        var connections = this.props.connections;
        for (let i = 0; i < connections.length; i++) {
            Axios.get(
                'https://api.milestoneapp.org/goals?id=' + connections[i].id)
                .then(response => {
                    return response.data;
                })
                .then(data => {
                    userGoals['' + connections[i].id] = data;
                    this.setState({
                        goals: userGoals
                    })
                })
                .catch(error => {
                    console.log(error);
                }
            );  
        }
    }

    render() {
        let connectionList;
        let goalCount;
        if (this.state.goals) {
            let taskCount = 0;
            connectionList = this.props.connections.map((connection) => {
                if (this.state.goals[connection.id]) {
                    goalCount = this.state.goals[connection.id].length;
                    for (let i = 0; i < this.state.goals[connection.id].length; i++) {
                        taskCount += this.state.goals[connection.id][i].tasks.length;
                    }
                }

                return (
                    <ParticipantCard 
                        key={ connection.id }
                        id={ connection.id }
                        fullName={ connection.fullName }
                        goalCount={ goalCount }
                        taskCount = { taskCount }
                        getCurrentGoals={ (id) => this.props.getCurrentGoals(id) }
                    />
                )
            })
        }

        return (
            <div className="c-participant-list">
                { connectionList }
            </div>
        );
    }
}

export default ParticipantList;