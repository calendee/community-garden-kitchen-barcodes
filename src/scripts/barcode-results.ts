function createProductRow(resultsBody, productInfo, counter) {
	const { barcode, status, info } = productInfo;
	const { title, brand, manufacturer, weight } = info;
	const oddEven = counter % 2 === 0 ? "odd" : "even";
	const rowData = [barcode, title, brand, manufacturer, weight, status];

	const newRow = resultsBody.insertRow(0);
	newRow.classList.add(oddEven === "odd" ? "bg-white" : "bg-gray-50");

	rowData.forEach((cellData, index) => {
		const newCell = newRow.insertCell();
		newCell.classList.add(
			"px-6",
			"py-4",
			"whitespace-nowrap",
			"text-sm",
			"font-medium",
			index === 0 ? "text-gray-700" : "text-gray-500",
		);

		const cellDataSpan = document.createElement("span");
		cellDataSpan.classList.add("inline-block", "max-ch");

		const cellText = document.createTextNode(cellData);
		cellDataSpan.appendChild(cellText);
		newCell.appendChild(cellDataSpan);
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
		createProductRow(resultsBody, event.detail, counter);

		if (counter === 0) {
			unhideResults();
		}
		counter = counter + 1;
	}

	document.addEventListener("scan-completed", handleScanEvent);
}
