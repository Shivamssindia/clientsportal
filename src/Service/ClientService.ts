import { Client } from "@/type/ClientType";
import axios from "axios";


const ragisterClient = async ( client: Client) => {
    try {
        const response = await axios.post(
        "https://converted-affair-transactions-indicator.trycloudflare.com/api/client/apply",
        client,
        {
            withCredentials: true,
        }
    );
    console.log(response.data);
    localStorage.setItem("clientData", JSON.stringify(response.data));
    } catch (error) {
        console.error("❌ Client Registration Error:", error);
        throw error;
    }
};

export const getAllClients = async () => {
    try {
        const response = await axios.get(
        "https://converted-affair-transactions-indicator.trycloudflare.com/api/client/all",
        {
            withCredentials: true,
        }
    );
    console.log(response.data);
    return response.data;
    } catch (error) {
        console.error("❌ Fetch Clients Error:", error);
        throw error;
    }
};

export const getClientById = async (id: number) => {
    try {
        const response = await axios.get(
        `https://converted-affair-transactions-indicator.trycloudflare.com/api/client/${id}`,
        {
            withCredentials: true,
        }
    );
    console.log(response.data);
    return response.data;
    } catch (error) {
        console.error("❌ Fetch Client Error:", error);
        throw error;
    }
};

export const updateClient = async (id: number, client: Client) => {
    try {
        const response = await axios.put(
        `https://converted-affair-transactions-indicator.trycloudflare.com/api/client/${id}`,
        client,
        {
            withCredentials: true,
        }
    );
    console.log(response.data);
    return response.data;
    } catch (error) {
        console.error("❌ Update Client Error:", error);
        throw error;
    }
};


export default {
    ragisterClient,
    getAllClients,
    getClientById,
    updateClient,
};