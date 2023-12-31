import React, { useEffect, useRef, useState } from 'react'
import MyAppBar from '../AppBar/MyAppBar'
import { Box, Button, Divider, FormControl, FormControlLabel, Grid, Icon, IconButton, InputLabel, Paper, TextField, Typography } from '@mui/material'
import Editor from '../ReactQuill/Editor';
import SearchBar from '../SearchBar/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { setSummary, setTags, setTitle, setBlog, resetBlogState, createBlog, resetSateAfterFetch, saveBlogAsDraft, getAllDraftedBlogs, setCoverImage, deleteSavedDrafts } from '../../features/user/blogCreateSlice';
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../baseAPI/axiosBaseURL';
import BlogDraftPages from './BlogDraftPages';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useNavigate } from 'react-router-dom';
import EditEditor from '../ReactQuill/EditEditor';
import BlogCreateLoader from '../BlogLoaders/BlogCreateLoader';
import ImagePreview from '../ImagePreview/ImagePreview';

import Checkbox from '@mui/material/Checkbox';



function CreateBlog() {


    const fileInput = useRef(null)
    const dispatch = useDispatch()
    const BlogState = useSelector(state => state.blogCreateState)
    const [prevState, SetPrevState] = useState(false)
    const [htmlContent, setHtmlContent] = useState('');
    const [intersets, setInterests] = useState([]);
    const [tags, setTagings] = useState([]);
    const navigate = useNavigate()
    const [EditDraftblog, setEDitDraftState] = useState(false)

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {

        setIsChecked(event.target.checked);
    };


    const toastStyle = {
        background: 'white',
        color: 'red',
        width: 'auto',
    };





    const HandleTags = (values) => {
        dispatch(setTags(values))
    }




    const savingBlogAsDraft = () => {

        if (BlogState?.Title || BlogState?.summary || BlogState?.content) {
            if (fileInput.current.files.length !== 0) {
                const blogData = new FormData();
                blogData.append('title', BlogState.Title);
                blogData.append('summary', BlogState.summary);
                blogData.append('content', BlogState.content);
                blogData.append('tags', BlogState?.tags)

                const file = fileInput.current.files[0];
                if (file && file.type.startsWith('image/')) {
                    blogData.append('coverImage', file, file?.name);
                } else {
                    return toast.error("Ivalid image format!");
                }
                dispatch(saveBlogAsDraft(blogData))


            } else {
                const blogData = new FormData();

                blogData.append('title', BlogState?.Title);
                blogData.append('summary', BlogState?.summary);
                blogData.append('content', BlogState?.content);
                blogData.append('tags', BlogState?.tags)
                dispatch(saveBlogAsDraft(blogData))
            }
        } else {
            toast.error("Enter some more informations")

        }
        dispatch(resetBlogState())

    }





    const handleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        const errors = {};

        if (!BlogState.Title) {
            isValid = false;
            errors.title = 'Title is required';
        }

        if (!BlogState.summary) {
            isValid = false;
            errors.summary = 'Summary is required';
        }
        if (!BlogState.tags || BlogState.tags.length === 0) {
            isValid = false;
            errors.tags = 'please tag a related field!'
        }


        if (!BlogState.content) {
            isValid = false;
            errors.content = 'Content is required';
        }

        if (fileInput.current.files.length === 0 && !BlogState?.coverImage) {
            isValid = false;
            errors.file = 'File is required';
        }

        if (!isValid) {
            console.log('Validation errors:', errors);
            Object.values(errors).forEach((errorMsg) => {
                toast.error(errorMsg);
            });

            return;
        }

        const blogData = new FormData();
        blogData.append('title', BlogState.Title);
        blogData.append('summary', BlogState.summary);
        blogData.append('content', BlogState.content);
        blogData.append('tags', BlogState.tags)
        blogData.append('subscription', isChecked)


        const file = fileInput.current.files[0];
        if (Object.keys(BlogState?.coverImage).length > 0) {
            blogData.append('coverImage', BlogState?.coverImage);
        } else if (file && file.type.startsWith('image/')) {
            blogData.append('coverImage', file, file?.name);
        } else {
            toast.error("Ivalid image format!");

        }

        if (EditDraftblog) {
            dispatch(deleteSavedDrafts(BlogState?.creatingBlog[0]?._id))
            setEDitDraftState(false)
        }

        dispatch(createBlog(blogData))
    }

    const handleResumeEditingDraft = () => {
        if (BlogState?.creatingBlog.length > 0) {
            setEDitDraftState(true)
            if (BlogState.creatingBlog[0]?.title) {
                dispatch(setTitle(BlogState.creatingBlog[0]?.title))
            }
            if (BlogState.creatingBlog[0]?.summary) {
                dispatch(setSummary(BlogState.creatingBlog[0]?.summary))
            }
            if (BlogState.creatingBlog[0]?.tags) {
                const savedTags = BlogState.creatingBlog[0]?.tags
                console.log(" tagings", savedTags)
                const tagings = savedTags[0].split(",").map(tag => tag.trim())
                console.log("my previous tagings", tagings)
                dispatch(setTags(tagings))
            }
            if (BlogState.creatingBlog[0]?.coverImage) {
                dispatch(setCoverImage(BlogState.creatingBlog[0]?.coverImage))
            }
        } else {
            toast.warning('No Drafts!!')
        }
    }

    const handleNavigatePagetoStories = () => {
        navigate('/user/stories')
    }




    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await axiosInstance.get('/user/interests');
                const data = response.data;
                setInterests(data.fileds)
                const names = data.fileds?.map((field) => {
                    const nam = field.name
                    return nam
                }) || [];

                setTagings((tags) => [...new Set([...tags, ...names])]);
            } catch (error) {
                console.error('Error fetching interests:', error);
            }
        };

        fetchInterests();

        dispatch(getAllDraftedBlogs())

        const userObject = BlogState?.user
        function isObjectNotEmpty(userObject) {
            return Object.keys(userObject).length > 0;
        }
        const isuserObjectEmpty = isObjectNotEmpty(userObject)

        if (BlogState.createSuccess && isuserObjectEmpty) {
            localStorage.setItem('user', JSON.stringify(BlogState.user))
            dispatch(resetBlogState())
            toast.success('Hurray!Blog published!')
            setTimeout(() => {
                navigate('/user/home')
            }, 1000)
        }

    }, [BlogState.createSuccess, BlogState?.draftSuccess, isChecked])




    return (
        <>
            <Grid container spacing={2}>
                <MyAppBar />
                <Grid item xs={12} sm={10} md={7} lg={8} sx={{ mx: 'auto', mt: 6 }}>
                    {prevState ? <div><div className='preview' dangerouslySetInnerHTML={{ __html: htmlContent }}>

                    </div><Button onClick={() => SetPrevState(false)}>Edit</Button></div> :
                        <Box >
                            <Box display={'flex'} justifyContent={'space-between'} >
                                <Box display={'flex'} alignItems={'flex-start'} gap={2}>
                                    <Box   >
                                        <IconButton onClick={handleResumeEditingDraft}>
                                            <Typography  >Drafts</Typography>
                                            <ChevronRightOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                    <Box >
                                        <IconButton onClick={handleNavigatePagetoStories}>
                                            <Typography>Stories</Typography>
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box display={'flex'} alignItems={'flex-end'} >
                                    <Box >
                                        <Button onClick={savingBlogAsDraft} sx={{ border: '1px solid black' }}>Save Changes</Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ padding: 2, marginBottom: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant='h4'>Start writing</Typography>

                            </Box>


                            <Paper>

                                <form onSubmit={handleSubmit}>
                                    <Box sx={{ m: 5 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                                            label="Publish as premium"
                                        />
                                        <FormControl fullWidth>
                                            <TextField
                                                fullWidth
                                                value={BlogState.Title}
                                                InputProps={{
                                                    style: {
                                                        fontSize: '2rem',
                                                        fontWeight: 'bold',
                                                    }
                                                }}
                                                label="Title"
                                                id="title"
                                                multiline
                                                onChange={(e) => dispatch(setTitle(e.target.value))}
                                                sx={{ m: 2 }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <TextField
                                                fullWidth
                                                value={BlogState.summary}
                                                label="Summary"
                                                id="Summary"
                                                multiline
                                                onChange={(e) => dispatch(setSummary(e.target.value))}
                                                sx={{ m: 2 }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <TextField
                                                type="file"
                                                inputRef={fileInput}
                                                id="file"
                                                sx={{ m: 2, maxWidth: 250 }}
                                            />
                                            <InputLabel htmlFor="file" shrink>
                                                Cover Image
                                            </InputLabel>
                                            {EditDraftblog &&
                                                <Box sx={{ marginLeft: '1rem' }}>
                                                    <ImagePreview image={BlogState?.coverImage} />
                                                </Box>

                                            }

                                            <SearchBar tags={tags} handleTagValues={HandleTags} ></SearchBar>

                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 2 }}>
                                            {!EditDraftblog ? <Editor /> : <EditEditor />}
                                        </FormControl>


                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            {/* <Button type="button" variant="contained" color="primary" onClick={handlePreview} sx={{ ml: 2 }}>
                                                Preview
                                            </Button> */}
                                            <Button type="submit" variant="contained" color="primary" disabled={BlogState?.createSuccess} sx={{ ml: 2, width: '30%' }}>
                                                {BlogState?.loading ? <BlogCreateLoader loading={BlogState?.loading} /> : "Submit"}
                                            </Button>
                                        </Box>

                                    </Box>
                                </form>
                            </Paper>
                        </Box>
                    }
                </Grid>
                <ToastContainer toastStyle={toastStyle} />
                {BlogState?.creatingBlog.length > 0 &&
                    <Box onClick={handleResumeEditingDraft}>
                        <BlogDraftPages blogDraft={BlogState?.creatingBlog} />

                    </Box>
                }

            </Grid >

        </>
    )
}

export default CreateBlog