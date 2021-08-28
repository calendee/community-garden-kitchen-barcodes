import { createProductRow, unhideResults } from "./utils";

export function processBarcodeResults() {
	const resultsBody = document.getElementById("results-body");
	let counter = 0;
	function handleScanEvent(event) {
		createProductRow(resultsBody, event.detail, counter);

		if (counter === 0) {
			unhideResults();
		}
		counter = counter + 1;
	}

	document.addEventListener("scan-completed", handleScanEvent);
}
