import { useContext, useMemo, useState, useEffect } from "react";
import L from "leaflet";
import {
  Route as RouteIcon,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import { IconButton, styled, Avatar } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Polyline,
  Popup,
} from "react-leaflet";
import { getCoByRouteObj } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { EtaContext } from "../../context/EtaContext";
import { mtrLineColor } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";
import { Eta } from "../Search/RouteList/Eta";

const currLocationIconPath = require("../../assets/icons/currentLocation.png");
const stopIconPath = require("../../assets/icons/stop.png");
const startIconPath = require("../../assets/icons/start.png");
const endIconPath = require("../../assets/icons/end.png");

export const Map = ({ destination, expanded }) => {
  const { currRoute, mapStopIdx } = useContext(EtaContext);
  const { location: currentLocation } = useLocation({ interval: 100000 });
  const { gStopList } = useContext(DbContext);
  const [navBtnType, setNavBtnType] = useState("normal");
  const [map, setMap] = useState(null);

  const currRouteStopIdList = useMemo(
    () =>
      currRoute.stops &&
      currRoute.stops[getCoByRouteObj(currRoute)[0]].slice(
        currRoute.nearbyOrigStopSeq - 1,
        currRoute.nearbyDestStopSeq
      ),
    [currRoute]
  );

  const currRouteStopList = useMemo(
    () => currRouteStopIdList?.map((e) => gStopList[e]),
    [currRoute]
  );

  const routeLine = currRouteStopList?.map((e) => [
    e.location.lat,
    e.location.lng,
  ]);

  let routeLineWithStartEnd = [];

  if (map && routeLine && destination) {
    routeLineWithStartEnd = [...routeLine];
    routeLineWithStartEnd.push([currentLocation.lat, currentLocation.lng]);
    routeLineWithStartEnd.push([
      destination.location.lat,
      destination.location.lng,
    ]);
  }

  useEffect(() => {
    if (map && routeLine) {
      map.fitBounds(routeLineWithStartEnd);
    }
  }, [currRoute]);

  // const nearestStopIdx = currRouteStopIdList?.findIndex(
  //   (e) => e === nearestStopId
  // );

  // useEffect(() => {
  //   if (!mapLocation) {
  //     updateMapStopIdx(nearestStopIdx);
  //   }
  // }, []);

  // let location = {};

  // if (mapLocation) {
  //   location = mapLocation;
  // } else if (currRouteStopList[nearestStopIdx]) {
  //   location = currRouteStopList[nearestStopIdx].location;
  // } else {
  // location = { lat: 0, lng: 0 };
  // }

  const currLocationIcon = new L.Icon({
    iconUrl: currLocationIconPath,
    iconRetinaUrl: currLocationIconPath,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
    className: "currLocationMarker",
  });

  const startIcon = new L.Icon({
    iconUrl: startIconPath,
    iconRetinaUrl: startIconPath,
    iconAnchor: null,
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(15, 15),
    className: "currLocationMarker",
  });

  const endIcon = new L.Icon({
    iconUrl: endIconPath,
    iconRetinaUrl: endIconPath,
    iconAnchor: null,
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(15, 15),
    className: "currLocationMarker",
  });

  const CustomMarker = ({ stop, i }) => {
    const stopIcon = new L.Icon({
      iconUrl: stopIconPath,
      iconRetinaUrl: stopIconPath,
      iconAnchor: null,
      popupAnchor: [0, 0],
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null,
      iconSize: new L.Point(10, 10),
      className: "stopMarker",
    });

    const stopList = currRoute.stops[getCoByRouteObj(currRoute)[0]];
    const stopId = currRouteStopIdList[i];
    const stopIdx = stopList.findIndex((e) => e === stopId);

    return (
      <Marker
        key={i}
        position={[stop.location.lat, stop.location.lng]}
        icon={stopIcon}
      >
        <Popup>
          <div className="title">{currRouteStopList[i].name.zh}</div>
          <div className="eta">
            <Eta seq={stopIdx + 1} routeObj={currRoute} slice={3} />
          </div>
        </Popup>
      </Marker>
    );
  };

  const RouteBoundBtn = () => {
    const _map = useMap();

    const handleIconOnClick = () => {
      _map.fitBounds(routeLineWithStartEnd);
      setNavBtnType("normal");
    };

    return (
      <Avatar
        className={`routeBoundBtnAvatar ${mapStopIdx === 0 ? "disabled" : ""}`}
      >
        <IconButton disabled={mapStopIdx === 0} onClick={handleIconOnClick}>
          <RouteIcon />
        </IconButton>
      </Avatar>
    );
  };

  const NavBtn = () => {
    const _map = useMap();

    _map.on("drag", () => {
      setNavBtnType("normal");
    });

    if (navBtnType === "navigation") {
      _map.panTo([currentLocation.lat, currentLocation.lng], {
        animate: true,
        duration: 0.5,
      });
    }

    const handleIconOnClick = () => {
      _map.flyTo([currentLocation.lat, currentLocation.lng], 18, {
        animate: true,
        duration: 0.5,
      });
      setNavBtnType("navigation");
    };

    return (
      <Avatar className={`navBtnAvatar ${navBtnType === "normal" && "normal"}`}>
        <IconButton onClick={handleIconOnClick}>
          <NavigationIcon />
        </IconButton>
      </Avatar>
    );
  };

  return (
    <MapContainerRoot
      center={[22.382263, 114.11465]}
      zoom={9}
      ref={setMap}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Current Location Marker */}
      <Marker
        position={[currentLocation.lat, currentLocation.lng]}
        icon={currLocationIcon}
      />

      {destination &&
        Object.keys(currRoute).length > 0 &&
        currRoute.stops &&
        expanded && (
          <>
            {/* Start Point Marker */}
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={startIcon}
            />
            {/* End Point Marker */}
            <Marker
              position={[destination.location.lat, destination.location.lng]}
              icon={endIcon}
            >
              <Popup>{destination.label}</Popup>
            </Marker>
            {/* Transport Stop Marker */}
            {currRouteStopIdList.map((e, i) => {
              const stop = gStopList[e];
              return <CustomMarker stop={stop} key={i} i={i} />;
            })}

            {/* Line of Transport */}
            <Polyline
              pathOptions={{
                color: `${
                  companyColor["." + getCoByRouteObj(currRoute)[0]].color
                }`,
                opacity: "0.75",
              }}
              positions={routeLine}
            />
            {/* Line of Start Point to First Transport Stop */}
            <Polyline
              pathOptions={{
                color: "grey",
                opacity: "0.75",
              }}
              positions={[
                [currentLocation.lat, currentLocation.lng],
                [
                  currRouteStopList[0].location.lat,
                  currRouteStopList[0].location.lng,
                ],
              ]}
            />
            {/* Line of End Point to Last Transport Stop */}
            <Polyline
              pathOptions={{
                color: "grey",
                opacity: "0.75",
              }}
              positions={[
                [destination.location.lat, destination.location.lng],
                [
                  currRouteStopList[currRouteStopList.length - 1].location.lat,
                  currRouteStopList[currRouteStopList.length - 1].location.lng,
                ],
              ]}
            />
          </>
        )}

      <RouteBoundBtn />
      <NavBtn />
    </MapContainerRoot>
  );
};

const MapContainerRoot = styled(MapContainer)({
  flex: 1,
  zIndex: 0,
  ".leaflet-control-container": {
    ".leaflet-top, .leaflet-bottom": {
      willChange: "transform",
      transform: "translate3d(0px, 0px, 0px)",
    },
  },
  ".leaflet-map-pane": {
    ".leaflet-overlay-pane": {
      ".leaflet-interactive": {
        ...companyColor,
        ...mtrLineColor,
      },
    },
  },
  ".leaflet-popup-pane": {
    ".title": {
      fontWeight: 900,
    },
  },
  ".MuiAvatar-root": {
    position: "absolute",
    zIndex: "1001",
    backgroundColor: "white",
    border: "2px solid rgba(0,0,0,0.2)",
    willChange: "transform",
    transform: "translate3d(0px, 0px, 0px)",
    "&.disabled": {
      backgroundColor: "#f4f4f4",
      ".MuiButtonBase-root": {
        color: "#bbb",
      },
    },
    ".MuiButtonBase-root": {
      color: "black",
    },
    "&.prevBtnAvatar": {
      top: "50%",
      width: "35px",
      height: "35px",
      marginTop: "-35px", // equal to width and height
      left: "10px",
    },
    "&.nextBtnAvatar": {
      top: "50%",
      width: "35px",
      height: "35px",
      marginTop: "-35px", // equal to width and height
      right: "10px",
    },
    "&.routeBoundBtnAvatar": {
      right: "55px",
      bottom: "20px",
    },
    "&.navBtnAvatar,": {
      right: "10px",
      bottom: "20px",
      "&.normal button": {
        color: "#777777",
      },
    },
  },
  ".leaflet-marker-pane": {
    ".currLocationMarker": {
      border: "none",
      background: "none",
    },
    ".currStopMarker": {
      "&.selected": {
        filter: "hue-rotate(150deg)",
      },
    },
  },
});
