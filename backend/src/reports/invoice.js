const {numToEnglish} = require("../helpers/utility")

const generateInvoice = (invoice) => {
    const title = "INVOICE";
    const invoiceID = invoice.invoiceID;
    const invoiceDate = invoice.invoiceDate;
    const dueDate = invoice.dueDate;
    const custName = invoice.custDetails[0].customerName;
    const address1 = invoice.custDetails[0].addressLine1;
    const address2 = invoice.custDetails[0].addressLine2;
    const address3 = invoice.custDetails[0].addressLine3;
    const city = invoice.custDetails[0].city;
    const state = invoice.custDetails[0].state;
    const country = invoice.custDetails[0].country;
    const PIN = invoice.custDetails[0].pincode;
    const phoneNo = invoice.custDetails[0].contactNo1;
    const items = invoice.items;
    const otherCharges = invoice.otherCharges;

    let address = address1 + ", <br />" + address2 + ",<br/>";
    if (address3 !== "")
        address += address3 + ", <br />";
    address += city + ", <br />";
    address += state + ", <br />";
    address += country + " - " + PIN + "<br/>";
    address += "Phone No. : " + phoneNo;
    let total = Number(otherCharges);
    let otherChargesText = "";
    if (total > 0)
        otherChargesText = "<b>Other Charges: " + total;

    return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Invoice</title>
          <style>
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica';
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .text-right{
                text-align: right;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 10px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="6">
                      <table>
                        <tr>
                           <td colspan="2" class="title justify-center">ABC Company</td>      
                        </tr>
                        <tr>
                           <td colspan="2" class="justify-center">Address</td>      
                        </tr>
                        <tr>
                           <td colspan="2" class="justify-center"><h3>${title}</h3></td>      
                        </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">
                   <td colspan="6">
                      <table>
                        <tr>
                           <td><b>Invoice No.:</b> ${invoiceID}</td>
                           <td class="text-right">
                              <b>Date:</b> ${invoiceDate.toString().substring(0, 15)}
                           </td>
                        </tr>
                         <tr>
                            <td>
                               <b>Billed to:</b> ${custName}
                            </td>
                            <td class="text-right">
                               <b>Address:</b> ${address}
                            </td>
                         </tr>
                         <tr>
                            <td>
                                <b>Due Date:</b>${dueDate.toString().substring(0, 15)}
                            </td>
                            <td>
                                <b>${otherChargesText}</b>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="heading">
                   <td>Item ID</td>
                   <td>Item Name</td>
                   <td class="text-right">Rate</td>
                   <td class="text-right">Tax</td>
                   <td class="text-right">Quantity</td>
                   <td class="text-right">Total</td>
                </tr>
                ${items.map((item) => {
                    total += Number(item.total);
                    return (`
                        <tr>
                            <td>${item.itemID}</td>
                            <td>${item.itemName}</td>
                            <td class="text-right">${Number(item.price).toFixed(2)}</td>
                            <td class="text-right">${Number(item.tax).toFixed(2)}</td>
                            <td class="text-right">${item.quantity}</td>
                            <td class="text-right">${Number(item.total).toFixed(2)}</td>
                        </tr>` 
                    )
                }).join("\n")
                }
               
             </table>
             <br />
             <div class="justify-center">
               <h1>Total price: ${total.toFixed(2)}</h1>
               <i>${numToEnglish(total)} only</i>
            </div>
          </div>
       </body>
    </html>
    `;
};

module.exports = generateInvoice;