import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

export const createBlog = async (req, res) => {

    const {title, description, author, draft} = req.body;
    if(!title || !description || !author){
        return res.status(400).json({status: "failed", message: "All the fields are required"});
    }
    const user = req.user;
    if(!user){
        return res.status(400).json({status: "failed", message: "Coudn't fetch the User from cookies"}); 
    }
    const newBlog = new Blog({
        title,
        description,
        author,
        draft,
        User: user
    });
    await newBlog.save();
    await User.findByIdAndUpdate(user, {$push : {blogs: newBlog._id}});
    return res.status(201).json({status: "successfull", message: "New blog created", newBlog});
}
export const getMyBlogs = async (req, res) => {
    const user = req.user;
    const Blogs = await User.find({id : user._id}).select("blogs").populate("blogs");
    return res.status(200).json({status: "success", message: "Blogs fetched successfully", Blogs});    
}
export const deleteMyBlog = async (req, res) => {
    const blogId = req.params.id;
    const user = req.user;
    const existingBlog = await Blog.findById(blogId);
    if(!existingBlog){
        return res.status(404).json({status: "failed", message: "The blog wasn't found"});
    }
    if(existingBlog.User.toString() !== (user._id).toString()){
        return res.status(403).json({status: "failed", message: "unauthorized request"});
    }
    await Blog.findByIdAndDelete(blogId);
    await User.findByIdAndUpdate(user._id, {$pull: {blogs: blogId}});
    return res.status(200).json({status: "success", message: "The blog was deleted successfully"});
}
export const updateMyBlog = async (req, res) => {
    const {title, description, author, draft} = req.body;

    let updateData = {};
    if(title !== undefined) updateData.title = title;
    if(description !== undefined)updateData.description = description;
    if(author !== undefined) updateData.author = author;
    if(draft !== undefined) updateData.draft = draft;
    const blogId = req.params.id;
    const user = req.user;
    const existingBlog = await Blog.findById(blogId);
    if(!existingBlog){
        return res.status(404).json({status: "failed", message: "The blog wasn't found"});
    }
    if(existingBlog.User.toString() !== (user._id).toString()){
        return res.status(403).json({status: "failed", message: "unauthorized request"});
    }
    await Blog.findByIdAndUpdate(blogId, updateData, {new: true});
    return res.status(200).json({status: "success", message: "Blog updated successfully"});
}
export const transferBlog = async (req, res) => {
    const user = req.user;
    const blogId = req.params.id;
    const futureOwnerEmail = req.body.futureOwnerEmail;
    if(!futureOwnerEmail){
        return res.status(400).json({status: "failed", message: "Please provide with a email"});

    }
    const existingUser = await User.findOne({email : futureOwnerEmail}).select("-password");
    const blog = await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({status: "failed", message: "The blog wasn't found"});

    }
    if(!existingUser){
        return res.status(404).json({status: "failed", message: "The user wasn't found"});
    }
    if((blog.User).toString() !== (user._id).toString()){
        return res.status(403).json({status: "failed", message: "unauthorized request"});

    }
    if((existingUser._id).toString() == (user._id).toString()){
        return res.status(400).json({status: "failed", message: "Ownership can't be transferred to yourself"});
    }
    sendOwnershipTransferEmail();
    return res.status(200).json({status: "success", message: "Ownership will be transfered once the user accepts the request"});    
}
