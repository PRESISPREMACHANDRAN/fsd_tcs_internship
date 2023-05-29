import React, { useState } from 'react';
import axios from 'axios';
import { Form, Row, Button, Modal, Table } from 'react-bootstrap';
import PickList from '../PickList/PickList';
import { intializeCustomer, intializeVendor, intializeItems } from '../PickList/intializeProperties';
import { getItemGroups } from '../Items/loadItems';
import PreLoader from '../PreLoader';
import SummaryTable from './SummaryTable';

const ShowGenralSummaryModal = ({
    title,
    token
}) => {
    const initValues = {
        itemID: "",
        itemName: ""
    };
    const [item, setItem] = useState(initValues);
    const [details, setDetails] = useState([]);

    //Picklist properties
    const [plProps, setPlProps] = useState({});

    //Modal properties
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    //To show preloader
    const [loading, setLoading] = useState(false);
        
    const handleShow = async () => {
        Intialize();
        setShow(true);
    }

    const showSummary = async () => {
        if (!item.itemID)
            return 0;
        setLoading(true);
        let apiURL = "";
        switch (title) {
            case "CUSTOMER":
                apiURL = "http://localhost:8000/dashboard/customer-summary/";
                break;
            case "VENDOR":
                apiURL = "http://localhost:8000/dashboard/vendor-summary/";
                break;
            case "ITEM":
                apiURL = "http://localhost:8000/dashboard/item-summary/";
                break;
            default:
                break;
        }
        apiURL += item.itemID;
        try {
            const response = await axios.get(apiURL, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            });
           
            if (!response.data.status) {
                let arr = [];
                arr.push(response.data);
                setDetails(arr);
            }
        } catch {
            window.alert("Unexpected error occured.");
        } finally {
            setLoading(false);
        }
    };

    async function Intialize() {
        setDetails([]);
        setItem(initValues);
        switch (title) {
            case "CUSTOMER":
                let customersList = await intializeCustomer(token);
                setPlProps(customersList);
                break;
            case "VENDOR":
                let vendorList = await intializeVendor(token);
                setPlProps(vendorList);
                break;
            case "ITEM":
                let itemList = await intializeItems("A", token);
                setPlProps(itemList);
                break;
            case "ITEM GROUP":
                setLoading(true);
                let itemGroups = await getItemGroups(token);
                setDetails(itemGroups);
                setLoading(false);
                break;
            default:
                break;
        }
    }

    const loadName = (select) => {
        setDetails([]);
        setItem(initValues);
        switch (title) {
            case "CUSTOMER":
                setItem({ itemID: select[0], itemName: select[2] });
                break;
            case "VENDOR":
                setItem({ itemID: select[0], itemName: select[2] });
                break;
            case "ITEM":
                setItem({ itemID: select[0], itemName: select[1] });
                break;
            default:
                break;
        }
    }


    return (
        <>
            <PreLoader loading={loading} />
            <Button variant="primary" onClick={handleShow}>...</Button>
            <Modal show={show} onHide={handleClose} fullscreen={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-secondary">
                    <Row>
                        <Form.Group className="col-md-6 mb-2" controlId="formSearch1">
                            <Form.Label className="text-white">Select </Form.Label>
                            <PickList title={plProps.title} rowHeaders={plProps.rowHeaders} search={plProps.search}
                                data={plProps.data} onSelect={loadName} />
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-2" controlId="formSearch2">
                            <Form.Label className="text-white">Name</Form.Label>
                            <Form.Control type="text" name="search2" value={item.itemName} disabled />
                        </Form.Group>
                    </Row>
                    <Button variant="primary" onClick={showSummary}>Show Summary</Button> <br />
                    <SummaryTable details={ details }/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ShowGenralSummaryModal;