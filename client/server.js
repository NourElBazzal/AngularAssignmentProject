const express = require("express");
const path = require("path");

const app = express();

const distFolder = path.join(__dirname, "dist", "assignment-app", "browser");

console.log("Avant express.static");
app.use(express.static(distFolder));
console.log("Après express.static");

// Redirige tout vers index.html (routing Angular)
app.get("/*", (req, res) => {
  res.sendFile(path.join(distFolder, "index.html"));
});

const port = process.env.PORT || 8010;
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});