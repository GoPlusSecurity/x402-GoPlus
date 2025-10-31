import "dotenv/config";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { privateKeyToAccount } from "viem/accounts";

// Create a wallet account from your private key
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

// Wrap the native fetch function with x402 payment handling
// Set maxValue to 0.2 USDC (200000 in base units, as USDC has 6 decimals)
// This means: token detection = 0.2 USDC, address detection = 0.1 USDC
const maxValue = BigInt(200000); // 0.2 USDC = 0.2 * 10^6
const fetchWithPayment = wrapFetchWithPayment(fetch, account, maxValue);

// Example 1: Token Security Detection
console.log("🔍 Analyzing token security...\n");

fetchWithPayment("https://x402.gopluslabs.io/api/detect-token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contractAddress: "0x55d398326f99059fF775485246999027B3197955", // USDT on BSC
    chainId: 56,
  }),
})
  .then(async (response) => {
    const body = await response.json();

    console.log("✅ Token Analysis Result:");
    console.log(JSON.stringify(body, null, 2));
    console.log("\n");

    // Decode the payment response from headers
    const paymentResponse = decodeXPaymentResponse(
      response.headers.get("x-payment-response")
    );

    if (paymentResponse) {
      console.log("💳 Payment Details:");
      console.log(`  Transaction: ${paymentResponse.transaction}`);
      console.log(`  Network: ${paymentResponse.network}`);
      console.log(`  Payer: ${paymentResponse.payer}`);
      console.log(`  Cost: 0.2 USDC (Token Detection)`);
      console.log("\n");
    }
  })
  .catch((error) => {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  });

// Example 2: Address Security Detection (uncomment to run)
/*
console.log("🔍 Checking address security...\n");

fetchWithPayment("https://x402.gopluslabs.io/api/detect-address", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    address: "0x1234567890123456789012345678901234567890",
  }),
})
  .then(async (response) => {
    const body = await response.json();

    console.log("✅ Address Analysis Result:");
    console.log(JSON.stringify(body, null, 2));
    console.log("\n");

    const paymentResponse = decodeXPaymentResponse(
      response.headers.get("x-payment-response")
    );

    if (paymentResponse) {
      console.log("💳 Payment Details:");
      console.log(`  Transaction: ${paymentResponse.transaction}`);
      console.log(`  Network: ${paymentResponse.network}`);
      console.log(`  Payer: ${paymentResponse.payer}`);
      console.log(`  Cost: 0.1 USDC (Address Detection)`);
    }
  })
  .catch((error) => {
    console.error("❌ Error:", error.message);
  });
*/
