import React, { Fragment } from 'react';
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
import { withRouter } from "react-router-dom";
import axios from 'axios';

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const clean = DOMPurify.sanitize;

const { NEW_ANSWER } = Mutations;
const { FETCH_QUESTION } = Queries;

class AnswerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: "",
            bold: false,
            italic: false,
            underline: false,
            insertorderedlist: false,
            insertunorderedlist: false,
            linkMenu: false,
            imageMenu: false,
            url: "",
            imageUrl: "",
            imageFile: null,
        }
        this.update = this.update.bind(this);
        this.handleLink = this.handleLink.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.addImage = this.addImage.bind(this);
        this.uploadImageFile = this.uploadImageFile.bind(this);
    }

    update(e) {
        this.setState({body: e.target.innerHTML})
    }

    updateCache(cache, { data }) {
        let question;
        try { 
            question = cache.readQuery({ 
                query: FETCH_QUESTION,
                variables: { id: this.props.questionId } 
            }).question;
        } catch (err) {
            console.log(err);
        }
        if (question) {
            console.log(question);
            let newAnswer = data.newAnswer;
            question.answers.push(newAnswer)
            cache.writeQuery({
                query: FETCH_QUESTION,
                data: { question: question }
            });
        }
    }

    handleSubmit(e, newAnswer) {
        e.preventDefault();
        const cleanBody = clean(this.state.body)
        newAnswer({
            variables: {
                body: cleanBody,
                questionId: this.props.questionId
            }
        })
    }

    format(type) {
        return e => {
            e.preventDefault();
            e.stopPropagation();
            document.execCommand(type, false, null);
            this.setState({[type]: document.queryCommandState(type)});
        }
    }

    handleLink(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ linkMenu: true })
    }

    handleImage(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({imageMenu: true})
    }

    uploadImageFile(e) {
        e.preventDefault();
        const imageFile = e.target.files[0]
        const fd = new FormData();
        fd.append('image', imageFile, imageFile.name)
        axios.post('/api/upload', fd)
            .then(res => {
                console.log(res);
                this.setState({
                    imageUrl: res.data.imageUrl,
                })
            })

    }

    addImage(e) {
        e.preventDefault();
        const div = document.getElementById("editable");
        const text = div.innerHTML;
        div.innerHTML = "";
        div.focus();
        document.execCommand("insertImage", false, this.state.imageUrl)
        div.innerHTML = text + div.innerHTML;
        this.setState({imageMenu: false, imageUrl: ""})
    }

    render() {
        const { bold, italic, underline, insertorderedlist, insertunorderedlist, linkMenu, imageUrl } = this.state;

        const modal = (
            <div className="form-modal">
                <div className="form-modal-content">
                    <div className="form-modal-header">
                        <span onClick={e => this.setState({ imageMenu: false })}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="form-image">
                        <label htmlFor="form-image-url">Image Link:</label>
                        <input type="text"
                            id="form-image-url"
                            placeholder="Image Url"
                            value={imageUrl}
                            onChange={e => this.setState({imageUrl: e.target.value})}
                        />
                    </div>
                    <div className="form-actions">
                        <label id="upload-image" htmlFor="format-file">Upload</label>
                        <button id="add-image" disabled={imageUrl === "" ? true : false} onClick={this.addImage}>Add Image</button>
                        <input type="file"
                            id="format-file"
                            onChange={this.uploadImageFile}
                        />
                    </div>
                </div>
            </div>
        )
        const formatButtons = (
            <Fragment>
                <button className="format" id={bold ? "btn-active" : null} onClick={this.format("bold")}>
                    <i className="fas fa-bold"></i>
                </button>
                <button className="format" id={italic ? "btn-active" : null} onClick={this.format("italic")}>
                    <i className="fas fa-italic"></i>
                </button>
                <button className="format" id={underline ? "btn-active" : null} onClick={this.format("underline")}>
                    <i className="fas fa-underline"></i>
                </button>
                <button className="format" id={insertorderedlist ? "btn-active" : null} onClick={this.format("insertorderedlist")}>
                    <i className="fas fa-list-ol"></i>
                </button>
                <button className="format" id={insertunorderedlist ? "btn-active" : null} onClick={this.format("insertunorderedlist")}>
                    <i className="fas fa-list-ul"></i>
                </button>
                <button className="format" onClick={this.handleLink}>
                    <i className="fas fa-link"></i>
                </button>
                <button className="format" onClick={this.handleImage}>
                    <i className="far fa-images"></i>
                </button>
           
                {this.state.imageMenu ? modal : null}
            </Fragment>
        )

        const linkForm = (
            <Fragment>
                <i id="fa-link-blue" className="fas fa-link"></i>
                <input type="text"
                    id="link-field"
                    placeholder="Enter URL"
                    autoFocus
                    value={this.state.url}
                    onChange={e => {
                        this.setState({url: e.target.value})
                    }}
                />
                <button id="link-add"
                    onClick={e => {
                        e.preventDefault();
                        if (this.state.url === "") {
                            this.setState({linkMenu: "false"})
                        } else {
                            const div = document.getElementById("editable");
                            const text = div.innerHTML;
                            div.innerHTML = "";
                            div.focus();
                            document.execCommand("CreateLink", false, this.state.url)
                            div.innerHTML = text + div.innerHTML;
                        }
                    }}
                >
                    Add
                </button>
            </Fragment>
        )
        
        return (
            <Mutation 
                mutation={NEW_ANSWER}
                update={(cache, data) => this.updateCache(cache, data)}
                onCompleted={data => {
                    this.props.toggleForm();
                }}
            >
                {newAnswer => {
                    return (
                        <div className="answer-form">
                            <div className="answer-header">
                                <div className="user-icon">

                                </div>
                            </div>
                            <div className="answer-format">
                                <button className="format" id={bold ? "btn-active" : null}onClick={this.format("bold")}>
                                    <i className="fas fa-bold"></i>
                                </button>
                                <button className="format" id={italic ? "btn-active" : null}onClick={this.format("italic")}>
                                    <i className="fas fa-italic"></i>
                                </button>
                            </div>
                            <div
                                id="editable"
                                className="answer-content"
                                contentEditable="true"
                                spellCheck="false"
                                onInput={this.update}
                            >
                            </div>

                            <div className="answer-footer">

                                <div className="answer-submit" 
                                    onClick={e => this.handleSubmit(e, newAnswer)}>
                                    Submit
                                </div>
                            </div>
                        </div>
                    )
                }}

            </Mutation>
        )
    }
}

export default AnswerForm;