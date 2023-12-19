document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const employeeFields = document.getElementById("employeeFields");
  const employeeRoleSelect = document.getElementById("employeeRole");

  // When user selects "Employee", display job title fields
  document.getElementById("userType").addEventListener("change", function () {
    if (this.value === "employee") {
      employeeFields.style.display = "block";
    } else {
      // Set the value of employeeRole to "other" when the userType is not "employee"
      employeeRoleSelect.value = "other";
      employeeFields.style.display = "none";
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents default form submission

    // Collect form values
    const data = {
      registerFirstName: document.getElementById("registerFirstName").value,
      registerLastName: document.getElementById("registerLastName").value,
      registerEmail: document.getElementById("registerEmail").value,
      registerPassword: document.getElementById("registerPassword").value,
      confirmPassword: document.getElementById("confirmPassword").value,
      userType: document.getElementById("userType").value,
      role: document.getElementById("employeeRole").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      countryCode: document.getElementById("countryCode").value,
      address: document.getElementById("address").value,
      zipcode: document.getElementById("zipcode").value,
      observations: document.getElementById("observations").value,
    };

    // Validate that passwords match
    if (data.registerPassword !== data.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    //Send data to server
    fetch("http://localhost:3000/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Successfully Recorded.");
          // Redirect or perform other actions after registration
          form.reset();
        } else {
          alert("Error when registering. Please, try again.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        alert("Error when registering. Please, try again.");
      });

  });
});
