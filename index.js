const express = require("express");
const app = express();

app.use(express.json());

app.get("/",(req, res) => {
    res.send("Hello Express");
});

app.get("/about",(req, res) => {
    res.send("About page");
});

const post = [
 { id: 1, title: "First post" },
 { id: 2, title: "Second post" },
];

app.get("/posts", (req, res) => {
 res.json(posts);
});

let posts = [
    {
        id: 1,
        title: "First post"
    },
];
let nextId = 2;

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

    const post = { id: nextId++, title: req.body.title };
    posts.push(post);
    res.status(201).json(post);
});

//ここから宿題部分

let comments = []; 
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

//ここまで宿題部分

app.use((req, res) =>{
    res.status(404).send("Not Found");
    
});

app.listen(3001, () => {
  console.log("listening on 3001");
});