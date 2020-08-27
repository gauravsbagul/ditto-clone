# a script for opening and installing expo on a particular simulator
#!/bin/bash

PHONE=$1
DEVICE=""

if [ $PHONE = "5s" ]
then
  DEVICE="6B6EAD43-7CA1-4E0F-9BBC-FCEBE0192168"
elif [ $PHONE = "6s plus" ]
then
  DEVICE="99467CA2-0A7F-4BFA-9D0C-EAA2DF7683D0"
elif [ $PHONE = "8" ]
then
  DEVICE="4397C7DB-CAAA-44FE-8522-3F4AFA60E27B"
elif [ $PHONE = "xs" ]
then
  DEVICE="16B5EDC5-1A62-4D30-A47D-A7D6E2B3E0F7"
elif [ $PHONE = "xs max" ]
then
  DEVICE="042F12FB-30F1-4D40-B521-56D9E43933D6"
elif [ $PHONE = "xr" ]
then
  DEVICE="15E84842-137C-4B1C-946F-B82A23D075E8"
else
  echo "Not a valid device."
  exit 1
fi

echo $DEVICE

xcrun instruments -w $DEVICE
echo Installing Expo...
xcrun simctl install $DEVICE ~/.expo/ios-simulator-app-cache/Exponent-2.11.1.app
echo Installed Expo
sleep 4
echo Launching Expo
xcrun simctl openurl booted exp://127.0.0.1:19000 