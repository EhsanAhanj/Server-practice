const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const auth = require("../middleware/auth");

const { Product, validate } = require("../model/prod-model");
const { Member } = require("../model/Member");
const { Comment } = require("../model/commentSchema");
const { CommentBox } = require("../model/CommentBox");

const { handelLikeToggle } = require("../script/handleLIke");
const { handelComment } = require("../script/handleComment");
const { handelLikeComment } = require("../script/handleLikeComment");
const { handelReplyComment } = require("../script/handelReplyComment");
const { handelReplyLike } = require("../script/handelReplyLike");
const Joi = require("joi");

Fawn.init(mongoose);

//----------------------GET ALL PRODUCT POSTS -------------------------
router.get("/", async (req, res) => {
  // add filters with validate them
  const prodPosts = await Product.find().sort({ _id: -1 });
  res.status(200).send(prodPosts);
});
//------------------------GET ONE PRODUCT POST BY ID-------------------------
router.get("/:_id", async (req, res) => {
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id moshkel dare `);
  const prodPost = await Product.findById({ _id: req.params._id });
  let commentBoxComponent = await CommentBox.findById({
    _id: prodPost.commentBoxId
  }).select("comments");
  if (!prodPost || !commentBoxComponent)
    return res.status(404).send(`ba in id post nadarim`);
  return res
    .status(200)
    .send(`innnnnno mikhay ${prodPost} commentbox${commentBoxComponent}`);
});
// --------------------MUTATE UNDER THE POST---------------------------------
router.put("/:_id", auth, async (req, res) => {
  const prodPost = await Product.findById({ _id: req.params._id });
  const embededUser = req.user;
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id product moshkel dare `);
  const commentId = req.body.commentWork._id;
  const { commentBoxId } = prodPost;
  const { _id: postId } = prodPost;
  //-----------------------LIKE PRODUCT ---------------------------------------------

  //-----------halate 1 -----------

  if (!prodPost) return res.send(`poost injori ba in id nadarim`);

  if (req.body.like) {
    const result = await handelLikeToggle(Product, postId, embededUser);
    res.status(200).send(result);
  }

  //--------------------------------comment on post ------------------------------
  else if (req.body.comment) {
    const text = req.body.comment;
    const result = await handelComment(text, commentBoxId, embededUser);
    res.status(200).send(result);

    //---------------------LIKE COMMENT------------------------------------------------
  } else if (req.body.commentWork._id && req.body.commentWork.like) {
    if (!ObjectID.isValid(req.body.commentWork._id))
      return res.status(400).send(`id comment moshkel dare `);

    const result = await handelLikeComment(
      commentBoxId,
      commentId,
      embededUser
    );
    res.status(200).send(result);

    // -------------------------- REPLAY COMMMENT----------------------------
  } else if (req.body.commentWork._id && req.body.commentWork.replyComment) {
    if (!ObjectID.isValid(req.body.commentWork._id))
      return res.status(400).send(`id comment moshkel dare `);
    const text = req.body.commentWork.replyComment;
    const result = await handelReplyComment(
      text,
      commentBoxId,
      commentId,
      embededUser
    );
    res.status(200).send(result);

    //---------------------- LIKE A REPLY-----------------------------------------
  } else if (
    req.body.commentWork._id &&
    req.body.commentWork.replyWork._id &&
    req.body.commentWork.replyWork.like
  ) {
    if (
      !ObjectID.isValid(req.body.commentWork._id) ||
      !ObjectID.isValid(req.body.commentWork.replyWork._id)
    )
      return res.status(400).send(`idha comment moshkel dare `);

    const replayId = req.body.commentWork.replyWork._id;
    const result = await handelReplyLike(
      replayId,
      commentBoxId,
      commentId,
      embededUser
    );
    res.status(200).send(result);
  } else {
    res.send(`mikhay chi koni`);
  }
});

//------------------ CREAATE PRODUCE POST -----------------------------------------

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    const prodPost = new Product({
      owner: req.user,
      caption: req.body.caption,
      tags: req.body.tags,
      category: req.body.category
    });

    const commentBox = new CommentBox({
      _id: prodPost.commentBoxId,
      downOf: prodPost._id,
      onModel: "Product"
    });

    try {
      new Fawn.Task()

        .save("Product", prodPost)

        .save("commentboxes", commentBox)

        .update(
          "members",
          { _id: req.user._id },
          {
            $push: { prodPosts: prodPost._id },
            $inc: { prodPostNumber: 1 }
          }
        )

        .run({ useMongoose: true });

      res.status(200).send("DONE");
    } catch (err) {
      res
        .status(500)
        .send(`SOMTHING IN SERVER WENT WRONG error : ${err}!!!!!!!!!`);
    }
  }
});

module.exports = router;
