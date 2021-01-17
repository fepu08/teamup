import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const Landing = ({isAuthenticated}) => {
    if (isAuthenticated) {
        <Redirect to={"/dashboard"} />
    }

    return (
        <div className={"row"}>
            <div className={"col-md-6 col-lg-2"}>Some content 1</div>
            <div className={"col-md-6 col-lg-2"}>Some content 2</div>
            <div className={"col-md-6 col-lg-2"}>Some content 3</div>
        </div>
    );
}

Landing.propTypes = {
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);