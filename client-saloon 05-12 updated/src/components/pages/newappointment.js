import React,{useState,useEffect} from 'react';
import '../styles/newappointment.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify'; 
import { BASE_URL } from '../Helper/helper';


// const getCurrentDate = () => {
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };


const NewAppointment = ({ customer }) => {
  console.log(customer)
  const [popupData, setPopupData] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  // const [displaySelected, setDisplaySelected] = useState(false);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        discount: '',
        
        date: '',
        fromTiming: '',
        toTiming: '',
        advance: '',
        notes: '',
      
  });

  const openPopup = (item) => {
    setPopupData(true);
  };

  const closePopup = () => {
    setPopupData(null);
     // Reset display when closing the popup
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


 
  


  const handleCheckboxChange = (label) => {
    // Check if the label is already in the selected services
    if (selectedServices.includes(label)) {
      // If it's already selected, deselect it by filtering it out
      setSelectedServices(selectedServices.filter((service) => service !== label));
    } else {
      // If it's not selected, select it by adding it to the array
      setSelectedServices([...selectedServices, label]);
    }
  };

 

  useEffect(() => {
    // Fetch data from your Express.js backend when the component mounts
    axios
      .get(`${BASE_URL}/api/services`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, []);


 
  const handleBook = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      toast.warn('Please select at least one service.');
      return;
    }
  
    try {
      // Include selected services in formData
      const dataToSend = {
        ...formData,
        selectedServices: selectedServices,
        // Include customer data
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        discount:customer.discount,
      };
  
      // Use customer._id to specify the customer for the appointment
      const customerId = customer._id; // Assuming "customer" has the correct "_id"
      console.log(customer._id+"id ")
      console.log(customerId+"id ")
  
      await axios.post(`${BASE_URL}/api/customers/${customerId}/appointments`, dataToSend);
      
      toast.success('Appointment Booked Successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      toast.error('Error while booking appointment', error);
    }
  
    setSelectedServices([]);
    setFormData({
      name: '',
      address: '',
      phone: '',
      discount: '',
      date: '',
      fromTiming: '',
      toTiming: '',
      advance: '',
      notes: '',
    });
  };
  
  return (
    <div className="main-empp" >


      <div className='appnt-form11'>
      <h6 className='appnt-heading11'>Appointment Detailes</h6>
      <form  onSubmit={handleBook} autoComplete='off'>
      

      <div className='appntform-group11'>
        <label htmlFor='name' className='appnt-label11'>Name</label>
      <input type="text"
       name="name"
       value={customer?.name}
       onChange={handleChange}
       required
       className='text-input11'
       >
        

      </input>
      </div>

   <div  className='appntform-group11'>   
   <label className='appnt-label11'>Address</label>
   <textarea type="text"
    name="address"
    className='textarea567'
    value={customer?.address}
    onChange={handleChange}
    required
    rows="4" cols="30"></textarea> </div>

   <div  className='appntform-group11'> 
    <label className='appnt-label11'>Phone</label>
    <input type="tel" 
     name="phone"
     value={customer?.phone}
     onChange={handleChange}
     className='text-input11'
     required
    ></input></div>

   {/* <div  className='appntform-group11'>
     <label className='appnt-label11'>Provide Discount</label>
     <input type="text"
      name="discount"
      value={customer?.discount}
      onChange={handleChange}
      required
      className='small-input11'
     ></input></div> */}

  <div  className='appntform-group11'>   
   <label className='appnt-label11'>Services</label>
   <div className='change-column90'>
  <div>
   {selectedServices.length > 0 && (
              <div className='selected-services'>
            
                <ol>
                  {selectedServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ol>
              
              </div>
            )}
            </div>
 <div><button type="button"  className="servbtn11" onClick={() => openPopup()}>+ Add Services</button></div>
   </div>
   </div>
  <div  className='appntform-group11'>  
  <label className='appnt-label11'>Date</label>
  <input type="date"
   name="date"
   value={formData.date}
   onChange={handleChange}
   min={new Date().toISOString().split('T')[0]}
   required
   className='small-input1122'
  ></input></div>

  <div  className='appntform-group11'>  <label className='appnt-label11'>Timings </label>
  <input type="time"
   name="fromTiming"
   value={formData.fromTiming}
   onChange={handleChange}
   required
   className='small-input1133'></input>&nbsp;&nbsp; To &nbsp;&nbsp; 
  <input type="time" 
   name="toTiming"
   value={formData.toTiming}
   onChange={handleChange}
   required
  className='small-input1133'></input></div>

   {/* <div  className='appntform-group11'> 
    <label className='appnt-label11'>Advance</label>
    <input type="text"
     name="advance"
     value={formData.advance}
     onChange={handleChange}
     required
     className='small-input11'
    ></input></div> */}

     <div  className='appntform-group11'> 
     <label className='appnt-label11'>Notes</label>
     <textarea 
     className='textarea567' 
     type="text"
      name="notes"
      value={formData.notes}
      onChange={handleChange}
      // required
     rows="4" cols="31"></textarea></div>

<div className='bookbtn-div11'>
<button type="submit" className='bookbtn11'>Book</button>
</div>

</form>
</div>
{popupData && (
        <div className="popupsk14">
           
          <div className="popup-contentsk14">
            <div className='btnend234'>
            <h5 className='popup-services-heading'>Select the Services</h5>
          <button className='btn567' onClick={closePopup}>X</button>
          </div>
            
          <div className='men-women'>
              <div className='flex0033'>
            <h5>Men Category</h5>
            <div className='men-category'>
  {services
    .filter(service => service.category === 'Male')
    .map(service => (
      <div className='service-item' key={service._id}>
        
        <input
          type='checkbox'
          onChange={() => handleCheckboxChange(`Men - ${service.serviceName}`)} 
          checked={selectedServices.includes(`Men - ${service.serviceName}`)} 
          style={{ marginLeft: '8px' }}
          className='custom-checkbox'
        />
       <label className='lableup123'>{`Men - ${service.serviceName}`}  </label>
        
        <span className='size293'>Rs - {service.price}</span>
        <span className='size2935'>Time: {service.durationTime}</span>
      </div>
    ))}
</div>
</div>
<div className='flex0033'>
<h5>Women Category</h5>
<div className='women-category'>
  
{services
    .filter(service => service.category === 'Female')
    .map(service => (
      <div className='service-item' key={service._id}>
        
        <input
          type='checkbox'
          onChange={() => handleCheckboxChange(`Women - ${service.serviceName}`)} 
          checked={selectedServices.includes(`Women - ${service.serviceName}`)} 
          style={{ marginLeft: '8px' }}
          className='custom-checkbox'
          
        />
       <label className='lableup123'>{`Women - ${service.serviceName}`}  </label>
        
        <span className='size293'>Rs - {service.price}</span>
        <span className='size2935'>Time: {service.durationTime}</span>
      </div>
    ))}
</div>
</div>

         
          </div>

          {/* <button type='button' className='addbtn11' onClick={handleAddSelectedServices}>
              Add
            </button> */}
          </div>
        </div>
      )}
        <ToastContainer />
    </div>
  )
}

export default NewAppointment  