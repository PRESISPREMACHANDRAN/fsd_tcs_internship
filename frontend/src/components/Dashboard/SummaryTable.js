import React from 'react';
import { Table } from 'react-bootstrap';

const SummaryTable = ({ details }) => {
    return (
        <Table variant="dark" style={{ "whiteSpace": 'nowrap' }} hover responsive>
            <thead>
                {
                    details.map((item, index) => {
                        let objValues = Object.keys(item);
                        if (index === 0) {
                            return (
                                <tr key={index}>
                                    {
                                        objValues.map(
                                            (value, index) =>
                                                <th key={index} className={isNaN(item[value]) ? "" : "text-end"}>
                                                    {value}
                                                </th>
                                        )
                                    }
                                </tr>
                            );
                        } else {
                            return null;
                        }
                    })
                }
                           
            </thead>
            <tbody style={{ cursor: "pointer" }}>
                {
                    details.map((item, index) => {
                        let objValues = Object.values(item);
                        return (
                            <tr key={index}>
                                {
                                    objValues.map(
                                        (value, index) => <td key={index} className={isNaN(value) ? "" : "text-end"}>{value}</td>
                                    )
                                }
                            </tr>
                        );
                    })
                }
            </tbody>
        </Table>
    );
};

export default SummaryTable;