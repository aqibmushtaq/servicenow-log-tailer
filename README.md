# Servicenow Log Tailer

## Setup
Configure the properties file to point at your ServiceNow instance.

### Cookies
Get your cookies Using Chrome DevTools
1. Login to your ServiceNow instance on Chrome
2. Open DevTools
3. Goto the Application tab and drill into the Cookies for your instance on the left pane
4. Copy the JSESSIONID value and paste it within the properties file
5. Copy the cookie that starts with 'BIGipServerpool_' and paste the name and value into the properties file

### Session Token
1. Goto background scripts
2. Run this: gs.print(gs.getSessionToken());
3. Paste the value into the properties file

### Host
1. Host name should be formatted like this: https://instancename.service-now.com
