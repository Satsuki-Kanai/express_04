const express = require("express");

const Database = require("better-sqlite3");
const db = new Database("blog.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT    NOT NULL
    )
`);

const app = express();

app.use(express.json());

app.get("/",(req, res) => {
    res.send("Hello Express");
});

app.get("/about",(req, res) => {
    res.send("About page");
});

//app.get("/posts", (req, res) => {
//res.json(posts);
//});

// 宿題部分(第8回)
app.get("/posts", (req, res) => {
    const keyword = req.query.keyword; 

    let posts;
    if (keyword) {
      posts = db.prepare("SELECT * FROM posts WHERE title LIKE ?")
                .all(`%${keyword}%`);
    } else {
      posts = db.prepare("SELECT * FROM posts")
                .all();
    }

    res.json(posts);
});
//ここまで宿題(第8回)

app.get("/posts", (req, res) => {
 const posts = db
    .prepare("SELECT * FROM posts")
    .all();
 res.json(posts);
});

app.get("/posts/:id",(req, res) => {
    const id = Number(req.params.id);
    const post = posts.find((p) => { //find:配列を順番に回して参照しるものを入れる
        return p.id === id
    })

    if(!post){
        return res.status(404).json({error:"post is not found"})
    }

    res.json(post);
});

app.patch("/posts/:id",(req, res) => {
    const id = Number(req.params.id);
    const post = posts.find((p) => {
        return p.id === id;
    });

    if(!post){
        return res.status(404).json({ error: "post is not found" })
    }

    if(req.body.title !== undefined){
        post.title = req.body.title;
    }
    res.json(post);
})

app.delete("/posts/:id", (req, res) => {
    const id = Number(req.params.id)
    const newPosts = posts.find((p) => {
        return p.id !== id
    }) 

    posts = newPosts //合わないやつを全部代入してやる
    
    //const index = posts.findIndex((p) =>{
    //    return p.id === id;
    //});
    
    // if(index === -1){ //なかったら-1が帰ってくる
    //     return res.status(404).json({error: "post in not found"});
    // }

    // posts.splice(index, 1) //何番目から何個　

    res.status(204).end();
})

app.post("/posts",(req, res)=>{
    const{ title } = req.body; //const title = req.body.title

    if(!title){
        return res.status(400).json({
            error: "title: is required"
        });
    }

    const MAX = 100;

    if (title.length > MAX) {
        return res.status(400).json({
            error: "title is too long",
        });
    }

    const info = db
        .prepare("INSERT INTO posts (title) VALUES (?)")
        .run(title);
    const created = db
        .prepare("SELECT * FROM posts WHERE id = ?")
        .get(info.lastInsertRowid);
    res.status(201).json(created);
});

//ここから宿題部分(0625)

let comments = [];  //空の配列
let nextCommentId = 1; 

app.get("/comments", (req, res) => {
    res.json(comments);
});

app.post("/comments", (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({
            error: "text is required"
        });
    }

    const MAX_TEXT_LENGTH = 100
    if (text.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({
            error: `text is too long `
        });
    }

    const newComment = {
        id: nextCommentId++,
        text: text
    };
    comments.push(newComment);

    res.status(201).json(newComment);
});

//ここまで宿題部分(0625)

//ここから宿題部分（0724）
let books = [
    { id: 1, title: "吾輩は猫である", author: "夏目漱石" }
]; 
let nextBookId = 2;

//GET
app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

//POST
app.post("/books", (req, res) => {
  const { title, author } = req.body;//<-こいつ何いってるかは実はわからん

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "title is required and cannot be empty" });
  }

  if (!author || author.trim() === "") {
    return res.status(400).json({ error: "author is required and cannot be empty" });
  }

  const newBook = {
    id: nextBookId++,
    title: title.trim(),
    author: author.trim()
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

//PATCH
app.patch("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author } = req.body;

  if (title !== undefined) {
    if (title.trim() === "") {
      return res.status(400).json({ error: "title cannot be empty" });
    }
    book.title = title.trim();
  }

  if (author !== undefined) {
    if (author.trim() === "") {
      return res.status(400).json({ error: "author cannot be empty" });
    }
    book.author = author.trim();
  }

  res.json(book);
});

// 5. DELETE /books/:id (削除)
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.status(204).end();
});

//ここまで宿題部分（0724）


app.use((req, res) =>{
    res.status(404).send("Not Found");
    
});

app.listen(3001, () => {
  console.log("listening on 3001");
});