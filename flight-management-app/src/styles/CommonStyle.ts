import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';
import { SxProps, Theme } from '@mui/system';


//SearchBar:
export const searchBarTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'grey',
            borderWidth: '2px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
        },
      },
    },
  },
});

export const searchBarStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: '#9798a1', // Set your desired color
  paddingX: '16px',
  paddingTop: '10px',
  paddingBottom: '10px',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '4px',
  // Add any additional styling you need here
};


//FlightList:
export const flightListContainerStyle: SxProps<Theme> = {
  maxWidth: '85%',
  mx: 'auto',
  mt: 2,
  background: 'black',
};

export const flightListHeaderStyle: SxProps<Theme> = {
  backgroundColor: "primary.main", // You can adjust the color to match your theme
  '& th': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: '10px 15px',
  },
};

export const flightListRowStyle = (index: number): SxProps<Theme> => ({
  backgroundColor: index % 2 === 0 ? grey[800] : grey[700], // Stripe effect for rows
});


//FlightItem:
export const getFlightItemStyle = (index: number): SxProps<Theme> => ({
  color: 'white',
  backgroundColor: index % 2 ? grey[900] : grey[800],
  '&:hover': {
    backgroundColor: grey[700],
  },
});

export const textCellStyle: SxProps<Theme> = {
  color: 'white',
  textAlign: 'center',
};

export const getStatusStyle = (status: string): SxProps<Theme> => (
  status === 'malfunction' ? { color: red[500] } : { color: 'white' }
);


//TitleComponent:
export const titleBoxStyle: SxProps<Theme> = {
  textAlign: 'center',
  mb: 5,
  // Any other box styles you wish to add
};

export const mainTitleStyle: SxProps<Theme> = {
  fontWeight: 'bold',
  // Any other main title styles you wish to add
};

export const subTitleStyle: SxProps<Theme> = {
  // Any subtitle styles you wish to add
};

