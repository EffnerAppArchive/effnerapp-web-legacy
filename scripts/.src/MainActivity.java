package app.effner.web;

import android.content.res.Configuration;
import android.os.Build;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onStart() {
        super.onStart();

        int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        WebSettings webSettings = this.bridge.getWebView().getSettings();
        if (nightModeFlags == Configuration.UI_MODE_NIGHT_YES) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                webSettings.setForceDark(WebSettings.FORCE_DARK_ON);
            }
        }
    }
}
