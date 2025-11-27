export function parseWeb3Error(err: any): string {
  console.log("err parseWeb3Error", err);
  if (!err) return "Unknown error";

  // 🟢 Backend Golang/Fiber Format
  if (err?.response?.data?.error?.message) {
    return err.response.data.error.message;
  }
  if (err?.response?.data?.error?.code) {
    return err.response.data.error.code.replace(/_/g, " ");
  }
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  // 🟠 Axios network errors
  if (err?.response?.status === 401) {
    return "Unauthorized. Please login again.";
  }
  if (err?.response?.status === 500) {
    return "Internal server error. Please try later.";
  }
  if (err?.message?.includes("Network Error")) {
    return "Network error. Check your internet connection.";
  }

  // 🟡 MetaMask & EVM Wallet Rejection
  if (err.code === 4001) {
    return "User rejected the request.";
  }

  // 🟣 Solana Phantom rejection
  if (
    err.code === "ACTION_REJECTED" ||
    err.message?.includes("User rejected")
  ) {
    return "User rejected the signature request.";
  }

  // 🔵 Provider not found
  if (err.message?.includes("provider") || err.message?.includes("wallet")) {
    return "No Web3 wallet detected.";
  }

  // 🔴 Network / unsupported chain
  if (err.code === 4902 || err.message?.includes("chain")) {
    return "Unsupported network. Please switch wallet network.";
  }

  // 🪙 Fallback final case
  if (typeof err === "string") return err;
  return err?.message || "Unexpected error occurred.";
}
