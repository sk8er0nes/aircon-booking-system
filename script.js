const formTitle = document.querySelector("#formTitle");
const formEyebrow = document.querySelector("#formEyebrow");

const bookingIdInput = document.getElementById("bookingId");
const bookingDateInput = document.querySelector("#bookingDate");
const nameInput = document.querySelector("#name");
const contactInput = document.querySelector("#contactNo");
const emailInput = document.querySelector("#email");
const serviceDetailsInput = document.querySelector("#serviceDetails");
const formMessage = document.querySelector("#formMessage");

const submitText = document.querySelector("#submitText");
const clearBtn = document.querySelector("#clearBtn");

const desktopTableWrap = document.querySelector("#desktopTableWrap");
const tableBody = document.querySelector("#bookingTableBody");
const mobileBookings = document.querySelector("#mobileBookings");

const toast = document.querySelector("#toast");

let bookingItems = [];
let toastTimer = null;

document.addEventListener("DOMContentLoaded", function () {

    async function main() {
        bookingItems = await getData();
        renderBooking();
    };

    main();
    

    document.querySelector("#submitBtn").
        addEventListener("click", function () {
            if (!validateForm()) {
                showFormMessage("Please correct the highlighted fields.", "error");
                return;
            }

            const existingId = parseInt(bookingIdInput.value);

            const booking = {
                id: existingId || Math.floor(Math.random() * 1000 + 1),
                bookingDate: bookingDateInput.value.trim(),
                name: nameInput.value.trim(),
                contactNo: contactInput.value.trim(),
                email: emailInput.value.trim(),
                serviceDetails: serviceDetailsInput.value.trim()
            }

            if (existingId) {
                const index = bookingItems.findIndex(item => item.id === existingId);
                if (index !== -1) {
                    bookingItems[index] = booking;
                    showToast("Booking updated successfully.");
                }
            } else {

                bookingItems.push(booking);
                showToast("Booking added successfully.");
            }

            saveData(bookingItems);
            resetForm();
            renderBooking();
        });

    document.addEventListener("click", event => {
        const actionButton = event.target.closest("[data-action]");
        if (!actionButton) return;

        const { action, id } = actionButton.dataset;

        if (action === "edit") {
            editBooking(id);
        }

        if (action === "delete") {
            deleteBooking(id);
        }
    });



    function renderBooking() {
        renderDesktopTable();
        renderMobileCards();
    }

    function renderDesktopTable() {
        tableBody.innerHTML = bookingItems.map(booking => `
            <tr>
            <td>${formatDate(booking.bookingDate)}</td>
            <td>${booking.name}</td>
            <td>${booking.contactNo}</td>
            <td>${booking.email}</td>
            <td class="service-cell">${booking.serviceDetails}</td>        
             <td>
                <div class="action-buttons">
                    <button class="action-btn edit" data-action="edit" data-id="${booking.id}">Edit</button>
                    <button class="action-btn delete" data-action="delete" data-id="${booking.id}">Delete</button>
                </div>
            </td>   
            </tr>
        `).join("");

        desktopTableWrap.classList.remove("hidden");
    }

    function renderMobileCards() {
        mobileBookings.innerHTML = bookingItems.map(booking => `
            <article class="booking-card">
                <div class="booking-card-top">
                    <div>
                        <div class="booking-date">${formatDate(booking.bookingDate)}</div>
                        <div class="booking-name">${booking.name}</div>
                    </div>
                </div>

                <div class="booking-details">
                    <div class="detail-row">
                        <span class="detail-label">Contact</span>
                        <span class="detail-value">${booking.contactNo}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${booking.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Service</span>
                        <span class="detail-value">${booking.serviceDetails}</span>
                    </div>
                </div>

                <div class="mobile-actions">
                    <button class="action-btn edit" data-action="edit" data-id="${booking.id}">Edit</button>
                    <button class="action-btn delete" data-action="delete" data-id="${booking.id}">Delete</button>
                </div>
            </article>
        `).join("");

        mobileBookings.classList.remove("hidden");
    }




    function editBooking(idToModify) {
        const index = bookingItems.findIndex(b => b.id === parseInt(idToModify));
        if (index === -1) return;

        const booking = bookingItems[index];

        bookingIdInput.value = booking.id;
        bookingDateInput.value = booking.bookingDate;
        nameInput.value = booking.name;
        contactInput.value = booking.contactNo;
        emailInput.value = booking.email;
        serviceDetailsInput.value = booking.serviceDetails;

        setEditMode(true);
        clearValidation();
        clearFormMessage();

        document.querySelector(".form-card").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        setTimeout(() => nameInput.focus(), 350);
    }

    function deleteBooking(idToDelete) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const index = bookingItems.findIndex(b => b.id === parseInt(idToDelete));
                if (index !== -1) {
                    const bookingName = bookingItems[index].name;
                    bookingItems.splice(index, 1);
                    saveData(bookingItems);
                    renderBooking();
                    if (bookingName) {
                        showToast(`Booking for ${bookingName} was deleted.`);
                    }
                }


            }
        });
    }
})

document.querySelector('#clearBtn').addEventListener('click', function () {
    if (bookingIdInput.value !== "") {
        showToast("Edit cancelled.");
    }
    resetForm();
})

// ---------- Validation ----------
function setFieldError(input, errorElementId, message) {
    const group = input.closest(".form-group");
    const errorElement = document.getElementById(errorElementId);

    group.classList.toggle("invalid", Boolean(message));
    errorElement.textContent = message || "";
}

function clearValidation() {
    setFieldError(bookingDateInput, "bookingDateError", "");
    setFieldError(nameInput, "nameError", "");
    setFieldError(contactInput, "contactNoError", "");
    setFieldError(emailInput, "emailError", "");
    setFieldError(serviceDetailsInput, "serviceDetailsError", "");
}

function validateForm() {
    clearValidation();

    const bookingDate = bookingDateInput.value.trim();
    const name = nameInput.value.trim();
    const contactNo = contactInput.value.trim();
    const email = emailInput.value.trim();
    const serviceDetails = serviceDetailsInput.value.trim();

    let valid = true;

    if (!bookingDate) {
        setFieldError(bookingDateInput, "bookingDateError", "Please select a booking date.");
        valid = false;
    }

    if (!name) {
        setFieldError(nameInput, "nameError", "Please enter the customer's name.");
        valid = false;
    } else if (name.length < 2) {
        setFieldError(nameInput, "nameError", "Name must be at least 2 characters.");
        valid = false;
    }

    if (!contactNo) {
        setFieldError(contactInput, "contactNoError", "Please enter a contact number.");
        valid = false;
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(contactNo)) {
        setFieldError(contactInput, "contactNoError", "Please enter a valid contact number.");
        valid = false;
    }

    if (!email) {
        setFieldError(emailInput, "emailError", "Please enter an email address.");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError(emailInput, "emailError", "Please enter a valid email address.");
        valid = false;
    }

    if (!serviceDetails) {
        setFieldError(serviceDetailsInput, "serviceDetailsError", "Please enter the required service.");
        valid = false;
    }

    return valid;
}

function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-SG", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}

function setEditMode(isEditing) {
    formTitle.textContent = isEditing ? "Edit Booking" : "Add Booking";
    formEyebrow.textContent = isEditing ? "EDIT BOOKING" : "NEW BOOKING";
    submitText.textContent = isEditing ? "Update Booking" : "Add Booking";
    clearBtn.textContent = isEditing ? "Cancel Edit" : "Clear";
}

function resetForm() {
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => {
        input.value = '';
    });
    //bookingIdInput.value = "";
    setEditMode(false);
    clearValidation();
    clearFormMessage();
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}








