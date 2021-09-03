import { handleBarcodeForm } from "./barcode-form";
import { StatePubSub } from "./state-pub-sub";

import { InitialBarcodeState } from "../typings";

// TODO: Generate this puppy
const SESSION_ID = "";

const initialBarcodeState: InitialBarcodeState = {};
const barcodeState = new StatePubSub(initialBarcodeState);
const resultsBody: HTMLTableElement["tBodies"][0] =
	document.querySelector("#results-body");

handleBarcodeForm();

export { barcodeState, resultsBody };
