package com.qonexai.quantumtraderai;

import android.webkit.WebView;
import android.webkit.WebViewClient;

public class AppWebViewClient
        extends WebViewClient {

    @Override
    public boolean shouldOverrideUrlLoading(
            WebView view,
            String url) {

        return false;
    }
        }
