import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';
import { SxProps, Theme } from '@mui/system';
import { styled, keyframes } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';


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
  backgroundColor: '#9798a1',
  paddingX: '16px',
  paddingTop: '10px',
  paddingBottom: '10px',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '4px',
};


//FlightList:
export const flightListContainerStyle: SxProps<Theme> = {
  maxWidth: '85%',
  mx: 'auto',
  mt: 2,
  background: 'black',
  position: 'relative',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.5)',
  border: '2px solid #ddd',
  '&:before': {
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
  }
};


export const flightListHeaderStyle: SxProps<Theme> = {
  backgroundColor: "primary.main",
  '& th': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: '10px 15px',
  },
};

export const flightListRowStyle = (index: number): SxProps<Theme> => ({
  backgroundColor: index % 2 === 0 ? grey[800] : grey[700],
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
  '@media (max-width: 412px)': {
    mb: 2,
    '& h1': {
      fontSize: '1.75rem',
    },
    '& h5': {
      fontSize: '1.25rem',
    },
  },
};


export const mainTitleStyle: SxProps<Theme> = {
  fontWeight: 'bold',
  color: 'primary.main',
  textShadow: `
    -1px -1px 0 #fff,  
     1px -1px 0 #fff,
    -1px  1px 0 #fff,
     -1px  1px 0 #fff;
  `,
};


export const subTitleStyle: SxProps<Theme> = {
  fontWeight: 'bold',
  '@media (max-width: 412px)': {
    mb: 2,
    
    '& h5': {
      fontSize: '1rem',
    },
  },
};


// AirPlane:
export const moveAndTurn = keyframes`
  0% {
    transform: translateX(0) rotateY(0);
  }
  50% {
    transform: translateX(485px) rotateY(0);
  }
  50.1% {
    transform: translateX(485px) rotateY(180deg);
  }
  100% {
    transform: translateX(0) rotateY(180deg);
  }
`;

export const moveAndTurnSm = keyframes`
  0% {
    transform: translateX(0) rotateY(0);
  }
  50% {
    transform: translateX(260px) rotateY(0);
  }
  50.1% {
    transform: translateX(260px) rotateY(180deg);
  }
  100% {
    transform: translateX(0) rotateY(180deg);
  }
`;

export const PlaneIconStyled = styled(FlightTakeoffIcon)({
  position: 'absolute',
  top: '0px',
  left: '35%',
  transform: 'translate(-50%, -50%)',
  animation: `${moveAndTurn} 8s infinite linear`,
  color: 'black',
  // Custom media query for screens up to 412px wide
  '@media (max-width: 412px)': {
    top: 'calc(100% + -20px)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: `${moveAndTurnSm} 4s infinite linear`,
  },
});


