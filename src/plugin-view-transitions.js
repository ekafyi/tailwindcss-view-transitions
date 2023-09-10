const plugin = require("tailwindcss/plugin");

const DEFAULT_OPTIONS = { disableAllReduceMotion: false, styles: {} };

const getVTBaseStyles = (stylesOption) => {
	const base = {};
	Object.entries(stylesOption).forEach((arr) => {
		const [vtName, value] = arr;
		if (typeof vtName === "string" && Object.entries(value)?.length) {
			const propOld = `::view-transition-old(${vtName})`;
			const propNew = `::view-transition-new(${vtName})`;
			const propOldNew = `${propOld},${propNew}`;

			Object.entries(value).forEach(([key, val]) => {
				if (key === "old") {
					base[propOld] = val;
				} else if (key === "new") {
					base[propNew] = val;
				} else {
					base[propOldNew] = Object.fromEntries([[key, val]]);
				}
			});
		}
	});
	return base;
};

const getReduceMotionBaseStyles = (disableRoot = false) => {
	const disableStyle = {
		"@media (prefers-reduced-motion)": {
			"::view-transition-group(*),::view-transition-old(*),::view-transition-new(*)": {
				animation: "none !important",
			},
		},
	};
	return disableRoot ? disableStyle : {};
};

const getTransitionNameUtils = () => {
	const FORBIDDEN_NAMES = ["root"];
	const FORBIDDEN_WARNING = `[WARNING] Remove the ".vt-name-[root]" CSS class. "root" is reserved for document-level ::view-transition element.`;
	return {
		"vt-name": (value) => {
			if (FORBIDDEN_NAMES.includes(value)) {
				console.warn(FORBIDDEN_WARNING);
			}
			return { viewTransitionName: value };
		},
	};
};

const callback = ({ disableAllReduceMotion, styles = {} } = DEFAULT_OPTIONS) => {
	/** @param {import('tailwindcss/types/config').PluginAPI} */
	const returnedFn = ({ addBase, addUtilities, matchUtilities }) => {
		/**
		 * Register new dynamic utility styles
		 * @link https://tailwindcss.com/docs/plugins#dynamic-utilities
		 */
		matchUtilities(getTransitionNameUtils());

		/**
		 * Register new static utility styles
		 * @link https://tailwindcss.com/docs/plugins#static-utilities
		 */
		addUtilities([
			{
				".vt-name-none": { "view-transition-name": "none" },
			},
		]);

		/**
		 * Register new base styles
		 * @link https://tailwindcss.com/docs/plugins#adding-base-styles
		 */
		const baseStyles = {
			...getReduceMotionBaseStyles(disableAllReduceMotion),
			...getVTBaseStyles(styles),
		};
		addBase(baseStyles);
	};
	return returnedFn;
};

const twViewTransitions = plugin.withOptions(callback);

module.exports = twViewTransitions;
