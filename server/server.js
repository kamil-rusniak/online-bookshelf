const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();

let corsOptions = {
  origin: ["http://localhost:3000", "https://online-bookshelf.com"],
};

app.use(cors(corsOptions));

app.get("/api", async (req, res) => {
  const books = await prisma.book.findMany();

  // const books = await prisma.$queryRaw`SELECT * FROM book`;

  res.json(books);
  console.log(books);
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
