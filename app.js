document.addEventListener('DOMContentLoaded', function() {
    // Log to our UI's event log
    function logEvent(message) {
        const eventLog = document.getElementById('event-log');
        const logEntry = document.createElement('p');
        logEntry.className = 'mb-1 text-sm';
        logEntry.innerHTML = `<span class="text-gray-500">[${new Date().toLocaleTimeString()}]</span> ${message}`;
        eventLog.prepend(logEntry);
    }

    // Initialize - log when CleverTap is ready
    if (typeof clevertap !== 'undefined') {
        logEvent('CleverTap SDK initialized');
    } else {
        logEvent('Error: CleverTap SDK not found');
    }

    // User identification
    document.getElementById('identify-user').addEventListener('click', function() {
        const userId = document.getElementById('user-id').value.trim();
        const userEmail = document.getElementById('user-email').value.trim();
        const userName = document.getElementById('user-name').value.trim();
        const userPhone = document.getElementById('user-phone').value.trim();
        
        if (!userId && !userEmail && !userName && !userPhone) {
            logEvent('Error: Please enter at least one user identifier');
            return;
        }
        
        // Create profile object, only adding properties that are provided
        const profile = {
            Site: {}
        };
        
        // Only add fields that have values
        if (userId) profile.Site.Identity = userId;
        if (userEmail) profile.Site.Email = userEmail;
        if (userName) profile.Site.Name = userName;
        if (userPhone) profile.Site.Phone = userPhone;
        
        // Add timestamp for all logins
        profile.Site.Last_Visited = new Date().toISOString();
        
        // Send to CleverTap
        clevertap.onUserLogin.push(profile);
        
        // Create a readable summary of what was sent
        const sentFields = [];
        if (userId) sentFields.push(`ID: ${userId}`);
        if (userEmail) sentFields.push(`Email: ${userEmail}`);
        if (userName) sentFields.push(`Name: ${userName}`);
        if (userPhone) sentFields.push(`Phone: ${userPhone}`);
        
        logEvent(`User logged in with: ${sentFields.join(', ')}`);
    });

    // Track page view
    document.getElementById('btn-page-view').addEventListener('click', function() {
        clevertap.event.push("Page Viewed", {
            "Page Name": "Test Page",
            "Source": "Test App"
        });
        logEvent('Event: Page View tracked');
    });

    // Track button click
    document.getElementById('btn-button-click').addEventListener('click', function() {
        clevertap.event.push("Button Clicked", {
            "Button Name": "Test Button",
            "Page": "Test Page"
        });
        logEvent('Event: Button Click tracked');
    });

    // Track button click using window.clevertap
    document.getElementById('btn-window-clevertap').addEventListener('click', function() {
        // Using window.CleverTap explicitly (note the capital 'C' and 'T')
        var props = {
            "Button Name": "Window CleverTap Button",
            "Page": "Test Page",
            "Method": "CleverTap.pushEvent"
        };
        
        if (window.webview_var) {
            // Call Android interface with proper JSON stringification
            webview_var.pushEvent("Button Clicked", JSON.stringify(props));
            logEvent('Event: Button Click tracked via window.CleverTap');
        } else {
            logEvent('Warning: window.CleverTap interface not found');
        }
    });

    // Track add to cart
    document.getElementById('btn-add-to-cart').addEventListener('click', function() {
        clevertap.event.push("Product Added to Cart", {
            "Product name": "Test Product",
            "Product ID": "TEST-1234",
            "Price": 99.99,
            "Currency": "USD"
        });
        logEvent('Event: Add to Cart tracked');
    });

    // Track purchase
    document.getElementById('btn-purchase').addEventListener('click', function() {
        clevertap.event.push("Purchase", {
            "Order ID": "ORDER-" + Math.floor(Math.random() * 10000),
            "Total": 99.99,
            "Currency": "USD",
            "Products": ["Test Product"]
        });
        logEvent('Event: Purchase tracked');
    });

    // Automatic page view tracking
    window.addEventListener('load', function() {
        clevertap.event.push("Page Loaded", {
            "Page Name": document.title,
            "URL": window.location.href
        });
        logEvent('Page load event automatically tracked');
    });
});