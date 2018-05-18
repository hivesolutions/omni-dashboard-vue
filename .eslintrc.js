module.exports = {
    "extends": "standard",
    "plugins": ["mocha"],
    "rules": {
        "indent": ["warn", 4, {
            SwitchCase: 1
        }],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", "never"],
        "mocha/no-exclusive-tests": "error",
        "no-debugger": "warn"
    },
    "env": {
        "jasmine": true
    }
};
