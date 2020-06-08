import * as React from "react";
import PropertyList from "./propertyList";
import {useEffect, useState} from "react";
import {clearProperty, getProperties} from "./storage";
import {PropertyStore} from "./types";

function App() {
  const [properties, setProperties] = useState<PropertyStore>({});
  useEffect(() => {
    const loader = async () => {
      setProperties(await getProperties())
    }
    loader();
  },[properties, setProperties])

  const removeProperty = async (id: number) => {
    await clearProperty(id);
    setProperties(await getProperties())
  }

  return (
    <div className="App">
      <PropertyList properties={properties} removeProperty={removeProperty}/>
    </div>
  );
}

export default App;
