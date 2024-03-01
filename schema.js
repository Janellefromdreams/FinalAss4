const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = 'mongodb+srv://Zhanel:Alivemax1@cluster0.m1v3wsa.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0';

    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const collection = mongoose.model('User', new mongoose.Schema({
    name: String,
    password: String
}));

const carouselSchema = new mongoose.Schema({
    urls: [String],
    name: String,
    description: String
});

const Carousel = mongoose.model('Carousel', carouselSchema);

const updateCarousel = async (id, newData) => {
    try {
        const result = await collection.findOneAndUpdate(
            { _id: id },
            { $set: newData },
            { new: true }
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

carouselSchema.statics.updateCarousel = async function(id, { urls, name, description }) {
    try {
        const updatedCarousel = await this.findByIdAndUpdate(id, { urls, name, description }, { new: true });
        return updatedCarousel;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update carousel");
    }
};

module.exports = { connectDB, collection, updateCarousel, Carousel };
