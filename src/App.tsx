import * as React from "react";
import PropertyList from "./propertyList";
import {useEffect, useState} from "react";
import {Message, MessageType, PropertyStore} from "./types";
import {Container, DialogTitle} from "@material-ui/core";

function App() {
  const [properties, setProperties] = useState<PropertyStore>({});
  useEffect(() => {
    const loader = async () => {
      setProperties(await browser.runtime.sendMessage<Message, PropertyStore>({ type: MessageType.GET_PROPERTIES }))
    }
    loader().then();
  },[])

  const removeProperty = async (id: number) => {
    await browser.runtime.sendMessage<Message, void>({
      type: MessageType.CLEAR_PROPERTY,
      id,
    })
    setProperties(await browser.runtime.sendMessage<Message, PropertyStore>({ type: MessageType.GET_PROPERTIES }))
  }

  return (
    <div className="App" style={{width: 360}}>
      <DialogTitle>Hidden Properties</DialogTitle>
      <PropertyList properties={properties} removeProperty={removeProperty}/>
    </div>
  );
}

export default App;
