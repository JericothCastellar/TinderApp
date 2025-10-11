package com.tinderapp.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class MatchLauncherWidget extends AppWidgetProvider {

  static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                              int appWidgetId) {

    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.match_launcher_widget);

    // Acción: abrir MainActivity al tocar el widget
    Intent intent = new Intent(context, MainActivity.class);
    PendingIntent pendingIntent = PendingIntent.getActivity(
      context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
    );

    views.setOnClickPendingIntent(R.id.widgetImage, pendingIntent);

    appWidgetManager.updateAppWidget(appWidgetId, views);
  }

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    for (int appWidgetId : appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId);
    }
  }

  @Override
  public void onEnabled(Context context) {
    // No se requiere lógica adicional
  }

  @Override
  public void onDisabled(Context context) {
    // No se requiere lógica adicional
  }
}
