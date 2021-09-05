import { processBarcodes, unhideResults } from "./utils";

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
		const barcodeBatchElement = event.target.elements["barcode-batch"];
		const barcodeBatch = barcodeBatchElement?.value?.trim();

		const barcodes = barcode ? [barcode] : barcodeBatch.split("\n");

		if (!barcodes.length) {
			alert("Please enter a valid barcode");
		}

		processBarcodes(barcodes);

		barcodeElement.value = "";
		barcodeElement.focus();
	}

	const barCodeForm = document.getElementById(
		"barcode-form",
	) as BarcodeFormElement;
	barCodeForm?.addEventListener("submit", handleSubmit);
}
