const { numToEnglish } = require("../helpers/utility");

const inventorySummaryTemplate = (inventorySummary) => {
    let title = "INVENTORY SUMMARY AS ON " + new Date().toLocaleString("en-UK");
    let totalStock = 0;
    return `
<!doctype html>
<html>
   <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
         .invoice-box {
         margin: auto;
         padding: 30px;
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
         padding-bottom: 5px;
         }
         .invoice-box table tr.top table td.title {
         font-size: 25px;
         line-height: 25px;
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
         padding-bottom: 10px;
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
               <td colspan="10">
                  <table>
                    <tr>
                       <td colspan="2" class="title justify-center">ABC Company</td>
                    </tr>
                    <tr>
                       <td colspan="2" class="justify-center">Address</td>
                    </tr>
                    <tr>
                       <td colspan="2" class="justify-center"><h4>${title}</h4></td>
                    </tr>
                  </table>
               </td>
            </tr>
            <tr class="heading">
               <td>Item ID</td>
               <td>Item Name</td>
               <td class="text-right">Reorder Point</td>
               <td class="text-right">Opening Stock</td>
               <td class="text-right">Quantity In</td>
               <td class="text-right">Quantity Out</td>
               <td class="text-right">Quantity Ordered</td>
               <td class="text-right">Quantity Commited</td>
               <td class="text-right">Inventory Adj.</td>
               <td class="text-right">Stock On Hand</td>
            </tr>
            ${inventorySummary.map((item) => {
                totalStock += item.stockOnHand
                return (`
                    <tr>
                        <td>${item.itemID}</td>
                        <td>${item.itemName}</td>
                        <td class="text-right">${item.reorderLevel}</td>
                        <td class="text-right">${item.openingStock}</td>
                        <td class="text-right">${item.quantityIn}</td>
                        <td class="text-right">${item.quantityOut}</td>
                        <td class="text-right">${item.quantityOrdered}</td>
                        <td class="text-right">${item.commitedQuantity}</td>
                        <td class="text-right">${item.invAdj}</td>
                        <td class="text-right">${item.stockOnHand}</td>
                    </tr>` 
                )
            }).join("\n")
            }
         </table>
         <br />
         <hr />
         <div class="justify-center">
           <h3>Total Stock On Hand: ${totalStock}</h3>
           <i>${numToEnglish(totalStock)}</i>
        </div>
      </div>
   </body>
</html>
`;
};

module.exports = inventorySummaryTemplate;