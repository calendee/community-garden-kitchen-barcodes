import { barcodeState } from ".";
import copy from "copy-to-clipboard";

async function copyBarcodeData() {
	const entries = Object.entries(barcodeState.state);
	const formattedTextarea = document.getElementById("excel-formatted-text");
	const data = entries
		.map((record, index) => {
			const { barcode, quantity, brand, title, weight } = record[1];
			const cleanBrand = brand?.replace(",", "");
			const cleanTitle = title?.replace(",", "");
			if (index === 0) {
				return `barcode\tquantity\tTitle\tBrand\tweight\n${barcode}\t${quantity}\t${cleanTitle}\t${cleanBrand}\t${weight}`;
			}

			return `${barcode}\t${quantity}\t${cleanTitle}\t${cleanBrand}\t${weight}`;
		})
		.join("\n");

	formattedTextarea.textContent = data;

	copy(formattedTextarea.value, {
		message: "Barcode data copied to clipboard.",
	});
}

export function handleCopyButton() {
	const copyButton = document.getElementById("copy-button");

	copyButton.addEventListener("click", copyBarcodeData);
}
