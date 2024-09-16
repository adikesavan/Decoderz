// Declare global variables
let selectedDoctor = null;
let appointments = {}; // Object to hold appointments
let reminders = []; // Array to hold medication reminders

// Function to send an SMS
function sendSMS(to, message) {
  fetch("http://localhost:3000/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: to,
      message: message,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Login Button Functionality with validation
document.getElementById("loginButton").addEventListener("click", function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate that both fields are not empty
  if (username === "" || password === "") {
    alert("Please enter both username and password.");
  } else {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  }
});

// Schedule Appointment Button Functionality
document
  .getElementById("scheduleAppointmentButton")
  .addEventListener("click", function () {
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("doctorListSection").style.display = "block";
    loadDoctors();
  });

// Load Doctors Functionality
function loadDoctors() {
  const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Williams"];
  const doctorList = document.getElementById("doctorList");
  doctorList.innerHTML = ""; // Clear existing doctors

  doctors.forEach((doctor) => {
    const doctorDiv = document.createElement("div");
    doctorDiv.innerText = doctor;
    doctorDiv.className = "doctor-info";
    doctorDiv.addEventListener("click", function () {
      selectedDoctor = doctor;
      document.getElementById("selectedDoctorName").innerText = doctor;
      document.getElementById("doctorListSection").style.display = "none";
      document.getElementById("appointmentFormSection").style.display = "block";
    });
    doctorList.appendChild(doctorDiv);
  });
}

// Back to Options from Doctors
document
  .getElementById("backToOptionsFromDoctorsButton")
  .addEventListener("click", function () {
    document.getElementById("doctorListSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  });

// Schedule Appointment Button Functionality
document
  .getElementById("scheduleButton")
  .addEventListener("click", function () {
    const patientName = document.getElementById("patientName").value.trim();
    const patientId = document.getElementById("patientId").value.trim();
    const phoneNumber = document.getElementById("patientPhone").value.trim();
    const appointmentDate = document.getElementById("appointmentDate").value;

    // Validate phone number (simple format check)
    const phonePattern = /^\+\d{10,15}$/; // Example: +1234567890
    if (!phonePattern.test(phoneNumber)) {
      alert("Please enter a valid phone number.");
      return;
    }

    const appointmentKey = `${patientId}-${appointmentDate}`;
    if (!appointments[appointmentKey]) {
      appointments[appointmentKey] = {
        name: patientName,
        doctor: selectedDoctor,
        date: appointmentDate,
        phone: phoneNumber,
      };

      // Add appointment to the list
      const appointmentItem = document.createElement("li");
      appointmentItem.innerHTML = `Appointment with ${selectedDoctor} on ${appointmentDate} for ${patientName}. Phone: ${phoneNumber}
          <button onclick="cancelAppointment('${appointmentKey}')">Cancel</button>`;
      document.getElementById("appointmentList").appendChild(appointmentItem);

      alert("Appointment scheduled successfully!");

      // Send SMS through backend API
      sendSMS(
        phoneNumber,
        `Your appointment with ${selectedDoctor} is scheduled for ${appointmentDate}.`
      );
    } else {
      alert("You already have an appointment at this time.");
    }

    // Clear input fields
    document.getElementById("patientName").value = "";
    document.getElementById("patientId").value = "";
    document.getElementById("patientPhone").value = "";
    document.getElementById("appointmentDate").value = "";
  });

// Cancel Appointment Functionality
function cancelAppointment(appointmentKey) {
  if (appointments[appointmentKey]) {
    delete appointments[appointmentKey];
    alert("Appointment canceled successfully!");

    // Remove the appointment from the displayed list
    const appointmentList = document.getElementById("appointmentList");
    const listItems = appointmentList.getElementsByTagName("li");
    for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].innerHTML.includes(appointmentKey)) {
        appointmentList.removeChild(listItems[i]);
        break;
      }
    }
  } else {
    alert("Appointment not found.");
  }
}

// Back to Options from Appointment
document
  .getElementById("backToOptionsFromAppointmentButton")
  .addEventListener("click", function () {
    document.getElementById("appointmentFormSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  });

// Add Medication Reminder Button Functionality
document
  .getElementById("addReminderButton")
  .addEventListener("click", function () {
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("medicationReminderSection").style.display =
      "block";
  });

// Add Reminder Submit Button Functionality
document
  .getElementById("addReminderSubmitButton")
  .addEventListener("click", function () {
    const medPatientName = document
      .getElementById("medPatientName")
      .value.trim();
    const medPatientId = document.getElementById("medPatientId").value.trim();
    const medicationName = document
      .getElementById("medicationName")
      .value.trim();
    const medicationTime = document.getElementById("medicationTime").value;

    if (
      medPatientName === "" ||
      medPatientId === "" ||
      medicationName === "" ||
      medicationTime === ""
    ) {
      alert("Please fill out all fields.");
      return;
    }

    reminders.push({
      name: medPatientName,
      id: medPatientId,
      medication: medicationName,
      time: medicationTime,
    });

    const reminderItem = document.createElement("li");
    reminderItem.innerText = `Reminder for ${medPatientName} (${medPatientId}) to take ${medicationName} at ${medicationTime}`;
    document.getElementById("medicationReminderList").appendChild(reminderItem);

    alert("Reminder added successfully!");

    // Clear input fields
    document.getElementById("medPatientName").value = "";
    document.getElementById("medPatientId").value = "";
    document.getElementById("medicationName").value = "";
    document.getElementById("medicationTime").value = "";
  });

// Back to Options from Medication Reminder
document
  .getElementById("backToOptionsFromReminderButton")
  .addEventListener("click", function () {
    document.getElementById("medicationReminderSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  });

// Communication Button Functionality
document
  .getElementById("communicationButton")
  .addEventListener("click", function () {
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("communicationSection").style.display = "block";
  });

// Send Message Button Functionality
document
  .getElementById("sendMessageButton")
  .addEventListener("click", function () {
    const message = document.getElementById("messageInput").value.trim();

    if (message === "") {
      alert("Please enter a message.");
      return;
    }

    const messageItem = document.createElement("li");
    messageItem.innerText = message;
    document.getElementById("messageList").appendChild(messageItem);

    alert("Message sent!");

    // Clear message input
    document.getElementById("messageInput").value = "";
  });

// Back to Options from Communication
document
  .getElementById("backToOptionsFromCommunicationButton")
  .addEventListener("click", function () {
    document.getElementById("communicationSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  });

// Profile Button Functionality
document.getElementById("profileButton").addEventListener("click", function () {
  document.getElementById("optionsSection").style.display = "none";
  document.getElementById("profileSection").style.display = "block";
});

// Update Profile Button Functionality
document
  .getElementById("updateProfileButton")
  .addEventListener("click", function () {
    const profileName = document.getElementById("profileName").value.trim();
    const profileId = document.getElementById("profileId").value.trim();

    if (profileName === "" || profileId === "") {
      alert("Please fill out all fields.");
      return;
    }

    const profileDetailsList = document.getElementById("profileDetailsList");
    profileDetailsList.innerHTML = `
      <li>Name: ${profileName}</li>
      <li>ID: ${profileId}</li>
    `;

    alert("Profile updated successfully!");
  });

// Back to Options from Profile
document
  .getElementById("backToOptionsFromProfileButton")
  .addEventListener("click", function () {
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  });

// Feedback Button Functionality
document
  .getElementById("feedbackButton")
  .addEventListener("click", function () {
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("feedbackSection").style.display = "block";
  });

// Submit Feedback Button Functionality
document
  .getElementById("submitFeedbackButton")
  .addEventListener("click", function () {
    const feedback = document.getElementById("feedbackInput").value.trim();

    if (feedback === "") {
      alert("Please enter your feedback.");
      return;
    }

    const feedbackItem = document.createElement("li");
    feedbackItem.innerText = feedback;
    document.getElementById("feedbackList").appendChild(feedbackItem);

    alert("Feedback submitted!");

    // Clear feedback input
    document.getElementById("feedbackInput").value = "";
  });

// Back to Options from Feedback
document
  .getElementById("backToOptionsFromFeedbackButton")
  .addEventListener("click", function () {
    document.getElementById("feedbackSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "block";
  });
