const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const clearCache = require('../middlewares/clearCache');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id
    });
    res.send(blogs);
    // const redis = require('redis');
    // const util = require('util');
    // const redisUrl = 'redis://127.0.0.1';

    // const client = redis.createClient(redisUrl);

    // const getCachedBlogs = util.promisify(client.get).bind(client);
    // const cachedBlogs = await getCachedBlogs(req.user.id);

    // if (cachedBlogs) {
    //   return res.send(JSON.parse(cachedBlogs));
    // }

    // const blogs = await Blog.find({ _user: req.user.id });

    // res.send(blogs);

    // client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, clearCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
