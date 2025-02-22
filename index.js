import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;



//connecting to the database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "toDoList",
  password: "Superuser",
  port: 5432
})

db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");
    if (result.rows && result.rows.length > 0) {
      const items = result.rows;
      console.log(items);
      // res.status(200).json(items)

      res.render("index.ejs", {
        listTitle: "Today",
        listItems: items
      });
    } else {
      console.log("No items found");
      res.render("index.ejs", {
        listTitle: "Today",
        listItems: []
      });
    }
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/add", async (req, res) => {
  const item = req.body.newItem;


  db.query("INSERT INTO items (title) VALUES ($1)", [item])
  console.log(items)
  res.redirect("/");
});

app.post("/edit", async (req, res) => {

  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {

  const id = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [id])
    res.redirect("/")

  } catch (err) {
    console.log(err);

  }



});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
