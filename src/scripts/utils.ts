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
	return { data: json, error: null };
}

export function fetchRow(barcode: string) {
	return document.getElementById(barcode);
}

export function generateRow({
	barcode,
	brand,
	status,
	manufacturer,
	oddOrEven,
	quantity,
	title,
	weight,
}) {
	const row = document.createElement("tr");
	row.id = barcode;
	row.classList.add(oddOrEven === "even" ? "bg-white" : "bg-gray-50");

	const rowData = [
		{ field: "barcode", value: barcode },
		{ field: "quantity", value: quantity },
		{ field: "title", value: title },
		{ field: "brand", value: brand },
		{ field: "manufacturer", value: manufacturer },
		{ field: "weight", value: weight },
		{ field: "status", value: status },
	];

	rowData.forEach(({ field, value }, index) => {
		let color = index === 0 ? "text-gray-700" : "text-gray-500";
		color = status.toLowerCase() !== "success" ? "text-red-600" : color;
		color = status.toLowerCase() === "pending" ? "text-indigo-600" : color;

		const newCell = row.insertCell();
		newCell.classList.add(
			"px-6",
			"py-4",
			"whitespace-nowrap",
			"text-sm",
			"font-medium",
			color,
			field === "status" ? "capitalize" : null,
		);

		const cellDataSpan = document.createElement("span");
		cellDataSpan.classList.add("inline-block", "max-ch");
		// Use textContent to escape HTML
		cellDataSpan.textContent = value;
		newCell.appendChild(cellDataSpan);
	});

	return row;
}

export function unhideResults() {
	const resultsElement = document.getElementById("results");
	resultsElement.classList.remove("hidden");
}
