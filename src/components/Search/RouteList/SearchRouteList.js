import { useContext } from "react";
import { styled } from "@mui/material";
import { getCoByStopObj, basicFiltering, sortByCompany } from "../../../Utils";
import { DbContext } from "../../../context/DbContext";
import { companyColor, companyMap } from "../../../constants/Constants";

export const SearchRouteList = ({ route, handleRouteListItemOnClick }) => {
  const { gRouteList } = useContext(DbContext);

  const sortByRouteThenCo = (a, b) => {
    let routeReturn = 0;
    if (a.route < b.route) {
      routeReturn = -1;
    }
    if (a.route > b.route) {
      routeReturn = 1;
    }

    return routeReturn || sortByCompany(a, b); // Sort by Route first and than sort by company
  };

  const routeList = Object.keys(gRouteList)
    .map((e) => gRouteList[e])
    .filter((e) => basicFiltering(e))
    .filter((e) => route && route === e.route.substring(0, route.length))
    .sort((a, b) => sortByRouteThenCo(a, b));

  return (
    routeList.length > 0 &&
    routeList.map((e, i) => (
      <SearchRouteListRoot
        onClick={() => handleRouteListItemOnClick(e)}
        key={i}
      >
        <div className="route">{e.route}</div>
        <div className="companyOrigDest">
          <div className="company">
            {getCoByStopObj(e)
              .map((f, j) => (
                <span key={j} className={f}>
                  {companyMap[f]}
                </span>
              ))
              .reduce((a, b) => [a, " + ", b])}
          </div>
          <div className="origDest">
            <div>
              {e.orig.zh} → <span className="dest">{e.dest.zh}</span>
              <span className="special">
                {" "}
                {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
              </span>
            </div>
          </div>
        </div>
      </SearchRouteListRoot>
    ))
  );
};

const SearchRouteListRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "4px 10px",
  borderBottom: "1px solid lightgrey",
  ".route": {
    fontWeight: "900",
    letterSpacing: "-0.5px",
    width: "40px",
  },
  ".companyOrigDest": {
    display: "flex",
    flexDirection: "column",
    ".company": {
      ...companyColor,
    },

    ".origDest": {
      ".dest": {
        fontWeight: "900",
      },
      ".special": {
        fontSize: "10px",
      },
    },
    ".eta": {
      width: "15%",
      float: "left",
      fontSize: "10px",
    },
  },
});
