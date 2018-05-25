import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';

import '../../css/progress/ResourceCategory.css';

class ResourceCategory extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="c-resources-container">
                <div className="c-resource">
                    <p className="c-resource-title">Title</p>
                    <p className="c-resource-body">Resource</p>
                </div>
                <div className="c-resource">
                    <p className="c-resource-title">Title</p>
                    <p className="c-resource-body">Resource</p>
                </div>
                <div className="c-resource">
                    <p className="c-resource-title">Title</p>
                    <p className="c-resource-body">Resource</p>
                </div>
                <div className="c-resource">
                    <p className="c-resource-title">Title</p>
                    <p className="c-resource-body">Resource</p>
                </div>
                <div className="c-resource">
                    <p className="c-resource-title">Title</p>
                    <p className="c-resource-body">Resource</p>
                </div>
            </div>
        )
    }
}

export default ResourceCategory;