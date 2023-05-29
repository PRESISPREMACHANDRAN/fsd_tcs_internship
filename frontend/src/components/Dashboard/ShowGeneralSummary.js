import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getGeneralSummary } from './loadDashboardData';
import './Dashboard.css';
import ShowGenralSummaryModal from './ShowGenralSummaryModal';

const ShowGeneralSummary = ({token}) => {
    const [details, setDetails] = useState([]);

    const loadDetails = async () => {
        let genSummary = await getGeneralSummary(token);
        setDetails(genSummary);
    }
        

    useEffect( () => {
        loadDetails();
    }, []);

    if (Object.keys(details).length > 3)
        return (
            <Row className="dashBox">
                <ShowTile itemName="Inventory Items" itemNum={details.items} bgColor="#D32D41"
                    link="/item" token={token} title="ITEM" />
                <ShowTile itemName="Item Groups" itemNum={details.itemGroups} bgColor="#1C4E80"
                    link="/item-group" token={token} title="ITEM GROUP" />
                <ShowTile itemName="Customers" itemNum={details.customers} bgColor="#6AB187"
                    link="/customer" token={token} title="CUSTOMER" />
                <ShowTile itemName="Vendors" itemNum={details.vendors} bgColor="#DBAE58"
                    link="/vendor" token={token} title="VENDOR" />
            </Row>
        );
    else
        return "";

};

const ShowTile = ({
    itemName,
    itemNum,
    bgColor,
    link,
    token,
    title
}) => {
    return (
        <div style={{backgroundColor: bgColor}} className="col-lg-2 col-md-3 col-sm-5 p-3 sumTile">
            <h1>{itemNum}</h1>
           <Link className="text-white link" to={link}> <h4>{itemName}</h4> </Link>
            <ShowGenralSummaryModal token={token} title={title} />
        </div>
    )
}

export default ShowGeneralSummary;