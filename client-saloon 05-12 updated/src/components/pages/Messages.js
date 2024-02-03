import React, { useState } from "react";

import "../styles/Messages.css";
import Bulk from "./Bulk";
import Individual from "./Individual";
const Messages = () => {
  const [message, setMessage] = useState("");
  const maxCharacters = 160;

  const handleInputChange = (event) => {
    const inputText = event.target.value;

    if (inputText.length <= maxCharacters) {
      setMessage(inputText);
    }
  };

  const handleSendClick = () => {
    alert("Sending SMS:", message);
  };

  const handleClearClick = () => {
    setMessage("");
  };

  return (
    <div>
      <div className="A7custmaindiv89">
        <div className="A7custform-msg89">
          <h4 className="A7custheader23">Multiple</h4>
          <div className="sapce000">
            <button className="A7sbmtbtn">Add Customer</button>
            <div className="A7msglbl">
              <label>Message</label>

              <textarea
                className="A7txtar"
                rows="8"
                cols="15"
                value={message}
                onChange={handleInputChange}
              />
            </div>
            <div className="A7cntr">
              {message.length}/{maxCharacters - message.length}
            </div>
            <div className="A7cntr1">
              <button className="A7sendSmsbtn" onClick={handleSendClick}>
                Send SMS
              </button>
              <button className="A7sendSmsbtn A7clr" onClick={handleClearClick}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <Bulk />
      <Individual />
    </div>
  );
};

export default Messages;
