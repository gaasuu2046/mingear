export interface FormattedPoi {
  ptid: string;
  name: string;
  elevation: number;
  lat: number;
  lon: number;
  area: string;
}

export interface YamarecoPoiResponse {
  poilist?: YamarecoPoi[];
}

export interface YamarecoPoi {
  ptid: string;
  name: string;
  elevation: string;
  lat: string;
  lon: string;
  area: string;
}
