import * as React from "react";
import PropertyList from "./propertyList";
import {useEffect, useState} from "react";
import {getProperties} from "./storage";
import {PropertyStore} from "./types";

function App() {
  const [properties, setProperties] = useState<PropertyStore>({});
  useEffect(() => {
    const loader = async () => {
      setProperties(await getProperties())
    }
    loader();
  },[properties, setProperties])

  return (
    <div className="App">
      <PropertyList properties={properties}/>
    </div>
  );
}

export default App;
