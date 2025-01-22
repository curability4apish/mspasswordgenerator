function addEventListener() {
    document.querySelector('#mainKey').addEventListener('keyup', onMainKeyKeyup);
    document.querySelector('#siteKey').addEventListener('keyup', onSiteKeyKeyup);
    document.querySelector('#size').addEventListener('input', onSizeInput);
    
    let nodes = document.querySelectorAll('#charset input');
    for(let i=0;i<nodes.length;++i) {
        nodes[i].addEventListener('change', onCharsetChange);
    }
    document.querySelector('#isForceAllSet').addEventListener('change', onIsForceAllSetChange);
    
    document.querySelector('#advSettingLink').addEventListener('click', onAdvSettingLinkClick);
    
    document.querySelector('#password').addEventListener('click', onPasswordClick);
    document.querySelector('#password').addEventListener('focusout', onPasswordFocusOut);
};

function onMainKeyKeyup(e) {
    PwGen.setMainKey(document.querySelector('#mainKey').value);
};
function onSiteKeyKeyup(e) {
    let siteKey = document.querySelector('#siteKey').value;
    PwGen.setSiteKey(siteKey);
    loadSiteCfg();
    
    if(e.keyCode == 13) {
        onPasswordClick();
        //window.close();
    }
};
function onSizeInput(e) {
    let size = document.querySelector('#size').value;
    document.querySelector('#sizeValue').value = size;
    PwGen.setSize(size);
};
function onCharsetChange(e) {
    let nodes = document.querySelectorAll('#charset input');
    let flag = 0;
    for(let i=0;i<nodes.length;++i) {
        if(!nodes[i].checked) continue;
        flag |= (1<<i);
    }
    PwGen.setCharsetFlag(flag);
};
function onIsForceAllSetChange(e) {
    PwGen.setIsForceAllSet(document.querySelector('#isForceAllSet').checked);
};

function onAdvSettingLinkClick(e) {
    let node = document.querySelector('html');
    node.setAttribute('isOpen', !(node.getAttribute('isOpen')=='true'));
};

function onPasswordClick(e) {
    document.querySelector('#password').select();
    document.execCommand('copy');
    document.querySelector('#copied').textContent = 'Password copied!';
    saveSiteCfg();
};
function onPasswordFocusOut(e) {
    document.querySelector('#copied').textContent = '';
};

function loadSiteCfg() {
    let siteCfg = CfgAdapter.load(PwGen.siteKey);

    if(document.querySelector('#size').value != siteCfg.size) {
        document.querySelector('#size').value = siteCfg.size;
        onSizeInput();
    }
    
    let flag = siteCfg.charsetFlag;
    let nodes = document.querySelectorAll('#charset input');
    for(let i=0;i<nodes.length;++i) {
        let isChecked = ((flag&(1<<i)) != 0);
        if(nodes[i].checked == isChecked) continue;
        
        nodes[i].checked = isChecked;
    }
    onCharsetChange();
    
    if(document.querySelector('#isForceAllSet').checked != (!!siteCfg.isForceAllSet)) {
        document.querySelector('#isForceAllSet').checked = (!!siteCfg.isForceAllSet);
        onIsForceAllSetChange();
    }
};
function saveSiteCfg() {
    CfgAdapter.save(PwGen.siteKey, {
        size: PwGen.size,
        charsetFlag: PwGen.charsetFlag,
        isForceAllSet: PwGen.isForceAllSet ? 1 : 0,
    });
};

// Removed loadMainHash and saveMainHash functions as they used localStorage

function getEnv() {
    let env = null;
    if (navigator.userAgent.indexOf('Firefox/') >= 0) env = 'firefox';
    else if (navigator.userAgent.indexOf('Chrome/') >= 0) env = 'chrome';
    
    if (!env) return;
    
    document.querySelector('html').setAttribute('env', env);
};

getEnv();
PwGen.addListener((pw) => {
    if (PwGen.siteKey.length <= 0) {
        pw = '';
    }
    document.querySelector('#password').value = pw;
});
// Removed call to loadMainHash as it used localStorage
addEventListener();
