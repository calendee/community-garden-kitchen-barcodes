import { scanModeState } from ".";
import { InitialScanModeState } from "../typings";

export function handleScanModeChanges() {
	const scanModeSingleButton = document.getElementById("scan-mode-single");
	const scanModeBatchButton = document.getElementById("scan-mode-batch");
	const barCodeFormSingle = document.getElementById("barcode-form-single");
	const barCodeFormBatch = document.getElementById("barcode-form-batch");

	function getSelectedMode(event): InitialScanModeState["mode"] {
		const target = event.target.id;
		return target.replace("scan-mode-", "");
	}

	function switchFormContents(mode) {
		const addSelectedModeEl =
			mode === "single" ? barCodeFormBatch : barCodeFormSingle;
		const removeSelectedModeEl =
			mode === "single" ? barCodeFormSingle : barCodeFormBatch;

		addSelectedModeEl.classList.add("hidden");
		removeSelectedModeEl.classList.remove("hidden");

		const formField: HTMLInputElement | HTMLTextAreaElement =
			removeSelectedModeEl.querySelector("input, textarea");

		setTimeout(() => {
			formField.focus();
			formField.value = "";
		});
	}

	function switchModeButtons(mode) {
		const addSelectedModeEl =
			mode === "single" ? scanModeSingleButton : scanModeBatchButton;
		const removeSelectedModeEl =
			mode === "single" ? scanModeBatchButton : scanModeSingleButton;

		addSelectedModeEl.classList.add("selected-scan-mode");
		removeSelectedModeEl.classList.remove("selected-scan-mode");
	}

	function handleModeSwitch(event) {
		event.preventDefault();
		const newMode = getSelectedMode(event);

		scanModeState.setKey("mode", newMode);
		switchModeButtons(newMode);
		switchFormContents(newMode);
	}

	scanModeSingleButton.addEventListener("click", handleModeSwitch);
	scanModeBatchButton.addEventListener("click", handleModeSwitch);
}
