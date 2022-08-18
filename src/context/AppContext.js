import { createContext, useState, useMemo, useCallback } from "react";
import { compress as compressJson } from "lzutf8-light";
import axios from "axios";
import { fetchVersion } from "../fetch/Version";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const dbVersionLocal = localStorage.getItem("dbVersion");
  let userIdLocal;
  try {
    userIdLocal = JSON.parse(localStorage.getItem("user")).userId;
  } catch (error) {
    userIdLocal = -1;
  }

  const [dbVersion, setDbVersion] = useState(dbVersionLocal);
  const [location, setLocation] = useState({
    lat: 22.313879,
    lng: 114.186484,
  });
  const [appVersion, setAppVersion] = useState("");
  const [serVersion, setSerVersion] = useState("");
  const [currentUserId, setCurrentUserId] = useState(userIdLocal);

  const getGeoLocation = useCallback(() => {
    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    navigator.geolocation.watchPosition(success);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCurrentUserId = useCallback((userId) => {
    setCurrentUserId(userId);
  });

  const initAppVersion = useCallback(() => {
    fetchVersion().then((version) => {
      setAppVersion(version);
    });

    const intervalContent = async () => {
      fetchVersion().then((version) => {
        setSerVersion(version);
      });
    };

    intervalContent();
    setInterval(intervalContent, 60000);
  });

  const initDb = useCallback(() => {
    const dbVersionLocal = localStorage.getItem("dbVersion");
    const stopMapLocal = localStorage.getItem("stopMap");
    const routeListLocal = localStorage.getItem("routeList");
    const stopListLocal = localStorage.getItem("stopList");

    if (
      !dbVersionLocal ||
      !stopMapLocal ||
      !routeListLocal ||
      !stopListLocal ||
      dbVersionLocal !== "0.0.1"
    ) {
      localStorage.removeItem("dbVersion");
      localStorage.removeItem("stopMap");
      localStorage.removeItem("routeList");
      localStorage.removeItem("stopList");
      localStorage.setItem("dbVersion", "0.0.1");
      axios
        .get("https://hkbus.github.io/hk-bus-crawling/routeFareList.min.json")
        .then((response) => {
          setDbVersion("0.0.1");
          localStorage.setItem(
            "stopMap",
            compressJson(JSON.stringify(response.data.stopMap), {
              outputEncoding: "Base64",
            })
          );
          localStorage.setItem(
            "routeList",
            compressJson(JSON.stringify(response.data.routeList), {
              outputEncoding: "Base64",
            })
          );
          localStorage.setItem(
            "stopList",
            compressJson(JSON.stringify(response.data.stopList), {
              outputEncoding: "Base64",
            })
          );
        });
    }
  });

  const value = useMemo(
    () => ({
      dbVersion,
      location,
      initDb,
      getGeoLocation,
      initAppVersion,
      appVersion,
      serVersion,
      currentUserId,
      updateCurrentUserId,
    }),
    [
      dbVersion,
      location,
      initDb,
      getGeoLocation,
      initAppVersion,
      appVersion,
      serVersion,
      currentUserId,
      updateCurrentUserId,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
