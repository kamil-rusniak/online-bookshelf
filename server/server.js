const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const express = require("express");
const app = express();

app.get("/api", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  const books = await prisma.book.findMany();

  // const books = await prisma.$queryRaw`SELECT * FROM book`;

  res.json(books);
  console.log(books);
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
