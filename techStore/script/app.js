// JavaScript (app.js)
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { Client } = require("cassandra-driver");
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');


const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());


// Configure connection to Cassandra database
const client = new Client({
  cloud: {
    secureConnectBundle: "C:/Users/radri/OneDrive - GUSCanada/001 - NCT - Niagara College Toronto/02_Term/01_Contemporary Storage Systems Programming/week12_final project/Project_r2/nodejsProject/secure-connect-techstore.zip",
  },
  credentials: {
    username: "tzTiiKiiQbIIOwOhacvKiYgZ",
    password: "6TokGUlXEHZ9mbB_2z_Z-8TWo8.Zn3I7AASAa7AWvGgkx5PBDpjswMwjooQptWyCNLd-L5ZWP+5sx9kfP+RojZkUJNmgmsIrYQ4Z503wUd8sGyiYApv4UAlgh.q87A83",
    keyspace: "techstore_keyvalue", // Name of your keyspace
  },
});

client.connect();

app.post("/register", async (req, res) => {
  try {
    // await client.connect();

    const { registerFirstName, registerLastName, registerEmail,  phoneNumber,  countryCode, address, zipcode, observations, registerPassword, userType, role, confirmPassword } = req.body;

    console.log('req.body: ', req.body)

    // Inserting data on Datastax Cassandra DB
    const query = `INSERT INTO techstore_tabular.agents (
        agent_id, 
        first_name, 
        last_name, 
        email, 
        phone_number, 
        country_code, 
        address, 
        zipcode, 
        observations, 
        password, 
        user_type, 
        role, 
        registration_date) 
        VALUES (uuid(),?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, toTimestamp(now()))`;

    await client.execute(query, [registerFirstName, registerLastName, registerEmail,  phoneNumber,  countryCode, address, zipcode, observations, registerPassword, userType, role]);
    

    res.status(200).json({ message: "Successfully registered." });
  } catch (error) {
    console.error("Error when registering:", error);
    res.status(500).json({ error: "Error when registering." });
  } finally {
    //await client.shutdown();
  }
});



app.get("/search", (req, res) => {
  const searchText = req.query.query;

  // Query to search records using Email
  const query = "SELECT agent_id, first_name, last_name, email, phone_number, country_code, address, zipcode, observations, user_type, role, registration_date FROM techstore_tabular.agents WHERE email = ? ALLOW FILTERING";

  const params = [searchText];

  client.execute(query, params, { prepare: true }, (err, result) => {
      if (err) {
          console.error("Error on search: ", err);
          res.status(500).json([]);
      } else {
          res.json(result.rows);
      }
  });
});



// GraphQL connection configuration
const schema = buildSchema(`
  type Mutation {
    insert_products(value: ProductInput): AppliedResult
  }

  input ProductInput {
    product_code: String
    product_name: String
    keyspace: String
  }

  type AppliedResult {
    value: Product
  }

  type Product {
    product_code: String
    product_name: String
  }
`);

const root = {
    insert_products: async ({ value }) => {
        const query = `INSERT INTO ${value.keyspace}.products JSON ?`; // Incorporating the keyspace in the query
        const params = [JSON.stringify(value)];

        try {
            await client.execute(query, params, { prepare: true });
            return { value };
        } catch (error) {
            console.error('Error inserting data into Cassandra:', error);
            return { value: null };
        }
    },
};

// Middleware to parse the request body as JSON
app.use(bodyParser.json());

// Route to handle GraphQL query
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// Route to handle product registration
app.post('/registerProduct', async (req, res) => {
  console.log("AQUII ", req.body)
  const { product_code, product_name } = req.body;
  const keyspace = 'techstore_keyvalue';

  const query = `INSERT INTO ${keyspace}.products JSON ?`;
  const params = [JSON.stringify({ product_code, product_name })];

  try {
      await client.execute(query, params, { prepare: true });
      res.status(200).json({ success: true, message: 'Product registered successfully!' });
  } catch (error) {
      console.error('Error registering product:', error);
      res.status(500).json({ success: false, message: 'Error registering product. Try again.' });
  }
});


//executing the Product search
app.get("/searchProduct", (req, res) => {
  const productCode = req.query.productCode;

  // Query to search records using Product Code
  const query = "SELECT product_code, product_name FROM techstore_keyvalue.products WHERE product_code = ?";

  const params = [productCode];

  client.execute(query, params, { prepare: true }, (err, result) => {
      if (err) {
          console.error("Search error: ", err);
          res.status(500).json([]);
      } else {
          res.json(result.rows);
      }
  });
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
