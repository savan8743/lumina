const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FAQ = require('./models/FAQ');
const Review = require('./models/Review');
const Settings = require('./models/Settings');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const faqs = [
  {
    question: "What makes Lumina Naturals different?",
    answer: "Lumina Naturals uses a proprietary cold-filtration process that preserves the micro-fractions of the protein while removing 99.9% of lactose, fat, and carbs. It's also third-party tested for purity and contains zero artificial sweeteners.",
    order: 1
  },
  {
    question: "Is it suitable for lactose intolerant individuals?",
    answer: "Yes! Because it is a highly purified isolate, it contains virtually zero lactose. Furthermore, we've added a custom blend of digestive enzymes to ensure smooth digestion.",
    order: 2
  },
  {
    question: "When is the best time to take your supplements?",
    answer: "For optimal muscle recovery, we recommend taking one scoop within 30 minutes after your workout. It's also great as a meal replacement or morning smoothie base.",
    order: 3
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship to the US, Canada, UK, and Australia. We are actively working on expanding our logistics to support worldwide shipping by late 2026.",
    order: 4
  }
];

const reviews = [
  {
    name: "Alex Thompson",
    role: "Professional Athlete",
    content: "The cleanest protein I've ever used. The Chocolate Fudge flavor mixes perfectly with zero clumps, and my recovery time has noticeably improved since switching.",
    rating: 5,
    isApproved: true
  },
  {
    name: "Sarah Jenkins",
    role: "Fitness Coach",
    content: "I recommend Lumina to all my clients. The transparency in their labeling and the lack of artificial sweeteners makes it a massive winner.",
    rating: 5,
    isApproved: true
  },
  {
    name: "Marcus Chen",
    role: "CrossFit Competitor",
    content: "Finally, a protein powder that doesn't cause bloating. The Vanilla Bean is incredible for my morning oats and smoothies.",
    rating: 5,
    isApproved: true
  }
];

const categories = [
  { name: 'Protein', slug: 'protein', description: 'Protein powders and bars', isActive: true },
  { name: 'Pre-Workout', slug: 'pre-workout', description: 'Energy and focus supplements', isActive: true }
];

const productsData = [
  {
    name: "Whey Isolate - Chocolate Fudge",
    description: "Ultra-filtered premium whey isolate for maximum absorption.",
    price: 49.99,
    discount: 20,
    rating: 4.9,
    numReviews: 1240,
    tags: ["Best Seller", "New Formula"],
    sku: "WHEY-ISO-CHOC",
    stock: 100,
    isFeatured: true
  },
  {
    name: "Whey Isolate - Vanilla Bean",
    description: "Smooth, natural vanilla flavor. Perfect for smoothies.",
    price: 49.99,
    rating: 4.8,
    numReviews: 890,
    tags: ["High Protein"],
    sku: "WHEY-ISO-VAN",
    stock: 50,
    isFeatured: true
  },
  {
    name: "Pre-Workout - Blue Raspberry",
    description: "Explosive energy and laser focus without the crash.",
    price: 34.99,
    discount: 14.3,
    rating: 4.7,
    numReviews: 560,
    tags: ["Energy"],
    sku: "PRE-BLUE-RASP",
    stock: 200,
    isFeatured: true
  }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/protin');
        console.log('MongoDB Connected...');

        // Clear existing data for these specific collections
        await FAQ.deleteMany({});
        await Review.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        
        // Seed FAQs
        await FAQ.insertMany(faqs);
        console.log('FAQs seeded.');

        // Seed Reviews
        await Review.insertMany(reviews);
        console.log('Reviews seeded.');

        // Seed Categories and Products
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories seeded.');

        const proteinCat = createdCategories.find(c => c.slug === 'protein');
        const preworkoutCat = createdCategories.find(c => c.slug === 'pre-workout');

        productsData[0].category = proteinCat._id;
        productsData[1].category = proteinCat._id;
        productsData[2].category = preworkoutCat._id;

        await Product.insertMany(productsData);
        console.log('Products seeded.');

        // Setup Settings
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({
                websiteName: "Lumina Naturals",
                contactDetails: {
                    email: "support@luminanaturals.com",
                    phone: "+1 (800) 123-4567",
                    address: "123 Wellness Ave, NY 10012"
                }
            });
            await settings.save();
            console.log('Settings created.');
        } else {
            settings.websiteName = "Lumina Naturals";
            settings.contactDetails = {
                email: "support@luminanaturals.com",
                phone: "+1 (800) 123-4567",
                address: "123 Wellness Ave, NY 10012"
            };
            await settings.save();
            console.log('Settings updated.');
        }

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
