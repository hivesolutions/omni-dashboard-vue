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
* Settings for the comparison, number format, opening view, history rows and refresh - [#25](https://github.com/hivesolutions/omni-dashboard-vue/issues/25)
* Language setting with a Portuguese translation - [#27](https://github.com/hivesolutions/omni-dashboard-vue/issues/27)
* Copy a store card as an image to share - [#29](https://github.com/hivesolutions/omni-dashboard-vue/issues/29)

### Changed

* Tighter spacing between the history rows of the store cards - [#13](https://github.com/hivesolutions/omni-dashboard-vue/issues/13)
* Every deploy loads fresh copies of the scripts and icons - [#19](https://github.com/hivesolutions/omni-dashboard-vue/issues/19)
* Login restyled to match the settings - [#25](https://github.com/hivesolutions/omni-dashboard-vue/issues/25)

### Fixed

* Production build failing on fresh installs
* Docker image build failing on the unsupported Node.js 14 repository - [#7](https://github.com/hivesolutions/omni-dashboard-vue/issues/7)
* Blank page in production builds - [#10](https://github.com/hivesolutions/omni-dashboard-vue/issues/10)
* New deployments taking up to a day to reach browsers - [#17](https://github.com/hivesolutions/omni-dashboard-vue/issues/17)
* Multi-platform Docker image build failing on 32-bit ARM - [#10](https://github.com/hivesolutions/omni-dashboard-vue/issues/10)
* Repeated and skipped day rows around daylight saving changes - [#14](https://github.com/hivesolutions/omni-dashboard-vue/issues/14)
* Icons not picking up changes from new deploys - [#19](https://github.com/hivesolutions/omni-dashboard-vue/issues/19)
* Open Sans web fonts failing to load - [#20](https://github.com/hivesolutions/omni-dashboard-vue/issues/20)
* Warnings in the Docker image builds - [#23](https://github.com/hivesolutions/omni-dashboard-vue/issues/23)
* Settings rows losing their spacing on phones - [#31](https://github.com/hivesolutions/omni-dashboard-vue/issues/31)

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
