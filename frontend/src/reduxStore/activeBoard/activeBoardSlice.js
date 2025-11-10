import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from 'utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from 'utils/constants'
import { genratePlaceholderCard } from 'utils/formatter'
import { mapOrder } from 'utils/sort'

// Khởi tạo giá trị ban đầu
const initialState = {
    currentActiveBoard : null
}

// Những hành động gọi api (bất đồng bộ) và cật nhật dữ liệu vào redux, dùng middiware createAsyncthunk đi kèm với extraReducer
export const fetchBoardDetailApi = createAsyncThunk(
  'activeBoard/fetchBoardDetailApi',
  async (boardId) =>{
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)




// Khởi tạo slice trong kho lưu trữ trong redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
    //Nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, actions) => {
      const board = actions.payload
      console.log(board)
      //Xử lí dữ liệu nếu cần thiết

      //Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
   
  },
  //Nơi xử lí dữ liệu bất đồng bộ
  extraReducers : (buider) =>{
    buider.addCase(fetchBoardDetailApi.fulfilled, (state,action)=>{
        //aciton.payload là response.date của fetchBoardDetailApi
        let board = action.payload

        //Xử lí dữ liệu nếu cần thiết
        // Xắp xếp thứ tự column ở đây
              board.data.columns = mapOrder(
                board?.data.columns,
                board?.data.columnOrderIds,
                "_id"
              );
              // Xử lí kéo thả vào một column rỗng
              board.data.columns.forEach((column) => {
                if (isEmpty(column.cards)) {
                  column.cards = [genratePlaceholderCard(column)];
                  column.cardOrderIds = [genratePlaceholderCard(column)._id];
                } else {
                  // Xắp xếp thứ tự card ở đây
                  column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
                }
              });
        //Update lại dữ liệu của currentActiveBoard
        state.currentActiveBoard = board.data
        

    })
  }
})

// Actions là nơi dành cho các component bên dưới gọi bằng dispath() tới để cật nhật lại dữ liệu thông qua reducer (Chạy đồng bộ)
//Actions sẽ được tự động tạo ra từ thằng redux
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector là nơi dành cho các component lấy dữ liệu ra từ redux store bằng cách gọi useSelector
export const selectCurrentActiveBoard = (state)=> {
    return state?.activeBoard?.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer