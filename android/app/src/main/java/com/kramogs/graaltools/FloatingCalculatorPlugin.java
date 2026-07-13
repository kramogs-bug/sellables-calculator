package com.kramogs.graaltools;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.activity.result.ActivityResult;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "FloatingCalculator",
    permissions = { @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS }) }
)
public class FloatingCalculatorPlugin extends Plugin {
    static final String PREFS_NAME = "floating_calculator";
    static final String KEY_TOTAL = "total";
    static final String KEY_TRO = "tro";
    static final String KEY_RATIO = "ratio";

    @PluginMethod
    public void getStatus(PluginCall call) {
        call.resolve(statusResult());
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (canDrawOverlays()) {
            call.resolve(statusResult());
            return;
        }

        Intent intent = new Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:" + getContext().getPackageName())
        );
        startActivityForResult(call, intent, "overlayPermissionResult");
    }

    @ActivityCallback
    private void overlayPermissionResult(PluginCall call, ActivityResult result) {
        if (call != null) {
            call.resolve(statusResult());
        }
    }

    @PluginMethod
    public void show(PluginCall call) {
        if (!canDrawOverlays()) {
            call.reject("Display over other apps permission is required.", "OVERLAY_PERMISSION_REQUIRED");
            return;
        }

        if (
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            getPermissionState("notifications") != PermissionState.GRANTED
        ) {
            requestPermissionForAlias("notifications", call, "notificationPermissionResult");
            return;
        }

        startOverlay(call);
    }

    @PermissionCallback
    private void notificationPermissionResult(PluginCall call) {
        startOverlay(call);
    }

    private void startOverlay(PluginCall call) {
        saveCalculatorState(call);
        Intent intent = new Intent(getContext(), FloatingCalculatorService.class)
            .setAction(FloatingCalculatorService.ACTION_SHOW);
        ContextCompat.startForegroundService(getContext(), intent);
        call.resolve(new JSObject().put("granted", true).put("running", true));
    }

    @PluginMethod
    public void updateState(PluginCall call) {
        saveCalculatorState(call);

        if (FloatingCalculatorService.isRunning()) {
            Intent intent = new Intent(getContext(), FloatingCalculatorService.class)
                .setAction(FloatingCalculatorService.ACTION_UPDATE);
            getContext().startService(intent);
        }

        call.resolve(statusResult());
    }

    @PluginMethod
    public void hide(PluginCall call) {
        getContext().stopService(new Intent(getContext(), FloatingCalculatorService.class));
        call.resolve(new JSObject().put("granted", canDrawOverlays()).put("running", false));
    }

    private boolean canDrawOverlays() {
        return Settings.canDrawOverlays(getContext());
    }

    private JSObject statusResult() {
        return new JSObject()
            .put("native", true)
            .put("granted", canDrawOverlays())
            .put("running", FloatingCalculatorService.isRunning());
    }

    private void saveCalculatorState(PluginCall call) {
        SharedPreferences.Editor editor = getContext()
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit();
        editor.putString(KEY_TOTAL, call.getString(KEY_TOTAL, "0"));
        editor.putString(KEY_TRO, call.getString(KEY_TRO, "0"));
        editor.putString(KEY_RATIO, call.getString(KEY_RATIO, "1"));
        editor.apply();
    }
}
