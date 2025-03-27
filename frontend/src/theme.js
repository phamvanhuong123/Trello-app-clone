// import { cyan, deepOrange, orange, teal } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
const APP_BAR_HEIGHT = "60px";
const BOARD_BAR_HEIGHT = "58px";
const COLUMN_HEADER_HEGHT = "50px";
const COLUMN_FOOTER_HEGHT = "56px";
const theme = createTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boarContentHeght : `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`,
    columnHeaderHeight : COLUMN_HEADER_HEGHT,
    columnFooterHeight : COLUMN_FOOTER_HEGHT,
  },
  colorSchemes: {
    dark: {
      // palette: {
      //   primary: cyan,
      //   secondary: deepOrange,
      // },
    },
    light: {
      // palette: {
      //   primary: teal,
      //   secondary: orange,
      // },
    },
  },
  components: {
    MuiCssBaseline : {
      styleOverrides : {
        body : {
          '*::-webkit-scrollbar' : {
            width : '6px',
            height : '6px'
          },
          '*::-webkit-scrollbar-thumb' : {
            backgroundColor : '#bdc3c7',
            borderRadius : '10px'
          },
          '*::-webkit-scrollbar-thumb:hover' :{
            backgroundColor : '#00b894',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({theme})=>({
          // color: theme.palette.primary.main
        }),
      },
    }
    ,
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color: theme.palette.primary.main,

          fontSize: "0.875rem",
          // "& .MuiOutlinedInput-notchedOutline": {
          //   borderColor: theme.palette.primary.light,
          // },
          // ":hover": {
          //   "& .MuiOutlinedInput-notchedOutline": {
          //     borderColor: theme.palette.primary.main,
          //   },
          // },
          '& fieldset' : {borderWidth : '1px !important'},
          '&:hover fieldset' : {borderWidth : '2px !important'},
          '&.Mui-focused fieldset' : {borderWidth : '2px !important'}
        }),
      },
    },
    MuiTypography : {
      styleOverrides : {
        root : {
          '&.MuiTypography-body1' : {fontSize : '0.875rem'}
        }
      }
    }
  },
});
export default theme;
