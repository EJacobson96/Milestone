/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/GoalSelectorItem.css';

/////////////////////////////////////////
/// Code

class GoalSelectorItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    
    componentDidMount() {
        // TODO:
    }

    render() {
        return (
            <div className="c-goal-selector__goal-selector-item">
				<div className="c-goal-selector__goal-selector-item__header-block">
					<p className="c-goal-selector__goal-selector-item__header-text">GOAL</p>
				</div>
				<p className="c-goal-selector__goal-selector-item__goal-title">{ this.props.title }</p>
				<p className="c-goal-selector__goal-selector-item__goal-status">{ this.props.status }</p>
				<p className="c-goal-selector__goal-selector-item__number-of-pebbles">{ this.props.numberOfPebbles } Objective</p>
			</div>
        );
    }
}

export default GoalSelectorItem;