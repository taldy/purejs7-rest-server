"use strict";

const fs = require("fs");
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

const COLUMNS_PATH = "./data/columns.json";
const CARDS_PATH = "./data/cards.json";

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/", function(req, res) {
  res.send(`<html><body>
    <h1>Pure.js #7 test server</h1>

    Allowed commands:<br />
<br />
    GET /api/column<br />
    GET /api/card<br />
    POST /api/card<br />
<br />
    PUT /api/card/:id<br />
    PATCH /api/card/:id<br />
    DELETE /api/card/:id<br />
    </body></html>`);
});

app.get("/api/column", function(req, res) {
  const columns = require(COLUMNS_PATH);
  console.log("get columns");

  res.type("application/json").send(JSON.stringify(columns, null, 2));
});

app.get("/api/card/:id", function(req, res) {
  const { id } = req.params;
  console.log("get card", id);

  const cards = require(CARDS_PATH);
  const index = cards.findIndex(card => card.id == id);

  if (index === -1) {
    res.status(404);
    res.send();
  } else {
    res.type("application/json").send(JSON.stringify(cards[index], null, 2));
  }
});


app.get("/api/card", function(req, res) {
  const cards = require(CARDS_PATH);
  console.log("get cards");

  res.type("application/json").send(JSON.stringify(cards, null, 2));
});

app.post("/api/card", function(req, res) {
  const card = req.body;
  console.log("post card", card);

  const cards = require(CARDS_PATH);

  card.id = card.id || getNextId(cards);
  cards.push(card);

  saveCards(cards);

  res.type("application/json").send(JSON.stringify(card, null, 2));
});

app.put("/api/card/:id", function(req, res) {
  const { id } = req.params;
  const card = req.body;

  console.log("put card", id, card);

  const cards = require(CARDS_PATH);
  const index = cards.findIndex(card => card.id == id);

  if (index === -1) {
    res.status(404);
    res.send();
  } else {
    cards[index] = card;
    saveCards(cards);
    res.type("application/json").send(JSON.stringify(card, null, 2));
  }
});

app.patch("/api/card/:id", function(req, res) {
  const { id } = req.params;
  const patch = req.body;

  console.log("patch card", id, patch);

  const cards = require(CARDS_PATH);
  const index = cards.findIndex(card => card.id == id);

  if (index === -1) {
    res.status(404);
    res.send();
  } else {
    const card = { ...cards[index], ...patch };
    cards[index] = card;
    saveCards(cards);

    res.type("application/json").send(JSON.stringify(card, null, 2));
  }
});

app.delete("/api/card/:id", function(req, res) {
  const { id } = req.params;

  console.log("delete card", id);

  const cards = require(CARDS_PATH);
  const index = cards.findIndex(card => card.id == id);

  if (index === -1) {
    res.status(404);
    res.send();
  } else {
    cards.splice(index, 1);
    saveCards(cards);
    res.send();
  }
});

function getNextId(arr) {
  return Math.max(0, ...(arr || []).map(item => item.id || 0)) + 1;
}

function saveCards(cards) {
  fs.writeFileSync(CARDS_PATH, JSON.stringify(cards, null, 2), {
    encoding: "utf8"
  });
}

app.listen(8089, function() {
  console.log("Pure.js #7 Test server. \nVisit http://localhost:8089");
});
