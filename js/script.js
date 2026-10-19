

const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {
    complaintForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const district = document.getElementById("district").value;
        const category = document.getElementById("category").value;
        const location = document.getElementById("location").value.trim();
        const description = document.getElementById("description").value.trim();

        if (!title || !district || !category || !location || !description) {
            alert("Please fill in all required fields.");
            return;
        }

        // Get existing complaints
        let complaints = JSON.parse(
            localStorage.getItem("complaints") || "[]"
        );

        // Generate a reference ID for this demo
        const complaintId =
            "MC-" + Date.now().toString().slice(-8);

        // Create complaint record
        const complaint = {
            id: complaintId,
            title: title,
            district: district,
            category: category,
            location: location,
            description: description,
            status: "Pending",
            submittedAt: new Date().toISOString()
        };

        // Save complaint
        complaints.push(complaint);

        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );

        // Show success popup
        // Show success popup
const complaintIdElement = document.getElementById("complaintId");
const successPopup = document.getElementById("successPopup");

if (complaintIdElement && successPopup) {
    complaintIdElement.textContent = complaintId;
    successPopup.style.display = "flex";
} else {
    alert("Popup not found! Check the HTML element IDs.");
}

        // Clear the form
        complaintForm.reset();
    });
}

function goToMyComplaints() {
    window.location.assign("/makkalconnect/mycomplaint.html");
}

function closeSuccessPopup() {
    document.getElementById("successPopup").style.display = "none";
}
console.log("Popup element:", document.getElementById("successPopup"));
console.log("Complaint form:", document.getElementById("complaintForm"));

"<p><strong>Status:</strong> " +
(complaint.status || "Pending") + "</p>" +
"<p><strong>Admin Reply:</strong> " +
(complaint.reply || "No reply yet.") + "</p>";

let complaintList = document.getElementById("complaintList");

if (complaintList) {
    let complaints = JSON.parse(
        localStorage.getItem("complaints") || "[]"
    );

    if (complaints.length > 0) {
        complaintList.innerHTML = "";

        complaints.forEach(function(complaint) {
            let card = document.createElement("div");

            card.className = "service-card";

            card.innerHTML =
                "<h3>" + complaint.title + "</h3>" +
                "<p><strong>District:</strong> " +
                complaint.district + "</p>" +
                "<p><strong>Category:</strong> " +
                complaint.category + "</p>" +
                "<p><strong>Location:</strong> " +
                complaint.location + "</p>" +
                "<p><strong>Description:</strong> " +
                complaint.description + "</p>" +
                "<p><strong>Status:</strong> Pending</p>";

            complaintList.appendChild(card);
        });
    }
}

let myComplaintList = document.getElementById("myComplaintList");

if (myComplaintList) {
    let complaints = JSON.parse(
        localStorage.getItem("complaints") || "[]"
    );

    if (complaints.length > 0) {
        myComplaintList.innerHTML = "";

        complaints.forEach(function(complaint) {
            let card = document.createElement("div");

            card.className = "service-card";

            card.innerHTML =
                "<h3>" + complaint.title + "</h3>" +
                "<p><strong>District:</strong> " +
                complaint.district + "</p>" +
                "<p><strong>Category:</strong> " +
                complaint.category + "</p>" +
                "<p><strong>Location:</strong> " +
                complaint.location + "</p>" +
                "<p><strong>Description:</strong> " +
                complaint.description + "</p>" +
                "<p><strong>Status:</strong> Pending</p>";

            myComplaintList.appendChild(card);
        });
    }
}
