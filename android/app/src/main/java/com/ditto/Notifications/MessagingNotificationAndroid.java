package com.ditto.Notifications;

import com.ditto.MainActivity;
import com.ditto.R;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Parcelable;
import android.provider.Settings;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationCompat.MessagingStyle;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.Person;
import androidx.core.app.RemoteInput;
import androidx.core.graphics.drawable.IconCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MessagingNotificationAndroid extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private static final String TAG = MessagingNotificationAndroid.class.getSimpleName();

  MessagingNotificationAndroid(ReactApplicationContext context) {
    super(context);
    reactContext = context;

    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return "MessagingNotificationAndroid";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    return constants;
  }

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onNewIntent(Intent intent) {
      Log.d(TAG, "New intent received: " + intent.toUri(0));

      WritableMap notificationOpenedMap = Utils.parseIntentForNotification(intent);

      Utils.sendEvent(reactContext, "MessagingNotificationAndroid_opened", notificationOpenedMap);
    }
  };

  @ReactMethod
  public void getInitialNotification(Promise promise) {
    Log.d(TAG, "getInitialNotification");
    WritableMap notificationOpenedMap = null;
    if (getCurrentActivity() != null) {
      notificationOpenedMap = Utils.parseIntentForNotification(getCurrentActivity().getIntent());
    }
    promise.resolve(notificationOpenedMap);
  }

  @ReactMethod
  public void getActiveNotifications(Promise promise) {
    Log.d(TAG, "getActiveNotifications");
    WritableNativeArray notificationsArray = new WritableNativeArray();
    // Only return something for MessagingStyle Notifications which appeared in API 24
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {

      NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(reactContext.NOTIFICATION_SERVICE);
      StatusBarNotification[] statusbars = notificationManager.getActiveNotifications();

      for (StatusBarNotification statusbar : statusbars) {
        Bundle extras = statusbar.getNotification().extras;
        WritableNativeMap notification = new WritableNativeMap();
        notification.putMap("room", Arguments.fromBundle(extras.getBundle("room")));
        notification.putString("me", extras.getString("me"));
        notification.putArray("users", Arguments.fromList(extras.getParcelableArrayList("users")));
        notification.putArray("messages", Arguments.fromList(extras.getParcelableArrayList("messages")));
        notification.putString("channelId", extras.getString("channelId"));

        notificationsArray.pushMap(notification);
      }
    }
    promise.resolve(notificationsArray);
  }

  @ReactMethod
  public void cancelAllNotifications() {
    Log.d(TAG, "cancelAllNotifications");

    NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
    notificationManager.cancelAll();
  }

  @ReactMethod
  public void cancelNotification(String roomId) {
    Log.d(TAG, "cancelNotification");
    // Will only work reliably with MessagingStyle notifications, so cancel all for older versions
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      int notificationId = roomId.hashCode();

      NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
      notificationManager.cancel(notificationId);
    } else {
      cancelAllNotifications();
    }
  }

  @ReactMethod
  public void createNotificationChannel(ReadableMap details) {
    // Create the NotificationChannel, but only on API 26+ because
    // the NotificationChannel class is new and not in the support library
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Bundle channel = Arguments.toBundle(details);

      String id = channel.getString("id");
      CharSequence name = channel.getCharSequence("name");
      String description = channel.getString("description");
      int importance = NotificationManager.IMPORTANCE_HIGH;

      NotificationChannel notifChannel = new NotificationChannel(id, name, importance);
      notifChannel.setDescription(description);
      notifChannel.enableLights(true);
      notifChannel.enableVibration(true);

      AudioAttributes.Builder audioAttributes = new AudioAttributes.Builder()
          .setContentType(AudioAttributes.CONTENT_TYPE_UNKNOWN)
          .setUsage(AudioAttributes.USAGE_NOTIFICATION_COMMUNICATION_INSTANT);
      notifChannel.setSound(Settings.System.DEFAULT_NOTIFICATION_URI, audioAttributes.build());


      // Register the channel with the system; you can't change the importance
      // or other notification behaviors after this
      NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(notifChannel);
    }
  }

  @ReactMethod
  public void notify(ReadableMap details) {
    Log.d(TAG, "notify");

    try {
      Bundle bundle = Arguments.toBundle(details);

      // Get room
      Bundle room = bundle.getBundle("room");
      if (room == null) throw new Exception("Room object is null");
      String roomId = room.getString("id");
      if (roomId == null || roomId.equals("")) throw new Exception("No room ID");
      Bitmap roomAvatar = Utils.getBitmapFromUri(room.getString("avatar"));

      // Get channelId
      String channelId = bundle.getString("channelId");
      if (channelId == null || channelId.equals("")) throw new Exception("No channel ID");

      // Get users
      String me = bundle.getString("me");
      if (me == null ) throw new Exception("Me object is null");
      ArrayList<Bundle> arrayUsers = bundle.getParcelableArrayList("users");
      if (arrayUsers == null || arrayUsers.size() < 2) throw new Exception("Not enough users");
      HashMap<String, Person> users = new HashMap<String, Person>();
      for (Bundle bundleUser : arrayUsers) {
        Person.Builder user = new Person.Builder()
            .setKey(bundleUser.getString("id"));
        if (bundleUser.getString("id") == null || bundleUser.getString("id").equals("")) throw new Exception("User has no id");
        if (bundleUser.getString("name") == null || bundleUser.getString("name").equals("")) {
          user.setName(bundleUser.getString("id"));
        } else {
          user.setName(bundleUser.getString("name"));
        }
        Bitmap avatarSender = Utils.getBitmapFromUri(bundleUser.getString("avatar"));
        if (avatarSender != null) {
          user.setIcon(IconCompat.createWithBitmap(avatarSender));
        }

        users.put(bundleUser.getString("id"), user.build());
      }

      // Get messages
      ArrayList<Bundle> messages = bundle.getParcelableArrayList("messages");
      if (messages == null || messages.size() < 1) {
        throw new Exception("No messages");
      }

      // TODO: Add Actions: Mark as read?
      NotificationCompat.Builder notification = new NotificationCompat.Builder(reactContext, channelId)
          .setSmallIcon(R.drawable.ic_stat_ditto)
          .setCategory(NotificationCompat.CATEGORY_MESSAGE)
          .setAutoCancel(true);


      // Priority
      if ((int)bundle.getDouble("priority") == NotificationCompat.PRIORITY_DEFAULT) {
        notification.setPriority(NotificationCompat.PRIORITY_DEFAULT);
        // It should be a reply, so don't make a sound
      } else {
        notification.setPriority(NotificationCompat.PRIORITY_MAX);
        notification.setDefaults(Notification.DEFAULT_ALL);
      }

      if (roomAvatar != null) {
        notification.setLargeIcon(roomAvatar);
      }

      int notificationId = 0;

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
        Bundle message = messages.get(messages.size() - 1);
        // Get notificationId from event
        String eventId = message.getString("id");
        if (eventId == null || eventId.equals("")) throw new Exception("No event ID");

        notificationId = eventId.hashCode();

        String group = roomId;
        notification.setContentTitle(room.getString("title"))
            .setContentText(message.getString("body"))
            .setGroup(group);
      } else {
        // Get notificationId from group
        notificationId = roomId.hashCode();

        // Build MessagingStyle
        MessagingStyle messagingStyle =
            new MessagingStyle(users.get(me))
                .setConversationTitle(room.getString("title"))
                .setGroupConversation(!room.getBoolean("isDirect"));
        for (Bundle messageDetails : messages) {
          String eventId = messageDetails.getString("id");
          if (eventId == null || eventId.equals("")) throw new Exception("No event ID");
          String type = messageDetails.getString("type");
          if (type == null || type.equals("")) throw new Exception("No message type");
          Bundle content = messageDetails.getBundle("content");
          if (content == null) throw new Exception("No message content");
          String text = content.getString("text");
          if (text == null || text.equals("")) throw new Exception("No message text");
          Long timestamp = new Double(messageDetails.getDouble("timestamp")).longValue();
          if (timestamp == 0) throw new Exception("No message timestamp");
          String senderId = messageDetails.getString("sender");
          if (senderId == null || senderId.equals("")) throw new Exception("No message sender");
          Person sender = users.get(senderId);
          if (sender == null) throw new Exception("Sender not found in users");
          MessagingStyle.Message message = new NotificationCompat.MessagingStyle.Message(text, timestamp, sender);
          if (type.equals("image")) {
            // TODO: Handle images
          }
          messagingStyle.addMessage(message);
        }
        notification.setStyle(messagingStyle);

        // Add direct reply action
        RemoteInput remoteInput = new RemoteInput.Builder(MessagingNotificationAndroidIntentService.REPLY_RESULT)
            .setLabel(reactContext.getResources().getString(R.string.messagingNotifications_actions_reply_placeholder))
            .build();
        Intent replyIntent = new Intent(reactContext, MessagingNotificationAndroidIntentService.class);
        replyIntent.setAction(MessagingNotificationAndroidIntentService.REPLY_ACTION);
        replyIntent.putExtra("notificationId", notificationId);
        replyIntent.putExtra("roomId", roomId);
        replyIntent.putExtra("data", bundle);
        PendingIntent replyPendingIntent = PendingIntent.getService(reactContext,
            notificationId,
            replyIntent,
            0);

        NotificationCompat.Action replyAction =
            new NotificationCompat.Action.Builder(
                R.drawable.ic_action_reply,
                reactContext.getResources().getString(R.string.messagingNotifications_actions_reply_button),
                replyPendingIntent)
                .addRemoteInput(remoteInput)
                // Informs system we aren't bringing up our own custom UI for a reply
                // action.
                .setShowsUserInterface(false)
                // Allows system to generate replies by context of conversation.
                .setAllowGeneratedReplies(true)
                .setSemanticAction(NotificationCompat.Action.SEMANTIC_ACTION_REPLY)
                .build();
        notification.addAction(replyAction);

        // Provide data for when we fetch active notifications
        notification.setExtras(bundle);
      }

      // Build intent
      Intent intent = new Intent(reactContext, MainActivity.class);
      intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
      intent.putExtra("notificationId", notificationId);
      intent.putExtra("roomId", roomId);
      intent.putExtra("data", bundle);
      PendingIntent pendingIntent = PendingIntent.getActivity(reactContext,
          notificationId,
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT);
      notification.setContentIntent(pendingIntent);

      NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
      notificationManager.notify(notificationId, notification.build());
    } catch (Exception e) {
      Log.e(TAG, e.getMessage());
    }
  }
}
