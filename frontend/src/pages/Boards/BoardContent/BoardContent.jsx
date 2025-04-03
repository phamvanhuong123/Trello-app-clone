import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {DndContext,useSensor,useSensors, TouchSensor, MouseSensor} from '@dnd-kit/core';
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "utils/sort";

import {arrayMove} from '@dnd-kit/sortable';
function BoardContent({board}) {
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
  const sensors = useSensors(mouseSensor,touchSensor);


  // const orderedColumn = mapOrder(board?.columns,board?.columnOrderIds,'_id')
  const [orderedColumn,setOrderedColumn] = useState([]);
  const handleDragEnd = (event)=>{
    const {active,over} = event;
    // console.log(active,over);
    if (!over) return
    if (active.id !== over.id){
        const oldIndex = orderedColumn.findIndex(c => c._id === active.id)
        const newIndex = orderedColumn.findIndex(c => c._id === over.id)
        // Dùng arrayMove để sắp xếp lại mảng column ban đầu
        // console.log(arrayMove(orderedColumn,oldIndex,newIndex))

        setOrderedColumn(arrayMove(orderedColumn,oldIndex,newIndex))
    }

  }
  useEffect(() =>{
      setOrderedColumn(mapOrder(board?.columns,board?.columnOrderIds,'_id'));
  },[board])
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
        </Box>

    </DndContext>
  );
}
export default BoardContent;
