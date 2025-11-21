import os
from hedera import (
    Client,
    AccountId,
    PrivateKey,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    FileCreateTransaction,
    FileAppendTransaction,
    Hbar
)
from dotenv import load_dotenv

load_dotenv()

class HederaService:
    def __init__(self):
        try:
            self.account_id = AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID"))
            self.private_key = PrivateKey.fromString(os.getenv("HEDERA_PRIVATE_KEY"))
            
            network = os.getenv("HEDERA_NETWORK", "testnet")
            if network == "mainnet":
                self.client = Client.forMainnet()
            else:
                self.client = Client.forTestnet()
                
            self.client.setOperator(self.account_id, self.private_key)
            print(f"Hedera Client Initialized on {network}")
        except Exception as e:
            print(f"Failed to initialize Hedera Client: {e}")
            self.client = None

    def create_topic(self, memo: str = "Helix Log"):
        if not self.client:
            return None
        
        try:
            transaction = TopicCreateTransaction()
            transaction.setSubmitKey(self.private_key.getPublicKey())
            transaction.setTopicMemo(memo)
            
            tx_response = transaction.execute(self.client)
            receipt = tx_response.getReceipt(self.client)
            topic_id = receipt.topicId
            print(f"Created new topic: {topic_id}")
            return str(topic_id)
        except Exception as e:
            print(f"Error creating topic: {e}")
            return None

    def submit_log(self, topic_id: str, message: str):
        if not self.client:
            return False
            
        try:
            transaction = TopicMessageSubmitTransaction()
            transaction.setTopicId(topic_id)
            transaction.setMessage(message)
            
            tx_response = transaction.execute(self.client)
            receipt = tx_response.getReceipt(self.client)
            print(f"Log submitted to topic {topic_id}: {receipt.status}")
            return True
        except Exception as e:
            print(f"Error submitting log: {e}")
            return False

    def store_file(self, file_content: bytes, memo: str = "Helix File"):
        if not self.client:
            return None
            
        try:
            # Create file
            transaction = FileCreateTransaction()
            transaction.setKeys([self.private_key.getPublicKey()])
            transaction.setContents(file_content[:4000]) # Initial chunk
            transaction.setFileMemo(memo)
            
            tx_response = transaction.execute(self.client)
            receipt = tx_response.getReceipt(self.client)
            file_id = receipt.fileId
            
            # Append remaining content if any
            if len(file_content) > 4000:
                # Simple chunking logic for demo
                pass 
                
            print(f"File stored: {file_id}")
            return str(file_id)
        except Exception as e:
            print(f"Error storing file: {e}")
            return None

hedera_service = HederaService()
