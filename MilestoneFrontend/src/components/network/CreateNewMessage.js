/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

import { withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/CreateNewMessage.css';

/////////////////////////////////////////
/// Code

class CreateNewMessage extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default withRouter(CreateNewMessage);