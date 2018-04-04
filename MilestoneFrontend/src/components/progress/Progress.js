/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import ProgressNav from './ProgressNav';

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
        var topNav = <div>
                        <ProgressNav
                            targetCategory={ this.state.currentCategory }
                            switchCategory={ (e) => this.switchCategory(e) }
                        />
                    </div>;
        let i = 0;
        let currentGoals = this.state.goalData.goals.map((goal) => {
            if (goal.Category == this.state.currentCategory) {
                i++;
                return (
                    <p>Goal #{ i }: { goal.Title }</p>
                )
            }
        })
        return (
            <div className="l-progress-content">
                <Switch>
                    <Route path="/Progress/Category" render={(props) => (
                        <div>
                            { topNav }
                            <p>Current Category: { this.state.currentCategory }</p>
                            { currentGoals }
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