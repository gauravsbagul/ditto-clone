package com.ditto.Notifications;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;

import androidx.core.app.RemoteInput;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class Utils {
  public static Bitmap getBitmapFromUri(String avatarUri) {
    if (avatarUri != null && !avatarUri.equals("")) {
      try {
        Bitmap bitmap = BitmapFactory.decodeStream((InputStream)new URL(avatarUri).getContent());
        // TODO: Get a (round?) bitmap and cache it

        return bitmap;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return null;
  }

  public static WritableMap parseIntentForNotification(Intent intent) {
    if (intent.getExtras() == null || !intent.hasExtra("notificationId")) {
      return null;
    }

    WritableMap notificationMap = Arguments.makeNativeMap(intent.getExtras());
    notificationMap.putString("action", intent.getAction());

    // Check for remote input results
    Bundle remoteInput = RemoteInput.getResultsFromIntent(intent);
    if (remoteInput != null) {
      CharSequence reply = remoteInput.getCharSequence(MessagingNotificationAndroidIntentService.REPLY_RESULT);
      notificationMap.putString("reply", reply.toString());
    }

    return notificationMap;
  }

  public static void sendEvent(ReactContext reactContext,
                        String eventName,
                        WritableMap params) {
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }
}
