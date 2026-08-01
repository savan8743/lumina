const ContactMessage = require('../models/ContactMessage');

exports.submitContactMessage = async (req, res) => {
    try {
        const message = new ContactMessage(req.body);
        const savedMessage = await message.save();
        res.status(201).json({ message: 'Message submitted successfully', data: savedMessage });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllMessagesAdmin = async (req, res) => {
    try {
        const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMessageStatus = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (message) {
            message.status = req.body.status || message.status;
            const updatedMessage = await message.save();
            res.json(updatedMessage);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (message) {
            await ContactMessage.deleteOne({ _id: message._id });
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
