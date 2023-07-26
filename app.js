const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const { request } = require("http");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParse.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// mongo connection
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const itemsSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("article", itemsSchema);

//routing
app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((element) => {
        res.send(element);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post((req, res) => {
    Article.insertMany({
      title: req.body.title,
      content: req.body.content,
    })
      .then(() => {
        res.send("target added!");
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.body.title })
      .then(() => {
        res.send("Node Deleted Sucessfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  });

app
  .route("/articles/:title")
  .get((req, res) => {
    Article.find({ title: req.params.title })
      .then((element) => {
        res.send(element);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .put((req, res) => {
    Article.updateMany(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content }
    )
      .then(() => {
        res.send(
          "record Updated for the title " +
            req.params.title +
            " to " +
            req.body.title
        );
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .patch((req, res) => {
    Article.findOneAndUpdate({ title: req.params.title }, { $set: req.body })
      .then(() => {
        res.send("Record updated for " + req.params.title);
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .delete((req, res) => {
    Article.deleteMany({ title: req.params.title })
      .then(() => {
        res.send("deleted sucessfully for title " + req.params.title);
      })
      .catch((err) => {
        console.log(err);
      });
  });
app.listen(3000, () => {
  console.log("sucessfully log to port 3000");
});
