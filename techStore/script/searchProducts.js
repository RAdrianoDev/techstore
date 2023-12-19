document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchResults = document.getElementById("searchResults");

    searchButton.addEventListener("click", function () {
        const productCode = searchInput.value.trim();

        // Clear previous results
        searchResults.innerHTML = "";

        // Run the search
        axios.get(`http://localhost:3000/searchProduct?productCode=${productCode}`)
            .then((response) => {
                const data = response.data;
                if (data.length === 0) {
                    searchResults.innerHTML = "No results found.";
                } else {
                    data.forEach((result) => {
                        const resultElement = document.createElement("div");
                        resultElement.innerText = `Product Code: ${result.product_code}, Product Name: ${result.product_name}`;
                        searchResults.appendChild(resultElement);
                    });
                }
            })
            .catch((error) => {
                console.error("Error performing the search: ", error);
            });
    });
});
