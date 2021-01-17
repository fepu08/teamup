import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from "react-bootstrap";

const DashboardActions = () => {
    return (
        <Row>
            <Col>
                <Link to={"/edit-profile"} className={"btn btn-light text-dark"}>
                    <i className={"fas fa-user-circle text-primary"}/> Edit Profile
                </Link>
            </Col>
        </Row>
    )
}

export default DashboardActions;