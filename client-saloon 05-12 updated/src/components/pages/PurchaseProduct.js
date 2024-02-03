import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PurchaseProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const PurchaseProduct = ({ onNewSupplierClick }) => {
  const [productList, setProductList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [tableData, setTableData] = useState([
    // Initialize with one empty row
    {
      product: "",
      quantity: "",
      cp: "",
      expiryDate: '',
    },
  ]);

  const handleClick = () => {
    // Call the callback to update selectedButton
    onNewSupplierClick();
  };

  // Define a state variable for the latest billNumber
  const [latestBillNumber, setLatestBillNumber] = useState(0);

  // ...

  useEffect(() => {
    const fetchPurchaseList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stock`);
        const responseData = response.data;
        setPurchaseList(responseData);

        // Calculate the latest billNumber from the fetched data
        const latestNumber = responseData.reduce((max, purchase) => {
          const billNumber = parseInt(purchase.billNumber);
          return isNaN(billNumber) ? max : Math.max(max, billNumber);
        }, 0);

        // Set the latest billNumber in the state
        setLatestBillNumber(latestNumber);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPurchaseList();
  }, []);

  // ...

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      formData.purchaseDate.trim() === "" ||
      formData.billNumber.trim() === "" ||
      formData.supplier.trim() === "" ||
      formData.purchaseType.trim() === "" ||
      formData.NoOfProducts.trim() === "" ||
      tableData.some(
        (entry) =>
          entry.product.trim() === "" ||
          entry.quantity.trim() === "" ||
          entry.cp.trim() === "" ||
          entry. expiryDate.trim() ===""
      )
    ) {
      toast.error("Please fill all the required fields");
      return;
    }
    try {
      // Increment the billNumber for the new entry
      const newBillNumber = latestBillNumber + 1;

      // Update the formData with the new billNumber
      const formDataWithTableData = {
        ...formData,
        billNumber: newBillNumber.toString(),
        tableData: tableData,
      };

      // Save the data to the MongoDB database
      await axios.post(
        `${BASE_URL}/api/Stock`,
        formDataWithTableData
      );
      toast.success("Saved Successfully");
      // Update the latestBillNumber in the state
      setLatestBillNumber(newBillNumber);
      // Reset form and tableData
      setTableData([
        {
          product: "",
          quantity: "",
          cp: "",
          expiryDate: '',
        },
      ]);
      setFormData({
        purchaseDate: "",
        billNumber: newBillNumber.toString(),
        supplier: "",
        purchaseType: "",
        NoOfProducts: "",
      });
      setNewEntry({
        product: "",
        quantity: "",
        cp: "",
        expiryDate: '',
      });
    } catch (error) {
      toast.error("Error while saving the data");
    }
  };

  const newBillNumber =
    purchaseList.length > 0
      ? Math.max(
          ...purchaseList.map((purchase) => {
            const billNumber = parseInt(purchase.billNumber);
            return isNaN(billNumber) ? 0 : billNumber;
          })
        ) + 1
      : 1;

  // Set the newBillNumber in the formData state
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      billNumber: newBillNumber.toString(),
    }));
  }, [newBillNumber]);

  const [formData, setFormData] = useState({
    purchaseDate: "",
    billNumber: newBillNumber.toString(),
    supplier: "",
    purchaseType: "",
    NoOfProducts: "",
  });

  const [, setNewEntry] = useState({
    product: "",
    quantity: "",
    cp: "",
    expiryDate: '',
  });
  // const productInputRef = useRef(null);
  // const quantityInputRef = useRef(null);
  // const cpInputRef = useRef(null);

  // const handleKeyDown = (event, fieldName) => {
  //   if (event.key === 'ArrowRight' || event.key === 'Enter') {

  //     if (fieldName === 'product' && quantityInputRef.current) {
  //       quantityInputRef.current.focus();
  //     }
  //     else if (fieldName === 'quantity' && quantityInputRef.current) {
  //       cpInputRef.current.focus();
  //     }

  //     else if(fieldName=='cp'){
  //       addNewEntry();
  //     }

  //   }
  // };

  // const addNewEntry = () => {
  //   if ( newEntry.product.trim() !== '' &&
  //   newEntry.quantity.trim() !== '' &&
  //   newEntry.cp.trim() !== ''
  //    ) {
  //       setTableData(prevTableData => [...prevTableData, newEntry]);

  //     setNewEntry({

  //       product: '',
  //       quantity: '',
  //       cp: '',

  //        });
  //     if (productInputRef.current) {
  //       productInputRef.current.focus();
  //     }
  //   }
  // };

  const deleteEntry = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Fetch vitals data from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/suppliers`);
        const responseData = response.data;
        console.log(responseData);
        setSupplierList(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Fetch vitals data from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Products`);
        const responseData = response.data;
        // console.log(responseData);
        setProductList(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleTableDataChange = (e, fieldName, index) => {
    const updatedTableData = [...tableData];
    const { value } = e.target;
    updatedTableData[index][fieldName] = value;
    setTableData(updatedTableData);
  };

  const addRow = () => {
    // Create a new empty entry
    const newEmptyEntry = {
      product: "",
      quantity: "",
      cp: "",
      expiryDate: '',
    };

    // Add the new empty entry to the tableData state
    setTableData((prevTableData) => [...prevTableData, newEmptyEntry]);
  };

  return (
    <div>
      <ToastContainer />
      <form className="pp-form13" autoComplete="off">
        <h5 className="pp-heading13">Purchase Form</h5>
        <div className="pp-formgroup13">
          <label className="pp-label13">Purchase Date</label>
          <input
            type="date"
            className="pp-input1345"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="pp-formgroup13">
          <label className="pp-label13">Bill Number</label>
          <input
            type="text"
            className="pp-input13"
            name="billNumber"
            value={formData.billNumber}
            onChange={handleChange}
            disabled
            required
          ></input>
        </div>
        <div className="pp-formgroup13">
          <label className="pp-label13">Supplier</label>
          <select
            className="pp-input13"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">select</option>
            {supplierList.map((item, index) => (
              <option value={item.supplier} key={item.id}>
                {item.supplier}
              </option>
            ))}
          </select>
          <button className="pbtn1234m" onClick={handleClick}>
            {" "}
            +Add
          </button>
        </div>
        <div className="pp-formgroup13">
          <label className="pp-label13">Payment Mode</label>
          <select
            name="purchaseType"
            className="pp-input13"
            value={formData.purchaseType}
            onChange={handleChange}
            required
          >
            <option value="">select</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        <div className="pp-formgroup13">
          <label className="pp-label13">No Of Products</label>
          <input
            type="text"
            className="pp-input13"
            name="NoOfProducts"
            value={formData.NoOfProducts}
            onChange={handleChange}
            required
          ></input>
        </div>

        <table className="pp-entering13">
          <thead>
            <tr>
              <td className="ppe-th">Product:</td>
              <td className="ppe-th">Quantity:</td>
              <td className="ppe-th">C.P:</td>
              <td className="ppe-th"> ExpiryDate:</td>
              {/* Add an empty header for the "Add Row" button */}
            </tr>
          </thead>
          <tbody>
            {tableData.map((entry, index) => (
              <tr key={index} className="space185">
                <td>
                  <select
                    className="pp-input131 pp-input1312"
                    value={entry.product}
                    onChange={(e) => handleTableDataChange(e, "product", index)}
                  >
                    <option value="">Select a Product</option>
                    {productList.map((item, index) => (
                      <option value={item.itemName} key={item.id}>
                        {item.itemName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="pp-input13 pp-input1312"
                    value={entry.quantity}
                    onChange={(e) =>
                      handleTableDataChange(e, "quantity", index)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="pp-input13 pp-input1312"
                    value={entry.cp}
                    onChange={(e) => handleTableDataChange(e, "cp", index)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="pp-input13 pp-input1312"
                    value={entry. expiryDate}
                    onChange={(e) => handleTableDataChange(e, "expiryDate", index)}
                  />
                </td>
                <td>
                  <button
                    className="delete-btn156"
                    onClick={() => deleteEntry(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            <tr>
              <button type="button" className="add-row-btn" onClick={addRow}>
                Add Row
              </button>
            </tr>
          </tbody>
        </table>

        <div className="pp-btn-div13">
          <button className="pp-btns13" onClick={handleSave}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseProduct;