import { Client, AccountId, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import { HashConnect } from "hashconnect";

const APP_METADATA = {
    name: "CorruptGuard",
    description: "Transparent Government Procurement",
    icons: ["https://absolute.url/to/icon.png"], // Replace with real icon URL
    url: "http://localhost:5173"
};

class HederaService {
    private hashConnect: HashConnect;
    private saveData: any = null;
    private topicId: string = "0.0.456789"; // Default or env var

    constructor() {
        // LedgerId, ProjectId, Metadata, Debug
        this.hashConnect = new HashConnect("testnet" as any, "1234567890", APP_METADATA, false);
        console.log("Hedera Service Initialized");
    }

    async initHashConnect(): Promise<any> {
        // 1. Initialize
        const initData = await this.hashConnect.init();
        this.saveData = initData;
        return initData;
    }

    async connectWallet(): Promise<{ accountId: string } | null> {
        try {
            if (!this.saveData) {
                await this.initHashConnect();
            }

            // 2. Connect
            // this.hashConnect.connectToLocalWallet(); // Deprecated in v3?
            this.hashConnect.openPairingModal(); // Try this for v3

            // Wait for connection (simplified for demo)
            return new Promise((resolve) => {
                this.hashConnect.pairingEvent.once((pairingData) => {
                    const accountId = pairingData.accountIds[0];
                    console.log("HashPack Connected:", accountId);
                    resolve({ accountId });
                });

                // Fallback/Timeout for demo if no extension found
                setTimeout(() => {
                    console.warn("HashPack not found or timed out. Using mock.");
                    resolve({ accountId: "0.0.123456" });
                }, 3000);
            });

        } catch (error) {
            console.error("Failed to connect wallet:", error);
            return null;
        }
    }

    async disconnectWallet(): Promise<void> {
        // this.hashConnect.disconnect(this.saveData!.topic);
        this.saveData = null;
        console.log("Wallet disconnected");
    }

    async submitLog(topicId: string, message: string): Promise<boolean> {
        console.log(`[HCS] Submitting to Topic ${topicId}: ${message}`);
        // In a real app, we would use the provider to sign and submit
        // const provider = this.hashConnect.getProvider("testnet", this.saveData!.topic, this.saveData!.pairingString);
        // const signer = this.hashConnect.getSigner(provider);
        // ... execute transaction
        return true;
    }
}

export const hederaService = new HederaService();
