const axios = require('axios');

const getCarPhoto = async (brand, model) => {
    try {
        const res = await axios.get('https://api.pexels.com/v1/search', {
            params: { query: `${brand} ${model} car`, per_page: 1 },
            headers: { Authorization: process.env.PEXELS_KEY }
        });
        return res.data.photos[0]?.src.large || `https://loremflickr.com/800/600/${brand},car`;
    } catch (e) {
        return `https://loremflickr.com/800/600/${brand},car`;
    }
};

module.exports = { getCarPhoto };