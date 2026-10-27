# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

* Year-on-year comparison on every store card row - [#5](https://github.com/hivesolutions/omni-dashboard-vue/issues/5)
* Unit tests with coverage reports
* Docker image builds and infra-local deployment on every push - [#7](https://github.com/hivesolutions/omni-dashboard-vue/issues/7)
* Tests and build checked on every push across supported Node.js versions - [#9](https://github.com/hivesolutions/omni-dashboard-vue/issues/9)
* Drag the store cards with a finger or the mouse to move between stores - [#13](https://github.com/hivesolutions/omni-dashboard-vue/issues/13)
* Number keys 1-9 jump to the matching store card - [#13](https://github.com/hivesolutions/omni-dashboard-vue/issues/13)

### Changed

* Tighter spacing between the history rows of the store cards - [#13](https://github.com/hivesolutions/omni-dashboard-vue/issues/13)

### Fixed

* Production build failing on fresh installs
* Docker image build failing on the unsupported Node.js 14 repository - [#7](https://github.com/hivesolutions/omni-dashboard-vue/issues/7)
* Blank page in production builds - [#10](https://github.com/hivesolutions/omni-dashboard-vue/issues/10)
* Multi-platform Docker image build failing on 32-bit ARM - [#10](https://github.com/hivesolutions/omni-dashboard-vue/issues/10)

## [0.2.0] - 2023-02-15

### Changed

* Changed repository name
* Started using `omni-api-js` package

### Fixed

* Small issue related to the ordering of the "Global" store
* Issue related to the loading of the login page
* Error handling problems

## [0.1.2] - 2022-11-09

### Fixed

* Compress issue with minimizer and Vue.js 3

## [0.1.1] - 2022-11-08

### Fixed

* Improved error handling in login, fixed usability issue

## [0.1.0] - 2022-11-08

### Added

* Initial working version 🙌
* Support for Vue3 added
* Deprecated old carousel component
