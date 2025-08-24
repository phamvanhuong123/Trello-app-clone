import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import {
  DndContext,
  useSensor,
  useSensors,
  // TouchSensor,
  // MouseSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
 
} from "@dnd-kit/core";
import { cloneDeep, isEmpty } from "lodash";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "utils/sort";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { genratePlaceholderCard } from "utils/formatter";
import { MouseSensor, TouchSensor} from 'customLibraries/dndKitSensors'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};
function BoardContent({ board }) {
  // Yêu cầu chuột di chuyển 10px mới bắt sự kiện onDragEnd,fix cái trường chỉ click gọi event
  // Nếu dùng pointerSensor thì phải dùng với touch-action : 'none' ở những component kéo thả
  // const pointerSenser = useSensor(PointerSensor,{
  //   activationConstraint : {
  //     distance : 10
  //   }
  // });
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });
  // const sensors = useSensors(pointerSenser);

  // Ưu tiên sử dụng mouse và touch
  const sensors = useSensors(mouseSensor, touchSensor);

  // const orderedColumn = mapOrder(board?.columns,board?.columnOrderIds,'_id')
  const [orderedColumn, setOrderedColumn] = useState([]);
  // CÙng một thời điểm chỉ có 1 phần tử được kéo(Card or Column)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard,setOldColumnWhenDraggingCard] = useState(null);
  
  //điểm va chạm cuối cùng trước đó (Xử lí thuật toán phát hiện va chạm)
  const lastOverId = useRef(null);
  // Đoạn này cần lưu ý nên dùng .cards thay vì .CardOrderIds vì ở bướcc handleDragOver sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo cardOrderIds mới
  const findColumnByCardId = (cardId) => {
    return orderedColumn.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };
  //function cật nhật lại state trong trường hợp du chuyển card giữa 2 column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData

  )=>{
    setOrderedColumn((prevColumns) => {
      // Tìm index của overCard trong column đích(nơi activeCard sẽ được thả)
      const overCardIndex = overColumn.cards?.findIndex(
        (card) => card._id === overCardId
      );

      // Logic tính toán cardIndex mới (Trên hoặc dưới overCard) code của thư viện
      let newIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards.length + 1;

      // Clone mảng OrderedColumnState cũ ra một cái mới để xử lí data rồi return - cật nhật lại orderedColumnState mới
      const nextColumn = cloneDeep(prevColumns);
      const nextActiveCloumn = nextColumn.find(
        (column) => column._id === activeColumn._id
      );
      
      const nextOverCloumn = nextColumn.find(
        (column) => column._id === overColumn._id
      );
      // column cũ
      if (nextActiveCloumn) {
        // Xoá card ở column đang đang kéo
        nextActiveCloumn.cards = [...nextActiveCloumn.cards].filter(
          (card) => card._id !== activeDraggingCardId
        );
        //Thêm placeholder card nếu column bị rỗng : Bị kéo hết card ,không còn cái nào nữa 
        if(isEmpty(nextActiveCloumn.cards)){
          nextActiveCloumn.cards = [genratePlaceholderCard(nextActiveCloumn)]
        }

        // Cật nhật lại cardOrderIds
        nextActiveCloumn.cardOrderIds = [...nextActiveCloumn.cards].map(
          (card) => card._id
        );
      }
      // Column moi
      if (nextOverCloumn) {
        // Kiểm tra xem card đang kéo có đang tồn tại ở overColumn hay chưa, nếu có thì xoá nó trước.
        nextOverCloumn.cards = [...nextOverCloumn.cards].filter(
          (card) => card._id !== activeDraggingCardId
        );
        // Cật nhật lại columnId của card vừa mời chuyển.
        // cật nhật lại dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebult_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId : nextOverCloumn._id
        }
        // Thêm card đang kéo vào overColumn
        nextOverCloumn.cards = nextOverCloumn.cards.toSpliced(
          newIndex,
          0,
          rebult_activeDraggingCardData
        );
        // Xoá placeholderCard nếu nó đang tồn tại
          nextOverCloumn.cards = nextOverCloumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Cật nhật lại cardOrderIds
        nextOverCloumn.cardOrderIds = [...nextOverCloumn.cards].map(
          (card) => card._id
        );
      }
      console.log('nextColumn : ',nextColumn)
      return nextColumn;
    });
  }
  // Khi bắt đầu hành động kéo
  const handleDragStart = (event) => {
    console.log("handleDragStart : ",event)
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    // Nếu đang kéo card thì mới thực hiện hành đọng setOldColumn
    if(event?.active?.data?.current?.columnId){
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  };
  // Đang kéo 1 phần tử
  const handleDragOver = (event) => {
    // console.log("handleDragOver : ",event)
    const { active, over } = event;
    // Không làm gì nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // Cần đảm bảo nếu không tồn tại actice hoặc over(Khi kéo ra khỏi phạm vi container) thì sẽ không làm gì
    if (!active || !over) return;

    // activeDraggingCardData : Là cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    // overCardId là card đang được tương tác trên hoặc dưới so với card đang được kéo
    const { id: overCardId } = over;

    // tìm 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    // Nếu 1 trong 2 column không tồn tại thì không làm gì hết
    if (!activeColumn || !overColumn) return;

    // Khi kéo card qua 2 column khác nhau mới xử lí
    if (activeColumn._id !== overColumn._id) {
      // console.log("code chạy vào đây")
      console.log("abc : ",activeColumn)
      moveCardBetweenDifferentColumns(overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData)
    }
  };

  // Khi kết thúc hành động kéo
  const handleDragEnd = (event) => {
    // console.log("handleDragEnd : ",event)
    const { active, over } = event;

    console.log(active, over);
    if (!over || !active) return;

    // Xử lí kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log("Đang kéo card")
      const {id: activeDraggingCardId,data: { current: activeDraggingCardData }} = active;
      // overCardId là card đang được tương tác trên hoặc dưới so với card đang được kéo
      const { id: overCardId } = over;
  
      // tìm 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // console.log("activeColumn" , activeColumn)
      // console.log("oldActiveColumn" , oldColumnWhenDraggingCard)

      // console.log("overColumn",overColumn)


      if (!activeColumn || !overColumn) return;
  

      // Kéo thả card trong cùng column
      // Phai dung toi oldColumnWhenDraggingCard._id hoac activeDragItemData.columnId (set state từ bước handleStartDrag) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua dragOver  là state của card đã được cật nhật
      if (oldColumnWhenDraggingCard._id !== overColumn._id){
        console.log("dang keo card trong khac column")
        console.log("oldColumnWhenDraggingCard : ",oldColumnWhenDraggingCard)
        console.log("overColumn : ",overColumn)
        console.log("overCardId : ",overCardId)
        console.log("active : ",active)
        console.log("over : ",over)
        console.log("activeColumn : ",activeColumn)
        console.log("activeDraggingCardId : ",activeDraggingCardId)
        console.log("activeDraggingCardData : ",activeDraggingCardData)

        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData)

      }
      else{
        // console.log("Keos tha card cung column");

        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex((c) => c._id === activeDragItemId);
        const newCardIndex = overColumn?.cards.findIndex((c) => c._id === overCardId);

        // dùng arrayMove vì kéo card trong 1 column cũng tương tự logic kéo column trong boardContent
        const dndOrderedCard = arrayMove(oldColumnWhenDraggingCard?.cards,oldCardIndex,newCardIndex);
        // console.log("dndOrderedCard : ",dndOrderedCard)
        setOrderedColumn((prevColumns) => {
           // Clone mảng OrderedColumnState cũ ra một cái mới để xử lí data rồi return - cật nhật lại orderedColumnState mới
            const nextColumn = cloneDeep(prevColumns);

            // Tìm tới column mà hiện tại đang kéo thả
            const targetColumn = nextColumn.find(c => c._id === overColumn._id);
            // console.log("targetColumn",targetColumn)
            // Cật nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
            targetColumn.cards = dndOrderedCard;
            targetColumn.cardOrderIds = dndOrderedCard.map(card => card._id);
            return nextColumn;

        })
      }
    }

    

    //xử lí kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumn.findIndex((c) => c._id === active.id);
        const newColumnIndex = orderedColumn.findIndex((c) => c._id === over.id);
        // Dùng arrayMove để sắp xếp lại mảng column ban đầu
        // console.log(arrayMove(orderedColumn,oldIndex,newIndex))
        setOrderedColumn(arrayMove(orderedColumn, oldColumnIndex, newColumnIndex));
      }
    }

    // Những dữ liệu sau khi kéo thả luôn luôn phải đưa về giá trị null
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null)
  };
  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // Animation khi thả phần tử thì overlay vẫn còn hiện cho đến khi Box trở về chỗ cũ
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };
  //Custom lại thuật toán phát hiện va chạm tối ưu cho việc kéo thả giữa nhiều column
  const collisionDetectionStrategy = useCallback((args)=>{
    // console.log("collisionDetectionStrategy")
    //Trường hợp kéo column thì dùng thuật toán closestCorners
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      return closestCorners({...args});
    } 
    //Tìm các điểm giao nhau, va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args);
    // console.log("pointerIntersections : ",pointerIntersections)
    //Fix triệt để bug flickering của thư viện trong trường hợp sau
    //Kéo một card chứa image và kéo lên  phía trên khỏi khu vực kéo thả.
    if(!pointerIntersections?.length) return;


    //Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (Không cần dùng bước này nữa 37.1)
    // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args);
    // console.log("intersections : ",intersections)

    // Tìm overId  đầu tiên trong pointerIntersections
    let overId = getFirstCollision(pointerIntersections,'id');
    // console.log("OverId : ",overId)
    if (overId){
      //Nếu cái over nó là comlumn thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được.Tuy nhiên dùng closestCorners thì sẽ mượt hơn
      const checkColumn = orderedColumn.find(column => column._id === overId);  
      
      if (checkColumn){
        // console.log("Before : ",overId)
        overId = closestCorners({
          ...args,
          droppableContainers : args.droppableContainers.filter((container) =>
            container.id !== overId &&
            checkColumn?.cardOrderIds.includes(container.id))
        })[0]?.id;
        // console.log("After : ",overId)

      }
      lastOverId.current = overId;
      return [{id : overId}]
    }
    //Nếu overId là null thì trả về mảng rỗng - tránh bug  crash trang
    return lastOverId.current ? [{id : lastOverId.current}] : [];
  },[activeDragItemType,orderedColumn])
  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm(Nếu không có nó thì card với cover lớn sẽ không kéo qua column được vì lúc này nó đang bị conflict giữa card và column) dùng closestCorners thay vì closestCenter
      //Nếu chỉ dùng closestCorners sẽ có bug flikering + sai lệch dữ liệu
      // collisionDetection={closestCorners}

      // Tự custom thuật toán phát hiện va chạm nâng cao
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34497e" : "#1976d2",
          height: (theme) => theme.trello.boarContentHeght,
          width: "100%",
          padding: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumn} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}
export default BoardContent;
