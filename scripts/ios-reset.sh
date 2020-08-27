printf 'Updating pods...................' &&\
cd ios && pod update > /dev/null 2>&1  &&\
printf ' ✅\n' &&\
printf 'Installing pods.................' &&\
pod install > /dev/null 2>&1 && cd .. &&\
printf ' ✅\n'
