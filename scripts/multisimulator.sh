#!/bin/bash
# iPhone 5s -- 6B6EAD43-7CA1-4E0F-9BBC-FCEBE0192168
# iPhone 6s Plus -- 99467CA2-0A7F-4BFA-9D0C-EAA2DF7683D0
# iPhone 8 -- 99467CA2-0A7F-4BFA-9D0C-EAA2DF7683D0
# iPhone XS -- 16B5EDC5-1A62-4D30-A47D-A7D6E2B3E0F7
# iPhone XS Max -- 042F12FB-30F1-4D40-B521-56D9E43933D6
# iPhone XR -- 15E84842-137C-4B1C-946F-B82A23D075E8
declare -a simulators=("6B6EAD43-7CA1-4E0F-9BBC-FCEBE0192168" "99467CA2-0A7F-4BFA-9D0C-EAA2DF7683D0" "4397C7DB-CAAA-44FE-8522-3F4AFA60E27B" "16B5EDC5-1A62-4D30-A47D-A7D6E2B3E0F7" "042F12FB-30F1-4D40-B521-56D9E43933D6")

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    #xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.11.1.app
    xcrun simctl openurl $i exp://127.0.0.1:19000      
done
