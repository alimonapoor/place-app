import React, { Component } from "react";
import DefaultInput from "../ui/default-input/defaultInput";

const placeInput = (props) => (
  <DefaultInput 
      placeholder = "Place Name"
      value={props.placeData}
      onChangeText={props.onChangeText}
    />
)


export default placeInput;
