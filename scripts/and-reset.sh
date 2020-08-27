printf 'Cleaning gradle................. ' &&\
cd ./android && ./gradlew clean > /dev/null 2>&1 && cd .. &&\
printf '✅\n'
