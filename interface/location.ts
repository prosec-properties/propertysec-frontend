export interface ICountry {
  id: number;
  name: string;
  capital: string;
  region: string;
  subregion: string;
  emoji: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  iso: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  states: IState[];
}

export interface IState {
  id: string;
  name: string;
  meta?: string;
  countryId: string;
  latitude: string | null;
  longitude: string | null;
  stateCode: string;
  createdAt: string;
  updatedAt: string;
  cities: ICity[];
}

export interface ICity {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}
