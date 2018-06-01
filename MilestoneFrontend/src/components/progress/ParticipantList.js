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

// A component for displaying a list of connected participant overviews in the form of
// ParticipantCard componenents, meant for logged in service providers.
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

    // Gets the goals for all participants connected to the the currently logged in
    // service provider, then stores those goals in this components state. Also
    // retrieves each connections gravatar photo URL.
    getConnectionGoals() {
        var userGoals = {};
        var userImages = {};
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
        for (let i = 0; i < connections.length; i++) {
            Axios.get(
                'https://api.milestoneapp.org/contact/?id=' + connections[i].id)
                .then(response => {
                    return response.data;
                })
                .then(data => {
                    userImages['' + connections[i].id] = data.photoURL;
                    this.setState({
                        images: userImages
                    })
                })
                .catch(error => {
                    console.log(error);
                }
            );  
        }
    }

    // Filters connected participant's goals based on whether the currently logged
    // in service provider is connected to each goal.
    filterGoals(goals, id) {
        goals = goals.filter((goal) => {
            return goal.serviceProviders.includes(id)
        })
        return goals;
    }


    render() {
        let connectionList;
        let goalCount;
        let taskCount;
        let userImg;
        var userGoals;
        if (this.state.goals && this.state.images) {
            connectionList = this.props.connections.map((connection) => {
                taskCount = 0;
                if (this.state.goals[connection.id]) {
                    userGoals = this.filterGoals(this.state.goals[connection.id], this.props.currUser.id);
                    goalCount = userGoals.length;
                    for (let i = 0; i < userGoals.length; i++) {
                        taskCount += userGoals[i].tasks.length;
                    }
                }
                if (this.state.images[connection.id]) {
                    userImg = this.state.images[connection.id];
                }

                return (
                    <ParticipantCard 
                        key={ connection.id }
                        id={ connection.id }
                        fullName={ connection.fullName }
                        goalCount={ goalCount }
                        taskCount = { taskCount }
                        userImg = { userImg }
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