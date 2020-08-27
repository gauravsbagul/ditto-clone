# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [0.4.1] - 2020-05-14

### Fixed

- Login for custom homeservers without well-known works again
- Updated WatermelonDB to fix a build error on iOS


## [0.4.0] - 2020-05-07

### Added

- Reactions support! 😄🎉
- Flipper support
- SQLStore to persist matrix-js-sdk data in an SQL database
- Add a visual hint if a message is sending or could not be sent
- Send pending messages when the connection to the homeserver is back
- Add Noto Color Emoji font for Android to streamline the emojis appearance

### Changed

- Update to React Native 0.62.2
- Make event messages slightly more inclusive
- Go back to using matrix-js-sdk as source of data to improve performance
- Remove Actions in services and use Observables properly
- Several improvements in components to have fewer re-renders and improve performance

### Removed

- Cleanup some unused modules, code and files
- Remove react-native-vector-icons

### Fixed

- Redacted events have a proper message
- Improved detection of emojis with emoji-regex
- Switched push gateway to https


## [v0.3.0] - 2020-02-29

### Added

- Infrastructure for iOS notifications (still under development)
- Swipe buttons with ability to leave chat room
- Data is stored on the device, you can now browse offline
- More helpful error messages on login failure
- Show a list of known users when creating a new chat
- Show if a chat has unread messages in chat list
- Send typing notifications
- Send read receipts
- Send clickable links from Ditto

### Changed

- Basically the whole UI - following the Eva Design System now
- Upgraded to React Navigation 5.0
- Changed state flow from Redux to Observables
- Changed data storage from AsyncStorage to WatermelonDB

### Fixed

- #53 Display cached messages during app launch
- #64 When there is a room invite, Ditto does not render the room list
- #65 When you're in a room and you send message from another client, message doesn't show up immediately
- #66 Inconsistent "most recent message" in the Chat List
- #69 yarn and creates error


## [v0.2.1] - 2020-01-28

### Added

- Simple typing indicators
- Linting with StandardJS rules

### Changed

- Auto-focus on first login input
- Smaller text on bottom navigation tabs

### Fixed

- Swipe to dismiss keyboard
- Android can swipe between Messages and Groups
- Show notifications on Android when the app is in the background
- Open the Chat Room when the app is launched with a notification
- Update the Chat Room when the roomId changes


## [v0.2.0] - 2020-01-21

### Added

- Ability to Create a New Room & Search for Users
- Notifications for Android
- Improved Timeline Rendering (support for m.notice)
- Settings Screen where you can change your avatar and display name and enable/disable notifications
- Privacy Policy

### Changed

- Color scheme is darker / night mode
- Improved Direct Message vs Group Detection
- Changed Gifted Chat for Custom Message Bubbles

### Fixed

- Various Visual Bugs


## [v0.1.7] - 2019-12-11

### Added

- Changelog.md
- Contributing.md
- Assets for Android release
- Modals for settings / create a room

### Changed

- Names in chats have higher contrast

### Fixed

- Blank screen on Android restart
- Message composer hidden behind Android keyboard
- Jumping to bottom of screen on load previous message


## [v0.1.6] - 2019-12-05

### Added

- Scripts for development
- Display avatars and display names
- Add Android launcher
- Receive images

### Changed

- Refined design


## [v0.0.5] - 2019-11-24

First release of the app

### Added

- Init React Native project
- Login with a Matrix account
- Send and receive messages
- App logo
- Set up CodePush


[Unreleased]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.4.1...dev
[v0.4.1]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.4.0...0.4.1
[v0.4.0]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.3.0...0.4.0
[v0.3.0]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.2.1...0.3.0
[v0.2.1]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.2.0...0.2.1
[v0.2.0]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.1.7...0.2.0
[v0.1.7]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.1.6...0.1.7
[v0.1.6]: https://gitlab.com/ditto-chat/ditto-mobile/compare/0.0.5...0.1.6
[v0.0.5]: https://gitlab.com/ditto-chat/ditto-mobile/-/tags/0.0.5
