// says the POSt is a little bit more complicated than the users

import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */ 
export const createPost = async (req, res) => { //(01:25:00) says sum about how it works
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({ // create new post into the Database
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); // save to MongoDB
    // once we add a post, we need all the posts to be returned to the Frontend, 
    // so it has all the posts (updated) 
    const post = await Post.find(); 
    
    res.status(201).json(post); // 201 reps created something
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => { // grab the posts of everyone
  try {
    const post = await Post.find();
    res.status(200).json(post); // reps successful request
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => { // grab only useer post
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
// says it is probably the hardest part
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // coming from the URL 
    const { userId } = req.body; // coming from the body
    const post = await Post.findById(id); // grab post information

    const isLiked = post.likes.get(userId);



    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true); // why not also delete the true
    }

    const updatedPost = await Post.findByIdAndUpdate( 
      id,
      { likes: post.likes }, 
      { new: true } 
      
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
