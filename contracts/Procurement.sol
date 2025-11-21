// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Procurement
 * @dev Core logic for H.E.L.I.X. budget allocation, vendor claims, and fraud management.
 * Designed for deployment on Hedera Smart Contract Service (HSCS).
 */
contract Procurement {
    
    // Roles
    address public mainGovernment;
    mapping(address => bool) public stateHeads;
    mapping(address => bool) public deputies;
    mapping(address => bool) public vendors;
    
    // Structs
    struct Budget {
        uint256 id;
        uint256 amount;
        string purpose;
        uint256 allocated;
        uint256 remaining;
        bool active;
        uint256 timestamp;
    }
    
    struct Allocation {
        uint256 id;
        uint256 budgetId;
        uint256 amount;
        string area;
        address deputy;
        uint256 timestamp;
    }
    
    struct Claim {
        uint256 id;
        uint256 budgetId;
        uint256 allocationId;
        address vendor;
        uint256 amount;
        string description;
        string invoiceHash; // IPFS or similar hash
        bool approved;
        bool paid;
        uint256 fraudScore; // 0-100
        bool flagged;
        uint256 timestamp;
    }
    
    // State
    uint256 public budgetCount;
    uint256 public allocationCount;
    uint256 public claimCount;
    
    mapping(uint256 => Budget) public budgets;
    mapping(uint256 => Allocation) public allocations;
    mapping(uint256 => Claim) public claims;
    
    // Events
    event BudgetCreated(uint256 indexed id, uint256 amount, string purpose);
    event BudgetAllocated(uint256 indexed id, uint256 indexed budgetId, uint256 amount, address indexed deputy);
    event ClaimSubmitted(uint256 indexed id, address indexed vendor, uint256 amount);
    event ClaimApproved(uint256 indexed id);
    event ClaimFlagged(uint256 indexed id, uint256 fraudScore);
    
    // Modifiers
    modifier onlyMainGovernment() {
        require(msg.sender == mainGovernment, "Only Main Government");
        _;
    }
    
    modifier onlyStateHead() {
        require(stateHeads[msg.sender] || msg.sender == mainGovernment, "Only State Head");
        _;
    }
    
    modifier onlyDeputy() {
        require(deputies[msg.sender] || stateHeads[msg.sender] || msg.sender == mainGovernment, "Only Deputy");
        _;
    }
    
    modifier onlyVendor() {
        require(vendors[msg.sender], "Only Vendor");
        _;
    }
    
    constructor() {
        mainGovernment = msg.sender;
    }
    
    // Role Management
    function addStateHead(address _stateHead) external onlyMainGovernment {
        stateHeads[_stateHead] = true;
    }
    
    function addDeputy(address _deputy) external onlyStateHead {
        deputies[_deputy] = true;
    }
    
    function addVendor(address _vendor) external onlyDeputy {
        vendors[_vendor] = true;
    }
    
    // Budget Management
    function createBudget(uint256 _amount, string memory _purpose) external onlyMainGovernment {
        budgetCount++;
        budgets[budgetCount] = Budget({
            id: budgetCount,
            amount: _amount,
            purpose: _purpose,
            allocated: 0,
            remaining: _amount,
            active: true,
            timestamp: block.timestamp
        });
        
        emit BudgetCreated(budgetCount, _amount, _purpose);
    }
    
    function allocateBudget(
        uint256 _budgetId, 
        uint256 _amount, 
        string memory _area, 
        address _deputy
    ) external onlyStateHead {
        Budget storage budget = budgets[_budgetId];
        require(budget.active, "Budget not active");
        require(budget.remaining >= _amount, "Insufficient budget remaining");
        
        budget.allocated += _amount;
        budget.remaining -= _amount;
        
        allocationCount++;
        allocations[allocationCount] = Allocation({
            id: allocationCount,
            budgetId: _budgetId,
            amount: _amount,
            area: _area,
            deputy: _deputy,
            timestamp: block.timestamp
        });
        
        emit BudgetAllocated(allocationCount, _budgetId, _amount, _deputy);
    }
    
    // Claim Management
    function submitClaim(
        uint256 _budgetId,
        uint256 _allocationId,
        uint256 _amount,
        string memory _description,
        string memory _invoiceHash
    ) external onlyVendor {
        claimCount++;
        claims[claimCount] = Claim({
            id: claimCount,
            budgetId: _budgetId,
            allocationId: _allocationId,
            vendor: msg.sender,
            amount: _amount,
            description: _description,
            invoiceHash: _invoiceHash,
            approved: false,
            paid: false,
            fraudScore: 0,
            flagged: false,
            timestamp: block.timestamp
        });
        
        emit ClaimSubmitted(claimCount, msg.sender, _amount);
    }
    
    function approveClaim(uint256 _claimId) external onlyDeputy {
        Claim storage claim = claims[_claimId];
        require(!claim.approved, "Already approved");
        require(!claim.flagged, "Claim is flagged for fraud");
        
        claim.approved = true;
        emit ClaimApproved(_claimId);
    }
    
    function flagClaim(uint256 _claimId, uint256 _fraudScore) external onlyMainGovernment {
        Claim storage claim = claims[_claimId];
        claim.flagged = true;
        claim.fraudScore = _fraudScore;
        emit ClaimFlagged(_claimId, _fraudScore);
    }

    // Read Functions
    function getBudgets(uint256 _offset, uint256 _limit) external view returns (Budget[] memory) {
        uint256 limit = _limit;
        if (limit > budgetCount - _offset) {
            limit = budgetCount - _offset;
        }
        
        Budget[] memory result = new Budget[](limit);
        for (uint256 i = 0; i < limit; i++) {
            result[i] = budgets[_offset + i + 1];
        }
        return result;
    }

    function getAllocations(uint256 _budgetId) external view returns (Allocation[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= allocationCount; i++) {
            if (allocations[i].budgetId == _budgetId) {
                count++;
            }
        }
        
        Allocation[] memory result = new Allocation[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= allocationCount; i++) {
            if (allocations[i].budgetId == _budgetId) {
                result[index] = allocations[i];
                index++;
            }
        }
        return result;
    }

    function getClaims(uint256 _offset, uint256 _limit) external view returns (Claim[] memory) {
        uint256 limit = _limit;
        if (limit > claimCount - _offset) {
            limit = claimCount - _offset;
        }
        
        Claim[] memory result = new Claim[](limit);
        for (uint256 i = 0; i < limit; i++) {
            result[i] = claims[_offset + i + 1];
        }
        return result;
    }

    function getVendorClaims(address _vendor) external view returns (Claim[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= claimCount; i++) {
            if (claims[i].vendor == _vendor) {
                count++;
            }
        }
        
        Claim[] memory result = new Claim[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= claimCount; i++) {
            if (claims[i].vendor == _vendor) {
                result[index] = claims[i];
                index++;
            }
        }
        return result;
    }

    function getSystemStats() external view returns (
        uint256 totalBudgets,
        uint256 totalAllocations,
        uint256 totalClaims,
        uint256 totalAllocatedAmount,
        uint256 totalClaimedAmount
    ) {
        uint256 allocatedAmount = 0;
        for (uint256 i = 1; i <= budgetCount; i++) {
            allocatedAmount += budgets[i].allocated;
        }

        uint256 claimedAmount = 0;
        for (uint256 i = 1; i <= claimCount; i++) {
            claimedAmount += claims[i].amount;
        }

        return (
            budgetCount,
            allocationCount,
            claimCount,
            allocatedAmount,
            claimedAmount
        );
    }
}
