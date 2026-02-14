---
title: "System stats on terminal (debian - ubuntu)"
date: 2024-02-10
description: "How to view system stats on terminal for Debian and Ubuntu"
---

This document explains how to install prerequisites, create the script, fix permissions, and run it safely on a **Proxmox host**, including with:

```javascript
watch -n 1 stats.sh
```

## **1️⃣ Prerequisites**

Proxmox is Debian-based. Ensure the required tools are installed.

**Update system**

```javascript
apt update
```

**Install required packages**

```javascript
sudo apt install -y procps lm-sensors coreutils iproute2
```

**2️⃣ Create script directory**

```javascript
mkdir -p /usr/local/bin/battery
```

**3️⃣ Create the script file**

```javascript
nano /usr/local/bin/battery/stats.sh
```

**
4️⃣ Paste the FULL script**

```javascript
#!/bin/bash
set -u

############################
# BATTERY STATUS
############################

echo "🔋 Battery status"
echo "------------------"

BAT_TOTAL_ENERGY=0
BAT_TOTAL_RATE=0
BAT_TIME_LEFT="N/A"
BAT_ON_BATTERY=0

for bat in /sys/class/power_supply/BAT*; do
  if [ -f "$bat/capacity" ]; then
    BAT_NAME=$(basename "$bat")
    BAT_CAPACITY=$(cat "$bat/capacity")
    BAT_STATUS=$(cat "$bat/status")
    BAT_ENERGY_NOW=$(cat "$bat/energy_now" 2>/dev/null || echo 0)
    BAT_POWER_NOW=$(cat "$bat/power_now" 2>/dev/null || echo 0)

    BAT_TOTAL_ENERGY=$((BAT_TOTAL_ENERGY + BAT_ENERGY_NOW))
    BAT_TOTAL_RATE=$((BAT_TOTAL_RATE + BAT_POWER_NOW))

    echo "$BAT_NAME → $BAT_CAPACITY% ($BAT_STATUS)"

    if [ "$BAT_STATUS" = "Discharging" ]; then
      BAT_ON_BATTERY=1
    fi
  fi
done

BAT_POWER_W=$(awk "BEGIN {printf \"%.2f\", $BAT_TOTAL_RATE/1000000}")

if [ "$BAT_ON_BATTERY" -eq 1 ] && [ "$BAT_TOTAL_RATE" -gt 0 ]; then
  BAT_HOURS=$(awk "BEGIN {printf \"%.4f\", $BAT_TOTAL_ENERGY/$BAT_TOTAL_RATE}")
  BAT_TIME_LEFT=$(awk "BEGIN {
    h=int($BAT_HOURS);
    m=int(($BAT_HOURS-h)*60);
    printf \"%02d:%02d\", h, m
  }")
fi

echo
echo "⚡ Power draw: ${BAT_POWER_W} W"

if [ "$BAT_ON_BATTERY" -eq 1 ]; then
  echo "⏱ Estimated time left: ${BAT_TIME_LEFT}"
else
  echo "🔌 On AC power"
fi

############################
# SYSTEM STATUS
############################

echo
echo "🖥 System status"
echo "------------------"

# CPU usage
CPU_IDLE_PCT=$(top -bn1 | awk -F',' '/Cpu\(s\)/ {print $4}' | awk '{print $1}')
CPU_USAGE_PCT=$(awk "BEGIN {printf \"%.1f\", 100 - $CPU_IDLE_PCT}")
echo "🔥 CPU usage: ${CPU_USAGE_PCT}%"

# CPU temperature
CPU_TEMP=$(sensors 2>/dev/null | awk '/Package id 0:/ {print $4}' | head -n1)
[ -z "$CPU_TEMP" ] && CPU_TEMP="N/A"
echo "🌡 CPU temp: $CPU_TEMP"

# RAM usage (watch-safe)
RAM_TOTAL_MB=$(awk '/MemTotal/ {printf "%.0f", $2/1024}' /proc/meminfo)
RAM_AVAIL_MB=$(awk '/MemAvailable/ {printf "%.0f", $2/1024}' /proc/meminfo)
RAM_USED_MB=$((RAM_TOTAL_MB - RAM_AVAIL_MB))
RAM_USED_PCT=$(awk "BEGIN {printf \"%.2f\", ($RAM_USED_MB/$RAM_TOTAL_MB)*100}")

echo "🧠 RAM: ${RAM_USED_MB}MB / ${RAM_TOTAL_MB}MB (${RAM_USED_PCT}%)"

# Disk usage (root filesystem)
DISK_ROOT_USAGE=$(df -h / | awk 'NR==2 {print $3 " / " $2 " (" $5 ")"}')
echo "💾 Disk: $DISK_ROOT_USAGE"

# Network speed (1-second sample)
NET_IFACE=$(ip route | awk '/default/ {print $5; exit}')

NET_RX_1=$(cat /sys/class/net/$NET_IFACE/statistics/rx_bytes)
NET_TX_1=$(cat /sys/class/net/$NET_IFACE/statistics/tx_bytes)
sleep 1
NET_RX_2=$(cat /sys/class/net/$NET_IFACE/statistics/rx_bytes)
NET_TX_2=$(cat /sys/class/net/$NET_IFACE/statistics/tx_bytes)

NET_RX_KB_S=$(awk "BEGIN {printf \"%.1f\", ($NET_RX_2-$NET_RX_1)/1024}")
NET_TX_KB_S=$(awk "BEGIN {printf \"%.1f\", ($NET_TX_2-$NET_TX_1)/1024}")

echo "🌐 Network ($NET_IFACE): ↓ ${NET_RX_KB_S} KB/s ↑ ${NET_TX_KB_S} KB/s"
```

**
Save and exit nano**


```javascript
Ctrl + O → Enter
Ctrl + X
```

**
5️⃣ Make the script executable**


```javascript
chmod +x /usr/local/bin/battery/stats.sh
```

**
6️⃣ Run the script**


```javascript
/usr/local/bin/battery/stats.sh
```

## **7️⃣ Run from anywhere (optional)**

If /usr/local/bin is in PATH (default on Proxmox):

```javascript
stats.sh
```

To remove .sh extension:

```javascript
mv /usr/local/bin/battery/stats.sh /usr/local/bin/stats
chmod +x /usr/local/bin/stats
```

Run:

```javascript
stats
```

**
8️⃣ Use with watch (real-time monitoring)**

```javascript
watch -n 1 stats
```

**
9️⃣ Example output**

```javascript
🔋 Battery status
BAT0 → 86% (Discharging)

⚡ Power draw: 12.10 W
⏱ Estimated time left: 03:28

🖥 System status
🔥 CPU usage: 5.3%
🌡 CPU temp: +48.0°C
🧠 RAM: 6123MB / 7684MB (79.74%)
💾 Disk: 18G / 94G (21%)
🌐 Network (eno1): ↓ 41.8 KB/s ↑ 3.2 KB/s
```