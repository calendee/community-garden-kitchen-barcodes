import { fetchJson } from "../utils";
export async function barCodeFormHandler() {
	const API_URL = `${import.meta.env.SNOWPACK_PUBLIC_API_URL}`;

	function handleSubmit(event) {
		event.preventDefault();
		const barCodeElem = document.getElementById("bar-code");
		const barCode = barCodeElem?.value;

		if (!barCodeElem || !barCode) {
			// TODO: Fire an event for this
		}

		const data = fetchJson(`${API_URL}${barCode}`);
		console.log("Barcode data");
		console.log(JSON.stringify(data, null));

		const newEvent = new CustomEvent("scan-completed", {
			detail: {
				barCode,
			},
		});

		document.dispatchEvent(newEvent);
		barCodeElem.value = "";
		barCodeElem.focus();
	}

	const barCodeForm = document.getElementById("barcode-form");
	barCodeForm?.addEventListener("submit", handleSubmit);
}
barCodeFormHandler();
