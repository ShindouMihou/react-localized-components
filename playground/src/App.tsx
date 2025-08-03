import React from "react";
import {localize} from "./localizations";

const H2 = localize(<h2></h2>, "children");
const Header = (props: { text: string }) => {
    return (
        <h2>{props.text}</h2>
    )
}

const LocalizedHeader = localize(Header, "text");

export function App() {
  return (
    <>
        <p>test</p>
      <H2>i18n:title</H2>
        <LocalizedHeader
            text={"i18n:description"}
        />
    </>
  )
}
