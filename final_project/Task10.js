const axios = require('axios').default;

async function GetBooks(url) {
    try {
        const resp = await axios.get(url);
        console.log(JSON.stringify(resp.data, null, 4)); // resp.data contains the response body
    } catch (err) {
        console.error("Error fetching books:", err.toString());
    }
};
GetBooks('http://localhost:5000/');