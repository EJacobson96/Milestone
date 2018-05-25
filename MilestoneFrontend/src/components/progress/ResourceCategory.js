import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';

import threeDotImg from '../../img/task3dot.png';
import '../../css/progress/ResourceCategory.css';

class ResourceCategory extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="c-resources-container">
                <div className="c-resource">
                    <img src={threeDotImg} className="c-resource-dots" id='example1' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" /> 
                    <div class="dropdown-menu resourceDropdown" aria-labelledby='example1'>
                        <a class="dropdown-item" href="#">Delete</a>
                    </div>
                    <p className="c-resource-title">Title</p>
                    <p className="c-resource-body">Resource</p>
                </div>

                <div className="modal fade" id="newResource" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create New Resource</h5>
                            </div>
                            <div className="modal-body">
                                <form> 
                                    <div className="form-group">
                                        <label for="titleInput">Resource Title</label>
                                        <input className="form-control" id="titleInput" name="title" type="text" placeholder="Resource Title"/>
                                    </div>
                                    <div className="form-group">
                                        <label for="titleInput">Resource</label>
                                        <input className="form-control" id="titleInput" name="title" type="text" placeholder="Resource"/>
                                    </div>
                                    <div className="c-modal-button-container">
                                        <button type="button" className="btn c-modal-button" data-dismiss="modal">Cancel</button>
                                        <button className="btn c-modal-button" onClick={(e) => this.handleFormSubmit(e)} data-dismiss="modal">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResourceCategory;