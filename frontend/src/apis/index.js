import axios from "axios";
import { API_ROOT } from "utils/constants";

// Api board
export const fetchBoardDetailsAPIs = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
}
export const updateBoardDetailsAPIs = async (boardId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`,updateData)
    return response.data
}


// Api Column
export const createNewColumnApi = async (newColumnData) =>{
    const response = await axios.post(`${API_ROOT}/v1/columns`,newColumnData)
    return response.data
}
export const updateColumnDetailsAPIs = async (columnId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`,updateData)
    return response.data
}

//Api card
export const createNewCardApi = async (newCardData) =>{
    const response = await axios.post(`${API_ROOT}/v1/cards`,newCardData)
    return response.data
}