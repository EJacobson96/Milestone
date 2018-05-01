/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

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
	const heading = (heading, navFilter, switchFunc) => 	<ProgressHeading
										heading = { heading }
										handleSearch={ (e) => props.handleSearch(e) }
										navFilter={ navFilter }
										switchFilter={ (e, t) => switchFunc(e, t) }
										addBtnLink={ props.addBtnLink }
									/>

	return (
		<div className='l-progress-content'>
			<Switch>
				<Route path='/Progress/Goals/Search' render={() => (
					<div>
						{ heading('Search Results', props.goalNavFilter, props.switchGoalNavFilter) }
						<GoalCategories
							goals={ props.searchResults }
							refreshUser={() => props.refreshUser() }
							changeGoalCategory = { (e, i, t) => props.changeGoalCategory(e, i, t) }
						/>
					</div>
				)} />
				<Route path='/Progress/Goals/NewGoal/:id' render={() => (
					<div>
						<NewGoal 
							addGoal={ (t,dd,d,c) => { props.addGoal(t,dd,d,c) }}
							targetGoalCategoryId = { props.targetGoalCategoryId }
						/>
					</div>
				)} />
				<Route path='/Progress/Goals/NewCategory' render={() => (
					<div>
						<NewGoalCategory 
							currUser={ props.currUser }
							refreshUser={() => props.refreshUser() }
							addGoalCategory={ (o) => props.addGoalCategory(o) }
						/>
					</div>
				)} />
				<Route path='/Progress/Goals/:id' render={() => (
					<div>
						{ heading(props.heading, props.goalNavFilter, props.switchGoalNavFilter) }
						<UpcomingGoals
							targetGoalCategoryId={ props.targetGoalCategoryId }
							goals={ props.goals }
							navFilter={ props.goalNavFilter }
							refreshUser={() => props.refreshUser() }
						/>
					</div>
				)} />
				<Route exact path='/Progress/Goals' render={() => (
					<div>
						{ heading('Goal Categories', props.navFilter, props.switchGoalCatNavFilter) }
						<GoalCategories
							goals={ props.goals }
							refreshUser={() => props.refreshUser() }
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