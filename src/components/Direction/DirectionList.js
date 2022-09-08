import { useState, useContext, useEffect } from "react";
import { styled } from "@mui/material";
import { getPreciseDistance } from "geolib";
import { DbContext } from "../../context/DbContext";
import { useLocation } from "../../hooks/Location";
import { useStopIdsNearBy } from "../../hooks/Stop";
import { basicFiltering, getCoPriorityId } from "../../Utils/Utils";
import { EtaContext } from "../../context/EtaContext";
import { DirectionItem } from "./DirectionItem";

export const DirectionList = ({
  origination,
  destination,
  expanded,
  setExpanded,
  sortingMethod,
}) => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const { updateCurrRoute } = useContext(EtaContext);
  const [sortedRouteList, setSortedRouteList] = useState([]);

  const handleChange = (panel, currRoute) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    updateCurrRoute(currRoute);
  };

  // eslint-disable-next-line no-unused-vars
  const { location: currentLocation } = useLocation({ interval: 60000 });
  const { stopIdsNearby: origStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 600,
    lat: origination ? origination.location.lat : currentLocation.lat,
    lng: origination ? origination.location.lng : currentLocation.lng,
  });
  const { stopIdsNearby: destStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 600,
    lat: destination?.location?.lat,
    lng: destination?.location?.lng,
  });

  useEffect(() => {
    setExpanded(false);
    // use useEffect prevent reload on setExpanded
    const getWalkTime = (meter) => Math.round(meter / 50);

    const routeList =
      gRouteList &&
      Object.keys(gRouteList)
        .map((e) => gRouteList[e])
        .filter((e) => basicFiltering(e));

    const filteredRouteList = [];

    origStopIdsNearby &&
      destStopIdsNearby &&
      routeList?.forEach((e) => {
        const company = getCoPriorityId(e);

        const filitedOrigStopId = Object.values(e.stops[company]).filter((f) =>
          Object.keys(origStopIdsNearby).includes(f)
        );

        const filitedDestStopId = Object.values(e.stops[company]).filter((f) =>
          Object.keys(destStopIdsNearby).includes(f)
        );

        if (filitedOrigStopId?.length > 0 && filitedDestStopId?.length > 0) {
          // There may have more than one destStopIdsNearby in a route, find the nearest stop in the route stop List
          const _origStopId = filitedOrigStopId.reduce((prev, curr) =>
            origStopIdsNearby[prev] < origStopIdsNearby[curr] ? prev : curr
          );

          const _destStopId = filitedDestStopId.reduce((prev, curr) =>
            destStopIdsNearby[prev] < destStopIdsNearby[curr] ? prev : curr
          );

          e.nearbyOrigStopId = _origStopId;
          e.nearbyDestStopId = _destStopId;

          e.nearbyOrigStopSeq =
            e.stops[company].findIndex((f) => f === _origStopId) + 1;
          e.nearbyDestStopSeq =
            e.stops[company].findIndex((f) => f === _destStopId) + 1;

          e.origWalkDistance = origStopIdsNearby[_origStopId];
          e.destWalkDistance = destStopIdsNearby[_destStopId];

          let duplicate = false;
          filteredRouteList.forEach((f) => {
            if (e.route === f.route) {
              duplicate = true;
            }
          });

          if (e.nearbyOrigStopSeq < e.nearbyDestStopSeq && !duplicate) {
            filteredRouteList.push(e);
          }
        }
      });

    const nearbyRouteList = filteredRouteList.map((e, j) => {
      const company = getCoPriorityId(e);

      let totalTransportDistance = 0;
      let actualTransportDistance = 0;
      for (let i = 0; i < e?.stops[company].length - 1; i += 1) {
        const stopId = e?.stops[company][i];
        const nextStopId = e?.stops[company][i + 1];
        const { location } = gStopList[stopId];
        const { location: nextLocation } = gStopList[nextStopId];

        const distance = getPreciseDistance(
          { latitude: location?.lat, longitude: location?.lng },
          { latitude: nextLocation?.lat, longitude: nextLocation?.lng }
        );

        totalTransportDistance += distance;

        if (i >= e.nearbyOrigStopSeq - 1 && i < e.nearbyDestStopSeq - 1) {
          actualTransportDistance += distance;
        }
      }

      return {
        ...e,
        origWalkTime: getWalkTime(e.origWalkDistance),
        destWalkTime: getWalkTime(e.destWalkDistance),
        transportTime:
          e.jt !== null
            ? Math.round(
                e.jt * (actualTransportDistance / totalTransportDistance) +
                  (e.nearbyDestStopSeq - e.nearbyOrigStopSeq) // Topup for extra time in each stop
              )
            : null,
      };
    });

    if (sortingMethod === "最短步行時間") {
      setSortedRouteList(
        nearbyRouteList.sort(
          (a, b) =>
            a.origWalkTime + a.destWalkTime - (b.origWalkTime + b.destWalkTime)
        )
      );
    } else if (sortingMethod === "最短步行時間") {
      setSortedRouteList(
        nearbyRouteList.sort((a, b) => a.transportTime - b.transportTime)
      );
    } else {
      setSortedRouteList(
        nearbyRouteList.sort(
          (a, b) =>
            a.origWalkTime +
            a.transportTime +
            a.destWalkTime -
            (b.origWalkTime + b.transportTime + b.destWalkTime)
        )
      );
    }
  }, [origination, destination, sortingMethod]);

  return (
    <DirectionListRoot>
      {sortedRouteList?.length > 0 &&
        destination &&
        sortedRouteList.map((e, i) => (
          <DirectionItem
            key={i}
            e={e}
            i={i}
            handleChange={handleChange}
            destination={destination}
            expanded={expanded}
          />
        ))}
    </DirectionListRoot>
  );
};

const DirectionListRoot = styled("div")({
  display: "flex",
  flex: "5",
  flexDirection: "column",
  overflow: "auto",
});