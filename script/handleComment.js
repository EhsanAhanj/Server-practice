const { Comment } = require("../model/commentSchema");
const { CommentBox } = require("../model/CommentBox");
//---------------------COMMMENT--------------------------
async function handelComment(text, commentBoxId, embededUser) {
  const comment = new Comment({
    comment_owner: embededUser,
    text
  });
  await CommentBox.updateOne(
    {
      _id: commentBoxId
    },
    { $inc: { commentCount: 1 }, $push: { comments: comment } }
  );

  return `DONE -> Comment send.`;
}
module.exports.handelComment = handelComment;
