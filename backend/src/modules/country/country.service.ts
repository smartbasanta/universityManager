import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CountryService {
  private baseUrl = 'https://restcountries.com/v3.1';

  async findAll() {
    const { data } = await axios.get(`${this.baseUrl}/all`);
    return data.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));
  }

  async findOneByCode(code: string) {
    try {
      const { data } = await axios.get(`${this.baseUrl}/alpha/${code}`);
      const country = data[0];

      return {
        name: country.name.common,
        code: country.cca2,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        population: country.population,
        flag: country.flags?.png || country.flags?.svg,
      };
    } catch (error) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }
  }
}
