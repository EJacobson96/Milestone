/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/GoalSelectorAddItem.css';
import plus from '../../img/plus.png';

/////////////////////////////////////////
/// Code

class GoalSelectorAddItem extends Component {
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
            <div className="c-goal-selector__goal-selector-add-item">
                <img src={ plus } className="c-goal-selector__goal-selector-add-item__plus-img" />
				<p className="c-goal-selector__goal-selector-add-item__goal-title">ADD GOAL</p>
			</div>
        );
    }
}

export default GoalSelectorAddItem;