import PostModel from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    res.status(400).json({
      message: `Post was not created ${err}`,
    });
  }
}

export const getPosts = async (req, res) => {
  try {
    const post = await PostModel.find().populate('user').exec();
    res.json(post);
  } catch (err) {
    res.status(400).json({
      message: `Posts wasn't found ${err}`,
    });
  }
}

export const getPost = (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
          if (err) {
            res.status(400).json({
              message: `Can't update post and return it ${err}`,
            });
          }
          if (!doc) {
            res.status(404).json({
              message: `Post wasn't found ${err}`,
            });
          }
          res.json(doc);
      }).populate('user');
  } catch (err) {
    res.status(404).json({
      message: `Post wasn't found ${err}`,
    });
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({
      id: postId,
    },
      (err, doc) => {
        if (err) {
          res.status(400).json({
            message: `Can't delete post and return it ${err}`,
          });
        }
        if (!doc) {
          res.status(404).json({
            message: `Post wasn't found ${err}`,
          });
        }
        res.json({

        });
      });
  } catch (err) {
    res.status(404).json({
      message: `Posts wasn't found ${err}`,
    });
  }
}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(postId);
    await PostModel.updateOne({
      id: postId
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });


    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: `Post was not updated ${err}`,
    });
  }
}
