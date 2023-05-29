import axios from 'axios';
import React, { useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Table, Row, Button} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { formatDate, formatDateFromDB } from '../../utility';

const ItemAdjDatewise = () => {
    const initValues = {
        fromDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        toDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK"))
    }
    const { token } = useToken();
    //Set initial dates
    const [postValues, setPostValues] = useState(initValues);
    const [errorValues, setErrorValues] = useState({});
    const [details, setDetails] = useState([]);
    

    //Input values to post values
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Validate Dates
    const validateDates = () => {
        let fromDate = postValues.fromDate;
        let toDate = postValues.toDate;
        let isValid = true;
        let validationErrors = {};

        if (!postValues.fromDate)
            validationErrors.fromDate = "From date is required";
        if (!postValues.toDate)
            validationErrors.toDate = "To date is required";
        if (isNaN(new Date(fromDate).getTime())) {
            isValid = false;
            validationErrors.fromDate = "Invalid from Date";
        }
        if (isNaN(new Date(toDate).getTime())) {
            isValid = false;
            validationErrors.toDate = "Invalid to Date";
        }
        if (isValid) {
            if (new Date(fromDate) > new Date(toDate)) {
                validationErrors.fromDate = "From date cannot be greater than to date";
            }
        }
        
        return validationErrors;
    }

    const getDetails = async (event) => {
        const { name } = event.target;
        let fromDate = postValues.fromDate;
        let toDate = postValues.toDate;
        let validationErrors = validateDates();
        let exportToExcel = "N";
        if (name === "export")
            exportToExcel = "Y";
        setErrorValues(validationErrors);
        setDetails([]);
        if (Object.keys(validationErrors).length !== 0)
            return 0;
        try {
            let apiURL = "http://localhost:8000/inventory/inv-adj-datewise";
            apiURL += "?fromDate=" + fromDate + "&toDate=" + toDate;
            apiURL += "&exportToExcel=" + exportToExcel;
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }
            if (exportToExcel === "Y") {
                options.responseType = 'blob';
                options.timeout = 30000;
            }
            let response = await axios.get(apiURL, options);
            if (response.status === 401)
                Logout();
            if (exportToExcel !== "Y") {
                if (Array.isArray(response.data))
                    setDetails(response.data);
                else
                    window.alert(response.data.message);
            } else {
                if (response.data.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    const blob = await response.data;
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    URL.revokeObjectURL(url);
                } else if (response.data.type === "application/json") {
                    if (response.data.status)
                        window.alert(response.data.message);
                } else {
                    window.alert("An unexpected error occured.");
                }
            }
            console.log(response);
        } catch (err) {
            window.alert("An error occurred while getting data.");
        }
    }

    return (
        <Form className="mx-auto col-lg-8 col-md-10 col-sm-12 p-3 formBg">
            <div className="text-center fs-3 mb-1 formHead">VIEW INVENTORY ADJUSTMENT DATEWISE</div>
            <Row>
                <Form.Group className="col-md-6 mb-2" controlId="formFromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control type="date" name="fromDate" value={postValues.fromDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.fromDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formToDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control type="date" name="toDate" value={postValues.toDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.toDate}</Form.Text>
                </Form.Group>
            </Row>
            <Button type="button" name="view" onClick={getDetails}>View</Button> &emsp;
            <Button type="button" name="export" onClick={getDetails}>Export</Button>  
            <div style={{ overflow: "auto", "whiteSpace": 'nowrap' }}>
                <ShowDetails details={details} />
            </div>
        </Form>
    );
};

const ShowDetails = ({ details }) => {
    if (!details)
        return ("");
    if (details.length === 0)
        return ("");
    
    return (
        <>
            <Table style={{ "whiteSpace": 'nowrap' }} hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Ref. No.</th>
                        <th>Adj Mode</th>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th className="text-end">Quantity</th>
                        <th>Unit</th>
                        <th>Reason</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        details.map(item => {
                            return (
                                <tr key={item["Ref No"]}>
                                    <td>{formatDateFromDB(item["Date"])}</td>
                                    <td>{item["Ref No"]}</td>
                                    <td>{item["Adj Mode"] === "D" ? "Decrease" : "Increase"}</td>
                                    <td>{item["Item ID"]}</td>
                                    <td>{item["Item"]}</td>
                                    <td className="text-end">{item["Quantity"]}</td>
                                    <td>{item["Unit"]}</td>
                                    <td>{item["Reason"]}</td>
                                    <td>{item["Description"]}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default ItemAdjDatewise;