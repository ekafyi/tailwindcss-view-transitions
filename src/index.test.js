const path = require("path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const viewTransitionsPlugin = require(".");

function run(config, css = "@tailwind utilities", plugin = tailwindcss) {
	let { currentTestName } = expect.getState();
	config = {
		...{ plugins: [viewTransitionsPlugin], corePlugins: { preflight: false } },
		...config,
	};

	return postcss(plugin(config)).process(css, {
		from: `${path.resolve(__filename)}?test=${currentTestName}`,
	});
}

describe("addBase", () => {
	const baseConfig = {
		content: [{ raw: String.raw`<div></div>` }],
		corePlugins: { preflight: true },
	};

	const noAnimation = String.raw`
@media (prefers-reduced-motion) {

  ::view-transition-group(*),::view-transition-old(*),::view-transition-new(*) {
    animation: none !important;
  }
}`;

	const rootBoth = String.raw`
::view-transition-old(root),::view-transition-new(root) {
  animation: none;
}`;

	const rootSeparate = String.raw`
::view-transition-old(root) {
  animation-duration: 1s;
}

::view-transition-new(root) {
  animation-duration: 3s;
}`;

	it("disableAllReduceMotion true", () => {
		const config = {
			...baseConfig,
			plugins: [viewTransitionsPlugin({ disableAllReduceMotion: true })],
		};
		return run(config, "@tailwind base; @tailwind utilities").then((result) => {
			expect(result.css).toContain(noAnimation);
		});
	});

	it("disableAllReduceMotion omitted", () => {
		const config = {
			...baseConfig,
			plugins: [viewTransitionsPlugin],
		};
		return run(config, "@tailwind base; @tailwind utilities").then((result) => {
			expect(result.css).not.toContain(noAnimation);
		});
	});

	it("styles - root both", () => {
		const config = {
			...baseConfig,
			plugins: [
				viewTransitionsPlugin({
					styles: {
						root: { animation: "none" },
					},
				}),
			],
		};
		return run(config, "@tailwind base; @tailwind utilities").then((result) => {
			expect(result.css).toContain(rootBoth);
		});
	});

	it("styles - root separate", () => {
		const config = {
			...baseConfig,
			plugins: [
				viewTransitionsPlugin({
					styles: {
						root: {
							old: { animationDuration: "1s" },
							new: { animationDuration: "3s" },
						},
					},
				}),
			],
		};
		return run(config, "@tailwind base; @tailwind utilities").then((result) => {
			expect(result.css).toContain(rootSeparate);
		});
	});
});

it("addUtilities", () => {
	const config = {
		content: [
			{
				raw: String.raw`
    <div class="vt-name-none"></div>`,
			},
		],
	};

	return run(config).then((result) => {
		expect(result.css).toMatchCss(String.raw`
      .vt-name-none {
        view-transition-name: none;
      }
    `);
	});
});

it("matchUtilities", () => {
	const classname = "vt-name-[foo]";
	const config = { content: [{ raw: String.raw`<div class="${classname}"></div>` }] };

	return run(config).then((result) => {
		expect(result.css).toMatchCss(String.raw`
      .vt-name-\[foo\] {
        view-transition-name: foo;
      }
    `);
	});
});
