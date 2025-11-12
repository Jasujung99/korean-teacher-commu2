# Monitoring and Alerting Guide

This guide covers setting up monitoring, alerting, and performance tracking for the Korean Teacher API.

## Table of Contents

- [Cloudflare Analytics](#cloudflare-analytics)
- [Error Rate Alerting](#error-rate-alerting)
- [Performance Dashboard](#performance-dashboard)
- [Health Check Monitoring](#health-check-monitoring)
- [Log Analysis](#log-analysis)
- [Custom Metrics](#custom-metrics)

---

## Cloudflare Analytics

Cloudflare provides built-in analytics for Workers that track requests, errors, and performance.

### Accessing Analytics

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Select your worker: `korean-teacher-api`
4. Click the **Metrics** tab

### Key Metrics Available

#### Request Metrics
- **Total Requests**: Number of requests over time
- **Requests by Status Code**: Breakdown of 2xx, 4xx, 5xx responses
- **Requests by Route**: Traffic distribution across endpoints
- **Requests by Country**: Geographic distribution of users

#### Performance Metrics
- **CPU Time**: Execution time per request
- **Duration**: Total request duration including I/O
- **Subrequests**: External API calls (Notion, GitHub, R2)

#### Error Metrics
- **Error Rate**: Percentage of failed requests
- **Errors by Type**: Categorized error breakdown
- **Exception Count**: Unhandled exceptions

### Setting Up Analytics Dashboard

Create a custom dashboard to monitor key metrics:

1. In the Cloudflare Dashboard, go to **Analytics & Logs** → **Workers Analytics**
2. Click **Create Dashboard**
3. Add the following widgets:
   - **Request Volume** (line chart, 24h view)
   - **Error Rate** (line chart, 24h view)
   - **Response Time P95** (line chart, 24h view)
   - **Status Code Distribution** (pie chart)
   - **Top Endpoints** (table)

### GraphQL Analytics API

For programmatic access to analytics data:

```bash
# Get request metrics for last 24 hours
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer <your-api-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { viewer { zones(filter: { zoneTag: \"<zone-id>\" }) { httpRequests1dGroups(limit: 24, filter: { datetime_gt: \"2024-01-14T00:00:00Z\" }) { sum { requests } dimensions { datetime } } } } }"
  }'
```

---

## Error Rate Alerting

Set up alerts to notify you when error rates exceed acceptable thresholds.

### Cloudflare Notifications

#### Step 1: Create Notification Policy

1. Go to **Cloudflare Dashboard** → **Notifications**
2. Click **Add**
3. Select **Workers** → **Error Rate Alert**

#### Step 2: Configure Alert Conditions

Set up the following alert:

**Alert Name**: High Error Rate - Korean Teacher API

**Conditions**:
- Worker: `korean-teacher-api`
- Error rate exceeds: **5%**
- Time window: **5 minutes**
- Minimum requests: **10** (avoid false positives during low traffic)

**Notification Channels**:
- Email: your-team@example.com
- Webhook: (optional) for Slack/Discord integration
- PagerDuty: (optional) for on-call rotation

#### Step 3: Test Alert

Trigger a test alert to verify configuration:

```bash
# In Cloudflare Dashboard
Notifications → Your Alert → Send Test
```

### Additional Alert Types

Create alerts for:

1. **High CPU Usage**
   - Condition: CPU time > 50ms for 95th percentile
   - Action: Investigate slow endpoints

2. **Service Degradation**
   - Condition: Health check returns "degraded" status
   - Action: Check D1, KV, R2 service status

3. **Rate Limit Exceeded**
   - Condition: 429 responses > 1% of total requests
   - Action: Review rate limit configuration or identify abuse

4. **Unusual Traffic Spike**
   - Condition: Requests increase by 200% compared to baseline
   - Action: Check for DDoS or legitimate traffic surge

### Webhook Integration for Slack

Set up Slack notifications:

1. Create a Slack Incoming Webhook:
   - Go to Slack → Apps → Incoming Webhooks
   - Create webhook for your channel (e.g., `#api-alerts`)
   - Copy webhook URL

2. Add webhook to Cloudflare notification:
   - Cloudflare Dashboard → Notifications → Add Webhook
   - Name: "Slack Alerts"
   - URL: Your Slack webhook URL
   - Test the webhook

3. Configure notification to use Slack webhook

**Example Slack Message**:
```
🚨 High Error Rate Alert
Worker: korean-teacher-api
Error Rate: 8.5% (threshold: 5%)
Time: 2024-01-15 10:30 UTC
View Logs: https://dash.cloudflare.com/...
```

---

## Performance Dashboard

Create a comprehensive performance monitoring dashboard.

### Real-Time Performance Monitoring

#### Using Cloudflare Workers Analytics Engine

Add custom analytics to track specific metrics:

```typescript
// In your worker code (future enhancement)
import { AnalyticsEngine } from '@cloudflare/workers-types'

interface Env {
  ANALYTICS: AnalyticsEngine
  // ... other bindings
}

// Track endpoint performance
async function trackPerformance(
  env: Env,
  endpoint: string,
  duration: number,
  statusCode: number
) {
  await env.ANALYTICS.writeDataPoint({
    blobs: [endpoint],
    doubles: [duration],
    indexes: [statusCode.toString()]
  })
}
```

### Key Performance Indicators (KPIs)

Monitor these KPIs for optimal performance:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Cached resource list response time | < 50ms | > 100ms |
| Notion API query response time | < 2s | > 3s |
| R2 download URL generation | < 500ms | > 1s |
| File upload processing | < 30s | > 45s |
| Health check response time | < 100ms | > 500ms |
| Overall P95 response time | < 1s | > 2s |

### Performance Tracking Implementation

The API includes performance tracking in development mode:

```typescript
// Automatically logged in development
// Example log output:
{
  "method": "GET",
  "path": "/api/resources",
  "status": 200,
  "duration": 45,
  "cached": true
}
```

### Creating Performance Dashboard

Use Grafana or similar tools with Cloudflare GraphQL API:

1. **Set up Grafana** (or use Cloudflare's built-in dashboards)

2. **Add Cloudflare data source**:
   - Type: GraphQL
   - URL: `https://api.cloudflare.com/client/v4/graphql`
   - Auth: Bearer token

3. **Create panels**:

   **Panel 1: Response Time Percentiles**
   ```graphql
   query {
     viewer {
       zones(filter: { zoneTag: $zoneId }) {
         httpRequests1mGroups(
           limit: 60
           filter: { datetime_gt: $startTime }
         ) {
           quantiles {
             p50
             p95
             p99
           }
           dimensions {
             datetime
           }
         }
       }
     }
   }
   ```

   **Panel 2: Requests by Endpoint**
   ```graphql
   query {
     viewer {
       zones(filter: { zoneTag: $zoneId }) {
         httpRequests1hGroups(
           limit: 24
           filter: { datetime_gt: $startTime }
         ) {
           sum {
             requests
           }
           dimensions {
             clientRequestPath
           }
         }
       }
     }
   }
   ```

   **Panel 3: Error Rate Over Time**
   ```graphql
   query {
     viewer {
       zones(filter: { zoneTag: $zoneId }) {
         httpRequests1mGroups(
           limit: 60
           filter: { datetime_gt: $startTime }
         ) {
           sum {
             requests
           }
           ratio {
             errors: sum(requests, filter: { edgeResponseStatus_geq: 500 })
             total: sum(requests)
           }
         }
       }
     }
   }
   ```

---

## Health Check Monitoring

Set up automated health check monitoring to detect service degradation.

### External Health Check Services

Use external monitoring services to check API health:

#### Option 1: UptimeRobot (Free)

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://your-api.workers.dev/api/health`
   - Interval: 5 minutes
   - Alert contacts: Your email/Slack

3. Configure alert conditions:
   - Alert when: Status code is not 200
   - Alert when: Response contains `"status": "degraded"`
   - Alert when: Response time > 5 seconds

#### Option 2: Pingdom

1. Sign up at [pingdom.com](https://www.pingdom.com)
2. Create uptime check:
   - URL: `https://your-api.workers.dev/api/health`
   - Check interval: 1 minute
   - Locations: Multiple regions

3. Set up transaction check:
   - Verify JSON response structure
   - Check `status` field equals "healthy"
   - Verify all services show `"status": "up"`

#### Option 3: Custom Health Check Script

Run a scheduled health check script:

```bash
#!/bin/bash
# health-check.sh

API_URL="https://your-api.workers.dev/api/health"
SLACK_WEBHOOK="your-slack-webhook-url"

# Fetch health status
RESPONSE=$(curl -s $API_URL)
STATUS=$(echo $RESPONSE | jq -r '.status')

# Check if degraded
if [ "$STATUS" != "healthy" ]; then
  # Send alert to Slack
  curl -X POST $SLACK_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{
      \"text\": \"⚠️ API Health Check Failed\",
      \"attachments\": [{
        \"color\": \"danger\",
        \"text\": \"Status: $STATUS\n\nDetails: \`\`\`$RESPONSE\`\`\`\"
      }]
    }"
fi
```

Schedule with cron:
```bash
# Run every 5 minutes
*/5 * * * * /path/to/health-check.sh
```

### Health Check Dashboard

Create a simple status page:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Korean Teacher API Status</title>
  <style>
    .healthy { color: green; }
    .degraded { color: orange; }
    .down { color: red; }
  </style>
</head>
<body>
  <h1>API Status</h1>
  <div id="status">Loading...</div>
  
  <script>
    async function checkHealth() {
      const response = await fetch('https://your-api.workers.dev/api/health')
      const data = await response.json()
      
      const statusDiv = document.getElementById('status')
      statusDiv.className = data.status
      statusDiv.innerHTML = `
        <h2>Overall Status: ${data.status}</h2>
        <ul>
          <li>D1 Database: ${data.services.d1.status} (${data.services.d1.responseTime}ms)</li>
          <li>KV Cache: ${data.services.kv.status} (${data.services.kv.responseTime}ms)</li>
          <li>R2 Storage: ${data.services.r2.status} (${data.services.r2.responseTime}ms)</li>
        </ul>
        <p>Last checked: ${data.timestamp}</p>
      `
    }
    
    checkHealth()
    setInterval(checkHealth, 60000) // Check every minute
  </script>
</body>
</html>
```

---

## Log Analysis

Analyze logs to identify issues and optimize performance.

### Real-Time Logs

View real-time logs using Wrangler:

```bash
# Stream all logs
wrangler tail

# Filter by status code
wrangler tail --status error

# Filter by specific text
wrangler tail --search "INSUFFICIENT_MILEAGE"

# Save logs to file
wrangler tail > logs.txt
```

### Cloudflare Logpush

For long-term log storage and analysis:

1. **Enable Logpush** (requires paid plan):
   ```bash
   wrangler logpush create \
     --destination-conf "s3://your-bucket/logs" \
     --dataset workers_trace_events
   ```

2. **Configure log fields**:
   - Timestamp
   - Request method and path
   - Response status code
   - Duration
   - User agent
   - Country
   - Error messages

3. **Analyze logs** with tools like:
   - AWS Athena (for S3 logs)
   - Elasticsearch + Kibana
   - Splunk
   - Datadog

### Common Log Queries

#### Find slow requests
```bash
wrangler tail | grep -E "duration\":[0-9]{4,}"
```

#### Count errors by type
```bash
wrangler tail --status error | grep -oP '"code":"[^"]*"' | sort | uniq -c
```

#### Monitor specific endpoint
```bash
wrangler tail | grep "/api/resources/upload"
```

---

## Custom Metrics

Track custom business metrics for deeper insights.

### Metrics to Track

1. **User Engagement**
   - Daily active users
   - Resource downloads per user
   - Upload frequency

2. **Resource Metrics**
   - Most downloaded resources
   - Average mileage per download
   - Upload approval rate

3. **Mileage Economy**
   - Total mileage in circulation
   - Average user balance
   - Mileage earned vs. spent ratio

4. **Performance Metrics**
   - Cache hit rate
   - Notion API retry rate
   - R2 upload success rate

### Implementation Example

Add custom metrics tracking:

```typescript
// Track cache hit rate
let cacheHits = 0
let cacheMisses = 0

async function getResourcesWithMetrics(c: Context) {
  const cached = await c.env.CACHE.get(cacheKey)
  
  if (cached) {
    cacheHits++
    // Log metric
    console.log(JSON.stringify({
      metric: 'cache_hit_rate',
      hits: cacheHits,
      misses: cacheMisses,
      rate: cacheHits / (cacheHits + cacheMisses)
    }))
  } else {
    cacheMisses++
  }
  
  // ... rest of logic
}
```

### Metrics Dashboard

Create a dashboard to visualize custom metrics:

1. Export metrics to a time-series database (e.g., InfluxDB, Prometheus)
2. Create Grafana dashboard with panels for each metric
3. Set up alerts for anomalies

---

## Monitoring Checklist

Ensure you have the following monitoring in place:

- [ ] Cloudflare Analytics dashboard configured
- [ ] Error rate alerts set up (threshold: 5%)
- [ ] Performance alerts configured (P95 > 2s)
- [ ] External health check monitoring (UptimeRobot/Pingdom)
- [ ] Slack/email notifications configured
- [ ] Real-time log monitoring with `wrangler tail`
- [ ] Weekly performance review scheduled
- [ ] Monthly capacity planning review
- [ ] Incident response runbook created
- [ ] On-call rotation established (if applicable)

---

## Incident Response

When alerts fire, follow this process:

### 1. Acknowledge Alert
- Acknowledge in notification system
- Post in team chat: "Investigating API issue"

### 2. Check Health Status
```bash
curl https://your-api.workers.dev/api/health
```

### 3. Review Recent Logs
```bash
wrangler tail --status error
```

### 4. Check Cloudflare Status
- Visit [Cloudflare Status](https://www.cloudflarestatus.com)
- Check for platform-wide issues

### 5. Check External Services
- Notion API status
- GitHub API status
- R2 service status

### 6. Rollback if Needed
```bash
wrangler rollback [deployment-id]
```

### 7. Post-Incident Review
- Document what happened
- Identify root cause
- Create action items to prevent recurrence

---

## Best Practices

1. **Set realistic alert thresholds** - avoid alert fatigue
2. **Monitor trends, not just absolutes** - look for unusual patterns
3. **Test alerts regularly** - ensure notifications work
4. **Document runbooks** - clear steps for common issues
5. **Review metrics weekly** - identify optimization opportunities
6. **Keep dashboards simple** - focus on actionable metrics
7. **Automate responses** - auto-scale, auto-restart where possible
8. **Maintain on-call rotation** - ensure 24/7 coverage for critical issues

---

## Resources

- [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/analytics/)
- [Cloudflare GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/)
- [Wrangler Tail Documentation](https://developers.cloudflare.com/workers/wrangler/commands/#tail)
- [Cloudflare Notifications](https://developers.cloudflare.com/notifications/)

