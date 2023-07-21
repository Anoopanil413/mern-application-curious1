import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Grid, IconButton, Stack, TextField, Typography, Drawer, Card, CardContent, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoodIcon from '@mui/icons-material/Mood';
import ChatUserList from './ChatUserList';
import { useSelector } from 'react-redux';
import { socket } from '../../socket'

const ChatPageComponent = () => {
    const messages = [
        { text: 'Hello', sender: true },
        { text: 'Hi there!', sender: false },
        { text: 'How are you?', sender: true },
        { text: 'I\'m good, thanks!', sender: false },
        { text: 'What have you been up to?', sender: true },
        { text: 'Just working on a new project.', sender: false },
        { text: 'Hello', sender: true },
        { text: 'Hi there!', sender: false },
        { text: 'How are you?', sender: true },
        { text: 'I\'m good, thanks!', sender: false },
        { text: 'What have you been up to?', sender: true },
        { text: 'Just working on a new project.', sender: false },
        { text: 'Hello', sender: true },
        { text: 'Hi there!', sender: false },
        { text: 'How are you?', sender: true },
        { text: 'I\'m good, thanks!', sender: false },
        { text: 'What have you been up to?', sender: true },
        { text: 'Just working on a new project.', sender: false },
        { text: 'Hello', sender: true },
        { text: 'Hi there!', sender: false },
        { text: 'How are you?', sender: true },
        { text: 'I\'m good, thanks!', sender: false },
        { text: 'What have you been up to?', sender: true },
        { text: 'Just working on a new project.', sender: false },
        { text: 'How are you?', sender: true },
        { text: 'I\'m good, thanks!', sender: false },
        { text: 'What have you been up to?', sender: true },
        { text: 'Just working on a new project.', sender: false },
        { text: 'Hello', sender: true },
        { text: 'Hi there!', sender: false },
        { text: 'How are you?', sender: true },
        { text: 'I\'m good, thanks!', sender: false },
        { text: 'What have you been up to?', sender: true },
        { text: 'Just working on a new project.', sender: false },
        // Add more test messages as needed
    ];

    const [inputValue, setInputValue] = useState('');
    const [selectedChat, setselectedChat] = useState(false)
    const [chatDataId, setchatDataId] = useState('')
    const [mySocketId, setmySocketId] = useState(undefined)

    const chatDataState = useSelector(state => state.connection)


    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendClick = () => {
        if (inputValue.trim() !== '') {
            const chatData = {
                chatDataId,
                inputValue
            }
            socket.emit('send message', chatData)
            setInputValue('');
        }
    };

    const handleAudioRecordClick = () => {
        console.log('Recording audio...');
    };

    const handleMediaUploadClick = () => {
        console.log('Uploading media...');
    };

    const handleEmojiClick = () => {
        console.log('Opening emoji picker...');
    };

    useEffect(() => {
        socket.on("connected", (arg) => {
            console.log("this is my first return from socket and this isthe socket id", arg);
            setmySocketId(arg)
        })
        socket.on("receive Message", (messageData, socketId) => {
            // if (socketId !== mySocketId) {
            //   console.log("Received message:", messageData);
            // //   displayReceivedMessage(messageData);
            // }
            console.log("ddddddddddddd", socketId)
            console.log("Received message:", messageData);

        });

    })

    useEffect(() => {
        if (chatDataState?.chatData) {

            if (chatDataState.chatData.length === 0) {
                console.log("Hey Chat data empty", chatDataState.chatData)
                setselectedChat(true)
            } else {
                console.log("Hey Chat data is not empty", chatDataState?.chatData[0]?._id)
                setselectedChat(false)

                setchatDataId(chatDataState?.chatData[0]?._id)
            }
        }


    }, [chatDataState.chatData])



    return (
        <>

            <Grid container spacing={2} display='flex' justifyContent='center'>

                <Grid item xs={11} sm={11} md={2} lg={2} xl={2} m={1} marginTop={2}  >
                    <Box
                        sx={{
                            border: '1px solid red',
                            height: '98%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: "0px 0px 9px "

                        }}
                    >


                        <ChatUserList />
                    </Box>
                </Grid>

                <Grid container item xs={12} sm={12} md={8} lg={8} xl={8} m={1} marginTop={2}>

                    <Box
                        sx={{
                            borderBottom: '1px solid red',
                            height: '90%',
                            width: '60%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: "0px 0px 9px ",
                            position: 'absolute'

                        }}
                    >
                        <Box
                            sx={{
                                margin: 2

                            }}
                        >
                            <Avatar>

                            </Avatar>

                        </Box>



                        <Box
                            sx={{
                                flex: '1',
                                display: 'flex',
                                borderBottom: '5px solid black',
                                flexDirection: 'column',
                                height: '100%',
                                padding: '10px',
                                position: 'relative',
                                overflowY: 'auto',
                                position: 'relative',
                                backgroundColor: '#f0eee9'
                            }}
                        >

                            {messages.map((message, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.sender ? 'flex-end' : 'flex-start',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: message.sender ? '#333' : '#FFFFFF',
                                            color: message.sender ? '#FFFFFF' : '#333333',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            maxWidth: '70%',
                                        }}
                                    >
                                        <Typography variant="body1">{message.text}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            {selectedChat &&
                                <Box border={2}>
                                    <Typography>
                                        Chatttttttttt
                                    </Typography>
                                </Box>

                            }
                        </Box>
                        <Grid container
                            sx={{
                                border: '1px solid blue',
                                width: '100%',
                                display: 'flex',
                                overflow: 'none',
                                alignItems: 'center',
                                justifyContent: 'start',
                                padding: '10px',
                            }}

                        >

                            <Grid item xs={1}>
                                <Button onClick={handleEmojiClick}>
                                    <MoodIcon />
                                </Button>

                            </Grid>

                            <Grid item xs={8}>


                                <TextField
                                    label="Type a message"
                                    value={inputValue}
                                    fullWidth
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    sx={{ flex: '1', marginRight: '10px' }}
                                />
                            </Grid>
                            <Grid item xs={1} >
                                <Grid sx={{ display: 'flex' }}>
                                    <Button sx={{

                                        backgroundColor: 'transparent',
                                        borderRadius: '2rem',
                                        '&:hover': {
                                            backgroundColor: 'black'
                                        }
                                    }}
                                        onClick={handleAudioRecordClick}>
                                        <MicIcon />
                                    </Button>
                                    <Button onClick={handleMediaUploadClick}>
                                        <AttachFileIcon />
                                    </Button>

                                    <Button variant="contained" onClick={handleSendClick} fullWidth endIcon={<SendIcon />} sx={{ height: '3rem', px: 8 }}>
                                        Send
                                    </Button>

                                </Grid>
                            </Grid>


                        </Grid>


                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default ChatPageComponent