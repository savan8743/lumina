const FAQ = require('../models/FAQ');

exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllFAQsAdmin = async (req, res) => {
    try {
        const faqs = await FAQ.find({}).sort({ order: 1, createdAt: 1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createFAQ = async (req, res) => {
    try {
        const faq = new FAQ(req.body);
        const createdFaq = await faq.save();
        res.status(201).json(createdFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            faq.question = req.body.question || faq.question;
            faq.answer = req.body.answer || faq.answer;
            faq.order = req.body.order !== undefined ? req.body.order : faq.order;
            faq.isActive = req.body.isActive !== undefined ? req.body.isActive : faq.isActive;
            
            const updatedFaq = await faq.save();
            res.json(updatedFaq);
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            await FAQ.deleteOne({ _id: faq._id });
            res.json({ message: 'FAQ removed' });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
