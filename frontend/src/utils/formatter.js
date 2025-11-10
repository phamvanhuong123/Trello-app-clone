
export const capitalizeFirstLetter = (val) => {
    if (!val) return ''
    return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
  }
  
  /**
   * Example:
   */
  // const stringTest = 'phamvanhuong'
  // const capString = capitalizeFirstLetter(stringTest)
  
  // console.log('stringTest:', stringTest)
  // console.log('capString:', capString)
  /**
   * Results:
   * 
   * stringTest: Of course, nothing changes =))
   * capString: Phamvanhuong
   */
  export const genratePlaceholderCard = (column) =>{
    return {
      _id : `${column._id}-placeholder-card`,
      boardId: column.boardId, 
      columnId: column._id,
       FE_PlaceholderCard : true 
    }
  }

// Kĩ thuật css pointer-event để chặn user spam click tại bất kì chỗ nào có hành động click gọi api
// Cách sử dụng  : Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "intercepter-loading" cho nó là xong

export const intercepterLoadingElement =(calling) =>{
  const elements = document.querySelectorAll('.intercepter-loading')
  for (let i = 0; i < elements.length; i++){
    //nếu đang trong thời gian gọi api  (calling == true) thì sẽ làm mờ phần tử và chặn click
    if (calling){
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    }
    // Không làm gì cả
    else{
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}