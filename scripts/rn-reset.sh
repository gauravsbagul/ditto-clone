#!/bin/bash

printf '\n\n' &&\
printf 'Clearing watchman cache......... ' &&\
watchman watch-del-all > /dev/null 2>&1 && \
printf '✅\n' &&\
printf 'Clearing temporary caches....... ' &&\
rm -rf $TMPDIR/react-* $TMPDIR/metro-* $TMPDIR/metro-cache/ $TMPDIR/haste-map-metro* > /dev/null 2>&1 &&\
printf '✅\n' &&\
printf 'Wiping node_modules............. ' &&\
rm -rf node_modules > /dev/null 2>&1 &&\
printf '✅\n' &&\
printf 'Reinstalling node_modules....... ' &&\
yarn > /dev/null 2>&1 &&\
printf '✅\n'
