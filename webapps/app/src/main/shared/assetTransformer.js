// This is a jest transformer for mocking imports of the form
// require("some-file.pdf") in tests
// See jest.config.js for usage
module.exports = {
    process(src, filename) {
        return `module.exports = '${filename}';`;
    }
};
