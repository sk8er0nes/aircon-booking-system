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

document.addEventListener("DOMContentLoaded", function () {
    let bookingItems = [];

    async function main() {
        bookingItems = await fetchData(BIN_ID);
        renderTableBooking();
    };

    main();



    document.querySelector("#submitBtn").
        addEventListener("click", function () {
            const bookingDate = document.querySelector("#bookingDate").value;
            const name = document.querySelector("#name").value;
            const contactNo = document.querySelector("#contactNo").value;
            const email = document.querySelector("#email").value;
            const serviceDetails = document.querySelector("#serviceDetails").value;

            const newBooking = {
                id: Math.floor(Math.random() * 1000 + 1),
                bookingDate,
                name,
                contactNo,
                email,
                serviceDetails
            }
            bookingItems.push(newBooking);
            saveData(BIN_ID, bookingItems)
            resetForm();
            renderTableBooking();
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



    function renderTableBooking() {
        const bookingTableBody = document.querySelector('#bookingTableBody');
        bookingTableBody.innerHTML = bookingItems.map(booking => `
            <tr>
            <td>${formatDate(booking.bookingDate)}</td>
            <td>${booking.name}</td>
            <td>${booking.contactNo}</td>
            <td>${booking.email}</td>
            <td class="service-cell">${booking.serviceDetails}</td>        
             <td>
                <div class="action-buttons">
                    <button class="editBtn btn btn-success" data-action="edit" data-id="${booking.id}">Edit</button>
                    <button class="deleteBtn btn btn-danger" data-action="delete" data-id="${booking.id}">Delete</button>
                </div>
            </td>   
            </tr>
    `).join("");
    }

    function editBooking(idToModify) {
        const booking = bookingItems.find(item => item.id === parseInt(idToModify));
        if (!booking) return;

        Swal.fire({
            title: "Update Booking",
            html:
                `
                <div class="mt-3">
                    <label class="form-label">Booking Date:</label>
                    <input type="date" value="${booking.bookingDate}" id="newBookingDate" class="form-control" />
                </div>
                <div class="mt-3">
                    <label class="form-label">Name:</label>
                    <input type="text" value="${booking.name}" id="newName" class="form-control" placeholder="Customer Name" />
                </div>
                <div class="mt-3">
                    <label class="form-label">Contact No.:</label>
                    <input type="text" value="${booking.contactNo}" id="newContact" class="form-control" placeholder="Customer Phone No." />
                </div>
                <div class="mt-3">
                    <label class="form-label">Email:</label>
                    <input type="email" value="${booking.email}" id="newEmail" class="form-control" placeholder="Customer Email Address" />
                </div>
                <div class="mt-3">
                    <label class="form-label">Service Details:</label>
                    <textarea id="newServiceDetails" class="form-control" rows="4" placeholder="Describe the aircon service required..." >${booking.serviceDetails}</textarea>
                </div> 
                `,
            showCancelButton: true,
            showCloseButton: true,
            preConfirm: function () {
                const newBookingDate = document.querySelector("#newBookingDate").value;
                const newName = document.querySelector("#newName").value;
                const newContact = document.querySelector("#newContact").value;
                const newEmail = document.querySelector("#newEmail").value;
                const newServiceDetails = document.querySelector("#newServiceDetails").value;
                const index = bookingItems.findIndex(b => b.id === parseInt(idToModify));
                if (index !== -1) {
                    const editedBooking = {
                        id: booking.id,
                        bookingDate: newBookingDate,
                        name: newName,
                        contactNo: newContact,
                        email: newEmail,
                        serviceDetails: newServiceDetails
                    }
                    bookingItems[index] = editedBooking;
                    saveData(BIN_ID, bookingItems);
                }
                renderTableBooking();
            }
        })
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
                    bookingItems.splice(index, 1);
                    //console.log('deleted');
                    saveData(BIN_ID, bookingItems);
                }
                renderTableBooking();
            }
        });
    }


})

document.querySelector('#clearBtn').addEventListener('click', function () {
    resetForm();
})

function resetForm() {
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => {
        input.value = '';
    });
}







