const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("Hello World!");
});

app.post(
  "/merchant/register",
  (req: any, res: { send: (arg0: string) => void }) => {
    console.log(req.body);
    res.send("Hello World!");
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
