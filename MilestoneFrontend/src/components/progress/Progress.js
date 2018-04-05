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
            categoryContent: {
                category1: {

                },
                category2: {

                },
                category3: {

                },
                category4: {

                }
            }
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
        
        // For testing
        // let i = 0;
        // let currentGoalsTest = this.state.goalData.goals.map((goal) => {
        //     if (goal.Category == this.state.currentCategory) {
        //         i++;
        //         return (
        //             <p key={ goal.GoalID }>Goal #{ i }: { goal.Title }</p>
        //         )
        //     }
        // })


        return (
            <div className="l-progress-content">
                <Switch>
                    <Route path="/Progress/Category" render={(props) => (
                        <div>
                            { topNav }
                            {/* <p>Current Category: { this.state.currentCategory }</p> */}
                            {/* { currentGoalsTest } */}
                            { goalSelector }
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