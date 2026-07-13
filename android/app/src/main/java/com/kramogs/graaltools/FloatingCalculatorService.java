package com.kramogs.graaltools;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.pm.ServiceInfo;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class FloatingCalculatorService extends Service {
    static final String ACTION_SHOW = "com.kramogs.graaltools.action.SHOW_FLOATING_CALCULATOR";
    static final String ACTION_UPDATE = "com.kramogs.graaltools.action.UPDATE_FLOATING_CALCULATOR";
    static final String ACTION_STOP = "com.kramogs.graaltools.action.STOP_FLOATING_CALCULATOR";

    private static final String CHANNEL_ID = "floating_calculator";
    private static final int NOTIFICATION_ID = 2104;
    private static final String KEY_X = "overlay_x";
    private static final String KEY_Y = "overlay_y";
    private static final String KEY_EXPRESSION = "overlay_expression";
    private static volatile boolean running;

    private final DecimalFormat resultFormatter = new DecimalFormat(
        "#,##0.########",
        DecimalFormatSymbols.getInstance(Locale.US)
    );

    private SharedPreferences preferences;
    private WindowManager windowManager;
    private WindowManager.LayoutParams windowParams;
    private LinearLayout overlayView;
    private LinearLayout expandedContent;
    private TextView titleView;
    private TextView totalView;
    private TextView troView;
    private TextView expressionView;
    private TextView resultView;
    private Button minimizeButton;
    private boolean minimized;
    private String expression = "";

    static boolean isRunning() {
        return running;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        running = true;
        preferences = getSharedPreferences(FloatingCalculatorPlugin.PREFS_NAME, Context.MODE_PRIVATE);
        expression = preferences.getString(KEY_EXPRESSION, "");
        createNotificationChannel();
        beginForeground();
        showOverlay();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? ACTION_SHOW : intent.getAction();
        if (ACTION_STOP.equals(action)) {
            stopSelf();
            return START_NOT_STICKY;
        }
        updateAppValues();
        return START_NOT_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (overlayView != null) overlayView.post(this::clampAndUpdatePosition);
    }

    @Override
    public void onDestroy() {
        if (overlayView != null && windowManager != null) {
            try {
                windowManager.removeView(overlayView);
            } catch (IllegalArgumentException ignored) {
                // The system may already have removed the overlay after permission revocation.
            }
        }
        preferences.edit().putString(KEY_EXPRESSION, expression).apply();
        overlayView = null;
        running = false;
        super.onDestroy();
    }

    private void beginForeground() {
        Intent openIntent = new Intent(this, MainActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPendingIntent = PendingIntent.getActivity(
            this,
            0,
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Intent stopIntent = new Intent(this, FloatingCalculatorService.class).setAction(ACTION_STOP);
        PendingIntent stopPendingIntent = PendingIntent.getService(
            this,
            1,
            stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_calculator_notification)
            .setContentTitle("Floating calculator is active")
            .setContentText("Tap to return to Graal Sellables Tools")
            .setContentIntent(openPendingIntent)
            .addAction(0, "Stop", stopPendingIntent)
            .setOngoing(true)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();

        int foregroundType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE
            ? ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            : 0;
        ServiceCompat.startForeground(this, NOTIFICATION_ID, notification, foregroundType);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Floating calculator",
            NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Shown while the user-controlled floating calculator is active.");
        getSystemService(NotificationManager.class).createNotificationChannel(channel);
    }

    private void showOverlay() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        int windowType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;

        windowParams = new WindowManager.LayoutParams(
            dp(312),
            WindowManager.LayoutParams.WRAP_CONTENT,
            windowType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        );
        windowParams.gravity = Gravity.TOP | Gravity.START;
        windowParams.x = preferences.getInt(KEY_X, dp(16));
        windowParams.y = preferences.getInt(KEY_Y, dp(120));

        overlayView = buildOverlayView();
        try {
            windowManager.addView(overlayView, windowParams);
            overlayView.post(this::clampAndUpdatePosition);
        } catch (RuntimeException exception) {
            stopSelf();
        }
    }

    private LinearLayout buildOverlayView() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(1), dp(1), dp(1), dp(1));
        root.setElevation(dp(10));
        root.setBackground(roundedBackground("#F8FBF5", 18, "#88BDA4", 1));

        LinearLayout header = new LinearLayout(this);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setPadding(dp(12), dp(8), dp(8), dp(8));
        header.setBackground(roundedBackground("#29453E", 17, null, 0));
        root.addView(header, matchWrap());

        titleView = label("Calculator", 15, Color.WHITE, true);
        header.addView(titleView, new LinearLayout.LayoutParams(0, dp(38), 1));
        titleView.setGravity(Gravity.CENTER_VERTICAL);

        minimizeButton = headerButton("−", "Minimize floating calculator");
        minimizeButton.setOnClickListener(view -> toggleMinimized());
        header.addView(minimizeButton);

        Button closeButton = headerButton("×", "Close floating calculator");
        closeButton.setOnClickListener(view -> stopSelf());
        header.addView(closeButton);
        installDragHandler(header);

        expandedContent = new LinearLayout(this);
        expandedContent.setOrientation(LinearLayout.VERTICAL);
        expandedContent.setPadding(dp(12), dp(10), dp(12), dp(12));
        root.addView(expandedContent, matchWrap());

        LinearLayout stats = new LinearLayout(this);
        stats.setOrientation(LinearLayout.HORIZONTAL);
        expandedContent.addView(stats, matchWrap());

        LinearLayout totalColumn = statColumn("APP TOTAL");
        totalView = (TextView) totalColumn.getChildAt(1);
        stats.addView(totalColumn, new LinearLayout.LayoutParams(0, WindowManager.LayoutParams.WRAP_CONTENT, 1));

        LinearLayout troColumn = statColumn("TRO VALUE");
        troView = (TextView) troColumn.getChildAt(1);
        stats.addView(troColumn, new LinearLayout.LayoutParams(0, WindowManager.LayoutParams.WRAP_CONTENT, 1));

        expressionView = label(expression.isEmpty() ? "0" : prettyExpression(expression), 22, Color.parseColor("#29453E"), true);
        expressionView.setGravity(Gravity.END | Gravity.CENTER_VERTICAL);
        expressionView.setPadding(dp(10), dp(8), dp(10), dp(2));
        expressionView.setSingleLine(true);
        expressionView.setHorizontallyScrolling(true);
        LinearLayout.LayoutParams expressionParams = matchWrap();
        expressionParams.topMargin = dp(10);
        expandedContent.addView(expressionView, expressionParams);

        resultView = label("= 0", 13, Color.parseColor("#527A70"), false);
        resultView.setGravity(Gravity.END);
        resultView.setPadding(dp(10), 0, dp(10), dp(8));
        expandedContent.addView(resultView, matchWrap());

        String[][] rows = {
            { "C", "(", ")", "⌫" },
            { "7", "8", "9", "÷" },
            { "4", "5", "6", "×" },
            { "1", "2", "3", "−" },
            { "0", "00", ".", "+" }
        };
        for (String[] row : rows) {
            expandedContent.addView(keypadRow(row), matchWrap());
        }

        Button equalsButton = calculatorButton("=", true);
        LinearLayout.LayoutParams equalsParams = matchWrap();
        equalsParams.topMargin = dp(4);
        expandedContent.addView(equalsButton, equalsParams);

        updateAppValues();
        updateExpressionViews();
        return root;
    }

    private LinearLayout keypadRow(String[] keys) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        for (String key : keys) {
            Button button = calculatorButton(key, false);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(48), 1);
            params.setMargins(dp(2), dp(2), dp(2), dp(2));
            row.addView(button, params);
        }
        return row;
    }

    private Button calculatorButton(String key, boolean primary) {
        Button button = new Button(this);
        button.setAllCaps(false);
        button.setText(key);
        button.setTextSize(primary ? 20 : 17);
        button.setTextColor(primary ? Color.WHITE : Color.parseColor("#29453E"));
        button.setGravity(Gravity.CENTER);
        button.setPadding(0, 0, 0, 0);
        button.setMinHeight(0);
        button.setMinWidth(0);
        button.setBackground(roundedBackground(primary ? "#659287" : "#E6F2DD", 10, null, 0));
        button.setContentDescription(key.equals("⌫") ? "Backspace" : key);
        button.setOnClickListener(view -> handleKey(key));
        return button;
    }

    private Button headerButton(String text, String description) {
        Button button = new Button(this);
        button.setAllCaps(false);
        button.setText(text);
        button.setTextSize(20);
        button.setTextColor(Color.WHITE);
        button.setGravity(Gravity.CENTER);
        button.setPadding(0, 0, 0, 0);
        button.setMinHeight(0);
        button.setMinWidth(0);
        button.setBackgroundColor(Color.TRANSPARENT);
        button.setContentDescription(description);
        button.setLayoutParams(new LinearLayout.LayoutParams(dp(38), dp(38)));
        return button;
    }

    private LinearLayout statColumn(String title) {
        LinearLayout column = new LinearLayout(this);
        column.setOrientation(LinearLayout.VERTICAL);
        TextView heading = label(title, 10, Color.parseColor("#659287"), true);
        TextView value = label("0", 16, Color.parseColor("#29453E"), true);
        column.addView(heading, matchWrap());
        column.addView(value, matchWrap());
        return column;
    }

    private TextView label(String text, int size, int color, boolean bold) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextSize(size);
        view.setTextColor(color);
        view.setIncludeFontPadding(false);
        if (bold) view.setTypeface(view.getTypeface(), android.graphics.Typeface.BOLD);
        return view;
    }

    private void handleKey(String key) {
        if ("C".equals(key)) {
            expression = "";
        } else if ("⌫".equals(key)) {
            if (!expression.isEmpty()) expression = expression.substring(0, expression.length() - 1);
        } else if ("=".equals(key)) {
            Double value = evaluate(expression);
            if (value != null) expression = plainNumber(value);
        } else {
            String token = key
                .replace("÷", "/")
                .replace("×", "*")
                .replace("−", "-");
            if (expression.length() < 120) expression += token;
        }
        preferences.edit().putString(KEY_EXPRESSION, expression).apply();
        updateExpressionViews();
    }

    private void updateExpressionViews() {
        if (expressionView == null || resultView == null) return;
        expressionView.setText(expression.isEmpty() ? "0" : prettyExpression(expression));
        Double value = evaluate(expression);
        resultView.setText(value == null ? "Incomplete expression" : "= " + resultFormatter.format(value));
    }

    private void updateAppValues() {
        if (totalView == null || troView == null) return;
        String total = preferences.getString(FloatingCalculatorPlugin.KEY_TOTAL, "0");
        String tro = preferences.getString(FloatingCalculatorPlugin.KEY_TRO, "0");
        String ratio = preferences.getString(FloatingCalculatorPlugin.KEY_RATIO, "1");
        totalView.setText(total + " G");
        troView.setText(tro + " Tro");
        titleView.setText(minimized ? total + " G" : "Calculator · 1 Tro = " + ratio + " G");
    }

    private void toggleMinimized() {
        minimized = !minimized;
        expandedContent.setVisibility(minimized ? View.GONE : View.VISIBLE);
        minimizeButton.setText(minimized ? "□" : "−");
        minimizeButton.setContentDescription(minimized ? "Expand floating calculator" : "Minimize floating calculator");
        windowParams.width = dp(minimized ? 190 : 312);
        windowManager.updateViewLayout(overlayView, windowParams);
        updateAppValues();
        overlayView.post(this::clampAndUpdatePosition);
    }

    private void installDragHandler(View dragTarget) {
        dragTarget.setOnTouchListener(new View.OnTouchListener() {
            private int startX;
            private int startY;
            private float startTouchX;
            private float startTouchY;

            @Override
            public boolean onTouch(View view, MotionEvent event) {
                switch (event.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN:
                        startX = windowParams.x;
                        startY = windowParams.y;
                        startTouchX = event.getRawX();
                        startTouchY = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        windowParams.x = startX + Math.round(event.getRawX() - startTouchX);
                        windowParams.y = startY + Math.round(event.getRawY() - startTouchY);
                        clampAndUpdatePosition();
                        return true;
                    case MotionEvent.ACTION_UP:
                    case MotionEvent.ACTION_CANCEL:
                        savePosition();
                        return true;
                    default:
                        return false;
                }
            }
        });
    }

    private void clampAndUpdatePosition() {
        if (overlayView == null || windowParams == null) return;
        int screenWidth = getResources().getDisplayMetrics().widthPixels;
        int screenHeight = getResources().getDisplayMetrics().heightPixels;
        int viewWidth = overlayView.getWidth() > 0 ? overlayView.getWidth() : windowParams.width;
        int viewHeight = overlayView.getHeight() > 0 ? overlayView.getHeight() : dp(80);
        windowParams.x = Math.max(0, Math.min(windowParams.x, Math.max(0, screenWidth - viewWidth)));
        windowParams.y = Math.max(0, Math.min(windowParams.y, Math.max(0, screenHeight - viewHeight)));
        try {
            windowManager.updateViewLayout(overlayView, windowParams);
        } catch (IllegalArgumentException ignored) {
            // Ignore updates after the overlay has already been removed.
        }
    }

    private void savePosition() {
        preferences.edit().putInt(KEY_X, windowParams.x).putInt(KEY_Y, windowParams.y).apply();
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT
        );
    }

    private GradientDrawable roundedBackground(String color, int radiusDp, @Nullable String strokeColor, int strokeDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(Color.parseColor(color));
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeColor != null && strokeDp > 0) drawable.setStroke(dp(strokeDp), Color.parseColor(strokeColor));
        return drawable;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private String prettyExpression(String value) {
        return value.replace("*", "×").replace("/", "÷").replace("-", "−");
    }

    private String plainNumber(double value) {
        return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
    }

    @Nullable
    private Double evaluate(String source) {
        if (source == null || source.trim().isEmpty()) return 0d;
        try {
            ExpressionParser parser = new ExpressionParser(source);
            double value = parser.parse();
            return Double.isFinite(value) ? value : null;
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private static final class ExpressionParser {
        private final String input;
        private int index;

        ExpressionParser(String input) {
            this.input = input.replaceAll("\\s+", "");
        }

        double parse() {
            double value = parseExpression();
            if (index != input.length()) throw new IllegalArgumentException("Unexpected token");
            return value;
        }

        private double parseExpression() {
            double value = parseTerm();
            while (index < input.length()) {
                char operator = input.charAt(index);
                if (operator != '+' && operator != '-') break;
                index++;
                double right = parseTerm();
                value = operator == '+' ? value + right : value - right;
            }
            return value;
        }

        private double parseTerm() {
            double value = parseFactor();
            while (index < input.length()) {
                char operator = input.charAt(index);
                if (operator != '*' && operator != '/') break;
                index++;
                double right = parseFactor();
                value = operator == '*' ? value * right : value / right;
            }
            return value;
        }

        private double parseFactor() {
            if (index >= input.length()) throw new IllegalArgumentException("Missing value");
            char current = input.charAt(index);
            if (current == '+' || current == '-') {
                index++;
                double value = parseFactor();
                return current == '-' ? -value : value;
            }
            if (current == '(') {
                index++;
                double value = parseExpression();
                if (index >= input.length() || input.charAt(index) != ')') {
                    throw new IllegalArgumentException("Missing parenthesis");
                }
                index++;
                return value;
            }
            return parseNumber();
        }

        private double parseNumber() {
            int start = index;
            boolean hasDigit = false;
            boolean hasDecimal = false;
            while (index < input.length()) {
                char current = input.charAt(index);
                if (Character.isDigit(current)) {
                    hasDigit = true;
                    index++;
                } else if (current == '.' && !hasDecimal) {
                    hasDecimal = true;
                    index++;
                } else {
                    break;
                }
            }
            if (!hasDigit) throw new IllegalArgumentException("Invalid number");
            return Double.parseDouble(input.substring(start, index));
        }
    }
}
