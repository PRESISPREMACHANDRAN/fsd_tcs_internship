import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal } from 'react-bootstrap';
import Logout from '../Admin/logout';

const CreateUser = () => {
    const initValues = {
        username: "",
        email: "",
        password: "",
        retypePsw: ""
    };
    const { token } = useToken();
    let navigate = useNavigate();
    //Manage Form Field Values
    const [postValues, setPostValues] = useState(initValues);

     //Manage Error Values
     const [errorValues, setErrorValues] = useState({});

    //Modal properties
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState({ header: "", body: "" });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //To check whether admin
    const isAdmin = async () => {
        let api = "http://localhost:8000/admin/is-admin";
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        };
        let response = await axios.get(api, options);
        if (response.status === 401)
            Logout();
        if (response.data.status !== "Authorized") {
            window.alert(response.data.message);
            navigate("/home", { replace: true });
        }
    }

    useEffect(() => isAdmin(), []);
    
    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    const validateEntry = () => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        
        if (!postValues.username) {
            errors.username = "Username is required";
        }
        if (!postValues.email) {
            errors.email = "Email is required";
        } else if (!regex.test(postValues.email)) {
            errors.email = "Email is invalid";
        }
        if (!postValues.password) {
            errors.password = "Password is required";
        } else if (postValues.password.length < 5) {
            errors.password = "Password is too short";
        } else if (postValues.password !== postValues.retypePsw) {
            errors.password = "Passwords must match";
        }
        
        return errors;
    }
    

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let validatationErrors = validateEntry();
        setErrorValues(validatationErrors);
        if (Object.keys(validatationErrors).length === 0)
            signupUser();
    }

    //Posting form data to API
    const signupUser = async () => {
        const username = postValues.username;
        const email = postValues.email;
        const password = postValues.password;
        
        let api = "http://localhost:8000/admin/signup";
        let data = { username, email, password};
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        };
        
        let response = await axios.post(api, data, options);

        if (response.status === 401)
           Logout();    
        if (response.data.status === "Success") {
            setModalText({
                header: "Item Group",
                body: "Operation completed successfully"
            });
            setPostValues(initValues);
        } else {
            setModalText({
                header: "Error",
                body: "An unexpected error occured. Please try again!"
            });
        }
        handleShow();
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg" onSubmit={handleSubmit}>
            <div className="text-center fs-1 mb-1 formHead">CREATE USER</div>
            <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formUserName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" name="username" value={postValues.username} onChange={handleChange} placeholder="User Name" />
                    <Form.Text className="text-danger">{ errorValues.username }</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formEmail">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control type="email" name="email" value={postValues.email} onChange={handleChange} placeholder="Email ID" />
                    <Form.Text className="text-danger">{ errorValues.email }</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPsw">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={postValues.password} onChange={handleChange} placeholder="Password" />
                    <Form.Text className="text-danger">{ errorValues.password }</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formRetypePsw">
                    <Form.Label>Retype Password</Form.Label>
                    <Form.Control type="password" name="retypePsw" value={postValues.retypePsw} onChange={handleChange} placeholder="Retype Password" />
                </Form.Group>
            </Row>
            <div className="mb-4">
                <Button variant="primary" type="submit" >Submit</Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ modalText.header }</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ modalText.body }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
};

export default CreateUser;