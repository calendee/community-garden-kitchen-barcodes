import { fetchJson, unhideResults, fetchRow, generateRow } from "./utils";
import { resultsBody } from ".";
import { barcodeState } from ".";

let FIRST_SCAN_COMPLETED = false;

interface FormElements extends HTMLFormControlsCollection {
	barcode: HTMLInputElement;
}

interface BarcodeFormElement extends HTMLFormElement {
	readonly elements: FormElements;
}

interface SubmitEvent extends Event {
	readonly target: BarcodeFormElement;
}

export function handleBarcodeForm() {
	// @ts-ignore
	const API_URL = `${import.meta.env.SNOWPACK_PUBLIC_API_URL}`;
	const barcodeField = document.getElementById("barcode");
	barcodeField.focus();

	async function handleSubmit(event: SubmitEvent) {
		if (!FIRST_SCAN_COMPLETED) {
			unhideResults();
			FIRST_SCAN_COMPLETED = true;
		}

		event.preventDefault();
		const barcodeElement = event.target.elements.barcode;
		const barcode = barcodeElement?.value?.trim();

		if (!barcode) {
			alert("Please enter a valid barcode");
		}

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

		barcodeElement.value = "";
		barcodeElement.focus();
	}

	const barCodeForm = document.getElementById(
		"barcode-form",
	) as BarcodeFormElement;
	barCodeForm?.addEventListener("submit", handleSubmit);
}
