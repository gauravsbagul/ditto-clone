<div align="center">

<a href="https://gitlab.com/ditto-chat/ditto-mobile/tree/dev">
    <img src="https://gitlab.com/ditto-chat/ditto-mobile/raw/dev/fastlane/metadata/android/en-US/images/featureGraphic.png" width="600" alt="Ditto Chat" />
</a>


[![Version](https://img.shields.io/badge/dynamic/json?color=820db6&label=version&query=%24%5B0%5D.tag_name&url=https%3A%2F%2Fgitlab.com%2Fapi%2Fv4%2Fprojects%2Fditto-chat%252Fditto-mobile%2Freleases)](https://gitlab.com/ditto-chat/ditto-mobile/-/releases)
[![License - Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-352b60)](https://gitlab.com/ditto-chat/ditto-mobile/blob/dev/LICENSE)

[![Discover - dittochat.org](https://img.shields.io/badge/discover-dittochat.org-820db6)](https://dittochat.org/)
[![Chat - #ditto:ditto.chat](https://img.shields.io/badge/chat-%23ditto%3Aditto.chat-402f8f)](https://matrix.to/#/#ditto:ditto.chat)
[![Give - Feedback](https://img.shields.io/badge/give-feedback-352b60)](https://plan.dittochat.org/)
[![Help - Contribute](https://img.shields.io/badge/help-contribute-820db6)](https://gitlab.com/ditto-chat/ditto-mobile/blob/dev/CONTRIBUTING.md)

---

<h3>
    <a href="#get-ditto"><b>Get Ditto</b></a> &bull;
    <a href="#setup"><b>Setup</b></a> &bull;
    <a href="#run-locally"><b>Run Locally</b></a> &bull;
    <a href="#build"><b>Build</b></a> &bull;
    <a href="#troubleshooting"><b>Troubleshooting</b></a>
</h3>

</div>


## Get Ditto

<table>
    <thead>
        <tr align="center">
            <th width=300>iOS</th>
            <th width=300>Android</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td>[Testflight](https://testflight.apple.com/join/9M0ERlKd)</td>
            <td>[Play Store](https://play.google.com/store/apps/details?id=com.elequin.ditto)  &bull;  [APK](https://gitlab.com/ditto-chat/ditto-mobile/raw/dev/android/app/release/ditto.apk)</td>
        </tr>
    </tbody>
</table>


## Setup

### Prerequisites

<table>
    <thead>
        <tr align="center">
            <th width=300>iOS</th>
            <th width=300>Android</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td colspan=2>[Node.js](https://nodejs.org/)</td>
        </tr>
        <tr align="center">
            <td colspan=2>[Yarn](https://yarnpkg.com/)</td>
        </tr>
        <tr align="center">
            <td colspan=2>[Watchman](https://facebook.github.io/watchman/) (only for development)</td>
        </tr>
        <tr align="center">
            <td>XCode Command Line Tools</td>
            <td>Android Studio and the Android SDK</td>
        </tr>
    </tbody>
</table>

### Procedure

<table>
    <thead>
        <tr align="center">
            <th width=40></th>
            <th width=280>iOS</th>
            <th width=280>Android</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td>1</td>
            <td colspan=2>Clone the project<br /><i>Note: If you want to work on the latest stable version, checkout the latest tag</td>
        </tr>
        <tr align="center">
            <td>2</td>
            <td colspan=2>[Set up additional features if needed](#additional-steps)</td>
        </tr>
        <tr align="center">
            <td>3</td>
            <td colspan=2>Run <code>yarn</code> in root directory</td>
        </tr>
        <tr align="center">
            <td>4</td>
            <td width=280>In root directory, run:<br /><code>cd ios && pod install && cd ..</code></td>
            <td width=280>N/A</td>
        </tr>
    </tbody>
</table>

### Additional steps

To access some of the features of Ditto, additional configuration may be needed:

<table>
    <tbody>
        <tr align="center">
            <td colspan=3><b>Notifications (required on Android)</b></td>
        </tr>
        <tr align="center">
            <td width=40>1</td>
            <td width=280 rowspan="2">N/A</td>
            <td width=280>Set up [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/android/client)<br />and copy the <code>google-services.json</code> file in <code>android/app/</code></td>
        </tr>
        <tr align="center">
            <td>2</td>
            <td>Set up a [Matrix Push Gateway](https://github.com/matrix-org/sygnal)<br />and set the <code>MATRIX_PUSH_GATEWAY</code> variables in a <code>.env</code> file according to the sample</td>
        </tr>
    </tbody>
</table>


## Run Locally

<table>
    <thead>
        <tr align="center">
            <th width=40></th>
            <th width=280>iOS</th>
            <th width=280>Android</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td>1</td>
            <td colspan=2>[Set up the project](#setup)</td>
        </tr>
        <tr align="center">
            <td>2</td>
            <td colspan=2>Run <code>yarn start</code></td>
        </tr>
        <tr align="center">
            <td>3</td>
            <td colspan=2>Open another terminal</td>
        </tr>
        <tr align="center">
            <td rowspan=2>4</td>
            <td rowspan=2>Run <code>yarn ios</code><br /><i>Note: <code>yarn ios</code> runs iPhone 11 Pro by default - you may need to [change this](https://facebook.github.io/react-native/docs/running-on-simulator-ios#specifying-a-device) depending on what simulators you have installed.</i></td>
            <td>[Launch an Android virtual device](https://developer.android.com/studio/run/emulator) or [connect an Android device with adb](https://developer.android.com/studio/run/device)</td>
        </tr>
        <tr align="center">
            <td>Run <code>yarn and</code></td>
        </tr>
    </tbody>
</table>


## Build

### Steps to Run

<table>
    <thead>
        <tr align="center">
            <th width=40></th>
            <th width=280>iOS</th>
            <th width=280>Android</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td>1</td>
            <td colspan=2>[Set up the project](#setup)</td>
        </tr>
        <tr align="center">
            <td>2</td>
            <td colspan=2>Run <code>yarn convert</code></td>
        </tr>
        <tr align="center">
            <td rowspan=4>3</td>
            <td rowspan=4>[Run the app on a device](https://help.apple.com/xcode/mac/current/#/dev5a825a1ca)</td>
            <td><b>Graphical</b></td>
        </tr>
        <tr align="center">
            <td>Launch Android Studio and open the <code>android</code> folder<br />Select <code>Build</code> > <code>Generate Signed Bundle / APK…</code> and follow the dialogs</td>
        </tr>
        <tr align="center">
            <td><b>Command Line</b></td>
        </tr>
        <tr align="center">
            <td><code>cd android</code><br />and<br /><code>./gradlew assembleRelease</code><br /><i>Note: You will need to [sign your app](https://developer.android.com/studio/publish/app-signing) to be able to install it on your device</td>
        </tr>
    </tbody>
</table>


## Troubleshooting

##### Installing the APK fails
Try to disable **Play Protect** in the **Play Store** and reinstall.

##### Other issues
If the project is crashing and you don't know why, try running `yarn reset`, and follow again the steps above.

---

Still having trouble? Email me at `annie@elequin.io` or message me on Matrix at `@annie:ditto.chat`
