declare function plugin(
	// FIXME styles
	options?: Partial<{ disableAllReduceMotion: boolean; styles: {} }>,
): {
	handler: () => void;
};

declare namespace plugin {
	const __isOptionsFunction: true;
}

export = plugin;
