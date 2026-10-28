const assert = require("assert");
const path = require("path");
const fileLoader = require("file-loader");

const root = path.join(__dirname, "..");
const assets = path.join(root, "src", "components", "store", "assets");

const build = function(timestamp) {
    const now = Date.now;
    Date.now = () => timestamp;
    try {
        delete require.cache[require.resolve("../webpack.config")];
        return require("../webpack.config");
    } finally {
        Date.now = now;
    }
};

const assetUrl = function(config, resourcePath) {
    const rule = config.module.rules.find(rule => rule.test.test(resourcePath));
    const options = (rule.use ? rule.use[0] : rule).options;
    const emitted = [];
    const source = fileLoader.call(
        {
            query: options,
            rootContext: root,
            resourcePath: resourcePath,
            emitFile: name => emitted.push(name)
        },
        Buffer.from("")
    );
    assert.strictEqual(
        source,
        `module.exports = __webpack_public_path__ + ${JSON.stringify(emitted[0])};`
    );
    return emitted[0];
};

describe("Webpack Config", function() {
    describe("#output.filename", function() {
        it("should add the build timestamp to the bundle URL", () => {
            const config = build(1793171262000);
            assert.strictEqual(config.output.filename, "bundle.js?1793171262000");
        });
        it("should take the build timestamp when the config is loaded", () => {
            const before = Date.now();
            delete require.cache[require.resolve("../webpack.config")];
            const config = require("../webpack.config");
            const after = Date.now();
            const [name, timestamp] = config.output.filename.split("?");
            assert.strictEqual(name, "bundle.js");
            assert.strictEqual(String(parseInt(timestamp)), timestamp);
            assert.strictEqual(parseInt(timestamp) >= before, true);
            assert.strictEqual(parseInt(timestamp) <= after, true);
        });
        it("should change the bundle URL on every build", () => {
            assert.strictEqual(build(1793171262000).output.filename, "bundle.js?1793171262000");
            assert.strictEqual(build(1793257662000).output.filename, "bundle.js?1793257662000");
        });
    });

    describe("#module.rules", function() {
        it("should add the build timestamp to the HTML file URLs", () => {
            const config = build(1793171262000);
            const resourcePath = path.join(root, "src", "page.html");
            assert.strictEqual(assetUrl(config, resourcePath), "page.html?1793171262000");
        });
        it("should add the build timestamp to the image URLs", () => {
            const config = build(1793171262000);
            assert.strictEqual(
                assetUrl(config, path.join(assets, "refresh.svg")),
                "refresh.svg?1793171262000"
            );
            assert.strictEqual(
                assetUrl(config, path.join(assets, "logout.svg")),
                "logout.svg?1793171262000"
            );
            assert.strictEqual(
                assetUrl(config, path.join(root, "src", "assets", "images", "icon.play.png")),
                "icon.play.png?1793171262000"
            );
        });
        it("should change the image URLs on every build", () => {
            const resourcePath = path.join(assets, "refresh.svg");
            assert.strictEqual(
                assetUrl(build(1793171262000), resourcePath),
                "refresh.svg?1793171262000"
            );
            assert.strictEqual(
                assetUrl(build(1793257662000), resourcePath),
                "refresh.svg?1793257662000"
            );
        });
    });
});
