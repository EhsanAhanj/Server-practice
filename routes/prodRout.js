const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const auth = require("../middleware/auth");

const { Product, validate } = require("../model/p_model");
const { Member } = require("../model/Member");
const { Comment } = require("../model/commentSchema");
const { CommentBox } = require("../model/CommentBox");
const { Likers } = require("../model/likers");
const { Reply } = require("../model/replySchema");

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
  if (!prodPost) return res.status(404).send(`ba in id post nadarim`);
  return res.status(200).send(`innnnnno mikhay ${prodPost}`);
});
// --------------------MUTATE UNDER THE POST---------------------------------
router.put("/:_id", auth, async (req, res) => {
  const prodPost = await Product.findById({ _id: req.params._id });
  const embededUser = req.user;
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id product moshkel dare `);

  //-----------halate 1 -----------

  if (!prodPost) return res.send(`poost injori ba in id nadarim`);

  // ---------------------------LOAD LIKERS COMPONENT-------------------------

  let likers = await Likers.findById({ _id: prodPost.likedBy });

  // ---------------------------LOAD COMMENT BOX ATTACHED --------------------

  let commentBoxComponent = await CommentBox.findById({
    _id: prodPost.commentBoxId
  }).select("comments");

  //-----------------------LIKE PRODUCT BY FAWN--------------------------------

  if (req.body.like) {
    let found = likers.likedBy.filter(o => {
      if (o._id === embededUser._id) return o;
    });

    //-------------halate 2 unlike---

    if (found.length >= 1) {
      likers.likedBy.pull(embededUser);
      prodPost.likes--;
      likers.likes--;
      await likers.save();
      await prodPost.save();
      return res.send(`ghablan like kardi hala unlike`);
    }

    //-----------halate 3 like-------
    else {
      likers.likedBy.push(embededUser);
      prodPost.likes++;
      likers.likes++;
      await likers.save();
      await prodPost.save();
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
        _id: prodPost.commentBoxId
      },
      { $inc: { commentCount: 1 }, $push: { comments: comment } }
    );

    return res.status(200).send(`DONE -> Comment send.`);

    //---------------------LIKE COMMENT------------------------------------------------
  } else if (req.body.commentWork._id && req.body.commentWork.like) {
    if (!ObjectID.isValid(req.body.commentWork._id))
      return res.status(400).send(`id comment moshkel dare `);

    const commentFounded = commentBoxComponent.comments.filter(o => {
      if (o._id == req.body.commentWork._id) return o;
    });
    if (commentFounded.length == 0)
      return res.send("comment nist ya pak shode");

    const isLiked = commentFounded[0].likedBy.filter(o => {
      if (o._id == embededUser._id) return o;
    });
    if (isLiked.length == 0) {
      await CommentBox.updateOne(
        {
          _id: prodPost.commentBoxId,
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
      await CommentBox.updateOne(
        {
          _id: prodPost.commentBoxId,
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
  }
  // -------------------------- REPLAY COMMMENT----------------------------
  else if (req.body.commentWork._id && req.body.commentWork.replyComment) {
    if (!ObjectID.isValid(req.body.commentWork._id))
      return res.status(400).send(`id comment moshkel dare `);

    let reply = new Reply({
      reply_owner: embededUser,
      text: req.body.commentWork.replyComment,
      replyOf: req.body.commentWork._id
    });
    await CommentBox.updateOne(
      {
        _id: prodPost.commentBoxId,
        "comments._id": ObjectID(req.body.commentWork._id)
      },
      {
        $inc: { "comments.$.replyCount": 1 },
        $push: { "comments.$.replys": reply }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(200).send("Reply ersal shod");
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

    const commentFounded = commentBoxComponent.comments.filter(o => {
      if (o._id == req.body.commentWork._id) return o;
    });
    if (commentFounded.length == 0)
      return res.send("comment nist ya pak shode");
    const replyFound = commentFounded[0].replys.filter(o => {
      if (o._id == req.body.commentWork.replyWork._id) return o;
    });
    console.log("replyFoundsssssssssssssssssss", replyFound, "enddddddddddd");
    if (replyFound.length == 0) return res.status(400).send("Reply pak shode");

    const isLiked = replyFound[0].likedBy.filter(o => {
      if (o._id == embededUser._id) return o;
    });
    // console.log("replyFound", isLiked, "enddddddddddd");

    if (isLiked.length == 0) {
      const found1 = await CommentBox.findOneAndUpdate(
        {
          _id: prodPost.commentBoxId,
          "comments._id": ObjectID(req.body.commentWork._id),
          "comments.replys._id": ObjectID(req.body.commentWork.replyWork._id)
        },
        {
          $inc: { "comments.$[i].replys.$[j].likes": 1 },
          $push: { "comments.$[i].replys.$[j].likedBy": embededUser }
        },
        {
          arrayFilters: [
            { "i._id": ObjectID(req.body.commentWork._id) },
            { "j._id": ObjectID(req.body.commentWork.replyWork._id) }
          ],
          upsert: true,
          new: true
        }
      );
      // console.log("repoooooooooly", found1);

      res.status(200).send("Reply LIKED");
    } else {
      await CommentBox.findOneAndUpdate(
        {
          _id: prodPost.commentBoxId,
          "comments._id": ObjectID(req.body.commentWork._id),
          "comments.replys._id": ObjectID(req.body.commentWork.replyWork._id)
        },
        {
          $inc: { "comments.$[i].replys.$[j].likes": -1 },
          $pull: { "comments.$[i].replys.$[j].likedBy": embededUser }
        },
        {
          arrayFilters: [
            { "i._id": ObjectID(req.body.commentWork._id) },
            { "j._id": ObjectID(req.body.commentWork.replyWork._id) }
          ],
          upsert: true,
          new: true
        }
      );
      res.status(200).send("Reply UNLIKED");
    }
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

    const likers = new Likers({
      _id: prodPost.likers,
      downOf: prodPost._id,
      onModel: "Product",
      likedBy: []
    });
    try {
      new Fawn.Task()

        .save("Product", prodPost)

        .save("commentboxes", commentBox)

        .save("likers", likers)

        .update(
          "members",
          { _id: req.user._id },
          {
            $push: { prodPosts: prodPost._id },
            $inc: { prodPostNumber: 1 }
          }
        )
        // .options({)
        .run({ useMongoose: true });

      res.status(200).send("DONE");
    } catch (err) {
      console.log("errrrrrrrrrrrrr", err, "eeeeeeeeeee");
      res.status(500).send("SOMTHING IN SERVER WENT WRONG!!!!!!!!!");
    }
  }
});

module.exports = router;
