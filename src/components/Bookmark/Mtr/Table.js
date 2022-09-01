import { styled } from "@mui/material";
import { stationMap } from "../../../constants/Mtr";
import { parseMtrEtas } from "../../../Utils/Utils";

export const Table = ({ etasDetail }) => (
  <MtrTable>
    {etasDetail.length === 0
      ? "沒有班次"
      : etasDetail.map((etas) => (
          <div className="ttntWrapper">
            {etas
              .map((e, j) => (
                <div className="ttnt" key={j}>
                  <div className="dest">{stationMap[e.dest]}</div>
                  <div className="minutes">{parseMtrEtas(e)}</div>
                </div>
              ))
              .slice(0, 4)}
          </div>
        ))}
  </MtrTable>
);

const MtrTable = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  flexGrow: 1,
  gap: "4px",
  ".ttntWrapper": {
    fontSize: "12px",
    width: "95%",
    padding: "2px 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    ".ttnt": {
      display: "flex",
      flexDirection: "column",
      width: "25%",
      fontSize: "12px",
    },
  },
});
