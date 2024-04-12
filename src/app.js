const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiResponse = require("./utils/apiResponse");
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Server status: UP");
});

/* The code snippet is setting up a route handler in the Express application for any GET request that does not match any of the defined routes. */
app.get("*", (req, res) => {
  res.json(new apiResponse(404, "Invalid route", null));
});

/**
 * The function `print` is used to recursively traverse and print information about routes in a Node.js
 * Express application.
 * @param path - The `path` parameter is an array that represents the current path being processed in
 * the `print` function. It is initially an empty array `[]` and gets updated as the function
 * recursively traverses through the layers of the Express application routes.
 * @param layer - The `layer` parameter in the given code represents a layer in the Express
 * application's router stack. It can contain information about routes, methods, and handlers defined
 * in the application. The code recursively traverses through the layers in the router stack and prints
 * out the routes and methods defined in the application.
 */
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

app._router.stack.forEach(print.bind(null, []));

module.exports = app;
