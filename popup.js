$(() => {
    const sendMessage = (message) => new Promise((r) => chrome.runtime.sendMessage(message, (d) => { r(d), chrome.runtime.lastError }));
    Utility.getDB('').then(async db => {
        console.log(db)
        let tab = await sendMessage({ isInstaTab: true });
        console.log(tab)
        if (!tab) {
            //$('.insta-panel').hide();
            //return;
        }
        
        if (moment(db.config.dailyLimitDate).format('DD') != moment().format('DD')) {
            db.config.dailyLimitDate = moment().format();
            db.config.noOfFollow = 0;
            db.config.noOfMessage = 0;
            Utility.setDB({ config: db.config })
        }
        $('#message-text').val(db.config.messageBody || "");
        
        
        $('#startAction').click(function() {
            db.config.messageBody = $('#message-text').val();
            Utility.setDB({ config: db.config })
            sendMessage({ startAction: true }).then(x => {
                window.close()
            });
        });
    });
})