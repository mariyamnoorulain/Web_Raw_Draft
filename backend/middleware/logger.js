const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
               (req.connection.socket ? req.connection.socket.remoteAddress : null) || 'Unknown';

    // Log the request
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

    // Log request body for POST/PUT requests (but hide sensitive data)
    if ((method === 'POST' || method === 'PUT') && req.body) {
        const sanitizedBody = { ...req.body };
        
        // Hide sensitive fields
        if (sanitizedBody.password) {
            sanitizedBody.password = '***';
        }
        if (sanitizedBody.email) {
            sanitizedBody.email = sanitizedBody.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
        }
        
        console.log(`[${timestamp}] Request Body:`, JSON.stringify(sanitizedBody, null, 2));
    }

    // Log response when it finishes
    const originalSend = res.send;
    res.send = function(data) {
        const statusCode = res.statusCode;
        const statusMessage = statusCode >= 400 ? 'ERROR' : 'SUCCESS';
        console.log(`[${timestamp}] Response: ${statusCode} ${statusMessage} for ${method} ${url}`);
        
        originalSend.call(this, data);
    };

    next();
};

module.exports = logger;