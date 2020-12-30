import './App.css';
import React, { useEffect, useState } from "react";
import {MenuItem, 
  FormControl, 
  Select, 
  Card,
  CardContent} 
  from "@material-ui/core"; 
import InfoBox from "./components/InfoBox";
import WorldMap from "./components/WorldMap";
import Table from './components/Table';
import {prettyPrintStat, sortData} from "./components/util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([
    'Worldwide'
  ]);
  const [countryVal, setCountryVal] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796
  });
  // const [mapCenter, setMapCenter] = useState({
  //   lat: 33,
  //   lng: 65
  // });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


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


        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      })
    }

    getCountriesData();
  }, []);

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
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
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
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
          active={casesType === "recovered"}
          onClick={e => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
          active={casesType === "deaths"}
          onClick={e => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          ></InfoBox>
        </div>

        <div className="app__map">
          <WorldMap 
            countries={mapCountries} 
            casesType={casesType} 
            center={mapCenter} 
            zoom={mapZoom} />
        </div>
        
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table 
            countries={tableData}
          />
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
