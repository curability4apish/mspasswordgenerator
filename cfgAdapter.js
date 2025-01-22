var CfgAdapter = {};

CfgAdapter.load = function(siteKey) {
    // Removed v1 and v0 calls as they used localStorage
    return {
        size: 16,
        charsetFlag: 0xf,
    };
};

CfgAdapter.save = function(siteKey, cfg) {
    // Removed v1 save call as it used localStorage
};

// Removed CfgAdapter.v0 as it used localStorage

// Removed CfgAdapter.v1 as it used localStorage
