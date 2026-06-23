package com.qonexai.quantumtraderai;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity
        extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(
            Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        webView = new WebView(this);

        setContentView(webView);

        WebSettings settings =
                webView.getSettings();

        settings.setJavaScriptEnabled(true);

        settings.setDomStorageEnabled(true);

        settings.setAllowFileAccess(false);

        settings.setAllowContentAccess(false);

        webView.setWebViewClient(
                new AppWebViewClient());

        webView.loadUrl(
                "file:///android_asset/index.html");
    }
}
