import React from "react";
import {localize} from "../../src";

const H2 = localize(<h2></h2>);
const Header = (props: { text: string }) => {
    return (
        <h2>{props.text}</h2>
    )
}

const LocalizedHeader = localize(Header, {
    targets: ["text"]
});

export function App() {
  return (
    <>
      <H2>i18n:hello-world</H2>
        <LocalizedHeader
            text={"i18n:test"}
        />
    </>
  )
}
