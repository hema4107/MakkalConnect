 const API_BASE_URL = "http://localhost:5000/api";

        // Display dashboard statistics
        async function loadDashboard() {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/citizen/dashboard`
                );

                if (!response.ok) {
                    throw new Error("Dashboard API request failed");
                }

                const data = await response.json();

                document.getElementById("totalComplaints").textContent =
                    data.totalComplaints ?? 0;

                document.getElementById("pendingComplaints").textContent =
                    data.pendingComplaints ?? 0;

                document.getElementById("inProgressComplaints").textContent =
                    data.inProgressComplaints ?? 0;

                document.getElementById("resolvedComplaints").textContent =
                    data.resolvedComplaints ?? 0;

                const total = Number(data.totalComplaints) || 0;
                const resolved = Number(data.resolvedComplaints) || 0;

                const progress = total > 0
                    ? Math.min(100, Math.round((resolved / total) * 100))
                    : 0;

                document.getElementById("progressFill").style.width =
                    progress + "%";

                document.getElementById("progressText").textContent =
                    `${progress}% of your complaints have been resolved.`;

                document.getElementById("progressBar").setAttribute(
                    "aria-valuenow",
                    progress
                );

                // Recent activities supplied by the backend
                const activityList =
                    document.getElementById("activityList");

                activityList.replaceChildren();

                const activities = Array.isArray(data.recentActivities)
                    ? data.recentActivities
                    : [];

                if (activities.length === 0) {
                    const item = document.createElement("li");
                    item.textContent = "No recent activities available.";
                    activityList.appendChild(item);
                } else {
                    activities.forEach(function(activity) {
                        const item = document.createElement("li");
                        item.textContent = activity.message || "Activity update";
                        activityList.appendChild(item);
                    });
                }

            } catch (error) {
                console.error("Dashboard error:", error);

                document.getElementById("progressText").textContent =
                    "Dashboard data will appear when the backend API is connected.";

                document.getElementById("activityList").replaceChildren();

                const item = document.createElement("li");
                item.textContent =
                    "Recent activities will appear after backend connection.";
                document.getElementById("activityList").appendChild(item);
            }
        }

        // Display MLA cards supplied by the backend
        async function loadMLAs() {
            const mlaList = document.getElementById("mlaList");

            try {
                const response = await fetch(`${API_BASE_URL}/mlas`);

                if (!response.ok) {
                    throw new Error("MLA API request failed");
                }

                const data = await response.json();

                // Supports either an array or { mlas: [...] }
                const mlas = Array.isArray(data) ? data : data.mlas;

                mlaList.replaceChildren();

                if (!Array.isArray(mlas) || mlas.length === 0) {
                    mlaList.textContent =
                        "No MLA details are available yet.";
                    return;
                }

                mlas.forEach(function(mla) {
                    const card = document.createElement("article");
                    card.className = "mla-card";

                    const photo = document.createElement("img");
                    photo.className = "mla-photo";
                    photo.alt = "Photo of " + (mla.name || "MLA");

                    if (mla.photoUrl) {
                        photo.src = mla.photoUrl;
                    } else {
                        photo.alt = "MLA photo not available";
                    }

                    const name = document.createElement("h3");
                    name.textContent = mla.name || "Name not available";

                    const district = document.createElement("p");
                    district.textContent =
                        "District: " + (mla.district || "Not available");

                    const constituency = document.createElement("p");
                    constituency.textContent =
                        "Constituency: " +
                        (mla.constituency || "Not available");

                    const party = document.createElement("p");
                    party.textContent =
                        "Political Party: " +
                        (mla.party || "Not available");

                    const contact = document.createElement("p");
                    contact.textContent =
                        "Contact: " + (mla.contact || "Not available");

                    const office = document.createElement("p");
                    office.textContent =
                        "Office: " + (mla.officeAddress || "Not available");

                    const complaintButton = document.createElement("a");
                    complaintButton.className = "action-button";
                    complaintButton.textContent = "Direct Complaint";

                    // Pass MLA details to the complaint form.
                    const query = new URLSearchParams({
                        mlaId: mla.id ?? "",
                        mlaName: mla.name || "",
                        district: mla.district || ""
                    });

                    complaintButton.href = "complaint.html?" + query.toString();

                    card.append(
                        photo,
                        name,
                        district,
                        constituency,
                        party,
                        contact,
                        office,
                        complaintButton
                    );

                    mlaList.appendChild(card);
                });

            } catch (error) {
                console.error("MLA loading error:", error);

                mlaList.replaceChildren();

                const message = document.createElement("p");
                message.className = "status-message";
                message.textContent =
                    "MLA details will appear here after the backend API is connected.";

                mlaList.appendChild(message);
            }
        }

        // Load data when the page opens
        loadDashboard();
        loadMLAs();
