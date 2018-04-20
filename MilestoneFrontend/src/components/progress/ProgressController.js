/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import Progress from './Progress';

import goalData from '../testdata/fakeGoalsV2.json';

/////////////////////////////////////////
/// Images & Styles

/////////////////////////////////////////
/// Code

class ProgressController extends Component {
    constructor(props) {
        super(props);
        if (!localStorage.getItem('msLocalStore')) {
            let newMsLocalStore = {
                'prog_CurrNavFilter': 'inProgress'
            }
            
            localStorage.setItem('msLocalStore', JSON.stringify(newMsLocalStore));
        }

        let msLocalStore = JSON.parse(localStorage.getItem('msLocalStore'));
        this.state = {
            msLocalStore: msLocalStore,
            heading: 'Goal Planning',
            currentNavFilter: msLocalStore.prog_CurrNavFilter,
            currentGoalCategoryId: null,
            goalData: goalData
        };
    }

    changeGoalCategory(e, targetCategoryId, targetHeading) {
        this.setState({
            currentGoalCategoryId: targetCategoryId,
            heading: targetHeading
        });
        this.updateHeading(targetHeading);
    }

    handleSearch(e) {
        console.log("Search fired");
    }

	switchFilter(e, targetNavFilter) {
        // console.log(targetNavFilter);
        let newMsLocalStore = this.state.msLocalStore;
        newMsLocalStore.prog_CurrNavFilter = targetNavFilter;
        localStorage.setItem('msLocalStore', JSON.stringify(newMsLocalStore));
        this.setState({
            currentNavFilter: targetNavFilter,
            msLocalStore: newMsLocalStore
        });
    }
    
    updateHeading(targetHeading) {
        this.setState({
            heading: targetHeading
        });
    }

    render() {
        var heading = this.state.heading;
        if (this.props.location.pathname.endsWith("/Goals")) {
            heading = "Goal Planning";
        }
        const targetNavFilter = this.state.currentNavFilter;
        const goals = this.state.goalData;
        const targeGoalCategoryId = this.state.currentGoalCategoryId; // Save me to localStorage!

        return (
            <Route path='/Progress' render={(props) => (
                <div>
                    <Progress
                        changeGoalCategory = { (e, i, t) => this.changeGoalCategory(e, i, t) }
                        handleSearch={ (e) => this.handleSearch(e) }
                        switchFilter={ (e, t) => this.switchFilter(e, t) }
                        goals={ goals }
                        heading={ heading }
                        navFilter={ targetNavFilter }
                        targeGoalCategoryId = { targeGoalCategoryId }
                        updateHeading={ (t) => this.updateHeading(t) }
                    />
                </div>
            )} />
        )

    }
}
export default withRouter(ProgressController);