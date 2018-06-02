/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Images & Styles

import threeDotImg from '../../img/task3dot.png';
import '../../css/progress/ResourceCategories.css';

/////////////////////////////////////////
/// Code

// A component for displaying different categories for holding resource objects,
// to be managed by a logged in service provider.
class ResourceCategories extends Component {
    constructor(props) {
        super(props);
    }

    // Handles the creation of a new resource category on user input.
    handleFormSubmit(event) {
        event.preventDefault();
        let input = document.getElementById("titleInput");
        let text = input.value;
        input.value = "";
        Axios.post(
            'https://api.milestoneapp.org/resources',
            {
                Title: text,
                UserID: this.props.currUser.id
            })
            .then(response => {
                return response.data;
                
            })
            .then(() => {
                this.props.getResources();
            }) 
            .catch(error => {
                console.log(error);
            });
    }

    // Handles the deletion of a resource category on user input.
    deleteResourceCategory(e, id) {
        e.preventDefault();
        console.log(this.props);
        this.props.deleteResourceCategory(id)
        .then((data) => {
            this.props.getResources();
        })
    }

    // Sorts this.props.resourceCategories alphabetically
    alphabetize(arr) {
        return arr.sort(function(a, b) {
            var textA = a.title.toLowerCase();
            var textB = b.title.toLowerCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    render() {
        return (
            <div className="c-resource-category-container">
                {
                    this.alphabetize(this.props.resourceCategories).map((category) => {
                        return <div key={category.id} className="c-resource-category">
                                    <img className="c-category-dots" src={threeDotImg} id={category.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                                <div className="dropdown-menu categoryDropdown" aria-labelledby={category.id}>
                                    <a onClick={(e) => this.deleteResourceCategory(e, category.id)} className="dropdown-item" href="#">Delete</a>
                                </div>
                                <Link to={`/progress/resources/categories/${category.id}`} className="c-category-link">
                                    <p>{category.title}</p>
                                </Link>
                            </div>
                    })
                }
                <div className="modal fade" id="newResourceCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create New Category</h5>
                            </div>
                            <div className="modal-body">
                                <form> 
                                    <div className="form-group">
                                        <label htmlFor="titleInput">Category Title</label>
                                        <input className="form-control" id="titleInput" name="title" type="text" placeholder="Category Title"/>
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

export default ResourceCategories;