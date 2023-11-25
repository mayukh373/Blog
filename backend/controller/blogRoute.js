const express = require("express");
const blogRoute = new express.Router();
const userSchema = require("../models/user");
const postSchema = require("../models/post");
const commentSchema = require("../models/comment");
const ValidateRegisterData = require("../Validation/ValidateRegisterData");
const ValidateLoginData = require("../Validation/ValidateLoginData");
const ValidateUpdateProfileData = require("../Validation/ValidateUpdateProfileData");
const ValidateUpdateEmail = require("../Validation/ValidateUpdateEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require("fs-extra")
const path = require('path');

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
blogRoute.post('/uploads', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json('No file uploaded.');
        }
        const { path } = req.file;
        res.json(path);
    } catch (error) {
        res.status(400).json({ error: 'Failed to upload image.' });
    }
})

//create new account(public)
blogRoute.post("/create-account", async (req, res) => {
    const { errors, isValid } = ValidateRegisterData(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const { username, email, password, createdOn } = req.body;
    const exists = await userSchema.findOne({ email });
    if (exists) return res.status(400).json("Email already exists!");
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(password, salt);
    userSchema.create({ username, email, password: encryptedPass, createdOn }, (err, data) => {
        if (err)
            return err;
        else {
            res.json({ _id: data.id, username: data.username });
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
                res.json({ _id: data.id, username: data.username, bookmarks: data.bookmarks, imagePath: data.imagePath, token: getToken(data.id, data.username, data.email) });
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

// search posts (public)
blogRoute.get("/posts/:search", async (req, res) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i')
    const data = await postSchema.find({ title: { $regex: regex } }).exec()
    return res.json(data)
})

//view all posts(public)
blogRoute.get("/posts", async (req, res) => {
    const data = await postSchema.find({}).exec();
    return res.json(data);
})

//view posts (private -- accessed by users) 
//edit posts (private -- only accessible by author)
blogRoute.route("/posts/post/:id")
    .get(async (req, res) => {
        const post = await postSchema.findById(req.params.id).exec();
        if (!post) return res.json(null)
        return res.json(post);
    })
    .put(async (req, res) => {
        const { post, oldImageData, foo } = req.body;
        if (foo) deleteImage(oldImageData);
        postSchema.findByIdAndUpdate(req.params.id, { $set: post }, (err, data) => {
            if (err)
                return err;
            else {
                res.json(data);
            }
        })
    })/

//update views on a post (public)-- considers unique views by logged in users only
blogRoute.put("/posts/update-views/:id", async (req, res) => {
    postSchema.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, data) => {
        if (err)
            return err;
        else
            res.json(data)
    })
})

//update bookmarks (private) 
blogRoute.put("/users/bookmarks/:id", async (req, res) => {
    const { bookmark, status } = req.body
    if (status) { //add bookmark
        const data = await userSchema.findByIdAndUpdate(req.params.id, { $push: { bookmarks: bookmark } }, { new: true }).exec();
        return res.json(data.bookmarks)
    }
    else { //remove bookmark
        const data = await userSchema.findByIdAndUpdate(req.params.id, { $pull: { bookmarks: bookmark } }, { new: true }).exec()
        return res.json(data.bookmarks)
    }
})

//delete post, it's image and the comments under the post (private -- only accessible by author)
blogRoute.delete("/posts/delete/:id", (req, res) => {
    const { imagePath } = req.body;
    postSchema.findByIdAndRemove(req.params.id, (err, data) => {
        if (err)
            return err;
        else {
            deleteImage(imagePath)
            commentSchema.deleteMany({ postId: data._id }, (err, data) => {
                if (err)
                    return err;
                else
                    res.json({ message: "Post deleted" });
            })
        }
    })
})

// view blogs by account owner (private)
blogRoute.get("/posts/user/:id", (req, res) => {
    postSchema.find({ userId: req.params.id }, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})


//fetch profile data (public -- accessible by everyone)
blogRoute.get("/users/:id", async (req, res) => {
    const data = await userSchema.findById(req.params.id).select('-password').exec();
    return res.json(data)
})

//update profile data (private -- only accessible by account owner)
blogRoute.put("/update/user-profile/:id", async (req, res) => {
    const { userInfo, oldImagePath, imagePath, foo } = req.body;
    const { errors, isValid } = ValidateUpdateProfileData(userInfo);
    if (!isValid) {
        delete (imagePath)
        return res.status(400).json(errors);
    }
    if (foo) {
        deleteImage(oldImagePath)
        const userPosts = await postSchema.find({ userId: req.params.id }).exec();
        userPosts.map(async (post) => {
            await postSchema.findByIdAndUpdate(post._id, { userImagePath: imagePath })
        })
        const userComments = await commentSchema.find({ userId: req.params.id }).exec();
        userComments.map(async (comment) => {
            await commentSchema.findByIdAndUpdate(comment._id, { userImagePath: imagePath })
        })
    }
    userSchema.findByIdAndUpdate(req.params.id, { $set: userInfo }, (err, data) => {
        if (err)
            return err;
        else
            res.json(data);
    })
})

//update user email (private) -- only accessible by account owner
blogRoute.put("/update/user-email/:id", async (req, res) => {
    const { errors, isValid } = ValidateUpdateEmail(req.body);
    if (!isValid) return res.status(400).json(errors);
    if (await userSchema.findOne({ email: req.body.email })) return res.status(400).json("Email already exists!");
    userSchema.findByIdAndUpdate(req.params.id, { email: req.body.email }, (err, data) => {
        if (err)
            return err;
        else
            res.json("Email has been changed!!");
    })

})

//update user password (private) -- only accessible by account owner
blogRoute.put("/update/user-password/:id", async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (newPassword.length < 5) return res.status(400).json("Password must have atleast 5 characters!")
    const { password } = await userSchema.findById(req.params.id);
    if (!(await bcrypt.compare(currentPassword, password))) {
        return res.status(400).json("Your current password is incorrect!")
    }
    const salt = await bcrypt.genSalt(10);
    const newEncryptedPass = await bcrypt.hash(newPassword, salt);
    userSchema.findByIdAndUpdate(req.params.id, { password: newEncryptedPass }, (err, data) => {
        if (err)
            return err;
        else
            return res.json("Password changed successfully!")
    })
})

/*delete user account (private) -- only accessible by account owner
PROCESS-----
user's comments
fetch user's posts -> for each post -> delete image - delete comments under the post - delete post
user's personal info -> delete user profile image - delete userinfo */
blogRoute.delete("/delete/user/:id", async (req, res) => {
    const userInfo = await userSchema.findById(req.params.id);
    if (!(await bcrypt.compare(req.body.password, userInfo.password))) {
        return res.status(400).json("Incorrect password!")
    }
    await commentSchema.deleteMany({ userId: req.params.id }).exec();
    const userPosts = await postSchema.find({ userId: req.params.id }).exec();
    userPosts.map(async (post) => {
        await commentSchema.deleteMany({ postId: post._id }).exec();
        deleteImage(post.imagePath);
        await postSchema.findByIdAndDelete(post._id).exec();
    })
    deleteImage(userInfo.imagePath);
    await userSchema.findByIdAndDelete(req.params.id).exec();
    res.status(200).json("User Account Deleted");
})

//view comments (private -- only accessible by users)
blogRoute.get("/post/comments/:id", (req, res) => {
    commentSchema.find({ postId: req.params.id }, async (err, data) => {
        if (err)
            return err;
        else {
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
            res.json(data);
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
        expiresIn: '5h'
    })
}

//delete image from local storage
const deleteImage = (imagePath) => {
    if (!imagePath) return;
    fs.unlinkSync('C:/BLOG/backend/' + imagePath)
}

module.exports = blogRoute;
