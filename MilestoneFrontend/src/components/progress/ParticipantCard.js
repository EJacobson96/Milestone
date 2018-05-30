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
        let showGoals;
        let tasks;
        let goals;
        if (this.props.goalCount !== 0) {
            switch (this.props.taskCount) {
                case 1: 
                    tasks = this.props.taskCount + ' Task'
                    break;
                default: 
                    tasks = this.props.taskCount + ' Tasks'
            }
            switch (this.props.goalCount) {
                case 1: 
                    goals = this.props.goalCount + ' Goal '
                    break;
                default: 
                    goals = this.props.goalCount + ' Goals '
            }
            showGoals = <p className="goals-tasks">{goals} {tasks}</p>
        } else {
            showGoals = <p className="goals-tasks">No Goals</p>
        }
        return (
            <Link to={"/progress/provider/participants/goals/:id" + this.props.id} onClick={ () => this.props.getCurrentGoals(this.props.id) } className="c-participant-card-wrapper">
                <div className="c-participant-card">
                    <div className="c-participant-card-image">
                        <img src={ this.props.userImg } alt=''/>
                    </div>
                    <div className="c-name-goals-tasks">
                        <h3 className="c-participant-card-name">{ this.props.fullName }</h3>
                        {showGoals}
                    </div>
                </div>
            </Link>
        );
    }
}

export default ParticipantCard;