import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal } from 'react-bootstrap';
import { validateItemEntry } from './validateItemEntry';
import PreLoader from '../PreLoader';
import { getItemGroups, getItemDetails } from './loadItems';
import Logout from '../Admin/logout';
import PickList from '../PickList/PickList';
import { intializeItems } from '../PickList/intializeProperties';

const Items = () => {
    const initValues = {
        itemID: "",
        groupID: "",
        groupName: "",
        itemName: "",
        unit: "",
        dimensions: "",
        weight: "",
        manufacturer: "",
        brand: "",
        sellingPrice: "0.00",
        costPrice: "0.00",
        descr: "",
        openingStock: "0",
        reorderPoint: "0",
        prefVendor: "",
        itemImg: [],
        filepreview: null
    };
    const { token } = useToken();
    //Manage Form Field Values
    const [postValues, setPostValues] = useState(initValues);
    const [itemGroups, setItemGroups] = useState([]);
    
    //Manage Error Values
    const [errorValues, setErrorValues] = useState({});

    //Modal properties
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState({ header: "", body: "" });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //For picklist
    const [plItems, setPlItems] = useState({});

    //To show preloader
    const [loading, setLoading] = useState(true);

    //Load item groups
    const fetchItemGroups = async () => {
        const itemGroups = await getItemGroups(token);
        setItemGroups(itemGroups);
        let itemList = await intializeItems("A", token);
        setPlItems(itemList);
        setLoading(false);
    }
    
    useEffect(() => {
        fetchItemGroups();
    }, []);

    //Load item details
    const loadItemDetails = async (item) => {
        const itemDetails = await getItemDetails(token, item[0]);
        itemDetails.filepreview = "/uploads/" + itemDetails.itemImg;
        setPostValues(itemDetails)
    }
    
    //Input values to postValues
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (event.nativeEvent.target.nodeName === "SELECT") {
            let index = event.nativeEvent.target.selectedIndex;
            setPostValues({
                ...postValues,
                [name]: value,
                groupName: event.nativeEvent.target[index].text
            });
        } else {
            setPostValues({ ...postValues, [name]: value });
        }
    }

    //Input Item Image for Upload
    const handleFileChange = (event) => {
        setPostValues({
            ...postValues,
            itemImg: event.target.files[0],
            filepreview: URL.createObjectURL(event.target.files[0]),
        });
        
    }

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let validationErrors = validateItemEntry(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            postValues.itemID === "" ? insertItem() : updateItem();
    }

    //Posting form data to API
    const insertItem = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("itemName", postValues.itemName);
        formData.append("groupName", postValues.groupName);
        formData.append("groupID", postValues.groupID);
        formData.append("unit", postValues.unit);
        formData.append("dimensions", postValues.dimensions);
        formData.append("weight", postValues.weight);
        formData.append("manufacturer", postValues.manufacturer);
        formData.append("brand", postValues.brand);
        formData.append("sellingPrice", postValues.sellingPrice);
        formData.append("costPrice", postValues.costPrice);
        formData.append("descr", postValues.descr);
        formData.append("openingStock", postValues.openingStock);
        formData.append("reorderPoint", postValues.reorderPoint);
        formData.append("prefVendor", postValues.prefVendor);
        if(postValues.filepreview !== null)
            formData.append("itemImg", postValues.itemImg, postValues.itemImg.fileName);
        
        const response = await axios.post("http://localhost:8000/inventory/item",
            formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': token
            }
        });
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Item",
                body: "Item successfully inserted"
            });
            setPostValues(initValues);
        } else {
            setModalText({
                header: "Error",
                body: "An unexpected error occured. Please try again!"
            });
        }
        setLoading(false);
        handleShow();
    }

    //Updating SP, CP, Description, preffered vendor
    const updateItem = async () => {
        let itemID = postValues.itemID;
        console.log(itemID);
        if (itemID === "")
            return;
        let sellingPrice = postValues.sellingPrice;
        let costPrice = postValues.costPrice;
        let descr = postValues.descr;
        let reorderPoint = postValues.reorderPoint;
        let prefVendor = postValues.prefVendor;
        console.log(reorderPoint);
        setLoading(true);
        let data = {
            sellingPrice, costPrice, descr, reorderPoint, prefVendor
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        console.log(data);
        const response = await axios.put(`http://localhost:8000/inventory/item/${itemID}/update`, data, options);
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Item",
                body: "Item successfully updated"
            });
            setPostValues(initValues);
        } else {
            setModalText({
                header: "Error",
                body: "An unexpected error occured. Please try again!" + response.data.message
            });
        }
        setLoading(false);
        handleShow();
        fetchItemGroups();
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="text-center fs-1 mb-1 formHead">INVENTORY ITEM</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Item</Button>&emsp;
                <Form.Label>Select Item</Form.Label>
                <PickList title={plItems.title} rowHeaders={plItems.rowHeaders} search={plItems.search}
                    data={plItems.data} onSelect={loadItemDetails} /> 
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formItemName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" name="itemName" value={postValues.itemName} onChange={handleChange} placeholder="Item Name" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.itemName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6  mb-3" controlId="formItemGroup">
                    <Form.Label>Item Group</Form.Label>
                    <Form.Select name="groupID" value={postValues.groupID} onChange={handleChange} disabled={ postValues.itemID !== ""} >
                        <option value="">--Select--</option>
                        {itemGroups.map(item => <option value={item.ID} key={item.ID}>{item["Group Name"]}</option>)}
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.groupID}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formUnit">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control type="text" name="unit" value={postValues.unit} onChange={handleChange} placeholder="Unit" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.unit}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formDimensions">
                    <Form.Label>Dimensions</Form.Label>
                    <Form.Control type="text" name="dimensions" value={postValues.dimensions} onChange={handleChange} placeholder="L x B x H" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.dimensions}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formWeight">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type="text" name="weight" value={postValues.weight} onChange={handleChange} placeholder="Weight" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.weight}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formManufacturer">
                    <Form.Label>Manufacturer</Form.Label>
                    <Form.Control type="text" name="manufacturer" value={postValues.manufacturer} onChange={handleChange} placeholder="Manufacturer" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.manufacturer}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formBrand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type="text" name="brand" value={postValues.brand} onChange={handleChange} placeholder="Brand" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.brand}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formDescr">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="descr" value={postValues.descr} onChange={handleChange} placeholder="Description" />
                    <Form.Text className="text-danger">{errorValues.descr}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formSP">
                    <Form.Label>Selling Price</Form.Label>
                    <Form.Control type="number" name="sellingPrice" value={postValues.sellingPrice} onChange={handleChange} placeholder="Selling Price" />
                    <Form.Text className="text-danger">{errorValues.sellingPrice}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formCP">
                    <Form.Label>Cost Price</Form.Label>
                    <Form.Control type="number" name="costPrice" value={postValues.costPrice} onChange={handleChange} placeholder="Cost Price" />
                    <Form.Text className="text-danger">{errorValues.costPrice}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formOpeningStock">
                    <Form.Label>Opening Stock</Form.Label>
                    <Form.Control type="number" name="openingStock" value={postValues.openingStock} onChange={handleChange} placeholder="Opening Stock" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.openingStock}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formReorderPoint">
                    <Form.Label>Reorder Point</Form.Label>
                    <Form.Control type="number" name="reorderPoint" value={postValues.reorderPoint} onChange={handleChange} placeholder="Reorder Point" />
                    <Form.Text className="text-danger">{errorValues.reorderPoint}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPV">
                    <Form.Label>Preffered Vendor</Form.Label>
                    <Form.Control type="text" name="prefVendor" value={postValues.prefVendor} onChange={handleChange} placeholder="Preffered Vendor" />
                    <Form.Text className="text-danger">{errorValues.prefVendor}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formItemImg">
                    <Form.Label>Item Image</Form.Label>
                    <Form.Control type="file" name="itemImg" onChange={handleFileChange} accept="image/*" disabled={ postValues.itemID !== ""} />
                    <Form.Text className="text-danger">{errorValues.itemImg}</Form.Text>
                    {postValues.filepreview !== null ?
                        <img className="img-fluid" src={postValues.filepreview} alt="Item" />
                        : null}
                </Form.Group>
            </Row>
            <div className="d-grid mb-4">
                <Button variant="primary" type="submit" >Submit</Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalText.body}</Modal.Body>
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

export default Items;