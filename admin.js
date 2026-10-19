 const table = document.getElementById("complaintTable");
        const searchInput = document.getElementById("searchInput");
        const statusFilter = document.getElementById("statusFilter");

        let selectedId = null;

        function getComplaints() {
            try {
                const data = JSON.parse(
                    localStorage.getItem("complaints") || "[]"
                );
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error("Could not read complaints:", error);
                return [];
            }
        }

        function saveComplaints(complaints) {
            localStorage.setItem("complaints", JSON.stringify(complaints));
        }

        function makeCell(text) {
            const cell = document.createElement("td");
            cell.textContent = text || "—";
            return cell;
        }

        function makeStatus(status) {
            const span = document.createElement("span");
            const validStatuses = ["Pending", "In Progress", "Resolved"];
            const safeStatus = validStatuses.includes(status)
                ? status
                : "Pending";

            span.className = "status " + safeStatus
                .toLowerCase().replaceAll(" ", "-");
            span.textContent = safeStatus;
            return span;
        }

        function updateStats(complaints) {
            document.getElementById("totalCount").textContent =
                complaints.length;

            document.getElementById("pendingCount").textContent =
                complaints.filter(c => (c.status || "Pending") === "Pending").length;

            document.getElementById("progressCount").textContent =
                complaints.filter(c => c.status === "In Progress").length;

            document.getElementById("resolvedCount").textContent =
                complaints.filter(c => c.status === "Resolved").length;
        }

        function renderComplaints() {
            const complaints = getComplaints();
            updateStats(complaints);
            table.replaceChildren();

            const search = searchInput.value.trim().toLowerCase();
            const filter = statusFilter.value;

            const filtered = complaints.filter(c => {
                const status = c.status || "Pending";
                const searchable = [
                    c.id, c.title, c.district, c.category
                ].join(" ").toLowerCase();

                return searchable.includes(search) &&
                    (filter === "All" || status === filter);
            });

            document.getElementById("emptyMessage").hidden =
                filtered.length !== 0;

            filtered.forEach(complaint => {
                const row = document.createElement("tr");

                row.appendChild(makeCell(complaint.id));
                row.appendChild(makeCell(complaint.title));
                row.appendChild(makeCell(complaint.district));

                const date = complaint.submittedAt
                    ? new Date(complaint.submittedAt).toLocaleDateString()
                    : "—";

                row.appendChild(makeCell(date));

                const statusCell = document.createElement("td");
                statusCell.appendChild(makeStatus(complaint.status || "Pending"));
                row.appendChild(statusCell);

                const actionCell = document.createElement("td");
                const viewButton = document.createElement("button");
                viewButton.type = "button";
                viewButton.className = "primary";
                viewButton.textContent = "View & Reply";
                viewButton.addEventListener("click", () => openComplaint(complaint.id));

                actionCell.appendChild(viewButton);
                row.appendChild(actionCell);

                table.appendChild(row);
            });

            document.getElementById("lastUpdated").textContent =
                "Updated: " + new Date().toLocaleTimeString();
        }

        function setText(id, value) {
            document.getElementById(id).textContent = value || "—";
        }

        function openComplaint(id) {
            const complaint = getComplaints().find(c => c.id === id);
            if (!complaint) return;

            selectedId = id;

            document.getElementById("selectMessage").hidden = true;
            document.getElementById("complaintDetails").hidden = false;
            document.getElementById("successMessage").style.display = "none";

            setText("detailId", complaint.id);
            setText("detailTitle", complaint.title);
            setText("detailDistrict", complaint.district);
            setText("detailCategory", complaint.category);
            setText("detailLocation", complaint.location);
            setText("detailDescription", complaint.description);

            setText(
                "detailDate",
                complaint.submittedAt
                    ? new Date(complaint.submittedAt).toLocaleString()
                    : "—"
            );

            // The existing form stores an evidence file input, but it
            // doesn't currently save the file itself to localStorage.
            setText(
                "detailEvidence",
                complaint.evidenceName ||
                "No evidence file details saved in this demo."
            );

            document.getElementById("statusEditor").value =
                ["Pending", "In Progress", "Resolved"].includes(complaint.status)
                    ? complaint.status
                    : "Pending";

            document.getElementById("replyEditor").value =
                complaint.reply || "";

            document.getElementById("detailsPanel").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        document.getElementById("saveButton").addEventListener("click", () => {
            if (!selectedId) return;

            const complaints = getComplaints();
            const complaint = complaints.find(c => c.id === selectedId);

            if (!complaint) {
                alert("Complaint not found. Please refresh the dashboard.");
                return;
            }

            complaint.status = document.getElementById("statusEditor").value;
            complaint.reply = document.getElementById("replyEditor").value.trim();
            complaint.updatedAt = new Date().toISOString();

            try {
                saveComplaints(complaints);
            } catch (error) {
                alert("Could not save changes in this browser.");
                return;
            }

            renderComplaints();

            const message = document.getElementById("successMessage");
            message.textContent =
                "Status and reply saved in this browser's demo data.";
            message.style.display = "block";
        });

        document.getElementById("cancelButton").addEventListener("click", () => {
            selectedId = null;
            document.getElementById("complaintDetails").hidden = true;
            document.getElementById("selectMessage").hidden = false;
        });

        searchInput.addEventListener("input", renderComplaints);
        statusFilter.addEventListener("change", renderComplaints);

        renderComplaints();
  
