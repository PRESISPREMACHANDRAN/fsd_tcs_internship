import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal } from 'react-bootstrap';
import Logout from '../Admin/logout';
import PickList from '../PickList/PickList';
import { intializeItemGroups } from '../PickList/intializeProperties';
import { getItemGroupByID } from './loadItems';


const ItemGroup = () => {
    const initValues = {
        ID: "",
        groupName: "",
        tax: "0.00"
    };
    const { token } = useToken();
    //Manage Form Field Values
    const [postValues, setPostValues] = useState(initValues);

    //Modal properties
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState({ header: "", body: "" });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //Picklist
    const [plItemGroups, setPlItemGroups] = useState(initValues);

    //Load item groups
    const fetchItemGroups = async () => {
        let itemGroupList = await intializeItemGroups(token);
        setPlItemGroups(itemGroupList);
    }
    
    useEffect(() => {
        fetchItemGroups();
    }, []);

    //Load Item group details
    const loadDetails = async (item) => {
        const itemDetails = await getItemGroupByID(token, item[1]);
        itemDetails.groupName = itemDetails["Group Name"];
        setPostValues(itemDetails);
    }
     
    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        if (postValues.groupName !== "" && Number(postValues.tax) > 0)
            insertItemGroup();
    }

    //Posting form data to API
    const insertItemGroup = async () => {
        const groupID = postValues.ID;
        const groupName = postValues.groupName;
        const tax = postValues.tax;
        
        let api = "http://localhost:8000/inventory/item-group";
        let data = { groupName, tax };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        };
        let response = ""
        if (groupID !== "") {
            api = `http://localhost:8000/inventory/item-group/${groupID}/update`;
            response = await axios.put(api, data, options);
        } else {
            response = await axios.post(api, data, options);
        }

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
        fetchItemGroups();
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg" onSubmit={handleSubmit}>
            <div className="text-center fs-1 mb-1 formHead">ITEM GROUP</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Item Group</Button>&emsp;
                <Form.Label>Select Item Group</Form.Label>
                <PickList title={plItemGroups.title} rowHeaders={plItemGroups.rowHeaders} search={plItemGroups.search}
                    data={plItemGroups.data} onSelect={loadDetails} /> 
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formGroupName">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control type="text" name="groupName" value={postValues.groupName} onChange={handleChange} placeholder="Group Name" />
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formGroupTax">
                    <Form.Label>Tax %</Form.Label>
                    <Form.Control type="text" name="tax" value={postValues.tax} onChange={handleChange} placeholder="Tax%" />
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


export default ItemGroup;