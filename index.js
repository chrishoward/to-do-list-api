const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const dbConfig = require("./dbConfig");

const api = express();
const pool = new Pool(dbConfig);
const port = 4000;

// middleware
api.use(cors(), bodyParser.json());

// routes
api.get("/tasks", (request, response) => {
  console.log("request received: ");
  pool.query("SELECT * FROM tasks ORDER BY id DESC", (err, res) => {
    if (err) return console.log(err);
    response.json(res.rows);
  });
});

api.post("/tasks", (request, response) => {
  const data = request.body;
  pool.query(
    "INSERT INTO tasks(data) VALUES($1)",
    [JSON.stringify(data)],
    (err, res) => {
      if (err) return console.log(err);
      response.redirect("/tasks");
    }
  );
});

api.put("/tasks/:id", (request, response) => {
  const { id } = request.params;
  const data = request.body;
  pool.query(
    "UPDATE tasks SET data=($1) WHERE id=($2)",
    [JSON.stringify(data), id],
    (err, res) => {
      if (err) return console.log(err);
      response.redirect("/tasks");
    }
  );
});

api.delete("/tasks/:id", (request, response) => {
  const { id } = request.params;
  pool.query("DELETE FROM tasks WHERE id=($1)", [id], (err, res) => {
    if (err) return console.log(err);
    response.redirect("/tasks");
  });
});

// start server
api.listen(port, () => console.log("listening on port: ", port));
