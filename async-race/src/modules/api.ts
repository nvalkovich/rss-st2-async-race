import { CarData } from '../types/interfaces';

class Api {
  private baseURL: string;

  private path:{ [key: string]: string };

  constructor() {
    this.baseURL = 'http://127.0.0.1:3000';
    this.path = {
      garage: '/garage',
    };
  }

  public async createCar(data: CarData | object = {}):Promise<[CarData]> {
    const response = await fetch(`${this.baseURL}${this.path.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public async getCars():Promise<[CarData]> {
    const queryString = (queryParams: { key : string, value: string }[]): string => {
      let string = '';
      if (queryParams.length) {
        string = `?${
          queryParams.map((x):string => `${x.key}=${x.value}`).join('&')}`;
      }
      console.log('str', string);
      return string;
    };

    const query = queryString([{ key: 'page', value: '1' }, { key: 'limit', value: '1' }]);
    const response: Response = await fetch(`${this.baseURL}${this.path.garage}${query}`);
    const data = response.json();
    return data;
  }
}

export default Api;