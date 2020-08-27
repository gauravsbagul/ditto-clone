package com.ditto.Notifications;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

/**
 * Asynchronously handles updating messaging app posts (and active Notification) with replies from
 * user in a conversation. Notification for social app use MessagingStyle.
 */
public class MessagingNotificationAndroidIntentService extends IntentService {

  private static final String TAG = "MessagingIntentService";

  public static final String REPLY_ACTION = "com.elequin.ditto.notifications.REPLY_ACTION";
  public static final String REPLY_RESULT = "com.elequin.ditto.notifications.REPLY_RESULT";

  public MessagingNotificationAndroidIntentService() {
    super("MessagingNotificationAndroidIntentService");
  }

  @Override
  protected void onHandleIntent(Intent intent) {
    Log.d(TAG, "onHandleIntent: " + intent);

    if (intent != null) {
      final String action = intent.getAction();
      if (REPLY_ACTION.equals(action)) {
        WritableMap notificationReplyMap = Utils.parseIntentForNotification(intent);

        // Get React Context and send event
        ReactApplication reactApplication = (ReactApplication) this.getApplicationContext();
        ReactContext reactContext = reactApplication
            .getReactNativeHost()
            .getReactInstanceManager()
            .getCurrentReactContext();
        Utils.sendEvent(reactContext, "MessagingNotificationAndroid_reply", notificationReplyMap);
      }
    }
  }
}
