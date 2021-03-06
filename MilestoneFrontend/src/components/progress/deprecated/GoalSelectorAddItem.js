/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalSelectorAddItem.css';
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
                <Link to="">
                    <img src={ plus } className="c-goal-selector__goal-selector-add-item__plus-img" />
                </Link>
				<p className="c-goal-selector__goal-selector-add-item__goal-title">ADD GOAL</p>
			</div>
        );
    }
}

export default GoalSelectorAddItem;