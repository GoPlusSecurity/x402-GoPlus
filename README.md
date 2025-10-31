# GoPlus Security x402 Examples

Example code for interacting with GoPlus Security APIs using the x402 payment protocol.

## What is x402?

x402 is an open protocol for internet-native payments. Instead of requiring you to sign up with an email, create an account, or deal with OAuth, you can simply pay-as-you-go with crypto to access resources via APIs.

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (recommended) or npm
- A wallet with a private key
- USDC on Base network for payments

### Installation

```bash
# Install dependencies
pnpm install

# or with npm
npm install
```

### Configuration

1. Copy `.env.sample` to `.env`
2. Add your wallet private key to `.env`:

```env
WALLET_PRIVATE_KEY=0x...
```

**⚠️ IMPORTANT:** Never commit your `.env` file or expose your private key. The `.gitignore` file is configured to protect you.

## Available Examples

### Fetch Example

Uses the `x402-fetch` library which wraps the native fetch API with automatic payment handling.

```bash
node fetch-example.js
```

This example demonstrates:
- Token security detection using native fetch
- Automatic payment handling
- Response parsing and payment metadata extraction

### Axios Example

Uses the `x402-axios` library which adds payment interceptors to axios.

```bash
node axios-example.js
```

This example demonstrates:
- Address security detection using axios
- Payment interceptor integration
- Error handling with automatic refunds

## How It Works

The x402 libraries (`x402-fetch` and `x402-axios`) automatically handle the entire payment flow:

1. **Initial Request**: You make a normal HTTP request to the API
2. **402 Detection**: The library detects a 402 Payment Required response
3. **Payment Verification**: Verifies the payment amount and creates a payment authorization
4. **Retry**: Automatically retries the request with payment headers
5. **Success**: Returns the API response with payment metadata

No need to manually handle signatures, retries, or payment logic!

## API Endpoints

All endpoints are available at: **https://x402.gopluslabs.io**

### Token Security Detection
- **Endpoint**: `POST https://x402.gopluslabs.io/api/detect-token`
- **Price**: $0.2 USDC per call
- **Purpose**: Comprehensive smart contract security analysis
- **Features**:
  - Honeypot detection
  - Token security risk analysis
  - Trading tax analysis
  - Ownership verification
  - Multi-chain support

### Address Security Detection
- **Endpoint**: `POST https://x402.gopluslabs.io/api/detect-address`
- **Price**: $0.1 USDC per call
- **Purpose**: Malicious address identification
- **Features**:
  - Phishing detection
  - Scam identification
  - Money laundering flagging
  - Sanctioned address checking
  - Fake token/NFT detection

## Response Structure

### Successful Response

```json
{
  "success": true,
  "data": {
    // Raw GoPlus Security API response
  },
  "meta": {
    "contractAddress": "0x...",
    "chainId": 56,
    "detectedAt": "2025-10-31T...",
    "processingTimeMs": 123,
    "provider": "GoPlus Security"
  }
}
```

### Payment Response Header

The `x-payment-response` header contains payment metadata:

```json
{
  "transaction": "0x...",
  "network": "base",
  "payer": "0x...",
  "amount": "200000"
}
```

### Error Handling

If the API returns a 404 or 500 error after payment, the x402 protocol will automatically issue an onchain refund. You'll receive a transaction hash as proof.

## Security Best Practices

1. **Never commit your `.env` file**
2. **Use a dedicated wallet** for API payments (not your main wallet)
3. **Keep a small balance** in your payment wallet
4. **Monitor your transactions** on Base network
5. **Validate API responses** before using the data

## Supported Networks

- **Base** (recommended for lowest fees)
- **Ethereum** (higher fees)
- Other EVM-compatible chains

## Learn More

- [x402 Protocol Documentation](https://docs.x402.org/)
- [GoPlus Security API Documentation](https://docs.gopluslabs.io/)
- [x402-fetch Package](https://www.npmjs.com/package/x402-fetch)
- [x402-axios Package](https://www.npmjs.com/package/x402-axios)

## Troubleshooting

### "Insufficient balance" error
Make sure you have enough USDC on Base network to cover the API call price plus gas fees.

### "Invalid signature" error
Check that your private key is correct and the wallet has never made a payment authorization with this nonce before.

### "Network mismatch" error
The API expects payments on Base network. Make sure your wallet is configured for Base.

## License

ISC

## Support

For issues or questions:
- Open an issue on GitHub
- Contact GoPlus Security support
- Check the x402 documentation
