import axios from "axios";

export const fetchEtas = async ({ stopId, route, seq, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/ctb/${stopId}/${route}`
  );

  return response.data.data
    .filter((e) => e.eta !== null && bound?.includes(e.dir))
    .map((e) => ({
      co: "ctb",
      eta: e.eta,
      bound: e.dir, // special for vote the correct route
      remark: {
        zh: e.rmk_tc,
        en: e.rmk_en,
      },
    }));
};