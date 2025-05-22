import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";

const generatePDF = async (orderData: { products: any[]; customer: { customerId: string; name: any; email: any; phone: any; }; saleOfficer: { saleOfficerId: string; name: any; phone: any; }; orderId: any; address: { street: any; city: any; state: any; zipCode: any; }; createdAt: string | number | Date; totalAmount: any; }) => {
  // Prepare product table rows with conditional handling
  const productRows = orderData.products
    .map((item, index) => {
      const productId = item.product?.productId ?? "null"; // Handle missing Product ID
      const productName = item.product?.name ?? "null"; // Handle missing Product Name
      const productPrice = item.product?.price ?? "null"; // Handle missing Product Price
      const productPhoto = item.product?.photo ?? ""; // Handle missing Product Photo
      const productQuantity = item.quantity ?? "null"; // Handle missing Quantity

      return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div style="display: flex; align-items: center;">
            <img src="${productPhoto}" alt="${productName}" style="width: 50px; height: 50px; margin-right: 10px; border: 1px solid #ccc;" />
            <span>${productName}</span>
          </div>
        </td>
        <td>${productId}</td>
        <td>${productQuantity}</td>
        <td>₹${productPrice}</td>
      </tr>
      `;
    })
    .join("");

  // Handle Sale Officer and Customer ID conditionally
  const customerId = orderData.customer?.customerId ?? "null";
  const saleOfficerId = orderData.saleOfficer?.saleOfficerId ?? "null";

  // HTML content for the PDF
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { padding: 20px; }
          .header { text-align: center; background-color: #4CAF50; color: white; padding: 10px 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .details { margin: 20px 0; }
          .details p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Summary</h1>
        </div>
        <div class="container">
          <div class="details">
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Customer Name:</strong> ${orderData.customer?.name ?? "null"}</p>
            <p><strong>Customer ID:</strong> ${customerId}</p>
            <p><strong>Email:</strong> ${orderData.customer?.email ?? "null"}</p>
            <p><strong>Customer Phone:</strong> ${orderData.customer?.phone ?? "null"}</p>
            <p><strong>Sale Officer Name:</strong> ${orderData.saleOfficer?.name ?? "null"}</p>
            <p><strong>Sale Officer ID:</strong> ${saleOfficerId}</p>
            <p><strong>Sale Officer Phone:</strong> ${orderData.saleOfficer?.phone ?? "null"}</p>
            <p><strong>Address:</strong> ${orderData.address.street ?? "null"}, 
              ${orderData.address.city ?? "null"}, 
              ${orderData.address.state ?? "null"}, 
              ${orderData.address.zipCode ?? "null"}
            </p>
            <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
          </div>
          <h2>Products</h2>
          <table>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            ${productRows}
          </table>
          <div class="total">Total Amount: ₹${orderData.totalAmount}</div>
        </div>
      </body>
    </html>
  `;

  try {
    // Generate PDF
    const options = {
      html: htmlContent,
      fileName: `order-${orderData.orderId}-summary`,
      directory: "Documents",
    };
    const pdf = await RNHTMLtoPDF.convert(options);
    const destinationPath = `${RNFS.DownloadDirectoryPath}/order-${orderData.orderId}-summary.pdf`;
    await RNFS.moveFile(pdf.filePath, destinationPath);
  } catch (error) {
    console.log("Error generating PDF:", error);
  }
};

export default generatePDF;


