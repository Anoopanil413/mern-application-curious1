const mongoose = require('mongoose')



const messageSchema = new mongoose.Schema(
    {
      chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        index: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: {
        type: String,
        required: true,
      },
      isText:{
        type: Boolean,
        default: false,
      },
      isAudio: {
        type: Boolean,
        default: false,
      },
      isImage:{
        type: Boolean,
        default: false,
      }
    },
    {
      timestamps: true,
    }
  );


  module.exports = mongoose.model('messages',messageSchema)
  