#!/bin/bash

# WhatsApp-Org-Tasks Management Script

PROJECT_DIR="$HOME/Documents/code/whatsapp-org-tasks"
LOG_FILE="$HOME/Library/Logs/whatsapp-org-tasks.log"
ERROR_LOG="$HOME/Library/Logs/whatsapp-org-tasks.error.log"

case "$1" in
  start)
    echo "🚀 Starting WhatsApp-Org-Tasks in background..."
    cd "$PROJECT_DIR"
    nohup npm start > "$LOG_FILE" 2> "$ERROR_LOG" &
    echo $! > "$PROJECT_DIR/.pid"
    echo "✅ Started with PID $(cat "$PROJECT_DIR/.pid")"
    echo "📄 Logs: $LOG_FILE"
    ;;

  stop)
    if [ -f "$PROJECT_DIR/.pid" ]; then
      PID=$(cat "$PROJECT_DIR/.pid")
      echo "🛑 Stopping process $PID..."
      kill "$PID" 2>/dev/null
      rm "$PROJECT_DIR/.pid"
      echo "✅ Stopped"
    else
      echo "⚠️  No PID file found. Searching for process..."
      pkill -f "whatsapp-org-tasks" && echo "✅ Stopped" || echo "❌ Not running"
    fi
    ;;

  restart)
    $0 stop
    sleep 2
    $0 start
    ;;

  status)
    if [ -f "$PROJECT_DIR/.pid" ]; then
      PID=$(cat "$PROJECT_DIR/.pid")
      if ps -p "$PID" > /dev/null 2>&1; then
        echo "✅ Running (PID: $PID)"
      else
        echo "❌ Not running (stale PID file)"
        rm "$PROJECT_DIR/.pid"
      fi
    else
      if pgrep -f "whatsapp-org-tasks" > /dev/null; then
        echo "⚠️  Running but no PID file found"
      else
        echo "❌ Not running"
      fi
    fi
    ;;

  logs)
    echo "📄 Tailing logs from $LOG_FILE"
    echo "   Press Ctrl+C to exit"
    echo ""
    tail -f "$LOG_FILE"
    ;;

  errors)
    echo "❌ Tailing error logs from $ERROR_LOG"
    echo "   Press Ctrl+C to exit"
    echo ""
    tail -f "$ERROR_LOG"
    ;;

  test)
    if [ -z "$2" ]; then
      echo "Usage: $0 test \"Your message\""
      exit 1
    fi
    cd "$PROJECT_DIR"
    node test.js "$2"
    ;;

  check)
    echo "🔍 Checking configuration..."
    cd "$PROJECT_DIR"
    node test-phone-config.js
    ;;

  *)
    echo "WhatsApp-Org-Tasks Management Script"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|logs|errors|test|check}"
    echo ""
    echo "Commands:"
    echo "  start    - Start the service in background"
    echo "  stop     - Stop the service"
    echo "  restart  - Restart the service"
    echo "  status   - Check if service is running"
    echo "  logs     - Tail application logs"
    echo "  errors   - Tail error logs"
    echo "  test     - Test TODO creation: $0 test \"Your message\""
    echo "  check    - Check phone number configuration"
    exit 1
    ;;
esac
