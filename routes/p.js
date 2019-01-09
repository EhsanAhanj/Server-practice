const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const auth = require("../middleware/auth");

const { Product, validate } = require("../model/p_model");
const { Member } = require("../model/Member");
const { Comment } = require("../model/commentSchema");
const { CommentBox, generateCommentBox } = require("../model/CommentBox");
const { generateLikers, Likers } = require("../model/likers");
const { Reply } = require("../model/replySchema");

const Joi = require("joi");

Fawn.init(mongoose);

//----------------------GET ALL PRODUCT POSTS -------------------------
router.get("/", async (req, res) => {
  // add filters with validate them
  const product_posts = await Product.find().sort({ _id: -1 });
  res.status(200).send(product_posts);
});
//------------------------GET ONE PRODUCT POST BY ID-------------------------
router.get("/:_id", async (req, res) => {
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id moshkel dare `);
  const product_post = await Product.findById({ _id: req.params._id });
  if (!product_post) return res.status(404).send(`ba in id post nadarim`);
  return res.status(200).send(`innnnnno mikhay ${product_post}`);
});
// --------------------MUTATE UNDER THE POST---------------------------------
router.put("/:_id", auth, async (req, res) => {
  const product_post = await Product.findById({ _id: req.params._id });
  const embededUser = req.user;
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id product moshkel dare `);

  //-----------halate 1 -----------
  if (!product_post) return res.send(`poost injori ba in id nadarim`);
  // ---------------------------LOAD LIKERS COMPONENT-------------------------
  let likers = await Likers.findById({ _id: product_post.likedBy });
  // ---------------------------LOAD COMMENT BOX ATTACHED --------------------
  let commentBoxComponent = await CommentBox.findById({
    _id: product_post.commentBoxId
  }).select("comments");
  // console.log("cooooooooooooooment box", commentBoxComponent);
  //-----------------------LIKE PRODUCT BY FAWN--------------------------------
  if (req.body.like) {
    // console.log("likers componennt", likers, "khaliyeeeeeeeeeeeee?/");
    let found = likers.likedBy.filter(o => {
      if (o._id === embededUser._id) return o;
    });
    //console.log("found", found);

    //-------------halate 2 unlike---
    if (found.length >= 1) {
      likers.likedBy.pull(embededUser);
      product_post.likes--;
      likers.likes--;
      await likers.save();
      await product_post.save();
      return res.send(`ghablan like kardi hala unlike`);
    }

    //-----------halate 3 like-------
    else {
      likers.likedBy.push(embededUser);
      product_post.likes++;
      likers.likes++;
      await likers.save();
      await product_post.save();
      return res.status(200).send(`post liked`);
    }
  }
  //--------------------------------comment on post ------------------------------
  else if (req.body.comment) {
    const comment = new Comment({
      comment_owner: embededUser,
      text: req.body.comment
    });

    await CommentBox.updateOne(
      {
        _id: product_post.commentBoxId
      },
      { $inc: { commentCount: 1 }, $push: { comments: comment } }
    );

    return res.status(200).send(`DONE -> Comment send.`);
    //console.log("comentbox", product_post.commentBoxId);
    //---------------------LIKE COMMENT------------------------------------------------
  } else if (req.body.commentWork._id && req.body.commentWork.like) {
    if (!ObjectID.isValid(req.body.commentWork._id))
      return res.status(400).send(`id comment moshkel dare `);

    const commentFounded = commentBoxComponent.comments.filter(o => {
      if (o._id == req.body.commentWork._id) return o;
    });
    console.log("req age bashe", commentFounded);
    if (commentFounded.length == 0)
      return res.send("comment nist ya pak shode");

    const isLiked = commentFounded[0].likedBy.filter(o => {
      if (o._id == embededUser._id) return o;
    });
    if (isLiked.length == 0) {
      await CommentBox.findOneAndUpdate(
        {
          _id: product_post.commentBoxId,
          "comments._id": ObjectID(req.body.commentWork._id)
        },
        {
          $inc: { "comments.$.likes": 1 },
          $push: { "comments.$.likedBy": embededUser }
        },
        {
          upsert: true,
          new: true
        }
      );
      res.status(200).send(`COOOMENT LIKED `);
    } else {
      await CommentBox.findOneAndUpdate(
        {
          _id: product_post.commentBoxId,
          "comments._id": ObjectID(req.body.commentWork._id)
        },
        {
          $inc: { "comments.$.likes": -1 },
          $pull: { "comments.$.likedBy": embededUser }
        },
        {
          upsert: true,
          new: true
        }
      );
      res.status(200).send(`COOOMENT UNLIKED `);
    }

    res.send(req.body.commentWork);
  }
  // -------------------------- REPLAY COMMMENT----------------------------
  else if (req.body.commentWork._id && req.body.commentWork.replyComment) {
    if (!ObjectID.isValid(req.body.commentWork._id))
      return res.status(400).send(`id comment moshkel dare `);
    let reply = new Reply();
    await CommentBox.findOneAndUpdate(
      {
        _id: product_post.commentBoxId,
        "comments._id": ObjectID(req.body.commentWork._id)
      },
      {
        $inc: { "comments.$.likes": -1 },
        $pull: { "comments.$.likedBy": embededUser }
      },
      {
        upsert: true,
        new: true
      }
    );
  } else {
    res.send(`mikhay chi koni`);
  }
});

//------------------ CREAATE PRODUCE POST -----------------------------------------
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  //console.log("in errrrrrrrrrrrrr", error);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    const { userId, caption, category, tags } = req.body;
    const member = await Member.findById({ _id: userId });

    let product_post = new Product({
      owner: req.user,
      caption,
      tags,
      category
    });
    // console.log("id badaz mongoos", product_post.commentBoxId);
    generateCommentBox("Product", product_post._id, product_post.commentBoxId);
    generateLikers("Product", product_post._id, product_post.likedBy);
    await Member.updateOne(
      { _id: member._id },
      {
        $push: { product_posts: product_post._id }
      }
    );
    product_post = await product_post.save();

    if (product_post) {
      res.status(200).send(product_post);
    } else res.send("mahsool post nasho");
  }
});

module.exports = router;
