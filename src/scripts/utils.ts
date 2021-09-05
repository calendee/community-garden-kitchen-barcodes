import { barcodeState } from ".";
import { resultsBody } from ".";

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

export function processBarcodes(barcodes: string[]) {
	// @ts-ignore
	const API_URL = `${import.meta.env.SNOWPACK_PUBLIC_API_URL}`;

	barcodes.forEach(async (barcode) => {
		const currentBarcodeInfo = barcodeState.getKey(barcode);

		if (currentBarcodeInfo) {
			barcodeState.setKey(barcode, {
				...currentBarcodeInfo,
				quantity: currentBarcodeInfo.quantity + 1,
			});
		} else {
			// TODO: Why isn't the callback results getting the typing?
			barcodeState.subscribe(barcode, function subscribeCallback(results) {
				const existingRow = fetchRow(barcode);

				if (existingRow) {
					const newRow = generateRow(results);

					existingRow.classList.forEach((existingClass) => {
						newRow.classList.add(existingClass);
					});
					existingRow.replaceWith(newRow);
				} else {
					const oddOrEven = resultsBody.rows.length % 2 === 0 ? "even" : "odd";
					const row = generateRow({ ...results, oddOrEven });

					if (resultsBody.rows.length) {
						const firstRow = resultsBody.firstChild;
						resultsBody.insertBefore(row, firstRow);
					} else {
						resultsBody.appendChild(row);
					}
				}
			});

			barcodeState.setKey(barcode, {
				barcode,
				status: "pending",
				quantity: 1,
			});

			const response = await fetchJson(`${API_URL}api/barcode/${barcode}`);
			const { data: productInfo, error } = response;
			barcodeState.setKey(barcode, {
				...productInfo.info,
				status: error || productInfo.error ? "fail" : "success",
			});
		}
	});
}
