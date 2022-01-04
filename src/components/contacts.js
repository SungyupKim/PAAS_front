import React from 'react'

const Contacts = ({ contacts }) => {
  return (
    <div>
      <center><h1>Pod List</h1></center>
      {contacts.map((contact) => (
        <div class="pod">
          <div class="pod-body">
            <h5 class="name">{contact.name}</h5>
            <h6 class="status">{contact.status}</h6>
            <p class="age">{contact.age}</p>
            <p class="readypods">{contact.readyPods}</p>
            <p class="totalpods">{contact.totalPods}</p>
          </div>
        </div>
      ))}
    </div>
  )
};

export default Contacts