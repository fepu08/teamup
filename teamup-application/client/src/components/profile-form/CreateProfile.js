import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Row, Button, Col, Form, FormGroup} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import {createProfile} from "../../actions/profile";

const CreateProfile = ({createProfile, history}) => {
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        country: '',
        skills: '',
        githubusername: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        instagram: ''
    });

    const  {
        address,
        city,
        country,
        skills,
        githubusername,
        twitter,
        facebook,
        linkedin,
        instagram
    } = formData;

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history);
    };

    return (
        <Col className={"col-sm-12 col-lg-8 mx-auto"}>
            <h1>Create Your Profile</h1>
            <p className={"lead"}>
                <i className={"fas fa-user"}/> Let's get some information to make your profile stand out
            </p>
            <small>* = required field</small>
            <Form onSubmit={e => onSubmit(e)}>
                <Form.Group>
                    <Form.Control
                        type={"text"}
                        name={"country"}
                        value={country}
                        onChange={e => onChange(e)}
                        placeholder={"Country"}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Control
                        type={"text"}
                        name={"city"}
                        value={city}
                        onChange={e => onChange(e)}
                        placeholder={"City"}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Control
                        type={"text"}
                        name={"address"}
                        value={address}
                        onChange={e => onChange(e)}
                        placeholder={"Address"}
                    />
                </Form.Group>

                <FormGroup>
                    <Form.Control
                        type="text"
                        placeholder="* Skills"
                        name="skills"
                        value={skills}
                        onChange={e => onChange(e)}
                    />
                    <Form.Text className={"text-muted"}>
                        Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
                    </Form.Text>
                </FormGroup>

                <FormGroup>
                    <Form.Control
                        type="text"
                        placeholder="Github Username"
                        name="githubusername"
                        value={githubusername}
                        onChange={e => onChange(e)}
                    />
                    <Form.Text className={"text-muted"}>
                        If you want your latest repos and a Github link, include your
                        username
                    </Form.Text>
                </FormGroup>

                <div className={"my-2"}>
                    <Button
                        onClick={() => toggleSocialInputs(!displaySocialInputs)}
                        type="button"
                        className="btn btn-info col-12 col-lg-6"
                    >
                        Add Social Network Links
                    </Button>
                    <span className={"mx-2"}>Optional</span>
                </div>

                {displaySocialInputs && (
                    <Fragment>
                            <FormGroup as={Row} className="social-input mt-3">
                                <Form.Label column sm={"1"}>
                                    <i className="fab fa-twitter fa-2x" />
                                </Form.Label>
                                <Col sm={"11"}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Twitter URL"
                                        name="twitter"
                                        value={twitter}
                                        onChange={e => onChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                        <FormGroup as={Row} className="social-input">
                            <Form.Label column sm={"1"}>
                                <i className="fab fa-facebook fa-2x mr-2" />
                            </Form.Label>
                            <Col sm={"11"}>
                                <Form.Control
                                    type="text"
                                    placeholder="Facebook URL"
                                    name="facebook"
                                    value={facebook}
                                    onChange={e => onChange(e)}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="social-input">
                             <Form.Label column sm={"1"}>
                                 <i className="fab fa-linkedin fa-2x mr-2"/>
                             </Form.Label>
                            <Col sm={"11"}>
                                <Form.Control
                                    type="text"
                                    placeholder="Linkedin URL"
                                    name="linkedin"
                                    value={linkedin}
                                    onChange={e => onChange(e)}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="social-input">
                            <Form.Label column sm={"1"}>
                                <i className="fab fa-instagram fa-2x mr-2" />
                            </Form.Label>
                            <Col sm={"11"}>
                                <Form.Control
                                    type="text"
                                    placeholder="Instagram URL"
                                    name="instagram"
                                    value={instagram}
                                    onChange={e => onChange(e)}
                                />
                            </Col>
                        </FormGroup>
                    </Fragment>
                )}

                <Button variant="primary" className={"btn-block mt-3 btn-lg"} type="submit">
                    Submit
                </Button>
                <Link className={"btn btn-secondary btn-lg btn-block"} to={"/dashboard"}>Go Back</Link>
            </Form>
        </Col>
    )
}

CreateProfile.propTypes = {
    createProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {createProfile})(withRouter(CreateProfile));