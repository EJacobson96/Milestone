/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import ProgressHeading from './ProgressHeading';
import GoalCategories from './GoalCategories';
import UpcomingGoals from './UpcomingGoals';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Progress.css';

/////////////////////////////////////////
/// Code

const Progress = (props) => {
	const heading = (heading) => <ProgressHeading
						heading = { heading }
						handleSearch={ (e) => props.handleSearch(e) }
						navFilter={ props.navFilter }
						switchFilter={ (e, t) => props.switchFilter(e, t) }
					/>

	return (
		<div className='l-progress-content'>
			<Switch>
				<Route path='/Progress/Goals/:id' render={() => (
					<div>
						{ heading(props.heading) }
						<UpcomingGoals
							targeGoalCategoryId={ props.targeGoalCategoryId }
							goals={ props.goals.goals } // ADJUST AS NECESSARY
						/>
					</div>
				)} />
				<Route path='/Progress/Goals' render={() => (
					<div>
						{ heading(props.heading) }
						<GoalCategories
							goals={ props.goals }
							changeGoalCategory = { (e, i, t) => props.changeGoalCategory(e, i, t) }
							updateHeading={ (t) => props.updateHeading(t) }
						/>
					</div>
				)} />
				<Route path='/Progress' render={(props) => (
					<Redirect to='/Progress/Goals' />
				)} />
			</Switch>
		</div>
	)
}

export default Progress;