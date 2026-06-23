// QuantumTrader-AI — Android ↔ System Bridge Layer
// Production App Shell Connector (Play Store Ready)

package com.quantumtraderai;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class AppBridge {

    private WebView webView;

    public AppBridge(WebView webView) {
        this.webView = webView;
    }

    // =====================================
    // RUN EVENT
    // =====================================

    @JavascriptInterface
    public void run(String sessionToken, String eventJson) {

        String script =
            "window.qta.gateway.run(" +
            "'" + sessionToken + "', " +
            eventJson +
            ");";

        webView.evaluateJavascript(script, null);
    }

    // =====================================
    // SNAPSHOT
    // =====================================

    @JavascriptInterface
    public void snapshot(String sessionToken) {

        String script =
            "window.qta.gateway.snapshot('" +
            sessionToken + "');";

        webView.evaluateJavascript(script, null);
    }

    // =====================================
    // HEALTH CHECK
    // =====================================

    @JavascriptInterface
    public void health(String sessionToken) {

        String script =
            "window.qta.gateway.health('" +
            sessionToken + "');";

        webView.evaluateJavascript(script, null);
    }

    // =====================================
    // AUDIT TRACE
    // =====================================

    @JavascriptInterface
    public void audit(String sessionToken) {

        String script =
            "window.qta.gateway.audit('" +
            sessionToken + "');";

        webView.evaluateJavascript(script, null);
    }

    // =====================================
    // SESSION RESTORE
    // =====================================

    @JavascriptInterface
    public void restore(String sessionToken) {

        String script =
            "window.qta.session.restore('" +
            sessionToken + "');";

        webView.evaluateJavascript(script, null);
    }
}
