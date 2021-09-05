import { handleBarcodeForm } from "./barcode-form";
import { StatePubSub } from "./state-pub-sub";
import { handleScanModeChanges } from "./handle-scan-mode-changes";

import { InitialBarcodeState, InitialScanModeState } from "../typings";

const initialBarcodeState: InitialBarcodeState = {};
const initialScanModeState: InitialScanModeState = { mode: "single" };
const barcodeState = new StatePubSub(initialBarcodeState);
const scanModeState = new StatePubSub(initialScanModeState);
const resultsBody: HTMLTableElement["tBodies"][0] =
	document.querySelector("#results-body");

handleBarcodeForm();
handleScanModeChanges();

export { barcodeState, resultsBody, handleScanModeChanges, scanModeState };
