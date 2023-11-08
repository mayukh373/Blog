const express = require("express");
const blogRoute = new express.Router();
const userSchema = require("../models/user");
const postSchema = require("../models/post");
const commentSchema = require("../models/comment");
const ValidateRegisterData = require("../Validation/ValidateRegisterData");
const ValidateLoginData = require("../Validation/ValidateLoginData");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

onst imageSchema = require("../models/image");
const multer = require('multer');
const path = require('path');

//create new account(public)
blogRoute.post("/create-account", async (req, res) => {
    const { errors, isValid } = ValidateRegisterData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const { username, email, password } = req.body;
    const exists = await userSchema.findOne({ email });
    if (exists) return res.status(400).json("Email already exists!");
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(password, salt);
    userSchema.create({ username, email, password: encryptedPass }, (err, data) => {
        if (err)
            return err;
        else {
            res.json({ _id: data.id, username: data.username, token: getToken(data.id, data.username, data.email) });
        }
    })
})

//login (public)
blogRoute.post("/login", async (req, res) => {
    const { errors, isValid } = ValidateLoginData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const { email, password } = req.body;
    userSchema.findOne({ email }, async (err, data) => {
        if (err)
            return err;
        else {
            if (!data) {
                return res.status(400).json("Email does not exist!");
            }
            if (await bcrypt.compare(password, data.password)) {
                res.json({ _id: data.id, username: data.username, token: getToken(data.id, data.username, data.email) });
            }
            else {
                res.status(400).json("Wrong Credentials!");
            }
        }
    })
})

//create new post(private -- only accessible by users)
blogRoute.post("/create-post", (req, res) => {
    postSchema.create(req.body, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})

//view all posts (public)
blogRoute.get("/posts", (req, res) => {
    postSchema.find({}, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})

//view posts (private -- accessed by users) 
//edit posts (private -- only accessible by author)
blogRoute.route("/posts/:id")
.get((req, res) => {
    postSchema.findById(req.params.id, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})
.put((req, res) => {
    postSchema.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})

//delete blog (private -- only accessible by author)
blogRoute.delete("/posts/delete/:id", (req, res) => {
    postSchema.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) 
            return err;
        else 
            res.json(data);
    })
})

// view blogs by account owner (private)
blogRoute.get("/posts/user/:id", (req, res) => {
    postSchema.find({userId: req.params.id}, (err, data) => {
        if (err)
            return err;
        else 
            res.json(data);
    })
})

//view profile(private -- only accessible by account owner)
blogRoute.get("/users/:id", (req, res) => {
    userSchema.find(req.params.id, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})

//view comments (private -- only accessible by users)
blogRoute.get("/post/comments/:id", (req, res) => {
    commentSchema.find({postId: req.params.id}, async (err, data) => {
        if (err)
            return err;
        else {
            // const temp = await commentSchema.find({postId: req.params.id}).exec()
            return res.json(data);
        }
    })
})

//post comments (private -- only accessible by users)
blogRoute.post("/post/comments/create", (req, res) => {
    commentSchema.create(req.body, (err, data) => {
        if (err)
            return err;
        else
            return res.json(data);
    })
})

//delete comments (private -- only accessible by comment author)
blogRoute.delete("/post/comments/delete/:id", (req, res) => {
    commentSchema.findByIdAndRemove(req.params.id, (err, data) => {
        if (err)
            return err;
        else
            return res.json(data);
    })
})

//generate jwt
const getToken = (id, username, email) => {
    return jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
  
  // Upload an image
  blogRoute.post('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const { originalname, filename, path, mimetype } = req.file;
  
      // Save image data to MongoDB
      const image = new imageSchema({ originalname, filename, path, mimetype });
      await image.save();
  
      res.json(image);
    } catch (error) {
      res.status(400).json({ error: 'Failed to upload image.' });
    }
  });
  
  // Get an image by its ID
  blogRoute.get('/:id', async (req, res) => {
    try {
      const image = await imageSchema.findById(req.params.id);
  
      if (!image) {
        return res.status(400).json({ error: 'Image not found.' });
      }
  
      res.sendFile(image.path);
    } catch (error) {
      res.status(400).json({ error: 'Failed to retrieve image.' });
    }
  });

module.exports = blogRoute;
