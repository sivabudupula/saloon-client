import React, { useEffect, useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../styles/Calendar.css';
import { BASE_URL } from '../Helper/helper';


const Calendar = ({onNewBillClick}) => {
  const [filteredBirthdayCustomers, setFilteredBirthdayCustomers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
  const tableRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());


  function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  
    return (
      <div className="pagination">
        <button className="pad576" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          First
        </button>
        <button className="pad576" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'active pad5767' : ''}
          >
            {page}
          </button>
        ))}
        <button className="pad576" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>
    );
  }
  
  const formatTime = (time) => {
    if (!time) {
      return 'N/A'; // Handle the case where time is undefined
    }
    const [hours, minutes] = time.split(':');
    if (hours && minutes) {
      const formattedHours = parseInt(hours, 10) % 12 || 12;
      const amOrPm = parseInt(hours, 10) < 12 ? 'am' : 'pm';
      return `${formattedHours}:${minutes}${amOrPm}`;
    }
    return 'N/A'; // Handle the case where time is not in the expected format
  };



  const handleCreateNewClick = () => {
    if (onNewBillClick) {
      onNewBillClick();
    }
  };


  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/customers`);
      if (response.status === 200) {
        const customersData = response.data;
        setCustomers(customersData);
      } else {
        console.error('Error fetching customers:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);


  const handleMonthChange = useCallback((month) => {
    setCurrentMonth(month);
    if (customers && customers.length > 0) {
      const currentMonthBirthdays = customers.filter((customer) => {
        const birthdayMonth = new Date(customer.dob).getMonth();
        return birthdayMonth === month;
      });

      setFilteredBirthdayCustomers(currentMonthBirthdays);
    }
  },[setCurrentMonth,setFilteredBirthdayCustomers,customers]);




  useEffect(() => {
    const currentDate = new Date();
    handleMonthChange(currentDate.getMonth());
  }, [customers,handleMonthChange]);

  const handleEventClick = async (info) => {
    const event = info.event.extendedProps;
    setSelectedEvent(event);

    // Fetch services for the selected appointment
    if (!event.birthday) {
      try {
        const response = await axios.get(`${BASE_URL}/api/appointments/${event.appointmentId}/services`);
        if (response.status === 200) {
          const servicesData = response.data;
          setServices(servicesData);
        } else {
          console.error('Error fetching services:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching services:', error.message);
      }
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const yearsDiff = currentDate.getFullYear() - dobDate.getFullYear();

    if (
      currentDate.getMonth() < dobDate.getMonth() ||
      (currentDate.getMonth() === dobDate.getMonth() && currentDate.getDate() < dobDate.getDate())
    ) {
      return yearsDiff - 1;
    }

    return yearsDiff;
  };

  

  const allBirthdayEvents = customers.map((customer) => {
    const birthdayMonth = new Date(customer.dob).getMonth();
    return {
      id: `birthday-${customer._id}`,
      title: `🎉 Happy Birthday: ${customer.name}`,
      start: new Date(new Date().getFullYear(), birthdayMonth, new Date(customer.dob).getDate()),
      allDay: true,
      extendedProps: { ...customer, birthday: true },
    };
  });

  const appointmentEvents = customers.reduce((acc, customer) => {
    const customerEvents = customer.appointments.map((appointment, index) => {
      const startTime = `${appointment.date}T${appointment.fromTiming}`;
      const endTime = `${appointment.date}T${appointment.toTiming}`;
      return {
        id: `appointment-${customer._id}-${index}`,
        title: `Appointment with ${customer.name}`,
        start: startTime,
        end: endTime,
        extendedProps: { ...appointment, birthday: false },
      };
    });

    return [...acc, ...customerEvents];
  }, []);

  const allEvents = [...allBirthdayEvents, ...appointmentEvents];

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredBirthdayCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);

    if (tableRef.current) {
      const tablePosition = tableRef.current.getBoundingClientRect().top;
      window.scrollTo({
        top: window.pageYOffset + tablePosition,
        behavior: 'smooth',
      });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBirthdayCustomers.length / customersPerPage); i++) {
    pageNumbers.push(i);
  }

  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  }

  return (
    <div className="both-calendar-container2pcc">
      
      <div className="roaylcalendermain2p-cal">
       
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={'dayGridMonth'}
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'bookButton dayGridMonth,timeGridWeek,timeGridDay',
          }}
          customButtons={{
            bookButton: {
              text: '+ Create New',
              click: handleCreateNewClick,
            },
          }}
          
          height={'90vh'}
          events={allEvents}
          eventClick={handleEventClick}
          eventContent={(arg) => {
            const fromTime = formatTime(arg.event.extendedProps.fromTiming);

           
            if (arg.event.extendedProps.birthday) {
              return (
                <div className={`custom-event ${arg.event.extendedProps.birthday ? 'smaller-event' : ''}`}>
                  <p className="fc-event-title">{arg.event.title}</p>
                </div>
              );
            }

           
            const appointmentInfo = `${fromTime} appointment with ${arg.event.extendedProps.name}`;

            return (
              <div className={`custom-event ${arg.event.extendedProps.birthday ? 'smaller-event' : ''}`}>
                <p className="fc-event-title">{appointmentInfo}</p>
              </div>
            );
          }}
          eventClassNames={(info) => {
            const isBirthday = info.event.extendedProps.birthday;
            const eventDate = new Date(info.event.start);
            const currentDate = new Date();
            const isToday = eventDate.toDateString() === currentDate.toDateString();

            if (!isBirthday) {
              if (isToday) {
                return ['today-appointment'];
              } else if (eventDate < currentDate) {
                return ['past-appointment'];
              }
            }

            return [];
          }}
          datesSet={(info) => handleMonthChange(new Date(info.view.currentStart).getMonth())}
        />
      </div>

      <div className="birthday-container" ref={tableRef}>
        <div className="top-bar">
          <div className="filter-container">
            <span className="birthday-top-filter">
              Total Birthdays in ({getMonthName(currentMonth)}): {filteredBirthdayCustomers.length}
            </span>
          </div>
        </div>

        <table className="customer-table">
          <thead className="customer-table-head">
            <tr className="customer-table-row">
              <th className="customer-table-th">Serial Number</th>
              <th className="customer-table-th">Customer ID</th>
              <th className="customer-table-th">Customer Name</th>
              <th className="customer-table-th">Mobile Number</th>
              <th className="customer-table-th">Date of Birth</th>
              <th className="customer-table-th">Age</th>
              {/* Add more table headers for other customer details */}
            </tr>
          </thead>

          <tbody className="customer-table-body">
            {currentCustomers.map((customer, index) => (
              <tr className="customer-table-rowdata" key={customer._id}>
                <td className="customer-table-th1">{(currentPage - 1) * customersPerPage + index + 1}</td>
                <td className="customer-table-th1">{customer.customerId}</td>
                <td className="customer-table-th1">{customer.name}</td>
                <td className="customer-table-th1">{customer.phone}</td>
                <td className="customer-table-th1">
                  {formatDate(customer.dob)}
                </td>
                <td className="customer-table-th1">{calculateAge(customer.dob)}</td>
               
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={pageNumbers.length}
          onPageChange={paginate}
        />
      </div>
<div className="main-empp">
      {selectedEvent && (
        <Modal show={true} onHide={closeModal}>
          <Modal.Header>
            <Modal.Title>{selectedEvent.birthday ? 'Birthday Details' : 'Appointment Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent.birthday ? (
              <div>
                <p className="roaylcalendermain2p-p1">
                  <p className="box-container1">Name</p>: &nbsp;&nbsp;{selectedEvent.name}
                </p>
                <p className="roaylcalendermain2p-p1">
                  <p className="box-container1">DOB</p>: &nbsp;&nbsp;{formatDate(selectedEvent.dob)}
                </p>
                <p className="roaylcalendermain2p-p1">
                  <p className="box-container1">Age</p>: &nbsp;&nbsp;{calculateAge(selectedEvent.dob)}
                </p>
              </div>
            ) : (
              <div>
                <p className="roaylcalendermain2p-p">
                  <p className="box-container">Name</p>: &nbsp;&nbsp;{selectedEvent.name}
                </p>
                <p className="roaylcalendermain2p-p">
                  <p className="box-container">Address</p>: &nbsp;&nbsp;{selectedEvent.address}
                </p>
                <p className="roaylcalendermain2p-p">
                  <p className="box-container">Phone</p>: &nbsp;&nbsp;{selectedEvent.phone}
                </p>
                {/* <p className="roaylcalendermain2p-p">
                  <p className="box-container">Discount</p>: &nbsp;&nbsp;{selectedEvent.provideDiscount}
                </p> */}

            
          <p className="roaylcalendermain2p-p">
          <p className="box-container">Services</p>: &nbsp;&nbsp;
          <div className='change0034'>
            {selectedEvent.selectedServices.map((service, index) => (
              <p className='p-456' key={index}>{`${index + 1}. ${service}`}</p>
            ))}
            </div>
           </p>

                <p className="roaylcalendermain2p-p mt-3">
                  <p className="box-container">From</p> : &nbsp;&nbsp;{formatTime(selectedEvent.fromTiming)}
                </p>
                <p className="roaylcalendermain2p-p">
                  <p className="box-container">To Timing</p>: &nbsp;&nbsp;{formatTime(selectedEvent.toTiming)}
                </p>
                {/* <p className="roaylcalendermain2p-p">
                  <p className="box-container">Advance</p>: &nbsp;&nbsp;{selectedEvent.advance}
                </p> */}
                <p className="roaylcalendermain2p-p">
                  <p className="box-container">Notes</p>: &nbsp;&nbsp;{selectedEvent.notes}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="btn-374">
              <Button variant="warning" className='close' onClick={closeModal}>
               <p className=' Closes'> Close</p>
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      </div>
    </div>
  );
}

export default Calendar;