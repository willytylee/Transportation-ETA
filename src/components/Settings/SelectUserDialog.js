import { useState } from "react";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  styled,
  Grid,
  IconButton,
  DialogTitle,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import PinInput from "react-pin-input";
import { dataSet } from "../../data/DataSet";

export const SelectUserDialog = ({
  handleslctUsrDialogOnClose,
  slctUsrDialogOpen,
  fullWidth,
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [isPinValid, setIsPinValid] = useState(true);

  const handlePinOnComplete = (val) => {
    const { pin } = dataSet.filter((e) => e.userId === selectedUser.userId)[0];
    if (pin === val) {
      handleslctUsrDialogOnClose(selectedUser);
      setSelectedUser({});
    } else {
      setIsPinValid(false);
    }
  };

  const handlePinOnChange = (val) => {
    if (val.length < 4) {
      setIsPinValid(true);
    }
  };

  const handleUserListOnClick = (e) => {
    if (e.pin === "") {
      handleslctUsrDialogOnClose(e);
      setSelectedUser({});
    } else {
      setSelectedUser({
        userId: e.userId,
        username: e.username,
      });
    }
  };

  const handleDialogOnClose = () => {
    handleslctUsrDialogOnClose({});
    setSelectedUser({});
    setIsPinValid(true);
  };

  return (
    <DialogRoot
      onClose={() => {
        handleDialogOnClose();
      }}
      open={slctUsrDialogOpen}
      fullWidth={fullWidth}
      isPinValid={isPinValid}
    >
      {Object.keys(selectedUser).length === 0 ? (
        <>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請選擇用戶:</div>
              <IconButton onClick={handleDialogOnClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </DialogTitle>

          <List sx={{ pt: 0 }}>
            {dataSet
              .filter((e) => e.display)
              .map((e, i) => (
                <ListItem
                  button
                  onClick={() => {
                    handleUserListOnClick(e);
                  }}
                  key={i}
                >
                  <ListItemText primary={e.username} />
                </ListItem>
              ))}
          </List>
        </>
      ) : (
        <>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請輸入Pin碼:</div>
              <IconButton onClick={handleDialogOnClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </DialogTitle>

          <PinInput
            length={4}
            focus
            inputMode="number"
            onComplete={(val) => {
              handlePinOnComplete(val);
            }}
            onChange={(val) => {
              handlePinOnChange(val);
            }}
            autoSelect
          />
        </>
      )}
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== "isPinValid",
})(({ isPinValid }) => ({
  ".dialogTitle": {
    padding: "0",
    ".MuiGrid-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ".title": {
        padding: "16px",
        fontWeight: "900",
        fontSize: "18px",
      },
    },
  },
  ".MuiList-root": {
    overflow: "auto",
  },
  ".pincode-input-container": {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",

    ".pincode-input-text": {
      height: "60px !important",
      borderColor: isPinValid ? "black !important" : "red !important",
      fontSize: "24px",
      borderRadius: "2px",
    },
    ".pincode-input-text:focus": {
      outline: "none",
      boxShadow: "none",
      borderColor: "blue !important",
      borderRadius: "10px",
    },
  },
}));