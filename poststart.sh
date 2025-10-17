'''js

echo "✅ POST-START CHECK BEGINNING..."

Check if Node server is running
if pgrep -f "node src/server.js" > /dev/null
then
  echo "✅ Server.js is running."
else
  echo "❌ Server.js is NOT running."
fi

Check essential ports (e.g. 3000)
if netstat -an | grep ":3000" | grep LISTEN > /dev/null
then
  echo "✅ Port 3000 is listening."
else
  echo "❌ Port 3000 is not active."
fi

Confirm assets folder is being served (basic check)
if [ -d "src/assets" ]; then
  echo "✅ assets folder is present."
else
  echo "⚠️ assets folder missing."
fi

echo "✅ POST-START CHECK COMPLETE."

chmod +x poststart.sh
```
