import "dotenv/config";
import axios from "axios";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

// Create a wallet account from your private key
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

// Create an Axios instance with x402 payment interceptor
// Note: The axios interceptor doesn't have a built-in maxValue parameter
// Payment amounts: token detection = 0.2 USDC, address detection = 0.1 USDC
// The interceptor will automatically handle payments up to the required amount
const api = withPaymentInterceptor(axios.create(), account);

// Example 1: Token Security Detection
console.log("🔍 Analyzing token security with Axios...\n");

api
  .post("https://x402.gopluslabs.io/api/detect-token", {
    contractAddress: "0x55d398326f99059fF775485246999027B3197955", // USDT on BSC
    chainId: 56,
  })
  .then((response) => {
    console.log("✅ Token Analysis Result:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("\n");

    // Decode the payment response from headers
    const paymentResponse = decodeXPaymentResponse(
      response.headers["x-payment-response"]
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
    console.error("❌ Error:", error.response?.data || error.message);
  });

// Example 2: Address Security Detection (uncomment to run)
/*
console.log("🔍 Checking address security with Axios...\n");

api
  .post("https://x402.gopluslabs.io/api/detect-address", {
    address: "0x1234567890123456789012345678901234567890",
  })
  .then((response) => {
    console.log("✅ Address Analysis Result:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("\n");

    const paymentResponse = decodeXPaymentResponse(
      response.headers["x-payment-response"]
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
    console.error("❌ Error:", error.response?.data || error.message);
  });
*/
