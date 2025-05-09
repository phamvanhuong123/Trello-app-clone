import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Attachment from "@mui/icons-material/Attachment";
import {Card as MuiCard} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Comment from "@mui/icons-material/Comment";
import Group from "@mui/icons-material/Group";
function Card ({card}){
    const shouldShowCardAction = ()=>{
        return !!card?.memberIds.length || !!card?.comments?.length || !!card?.attachments?.length
    }

    if (!card?.cover){
        return <MuiCard
            sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
            }}
            >
            <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>{card.title}</Typography>
            </CardContent>
            {shouldShowCardAction() && <CardActions sx={{ p: "0 4px 8px 4px" }}>
                <Button startIcon={<Group />} sx={{ fontWeight: "bold" }}>
                {card?.memberIds.length}
                </Button>
                <Button startIcon={<Comment />} sx={{ fontWeight: "bold" }}>
                {card?.comments?.length}
                </Button>
                <Button startIcon={<Attachment />} sx={{ fontWeight: "bold" }}>
                {card?.attachments?.length}
                </Button>
            </CardActions>}
            </MuiCard>
       
    }
    
    return<>
        <MuiCard
            sx={{
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
            }}
            >
            <CardMedia
                sx={{ height: 140 }}
                image={card?.cover}
            />
            <CardContent sx={{ p: 1.5,"&:last-child": { p: 1.5 } }}>
                <Typography component="div">{card.title}</Typography>
            </CardContent>
            {shouldShowCardAction() && <CardActions sx={{ p: "0 4px 8px 4px" }}>
                <Button startIcon={<Group />} sx={{ fontWeight: "bold" }}>
                {card?.memberIds.length}
                </Button>
                <Button startIcon={<Comment />} sx={{ fontWeight: "bold" }}>
                {card?.comments?.length}
                </Button>
                <Button startIcon={<Attachment />} sx={{ fontWeight: "bold" }}>
                {card?.attachments?.length}
                </Button>
            </CardActions>}
        </MuiCard>
    </>
}
export default Card