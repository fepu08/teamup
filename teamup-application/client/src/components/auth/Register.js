import React, { Fragment, useState} from "react";
import { connect } from 'react-redux';
import {Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {setAlert} from "../../actions/alert";
import PropTypes from 'prop-types';

const Register = ({setAlert}) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: ""
    });

    const {first_name, last_name, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2) {
            setAlert('Password do not match', 'danger');
        } else {
            console.log('Success');
        }
    }

    return(
        <Fragment>
            <Row>
                <Col xs={12} md={8} lg={6} className={"mx-auto"}>
                    <h1 className={"text-primary text-justify text-center"}>Sign Up</h1>
                    <p className={"lead"}><i className={"fas fa-user"}/> Create Your Account</p>
                    <Form action={"create-profile.html"} onSubmit={e => onSubmit(e)}>
                        <Form.Group>
                            <input
                                className={"form-control"}
                                type={"text"}
                                placeholder={"First name"}
                                name={"first_name"}
                                value={first_name}
                                onChange={e => onChange(e)}
                                required />
                        </Form.Group>
                        <Form.Group>
                            <input
                                className={"form-control"}
                                type={"text"}
                                placeholder={"Last name"}
                                name={"last_name"}
                                value={last_name}
                                onChange={e => onChange(e)}
                                required />
                        </Form.Group>
                        <Form.Group>
                            <input
                                className={"form-control"}
                                type={"email"}
                                placeholder={"Email Address"}
                                name={"email"}
                                value={email}
                                onChange={e => onChange(e)}
                                required
                            />
                            <small className={"form-text"}>
                                This site uses Gravatar so if you want a profile image, use a Gravatar email
                            </small>
                        </Form.Group>
                        <Form.Group>
                            <input
                                className={"form-control"}
                                type={"password"}
                                placeholder={"Password"}
                                name={"password"}
                                minLength={"6"}
                                value={password}
                                onChange={e => onChange(e)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <input
                                className={"form-control"}
                                type={"password"}
                                placeholder={"Confirm Password"}
                                name={"password2"}
                                minLength={"6"}
                                value={password2}
                                onChange={e => onChange(e)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <input
                                   type={"submit"}
                                   className={"btn btn-primary btn-block"}
                                   value={"Register"}
                            />
                        </Form.Group>
                    </Form>
                    <p className={"my-1"}>
                        Already have an account? <Link to={"/login"} className={"text-info font-weight-bold"}>Sing In</Link>
                    </p>
                </Col>
            </Row>
        </Fragment>
    );
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired
}

export default connect(null, {setAlert})(Register);
