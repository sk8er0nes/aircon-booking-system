const BASE_API_URL="https://api.jsonbin.io/v3";
const BIN_ID = "6ac7386bac6210605a1ea361"

async function fetchData(binID) {
    const response = await axios.get(`${BASE_API_URL}/b/${binID}/latest`);
    return response.data.record;
}

async function saveData(binID, data) {
    const response = await axios.put(`${BASE_API_URL}/b/${binID}`, data );
    //console.log(response);
}

// async function saveJSON(data) {
//     const response = await axios.put('booking.json',data);
//     //return response.data;
//     console.log(response);
// }
