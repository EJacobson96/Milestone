/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import ProgressHeading from './ProgressHeading';
import GoalCategories from './GoalCategories';
import UpcomingGoals from './UpcomingGoals';
import NewGoal from './NewGoal';
import NewGoalCategory from './NewGoalCategory';

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/Progress.css';

/////////////////////////////////////////
/// Code

const Progress = (props) => {
	console.log(props.addBtnLink);
	const heading = (heading) => 	<ProgressHeading
										heading = { heading }
										handleSearch={ (e) => props.handleSearch(e) }
										navFilter={ props.navFilter }
										switchFilter={ (e, t) => props.switchFilter(e, t) }
										addBtnLink={ props.addBtnLink }
									/>

	return (
		<div className='l-progress-content'>
			<Switch>
				<Route path='/Progress/Goals/NewGoal' render={() => (
					<div>
						<NewGoal />
					</div>
				)} />
				<Route path='/Progress/Goals/NewCategory' render={() => (
					<div>
						<NewGoalCategory />
					</div>
				)} />
				<Route path='/Progress/Goals/:id' render={() => (
					<div>
						{ heading(props.heading) }
						<UpcomingGoals
							targetGoalCategoryId={ props.targetGoalCategoryId }
							goals={ props.goals }
						/>
					</div>
				)} />
				<Route exact path='/Progress/Goals' render={() => (
					<div>
						{ heading('Goal Planning') }
						<GoalCategories
							goals={ props.goals }
							changeGoalCategory = { (e, i, t) => props.changeGoalCategory(e, i, t) }
						/>
					</div>
				)} />
				<Route exact path='/Progress' render={(props) => (
					<Redirect to='/Progress/Goals' />
				)} />
			</Switch>
		</div>
	)
}

export default Progress;