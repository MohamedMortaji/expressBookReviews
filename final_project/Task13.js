const axios = require('axios').default;
let prompt = require('prompt-sync')();

async function GetBooks() {
    let title = prompt('Input the title of the book:');
    let url = 'http://localhost:5000/title/'+ title;
    try {
        const resp = await axios.get(url);
        console.log(JSON.stringify(resp.data, null, 4));
    } catch (err) {
        console.error("Error fetching books:", err.toString());
    }
};
GetBooks();