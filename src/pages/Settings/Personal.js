import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListSubheader,
} from "@mui/material/";
import {
  PhoneIphone as PhoneIphoneIcon,
  DirectionsBus as DirectionsBusIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
  Announcement as AnnouncementIcon,
  DepartureBoard as DepartureBoardIcon,
  TableView as TableViewIcon,
  ArtTrack as ArtTrackIcon,
  Filter1 as Filter1Icon,
  Filter2 as Filter2Icon,
  Filter3 as Filter3Icon,
  Filter4 as Filter4Icon,
  Filter5 as Filter5Icon,
  Filter6 as Filter6Icon,
  Filter7 as Filter7Icon,
  Filter8 as Filter8Icon,
  Filter9 as Filter9Icon,
  Filter9Plus as Filter9PlusIcon,
} from "@mui/icons-material";
import { SimpleSettingDialog } from "../../components/Settings/SimpleSettingDialog";

export const Personal = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogOptions, setDialogOptions] = useState([]);
  const [dialogKey, setDialogKey] = useState("");

  const defaultScreen =
    JSON.parse(localStorage.getItem("settings"))?.defaultScreen || "路線搜尋";
  const bookmarkDisplay =
    JSON.parse(localStorage.getItem("settings"))?.bookmarkDisplay ||
    "以到站時間排列";
  const etaRouteNum =
    JSON.parse(localStorage.getItem("settings"))?.etaRouteNum || "顯示全部";

  const handleDefaltScreenItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("預設載入版面");
    setDialogKey("defaultScreen");
    setDialogOptions([
      { name: "路線搜尋", icon: <DirectionsBusIcon /> },
      { name: "交通消息", icon: <AnnouncementIcon /> },
      { name: "收藏", icon: <FavoriteIcon /> },
      { name: "天氣", icon: <ThermostatIcon /> },
    ]);
  };

  const handleBookmarkDisplayItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("預設收藏顯示模式");
    setDialogKey("bookmarkDisplay");
    setDialogOptions([
      { name: "以到站時間排列", icon: <DepartureBoardIcon /> },
      { name: "顯示所有班次", icon: <TableViewIcon /> },
    ]);
  };

  const handleEtaRouteNumItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("到站時間路線顯示數目");
    setDialogKey("etaRouteNum");
    setDialogOptions([
      { name: "1個", icon: <Filter1Icon /> },
      { name: "2個", icon: <Filter2Icon /> },
      { name: "3個", icon: <Filter3Icon /> },
      { name: "4個", icon: <Filter4Icon /> },
      { name: "5個", icon: <Filter5Icon /> },
      { name: "6個", icon: <Filter6Icon /> },
      { name: "7個", icon: <Filter7Icon /> },
      { name: "8個", icon: <Filter8Icon /> },
      { name: "9個", icon: <Filter9Icon /> },
      { name: "顯示全部", icon: <Filter9PlusIcon /> },
    ]);
  };

  return (
    <>
      <List subheader={<ListSubheader>應用程式</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleDefaltScreenItemOnClick}>
            <ListItemAvatar>
              <Avatar>
                <PhoneIphoneIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="預設載入版面" secondary={defaultScreen} />
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>收藏</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleBookmarkDisplayItemOnClick}>
            <ListItemAvatar>
              <Avatar>
                <ArtTrackIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="預設顯示模式" secondary={bookmarkDisplay} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleEtaRouteNumItemOnClick}>
            <ListItemAvatar>
              <Avatar>
                <ArtTrackIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="到站時間路線顯示數目"
              secondary={etaRouteNum}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <SimpleSettingDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogTitle={dialogTitle}
        dialogOptions={dialogOptions}
        dialogKey={dialogKey}
      />
    </>
  );
};
