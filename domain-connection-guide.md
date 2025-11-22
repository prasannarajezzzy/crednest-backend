# Domain Connection Guide - CrediNest

## Method 1: Domain from Hostinger (Recommended)

### Steps:
1. **Login to Hostinger** → `hostinger.com`
2. **Dashboard** → Click "Hosting" 
3. **Find your hosting plan** → Click "Manage"
4. **Domains section** → Click "Add Domain"
5. **Enter domain name** → `yourdomainname.com`
6. **Click "Add Domain"**
7. **Set as Primary Domain** (optional)

## Method 2: External Domain Provider

### Part A: Get Hostinger Nameservers
1. **Hostinger Control Panel** → "Hosting" → "Manage"
2. **Find "DNS Zone"** or "Nameservers" section
3. **Copy nameservers** (example):
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```

### Part B: Update Domain DNS
1. **Login to your domain registrar** (GoDaddy/Namecheap/etc.)
2. **Domain Management** → Find your domain
3. **DNS Settings** → "Nameservers"
4. **Change to "Custom"**
5. **Enter Hostinger nameservers**
6. **Save Changes**

### Part C: Add Domain in Hostinger
1. **Hostinger Control Panel** → "Domains"
2. **"Add Domain"** → Enter domain name
3. **Click "Add Domain"**

## DNS Propagation Time
- **Typical time**: 24-48 hours
- **Check status**: Use `whatsmydns.net`
- **Test**: Try accessing your domain

## Troubleshooting
- **Domain not working?** Wait 24-48 hours for DNS propagation
- **SSL issues?** Enable SSL in Hostinger control panel
- **Subdomain setup?** Add www and non-www versions

## Final Verification
- [ ] Domain loads your website
- [ ] Both www and non-www work
- [ ] HTTPS (SSL) is working
- [ ] All pages load correctly
