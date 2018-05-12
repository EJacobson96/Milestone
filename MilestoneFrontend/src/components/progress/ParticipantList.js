/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

/////////////////////////////////////////
/// Images & Styles
import '../../css/ParticipantList.css';
import ParticipantHeading from './ParticipantHeading';

/////////////////////////////////////////
/// Code

class ParticipantList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    componentDidMount() {
        console.log("hello")
    }

    render() {
        return (
            <div className="">
                <ParticipantHeading/>
            </div>
        );
    }
}

export default ParticipantList;