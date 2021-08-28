// From https://gist.github.com/calendee/b934b15d36e43782df3c2271f32801d8
export function asyncWrapper<T>(somePromise: Promise<T>) {
	return somePromise
		.then((data) => ({ error: null, data }))
		.catch((error) => {
			return { error: { message: error.message }, data: null };
		});
}

export async function fetchJson(
	input: RequestInfo,
	init?: RequestInit | undefined,
) {
	const { error, data: response } = await asyncWrapper(fetch(input, init));

	if (error) {
		return { data: null, error };
	}

	const contentType = response?.headers?.get("content-type");

	if (!contentType?.includes("application/json")) {
		if (response.status === 404) {
			return { data: null, error: { message: "Not Found", status: 404 } };
		}

		return { data: null, error: { message: "Server Error", status: 404 } };
	}

	const json = await response?.json();
	return { data: json, error };
}

export function createProductRow(resultsBody, productInfo, counter) {
	const { barcode, status, info } = productInfo;
	const { title, brand, manufacturer, weight } = info;
	const oddEven = counter % 2 === 0 ? "odd" : "even";
	const rowData = [barcode, title, brand, manufacturer, weight, status];

	const newRow = resultsBody.insertRow(0);
	newRow.classList.add(oddEven === "odd" ? "bg-white" : "bg-gray-50");

	rowData.forEach((cellData, index) => {
		let color = index === 0 ? "text-gray-700" : "text-gray-500";
		color = status.toLowerCase() !== "success" ? "text-red-600" : color;

		const newCell = newRow.insertCell();
		newCell.classList.add(
			"px-6",
			"py-4",
			"whitespace-nowrap",
			"text-sm",
			"font-medium",
			color,
		);

		const cellDataSpan = document.createElement("span");
		cellDataSpan.classList.add("inline-block", "max-ch");

		const cellText = document.createTextNode(cellData);
		cellDataSpan.appendChild(cellText);
		newCell.appendChild(cellDataSpan);
	});
}

export function unhideResults() {
	const resultsElement = document.getElementById("results");
	resultsElement.classList.remove("hidden");
}
