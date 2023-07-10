const express = require('express')
const router = express.Router()
const {PostBlog,getBlog,getALLBlogs,getUserBlogs
    ,MakeBlogComment,getBlogComment,getSearchContent} = require('../controllers/blog')
const {upload} = require('../utils/multerConfig')
const {verifyToken} = require('../controllers/verifyToken')



router.post('/createBlog',upload.single('coverImage'),verifyToken,PostBlog)
router.get('/getBlog/:_id',verifyToken,getBlog)
router.get('/getAllBlog',verifyToken,getALLBlogs)
router.get('/getBlogComment/:blogId',verifyToken,getBlogComment)
router.get('/getSearchContent/:searchText',verifyToken,getSearchContent)

//getting all the blogs related to user
router.get('/getUserBlogs',verifyToken,getUserBlogs)

//getting comments


//setting new comments
router.post('/MakeBlogComment',verifyToken,MakeBlogComment)




module.exports = router