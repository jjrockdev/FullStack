import mysql from "mysql";
const connected = mysql.createConnection({
    /* host: "mysql-184219-0.cloudclusters.net",
    port: "19997",
    user: "admin",
    password: "zJr6WYx6",
    database: "db_restaurant", */
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "db_restaurant",
});
connected.connect((err) => {
    if (err) console.log(`Connected Database Faild`);
    console.log(`Connected Database Success`);
});
export default connected;