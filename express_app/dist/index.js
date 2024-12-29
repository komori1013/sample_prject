"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
const mysql = require("mysql"); //zennの記事では"mysql2"
const cors = require("cors");
// サーバーの設定
const app = (0, express_1.default)(); // expressを使う
dotenv_1.default.config(); // アプリケーションで動作するようにdotenvを設定する?
app.use(cors()); // corsを使うと、クロスオリジンのエラーが出なくなる?
app.use(express_1.default.json()); // express.json()を使うと、req.bodyを使えるようになる
//データベース接続
const db = mysql.createConnection({
    user: process.env.DB_USER, // 作成したユーザー名
    host: process.env.DB_HOST, // host名
    password: process.env.DB_PASSWORD, // 作成したユーザーのパスワード
    database: process.env.DB_DATABASE, // 作成したデータベース名
    port: process.env.DB_PORT, // MySQLのデフォルトポート
});
// データベース接続確認
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
});
let createAutenticationTable = "CREATE TABLE IF NOT EXISTS authentication (id INT AUTO_INCREMENT PRIMARY KEY, account_name VARCHAR(255), password VARCHAR(255))";
let createTokenTable = "CREATE TABLE IF NOT EXISTS token (id INT AUTO_INCREMENT PRIMARY KEY, token VARCHAR(255))";
// データの追加
app.post("/api/authentication", (req, res) => {
    const account_name = req.body.account_name;
    const password = req.body.password;
    const query = "SELECT * FROM authentication WHERE account_name = ? AND password = ?";
    db.query(query, [account_name, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Server Error" });
        }
        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid Account Name or Password" });
        }
        if (result.length > 1) {
            return res.status(200).json({ message: "Authentication Success" });
        }
    });
});
app.post("/api/token", (req, res) => {
    // ランダムな32文字の生成、hexは16進数の略、ランダムなバイトデータを16進数の文字列に変換
    const randomString = crypto_1.default.randomBytes(16).toString("hex");
    // JWTの生成
    const token = jsonwebtoken_1.default.sign({ randomString }, process.env.JWT_SECRET || "default_secret", { expiresIn: '1m' });
    const query = "INSERT INTO token (token) VALUES (?)";
    db.query(query, [token], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: "Error inserting data into database" });
        }
        else {
            res.status(200).json({ message: "Values Inserted", token });
        }
    });
});
// ポート番号の設定
const PORT = process.env.PORT;
// サーバーの起動
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
});
/*
app.post("/animals", (req, res) => {
  const name = req.body.name;

  const query = "INSERT INTO animals (name) VALUES (?)";
  db.query(query, [name], (err:any, result:any) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Error inserting data into database" });
    } else {
      res.status(200).json({ message: "Value Inserted" });
    }
  });
});


// データの取得
app.get("/animals", (req, res) => {
  const query = "SELECT * FROM animals";
  db.query(query, (err:any, result:any) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

// データの更新
app.put("/animals/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const query = "UPDATE animals SET name = ? WHERE id = ?";
  db.query(query, [name, id], (err:any, result:any) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating data in database");
    } else {
      res.status(200).send("Value Updated");
    }
  });
});

// データの削除
app.delete("/animals/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM animals WHERE id = ?";
  db.query(query, [id], (err:any, result:any) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error deleting data from database");
    } else {
      res.status(200).send("Value Deleted");
    }
  });
});


const port = 3001;
app.listen(port, () => {
  console.log(`Yey, your server is running on port ${port}`);
});


app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app.get("/sample", (request: Request, response: Response) => {
  response.status(200).send("Hello Sample World");
});

app.get("/sample-json", (request: Request, response: Response) => {
  response.status(200).json({ "hello": "taro" });
});

*/
