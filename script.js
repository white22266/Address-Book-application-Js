const contacts = [
  {
    id: 1,
    name: "John Tan",
    phone: "0123456789",
    email: "john.tan@example.com",
    address: {
      street: "12 Jalan Ampang",
      state: "Kuala Lumpur",
      postcode: "50450",
    },
    description: "Default contact",
  },
];

let nextId = 2;

const contactForm = document.getElementById("contactForm");
const contactTableBody = document.getElementById(
  "contactTableBody",
);
const searchInput = document.getElementById("searchInput");
const formMessage = document.getElementById("formMessage");
const emptyMessage = document.getElementById("emptyMessage");
const contactCount = document.getElementById("contactCount");

// Add a new contact when the form is submitted.

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const contactData = getFormData();

  const validationMessage = validateContact(contactData);

  if (validationMessage) {
    showFormMessage(validationMessage, "error");
    return;
  }

  const newContact = {
    id: nextId,
    name: contactData.name,
    phone: contactData.phone,
    email: contactData.email,
    address: {
      street: contactData.street,
      state: contactData.state,
      postcode: contactData.postcode,
    },
    description: contactData.description,
  };

  contacts.push(newContact);

  nextId += 1;

  contactForm.reset();

  showFormMessage("Contact added successfully.", "success");
  displayContacts(contacts);
});

// Search contacts when the user types into the search field.

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.trim().toLowerCase();

  const filteredContacts = contacts.filter(function (contact) {
    return contact.name.toLowerCase().includes(searchText);
  });

  displayContacts(filteredContacts);
});


 // Use event delegation to handle Delete button clicks.

contactTableBody.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  const contactId = Number(deleteButton.dataset.id);

  deleteContact(contactId);
});


 // Read and return values from the form.

function getFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    street: document.getElementById("street").value.trim(),
    state: document.getElementById("state").value.trim(),
    postcode: document.getElementById("postcode").value.trim(),
    description: document
      .getElementById("contactDescription")
      .value.trim(),
  };
}

// Validate contact fields.

function validateContact(contactData) {
  if (!contactData.name) {
    return "Name is required.";
  }

  if (
    contactData.phone &&
    !/^\d+$/.test(contactData.phone)
  ) {
    return "Phone must contain numbers only.";
  }

  if (
    contactData.postcode &&
    !/^\d+$/.test(contactData.postcode)
  ) {
    return "Postcode must contain numbers only.";
  }

  if (
    contactData.email &&
    !isValidEmail(contactData.email)
  ) {
    return "Please enter a valid email address.";
  }

  return "";
}

//Display the provided contacts in the table.
 
function displayContacts(contactList) {
  contactTableBody.replaceChildren();

  emptyMessage.style.display =
    contactList.length === 0 ? "block" : "none";

  contactList.forEach(function (contact) {
    const row = document.createElement("tr");

    appendCell(row, contact.id);
    appendCell(row, contact.name);
    appendCell(row, contact.email || "-");
    appendCell(row, contact.phone || "-");
    appendCell(row, formatAddress(contact.address));
    appendCell(row, contact.description || "-");

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.dataset.id = String(contact.id);
    deleteButton.textContent = "Delete";

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    contactTableBody.appendChild(row);
  });

  contactCount.textContent = String(contacts.length);
}

// Add a table cell using textContent.

function appendCell(row, value) {
  const cell = document.createElement("td");

  cell.textContent = String(value);

  row.appendChild(cell);
}

//Format the street, state, and postcode into one string.

function formatAddress(address) {
  const fullAddress = [
    address.street,
    address.state,
    address.postcode,
  ]
    .filter(function (value) {
      return value;
    })
    .join(", ");

  return fullAddress || "-";
}

// Delete a contact using its ID.

function deleteContact(id) {
  const contactIndex = contacts.findIndex(function (contact) {
    return contact.id === id;
  });

  if (contactIndex === -1) {
    return;
  }

  const contact = contacts[contactIndex];

  const confirmed = window.confirm(
    `Are you sure you want to delete ${contact.name}?`,
  );

  if (!confirmed) {
    return;
  }

  contacts.splice(contactIndex, 1);

  showFormMessage("Contact deleted successfully.", "success");

  const currentSearch = searchInput.value
    .trim()
    .toLowerCase();

  const displayedContacts = contacts.filter(function (item) {
    return item.name.toLowerCase().includes(currentSearch);
  });

  displayContacts(displayedContacts);
}
    
/**
 * Basic email validation.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show a success or error message.

function showFormMessage(message, type) {
  formMessage.textContent = message;

  formMessage.className =
    type === "success"
      ? "form-message success-message"
      : "form-message error-message";
}

// Display the initial empty contact list.
displayContacts(contacts);