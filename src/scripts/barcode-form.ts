import { fetchJson } from "../utils";

interface FormElements extends HTMLFormControlsCollection {
	barcode: HTMLInputElement;
}

interface BarcodeFormElement extends HTMLFormElement {
	readonly elements: FormElements;
}

interface SubmitEvent extends Event {
	readonly target: BarcodeFormElement;
}

export function barcodeFormHandler() {
	// @ts-ignore
	const API_URL = `${import.meta.env.SNOWPACK_PUBLIC_API_URL}`;
	const barcodeField = document.getElementById("barcode");
	barcodeField.focus();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const barcodeElement = event.target.elements.barcode;
		const barcode = barcodeElement?.value;

		if (!barcode) {
			alert("Please enter a valid barcode");
		}

		const response = await fetchJson(`${API_URL}api/barcode/${barcode}`);
		const { data: productInfo, error } = response;
		const newEvent = new CustomEvent("scan-completed", {
			detail: {
				...productInfo,
				error:
					error || productInfo.error ? "Failed to fetch product info." : null,
			},
		});

		document.dispatchEvent(newEvent);
		barcodeElement.value = "";
		barcodeElement.focus();
	}

	const barCodeForm = document.getElementById(
		"barcode-form",
	) as BarcodeFormElement;
	barCodeForm?.addEventListener("submit", handleSubmit);
}
barcodeFormHandler();
