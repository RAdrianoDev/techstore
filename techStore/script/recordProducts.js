document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
  
    productForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const productCode = document.getElementById("productCode").value;
      const productName = document.getElementById("productName").value;
  
      // Build the product data
      const productData = {
        product_code: productCode,
        product_name: productName,
      };
  
      // Send the data to the server - "http://localhost:3000/graphql"
      axios.post("http://localhost:3000/registerProduct", {
        product_code: productCode,
        product_name: productName,
      })
      .then(response => {
        // const result = response.data.data.insert_products.applied;
        if (response.status === 200) {
          console.log("Product registered successfully.");
          alert("Product registered successfully!");
        } else {
          console.error("Error when registering product.");
          alert("Error registering product. Try again.");
        }
      })
      .catch(error => {
        console.error("Error sending data: ", error);
        alert("Error registering product. Try again.");
      });
    });
  });
  