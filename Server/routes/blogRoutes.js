const express = require('express')
const router = express.Router()
const {PostBlog,getBlog,getALLBlogs} = require('../controllers/blog')
const {upload} = require('../utils/multerConfig')
const {verifyToken} = require('../controllers/verifyToken')



router.post('/createBlog',upload.single('coverImage'),verifyToken,PostBlog)
router.get('/getBlog/:_id',verifyToken,getBlog)
router.get('/getAllBlog',verifyToken,getALLBlogs)





module.exports = router