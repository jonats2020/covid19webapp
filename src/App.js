import './App.css';
import React, { useEffect, useState } from "react";
import {MenuItem, 
  FormControl, 
  Select, 
  Card,
  CardContent} 
  from "@material-ui/core"; 
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";

function App() {

  const [countries, setCountries] = useState([
    'Worldwide'
  ]);
  const [countryVal, setCountryVal] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    // async -> send request, wait for it, do someting with the data

    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }))

        setTableData(data);
        setCountries(countries);
      })
    }

    getCountriesData();
  }, [countries]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    setCountryVal(countryCode);

    const url = countryCode === "Worldwide"
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountryVal(countryCode);
      setCountryInfo(data);

      console.log(data);
    });
  };

  return (
    <div className="app">
      
      <div className="app__left">
        
        <div className="app__header">
          
          <h1>COVID-19 DASHBOARD</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={countryVal}
              onChange={onCountryChange}
              >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
                 
              }
            </Select>
          </FormControl>
        </div>
      
        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>

        <div className="app__map">
          <Map />
        </div>
        
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* {Table} */}
          <Table 
            countries={tableData}
          />
          <h3>Worldwide New Cases</h3>
          {/* {Graph} */}
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
