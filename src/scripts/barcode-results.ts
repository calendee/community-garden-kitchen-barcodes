function createProductRow(resultsBody, productInfo) {
	const { barcode, status, info } = productInfo;
	const { title, brand, manufacturer, weight } = info;
	const newRow = resultsBody.insertRow(0);
	const rowData = [barcode, title, brand, manufacturer, weight, status];

	rowData.forEach((cellData) => {
		const newCell = newRow.insertCell();
		const cellText = document.createTextNode(cellData);
		newCell.appendChild(cellText);
	});
}

function unhideResults() {
	const resultsElement = document.getElementById("results");
	resultsElement.classList.remove("hidden");
}

export function processBarcodeResults() {
	const resultsBody = document.getElementById("results-body");
	let counter = 0;
	function handleScanEvent(event) {
		createProductRow(resultsBody, event.detail);

		if (counter === 0) {
			unhideResults();
			counter = counter + 1;
		}
	}

	document.addEventListener("scan-completed", handleScanEvent);
}
