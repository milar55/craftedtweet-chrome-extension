/**
 * Minimal OAuth 1.0a Header Generator
 * Uses browser-native Crypto API for HMAC-SHA1
 */
window.OAuthSigner = {
    /**
     * Generate an OAuth 1.0a Authorization header
     */
    async generateHeader(method, url, params, secrets) {
        const oauthParams = {
            oauth_consumer_key: secrets.apiKey,
            oauth_nonce: Math.random().toString(36).substring(2),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
            oauth_token: secrets.accessToken,
            oauth_version: '1.0',
            ...params
        };

        const signature = await this._generateSignature(method, url, oauthParams, secrets);
        oauthParams.oauth_signature = signature;

        // Create Header String
        const headerParts = Object.keys(oauthParams)
            .filter(k => k.startsWith('oauth_'))
            .sort()
            .map(k => `${this._encode(k)}="${this._encode(oauthParams[k])}"`);

        return `OAuth ${headerParts.join(', ')}`;
    },

    async _generateSignature(method, url, params, secrets) {
        const baseString = [
            method.toUpperCase(),
            this._encode(url),
            this._encode(this._getParameterString(params))
        ].join('&');

        const signingKey = [
            this._encode(secrets.apiSecret),
            this._encode(secrets.accessTokenSecret)
        ].join('&');

        return await this._hmacSha1(signingKey, baseString);
    },

    _getParameterString(params) {
        return Object.keys(params)
            .sort()
            .map(k => `${this._encode(k)}=${this._encode(params[k])}`)
            .join('&');
    },

    _encode(str) {
        return encodeURIComponent(str)
            .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
    },

    async _hmacSha1(key, message) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const messageData = encoder.encode(message);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }
};
