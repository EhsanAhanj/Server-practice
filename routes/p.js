const express = require("express");
const router = express.Router();
const { Producte } = require("../model/p_model");
const { Member } = require("../model/Member");

router.get("/", async (req, res) => {
  const { clientId, desc, category, tags } = req.body;
  const owner = await Member.find({ clientId });

  if (!owner) console.log(owner, "sahab nadare");

  let product_post = new Producte({
    owner_id: owner[0]._id,
    owner_clientId: owner[0].clientId,
    desc,
    tags,
    category
  });

  product_post = await product_post.save();
  if (product_post) {
    res.status(200).send(product_post);
    //console.log(product_post.id);
    await Member.findOneAndUpdate(
      { _id: owner[0]._id },
      {
        $push: { post: product_post._id }
      }
    );
  } else res.send("mahsool post nasho");
});

module.exports = router;
