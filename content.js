let initialData, counter = 0, eventData;
const xhrEvent = "datachannel";
runXHRWorker();
executeXHRCode();
function XHRRequester(open, mode) {
    if (!XMLHttpRequest.prototype.open.in) {
        (function (s) {
            let w, f = {},
                o = window,
                l = console,
                m = Math,
                z = "postMessage",
                p = 0,
                r = "hasOwnProperty",
                y = [].slice,
                x = "fail",
                v = o.Worker;

            function d() {
                do {
                    p = 2147483647 > p ? p + 1 : 0
                } while (f[r](p));
                return p
            }
            if (!/MSIE 10/i.test(navigator.userAgent)) {
                try {
                    s = o.URL.createObjectURL(new Blob(["let f={},p=postMessage,r='hasOwnProperty';onmessage=function(e){let d=e.data,i=d.i,t=d[r]('t')?d.t:0;switch(d.n){case'a':f[i]=setInterval(function(){p(i)},t);break;case'b':if(f[r](i)){clearInterval(f[i]);delete f[i]}break;case'c':f[i]=setTimeout(function(){p(i);if(f[r](i))delete f[i]},t);break;case'd':if(f[r](i)){clearTimeout(f[i]);delete f[i]}break}}"]))
                } catch (e) { }
            }
            if (typeof v !== "undefined") {
                try {
                    w = new v(s);
                    o.setInterval = function (c, t) {
                        let i = d();
                        f[i] = {
                            c: c,
                            p: y.call(arguments, 2)
                        };
                        w[z]({
                            n: "a",
                            i: i,
                            t: t
                        });
                        return i
                    };
                    o.clearInterval = function (i) {
                        if (f[r](i)) delete f[i], w[z]({
                            n: "b",
                            i: i
                        })
                    };
                    o.setTimeout = function (c, t) {
                        let i = d();
                        f[i] = {
                            c: c,
                            p: y.call(arguments, 2),
                            t: !0
                        };
                        w[z]({
                            n: "c",
                            i: i,
                            t: t
                        });
                        return i
                    };
                    o.clearTimeout = function (i) {
                        if (f[r](i)) delete f[i], w[z]({
                            n: "d",
                            i: i
                        })
                    };
                    w.onmessage = function (e) {
                        let i = e.data,
                            c, n;
                        if (f[r](i)) {
                            n = f[i];
                            c = n.c;
                            if (n[r]("t")) delete f[i]
                        }
                        if (typeof c == "string") try {
                            c = new Function(c)
                        } catch (k) { }
                        if (typeof c == "function") c.apply(o, n.p)
                    }
                } catch (e) {
                    l.log(x)
                }
            } else l.log(x)
        })("HackTimerWorker.min.js");
        window.requestAnimationFrame = function (callback) {
            setTimeout(function () {
                callback()
            }, 100)
        };

        XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {

            var targets = [

            ];
            this.addEventListener("readystatechange", function () {
                if (this.readyState == 4 && this.status == 200) {
                    var resp = {};
                    try {
                        resp.data = this.response;
                        resp.type = this.responseType;
                        resp.url = this.responseURL;
                        if (typeof resp.url != "undefined" || targets.filter(target => resp.url.indexOf(target) > -1).length > 0) {
                            let resevent = new CustomEvent("datachannel", {
                                detail: resp
                            });
                            document.dispatchEvent(resevent)
                        }
                    } catch (e) { }
                }
            }, false);
            open.call(this, method, url, async, user, pass)
        };
        XMLHttpRequest.prototype.open.in = true
    }
}

function runXHRWorker() {
    document.addEventListener(xhrEvent, async function (event) {
        let data = event.detail;

        if (!!data && !!data.data && !!data.url) {
            //console.log(data.url)
            if (data.url.indexOf('https://www.instagram.com/graphql/query/?query_hash=') && data.url.indexOf('parent_comment_count')) {

            }
            let parseddata = await JSONParse(data.data);
            //console.log(parseddata)
        }
    })
}

function JSONParse(input) {
    try {
        if (typeof input == "string") {
            return Promise.resolve(JSON.parse(input))
        } else if (typeof input == "object") {
            return input.text().then(function (inputtext) {
                try {
                    return JSON.parse(inputtext)
                } catch (e) {
                    console.log(e);
                    return {}
                }
            })
        }
    } catch (e) {
        console.log(e);
        return Promise.resolve({})
    }
}

function getXHRRequester() {
    var rv = null;

    var debugmode = true;
    rv = "(" + XHRRequester + ")(XMLHttpRequest.prototype.open, " + debugmode + ");"
    return rv
}

function executeXHRCode() {
    document.location.href = "javascript:" + getXHRRequester()
}

const sendMessage = (message) => new Promise((r) => chrome.runtime.sendMessage(message, (d) => { r(d), chrome.runtime.lastError }));
const injectScript = (file) => {
    var s = document.createElement("script");
    s.src = chrome.extension.getURL(file);
    (document.head || document.documentElement).appendChild(s);
}
const setDom = () => injectScript("inject.js");
const showToast = (type = 'success', msg, title, options = {}) => new Promise(r => {
    toastr[type](msg, title, { timeOut: 3000, onHidden: r, ...options });
})
$(() => {
    setDom();
    Utility.getDB('').then(x => {
        console.log(x)
    });
    document.addEventListener("initialData", function (event) {
        console.log('event.detail', event.detail)
        eventData = event.detail;
        initialData = event.detail.initialData;
        if (initialData.data.config && initialData.data.config.viewerId) {
            sendMessage({ initialData: initialData })

        } else {

        }
    });
})
let Instagram = {
    postData: false,
    isWorkingInterval: false,
    taskActive: false,
    iframeInterval: false,
    messageWindowInterval: false,
    button: "",
    getFollowButton: function (item) {
        this.button = item.find('button.sqdOP.L3NKy');
        return this.button;
    },
    isFollowing: function () {
        return this.button.text() === "Following" || this.button.text() === "Requested" || this.button.text() === "Remove";
    },
    pasteMessage(elem, message) {
        return new Promise((r) => {
            var t = elem;
            window.setTimeout(() => {
                try {
                    t.focus(), t.val(message), t.focus();
                    var _ = new Event("input", {
                        bubbles: !0,
                        cancelable: !0
                    });
                    t[0].dispatchEvent(_);
                    var keyboardEvent = document.createEvent("KeyboardEvent");
                    var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
                    var e = jQuery.Event("keydown");
                    e.which = 77; // m code value
                    e.altKey = true; // Alt key pressed
                    t.trigger(e).blur().focus();
                    r();
                } catch (e) {
                    r();
                }

            });
        });

    },

    async findInfo(modalBody, profileTag) {
        if (!this.taskActive && !!profileTag) return;
        let db = await Utility.getDB('');
        if (counter % 5 == 0 && counter != 0) {
            await Utility.delay(Utility.randomNumber(25, 50) * 1000);
        }
        $('body').find('.activeInsta').removeClass('activeInsta');
        profileTag.addClass('activeInsta');
        await this.scrollBody(modalBody, profileTag);
        let profile = {
            picture: profileTag.find('img[data-testid="user-avatar"]').attr('src'),
            username: profileTag.find('a.FPmhX').text(),
            name: profileTag.find('div._7UhW9.xLCgt.MMzan._0PwGv.fDxYl,div.wFPL8').text()
        };
        this.getFollowButton(profileTag);
        console.log(profile);
        if (db.config.currentAction == 'message') {
            if (db.config.noOfMessage >= db.config.allocatedMessage) {
                this.stopInsta();
                swal({ text: "Daily limit consumed!", timer: 3000 });
                return;
            }
            if (!this.isFollowing() || (db.messageList[profile.username] && db.messageList[profile.username].message == db.config.messageBody)) {
                setTimeout(() => {
                    this.findInfo(modalBody, profileTag.next());
                }, Utility.randomNumber(400, 1500));
                return;
            }
            counter++;
            let iframeBody = await this.viewInIframe('https://www.instagram.com/' + profile.username + '/');
            let msgButton = iframeBody.find('header section.zwlfE div._862NM button');
            let wait = Utility.randomNumber(5, 15) * 1000;
            db.config.noOfMessage++;
            clearInterval(this.messageWindowInterval);
            if (msgButton.length) {
                setTimeout(() => {
                    msgButton.click();
                }, Utility.randomNumber(3, 8) * 1000);

            } else {
                setTimeout(() => {
                    this.findInfo(modalBody, profileTag.next());
                }, wait);
                return;
            }
            this.messageWindowInterval = setInterval(async () => {
                let textarea = iframeBody.find('textarea[placeholder="Message..."]');
                if (textarea.length) {
                    clearInterval(this.messageWindowInterval);
                    let LDB = await Utility.getDB('');
                    console.log(LDB)
                    await this.pasteMessage(textarea, LDB.config.messageBody);
                    await Utility.delay(2000);
                    textarea.val(LDB.config.messageBody);
                    db.messageList = db.messageList || {};
                    db.messageList[profile.username] = { ...profile, message: db.config.messageBody, sentAt: moment().format() };
                    Utility.setDB({ messageList: db.messageList });
                    textarea.parent().next().find('button').first().click();
                    setTimeout(() => {
                        this.findInfo(modalBody, profileTag.next());
                    }, Utility.randomNumber(10, 20) * 1000);
                }
            }, 500);
        } else {
            if (db.config.noOfFollow >= db.config.allocatedFollow) {
                this.stopInsta();
                swal({ text: "Daily limit consumed!", timer: 3000 });
                return;
            }
            let wait = Utility.randomNumber(2, 10) * 1000;
            if (this.button.length == 0) {
                await Utility.delay(Utility.randomNumber(300, 1500));
                this.findInfo(modalBody, profileTag.next());
            } else {
                if (!this.isFollowing()) {
                    db.config.noOfFollow++;
                    db.followList = db.followList || {};
                    db.followList[profile.username] = profile;
                    console.log(db)
                    Utility.setDB({ followList: db.followList });
                    this.button.click();
                } else {
                    wait = Utility.randomNumber(400, 1500);
                }
                counter++;
                setTimeout(() => {
                    this.findInfo(modalBody, profileTag.next());
                }, wait);
            }
        }





        Utility.setDB({ config: db.config });

    },
    decodeURL(url) {
        var decodedUrl = decodeURIComponent(url);
        return decodedUrl == url ? url : decodeURL(decodedUrl)
    },
    viewInIframe(profileUrl) {
        return new Promise((re, j) => {
            try {
                var iframe = document.createElement("iframe");
                iframe.setAttribute("isDS", true);
                iframe.setAttribute("class", 'visitIframe');
                iframe.setAttribute("id", 'instaIframe');
                iframe.setAttribute("src", "https://www.instagram.com");
                document.body.appendChild(iframe);
                profileUrl = profileUrl.replace(/http:/, "https:").replace(/:\/\/.*?instagram.com/, "://www.instagram.com");
                iframe.src = this.decodeURL(profileUrl);
                $(iframe).show();
                $(iframe).on('load', function () {
                    re($(this.contentDocument).find('body'))
                });

            } catch (error) {
                re()
            }
        });
    },
    stopInsta: function () {
        $('iframe#instaIframe').remove();
    },
    scrollBody(modalBody, profileTag) {
        return new Promise((done) => {
            modalBody.animate({ scrollTop: profileTag.offset().top - modalBody.offset().top + modalBody.scrollTop() - 100 }, 400).promise().then(done)
        });
    },
    async startAction(isFirstLoad = true, total = 50, token = '') {
        counter = 0;
        console.log('initialData', initialData)
        if (!initialData.data.config || !initialData.data.config.viewerId) {
            return this.showLogoutAlert();
        }
        let isItMyPost = true;
        let match = window.location.href.match(/\/p\/(.+)\//);
        let response = await InstaAPI.loadPost(match[1], total = 50, token = '');
        console.log(response);
        if (response.status == 200) {
            let DB = await Utility.getDB('');
            let comments = response.data.data.shortcode_media.edge_media_to_parent_comment.edges || [];
            console.log(comments);
            Utility.forEachSeries(comments, async function (comment, nextCommnet) {
                let owner = comment.node.owner;
                if (owner.id == initialData.data.config.viewerId) return nextCommnet();
                let wait = Utility.randomNumber(5, 15) * 1000;
                await showToast('info', owner.username, 'found!', { timeOut: 2000 });
                await showToast('info', `Please wait, checking Follow status!`, owner.username, { timeOut: wait, "progressBar": true });
                let response = await InstaAPI.getThread(owner.id);
                if (response.status == 200) {
                    let user = response.data.users[0];
                    let friendShipData = user.friendship_status;
                    if (!friendShipData.following) {
                        let followResp = await InstaAPI.followUser(owner.id);
                        if (followResp.status == 200) {
                            await showToast('success', `Now you are following to ${user.full_name}`, 'Success!', { timeOut: 2000 });
                        }
                    } else {
                        await showToast('error', `${user.full_name} already followed by you`, 'Skipping Follow!', { timeOut: 2000 });
                    }

                    wait = Utility.randomNumber(10, 25) * 1000;
                    await showToast('info', `Please wait, Bot is sending message to ${user.full_name}`, "Sending message!", { timeOut: wait, "progressBar": true });
                    let payload = {
                        type: "InjectSendDmReq",
                        thread_id: response.data.thread_id,
                        text: DB.config.messageBody,
                        uuid: Utility.randomNumber(111111111, 99999999999)
                    }
                    window.postMessage(payload, "*");
                    await showToast('success', `Message sent to ${user.full_name}`, 'Success!', { timeOut: 2000 });

                }
                await showToast('info', `Please wait....`, 'Pausing...', { timeOut: Utility.randomNumber(15, 55) * 1000, "progressBar": true });
                nextCommnet()
            }, async function () {
                await showToast('success', `Process completed!`, 'Success!', { timeOut: 5000 });
            });



        } else {
            await showToast('error', `Error in loading post!`, 'Failed!', { timeOut: 2000 });
        }

    },
    showLogoutAlert: () => {
        Swal.fire({
            position: "top-end",
            title: "Log in to your Instagram",
            text: "You need to Log in to your instagram to use App",
            showConfirmButton: false,
            timer: 10000,
        });
    }
}
let InstaAPI = {
    graphUrl: `https://www.instagram.com/graphql/query/`,
    HASH_TOKEN: {
        follower: "5aefa9893005572d237da5068082d8d5",
        following: "3dec7e2c57367ef3da3d987d89f9dbc8",
        post: "d4e8ae69cb68f66329dcebe82fb69f6d",
    },
    loadPost(postId, total = 25, token = '') {
        return new Promise(async (res) => {
            let d = {
                "shortcode": postId,
                "child_comment_count": 1,
                "fetch_comment_count": 40,
                "parent_comment_count": total, fetch_mutual: false,
                "has_threaded_comments": true
            }
            if (token && token !== undefined) {
                d.after = token;
            }
            let url = this.graphUrl + "?query_hash=" + this.HASH_TOKEN.post + "&variables=" + encodeURI(JSON.stringify(d));
            let ds = await axios.get(url, { params: "", headers: "" });;
            console.log('ds', ds)
            return res(ds);
        })
    },
    async getThread(recipient_users) {
        var bodyFormData = new FormData();
        let customHeaders = await sendMessage({ getCustomHeaders: true });
        bodyFormData.append('recipient_users', JSON.stringify([recipient_users]));
        return new Promise(async (res) => {
            let headers = {
                'x-csrftoken': initialData.data.config.csrf_token,
                'content-type': 'application/x-www-form-urlencoded',
                accept: '*/*',
                'x-instagram-ajax': initialData.data.rollout_hash,
            }
            headers['x-ig-app-id'] = customHeaders['x-ig-app-id']
            headers['x-instagram-ajax'] = customHeaders['x-instagram-ajax']
            headers['x-ig-www-claim'] = customHeaders['x-ig-www-claim']
            console.log(headers)
            let url = `/api/v1/direct_v2/create_group_thread/`;
            let ds = await axios({
                baseURL: "https://i.instagram.com",
                method: 'post',     //put
                url: url,
                headers: headers,
                credentials: "omit",
                withCredentials: true,
                data: bodyFormData
            });
            console.log(ds);
            return res(ds);
        })
    },
    unFollowUser(id) {
        return new Promise(async (res) => {
            let headers = {
                'x-csrftoken': initialData.data.config.csrf_token
            }
            let url = `https://www.instagram.com/web/friendships/${id}/unfollow/`;
            let ds = await axios.post(url, {}, {
                headers: headers,
                credentials: "omit"
            });
            console.log(ds);
            return res(ds);
        })
    },
    followUser(id) {
        let headers = {
            'x-csrftoken': initialData.data.config.csrf_token
        }
        return new Promise(async (res) => {
            let url = `https://www.instagram.com/web/friendships/${id}/follow/`;
            let ds = await axios.post(url, {}, {
                headers: headers,
                credentials: "omit"
            });
            console.log(ds);
            return res(ds);
        })
    },
    getUserInfo(message) {
        let headers = {
            'x-csrftoken': initialData.data.config.csrf_token
        }
        return new Promise(async (res) => {
            try {
                let url = `https://i.instagram.com/api/v1/users/${message.id}/info/`;
                let ds = await axios.get(url, { params: "", headers: headers });;
                return res(ds);
            } catch (e) {
                console.log(e, 'Error in Getting detailed data of a username for user analysis');
                return res(false);
            }
        });
    },
    getProfileInfo(message) {
        return new Promise(async (res) => {
            try {
                let url = `https://www.instagram.com/${message.username}/?__a=1`;
                let ds = await axios.get(url, { params: "", headers: "" });;
                return res(ds);
            } catch (e) {
                console.log(e, 'Error in Getting detailed data of a username for user analysis');
                return res(false);
            }
        });
    },
    getUsersFollowers(id, no = 25, token = "") {
        return new Promise(async (res) => {
            let d = {
                id: id,
                first: no,
                include_reel: true,
                fetch_mutual: false
            }
            if (token && token !== undefined) {
                d.after = token;
            }
            let url = this.graphUrl + "?query_hash=" + this.HASH_TOKEN.follower + "&variables=" + encodeURI(JSON.stringify(d));
            let ds = await axios.get(url, { params: "", headers: "" });;
            console.log('ds', ds)
            return res(ds);
        })
    },
    getUsersFollowing(id, no = 20, token = "") {
        return new Promise(async (res) => {
            let d = {
                id: id,
                first: no,
                include_reel: true,
                fetch_mutual: false
            }
            if (token && token !== undefined) {
                d.after = token;
            }
            let url = this.graphUrl + "?query_hash=" + this.HASH_TOKEN.following + "&variables=" + encodeURI(JSON.stringify(d));
            let ds = await axios.get(url, { params: "", headers: "" });;
            console.log('ds', ds)
            return res(ds);
        })
    },
};
chrome.runtime.onMessage.addListener((message, sender, respond) => {
    console.log(message)
    switch (true) {
        case 'startAction' in message:
            Instagram.startAction(true, 50, '');
            return respond(), true;
            break;
        case 'APIgetUserInfo' in message:
            console.log(message);
            InstaAPI.getUserInfo(message).then(x => respond(x));
            break;
        case 'APImyInfo' in message:
            InstaAPI.getProfileInfo(message).then(respond);
            break;;
        case 'getFollowers' in message:
            InstaAPI.getUsersFollowers(message.data.id, message.data.items || 25, message.data.token || "").then(x => respond(x));
            break;
        case 'getFollowing' in message:
            InstaAPI.getUsersFollowing(message.data.id, message.data.items || 25, message.data.token || "").then(x => respond(x));
            break;
        case 'followUser' in message:
            InstaAPI.followUser(message.id).then(x => respond(x));
            break;
        case 'unFollowUser' in message:
            InstaAPI.unFollowUser(message.id).then(x => respond(x));
            break;

    }
    return true
});