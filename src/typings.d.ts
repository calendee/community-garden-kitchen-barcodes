export type BarcodeInfo = {
	barcode: string;
	name?: string;
	brand?: string;
	manufacturer?: string;
	weight?: string;
	status: "pending" | "success" | "fail";
	quantity: number;
};

export type InitialBarcodeState = {
	[barcode: string]: BarcodeInfo;
};

export type InitialScanModeState = {
	mode: "single" | "batch";
};
