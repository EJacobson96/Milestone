/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import ProgressNav from './ProgressNav';
import ProgressSearch from './ProgressSearch';
import GoalSelector from './GoalSelector';
import UpcomingPebbles from './UpcomingPebbles';

import goalData from '../testdata/fakegoals.json';

/////////////////////////////////////////
/// Images & Styles
import '../../css/Progress.css';

/////////////////////////////////////////
/// Code

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCategory: "1",
            goalData: goalData,
        };

        this.switchCategory = this.switchCategory.bind(this);
    }
    
    componentDidMount() {
        // TODO:
    }

    handleSearch(search) {
        // TODO:
    }

    switchCategory(targetCategory) {
        this.setState({
            currentCategory: targetCategory
        });
    }

    render() {
        var topNav =        <div>
                                <ProgressNav
                                    targetCategory={ this.state.currentCategory }
                                    switchCategory={ (e) => this.switchCategory(e) }
                                />
                                <ProgressSearch />
                            </div>;
        var currentGoals = this.state.goalData.goals.filter((goal) => {
            if (goal.Category == this.state.currentCategory) {
                return goal;
            }
        });
        var goalSelector =  <div>
                                <GoalSelector 
                                    goals={ currentGoals }
                                />
                            </div>
        var upcoming =      <div>
                                <UpcomingPebbles 
                                    goals={ currentGoals }
                                />
                            </div>

        return (
            <div className="l-progress-content">
                <Switch>
                    <Route path="/Progress/Category" render={(props) => (
                        <div>
                            { topNav }
                            { goalSelector }
                            { upcoming }
                        </div>
                    )} />
                    <Route exact path="/Progress" render={(props) => (
                        <Redirect to="/Progress/Category/1" />
                    )} />
                </Switch>
			</div>
        );
    }
}

export default withRouter(Progress);