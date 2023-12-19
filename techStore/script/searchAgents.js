document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchResults = document.getElementById("searchResults");

  searchButton.addEventListener("click", function () {
    const searchText = searchInput.value.trim();

    // Clean previous results
    searchResults.innerHTML = "";

    // Execute the search
    fetch(`http://localhost:3000/search?query=${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          searchResults.innerHTML = "No results found.";
        } else {
          data.forEach((result) => {
            const resultElement = document.createElement("div");
            resultElement.innerText = `Name: ${result.first_name} ${result.last_name}
            Email: ${result.email}
            Phone Number: +${result.country_code} ${result.phone_number}
            Address: ${result.address} - ZipCode: ${result.zipcode}
            Observations: ${result.observations}
            `;
            searchResults.appendChild(resultElement);
          });
        }
      })
      .catch((error) => {
        console.error("Error performing the search: ", error);
      });
  });
});
