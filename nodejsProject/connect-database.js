// const credentials = {
//   "clientId": "JMlygtLzgXhGOQLFKsqjjyfg",
//   "secret": "deUpqOKyzKqKL_FXdg-AXAS8fw7HH,Zb-Pcqgx4i7WxhJDaXwUZkj0+J5879Wx1rjogk-asZ7zG3M-+vgpEy6uFLy8,LmlehITNNltKi3ynvGyqY20BdnuLhW,jCKF_W",
//   "token": "AstraCS:JMlygtLzgXhGOQLFKsqjjyfg:e9189a52d06c4d8dcc763ba735adba20b7306c8f3da9f64d5ccab680c2ae8c4b"
// }

const { Client } = require("cassandra-driver");
async function run() {
  const client = new Client({
    cloud: {
    secureConnectBundle: "C:/Users/radri/OneDrive - GUSCanada/001 - NCT - Niagara College Toronto/02_Term/01_Contemporary Storage Systems Programming/week12_final project/Project_r2/nodejsProject/secure-connect-techstore.zip",//"secure-connect-techstore.zip",
    },
    credentials: {
    username: "tzTiiKiiQbIIOwOhacvKiYgZ",//credentials.clientId,
    password: "6TokGUlXEHZ9mbB_2z_Z-8TWo8.Zn3I7AASAa7AWvGgkx5PBDpjswMwjooQptWyCNLd-L5ZWP+5sx9kfP+RojZkUJNmgmsIrYQ4Z503wUd8sGyiYApv4UAlgh.q87A83",//credentials.secret,
    },
  });

  await client.connect();

  // Execute a query
  const rs = await client.execute("SELECT * FROM techstore_tabular.agents"); //system.local(não usar) //techstore_tabular.agents (informar o correto sen~ao a informacão vem errada)
  console.log(`Your cluster returned ${rs.rowLength} row(s)`);

  await client.shutdown();
}

// Run the async function
run();