const BASE_API_URL = "https://api.jsonbin.io/v3";
const API_KEY = "$2a$10$gqLBVhUKBYMi0xRHIv1iMeXtcjkjZKVj8dU.I7sg7nMEpcNA.bl1K";
// let BIN_ID = "6aca1142ac6210605a250a6a";

function setBinID(binID) {
    localStorage.setItem('BIN_ID', binID);
}

function getBinID() {
    const binID = localStorage.getItem('BIN_ID');
    if (binID === null) {
        return "";
    } else {
        return binID
    }
}

async function getData() {
    const binID = getBinID();    
    if (binID === "") {
        return [];        
    } else {
        response = await getBin(binID);
        if (response.status === 200) {
            return response.data.record;
        } else if (response.status === 404) {
            setBinID("")
        }
    }
}

async function saveData(data) {
    const binID = getBinID();
    if (data.length !== 0) {
        if (binID === "") {
            response = await createBin(data);
            if (response.status === 200) {
                if (response.data.metadata.id !== "") {
                    setBinID(response.data.metadata.id);
                }
            }
        } else {
            response = await updateBin(binID, data);
        }
    } else {
        if (binID !== "") {
            response = await deleteBin(binID);
            if (response.status === 200) {
                setBinID("");
            }
        }
    }
}

async function createBin(data) {
    try {
        const response = await axios.post(`${BASE_API_URL}/b`, data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": `${API_KEY}`,
                    "X-Bin-Name": "Aircon Service Booking"
                }
            }
        );
        return response;

    } catch (error) {
        return error.response;
    }
}

async function getBin(binID) {
    try {
        const response = await axios.get(`${BASE_API_URL}/b/${binID}/latest`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": `${API_KEY}`
                }
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}

async function updateBin(binID,data) {
    try {
        const response = await axios.put(`${BASE_API_URL}/b/${binID}`, data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": `${API_KEY}`
                }
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }

}

async function deleteBin(binID) {
    try {
        const response = await axios.delete(`${BASE_API_URL}/b/${binID}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": `${API_KEY}`
                }
            }
        );
        return response;

    } catch (error) {
        return error.response;
    }

}