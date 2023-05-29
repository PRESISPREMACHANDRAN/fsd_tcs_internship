import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { getMonthlySummary } from './loadDashboardData';
import SummaryTable from './SummaryTable';

const MonthlySummary = ({
    type,
    token,
    link
}) => {
    //For Summary Data
    const [details, setDetails] = useState([]);
    const [title, setTitle] = useState("");

    const loadDetails = async () => {
        let heading = "";
        switch (type) {
            case 1: //SalesOrders
                heading = "Sales Orders";
                break;
            case 2: //Purchase Orders
                heading = "Purchase Orders";
                break;
            case 3: //Delivery Challan Summary
                heading = "Delivery Challans";
                break;
            case 4: //Package Summary
                heading = "Packages";
                break;
            case 5: //Sales Return Summary
                heading = "Sales Returns";
                break;
            case 6: //Invoice Summary
                heading = "Invoices";
                break;
            case 7: //Bill Summary
                heading = "Bills";
                break;
            case 8: //Inventory Adjustments, Receipts, Payments
                heading = "";
                break;
            default:
                break;
        }
        setTitle(heading);
        try {
            let summary = await getMonthlySummary(token, type);
            setDetails(summary);
        } catch(error) {
            console.log(error);
        }
        
    }

    useEffect(() => loadDetails(), []);


    return (
        <div className="summaryTile">
            <Link to={link} className="link"><h3>{title}</h3></Link>
            <SummaryTable details = {details} />
        </div>
    );
};

export default MonthlySummary;