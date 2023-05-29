import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal } from 'react-bootstrap';
import PreLoader from '../PreLoader';
import { getItemByGroups, getItemGroups } from './loadItems';
import { formatDate } from '../../utility';
import { validateInvAdjustment } from './validateItemEntry';
import Logout from '../Admin/logout';

const InventoryAdj = () => {
    const initValues = {
        refNo: "",
        adjMode: "",
        quantity: 0,
        adjDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        reason: "",
        description: "",
        groupID: "",
        itemID: "",
        itemName: "",
        unit: ""
    };
    const { token } = useToken();
    //Manage Form Field Values
    const [postValues, setPostValues] = useState(initValues);
    const [itemGroups, setItemGroups] = useState([]);
    const [items, setItems] = useState([]);

    //Manage Error Values
    const [errorValues, setErrorValues] = useState({});

    //Modal properties
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState({ header: "", body: "" });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

     //To show preloader
     const [loading, setLoading] = useState(true);

     //Load item groups
     const fetchItemGroups = async () => {
         const itemGroups = await getItemGroups(token);
         setItemGroups(itemGroups);
         setLoading(false);
     }
     
     useEffect(() => {
         fetchItemGroups();
     }, []);

    //Input values to postValues
    const handleChange = async (event) => {
        const { name, value } = event.target;
        if (event.nativeEvent.target.nodeName === "SELECT") {
            switch (name) {
                case "groupID":
                    setPostValues({
                        ...postValues,
                        [name]: value,
                        itemName: "",
                        itemID: "",
                        unit: "",
                    });
                    if (value !== "") {
                        let invItems = await getItemByGroups(token, value);
                        setItems(invItems);
                    } else {
                        setItems([]);
                    } 
                    break;
                case "itemID":
                    let index = event.nativeEvent.target.selectedIndex;
                    if (index !== 0) {
                        setPostValues({
                            ...postValues,
                            [name]: value,
                            itemName: event.nativeEvent.target[index].text,
                            unit: items[index-1].unit
                        });
                    } else {
                        setPostValues({
                            ...postValues,
                            [name]: value,
                            itemName: "",
                            unit: ""
                        });
                    }
                    break;
                default:
                    setPostValues({ ...postValues, [name]: value });
            }
        } else {
            setPostValues({ ...postValues, [name]: value });
        }
    }


     //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let validationErrors = validateInvAdjustment(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertInvAdj();
    }

    //Posting form data to API
    const insertInvAdj = async () => {
        const refNo = postValues.refNo;
        const adjMode = postValues.adjMode;
        const adjDate = postValues.adjDate;
        const quantity = postValues.quantity;
        const reason = postValues.reason;
        const description = postValues.description;
        const groupID = postValues.groupID;
        const itemID = postValues.itemID;
        const itemName = postValues.itemName;
        const unit = postValues.unit;
        const response = await axios.post("http://localhost:8000/inventory/inv-adj", {
            refNo, adjMode, adjDate, quantity, reason,
            description, groupID, itemID, itemName, unit
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Inventory Adjustment",
                body: "Inventory adjustment successfully inserted"
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
            <div className="text-center fs-1 mb-1 formHead">INVENTORY ADJUSTMENT</div>
            <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formAdjMode">
                    <Form.Label>Adj. Mode - Stock on Hand</Form.Label>
                    <Form.Select name="adjMode" value={postValues.adjMode} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="I">Increase</option>
                        <option value="D">Decrease</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.adjMode}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formAdjDate">
                    <Form.Label>Adj. Date</Form.Label>
                    <Form.Control type="date" name="adjDate" value={postValues.adjDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.adjDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6  mb-3" controlId="formItemGroup">
                    <Form.Label>Item Group</Form.Label>
                    <Form.Select name="groupID" value={postValues.groupID} onChange={handleChange} >
                        <option value="">--Select--</option>
                        {itemGroups.map(item => <option value={item.ID} key={item.ID}>{item["Group Name"]}</option>)}
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.groupID}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6  mb-3" controlId="formItem">
                    <Form.Label>Item</Form.Label>
                    <Form.Select name="itemID" value={postValues.itemID} onChange={handleChange} >
                        <option value="">--Select--</option>
                        {items.map((item, index) => (<option value={item.itemID} key={index}>{item.itemName}</option>))}
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.itemID}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" name="quantity" value={postValues.quantity} onChange={handleChange} placeholder="Quantity" />
                    <Form.Text className="text-danger">{errorValues.quantity}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formItemUnit">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control type="text" name="unit" value={postValues.unit} placeholder="Unit" disabled />
                    <Form.Text className="text-danger">{errorValues.unit}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formRefNo">
                    <Form.Label>Reference No.</Form.Label>
                    <Form.Control type="text" name="refNo" value={postValues.refNo} onChange={handleChange} placeholder="Reference No." />
                    <Form.Text className="text-danger">{errorValues.refNo}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formReason">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control type="text" name="reason" value={postValues.reason} onChange={handleChange} placeholder="Reason" />
                    <Form.Text className="text-danger">{errorValues.reason}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formDescr">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" value={postValues.description} onChange={handleChange} placeholder="Description" />
                    <Form.Text className="text-danger">{errorValues.description}</Form.Text>
                </Form.Group>
            </Row>
            <div className="d-grid mb-4">
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
            <PreLoader loading={loading} />
        </Form>
    );
};

export default InventoryAdj;