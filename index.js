const http = require("http");

let products = [
  { id: 1, brand: "Pixel", price: 300, color: "red" },
  { id: 2, brand: "Redmi", price: 280, color: "black" },
  { id: 3, brand: "Samsung", price: 450, color: "white" },
  { id: 4, brand: "Redmi", price: 450, color: "black" },
  { id: 5, brand: "Samsung", price: 450, color: "red" },
  { id: 6, brand: "Iphone", price: 450, color: "white" },
];

let users = [
  { id: 1, name: "Vali", age: 20 },
  { id: 2, name: "Ali", age: 30 },
  { id: 3, name: "Aziz", age: 40 },
];

const server = http.createServer((req, res) => {
    const url = req.url;
    const met = req.method;

  try {
    if (url.startsWith("/products/") && met == "GET") {
      try {
        let id = parseInt(url.split("/")[2]);
        let topilgan = products.find((p) => p.id === id);
        if (topilgan) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(topilgan));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Product topilmadi" }));
        }
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Server error while finding product" })
        );
      }
    } else if (url.startsWith("/products") && met == "GET") {
      try {
        const parsedUrl = new URL(url, `http://${req.headers.host}`);
        const searchParams = parsedUrl.searchParams;
        const filters = {
          color: searchParams.get("color"),
          brand: searchParams.get("brand"),
        };

        let filteredProducts = products.filter((product) => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return product[key]?.toLowerCase() == value.toLowerCase();
          });
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(filteredProducts));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Server error while filtering products" })
        );
      }
    } else if (url == "/products" && met == "POST") {
      let a = "";
      req.on("data", (chunk) => {
        a += chunk;
      });
      req.on("end", () => {
        try {
          let newPrd = JSON.parse(a);
          newPrd.id = products.at(-1)?.id ? products.at(-1).id + 1 : 1;
          products.push(newPrd);
          res.end(JSON.stringify(newPrd));
        } catch (err) {
          console.error(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid product data" }));
        }
      });
    } else if (url.startsWith("/products") && met == "PATCH") {
      let info = "";
      req.on("data", (ch) => {
        info += ch;
      });
      req.on("end", () => {
        try {
          let id = parseInt(url.split("/")[2]);
          let eski = products.find((u) => u.id === id);
          if (!eski) throw new Error("Product not found");
          let i = products.indexOf(eski);
          let change = { ...eski, ...JSON.parse(info) };
          products.splice(i, 1, change);
          res.end(JSON.stringify(change));
        } catch (err) {
          console.error(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else if (url.startsWith("/products") && met == "DELETE") {
      try {
        let id = parseInt(url.split("/")[2]);
        let eski = products.find((u) => u.id === id);
        if (!eski) throw new Error("Product not found");
        let i = products.indexOf(eski);
        let deleted = products.splice(i, 1);
        res.end(JSON.stringify(deleted[0]));
      } catch (err) {
        console.error(err);
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    } else if (url == "/users" && met == "GET") {
      try {
        let formatted = JSON.stringify(users);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(formatted);
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Server error while getting users" }));
      }
    } else if (url.startsWith("/users/") && met == "GET") {
      try {
        let id = parseInt(url.split("/")[2]);
        let topilgan = users.find((u) => u.id === id);
        if (topilgan) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(topilgan));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "User topilmadi" }));
        }
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Server error while finding user" }));
      }
    } else if (url == "/users" && met == "POST") {
      let a = "";
      req.on("data", (chunk) => {
        a += chunk;
      });
      req.on("end", () => {
        try {
          let newUs = JSON.parse(a);
          newUs.id = users.at(-1)?.id ? users.at(-1).id + 1 : 1;
          users.push(newUs);
          res.end(JSON.stringify(newUs));
        } catch (err) {
          console.error(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid user data" }));
        }
      });
    } else if (url.startsWith("/users") && met == "PATCH") {
      let info = "";
      req.on("data", (ch) => {
        info += ch;
      });
      req.on("end", () => {
        try {
          let id = parseInt(url.split("/")[2]);
          let eski = users.find((u) => u.id === id);
          if (!eski) throw new Error("User not found");
          let i = users.indexOf(eski);
          let change = { ...eski, ...JSON.parse(info) };
          users.splice(i, 1, change);
          res.end(JSON.stringify(change));
        } catch (err) {
          console.error(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else if (url.startsWith("/users") && met == "DELETE") {
      try {
        let id = parseInt(url.split("/")[2]);
        let eski = users.find((u) => u.id === id);
        if (!eski) throw new Error("User not found");
        let i = users.indexOf(eski);
        let deleted = users.splice(i, 1);
        res.end(JSON.stringify(deleted[0]));
      } catch (err) {
        console.error(err);
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    } else if (url === "/register" && met === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const newUser = JSON.parse(body);
          newUser.id = users.at(-1)?.id ? users.at(-1).id + 1 : 1;
          users.push(newUser);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "User registered", user: newUser })
          );
        } catch (err) {
          console.error(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid user data" }));
        }
      });
    } else if (url === "/login" && met === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const { name } = JSON.parse(body);
          const found = users.find((user) => user.name === name);
          if (found) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Login successful",
                user: found,
              })
            );
          } else {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Login failed" }));
          }
        } catch (err) {
          console.error(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid login data" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } catch (err) {
    console.error("Kutilmagan xatolik:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Umumiy server xatoligi" }));
  }
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});