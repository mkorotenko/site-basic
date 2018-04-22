var deployJavaChrome = /Chrome/.test(navigator.userAgent);
var deployJavaWindows = /Win/.test(navigator.platform);
var loadDeployJavaScript = true;
//if (deployJavaChrome && deployJavaWindows) {
//    loadDeployJavaScript = false
//}
if (loadDeployJavaScript) {
    var deployJava = function() {
        var h = {core: ["id", "class", "title", "style"],i18n: ["lang", "dir"],events: ["onclick", "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove", "onmouseout", "onkeypress", "onkeydown", "onkeyup"],applet: ["codebase", "code", "name", "archive", "object", "width", "height", "alt", "align", "hspace", "vspace"],object: ["classid", "codebase", "codetype", "data", "type", "archive", "declare", "standby", "height", "width", "usemap", "name", "tabindex", "align", "border", "hspace", "vspace"]};
        var a = h.object.concat(h.core, h.i18n, h.events);
        var i = h.applet.concat(h.core);
        function g(l, k) {
            var j = l.length;
            for (var m = 0; m < j; m++) {
                if (l[m] === k) {
                    return true
                }
            }
            return false
        }
        function b(j) {
            return g(i, j.toLowerCase())
        }
        function f(j) {
            return g(a, j.toLowerCase())
        }
        var c = {debug: null,firefoxJavaVersion: null,myInterval: null,preInstallJREList: null,returnPage: null,brand: null,locale: null,installType: null,EAInstallEnabled: false,EarlyAccessURL: null,getJavaURL: "http://java.sun.com/webapps/getjava/BrowserRedirect?host=java.com",appleRedirectPage: "http://www.apple.com/support/downloads/",oldMimeType: "application/npruntime-scriptable-plugin;DeploymentToolkit",mimeType: "application/java-deployment-toolkit",launchButtonPNG: "http://java.sun.com/products/jfc/tsc/articles/swing2d/webstart.png",browserName: null,browserName2: null,getJREs: function() {
                var n = new Array();
                if (this.isPluginInstalled()) {
                    var m = this.getPlugin();
                    var j = m.jvms;
                    for (var l = 0; l < j.getLength(); l++) {
                        n[l] = j.get(l).version
                    }
                } else {
                    var k = this.getBrowser();
                    if (k == "MSIE") {
                        if (this.testUsingActiveX("1.7.0")) {
                            n[0] = "1.7.0"
                        } else {
                            if (this.testUsingActiveX("1.6.0")) {
                                n[0] = "1.6.0"
                            } else {
                                if (this.testUsingActiveX("1.5.0")) {
                                    n[0] = "1.5.0"
                                } else {
                                    if (this.testUsingActiveX("1.4.2")) {
                                        n[0] = "1.4.2"
                                    } else {
                                        if (this.testForMSVM()) {
                                            n[0] = "1.1"
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (k == "Netscape Family") {
                            this.getJPIVersionUsingMimeType();
                            if (this.firefoxJavaVersion != null) {
                                n[0] = this.firefoxJavaVersion
                            } else {
                                if (this.testUsingMimeTypes("1.7")) {
                                    n[0] = "1.7.0"
                                } else {
                                    if (this.testUsingMimeTypes("1.6")) {
                                        n[0] = "1.6.0"
                                    } else {
                                        if (this.testUsingMimeTypes("1.5")) {
                                            n[0] = "1.5.0"
                                        } else {
                                            if (this.testUsingMimeTypes("1.4.2")) {
                                                n[0] = "1.4.2"
                                            } else {
                                                if (this.browserName2 == "Safari") {
                                                    if (this.testUsingPluginsArray("1.7.0")) {
                                                        n[0] = "1.7.0"
                                                    } else {
                                                        if (this.testUsingPluginsArray("1.6")) {
                                                            n[0] = "1.6.0"
                                                        } else {
                                                            if (this.testUsingPluginsArray("1.5")) {
                                                                n[0] = "1.5.0"
                                                            } else {
                                                                if (this.testUsingPluginsArray("1.4.2")) {
                                                                    n[0] = "1.4.2"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.debug) {
                    for (var l = 0; l < n.length; ++l) {
                        alert("We claim to have detected Java SE " + n[l])
                    }
                }
                return n
            },installJRE: function(l, k) {
                var j = false;
                if (this.isPluginInstalled()) {
                    if (this.getPlugin().installJRE(l, k)) {
                        this.refresh();
                        if (this.returnPage != null) {
                            document.location = this.returnPage
                        }
                        return true
                    } else {
                        return false
                    }
                } else {
                    return this.installLatestJRE()
                }
            },installLatestJRE: function(l) {
                if (this.isPluginInstalled()) {
                    if (this.getPlugin().installLatestJRE(l)) {
                        this.refresh();
                        if (this.returnPage != null) {
                            document.location = this.returnPage
                        }
                        return true
                    } else {
                        return false
                    }
                } else {
                    var k = this.getBrowser();
                    var j = navigator.platform.toLowerCase();
                    if ((this.EAInstallEnabled == "true") && (j.indexOf("win") != -1) && (this.EarlyAccessURL != null)) {
                        this.preInstallJREList = this.getJREs();
                        if (this.returnPage != null) {
                            this.myInterval = setInterval("deployJava.poll()", 3000)
                        }
                        location.href = this.EarlyAccessURL;
                        return false
                    } else {
                        if (k == "MSIE") {
                            return this.IEInstall()
                        } else {
                            if ((k == "Netscape Family") && (j.indexOf("win32") != -1)) {
                                return this.FFInstall()
                            } else {
                                location.href = this.getJavaURL + ((this.returnPage != null) ? ("&returnPage=" + this.returnPage) : "") + ((this.locale != null) ? ("&locale=" + this.locale) : "") + ((this.brand != null) ? ("&brand=" + this.brand) : "")
                            }
                        }
                        return false
                    }
                }
            },runApplet: function(k, o, m) {
                if (m == "undefined" || m == null) {
                    m = "1.1"
                }
                var n = "^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$";
                var j = m.match(n);
                if (this.returnPage == null) {
                    this.returnPage = document.location
                }
                if (j != null) {
                    var l = this.getBrowser();
                    if ((l != "?") && ("Safari" != this.browserName2)) {
                        if (this.versionCheck(m + "+")) {
                            this.writeAppletTag(k, o)
                        } else {
                            if (this.installJRE(m + "+")) {
                                this.refresh();
                                location.href = document.location;
                                this.writeAppletTag(k, o)
                            }
                        }
                    } else {
                        this.writeAppletTag(k, o)
                    }
                } else {
                    if (this.debug) {
                        alert("Invalid minimumVersion argument to runApplet():" + m)
                    }
                }
            },writeAppletTag: function(m, q) {
                var j = "<applet ";
                var l = "";
                var n = "</applet>";
                var r = true;
                if (null == q || typeof q != "object") {
                    q = new Object()
                }
                for (var k in m) {
                    if (!b(k)) {
                        q[k] = m[k]
                    } else {
                        j += (" " + k + '="' + m[k] + '"');
                        if (k == "code") {
                            r = false
                        }
                    }
                }
                var p = false;
                for (var o in q) {
                    if (o == "codebase_lookup") {
                        p = true
                    }
                    if (o == "object" || o == "java_object" || o == "java_code") {
                        r = false
                    }
                    l += '<param name="' + o + '" value="' + q[o] + '"/>'
                }
                if (!p) {
                    l += '<param name="codebase_lookup" value="false"/>'
                }
                if (r) {
                    j += (' code="dummy"')
                }
                j += ">";
                document.write(j + "\n" + l + "\n" + n)
            },versionCheck: function(q) {
                var l = 0;
                var o = "^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?(\\*|\\+)?$";
                var j = q.match(o);
                if (j != null) {
                    var n = true;
                    var k = new Array();
                    for (var m = 1; m < j.length; ++m) {
                        if ((typeof j[m] == "string") && (j[m] != "")) {
                            k[l] = j[m];
                            l++
                        }
                    }
                    if (k[k.length - 1] == "+") {
                        n = false;
                        k.length--
                    } else {
                        if (k[k.length - 1] == "*") {
                            k.length--
                        }
                    }
                    var p = this.getJREs();
                    for (var m = 0; m < p.length; ++m) {
                        if (this.compareVersionToPattern(p[m], k, n)) {
                            return true
                        }
                    }
                    return false
                } else {
                    alert("Invalid versionPattern passed to versionCheck: " + q);
                    return false
                }
            },isWebStartInstalled: function(m) {
                var l = this.getBrowser();
                if ((l == "?") || ("Safari" == this.browserName2)) {
                    return true
                }
                if (m == "undefined" || m == null) {
                    m = "1.4.2"
                }
                var k = false;
                var n = "^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$";
                var j = m.match(n);
                if (j != null) {
                    k = this.versionCheck(m + "+")
                } else {
                    if (this.debug) {
                        alert("Invalid minimumVersion argument to isWebStartInstalled(): " + m)
                    }
                    k = this.versionCheck("1.4.2+")
                }
                return k
            },getJPIVersionUsingMimeType: function() {
                for (var k = 0; k < navigator.mimeTypes.length; ++k) {
                    var l = navigator.mimeTypes[k].type;
                    var j = l.match(/^application\/x-java-applet;jpi-version=(.*)$/);
                    if (j != null) {
                        this.firefoxJavaVersion = j[1];
                        if ("Opera" != this.browserName2) {
                            break
                        }
                    }
                }
            },launchWebStartApplication: function(m) {
                var j = navigator.userAgent.toLowerCase();
                this.getJPIVersionUsingMimeType();
                if (this.isWebStartInstalled("1.7.0") == false) {
                    if ((this.installJRE("1.7.0+") == false) || ((this.isWebStartInstalled("1.7.0") == false))) {
                        return false
                    }
                }
                var o = null;
                if (document.documentURI) {
                    o = document.documentURI
                }
                if (o == null) {
                    o = document.URL
                }
                var k = this.getBrowser();
                var l;
                if (k == "MSIE") {
                    l = '<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="0" height="0"><PARAM name="launchjnlp" value="' + m + '"><PARAM name="docbase" value="' + o + '"></object>'
                } else {
                    if (k == "Netscape Family") {
                        l = '<embed type="application/x-java-applet;jpi-version=' + this.firefoxJavaVersion + '" width="0" height="0" launchjnlp="' + m + '"docbase="' + o + '" />'
                    }
                }
                if (document.body == "undefined" || document.body == null) {
                    document.write(l);
                    document.location = o
                } else {
                    var n = document.createElement("div");
                    n.id = "div1";
                    n.style.position = "relative";
                    n.style.left = "-10000px";
                    n.style.margin = "0px auto";
                    n.className = "dynamicDiv";
                    n.innerHTML = l;
                    document.body.appendChild(n)
                }
            },createWebStartLaunchButtonEx: function(l, k) {
                if (this.returnPage == null) {
                    this.returnPage = l
                }
                var j = "javascript:deployJava.launchWebStartApplication('" + l + "');";
                document.write('<a href="' + j + '" onMouseOver="window.status=\'\'; return true;"><img src="' + this.launchButtonPNG + '" border="0" /></a>')
            },createWebStartLaunchButton: function(l, k) {
                if (this.returnPage == null) {
                    this.returnPage = l
                }
                var j = "javascript:if (!deployJava.isWebStartInstalled(&quot;" + k + "&quot;)) {if (deployJava.installLatestJRE()) {if (deployJava.launch(&quot;" + l + "&quot;)) {}}} else {if (deployJava.launch(&quot;" + l + "&quot;)) {}}";
                document.write('<a href="' + j + '" onMouseOver="window.status=\'\'; return true;"><img src="' + this.launchButtonPNG + '" border="0" /></a>')
            },launch: function(j) {
                document.location = j;
                return true
            },isPluginInstalled: function() {
                var j = this.getPlugin();
                if (j && j.jvms) {
                    return true
                } else {
                    return false
                }
            },isAutoUpdateEnabled: function() {
                if (this.isPluginInstalled()) {
                    return this.getPlugin().isAutoUpdateEnabled()
                }
                return false
            },setAutoUpdateEnabled: function() {
                if (this.isPluginInstalled()) {
                    return this.getPlugin().setAutoUpdateEnabled()
                }
                return false
            },setInstallerType: function(j) {
                this.installType = j;
                if (this.isPluginInstalled()) {
                    return this.getPlugin().setInstallerType(j)
                }
                return false
            },setAdditionalPackages: function(j) {
                if (this.isPluginInstalled()) {
                    return this.getPlugin().setAdditionalPackages(j)
                }
                return false
            },setEarlyAccess: function(j) {
                this.EAInstallEnabled = j
            },isPlugin2: function() {
                if (this.isPluginInstalled()) {
                    if (this.versionCheck("1.6.0_10+")) {
                        try {
                            return this.getPlugin().isPlugin2()
                        } catch (j) {
                        }
                    }
                }
                return false
            },allowPlugin: function() {
                this.getBrowser();
                var j = ("Safari" != this.browserName2 && "Opera" != this.browserName2);
                return j
            },getPlugin: function() {
                this.refresh();
                var j = null;
                if (this.allowPlugin()) {
                    j = document.getElementById("deployJavaPlugin")
                }
                return j
            },compareVersionToPattern: function(p, k, m) {
                var q = "^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$";
                var r = p.match(q);
                if (r != null) {
                    var o = 0;
                    var t = new Array();
                    for (var n = 1; n < r.length; ++n) {
                        if ((typeof r[n] == "string") && (r[n] != "")) {
                            t[o] = r[n];
                            o++
                        }
                    }
                    var j = Math.min(t.length, k.length);
                    if (m) {
                        for (var n = 0; n < j; ++n) {
                            if (t[n] != k[n]) {
                                return false
                            }
                        }
                        return true
                    } else {
                        for (var n = 0; n < j; ++n) {
                            if (t[n] < k[n]) {
                                return false
                            } else {
                                if (t[n] > k[n]) {
                                    return true
                                }
                            }
                        }
                        return true
                    }
                } else {
                    return false
                }
            },getBrowser: function() {
                if (this.browserName == null) {
                    var j = navigator.userAgent.toLowerCase();
                    if (this.debug) {
                        alert("userAgent -> " + j)
                    }
                    if (j.indexOf("msie") != -1) {
                        this.browserName = "MSIE";
                        this.browserName2 = "MSIE"
                    } else {
                        if (j.indexOf("iphone") != -1) {
                            this.browserName = "Netscape Family";
                            this.browserName2 = "iPhone"
                        } else {
                            if (j.indexOf("firefox") != -1) {
                                this.browserName = "Netscape Family";
                                this.browserName2 = "Firefox"
                            } else {
                                if (j.indexOf("chrome") != -1) {
                                    this.browserName = "Netscape Family";
                                    this.browserName2 = "Chrome"
                                } else {
                                    if (j.indexOf("safari") != -1) {
                                        this.browserName = "Netscape Family";
                                        this.browserName2 = "Safari"
                                    } else {
                                        if (j.indexOf("mozilla") != -1) {
                                            this.browserName = "Netscape Family";
                                            this.browserName2 = "Other"
                                        } else {
                                            if (j.indexOf("opera") != -1) {
                                                this.browserName = "Netscape Family";
                                                this.browserName2 = "Opera"
                                            } else {
                                                this.browserName = "?";
                                                this.browserName2 = "unknown"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (this.debug) {
                        alert("Detected browser name:" + this.browserName + ", " + this.browserName2)
                    }
                }
                return this.browserName
            },testUsingActiveX: function(j) {
                var l = "JavaWebStart.isInstalled." + j + ".0";
                if (!ActiveXObject) {
                    if (this.debug) {
                        alert("Browser claims to be IE, but no ActiveXObject object?")
                    }
                    return false
                }
                try {
                    return (new ActiveXObject(l) != null)
                } catch (k) {
                    return false
                }
            },testForMSVM: function() {
                var k = "{08B0E5C0-4FCB-11CF-AAA5-00401C608500}";
                if (typeof oClientCaps != "undefined") {
                    var j = oClientCaps.getComponentVersion(k, "ComponentID");
                    if ((j == "") || (j == "5,0,5000,0")) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            },testUsingMimeTypes: function(k) {
                if (!navigator.mimeTypes) {
                    if (this.debug) {
                        alert("Browser claims to be Netscape family, but no mimeTypes[] array?")
                    }
                    return false
                }
                for (var l = 0; l < navigator.mimeTypes.length; ++l) {
                    s = navigator.mimeTypes[l].type;
                    var j = s.match(/^application\/x-java-applet\x3Bversion=(1\.8|1\.7|1\.6|1\.5|1\.4\.2)$/);
                    if (j != null) {
                        if (this.compareVersions(j[1], k)) {
                            return true
                        }
                    }
                }
                return false
            },testUsingPluginsArray: function(k) {
                if ((!navigator.plugins) || (!navigator.plugins.length)) {
                    return false
                }
                var j = navigator.platform.toLowerCase();
                for (var l = 0; l < navigator.plugins.length; ++l) {
                    s = navigator.plugins[l].description;
                    if (s.search(/^Java Switchable Plug-in (Cocoa)/) != -1) {
                        if (this.compareVersions("1.5.0", k)) {
                            return true
                        }
                    } else {
                        if (s.search(/^Java/) != -1) {
                            if (j.indexOf("win") != -1) {
                                if (this.compareVersions("1.5.0", k) || this.compareVersions("1.6.0", k)) {
                                    return true
                                }
                            }
                        }
                    }
                }
                if (this.compareVersions("1.5.0", k)) {
                    return true
                }
                return false
            },IEInstall: function() {
                location.href = this.getJavaURL + ((this.returnPage != null) ? ("&returnPage=" + this.returnPage) : "") + ((this.locale != null) ? ("&locale=" + this.locale) : "") + ((this.brand != null) ? ("&brand=" + this.brand) : "");
                return false
            },done: function(k, j) {
            },FFInstall: function() {
                location.href = this.getJavaURL + ((this.returnPage != null) ? ("&returnPage=" + this.returnPage) : "") + ((this.locale != null) ? ("&locale=" + this.locale) : "") + ((this.brand != null) ? ("&brand=" + this.brand) : "") + ((this.installType != null) ? ("&type=" + this.installType) : "");
                return false
            },compareVersions: function(m, n) {
                var k = m.split(".");
                var j = n.split(".");
                for (var l = 0; l < k.length; ++l) {
                    k[l] = Number(k[l])
                }
                for (var l = 0; l < j.length; ++l) {
                    j[l] = Number(j[l])
                }
                if (k.length == 2) {
                    k[2] = 0
                }
                if (k[0] > j[0]) {
                    return true
                }
                if (k[0] < j[0]) {
                    return false
                }
                if (k[1] > j[1]) {
                    return true
                }
                if (k[1] < j[1]) {
                    return false
                }
                if (k[2] > j[2]) {
                    return true
                }
                if (k[2] < j[2]) {
                    return false
                }
                return true
            },enableAlerts: function() {
                this.browserName = null;
                this.debug = true
            },poll: function() {
                this.refresh();
                var j = this.getJREs();
                if ((this.preInstallJREList.length == 0) && (j.length != 0)) {
                    clearInterval(this.myInterval);
                    if (this.returnPage != null) {
                        location.href = this.returnPage
                    }
                }
                if ((this.preInstallJREList.length != 0) && (j.length != 0) && (this.preInstallJREList[0] != j[0])) {
                    clearInterval(this.myInterval);
                    if (this.returnPage != null) {
                        location.href = this.returnPage
                    }
                }
            },writePluginTag: function() {
                var j = this.getBrowser();
                if (j == "MSIE") {
                    document.write('<object classid="clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA" id="deployJavaPlugin" width="0" height="0"></object>')
                } else {
                    if (j == "Netscape Family" && this.allowPlugin()) {
                        this.writeEmbedTag()
                    }
                }
            },refresh: function() {
                navigator.plugins.refresh(false);
                var j = this.getBrowser();
                if (j == "Netscape Family" && this.allowPlugin()) {
                    var k = document.getElementById("deployJavaPlugin");
                    if (k == null) {
                        this.writeEmbedTag()
                    }
                }
            },writeEmbedTag: function() {
                var j = false;
                if (navigator.mimeTypes != null) {
                    for (var k = 0; k < navigator.mimeTypes.length; k++) {
                        if (navigator.mimeTypes[k].type == this.mimeType) {
                            if (navigator.mimeTypes[k].enabledPlugin) {
                                document.write('<embed id="deployJavaPlugin" type="' + this.mimeType + '" hidden="true" />');
                                j = true
                            }
                        }
                    }
                    if (!j) {
                        for (var k = 0; k < navigator.mimeTypes.length; k++) {
                            if (navigator.mimeTypes[k].type == this.oldMimeType) {
                                if (navigator.mimeTypes[k].enabledPlugin) {
                                    document.write('<embed id="deployJavaPlugin" type="' + this.oldMimeType + '" hidden="true" />')
                                }
                            }
                        }
                    }
                }
            }};
        c.writePluginTag();
        if (c.locale == null) {
            var e = null;
            if (e == null) {
                try {
                    e = navigator.userLanguage
                } catch (d) {
                }
            }
            if (e == null) {
                try {
                    e = navigator.systemLanguage
                } catch (d) {
                }
            }
            if (e == null) {
                try {
                    e = navigator.language
                } catch (d) {
                }
            }
            if (e != null) {
                e.replace("-", "_");
                c.locale = e
            }
        }
        return c
    }()
}
var JSNES = function(b) {
    this.opts = {ui: JSNES.DummyUI,preferredFrameRate: 60,fpsInterval: 500,showDisplay: true,sampleRate: 44100,CPU_FREQ_NTSC: 1789772.5,CPU_FREQ_PAL: 1773447.4};
    if (typeof b != "undefined") {
        var a;
        for (a in this.opts) {
            if (typeof b[a] != "undefined") {
                this.opts[a] = b[a]
            }
        }
    }
    this.frameTime = 1000 / this.opts.preferredFrameRate;
    this.ui = new this.opts.ui(this);
    this.cpu = new JSNES.CPU(this);
    this.ppu = new JSNES.PPU(this);
    this.papu = new JSNES.PAPU(this);
    this.mmap = null;
    this.keyboard = new JSNES.Keyboard()
};
JSNES.VERSION = "a51193129179cf301154";
JSNES.prototype = {isRunning: false,fpsFrameCount: 0,limitFrames: true,romData: null,reset: function() {
        if (this.mmap !== null) {
            this.mmap.reset()
        }
        this.cpu.reset();
        this.ppu.reset();
        this.papu.reset()
    },start: function() {
        var a = this;
        if (this.rom !== null && this.rom.valid) {
            if (!this.isRunning) {
                this.isRunning = true;
                this.frameInterval = setInterval(function() {
                    a.frame()
                }, this.frameTime / 2);
                this.resetFps();
                this.printFps();
                this.fpsInterval = setInterval(function() {
                    a.printFps()
                }, this.opts.fpsInterval)
            }
        } else {
        }
    },frame: function() {
        this.ppu.startFrame();
        var b = 0;
        var a = this.cpu;
        var d = this.ppu;
        var c = this.papu;
        FRAMELOOP: for (; ; ) {
            if (a.cyclesToHalt === 0) {
                b = a.emulate();
                b *= 3
            } else {
                if (a.cyclesToHalt > 8) {
                    b = 24;
                    a.cyclesToHalt -= 8
                } else {
                    b = a.cyclesToHalt * 3;
                    a.cyclesToHalt = 0
                }
            }
            for (; b > 0; b--) {
                if (d.curX === d.spr0HitX && d.f_spVisibility === 1 && d.scanline - 21 === d.spr0HitY) {
                    d.setStatusFlag(d.STATUS_SPRITE0HIT, true)
                }
                if (d.requestEndFrame) {
                    d.nmiCounter--;
                    if (d.nmiCounter === 0) {
                        d.requestEndFrame = false;
                        d.startVBlank();
                        break FRAMELOOP
                    }
                }
                d.curX++;
                if (d.curX === 341) {
                    d.curX = 0;
                    d.endScanline()
                }
            }
        }
        if (this.limitFrames) {
            if (this.lastFrameTime) {
                while (+new Date() - this.lastFrameTime < this.frameTime) {
                }
            }
        }
        this.fpsFrameCount++;
        this.lastFrameTime = +new Date()
    },printFps: function() {
        var a = +new Date();
        var b = "Running";
        if (this.lastFpsTime) {
            b += ": " + (this.fpsFrameCount / ((a - this.lastFpsTime) / 1000)).toFixed(2) + " FPS"
        }
        this.fpsFrameCount = 0;
        this.lastFpsTime = a
    },stop: function() {
        console.log("jsnes.stop(): initiated.");
        clearInterval(this.frameInterval);
        clearInterval(this.fpsInterval);
        this.isRunning = false;
        $(document).unbind("keydown");
        $(document).unbind("keyup");
        $(document).unbind("keypress");
        console.log("jsnes.stop(): completed.")
    },reloadRom: function() {
        if (this.romData !== null) {
            this.loadRom(this.romData)
        }
    },loadRom: function(a) {
        if (this.isRunning) {
            this.stop()
        }
        this.rom = new JSNES.ROM(this);
        this.rom.load(a);
        if (this.rom.valid) {
            this.reset();
            this.mmap = this.rom.createMapper();
            if (!this.mmap) {
                return
            }
            this.mmap.loadROM();
            this.ppu.setMirroring(this.rom.getMirroringType());
            this.romData = a
        } else {
        }
        return this.rom.valid
    },resetFps: function() {
        this.lastFpsTime = null;
        this.fpsFrameCount = 0
    },setFramerate: function(a) {
        this.opts.preferredFrameRate = a;
        this.frameTime = 1000 / a;
        this.papu.setSampleRate(this.opts.sampleRate, false)
    },setLimitFrames: function(a) {
        this.limitFrames = a;
        this.lastFrameTime = null
    },toJSON: function() {
        return {romData: this.romData,cpu: this.cpu.toJSON(),mmap: this.mmap.toJSON(),ppu: this.ppu.toJSON()}
    },fromJSON: function(a) {
        this.loadRom(a.romData);
        this.cpu.fromJSON(a.cpu);
        this.mmap.fromJSON(a.mmap);
        this.ppu.fromJSON(a.ppu)
    }};
JSNES.Utils = {copyArrayElements: function(f, d, b, a, e) {
        for (var c = 0; c < e; ++c) {
            b[a + c] = f[d + c]
        }
    },copyArray: function(c) {
        var a = new Array(c.length);
        for (var b = 0; b < c.length; b++) {
            a[b] = c[b]
        }
        return a
    },fromJSON: function(c, b) {
        for (var a = 0; a < c.JSON_PROPERTIES.length; a++) {
            c[c.JSON_PROPERTIES[a]] = b[c.JSON_PROPERTIES[a]]
        }
    },toJSON: function(c) {
        var b = {};
        for (var a = 0; a < c.JSON_PROPERTIES.length; a++) {
            b[c.JSON_PROPERTIES[a]] = c[c.JSON_PROPERTIES[a]]
        }
        return b
    }};
JSNES.CPU = function(a) {
    this.nes = a;
    this.mem = null;
    this.REG_ACC = null;
    this.REG_X = null;
    this.REG_Y = null;
    this.REG_SP = null;
    this.REG_PC = null;
    this.REG_PC_NEW = null;
    this.REG_STATUS = null;
    this.F_CARRY = null;
    this.F_DECIMAL = null;
    this.F_INTERRUPT = null;
    this.F_INTERRUPT_NEW = null;
    this.F_OVERFLOW = null;
    this.F_SIGN = null;
    this.F_ZERO = null;
    this.F_NOTUSED = null;
    this.F_NOTUSED_NEW = null;
    this.F_BRK = null;
    this.F_BRK_NEW = null;
    this.opdata = null;
    this.cyclesToHalt = null;
    this.crash = null;
    this.irqRequested = null;
    this.irqType = null;
    this.reset()
};
JSNES.CPU.prototype = {IRQ_NORMAL: 0,IRQ_NMI: 1,IRQ_RESET: 2,reset: function() {
        this.mem = new Array(65536);
        for (var a = 0; a < 8192; a++) {
            this.mem[a] = 255
        }
        for (var b = 0; b < 4; b++) {
            var a = b * 2048;
            this.mem[a + 8] = 247;
            this.mem[a + 9] = 239;
            this.mem[a + 10] = 223;
            this.mem[a + 15] = 191
        }
        for (var a = 8193; a < this.mem.length; a++) {
            this.mem[a] = 0
        }
        this.REG_ACC = 0;
        this.REG_X = 0;
        this.REG_Y = 0;
        this.REG_SP = 511;
        this.REG_PC = 32768 - 1;
        this.REG_PC_NEW = 32768 - 1;
        this.REG_STATUS = 40;
        this.setStatus(40);
        this.F_CARRY = 0;
        this.F_DECIMAL = 0;
        this.F_INTERRUPT = 1;
        this.F_INTERRUPT_NEW = 1;
        this.F_OVERFLOW = 0;
        this.F_SIGN = 0;
        this.F_ZERO = 1;
        this.F_NOTUSED = 1;
        this.F_NOTUSED_NEW = 1;
        this.F_BRK = 1;
        this.F_BRK_NEW = 1;
        this.opdata = new JSNES.CPU.OpData().opdata;
        this.cyclesToHalt = 0;
        this.crash = false;
        this.irqRequested = false;
        this.irqType = null
    },emulate: function() {
        var c;
        var g;
        if (this.irqRequested) {
            c = (this.F_CARRY) | ((this.F_ZERO === 0 ? 1 : 0) << 1) | (this.F_INTERRUPT << 2) | (this.F_DECIMAL << 3) | (this.F_BRK << 4) | (this.F_NOTUSED << 5) | (this.F_OVERFLOW << 6) | (this.F_SIGN << 7);
            this.REG_PC_NEW = this.REG_PC;
            this.F_INTERRUPT_NEW = this.F_INTERRUPT;
            switch (this.irqType) {
                case 0:
                    if (this.F_INTERRUPT != 0) {
                        break
                    }
                    doIrq(c);
                    break;
                case 1:
                    this.doNonMaskableInterrupt(c);
                    break;
                case 2:
                    this.doResetInterrupt();
                    break
            }
            this.REG_PC = this.REG_PC_NEW;
            this.F_INTERRUPT = this.F_INTERRUPT_NEW;
            this.F_BRK = this.F_BRK_NEW;
            this.irqRequested = false
        }
        var e = this.opdata[this.nes.mmap.load(this.REG_PC + 1)];
        var d = (e >> 24);
        var f = 0;
        var b = (e >> 8) & 255;
        var a = this.REG_PC;
        this.REG_PC += ((e >> 16) & 255);
        var h = 0;
        switch (b) {
            case 0:
                h = this.load(a + 2);
                break;
            case 1:
                h = this.load(a + 2);
                if (h < 128) {
                    h += this.REG_PC
                } else {
                    h += this.REG_PC - 256
                }
                break;
            case 2:
                break;
            case 3:
                h = this.load16bit(a + 2);
                break;
            case 4:
                h = this.REG_ACC;
                break;
            case 5:
                h = this.REG_PC;
                break;
            case 6:
                h = (this.load(a + 2) + this.REG_X) & 255;
                break;
            case 7:
                h = (this.load(a + 2) + this.REG_Y) & 255;
                break;
            case 8:
                h = this.load16bit(a + 2);
                if ((h & 65280) != ((h + this.REG_X) & 65280)) {
                    f = 1
                }
                h += this.REG_X;
                break;
            case 9:
                h = this.load16bit(a + 2);
                if ((h & 65280) != ((h + this.REG_Y) & 65280)) {
                    f = 1
                }
                h += this.REG_Y;
                break;
            case 10:
                h = this.load(a + 2);
                if ((h & 65280) != ((h + this.REG_X) & 65280)) {
                    f = 1
                }
                h += this.REG_X;
                h &= 255;
                h = this.load16bit(h);
                break;
            case 11:
                h = this.load16bit(this.load(a + 2));
                if ((h & 65280) != ((h + this.REG_Y) & 65280)) {
                    f = 1
                }
                h += this.REG_Y;
                break;
            case 12:
                h = this.load16bit(a + 2);
                if (h < 8191) {
                    h = this.mem[h] + (this.mem[(h & 65280) | (((h & 255) + 1) & 255)] << 8)
                } else {
                    h = this.nes.mmap.load(h) + (this.nes.mmap.load((h & 65280) | (((h & 255) + 1) & 255)) << 8)
                }
                break
        }
        h &= 65535;
        switch (e & 255) {
            case 0:
                c = this.REG_ACC + this.load(h) + this.F_CARRY;
                this.F_OVERFLOW = ((!(((this.REG_ACC ^ this.load(h)) & 128) != 0) && (((this.REG_ACC ^ c) & 128)) != 0) ? 1 : 0);
                this.F_CARRY = (c > 255 ? 1 : 0);
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c & 255;
                this.REG_ACC = (c & 255);
                d += f;
                break;
            case 1:
                this.REG_ACC = this.REG_ACC & this.load(h);
                this.F_SIGN = (this.REG_ACC >> 7) & 1;
                this.F_ZERO = this.REG_ACC;
                if (b != 11) {
                    d += f
                }
                break;
            case 2:
                if (b == 4) {
                    this.F_CARRY = (this.REG_ACC >> 7) & 1;
                    this.REG_ACC = (this.REG_ACC << 1) & 255;
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC
                } else {
                    c = this.load(h);
                    this.F_CARRY = (c >> 7) & 1;
                    c = (c << 1) & 255;
                    this.F_SIGN = (c >> 7) & 1;
                    this.F_ZERO = c;
                    this.write(h, c)
                }
                break;
            case 3:
                if (this.F_CARRY == 0) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 4:
                if (this.F_CARRY == 1) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 5:
                if (this.F_ZERO == 0) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 6:
                c = this.load(h);
                this.F_SIGN = (c >> 7) & 1;
                this.F_OVERFLOW = (c >> 6) & 1;
                c &= this.REG_ACC;
                this.F_ZERO = c;
                break;
            case 7:
                if (this.F_SIGN == 1) {
                    d++;
                    this.REG_PC = h
                }
                break;
            case 8:
                if (this.F_ZERO != 0) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 9:
                if (this.F_SIGN == 0) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 10:
                this.REG_PC += 2;
                this.push((this.REG_PC >> 8) & 255);
                this.push(this.REG_PC & 255);
                this.F_BRK = 1;
                this.push((this.F_CARRY) | ((this.F_ZERO == 0 ? 1 : 0) << 1) | (this.F_INTERRUPT << 2) | (this.F_DECIMAL << 3) | (this.F_BRK << 4) | (this.F_NOTUSED << 5) | (this.F_OVERFLOW << 6) | (this.F_SIGN << 7));
                this.F_INTERRUPT = 1;
                this.REG_PC = this.load16bit(65534);
                this.REG_PC--;
                break;
            case 11:
                if (this.F_OVERFLOW == 0) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 12:
                if (this.F_OVERFLOW == 1) {
                    d += ((a & 65280) != (h & 65280) ? 2 : 1);
                    this.REG_PC = h
                }
                break;
            case 13:
                this.F_CARRY = 0;
                break;
            case 14:
                this.F_DECIMAL = 0;
                break;
            case 15:
                this.F_INTERRUPT = 0;
                break;
            case 16:
                this.F_OVERFLOW = 0;
                break;
            case 17:
                c = this.REG_ACC - this.load(h);
                this.F_CARRY = (c >= 0 ? 1 : 0);
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c & 255;
                d += f;
                break;
            case 18:
                c = this.REG_X - this.load(h);
                this.F_CARRY = (c >= 0 ? 1 : 0);
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c & 255;
                break;
            case 19:
                c = this.REG_Y - this.load(h);
                this.F_CARRY = (c >= 0 ? 1 : 0);
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c & 255;
                break;
            case 20:
                c = (this.load(h) - 1) & 255;
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c;
                this.write(h, c);
                break;
            case 21:
                this.REG_X = (this.REG_X - 1) & 255;
                this.F_SIGN = (this.REG_X >> 7) & 1;
                this.F_ZERO = this.REG_X;
                break;
            case 22:
                this.REG_Y = (this.REG_Y - 1) & 255;
                this.F_SIGN = (this.REG_Y >> 7) & 1;
                this.F_ZERO = this.REG_Y;
                break;
            case 23:
                this.REG_ACC = (this.load(h) ^ this.REG_ACC) & 255;
                this.F_SIGN = (this.REG_ACC >> 7) & 1;
                this.F_ZERO = this.REG_ACC;
                d += f;
                break;
            case 24:
                c = (this.load(h) + 1) & 255;
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c;
                this.write(h, c & 255);
                break;
            case 25:
                this.REG_X = (this.REG_X + 1) & 255;
                this.F_SIGN = (this.REG_X >> 7) & 1;
                this.F_ZERO = this.REG_X;
                break;
            case 26:
                this.REG_Y++;
                this.REG_Y &= 255;
                this.F_SIGN = (this.REG_Y >> 7) & 1;
                this.F_ZERO = this.REG_Y;
                break;
            case 27:
                this.REG_PC = h - 1;
                break;
            case 28:
                this.push((this.REG_PC >> 8) & 255);
                this.push(this.REG_PC & 255);
                this.REG_PC = h - 1;
                break;
            case 29:
                this.REG_ACC = this.load(h);
                this.F_SIGN = (this.REG_ACC >> 7) & 1;
                this.F_ZERO = this.REG_ACC;
                d += f;
                break;
            case 30:
                this.REG_X = this.load(h);
                this.F_SIGN = (this.REG_X >> 7) & 1;
                this.F_ZERO = this.REG_X;
                d += f;
                break;
            case 31:
                this.REG_Y = this.load(h);
                this.F_SIGN = (this.REG_Y >> 7) & 1;
                this.F_ZERO = this.REG_Y;
                d += f;
                break;
            case 32:
                if (b == 4) {
                    c = (this.REG_ACC & 255);
                    this.F_CARRY = c & 1;
                    c >>= 1;
                    this.REG_ACC = c
                } else {
                    c = this.load(h) & 255;
                    this.F_CARRY = c & 1;
                    c >>= 1;
                    this.write(h, c)
                }
                this.F_SIGN = 0;
                this.F_ZERO = c;
                break;
            case 33:
                break;
            case 34:
                c = (this.load(h) | this.REG_ACC) & 255;
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c;
                this.REG_ACC = c;
                if (b != 11) {
                    d += f
                }
                break;
            case 35:
                this.push(this.REG_ACC);
                break;
            case 36:
                this.F_BRK = 1;
                this.push((this.F_CARRY) | ((this.F_ZERO == 0 ? 1 : 0) << 1) | (this.F_INTERRUPT << 2) | (this.F_DECIMAL << 3) | (this.F_BRK << 4) | (this.F_NOTUSED << 5) | (this.F_OVERFLOW << 6) | (this.F_SIGN << 7));
                break;
            case 37:
                this.REG_ACC = this.pull();
                this.F_SIGN = (this.REG_ACC >> 7) & 1;
                this.F_ZERO = this.REG_ACC;
                break;
            case 38:
                c = this.pull();
                this.F_CARRY = (c) & 1;
                this.F_ZERO = (((c >> 1) & 1) == 1) ? 0 : 1;
                this.F_INTERRUPT = (c >> 2) & 1;
                this.F_DECIMAL = (c >> 3) & 1;
                this.F_BRK = (c >> 4) & 1;
                this.F_NOTUSED = (c >> 5) & 1;
                this.F_OVERFLOW = (c >> 6) & 1;
                this.F_SIGN = (c >> 7) & 1;
                this.F_NOTUSED = 1;
                break;
            case 39:
                if (b == 4) {
                    c = this.REG_ACC;
                    g = this.F_CARRY;
                    this.F_CARRY = (c >> 7) & 1;
                    c = ((c << 1) & 255) + g;
                    this.REG_ACC = c
                } else {
                    c = this.load(h);
                    g = this.F_CARRY;
                    this.F_CARRY = (c >> 7) & 1;
                    c = ((c << 1) & 255) + g;
                    this.write(h, c)
                }
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c;
                break;
            case 40:
                if (b == 4) {
                    g = this.F_CARRY << 7;
                    this.F_CARRY = this.REG_ACC & 1;
                    c = (this.REG_ACC >> 1) + g;
                    this.REG_ACC = c
                } else {
                    c = this.load(h);
                    g = this.F_CARRY << 7;
                    this.F_CARRY = c & 1;
                    c = (c >> 1) + g;
                    this.write(h, c)
                }
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c;
                break;
            case 41:
                c = this.pull();
                this.F_CARRY = (c) & 1;
                this.F_ZERO = ((c >> 1) & 1) == 0 ? 1 : 0;
                this.F_INTERRUPT = (c >> 2) & 1;
                this.F_DECIMAL = (c >> 3) & 1;
                this.F_BRK = (c >> 4) & 1;
                this.F_NOTUSED = (c >> 5) & 1;
                this.F_OVERFLOW = (c >> 6) & 1;
                this.F_SIGN = (c >> 7) & 1;
                this.REG_PC = this.pull();
                this.REG_PC += (this.pull() << 8);
                if (this.REG_PC == 65535) {
                    return
                }
                this.REG_PC--;
                this.F_NOTUSED = 1;
                break;
            case 42:
                this.REG_PC = this.pull();
                this.REG_PC += (this.pull() << 8);
                if (this.REG_PC == 65535) {
                    return
                }
                break;
            case 43:
                c = this.REG_ACC - this.load(h) - (1 - this.F_CARRY);
                this.F_SIGN = (c >> 7) & 1;
                this.F_ZERO = c & 255;
                this.F_OVERFLOW = ((((this.REG_ACC ^ c) & 128) != 0 && ((this.REG_ACC ^ this.load(h)) & 128) != 0) ? 1 : 0);
                this.F_CARRY = (c < 0 ? 0 : 1);
                this.REG_ACC = (c & 255);
                if (b != 11) {
                    d += f
                }
                break;
            case 44:
                this.F_CARRY = 1;
                break;
            case 45:
                this.F_DECIMAL = 1;
                break;
            case 46:
                this.F_INTERRUPT = 1;
                break;
            case 47:
                this.write(h, this.REG_ACC);
                break;
            case 48:
                this.write(h, this.REG_X);
                break;
            case 49:
                this.write(h, this.REG_Y);
                break;
            case 50:
                this.REG_X = this.REG_ACC;
                this.F_SIGN = (this.REG_ACC >> 7) & 1;
                this.F_ZERO = this.REG_ACC;
                break;
            case 51:
                this.REG_Y = this.REG_ACC;
                this.F_SIGN = (this.REG_ACC >> 7) & 1;
                this.F_ZERO = this.REG_ACC;
                break;
            case 52:
                this.REG_X = (this.REG_SP - 256);
                this.F_SIGN = (this.REG_SP >> 7) & 1;
                this.F_ZERO = this.REG_X;
                break;
            case 53:
                this.REG_ACC = this.REG_X;
                this.F_SIGN = (this.REG_X >> 7) & 1;
                this.F_ZERO = this.REG_X;
                break;
            case 54:
                this.REG_SP = (this.REG_X + 256);
                this.stackWrap();
                break;
            case 55:
                this.REG_ACC = this.REG_Y;
                this.F_SIGN = (this.REG_Y >> 7) & 1;
                this.F_ZERO = this.REG_Y;
                break;
            default:
                this.nes.stop();
                this.nes.crashMessage = "Game crashed, invalid opcode at address $" + a.toString(16);
                break
        }
        return d
    },load: function(a) {
        if (a < 8192) {
            return this.mem[a & 2047]
        } else {
            return this.nes.mmap.load(a)
        }
    },load16bit: function(a) {
        if (a < 8191) {
            return this.mem[a & 2047] | (this.mem[(a + 1) & 2047] << 8)
        } else {
            return this.nes.mmap.load(a) | (this.nes.mmap.load(a + 1) << 8)
        }
    },write: function(b, a) {
        if (b < 8192) {
            this.mem[b & 2047] = a
        } else {
            this.nes.mmap.write(b, a)
        }
    },requestIrq: function(a) {
        if (this.irqRequested) {
            if (a == this.IRQ_NORMAL) {
                return
            }
        }
        this.irqRequested = true;
        this.irqType = a
    },push: function(a) {
        this.nes.mmap.write(this.REG_SP, a);
        this.REG_SP--;
        this.REG_SP = 256 | (this.REG_SP & 255)
    },stackWrap: function() {
        this.REG_SP = 256 | (this.REG_SP & 255)
    },pull: function() {
        this.REG_SP++;
        this.REG_SP = 256 | (this.REG_SP & 255);
        return this.nes.mmap.load(this.REG_SP)
    },pageCrossed: function(b, a) {
        return ((b & 65280) != (a & 65280))
    },haltCycles: function(a) {
        this.cyclesToHalt += a
    },doNonMaskableInterrupt: function(a) {
        if ((this.nes.mmap.load(8192) & 128) != 0) {
            this.REG_PC_NEW++;
            this.push((this.REG_PC_NEW >> 8) & 255);
            this.push(this.REG_PC_NEW & 255);
            this.push(a);
            this.REG_PC_NEW = this.nes.mmap.load(65530) | (this.nes.mmap.load(65531) << 8);
            this.REG_PC_NEW--
        }
    },doResetInterrupt: function() {
        this.REG_PC_NEW = this.nes.mmap.load(65532) | (this.nes.mmap.load(65533) << 8);
        this.REG_PC_NEW--
    },doIrq: function(a) {
        this.REG_PC_NEW++;
        this.push((this.REG_PC_NEW >> 8) & 255);
        this.push(this.REG_PC_NEW & 255);
        this.push(a);
        this.F_INTERRUPT_NEW = 1;
        this.F_BRK_NEW = 0;
        this.REG_PC_NEW = this.nes.mmap.load(65534) | (this.nes.mmap.load(65535) << 8);
        this.REG_PC_NEW--
    },getStatus: function() {
        return (this.F_CARRY) | (this.F_ZERO << 1) | (this.F_INTERRUPT << 2) | (this.F_DECIMAL << 3) | (this.F_BRK << 4) | (this.F_NOTUSED << 5) | (this.F_OVERFLOW << 6) | (this.F_SIGN << 7)
    },setStatus: function(a) {
        this.F_CARRY = (a) & 1;
        this.F_ZERO = (a >> 1) & 1;
        this.F_INTERRUPT = (a >> 2) & 1;
        this.F_DECIMAL = (a >> 3) & 1;
        this.F_BRK = (a >> 4) & 1;
        this.F_NOTUSED = (a >> 5) & 1;
        this.F_OVERFLOW = (a >> 6) & 1;
        this.F_SIGN = (a >> 7) & 1
    },JSON_PROPERTIES: ["mem", "cyclesToHalt", "irqRequested", "irqType", "REG_ACC", "REG_X", "REG_Y", "REG_SP", "REG_PC", "REG_PC_NEW", "REG_STATUS", "F_CARRY", "F_DECIMAL", "F_INTERRUPT", "F_INTERRUPT_NEW", "F_OVERFLOW", "F_SIGN", "F_ZERO", "F_NOTUSED", "F_NOTUSED_NEW", "F_BRK", "F_BRK_NEW"],toJSON: function() {
        return JSNES.Utils.toJSON(this)
    },fromJSON: function(a) {
        JSNES.Utils.fromJSON(this, a)
    }};
JSNES.CPU.OpData = function() {
    this.opdata = new Array(256);
    for (var a = 0; a < 256; a++) {
        this.opdata[a] = 255
    }
    this.setOp(this.INS_ADC, 105, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_ADC, 101, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_ADC, 117, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_ADC, 109, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_ADC, 125, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_ADC, 121, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_ADC, 97, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_ADC, 113, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_AND, 41, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_AND, 37, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_AND, 53, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_AND, 45, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_AND, 61, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_AND, 57, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_AND, 33, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_AND, 49, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_ASL, 10, this.ADDR_ACC, 1, 2);
    this.setOp(this.INS_ASL, 6, this.ADDR_ZP, 2, 5);
    this.setOp(this.INS_ASL, 22, this.ADDR_ZPX, 2, 6);
    this.setOp(this.INS_ASL, 14, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_ASL, 30, this.ADDR_ABSX, 3, 7);
    this.setOp(this.INS_BCC, 144, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BCS, 176, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BEQ, 240, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BIT, 36, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_BIT, 44, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_BMI, 48, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BNE, 208, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BPL, 16, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BRK, 0, this.ADDR_IMP, 1, 7);
    this.setOp(this.INS_BVC, 80, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_BVS, 112, this.ADDR_REL, 2, 2);
    this.setOp(this.INS_CLC, 24, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_CLD, 216, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_CLI, 88, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_CLV, 184, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_CMP, 201, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_CMP, 197, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_CMP, 213, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_CMP, 205, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_CMP, 221, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_CMP, 217, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_CMP, 193, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_CMP, 209, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_CPX, 224, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_CPX, 228, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_CPX, 236, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_CPY, 192, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_CPY, 196, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_CPY, 204, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_DEC, 198, this.ADDR_ZP, 2, 5);
    this.setOp(this.INS_DEC, 214, this.ADDR_ZPX, 2, 6);
    this.setOp(this.INS_DEC, 206, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_DEC, 222, this.ADDR_ABSX, 3, 7);
    this.setOp(this.INS_DEX, 202, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_DEY, 136, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_EOR, 73, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_EOR, 69, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_EOR, 85, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_EOR, 77, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_EOR, 93, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_EOR, 89, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_EOR, 65, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_EOR, 81, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_INC, 230, this.ADDR_ZP, 2, 5);
    this.setOp(this.INS_INC, 246, this.ADDR_ZPX, 2, 6);
    this.setOp(this.INS_INC, 238, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_INC, 254, this.ADDR_ABSX, 3, 7);
    this.setOp(this.INS_INX, 232, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_INY, 200, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_JMP, 76, this.ADDR_ABS, 3, 3);
    this.setOp(this.INS_JMP, 108, this.ADDR_INDABS, 3, 5);
    this.setOp(this.INS_JSR, 32, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_LDA, 169, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_LDA, 165, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_LDA, 181, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_LDA, 173, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_LDA, 189, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_LDA, 185, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_LDA, 161, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_LDA, 177, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_LDX, 162, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_LDX, 166, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_LDX, 182, this.ADDR_ZPY, 2, 4);
    this.setOp(this.INS_LDX, 174, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_LDX, 190, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_LDY, 160, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_LDY, 164, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_LDY, 180, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_LDY, 172, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_LDY, 188, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_LSR, 74, this.ADDR_ACC, 1, 2);
    this.setOp(this.INS_LSR, 70, this.ADDR_ZP, 2, 5);
    this.setOp(this.INS_LSR, 86, this.ADDR_ZPX, 2, 6);
    this.setOp(this.INS_LSR, 78, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_LSR, 94, this.ADDR_ABSX, 3, 7);
    this.setOp(this.INS_NOP, 234, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_ORA, 9, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_ORA, 5, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_ORA, 21, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_ORA, 13, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_ORA, 29, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_ORA, 25, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_ORA, 1, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_ORA, 17, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_PHA, 72, this.ADDR_IMP, 1, 3);
    this.setOp(this.INS_PHP, 8, this.ADDR_IMP, 1, 3);
    this.setOp(this.INS_PLA, 104, this.ADDR_IMP, 1, 4);
    this.setOp(this.INS_PLP, 40, this.ADDR_IMP, 1, 4);
    this.setOp(this.INS_ROL, 42, this.ADDR_ACC, 1, 2);
    this.setOp(this.INS_ROL, 38, this.ADDR_ZP, 2, 5);
    this.setOp(this.INS_ROL, 54, this.ADDR_ZPX, 2, 6);
    this.setOp(this.INS_ROL, 46, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_ROL, 62, this.ADDR_ABSX, 3, 7);
    this.setOp(this.INS_ROR, 106, this.ADDR_ACC, 1, 2);
    this.setOp(this.INS_ROR, 102, this.ADDR_ZP, 2, 5);
    this.setOp(this.INS_ROR, 118, this.ADDR_ZPX, 2, 6);
    this.setOp(this.INS_ROR, 110, this.ADDR_ABS, 3, 6);
    this.setOp(this.INS_ROR, 126, this.ADDR_ABSX, 3, 7);
    this.setOp(this.INS_RTI, 64, this.ADDR_IMP, 1, 6);
    this.setOp(this.INS_RTS, 96, this.ADDR_IMP, 1, 6);
    this.setOp(this.INS_SBC, 233, this.ADDR_IMM, 2, 2);
    this.setOp(this.INS_SBC, 229, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_SBC, 245, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_SBC, 237, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_SBC, 253, this.ADDR_ABSX, 3, 4);
    this.setOp(this.INS_SBC, 249, this.ADDR_ABSY, 3, 4);
    this.setOp(this.INS_SBC, 225, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_SBC, 241, this.ADDR_POSTIDXIND, 2, 5);
    this.setOp(this.INS_SEC, 56, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_SED, 248, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_SEI, 120, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_STA, 133, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_STA, 149, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_STA, 141, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_STA, 157, this.ADDR_ABSX, 3, 5);
    this.setOp(this.INS_STA, 153, this.ADDR_ABSY, 3, 5);
    this.setOp(this.INS_STA, 129, this.ADDR_PREIDXIND, 2, 6);
    this.setOp(this.INS_STA, 145, this.ADDR_POSTIDXIND, 2, 6);
    this.setOp(this.INS_STX, 134, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_STX, 150, this.ADDR_ZPY, 2, 4);
    this.setOp(this.INS_STX, 142, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_STY, 132, this.ADDR_ZP, 2, 3);
    this.setOp(this.INS_STY, 148, this.ADDR_ZPX, 2, 4);
    this.setOp(this.INS_STY, 140, this.ADDR_ABS, 3, 4);
    this.setOp(this.INS_TAX, 170, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_TAY, 168, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_TSX, 186, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_TXA, 138, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_TXS, 154, this.ADDR_IMP, 1, 2);
    this.setOp(this.INS_TYA, 152, this.ADDR_IMP, 1, 2);
    this.cycTable = new Array(7, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 6, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 2, 6, 2, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5, 2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 2, 5, 2, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4, 2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, 2, 6, 3, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, 2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7);
    this.instname = new Array(56);
    this.instname[0] = "ADC";
    this.instname[1] = "AND";
    this.instname[2] = "ASL";
    this.instname[3] = "BCC";
    this.instname[4] = "BCS";
    this.instname[5] = "BEQ";
    this.instname[6] = "BIT";
    this.instname[7] = "BMI";
    this.instname[8] = "BNE";
    this.instname[9] = "BPL";
    this.instname[10] = "BRK";
    this.instname[11] = "BVC";
    this.instname[12] = "BVS";
    this.instname[13] = "CLC";
    this.instname[14] = "CLD";
    this.instname[15] = "CLI";
    this.instname[16] = "CLV";
    this.instname[17] = "CMP";
    this.instname[18] = "CPX";
    this.instname[19] = "CPY";
    this.instname[20] = "DEC";
    this.instname[21] = "DEX";
    this.instname[22] = "DEY";
    this.instname[23] = "EOR";
    this.instname[24] = "INC";
    this.instname[25] = "INX";
    this.instname[26] = "INY";
    this.instname[27] = "JMP";
    this.instname[28] = "JSR";
    this.instname[29] = "LDA";
    this.instname[30] = "LDX";
    this.instname[31] = "LDY";
    this.instname[32] = "LSR";
    this.instname[33] = "NOP";
    this.instname[34] = "ORA";
    this.instname[35] = "PHA";
    this.instname[36] = "PHP";
    this.instname[37] = "PLA";
    this.instname[38] = "PLP";
    this.instname[39] = "ROL";
    this.instname[40] = "ROR";
    this.instname[41] = "RTI";
    this.instname[42] = "RTS";
    this.instname[43] = "SBC";
    this.instname[44] = "SEC";
    this.instname[45] = "SED";
    this.instname[46] = "SEI";
    this.instname[47] = "STA";
    this.instname[48] = "STX";
    this.instname[49] = "STY";
    this.instname[50] = "TAX";
    this.instname[51] = "TAY";
    this.instname[52] = "TSX";
    this.instname[53] = "TXA";
    this.instname[54] = "TXS";
    this.instname[55] = "TYA";
    this.addrDesc = new Array("Zero Page           ", "Relative            ", "Implied             ", "Absolute            ", "Accumulator         ", "Immediate           ", "Zero Page,X         ", "Zero Page,Y         ", "Absolute,X          ", "Absolute,Y          ", "Preindexed Indirect ", "Postindexed Indirect", "Indirect Absolute   ")
};
JSNES.CPU.OpData.prototype = {INS_ADC: 0,INS_AND: 1,INS_ASL: 2,INS_BCC: 3,INS_BCS: 4,INS_BEQ: 5,INS_BIT: 6,INS_BMI: 7,INS_BNE: 8,INS_BPL: 9,INS_BRK: 10,INS_BVC: 11,INS_BVS: 12,INS_CLC: 13,INS_CLD: 14,INS_CLI: 15,INS_CLV: 16,INS_CMP: 17,INS_CPX: 18,INS_CPY: 19,INS_DEC: 20,INS_DEX: 21,INS_DEY: 22,INS_EOR: 23,INS_INC: 24,INS_INX: 25,INS_INY: 26,INS_JMP: 27,INS_JSR: 28,INS_LDA: 29,INS_LDX: 30,INS_LDY: 31,INS_LSR: 32,INS_NOP: 33,INS_ORA: 34,INS_PHA: 35,INS_PHP: 36,INS_PLA: 37,INS_PLP: 38,INS_ROL: 39,INS_ROR: 40,INS_RTI: 41,INS_RTS: 42,INS_SBC: 43,INS_SEC: 44,INS_SED: 45,INS_SEI: 46,INS_STA: 47,INS_STX: 48,INS_STY: 49,INS_TAX: 50,INS_TAY: 51,INS_TSX: 52,INS_TXA: 53,INS_TXS: 54,INS_TYA: 55,INS_DUMMY: 56,ADDR_ZP: 0,ADDR_REL: 1,ADDR_IMP: 2,ADDR_ABS: 3,ADDR_ACC: 4,ADDR_IMM: 5,ADDR_ZPX: 6,ADDR_ZPY: 7,ADDR_ABSX: 8,ADDR_ABSY: 9,ADDR_PREIDXIND: 10,ADDR_POSTIDXIND: 11,ADDR_INDABS: 12,setOp: function(b, e, d, a, c) {
        this.opdata[e] = ((b & 255)) | ((d & 255) << 8) | ((a & 255) << 16) | ((c & 255) << 24)
    }};
JSNES.Keyboard = function() {
    var a;
    this.keys = {KEY_A: 0,KEY_B: 1,KEY_SELECT: 2,KEY_START: 3,KEY_UP: 4,KEY_DOWN: 5,KEY_LEFT: 6,KEY_RIGHT: 7};
    this.state1 = new Array(8);
    for (a = 0; a < this.state1.length; a++) {
        this.state1[a] = 64
    }
    this.state2 = new Array(8);
    for (a = 0; a < this.state2.length; a++) {
        this.state2[a] = 64
    }
};
JSNES.Keyboard.prototype = {setKey: function(a, b) {
        switch (a) {
            case 88:
                this.state1[this.keys.KEY_A] = b;
                break;
            case 90:
                this.state1[this.keys.KEY_B] = b;
                break;
            case 17:
                this.state1[this.keys.KEY_SELECT] = b;
                break;
            case 13:
                this.state1[this.keys.KEY_START] = b;
                break;
            case 38:
                this.state1[this.keys.KEY_UP] = b;
                break;
            case 40:
                this.state1[this.keys.KEY_DOWN] = b;
                break;
            case 37:
                this.state1[this.keys.KEY_LEFT] = b;
                break;
            case 39:
                this.state1[this.keys.KEY_RIGHT] = b;
                break;
            case 103:
                this.state2[this.keys.KEY_A] = b;
                break;
            case 105:
                this.state2[this.keys.KEY_B] = b;
                break;
            case 99:
                this.state2[this.keys.KEY_SELECT] = b;
                break;
            case 97:
                this.state2[this.keys.KEY_START] = b;
                break;
            case 104:
                this.state2[this.keys.KEY_UP] = b;
                break;
            case 98:
                this.state2[this.keys.KEY_DOWN] = b;
                break;
            case 100:
                this.state2[this.keys.KEY_LEFT] = b;
                break;
            case 102:
                this.state2[this.keys.KEY_RIGHT] = b;
                break;
            default:
                return true
        }
        return false
    },keyDown: function(a) {
        if (!this.setKey(a.keyCode, 65) && a.preventDefault) {
            a.preventDefault()
        }
    },keyUp: function(a) {
        if (!this.setKey(a.keyCode, 64) && a.preventDefault) {
            a.preventDefault()
        }
    },keyPress: function(a) {
        a.preventDefault()
    }};
JSNES.Mappers = {};
JSNES.Mappers[0] = function(a) {
    this.nes = a
};
JSNES.Mappers[0].prototype = {reset: function() {
        this.joy1StrobeState = 0;
        this.joy2StrobeState = 0;
        this.joypadLastWrite = 0;
        this.mousePressed = false;
        this.mouseX = null;
        this.mouseY = null
    },write: function(a, b) {
        if (a < 8192) {
            this.nes.cpu.mem[a & 2047] = b
        } else {
            if (a > 16407) {
                this.nes.cpu.mem[a] = b;
                if (a >= 24576 && a < 32768) {
                }
            } else {
                if (a > 8199 && a < 16384) {
                    this.regWrite(8192 + (a & 7), b)
                } else {
                    this.regWrite(a, b)
                }
            }
        }
    },writelow: function(a, b) {
        if (a < 8192) {
            this.nes.cpu.mem[a & 2047] = b
        } else {
            if (a > 16407) {
                this.nes.cpu.mem[a] = b
            } else {
                if (a > 8199 && a < 16384) {
                    this.regWrite(8192 + (a & 7), b)
                } else {
                    this.regWrite(a, b)
                }
            }
        }
    },load: function(a) {
        a &= 65535;
        if (a > 16407) {
            return this.nes.cpu.mem[a]
        } else {
            if (a >= 8192) {
                return this.regLoad(a)
            } else {
                return this.nes.cpu.mem[a & 2047]
            }
        }
    },regLoad: function(c) {
        switch (c >> 12) {
            case 0:
                break;
            case 1:
                break;
            case 2:
            case 3:
                switch (c & 7) {
                    case 0:
                        return this.nes.cpu.mem[8192];
                    case 1:
                        return this.nes.cpu.mem[8193];
                    case 2:
                        return this.nes.ppu.readStatusRegister();
                    case 3:
                        return 0;
                    case 4:
                        return this.nes.ppu.sramLoad();
                    case 5:
                        return 0;
                    case 6:
                        return 0;
                    case 7:
                        return this.nes.ppu.vramLoad()
                }
                break;
            case 4:
                switch (c - 16405) {
                    case 0:
                        return this.nes.papu.readReg(c);
                    case 1:
                        return this.joy1Read();
                    case 2:
                        if (this.mousePressed) {
                            var h = Math.max(0, this.mouseX - 4);
                            var e = Math.min(256, this.mouseX + 4);
                            var f = Math.max(0, this.mouseY - 4);
                            var d = Math.min(240, this.mouseY + 4);
                            var b = 0;
                            for (var g = f; g < d; g++) {
                                for (var a = h; a < e; a++) {
                                    if (this.nes.ppu.buffer[(g << 8) + a] == 16777215) {
                                        b |= 1 << 3;
                                        console.debug("Clicked on white!");
                                        break
                                    }
                                }
                            }
                            b |= (this.mousePressed ? (1 << 4) : 0);
                            return (this.joy2Read() | b) & 65535
                        } else {
                            return this.joy2Read()
                        }
                }
                break
        }
        return 0
    },regWrite: function(a, b) {
        switch (a) {
            case 8192:
                this.nes.cpu.mem[a] = b;
                this.nes.ppu.updateControlReg1(b);
                break;
            case 8193:
                this.nes.cpu.mem[a] = b;
                this.nes.ppu.updateControlReg2(b);
                break;
            case 8195:
                this.nes.ppu.writeSRAMAddress(b);
                break;
            case 8196:
                this.nes.ppu.sramWrite(b);
                break;
            case 8197:
                this.nes.ppu.scrollWrite(b);
                break;
            case 8198:
                this.nes.ppu.writeVRAMAddress(b);
                break;
            case 8199:
                this.nes.ppu.vramWrite(b);
                break;
            case 16404:
                this.nes.ppu.sramDMA(b);
                break;
            case 16405:
                this.nes.papu.writeReg(a, b);
                break;
            case 16406:
                if (b === 0 && this.joypadLastWrite === 1) {
                    this.joy1StrobeState = 0;
                    this.joy2StrobeState = 0
                }
                this.joypadLastWrite = b;
                break;
            case 16407:
                this.nes.papu.writeReg(a, b);
                break;
            default:
                if (a >= 16384 && a <= 16407) {
                    this.nes.papu.writeReg(a, b)
                }
        }
    },joy1Read: function() {
        var a;
        switch (this.joy1StrobeState) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                a = this.nes.keyboard.state1[this.joy1StrobeState];
                break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
                a = 0;
                break;
            case 19:
                a = 1;
                break;
            default:
                a = 0
        }
        this.joy1StrobeState++;
        if (this.joy1StrobeState == 24) {
            this.joy1StrobeState = 0
        }
        return a
    },joy2Read: function() {
        var a;
        switch (this.joy2StrobeState) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                a = this.nes.keyboard.state2[this.joy2StrobeState];
                break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
                a = 0;
                break;
            case 19:
                a = 1;
                break;
            default:
                a = 0
        }
        this.joy2StrobeState++;
        if (this.joy2StrobeState == 24) {
            this.joy2StrobeState = 0
        }
        return a
    },loadROM: function() {
        if (!this.nes.rom.valid || this.nes.rom.romCount < 1) {
            alert("NoMapper: Invalid ROM! Unable to load.");
            return
        }
        this.loadPRGROM();
        this.loadCHRROM();
        this.loadBatteryRam();
        this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
    },loadPRGROM: function() {
        if (this.nes.rom.romCount > 1) {
            this.loadRomBank(0, 32768);
            this.loadRomBank(1, 49152)
        } else {
            this.loadRomBank(0, 32768);
            this.loadRomBank(0, 49152)
        }
    },loadCHRROM: function() {
        if (this.nes.rom.vromCount > 0) {
            if (this.nes.rom.vromCount == 1) {
                this.loadVromBank(0, 0);
                this.loadVromBank(0, 4096)
            } else {
                this.loadVromBank(0, 0);
                this.loadVromBank(1, 4096)
            }
        } else {
        }
    },loadBatteryRam: function() {
        if (this.nes.rom.batteryRam) {
            var a = this.nes.rom.batteryRam;
            if (a !== null && a.length == 8192) {
                JSNES.Utils.copyArrayElements(a, 0, this.nes.cpu.mem, 24576, 8192)
            }
        }
    },loadRomBank: function(b, a) {
        b %= this.nes.rom.romCount;
        JSNES.Utils.copyArrayElements(this.nes.rom.rom[b], 0, this.nes.cpu.mem, a, 16384)
    },loadVromBank: function(c, b) {
        if (this.nes.rom.vromCount === 0) {
            return
        }
        this.nes.ppu.triggerRendering();
        JSNES.Utils.copyArrayElements(this.nes.rom.vrom[c % this.nes.rom.vromCount], 0, this.nes.ppu.vramMem, b, 4096);
        var a = this.nes.rom.vromTile[c % this.nes.rom.vromCount];
        JSNES.Utils.copyArrayElements(a, 0, this.nes.ppu.ptTile, b >> 4, 256)
    },load32kRomBank: function(b, a) {
        this.loadRomBank((b * 2) % this.nes.rom.romCount, a);
        this.loadRomBank((b * 2 + 1) % this.nes.rom.romCount, a + 16384)
    },load8kVromBank: function(b, a) {
        if (this.nes.rom.vromCount === 0) {
            return
        }
        this.nes.ppu.triggerRendering();
        this.loadVromBank((b) % this.nes.rom.vromCount, a);
        this.loadVromBank((b + 1) % this.nes.rom.vromCount, a + 4096)
    },load1kVromBank: function(e, c) {
        if (this.nes.rom.vromCount === 0) {
            return
        }
        this.nes.ppu.triggerRendering();
        var g = parseInt(e / 4, 10) % this.nes.rom.vromCount;
        var f = (e % 4) * 1024;
        JSNES.Utils.copyArrayElements(this.nes.rom.vrom[g], 0, this.nes.ppu.vramMem, f, 1024);
        var b = this.nes.rom.vromTile[g];
        var a = c >> 4;
        for (var d = 0; d < 64; d++) {
            this.nes.ppu.ptTile[a + d] = b[((e % 4) << 6) + d]
        }
    },load2kVromBank: function(e, c) {
        if (this.nes.rom.vromCount === 0) {
            return
        }
        this.nes.ppu.triggerRendering();
        var g = parseInt(e / 2, 10) % this.nes.rom.vromCount;
        var f = (e % 2) * 2048;
        JSNES.Utils.copyArrayElements(this.nes.rom.vrom[g], f, this.nes.ppu.vramMem, c, 2048);
        var b = this.nes.rom.vromTile[g];
        var a = c >> 4;
        for (var d = 0; d < 128; d++) {
            this.nes.ppu.ptTile[a + d] = b[((e % 2) << 7) + d]
        }
    },load8kRomBank: function(c, a) {
        var b = parseInt(c / 2, 10) % this.nes.rom.romCount;
        var d = (c % 2) * 8192;
        JSNES.Utils.copyArrayElements(this.nes.rom.rom[b], d, this.nes.cpu.mem, a, 8192)
    },clockIrqCounter: function() {
    },latchAccess: function(a) {
    },toJSON: function() {
        return {joy1StrobeState: this.joy1StrobeState,joy2StrobeState: this.joy2StrobeState,joypadLastWrite: this.joypadLastWrite}
    },fromJSON: function(a) {
        this.joy1StrobeState = a.joy1StrobeState;
        this.joy2StrobeState = a.joy2StrobeState;
        this.joypadLastWrite = a.joypadLastWrite
    }};
JSNES.Mappers[1] = function(a) {
    this.nes = a
};
JSNES.Mappers[1].prototype = new JSNES.Mappers[0]();
JSNES.Mappers[1].prototype.reset = function() {
    JSNES.Mappers[0].prototype.reset.apply(this);
    this.regBuffer = 0;
    this.regBufferCounter = 0;
    this.mirroring = 0;
    this.oneScreenMirroring = 0;
    this.prgSwitchingArea = 1;
    this.prgSwitchingSize = 1;
    this.vromSwitchingSize = 0;
    this.romSelectionReg0 = 0;
    this.romSelectionReg1 = 0;
    this.romBankSelect = 0
};
JSNES.Mappers[1].prototype.write = function(a, b) {
    if (a < 32768) {
        JSNES.Mappers[0].prototype.write.apply(this, arguments);
        return
    }
    if ((b & 128) !== 0) {
        this.regBufferCounter = 0;
        this.regBuffer = 0;
        if (this.getRegNumber(a) === 0) {
            this.prgSwitchingArea = 1;
            this.prgSwitchingSize = 1
        }
    } else {
        this.regBuffer = (this.regBuffer & (255 - (1 << this.regBufferCounter))) | ((b & 1) << this.regBufferCounter);
        this.regBufferCounter++;
        if (this.regBufferCounter == 5) {
            this.setReg(this.getRegNumber(a), this.regBuffer);
            this.regBuffer = 0;
            this.regBufferCounter = 0
        }
    }
};
JSNES.Mappers[1].prototype.setReg = function(d, e) {
    var c;
    switch (d) {
        case 0:
            c = e & 3;
            if (c !== this.mirroring) {
                this.mirroring = c;
                if ((this.mirroring & 2) === 0) {
                    this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING)
                } else {
                    if ((this.mirroring & 1) !== 0) {
                        this.nes.ppu.setMirroring(this.nes.rom.HORIZONTAL_MIRRORING)
                    } else {
                        this.nes.ppu.setMirroring(this.nes.rom.VERTICAL_MIRRORING)
                    }
                }
            }
            this.prgSwitchingArea = (e >> 2) & 1;
            this.prgSwitchingSize = (e >> 3) & 1;
            this.vromSwitchingSize = (e >> 4) & 1;
            break;
        case 1:
            this.romSelectionReg0 = (e >> 4) & 1;
            if (this.nes.rom.vromCount > 0) {
                if (this.vromSwitchingSize === 0) {
                    if (this.romSelectionReg0 === 0) {
                        this.load8kVromBank((e & 15), 0)
                    } else {
                        this.load8kVromBank(parseInt(this.nes.rom.vromCount / 2, 10) + (e & 15), 0)
                    }
                } else {
                    if (this.romSelectionReg0 === 0) {
                        this.loadVromBank((e & 15), 0)
                    } else {
                        this.loadVromBank(parseInt(this.nes.rom.vromCount / 2, 10) + (e & 15), 0)
                    }
                }
            }
            break;
        case 2:
            this.romSelectionReg1 = (e >> 4) & 1;
            if (this.nes.rom.vromCount > 0) {
                if (this.vromSwitchingSize === 1) {
                    if (this.romSelectionReg1 === 0) {
                        this.loadVromBank((e & 15), 4096)
                    } else {
                        this.loadVromBank(parseInt(this.nes.rom.vromCount / 2, 10) + (e & 15), 4096)
                    }
                }
            }
            break;
        default:
            c = e & 15;
            var a;
            var b = 0;
            if (this.nes.rom.romCount >= 32) {
                if (this.vromSwitchingSize === 0) {
                    if (this.romSelectionReg0 === 1) {
                        b = 16
                    }
                } else {
                    b = (this.romSelectionReg0 | (this.romSelectionReg1 << 1)) << 3
                }
            } else {
                if (this.nes.rom.romCount >= 16) {
                    if (this.romSelectionReg0 === 1) {
                        b = 8
                    }
                }
            }
            if (this.prgSwitchingSize === 0) {
                a = b + (e & 15);
                this.load32kRomBank(a, 32768)
            } else {
                a = b * 2 + (e & 15);
                if (this.prgSwitchingArea === 0) {
                    this.loadRomBank(a, 49152)
                } else {
                    this.loadRomBank(a, 32768)
                }
            }
    }
};
JSNES.Mappers[1].prototype.getRegNumber = function(a) {
    if (a >= 32768 && a <= 40959) {
        return 0
    } else {
        if (a >= 40960 && a <= 49151) {
            return 1
        } else {
            if (a >= 49152 && a <= 57343) {
                return 2
            } else {
                return 3
            }
        }
    }
};
JSNES.Mappers[1].prototype.loadROM = function(a) {
    if (!this.nes.rom.valid) {
        alert("MMC1: Invalid ROM! Unable to load.");
        return
    }
    this.loadRomBank(0, 32768);
    this.loadRomBank(this.nes.rom.romCount - 1, 49152);
    this.loadCHRROM();
    this.loadBatteryRam();
    this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
};
JSNES.Mappers[1].prototype.switchLowHighPrgRom = function(a) {
};
JSNES.Mappers[1].prototype.switch16to32 = function() {
};
JSNES.Mappers[1].prototype.switch32to16 = function() {
};
JSNES.Mappers[1].prototype.toJSON = function() {
    var a = JSNES.Mappers[0].prototype.toJSON.apply(this);
    a.mirroring = this.mirroring;
    a.oneScreenMirroring = this.oneScreenMirroring;
    a.prgSwitchingArea = this.prgSwitchingArea;
    a.prgSwitchingSize = this.prgSwitchingSize;
    a.vromSwitchingSize = this.vromSwitchingSize;
    a.romSelectionReg0 = this.romSelectionReg0;
    a.romSelectionReg1 = this.romSelectionReg1;
    a.romBankSelect = this.romBankSelect;
    a.regBuffer = this.regBuffer;
    a.regBufferCounter = this.regBufferCounter;
    return a
};
JSNES.Mappers[1].prototype.fromJSON = function(a) {
    JSNES.Mappers[0].prototype.fromJSON.apply(this, a);
    this.mirroring = a.mirroring;
    this.oneScreenMirroring = a.oneScreenMirroring;
    this.prgSwitchingArea = a.prgSwitchingArea;
    this.prgSwitchingSize = a.prgSwitchingSize;
    this.vromSwitchingSize = a.vromSwitchingSize;
    this.romSelectionReg0 = a.romSelectionReg0;
    this.romSelectionReg1 = a.romSelectionReg1;
    this.romBankSelect = a.romBankSelect;
    this.regBuffer = a.regBuffer;
    this.regBufferCounter = a.regBufferCounter
};
JSNES.Mappers[2] = function(a) {
    this.nes = a
};
JSNES.Mappers[2].prototype = new JSNES.Mappers[0]();
JSNES.Mappers[2].prototype.write = function(a, b) {
    if (a < 32768) {
        JSNES.Mappers[0].prototype.write.apply(this, arguments);
        return
    } else {
        this.loadRomBank(b, 32768)
    }
};
JSNES.Mappers[2].prototype.loadROM = function(a) {
    if (!this.nes.rom.valid) {
        alert("UNROM: Invalid ROM! Unable to load.");
        return
    }
    this.loadRomBank(0, 32768);
    this.loadRomBank(this.nes.rom.romCount - 1, 49152);
    this.loadCHRROM();
    this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
};
JSNES.Mappers[4] = function(a) {
    this.nes = a;
    this.CMD_SEL_2_1K_VROM_0000 = 0;
    this.CMD_SEL_2_1K_VROM_0800 = 1;
    this.CMD_SEL_1K_VROM_1000 = 2;
    this.CMD_SEL_1K_VROM_1400 = 3;
    this.CMD_SEL_1K_VROM_1800 = 4;
    this.CMD_SEL_1K_VROM_1C00 = 5;
    this.CMD_SEL_ROM_PAGE1 = 6;
    this.CMD_SEL_ROM_PAGE2 = 7;
    this.command = null;
    this.prgAddressSelect = null;
    this.chrAddressSelect = null;
    this.pageNumber = null;
    this.irqCounter = null;
    this.irqLatchValue = null;
    this.irqEnable = null;
    this.prgAddressChanged = false
};
JSNES.Mappers[4].prototype = new JSNES.Mappers[0]();
JSNES.Mappers[4].prototype.write = function(a, c) {
    if (a < 32768) {
        JSNES.Mappers[0].prototype.write.apply(this, arguments);
        return
    }
    switch (a) {
        case 32768:
            this.command = c & 7;
            var b = (c >> 6) & 1;
            if (b != this.prgAddressSelect) {
                this.prgAddressChanged = true
            }
            this.prgAddressSelect = b;
            this.chrAddressSelect = (c >> 7) & 1;
            break;
        case 32769:
            this.executeCommand(this.command, c);
            break;
        case 40960:
            if ((c & 1) !== 0) {
                this.nes.ppu.setMirroring(this.nes.rom.HORIZONTAL_MIRRORING)
            } else {
                this.nes.ppu.setMirroring(this.nes.rom.VERTICAL_MIRRORING)
            }
            break;
        case 40961:
            break;
        case 49152:
            this.irqCounter = c;
            break;
        case 49153:
            this.irqLatchValue = c;
            break;
        case 57344:
            this.irqEnable = 0;
            break;
        case 57345:
            this.irqEnable = 1;
            break;
        default:
    }
};
JSNES.Mappers[4].prototype.executeCommand = function(b, a) {
    switch (b) {
        case this.CMD_SEL_2_1K_VROM_0000:
            if (this.chrAddressSelect === 0) {
                this.load1kVromBank(a, 0);
                this.load1kVromBank(a + 1, 1024)
            } else {
                this.load1kVromBank(a, 4096);
                this.load1kVromBank(a + 1, 5120)
            }
            break;
        case this.CMD_SEL_2_1K_VROM_0800:
            if (this.chrAddressSelect === 0) {
                this.load1kVromBank(a, 2048);
                this.load1kVromBank(a + 1, 3072)
            } else {
                this.load1kVromBank(a, 6144);
                this.load1kVromBank(a + 1, 7168)
            }
            break;
        case this.CMD_SEL_1K_VROM_1000:
            if (this.chrAddressSelect === 0) {
                this.load1kVromBank(a, 4096)
            } else {
                this.load1kVromBank(a, 0)
            }
            break;
        case this.CMD_SEL_1K_VROM_1400:
            if (this.chrAddressSelect === 0) {
                this.load1kVromBank(a, 5120)
            } else {
                this.load1kVromBank(a, 1024)
            }
            break;
        case this.CMD_SEL_1K_VROM_1800:
            if (this.chrAddressSelect === 0) {
                this.load1kVromBank(a, 6144)
            } else {
                this.load1kVromBank(a, 2048)
            }
            break;
        case this.CMD_SEL_1K_VROM_1C00:
            if (this.chrAddressSelect === 0) {
                this.load1kVromBank(a, 7168)
            } else {
                this.load1kVromBank(a, 3072)
            }
            break;
        case this.CMD_SEL_ROM_PAGE1:
            if (this.prgAddressChanged) {
                if (this.prgAddressSelect === 0) {
                    this.load8kRomBank(((this.nes.rom.romCount - 1) * 2), 49152)
                } else {
                    this.load8kRomBank(((this.nes.rom.romCount - 1) * 2), 32768)
                }
                this.prgAddressChanged = false
            }
            if (this.prgAddressSelect === 0) {
                this.load8kRomBank(a, 32768)
            } else {
                this.load8kRomBank(a, 49152)
            }
            break;
        case this.CMD_SEL_ROM_PAGE2:
            this.load8kRomBank(a, 40960);
            if (this.prgAddressChanged) {
                if (this.prgAddressSelect === 0) {
                    this.load8kRomBank(((this.nes.rom.romCount - 1) * 2), 49152)
                } else {
                    this.load8kRomBank(((this.nes.rom.romCount - 1) * 2), 32768)
                }
                this.prgAddressChanged = false
            }
    }
};
JSNES.Mappers[4].prototype.loadROM = function(a) {
    if (!this.nes.rom.valid) {
        alert("MMC3: Invalid ROM! Unable to load.");
        return
    }
    this.load8kRomBank(((this.nes.rom.romCount - 1) * 2), 49152);
    this.load8kRomBank(((this.nes.rom.romCount - 1) * 2) + 1, 57344);
    this.load8kRomBank(0, 32768);
    this.load8kRomBank(1, 40960);
    this.loadCHRROM();
    this.loadBatteryRam();
    this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET)
};
JSNES.Mappers[4].prototype.toJSON = function() {
    var a = JSNES.Mappers[0].prototype.toJSON.apply(this);
    a.command = this.command;
    a.prgAddressSelect = this.prgAddressSelect;
    a.chrAddressSelect = this.chrAddressSelect;
    a.pageNumber = this.pageNumber;
    a.irqCounter = this.irqCounter;
    a.irqLatchValue = this.irqLatchValue;
    a.irqEnable = this.irqEnable;
    a.prgAddressChanged = this.prgAddressChanged;
    return a
};
JSNES.Mappers[4].prototype.fromJSON = function(a) {
    JSNES.Mappers[0].prototype.fromJSON.apply(this, a);
    this.command = a.command;
    this.prgAddressSelect = a.prgAddressSelect;
    this.chrAddressSelect = a.chrAddressSelect;
    this.pageNumber = a.pageNumber;
    this.irqCounter = a.irqCounter;
    this.irqLatchValue = a.irqLatchValue;
    this.irqEnable = a.irqEnable;
    this.prgAddressChanged = a.prgAddressChanged
};
JSNES.PAPU = function(b) {
    this.nes = b;
    this.square1 = new JSNES.PAPU.ChannelSquare(this, true);
    this.square2 = new JSNES.PAPU.ChannelSquare(this, false);
    this.triangle = new JSNES.PAPU.ChannelTriangle(this);
    this.noise = new JSNES.PAPU.ChannelNoise(this);
    this.dmc = new JSNES.PAPU.ChannelDM(this);
    this.frameIrqCounter = null;
    this.frameIrqCounterMax = 4;
    this.initCounter = 2048;
    this.channelEnableValue = null;
    this.bufferSize = 8192;
    this.bufferIndex = 0;
    this.sampleRate = 44100;
    this.lengthLookup = null;
    this.dmcFreqLookup = null;
    this.noiseWavelengthLookup = null;
    this.square_table = null;
    this.tnd_table = null;
    this.sampleBuffer = new Array(this.bufferSize * 2);
    this.frameIrqEnabled = false;
    this.frameIrqActive = null;
    this.frameClockNow = null;
    this.startedPlaying = false;
    this.recordOutput = false;
    this.initingHardware = false;
    this.masterFrameCounter = null;
    this.derivedFrameCounter = null;
    this.countSequence = null;
    this.sampleTimer = null;
    this.frameTime = null;
    this.sampleTimerMax = null;
    this.sampleCount = null;
    this.triValue = 0;
    this.smpSquare1 = null;
    this.smpSquare2 = null;
    this.smpTriangle = null;
    this.smpDmc = null;
    this.accCount = null;
    this.prevSampleL = 0;
    this.prevSampleR = 0;
    this.smpAccumL = 0;
    this.smpAccumR = 0;
    this.dacRange = 0;
    this.dcValue = 0;
    this.masterVolume = 256;
    this.stereoPosLSquare1 = null;
    this.stereoPosLSquare2 = null;
    this.stereoPosLTriangle = null;
    this.stereoPosLNoise = null;
    this.stereoPosLDMC = null;
    this.stereoPosRSquare1 = null;
    this.stereoPosRSquare2 = null;
    this.stereoPosRTriangle = null;
    this.stereoPosRNoise = null;
    this.stereoPosRDMC = null;
    this.extraCycles = null;
    this.maxSample = null;
    this.minSample = null;
    this.panning = [80, 170, 100, 150, 128];
    this.setPanning(this.panning);
    this.initLengthLookup();
    this.initDmcFrequencyLookup();
    this.initNoiseWavelengthLookup();
    this.initDACtables();
    for (var a = 0; a < 20; a++) {
        if (a === 16) {
            this.writeReg(16400, 16)
        } else {
            this.writeReg(16384 + a, 0)
        }
    }
    this.reset()
};
JSNES.PAPU.prototype = {reset: function() {
        this.sampleRate = this.nes.opts.sampleRate;
        this.sampleTimerMax = parseInt((1024 * this.nes.opts.CPU_FREQ_NTSC * this.nes.opts.preferredFrameRate) / (this.sampleRate * 60), 10);
        this.frameTime = parseInt((14915 * this.nes.opts.preferredFrameRate) / 60, 10);
        this.sampleTimer = 0;
        this.bufferIndex = 0;
        this.updateChannelEnable(0);
        this.masterFrameCounter = 0;
        this.derivedFrameCounter = 0;
        this.countSequence = 0;
        this.sampleCount = 0;
        this.initCounter = 2048;
        this.frameIrqEnabled = false;
        this.initingHardware = false;
        this.resetCounter();
        this.square1.reset();
        this.square2.reset();
        this.triangle.reset();
        this.noise.reset();
        this.dmc.reset();
        this.bufferIndex = 0;
        this.accCount = 0;
        this.smpSquare1 = 0;
        this.smpSquare2 = 0;
        this.smpTriangle = 0;
        this.smpDmc = 0;
        this.frameIrqEnabled = false;
        this.frameIrqCounterMax = 4;
        this.channelEnableValue = 255;
        this.startedPlaying = false;
        this.prevSampleL = 0;
        this.prevSampleR = 0;
        this.smpAccumL = 0;
        this.smpAccumR = 0;
        this.maxSample = -500000;
        this.minSample = 500000
    },readReg: function(a) {
        var b = 0;
        b |= (this.square1.getLengthStatus());
        b |= (this.square2.getLengthStatus() << 1);
        b |= (this.triangle.getLengthStatus() << 2);
        b |= (this.noise.getLengthStatus() << 3);
        b |= (this.dmc.getLengthStatus() << 4);
        b |= (((this.frameIrqActive && this.frameIrqEnabled) ? 1 : 0) << 6);
        b |= (this.dmc.getIrqStatus() << 7);
        this.frameIrqActive = false;
        this.dmc.irqGenerated = false;
        return b & 65535
    },writeReg: function(a, b) {
        if (a >= 16384 && a < 16388) {
            this.square1.writeReg(a, b)
        } else {
            if (a >= 16388 && a < 16392) {
                this.square2.writeReg(a, b)
            } else {
                if (a >= 16392 && a < 16396) {
                    this.triangle.writeReg(a, b)
                } else {
                    if (a >= 16396 && a <= 16399) {
                        this.noise.writeReg(a, b)
                    } else {
                        if (a === 16400) {
                            this.dmc.writeReg(a, b)
                        } else {
                            if (a === 16401) {
                                this.dmc.writeReg(a, b)
                            } else {
                                if (a === 16402) {
                                    this.dmc.writeReg(a, b)
                                } else {
                                    if (a === 16403) {
                                        this.dmc.writeReg(a, b)
                                    } else {
                                        if (a === 16405) {
                                            this.updateChannelEnable(b);
                                            if (b !== 0 && this.initCounter > 0) {
                                                this.initingHardware = true
                                            }
                                            this.dmc.writeReg(a, b)
                                        } else {
                                            if (a === 16407) {
                                                this.countSequence = (b >> 7) & 1;
                                                this.masterFrameCounter = 0;
                                                this.frameIrqActive = false;
                                                if (((b >> 6) & 1) === 0) {
                                                    this.frameIrqEnabled = true
                                                } else {
                                                    this.frameIrqEnabled = false
                                                }
                                                if (this.countSequence === 0) {
                                                    this.frameIrqCounterMax = 4;
                                                    this.derivedFrameCounter = 4
                                                } else {
                                                    this.frameIrqCounterMax = 5;
                                                    this.derivedFrameCounter = 0;
                                                    this.frameCounterTick()
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },resetCounter: function() {
        if (this.countSequence === 0) {
            this.derivedFrameCounter = 4
        } else {
            this.derivedFrameCounter = 0
        }
    },updateChannelEnable: function(a) {
        this.channelEnableValue = a & 65535;
        this.square1.setEnabled((a & 1) !== 0);
        this.square2.setEnabled((a & 2) !== 0);
        this.triangle.setEnabled((a & 4) !== 0);
        this.noise.setEnabled((a & 8) !== 0);
        this.dmc.setEnabled((a & 16) !== 0)
    },clockFrameCounter: function(h) {
        if (this.initCounter > 0) {
            if (this.initingHardware) {
                this.initCounter -= h;
                if (this.initCounter <= 0) {
                    this.initingHardware = false
                }
                return
            }
        }
        h += this.extraCycles;
        var e = this.sampleTimerMax - this.sampleTimer;
        if ((h << 10) > e) {
            this.extraCycles = ((h << 10) - e) >> 10;
            h -= this.extraCycles
        } else {
            this.extraCycles = 0
        }
        var f = this.dmc;
        var g = this.triangle;
        var d = this.square1;
        var c = this.square2;
        var b = this.noise;
        if (f.isEnabled) {
            f.shiftCounter -= (h << 3);
            while (f.shiftCounter <= 0 && f.dmaFrequency > 0) {
                f.shiftCounter += f.dmaFrequency;
                f.clockDmc()
            }
        }
        if (g.progTimerMax > 0) {
            g.progTimerCount -= h;
            while (g.progTimerCount <= 0) {
                g.progTimerCount += g.progTimerMax + 1;
                if (g.linearCounter > 0 && g.lengthCounter > 0) {
                    g.triangleCounter++;
                    g.triangleCounter &= 31;
                    if (g.isEnabled) {
                        if (g.triangleCounter >= 16) {
                            g.sampleValue = (g.triangleCounter & 15)
                        } else {
                            g.sampleValue = (15 - (g.triangleCounter & 15))
                        }
                        g.sampleValue <<= 4
                    }
                }
            }
        }
        d.progTimerCount -= h;
        if (d.progTimerCount <= 0) {
            d.progTimerCount += (d.progTimerMax + 1) << 1;
            d.squareCounter++;
            d.squareCounter &= 7;
            d.updateSampleValue()
        }
        c.progTimerCount -= h;
        if (c.progTimerCount <= 0) {
            c.progTimerCount += (c.progTimerMax + 1) << 1;
            c.squareCounter++;
            c.squareCounter &= 7;
            c.updateSampleValue()
        }
        var a = h;
        if (b.progTimerCount - a > 0) {
            b.progTimerCount -= a;
            b.accCount += a;
            b.accValue += a * b.sampleValue
        } else {
            while ((a--) > 0) {
                if (--b.progTimerCount <= 0 && b.progTimerMax > 0) {
                    b.shiftReg <<= 1;
                    b.tmp = (((b.shiftReg << (b.randomMode === 0 ? 1 : 6)) ^ b.shiftReg) & 32768);
                    if (b.tmp !== 0) {
                        b.shiftReg |= 1;
                        b.randomBit = 0;
                        b.sampleValue = 0
                    } else {
                        b.randomBit = 1;
                        if (b.isEnabled && b.lengthCounter > 0) {
                            b.sampleValue = b.masterVolume
                        } else {
                            b.sampleValue = 0
                        }
                    }
                    b.progTimerCount += b.progTimerMax
                }
                b.accValue += b.sampleValue;
                b.accCount++
            }
        }
        if (this.frameIrqEnabled && this.frameIrqActive) {
            this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NORMAL)
        }
        this.masterFrameCounter += (h << 1);
        if (this.masterFrameCounter >= this.frameTime) {
            this.masterFrameCounter -= this.frameTime;
            this.frameCounterTick()
        }
        this.accSample(h);
        this.sampleTimer += h << 10;
        if (this.sampleTimer >= this.sampleTimerMax) {
            this.sample();
            this.sampleTimer -= this.sampleTimerMax
        }
    },accSample: function(a) {
        if (this.triangle.sampleCondition) {
            this.triValue = parseInt((this.triangle.progTimerCount << 4) / (this.triangle.progTimerMax + 1), 10);
            if (this.triValue > 16) {
                this.triValue = 16
            }
            if (this.triangle.triangleCounter >= 16) {
                this.triValue = 16 - this.triValue
            }
            this.triValue += this.triangle.sampleValue
        }
        if (a === 2) {
            this.smpTriangle += this.triValue << 1;
            this.smpDmc += this.dmc.sample << 1;
            this.smpSquare1 += this.square1.sampleValue << 1;
            this.smpSquare2 += this.square2.sampleValue << 1;
            this.accCount += 2
        } else {
            if (a === 4) {
                this.smpTriangle += this.triValue << 2;
                this.smpDmc += this.dmc.sample << 2;
                this.smpSquare1 += this.square1.sampleValue << 2;
                this.smpSquare2 += this.square2.sampleValue << 2;
                this.accCount += 4
            } else {
                this.smpTriangle += a * this.triValue;
                this.smpDmc += a * this.dmc.sample;
                this.smpSquare1 += a * this.square1.sampleValue;
                this.smpSquare2 += a * this.square2.sampleValue;
                this.accCount += a
            }
        }
    },frameCounterTick: function() {
        this.derivedFrameCounter++;
        if (this.derivedFrameCounter >= this.frameIrqCounterMax) {
            this.derivedFrameCounter = 0
        }
        if (this.derivedFrameCounter === 1 || this.derivedFrameCounter === 3) {
            this.triangle.clockLengthCounter();
            this.square1.clockLengthCounter();
            this.square2.clockLengthCounter();
            this.noise.clockLengthCounter();
            this.square1.clockSweep();
            this.square2.clockSweep()
        }
        if (this.derivedFrameCounter >= 0 && this.derivedFrameCounter < 4) {
            this.square1.clockEnvDecay();
            this.square2.clockEnvDecay();
            this.noise.clockEnvDecay();
            this.triangle.clockLinearCounter()
        }
        if (this.derivedFrameCounter === 3 && this.countSequence === 0) {
            this.frameIrqActive = true
        }
    },sample: function() {
        var g, c;
        if (this.accCount > 0) {
            this.smpSquare1 <<= 4;
            this.smpSquare1 = parseInt(this.smpSquare1 / this.accCount, 10);
            this.smpSquare2 <<= 4;
            this.smpSquare2 = parseInt(this.smpSquare2 / this.accCount, 10);
            this.smpTriangle = parseInt(this.smpTriangle / this.accCount, 10);
            this.smpDmc <<= 4;
            this.smpDmc = parseInt(this.smpDmc / this.accCount, 10);
            this.accCount = 0
        } else {
            this.smpSquare1 = this.square1.sampleValue << 4;
            this.smpSquare2 = this.square2.sampleValue << 4;
            this.smpTriangle = this.triangle.sampleValue;
            this.smpDmc = this.dmc.sample << 4
        }
        var d = parseInt((this.noise.accValue << 4) / this.noise.accCount, 10);
        this.noise.accValue = d >> 4;
        this.noise.accCount = 1;
        g = (this.smpSquare1 * this.stereoPosLSquare1 + this.smpSquare2 * this.stereoPosLSquare2) >> 8;
        c = (3 * this.smpTriangle * this.stereoPosLTriangle + (d << 1) * this.stereoPosLNoise + this.smpDmc * this.stereoPosLDMC) >> 8;
        if (g >= this.square_table.length) {
            g = this.square_table.length - 1
        }
        if (c >= this.tnd_table.length) {
            c = this.tnd_table.length - 1
        }
        var b = this.square_table[g] + this.tnd_table[c] - this.dcValue;
        g = (this.smpSquare1 * this.stereoPosRSquare1 + this.smpSquare2 * this.stereoPosRSquare2) >> 8;
        c = (3 * this.smpTriangle * this.stereoPosRTriangle + (d << 1) * this.stereoPosRNoise + this.smpDmc * this.stereoPosRDMC) >> 8;
        if (g >= this.square_table.length) {
            g = this.square_table.length - 1
        }
        if (c >= this.tnd_table.length) {
            c = this.tnd_table.length - 1
        }
        var f = this.square_table[g] + this.tnd_table[c] - this.dcValue;
        var e = b - this.prevSampleL;
        this.prevSampleL += e;
        this.smpAccumL += e - (this.smpAccumL >> 10);
        b = this.smpAccumL;
        var a = f - this.prevSampleR;
        this.prevSampleR += a;
        this.smpAccumR += a - (this.smpAccumR >> 10);
        f = this.smpAccumR;
        if (b > this.maxSample) {
            this.maxSample = b
        }
        if (b < this.minSample) {
            this.minSample = b
        }
        this.sampleBuffer[this.bufferIndex++] = b;
        this.sampleBuffer[this.bufferIndex++] = f;
        if (this.bufferIndex === this.sampleBuffer.length) {
            this.sampleBuffer = new Array(this.bufferSize * 2);
            this.bufferIndex = 0
        }
        this.smpSquare1 = 0;
        this.smpSquare2 = 0;
        this.smpTriangle = 0;
        this.smpDmc = 0
    },getLengthMax: function(a) {
        return this.lengthLookup[a >> 3]
    },getDmcFrequency: function(a) {
        if (a >= 0 && a < 16) {
            return this.dmcFreqLookup[a]
        }
        return 0
    },getNoiseWaveLength: function(a) {
        if (a >= 0 && a < 16) {
            return this.noiseWavelengthLookup[a]
        }
        return 0
    },setPanning: function(b) {
        for (var a = 0; a < 5; a++) {
            this.panning[a] = b[a]
        }
        this.updateStereoPos()
    },setMasterVolume: function(a) {
        if (a < 0) {
            a = 0
        }
        if (a > 256) {
            a = 256
        }
        this.masterVolume = a;
        this.updateStereoPos()
    },updateStereoPos: function() {
        this.stereoPosLSquare1 = (this.panning[0] * this.masterVolume) >> 8;
        this.stereoPosLSquare2 = (this.panning[1] * this.masterVolume) >> 8;
        this.stereoPosLTriangle = (this.panning[2] * this.masterVolume) >> 8;
        this.stereoPosLNoise = (this.panning[3] * this.masterVolume) >> 8;
        this.stereoPosLDMC = (this.panning[4] * this.masterVolume) >> 8;
        this.stereoPosRSquare1 = this.masterVolume - this.stereoPosLSquare1;
        this.stereoPosRSquare2 = this.masterVolume - this.stereoPosLSquare2;
        this.stereoPosRTriangle = this.masterVolume - this.stereoPosLTriangle;
        this.stereoPosRNoise = this.masterVolume - this.stereoPosLNoise;
        this.stereoPosRDMC = this.masterVolume - this.stereoPosLDMC
    },initLengthLookup: function() {
        this.lengthLookup = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30]
    },initDmcFrequencyLookup: function() {
        this.dmcFreqLookup = new Array(16);
        this.dmcFreqLookup[0] = 3424;
        this.dmcFreqLookup[1] = 3040;
        this.dmcFreqLookup[2] = 2720;
        this.dmcFreqLookup[3] = 2560;
        this.dmcFreqLookup[4] = 2288;
        this.dmcFreqLookup[5] = 2032;
        this.dmcFreqLookup[6] = 1808;
        this.dmcFreqLookup[7] = 1712;
        this.dmcFreqLookup[8] = 1520;
        this.dmcFreqLookup[9] = 1280;
        this.dmcFreqLookup[10] = 1136;
        this.dmcFreqLookup[11] = 1024;
        this.dmcFreqLookup[12] = 848;
        this.dmcFreqLookup[13] = 672;
        this.dmcFreqLookup[14] = 576;
        this.dmcFreqLookup[15] = 432
    },initNoiseWavelengthLookup: function() {
        this.noiseWavelengthLookup = new Array(16);
        this.noiseWavelengthLookup[0] = 4;
        this.noiseWavelengthLookup[1] = 8;
        this.noiseWavelengthLookup[2] = 16;
        this.noiseWavelengthLookup[3] = 32;
        this.noiseWavelengthLookup[4] = 64;
        this.noiseWavelengthLookup[5] = 96;
        this.noiseWavelengthLookup[6] = 128;
        this.noiseWavelengthLookup[7] = 160;
        this.noiseWavelengthLookup[8] = 202;
        this.noiseWavelengthLookup[9] = 254;
        this.noiseWavelengthLookup[10] = 380;
        this.noiseWavelengthLookup[11] = 508;
        this.noiseWavelengthLookup[12] = 762;
        this.noiseWavelengthLookup[13] = 1016;
        this.noiseWavelengthLookup[14] = 2034;
        this.noiseWavelengthLookup[15] = 4068
    },initDACtables: function() {
        var e, b, c;
        var a = 0;
        var d = 0;
        this.square_table = new Array(32 * 16);
        this.tnd_table = new Array(204 * 16);
        for (c = 0; c < 32 * 16; c++) {
            e = 95.52 / (8128 / (c / 16) + 100);
            e *= 0.98411;
            e *= 50000;
            b = parseInt(e, 10);
            this.square_table[c] = b;
            if (b > a) {
                a = b
            }
        }
        for (c = 0; c < 204 * 16; c++) {
            e = 163.67 / (24329 / (c / 16) + 100);
            e *= 0.98411;
            e *= 50000;
            b = parseInt(e, 10);
            this.tnd_table[c] = b;
            if (b > d) {
                d = b
            }
        }
        this.dacRange = a + d;
        this.dcValue = this.dacRange / 2
    }};
JSNES.PAPU.ChannelDM = function(a) {
    this.papu = a;
    this.MODE_NORMAL = 0;
    this.MODE_LOOP = 1;
    this.MODE_IRQ = 2;
    this.isEnabled = null;
    this.hasSample = null;
    this.irqGenerated = false;
    this.playMode = null;
    this.dmaFrequency = null;
    this.dmaCounter = null;
    this.deltaCounter = null;
    this.playStartAddress = null;
    this.playAddress = null;
    this.playLength = null;
    this.playLengthCounter = null;
    this.shiftCounter = null;
    this.reg4012 = null;
    this.reg4013 = null;
    this.sample = null;
    this.dacLsb = null;
    this.data = null;
    this.reset()
};
JSNES.PAPU.ChannelDM.prototype = {clockDmc: function() {
        if (this.hasSample) {
            if ((this.data & 1) === 0) {
                if (this.deltaCounter > 0) {
                    this.deltaCounter--
                }
            } else {
                if (this.deltaCounter < 63) {
                    this.deltaCounter++
                }
            }
            this.sample = this.isEnabled ? (this.deltaCounter << 1) + this.dacLsb : 0;
            this.data >>= 1
        }
        this.dmaCounter--;
        if (this.dmaCounter <= 0) {
            this.hasSample = false;
            this.endOfSample();
            this.dmaCounter = 8
        }
        if (this.irqGenerated) {
            this.papu.nes.cpu.requestIrq(this.papu.nes.cpu.IRQ_NORMAL)
        }
    },endOfSample: function() {
        if (this.playLengthCounter === 0 && this.playMode === this.MODE_LOOP) {
            this.playAddress = this.playStartAddress;
            this.playLengthCounter = this.playLength
        }
        if (this.playLengthCounter > 0) {
            this.nextSample();
            if (this.playLengthCounter === 0) {
                if (this.playMode === this.MODE_IRQ) {
                    this.irqGenerated = true
                }
            }
        }
    },nextSample: function() {
        this.data = this.papu.nes.mmap.load(this.playAddress);
        this.papu.nes.cpu.haltCycles(4);
        this.playLengthCounter--;
        this.playAddress++;
        if (this.playAddress > 65535) {
            this.playAddress = 32768
        }
        this.hasSample = true
    },writeReg: function(a, b) {
        if (a === 16400) {
            if ((b >> 6) === 0) {
                this.playMode = this.MODE_NORMAL
            } else {
                if (((b >> 6) & 1) === 1) {
                    this.playMode = this.MODE_LOOP
                } else {
                    if ((b >> 6) === 2) {
                        this.playMode = this.MODE_IRQ
                    }
                }
            }
            if ((b & 128) === 0) {
                this.irqGenerated = false
            }
            this.dmaFrequency = this.papu.getDmcFrequency(b & 15)
        } else {
            if (a === 16401) {
                this.deltaCounter = (b >> 1) & 63;
                this.dacLsb = b & 1;
                this.sample = ((this.deltaCounter << 1) + this.dacLsb)
            } else {
                if (a === 16402) {
                    this.playStartAddress = (b << 6) | 49152;
                    this.playAddress = this.playStartAddress;
                    this.reg4012 = b
                } else {
                    if (a === 16403) {
                        this.playLength = (b << 4) + 1;
                        this.playLengthCounter = this.playLength;
                        this.reg4013 = b
                    } else {
                        if (a === 16405) {
                            if (((b >> 4) & 1) === 0) {
                                this.playLengthCounter = 0
                            } else {
                                this.playAddress = this.playStartAddress;
                                this.playLengthCounter = this.playLength
                            }
                            this.irqGenerated = false
                        }
                    }
                }
            }
        }
    },setEnabled: function(a) {
        if ((!this.isEnabled) && a) {
            this.playLengthCounter = this.playLength
        }
        this.isEnabled = a
    },getLengthStatus: function() {
        return ((this.playLengthCounter === 0 || !this.isEnabled) ? 0 : 1)
    },getIrqStatus: function() {
        return (this.irqGenerated ? 1 : 0)
    },reset: function() {
        this.isEnabled = false;
        this.irqGenerated = false;
        this.playMode = this.MODE_NORMAL;
        this.dmaFrequency = 0;
        this.dmaCounter = 0;
        this.deltaCounter = 0;
        this.playStartAddress = 0;
        this.playAddress = 0;
        this.playLength = 0;
        this.playLengthCounter = 0;
        this.sample = 0;
        this.dacLsb = 0;
        this.shiftCounter = 0;
        this.reg4012 = 0;
        this.reg4013 = 0;
        this.data = 0
    }};
JSNES.PAPU.ChannelNoise = function(a) {
    this.papu = a;
    this.isEnabled = null;
    this.envDecayDisable = null;
    this.envDecayLoopEnable = null;
    this.lengthCounterEnable = null;
    this.envReset = null;
    this.shiftNow = null;
    this.lengthCounter = null;
    this.progTimerCount = null;
    this.progTimerMax = null;
    this.envDecayRate = null;
    this.envDecayCounter = null;
    this.envVolume = null;
    this.masterVolume = null;
    this.shiftReg = 1 << 14;
    this.randomBit = null;
    this.randomMode = null;
    this.sampleValue = null;
    this.accValue = 0;
    this.accCount = 1;
    this.tmp = null;
    this.reset()
};
JSNES.PAPU.ChannelNoise.prototype = {reset: function() {
        this.progTimerCount = 0;
        this.progTimerMax = 0;
        this.isEnabled = false;
        this.lengthCounter = 0;
        this.lengthCounterEnable = false;
        this.envDecayDisable = false;
        this.envDecayLoopEnable = false;
        this.shiftNow = false;
        this.envDecayRate = 0;
        this.envDecayCounter = 0;
        this.envVolume = 0;
        this.masterVolume = 0;
        this.shiftReg = 1;
        this.randomBit = 0;
        this.randomMode = 0;
        this.sampleValue = 0;
        this.tmp = 0
    },clockLengthCounter: function() {
        if (this.lengthCounterEnable && this.lengthCounter > 0) {
            this.lengthCounter--;
            if (this.lengthCounter === 0) {
                this.updateSampleValue()
            }
        }
    },clockEnvDecay: function() {
        if (this.envReset) {
            this.envReset = false;
            this.envDecayCounter = this.envDecayRate + 1;
            this.envVolume = 15
        } else {
            if (--this.envDecayCounter <= 0) {
                this.envDecayCounter = this.envDecayRate + 1;
                if (this.envVolume > 0) {
                    this.envVolume--
                } else {
                    this.envVolume = this.envDecayLoopEnable ? 15 : 0
                }
            }
        }
        this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
        this.updateSampleValue()
    },updateSampleValue: function() {
        if (this.isEnabled && this.lengthCounter > 0) {
            this.sampleValue = this.randomBit * this.masterVolume
        }
    },writeReg: function(a, b) {
        if (a === 16396) {
            this.envDecayDisable = ((b & 16) !== 0);
            this.envDecayRate = b & 15;
            this.envDecayLoopEnable = ((b & 32) !== 0);
            this.lengthCounterEnable = ((b & 32) === 0);
            this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume
        } else {
            if (a === 16398) {
                this.progTimerMax = this.papu.getNoiseWaveLength(b & 15);
                this.randomMode = b >> 7
            } else {
                if (a === 16399) {
                    this.lengthCounter = this.papu.getLengthMax(b & 248);
                    this.envReset = true
                }
            }
        }
    },setEnabled: function(a) {
        this.isEnabled = a;
        if (!a) {
            this.lengthCounter = 0
        }
        this.updateSampleValue()
    },getLengthStatus: function() {
        return ((this.lengthCounter === 0 || !this.isEnabled) ? 0 : 1)
    }};
JSNES.PAPU.ChannelSquare = function(b, a) {
    this.papu = b;
    this.dutyLookup = [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1];
    this.impLookup = [1, -1, 0, 0, 0, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0];
    this.sqr1 = a;
    this.isEnabled = null;
    this.lengthCounterEnable = null;
    this.sweepActive = null;
    this.envDecayDisable = null;
    this.envDecayLoopEnable = null;
    this.envReset = null;
    this.sweepCarry = null;
    this.updateSweepPeriod = null;
    this.progTimerCount = null;
    this.progTimerMax = null;
    this.lengthCounter = null;
    this.squareCounter = null;
    this.sweepCounter = null;
    this.sweepCounterMax = null;
    this.sweepMode = null;
    this.sweepShiftAmount = null;
    this.envDecayRate = null;
    this.envDecayCounter = null;
    this.envVolume = null;
    this.masterVolume = null;
    this.dutyMode = null;
    this.sweepResult = null;
    this.sampleValue = null;
    this.vol = null;
    this.reset()
};
JSNES.PAPU.ChannelSquare.prototype = {reset: function() {
        this.progTimerCount = 0;
        this.progTimerMax = 0;
        this.lengthCounter = 0;
        this.squareCounter = 0;
        this.sweepCounter = 0;
        this.sweepCounterMax = 0;
        this.sweepMode = 0;
        this.sweepShiftAmount = 0;
        this.envDecayRate = 0;
        this.envDecayCounter = 0;
        this.envVolume = 0;
        this.masterVolume = 0;
        this.dutyMode = 0;
        this.vol = 0;
        this.isEnabled = false;
        this.lengthCounterEnable = false;
        this.sweepActive = false;
        this.sweepCarry = false;
        this.envDecayDisable = false;
        this.envDecayLoopEnable = false
    },clockLengthCounter: function() {
        if (this.lengthCounterEnable && this.lengthCounter > 0) {
            this.lengthCounter--;
            if (this.lengthCounter === 0) {
                this.updateSampleValue()
            }
        }
    },clockEnvDecay: function() {
        if (this.envReset) {
            this.envReset = false;
            this.envDecayCounter = this.envDecayRate + 1;
            this.envVolume = 15
        } else {
            if ((--this.envDecayCounter) <= 0) {
                this.envDecayCounter = this.envDecayRate + 1;
                if (this.envVolume > 0) {
                    this.envVolume--
                } else {
                    this.envVolume = this.envDecayLoopEnable ? 15 : 0
                }
            }
        }
        this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
        this.updateSampleValue()
    },clockSweep: function() {
        if (--this.sweepCounter <= 0) {
            this.sweepCounter = this.sweepCounterMax + 1;
            if (this.sweepActive && this.sweepShiftAmount > 0 && this.progTimerMax > 7) {
                this.sweepCarry = false;
                if (this.sweepMode === 0) {
                    this.progTimerMax += (this.progTimerMax >> this.sweepShiftAmount);
                    if (this.progTimerMax > 4095) {
                        this.progTimerMax = 4095;
                        this.sweepCarry = true
                    }
                } else {
                    this.progTimerMax = this.progTimerMax - ((this.progTimerMax >> this.sweepShiftAmount) - (this.sqr1 ? 1 : 0))
                }
            }
        }
        if (this.updateSweepPeriod) {
            this.updateSweepPeriod = false;
            this.sweepCounter = this.sweepCounterMax + 1
        }
    },updateSampleValue: function() {
        if (this.isEnabled && this.lengthCounter > 0 && this.progTimerMax > 7) {
            if (this.sweepMode === 0 && (this.progTimerMax + (this.progTimerMax >> this.sweepShiftAmount)) > 4095) {
                this.sampleValue = 0
            } else {
                this.sampleValue = this.masterVolume * this.dutyLookup[(this.dutyMode << 3) + this.squareCounter]
            }
        } else {
            this.sampleValue = 0
        }
    },writeReg: function(a, b) {
        var c = (this.sqr1 ? 0 : 4);
        if (a === 16384 + c) {
            this.envDecayDisable = ((b & 16) !== 0);
            this.envDecayRate = b & 15;
            this.envDecayLoopEnable = ((b & 32) !== 0);
            this.dutyMode = (b >> 6) & 3;
            this.lengthCounterEnable = ((b & 32) === 0);
            this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
            this.updateSampleValue()
        } else {
            if (a === 16385 + c) {
                this.sweepActive = ((b & 128) !== 0);
                this.sweepCounterMax = ((b >> 4) & 7);
                this.sweepMode = (b >> 3) & 1;
                this.sweepShiftAmount = b & 7;
                this.updateSweepPeriod = true
            } else {
                if (a === 16386 + c) {
                    this.progTimerMax &= 1792;
                    this.progTimerMax |= b
                } else {
                    if (a === 16387 + c) {
                        this.progTimerMax &= 255;
                        this.progTimerMax |= ((b & 7) << 8);
                        if (this.isEnabled) {
                            this.lengthCounter = this.papu.getLengthMax(b & 248)
                        }
                        this.envReset = true
                    }
                }
            }
        }
    },setEnabled: function(a) {
        this.isEnabled = a;
        if (!a) {
            this.lengthCounter = 0
        }
        this.updateSampleValue()
    },getLengthStatus: function() {
        return ((this.lengthCounter === 0 || !this.isEnabled) ? 0 : 1)
    }};
JSNES.PAPU.ChannelTriangle = function(a) {
    this.papu = a;
    this.isEnabled = null;
    this.sampleCondition = null;
    this.lengthCounterEnable = null;
    this.lcHalt = null;
    this.lcControl = null;
    this.progTimerCount = null;
    this.progTimerMax = null;
    this.triangleCounter = null;
    this.lengthCounter = null;
    this.linearCounter = null;
    this.lcLoadValue = null;
    this.sampleValue = null;
    this.tmp = null;
    this.reset()
};
JSNES.PAPU.ChannelTriangle.prototype = {reset: function() {
        this.progTimerCount = 0;
        this.progTimerMax = 0;
        this.triangleCounter = 0;
        this.isEnabled = false;
        this.sampleCondition = false;
        this.lengthCounter = 0;
        this.lengthCounterEnable = false;
        this.linearCounter = 0;
        this.lcLoadValue = 0;
        this.lcHalt = true;
        this.lcControl = false;
        this.tmp = 0;
        this.sampleValue = 15
    },clockLengthCounter: function() {
        if (this.lengthCounterEnable && this.lengthCounter > 0) {
            this.lengthCounter--;
            if (this.lengthCounter === 0) {
                this.updateSampleCondition()
            }
        }
    },clockLinearCounter: function() {
        if (this.lcHalt) {
            this.linearCounter = this.lcLoadValue;
            this.updateSampleCondition()
        } else {
            if (this.linearCounter > 0) {
                this.linearCounter--;
                this.updateSampleCondition()
            }
        }
        if (!this.lcControl) {
            this.lcHalt = false
        }
    },getLengthStatus: function() {
        return ((this.lengthCounter === 0 || !this.isEnabled) ? 0 : 1)
    },readReg: function(a) {
        return 0
    },writeReg: function(a, b) {
        if (a === 16392) {
            this.lcControl = (b & 128) !== 0;
            this.lcLoadValue = b & 127;
            this.lengthCounterEnable = !this.lcControl
        } else {
            if (a === 16394) {
                this.progTimerMax &= 1792;
                this.progTimerMax |= b
            } else {
                if (a === 16395) {
                    this.progTimerMax &= 255;
                    this.progTimerMax |= ((b & 7) << 8);
                    this.lengthCounter = this.papu.getLengthMax(b & 248);
                    this.lcHalt = true
                }
            }
        }
        this.updateSampleCondition()
    },clockProgrammableTimer: function(a) {
        if (this.progTimerMax > 0) {
            this.progTimerCount += a;
            while (this.progTimerMax > 0 && this.progTimerCount >= this.progTimerMax) {
                this.progTimerCount -= this.progTimerMax;
                if (this.isEnabled && this.lengthCounter > 0 && this.linearCounter > 0) {
                    this.clockTriangleGenerator()
                }
            }
        }
    },clockTriangleGenerator: function() {
        this.triangleCounter++;
        this.triangleCounter &= 31
    },setEnabled: function(a) {
        this.isEnabled = a;
        if (!a) {
            this.lengthCounter = 0
        }
        this.updateSampleCondition()
    },updateSampleCondition: function() {
        this.sampleCondition = this.isEnabled && this.progTimerMax > 7 && this.linearCounter > 0 && this.lengthCounter > 0
    }};
JSNES.PPU = function(a) {
    this.nes = a;
    this.vramMem = null;
    this.spriteMem = null;
    this.vramAddress = null;
    this.vramTmpAddress = null;
    this.vramBufferedReadValue = null;
    this.firstWrite = null;
    this.sramAddress = null;
    this.currentMirroring = null;
    this.requestEndFrame = null;
    this.nmiOk = null;
    this.dummyCycleToggle = null;
    this.validTileData = null;
    this.nmiCounter = null;
    this.scanlineAlreadyRendered = null;
    this.f_nmiOnVblank = null;
    this.f_spriteSize = null;
    this.f_bgPatternTable = null;
    this.f_spPatternTable = null;
    this.f_addrInc = null;
    this.f_nTblAddress = null;
    this.f_color = null;
    this.f_spVisibility = null;
    this.f_bgVisibility = null;
    this.f_spClipping = null;
    this.f_bgClipping = null;
    this.f_dispType = null;
    this.cntFV = null;
    this.cntV = null;
    this.cntH = null;
    this.cntVT = null;
    this.cntHT = null;
    this.regFV = null;
    this.regV = null;
    this.regH = null;
    this.regVT = null;
    this.regHT = null;
    this.regFH = null;
    this.regS = null;
    this.curNt = null;
    this.attrib = null;
    this.buffer = null;
    this.prevBuffer = null;
    this.bgbuffer = null;
    this.pixrendered = null;
    this.validTileData = null;
    this.scantile = null;
    this.scanline = null;
    this.lastRenderedScanline = null;
    this.curX = null;
    this.sprX = null;
    this.sprY = null;
    this.sprTile = null;
    this.sprCol = null;
    this.vertFlip = null;
    this.horiFlip = null;
    this.bgPriority = null;
    this.spr0HitX = null;
    this.spr0HitY = null;
    this.hitSpr0 = null;
    this.sprPalette = null;
    this.imgPalette = null;
    this.ptTile = null;
    this.ntable1 = null;
    this.currentMirroring = null;
    this.nameTable = null;
    this.vramMirrorTable = null;
    this.palTable = null;
    this.showSpr0Hit = false;
    this.clipToTvSize = true;
    this.reset()
};
JSNES.PPU.prototype = {STATUS_VRAMWRITE: 4,STATUS_SLSPRITECOUNT: 5,STATUS_SPRITE0HIT: 6,STATUS_VBLANK: 7,reset: function() {
        var a;
        this.vramMem = new Array(32768);
        this.spriteMem = new Array(256);
        for (a = 0; a < this.vramMem.length; a++) {
            this.vramMem[a] = 0
        }
        for (a = 0; a < this.spriteMem.length; a++) {
            this.spriteMem[a] = 0
        }
        this.vramAddress = null;
        this.vramTmpAddress = null;
        this.vramBufferedReadValue = 0;
        this.firstWrite = true;
        this.sramAddress = 0;
        this.currentMirroring = -1;
        this.requestEndFrame = false;
        this.nmiOk = false;
        this.dummyCycleToggle = false;
        this.validTileData = false;
        this.nmiCounter = 0;
        this.scanlineAlreadyRendered = null;
        this.f_nmiOnVblank = 0;
        this.f_spriteSize = 0;
        this.f_bgPatternTable = 0;
        this.f_spPatternTable = 0;
        this.f_addrInc = 0;
        this.f_nTblAddress = 0;
        this.f_color = 0;
        this.f_spVisibility = 0;
        this.f_bgVisibility = 0;
        this.f_spClipping = 0;
        this.f_bgClipping = 0;
        this.f_dispType = 0;
        this.cntFV = 0;
        this.cntV = 0;
        this.cntH = 0;
        this.cntVT = 0;
        this.cntHT = 0;
        this.regFV = 0;
        this.regV = 0;
        this.regH = 0;
        this.regVT = 0;
        this.regHT = 0;
        this.regFH = 0;
        this.regS = 0;
        this.curNt = null;
        this.attrib = new Array(32);
        this.buffer = new Array(256 * 240);
        this.prevBuffer = new Array(256 * 240);
        this.bgbuffer = new Array(256 * 240);
        this.pixrendered = new Array(256 * 240);
        this.validTileData = null;
        this.scantile = new Array(32);
        this.scanline = 0;
        this.lastRenderedScanline = -1;
        this.curX = 0;
        this.sprX = new Array(64);
        this.sprY = new Array(64);
        this.sprTile = new Array(64);
        this.sprCol = new Array(64);
        this.vertFlip = new Array(64);
        this.horiFlip = new Array(64);
        this.bgPriority = new Array(64);
        this.spr0HitX = 0;
        this.spr0HitY = 0;
        this.hitSpr0 = false;
        this.sprPalette = new Array(16);
        this.imgPalette = new Array(16);
        this.ptTile = new Array(512);
        for (a = 0; a < 512; a++) {
            this.ptTile[a] = new JSNES.PPU.Tile()
        }
        this.ntable1 = new Array(4);
        this.currentMirroring = -1;
        this.nameTable = new Array(4);
        for (a = 0; a < 4; a++) {
            this.nameTable[a] = new JSNES.PPU.NameTable(32, 32, "Nt" + a)
        }
        this.vramMirrorTable = new Array(32768);
        for (a = 0; a < 32768; a++) {
            this.vramMirrorTable[a] = a
        }
        this.palTable = new JSNES.PPU.PaletteTable();
        this.palTable.loadNTSCPalette();
        this.updateControlReg1(0);
        this.updateControlReg2(0)
    },setMirroring: function(b) {
        if (b == this.currentMirroring) {
            return
        }
        this.currentMirroring = b;
        this.triggerRendering();
        if (this.vramMirrorTable === null) {
            this.vramMirrorTable = new Array(32768)
        }
        for (var a = 0; a < 32768; a++) {
            this.vramMirrorTable[a] = a
        }
        this.defineMirrorRegion(16160, 16128, 32);
        this.defineMirrorRegion(16192, 16128, 32);
        this.defineMirrorRegion(16256, 16128, 32);
        this.defineMirrorRegion(16320, 16128, 32);
        this.defineMirrorRegion(12288, 8192, 3840);
        this.defineMirrorRegion(16384, 0, 16384);
        if (b == this.nes.rom.HORIZONTAL_MIRRORING) {
            this.ntable1[0] = 0;
            this.ntable1[1] = 0;
            this.ntable1[2] = 1;
            this.ntable1[3] = 1;
            this.defineMirrorRegion(9216, 8192, 1024);
            this.defineMirrorRegion(11264, 10240, 1024)
        } else {
            if (b == this.nes.rom.VERTICAL_MIRRORING) {
                this.ntable1[0] = 0;
                this.ntable1[1] = 1;
                this.ntable1[2] = 0;
                this.ntable1[3] = 1;
                this.defineMirrorRegion(10240, 8192, 1024);
                this.defineMirrorRegion(11264, 9216, 1024)
            } else {
                if (b == this.nes.rom.SINGLESCREEN_MIRRORING) {
                    this.ntable1[0] = 0;
                    this.ntable1[1] = 0;
                    this.ntable1[2] = 0;
                    this.ntable1[3] = 0;
                    this.defineMirrorRegion(9216, 8192, 1024);
                    this.defineMirrorRegion(10240, 8192, 1024);
                    this.defineMirrorRegion(11264, 8192, 1024)
                } else {
                    if (b == this.nes.rom.SINGLESCREEN_MIRRORING2) {
                        this.ntable1[0] = 1;
                        this.ntable1[1] = 1;
                        this.ntable1[2] = 1;
                        this.ntable1[3] = 1;
                        this.defineMirrorRegion(9216, 9216, 1024);
                        this.defineMirrorRegion(10240, 9216, 1024);
                        this.defineMirrorRegion(11264, 9216, 1024)
                    } else {
                        this.ntable1[0] = 0;
                        this.ntable1[1] = 1;
                        this.ntable1[2] = 2;
                        this.ntable1[3] = 3
                    }
                }
            }
        }
    },defineMirrorRegion: function(a, d, c) {
        for (var b = 0; b < c; b++) {
            this.vramMirrorTable[a + b] = d + b
        }
    },startVBlank: function() {
        this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NMI);
        if (this.lastRenderedScanline < 239) {
            this.renderFramePartially(this.lastRenderedScanline + 1, 240 - this.lastRenderedScanline)
        }
        this.endFrame();
        this.lastRenderedScanline = -1
    },endScanline: function() {
        switch (this.scanline) {
            case 19:
                if (this.dummyCycleToggle) {
                    this.curX = 1;
                    this.dummyCycleToggle = !this.dummyCycleToggle
                }
                break;
            case 20:
                this.setStatusFlag(this.STATUS_VBLANK, false);
                this.setStatusFlag(this.STATUS_SPRITE0HIT, false);
                this.hitSpr0 = false;
                this.spr0HitX = -1;
                this.spr0HitY = -1;
                if (this.f_bgVisibility == 1 || this.f_spVisibility == 1) {
                    this.cntFV = this.regFV;
                    this.cntV = this.regV;
                    this.cntH = this.regH;
                    this.cntVT = this.regVT;
                    this.cntHT = this.regHT;
                    if (this.f_bgVisibility == 1) {
                        this.renderBgScanline(false, 0)
                    }
                }
                if (this.f_bgVisibility == 1 && this.f_spVisibility == 1) {
                    this.checkSprite0(0)
                }
                if (this.f_bgVisibility == 1 || this.f_spVisibility == 1) {
                    this.nes.mmap.clockIrqCounter()
                }
                break;
            case 261:
                this.setStatusFlag(this.STATUS_VBLANK, true);
                this.requestEndFrame = true;
                this.nmiCounter = 9;
                this.scanline = -1;
                break;
            default:
                if (this.scanline >= 21 && this.scanline <= 260) {
                    if (this.f_bgVisibility == 1) {
                        if (!this.scanlineAlreadyRendered) {
                            this.cntHT = this.regHT;
                            this.cntH = this.regH;
                            this.renderBgScanline(true, this.scanline + 1 - 21)
                        }
                        this.scanlineAlreadyRendered = false;
                        if (!this.hitSpr0 && this.f_spVisibility == 1) {
                            if (this.sprX[0] >= -7 && this.sprX[0] < 256 && this.sprY[0] + 1 <= (this.scanline - 20) && (this.sprY[0] + 1 + (this.f_spriteSize === 0 ? 8 : 16)) >= (this.scanline - 20)) {
                                if (this.checkSprite0(this.scanline - 20)) {
                                    this.hitSpr0 = true
                                }
                            }
                        }
                    }
                    if (this.f_bgVisibility == 1 || this.f_spVisibility == 1) {
                        this.nes.mmap.clockIrqCounter()
                    }
                }
        }
        this.scanline++;
        this.regsToAddress();
        this.cntsToAddress()
    },startFrame: function() {
        var d = 0;
        if (this.f_dispType === 0) {
            d = this.imgPalette[0]
        } else {
            switch (this.f_color) {
                case 0:
                    d = 0;
                    break;
                case 1:
                    d = 65280;
                    break;
                case 2:
                    d = 16711680;
                    break;
                case 3:
                    d = 0;
                    break;
                case 4:
                    d = 255;
                    break;
                default:
                    d = 0
            }
        }
        var a = this.buffer;
        var c;
        for (c = 0; c < 256 * 240; c++) {
            a[c] = d
        }
        var b = this.pixrendered;
        for (c = 0; c < b.length; c++) {
            b[c] = 65
        }
    },endFrame: function() {
        var c, a, d;
        var b = this.buffer;
        if (this.showSpr0Hit) {
            if (this.sprX[0] >= 0 && this.sprX[0] < 256 && this.sprY[0] >= 0 && this.sprY[0] < 240) {
                for (c = 0; c < 256; c++) {
                    b[(this.sprY[0] << 8) + c] = 16733525
                }
                for (c = 0; c < 240; c++) {
                    b[(c << 8) + this.sprX[0]] = 16733525
                }
            }
            if (this.spr0HitX >= 0 && this.spr0HitX < 256 && this.spr0HitY >= 0 && this.spr0HitY < 240) {
                for (c = 0; c < 256; c++) {
                    b[(this.spr0HitY << 8) + c] = 5635925
                }
                for (c = 0; c < 240; c++) {
                    b[(c << 8) + this.spr0HitX] = 5635925
                }
            }
        }
        if (this.clipToTvSize || this.f_bgClipping === 0 || this.f_spClipping === 0) {
            for (d = 0; d < 240; d++) {
                for (a = 0; a < 8; a++) {
                    b[(d << 8) + a] = 0
                }
            }
        }
        if (this.clipToTvSize) {
            for (d = 0; d < 240; d++) {
                for (a = 0; a < 8; a++) {
                    b[(d << 8) + 255 - a] = 0
                }
            }
        }
        if (this.clipToTvSize) {
            for (d = 0; d < 8; d++) {
                for (a = 0; a < 256; a++) {
                    b[(d << 8) + a] = 0;
                    b[((239 - d) << 8) + a] = 0
                }
            }
        }
        if (this.nes.opts.showDisplay) {
            this.nes.ui.writeFrame(b, this.prevBuffer)
        }
    },updateControlReg1: function(a) {
        this.triggerRendering();
        this.f_nmiOnVblank = (a >> 7) & 1;
        this.f_spriteSize = (a >> 5) & 1;
        this.f_bgPatternTable = (a >> 4) & 1;
        this.f_spPatternTable = (a >> 3) & 1;
        this.f_addrInc = (a >> 2) & 1;
        this.f_nTblAddress = a & 3;
        this.regV = (a >> 1) & 1;
        this.regH = a & 1;
        this.regS = (a >> 4) & 1
    },updateControlReg2: function(a) {
        this.triggerRendering();
        this.f_color = (a >> 5) & 7;
        this.f_spVisibility = (a >> 4) & 1;
        this.f_bgVisibility = (a >> 3) & 1;
        this.f_spClipping = (a >> 2) & 1;
        this.f_bgClipping = (a >> 1) & 1;
        this.f_dispType = a & 1;
        if (this.f_dispType === 0) {
            this.palTable.setEmphasis(this.f_color)
        }
        this.updatePalettes()
    },setStatusFlag: function(a, b) {
        var c = 1 << a;
        this.nes.cpu.mem[8194] = ((this.nes.cpu.mem[8194] & (255 - c)) | (b ? c : 0))
    },readStatusRegister: function() {
        var a = this.nes.cpu.mem[8194];
        this.firstWrite = true;
        this.setStatusFlag(this.STATUS_VBLANK, false);
        return a
    },writeSRAMAddress: function(a) {
        this.sramAddress = a
    },sramLoad: function() {
        return this.spriteMem[this.sramAddress]
    },sramWrite: function(a) {
        this.spriteMem[this.sramAddress] = a;
        this.spriteRamWriteUpdate(this.sramAddress, a);
        this.sramAddress++;
        this.sramAddress %= 256
    },scrollWrite: function(a) {
        this.triggerRendering();
        if (this.firstWrite) {
            this.regHT = (a >> 3) & 31;
            this.regFH = a & 7
        } else {
            this.regFV = a & 7;
            this.regVT = (a >> 3) & 31
        }
        this.firstWrite = !this.firstWrite
    },writeVRAMAddress: function(a) {
        if (this.firstWrite) {
            this.regFV = (a >> 4) & 3;
            this.regV = (a >> 3) & 1;
            this.regH = (a >> 2) & 1;
            this.regVT = (this.regVT & 7) | ((a & 3) << 3)
        } else {
            this.triggerRendering();
            this.regVT = (this.regVT & 24) | ((a >> 5) & 7);
            this.regHT = a & 31;
            this.cntFV = this.regFV;
            this.cntV = this.regV;
            this.cntH = this.regH;
            this.cntVT = this.regVT;
            this.cntHT = this.regHT;
            this.checkSprite0(this.scanline - 20)
        }
        this.firstWrite = !this.firstWrite;
        this.cntsToAddress();
        if (this.vramAddress < 8192) {
            this.nes.mmap.latchAccess(this.vramAddress)
        }
    },vramLoad: function() {
        var a;
        this.cntsToAddress();
        this.regsToAddress();
        if (this.vramAddress <= 16127) {
            a = this.vramBufferedReadValue;
            if (this.vramAddress < 8192) {
                this.vramBufferedReadValue = this.vramMem[this.vramAddress]
            } else {
                this.vramBufferedReadValue = this.mirroredLoad(this.vramAddress)
            }
            if (this.vramAddress < 8192) {
                this.nes.mmap.latchAccess(this.vramAddress)
            }
            this.vramAddress += (this.f_addrInc == 1 ? 32 : 1);
            this.cntsFromAddress();
            this.regsFromAddress();
            return a
        }
        a = this.mirroredLoad(this.vramAddress);
        this.vramAddress += (this.f_addrInc == 1 ? 32 : 1);
        this.cntsFromAddress();
        this.regsFromAddress();
        return a
    },vramWrite: function(a) {
        this.triggerRendering();
        this.cntsToAddress();
        this.regsToAddress();
        if (this.vramAddress >= 8192) {
            this.mirroredWrite(this.vramAddress, a)
        } else {
            this.writeMem(this.vramAddress, a);
            this.nes.mmap.latchAccess(this.vramAddress)
        }
        this.vramAddress += (this.f_addrInc == 1 ? 32 : 1);
        this.regsFromAddress();
        this.cntsFromAddress()
    },sramDMA: function(d) {
        var a = d * 256;
        var c;
        for (var b = this.sramAddress; b < 256; b++) {
            c = this.nes.cpu.mem[a + b];
            this.spriteMem[b] = c;
            this.spriteRamWriteUpdate(b, c)
        }
        this.nes.cpu.haltCycles(513)
    },regsFromAddress: function() {
        var a = (this.vramTmpAddress >> 8) & 255;
        this.regFV = (a >> 4) & 7;
        this.regV = (a >> 3) & 1;
        this.regH = (a >> 2) & 1;
        this.regVT = (this.regVT & 7) | ((a & 3) << 3);
        a = this.vramTmpAddress & 255;
        this.regVT = (this.regVT & 24) | ((a >> 5) & 7);
        this.regHT = a & 31
    },cntsFromAddress: function() {
        var a = (this.vramAddress >> 8) & 255;
        this.cntFV = (a >> 4) & 3;
        this.cntV = (a >> 3) & 1;
        this.cntH = (a >> 2) & 1;
        this.cntVT = (this.cntVT & 7) | ((a & 3) << 3);
        a = this.vramAddress & 255;
        this.cntVT = (this.cntVT & 24) | ((a >> 5) & 7);
        this.cntHT = a & 31
    },regsToAddress: function() {
        var b = (this.regFV & 7) << 4;
        b |= (this.regV & 1) << 3;
        b |= (this.regH & 1) << 2;
        b |= (this.regVT >> 3) & 3;
        var a = (this.regVT & 7) << 5;
        a |= this.regHT & 31;
        this.vramTmpAddress = ((b << 8) | a) & 32767
    },cntsToAddress: function() {
        var b = (this.cntFV & 7) << 4;
        b |= (this.cntV & 1) << 3;
        b |= (this.cntH & 1) << 2;
        b |= (this.cntVT >> 3) & 3;
        var a = (this.cntVT & 7) << 5;
        a |= this.cntHT & 31;
        this.vramAddress = ((b << 8) | a) & 32767
    },incTileCounter: function(b) {
        for (var a = b; a !== 0; a--) {
            this.cntHT++;
            if (this.cntHT == 32) {
                this.cntHT = 0;
                this.cntVT++;
                if (this.cntVT >= 30) {
                    this.cntH++;
                    if (this.cntH == 2) {
                        this.cntH = 0;
                        this.cntV++;
                        if (this.cntV == 2) {
                            this.cntV = 0;
                            this.cntFV++;
                            this.cntFV &= 7
                        }
                    }
                }
            }
        }
    },mirroredLoad: function(a) {
        return this.vramMem[this.vramMirrorTable[a]]
    },mirroredWrite: function(a, b) {
        if (a >= 16128 && a < 16160) {
            if (a == 16128 || a == 16144) {
                this.writeMem(16128, b);
                this.writeMem(16144, b)
            } else {
                if (a == 16132 || a == 16148) {
                    this.writeMem(16132, b);
                    this.writeMem(16148, b)
                } else {
                    if (a == 16136 || a == 16152) {
                        this.writeMem(16136, b);
                        this.writeMem(16152, b)
                    } else {
                        if (a == 16140 || a == 16156) {
                            this.writeMem(16140, b);
                            this.writeMem(16156, b)
                        } else {
                            this.writeMem(a, b)
                        }
                    }
                }
            }
        } else {
            if (a < this.vramMirrorTable.length) {
                this.writeMem(this.vramMirrorTable[a], b)
            } else {
                alert("Invalid VRAM address: " + a.toString(16))
            }
        }
    },triggerRendering: function() {
        if (this.scanline >= 21 && this.scanline <= 260) {
            this.renderFramePartially(this.lastRenderedScanline + 1, this.scanline - 21 - this.lastRenderedScanline);
            this.lastRenderedScanline = this.scanline - 21
        }
    },renderFramePartially: function(h, g) {
        if (this.f_spVisibility == 1) {
            this.renderSpritesPartially(h, g, true)
        }
        if (this.f_bgVisibility == 1) {
            var e = h << 8;
            var f = (h + g) << 8;
            if (f > 61440) {
                f = 61440
            }
            var a = this.buffer;
            var c = this.bgbuffer;
            var b = this.pixrendered;
            for (var d = e; d < f; d++) {
                if (b[d] > 255) {
                    a[d] = c[d]
                }
            }
        }
        if (this.f_spVisibility == 1) {
            this.renderSpritesPartially(h, g, false)
        }
        this.validTileData = false
    },renderBgScanline: function(a, m) {
        var f = (this.regS === 0 ? 0 : 256);
        var q = (m << 8) - this.regFH;
        this.curNt = this.ntable1[this.cntV + this.cntV + this.cntH];
        this.cntHT = this.regHT;
        this.cntH = this.regH;
        this.curNt = this.ntable1[this.cntV + this.cntV + this.cntH];
        if (m < 240 && (m - this.cntFV) >= 0) {
            var u = this.cntFV << 3;
            var d = this.scantile;
            var h = this.attrib;
            var l = this.ptTile;
            var p = this.nameTable;
            var c = this.imgPalette;
            var b = this.pixrendered;
            var g = a ? this.bgbuffer : this.buffer;
            var k, i, o, e;
            for (var r = 0; r < 32; r++) {
                if (m >= 0) {
                    if (this.validTileData) {
                        k = d[r];
                        i = k.pix;
                        o = h[r]
                    } else {
                        k = l[f + p[this.curNt].getTileIndex(this.cntHT, this.cntVT)];
                        i = k.pix;
                        o = p[this.curNt].getAttrib(this.cntHT, this.cntVT);
                        d[r] = k;
                        h[r] = o
                    }
                    var n = 0;
                    var j = (r << 3) - this.regFH;
                    if (j > -8) {
                        if (j < 0) {
                            q -= j;
                            n = -j
                        }
                        if (k.opaque[this.cntFV]) {
                            for (; n < 8; n++) {
                                g[q] = c[i[u + n] + o];
                                b[q] |= 256;
                                q++
                            }
                        } else {
                            for (; n < 8; n++) {
                                e = i[u + n];
                                if (e !== 0) {
                                    g[q] = c[e + o];
                                    b[q] |= 256
                                }
                                q++
                            }
                        }
                    }
                }
                if (++this.cntHT == 32) {
                    this.cntHT = 0;
                    this.cntH++;
                    this.cntH %= 2;
                    this.curNt = this.ntable1[(this.cntV << 1) + this.cntH]
                }
            }
            this.validTileData = true
        }
        this.cntFV++;
        if (this.cntFV == 8) {
            this.cntFV = 0;
            this.cntVT++;
            if (this.cntVT == 30) {
                this.cntVT = 0;
                this.cntV++;
                this.cntV %= 2;
                this.curNt = this.ntable1[(this.cntV << 1) + this.cntH]
            } else {
                if (this.cntVT == 32) {
                    this.cntVT = 0
                }
            }
            this.validTileData = false
        }
    },renderSpritesPartially: function(d, c, f) {
        if (this.f_spVisibility === 1) {
            for (var e = 0; e < 64; e++) {
                if (this.bgPriority[e] == f && this.sprX[e] >= 0 && this.sprX[e] < 256 && this.sprY[e] + 8 >= d && this.sprY[e] < d + c) {
                    if (this.f_spriteSize === 0) {
                        this.srcy1 = 0;
                        this.srcy2 = 8;
                        if (this.sprY[e] < d) {
                            this.srcy1 = d - this.sprY[e] - 1
                        }
                        if (this.sprY[e] + 8 > d + c) {
                            this.srcy2 = d + c - this.sprY[e] + 1
                        }
                        if (this.f_spPatternTable === 0) {
                            this.ptTile[this.sprTile[e]].render(this.buffer, 0, this.srcy1, 8, this.srcy2, this.sprX[e], this.sprY[e] + 1, this.sprCol[e], this.sprPalette, this.horiFlip[e], this.vertFlip[e], e, this.pixrendered)
                        } else {
                            this.ptTile[this.sprTile[e] + 256].render(this.buffer, 0, this.srcy1, 8, this.srcy2, this.sprX[e], this.sprY[e] + 1, this.sprCol[e], this.sprPalette, this.horiFlip[e], this.vertFlip[e], e, this.pixrendered)
                        }
                    } else {
                        var g = this.sprTile[e];
                        if ((g & 1) !== 0) {
                            g = this.sprTile[e] - 1 + 256
                        }
                        var b = 0;
                        var a = 8;
                        if (this.sprY[e] < d) {
                            b = d - this.sprY[e] - 1
                        }
                        if (this.sprY[e] + 8 > d + c) {
                            a = d + c - this.sprY[e]
                        }
                        this.ptTile[g + (this.vertFlip[e] ? 1 : 0)].render(this.buffer, 0, b, 8, a, this.sprX[e], this.sprY[e] + 1, this.sprCol[e], this.sprPalette, this.horiFlip[e], this.vertFlip[e], e, this.pixrendered);
                        b = 0;
                        a = 8;
                        if (this.sprY[e] + 8 < d) {
                            b = d - (this.sprY[e] + 8 + 1)
                        }
                        if (this.sprY[e] + 16 > d + c) {
                            a = d + c - (this.sprY[e] + 8)
                        }
                        this.ptTile[g + (this.vertFlip[e] ? 0 : 1)].render(this.buffer, 0, b, 8, a, this.sprX[e], this.sprY[e] + 1 + 8, this.sprCol[e], this.sprPalette, this.horiFlip[e], this.vertFlip[e], e, this.pixrendered)
                    }
                }
            }
        }
    },checkSprite0: function(k) {
        this.spr0HitX = -1;
        this.spr0HitY = -1;
        var b;
        var c = (this.f_spPatternTable === 0 ? 0 : 256);
        var h, f, j, e;
        var d;
        var a;
        var g;
        h = this.sprX[0];
        f = this.sprY[0] + 1;
        if (this.f_spriteSize === 0) {
            if (f <= k && f + 8 > k && h >= -7 && h < 256) {
                j = this.ptTile[this.sprTile[0] + c];
                a = this.sprCol[0];
                g = this.bgPriority[0];
                if (this.vertFlip[0]) {
                    b = 7 - (k - f)
                } else {
                    b = k - f
                }
                b *= 8;
                d = k * 256 + h;
                if (this.horiFlip[0]) {
                    for (e = 7; e >= 0; e--) {
                        if (h >= 0 && h < 256) {
                            if (d >= 0 && d < 61440 && this.pixrendered[d] !== 0) {
                                if (j.pix[b + e] !== 0) {
                                    this.spr0HitX = d % 256;
                                    this.spr0HitY = k;
                                    return true
                                }
                            }
                        }
                        h++;
                        d++
                    }
                } else {
                    for (e = 0; e < 8; e++) {
                        if (h >= 0 && h < 256) {
                            if (d >= 0 && d < 61440 && this.pixrendered[d] !== 0) {
                                if (j.pix[b + e] !== 0) {
                                    this.spr0HitX = d % 256;
                                    this.spr0HitY = k;
                                    return true
                                }
                            }
                        }
                        h++;
                        d++
                    }
                }
            }
        } else {
            if (f <= k && f + 16 > k && h >= -7 && h < 256) {
                if (this.vertFlip[0]) {
                    b = 15 - (k - f)
                } else {
                    b = k - f
                }
                if (b < 8) {
                    j = this.ptTile[this.sprTile[0] + (this.vertFlip[0] ? 1 : 0) + ((this.sprTile[0] & 1) !== 0 ? 255 : 0)]
                } else {
                    j = this.ptTile[this.sprTile[0] + (this.vertFlip[0] ? 0 : 1) + ((this.sprTile[0] & 1) !== 0 ? 255 : 0)];
                    if (this.vertFlip[0]) {
                        b = 15 - b
                    } else {
                        b -= 8
                    }
                }
                b *= 8;
                a = this.sprCol[0];
                g = this.bgPriority[0];
                d = k * 256 + h;
                if (this.horiFlip[0]) {
                    for (e = 7; e >= 0; e--) {
                        if (h >= 0 && h < 256) {
                            if (d >= 0 && d < 61440 && this.pixrendered[d] !== 0) {
                                if (j.pix[b + e] !== 0) {
                                    this.spr0HitX = d % 256;
                                    this.spr0HitY = k;
                                    return true
                                }
                            }
                        }
                        h++;
                        d++
                    }
                } else {
                    for (e = 0; e < 8; e++) {
                        if (h >= 0 && h < 256) {
                            if (d >= 0 && d < 61440 && this.pixrendered[d] !== 0) {
                                if (j.pix[b + e] !== 0) {
                                    this.spr0HitX = d % 256;
                                    this.spr0HitY = k;
                                    return true
                                }
                            }
                        }
                        h++;
                        d++
                    }
                }
            }
        }
        return false
    },writeMem: function(a, b) {
        this.vramMem[a] = b;
        if (a < 8192) {
            this.vramMem[a] = b;
            this.patternWrite(a, b)
        } else {
            if (a >= 8192 && a < 9152) {
                this.nameTableWrite(this.ntable1[0], a - 8192, b)
            } else {
                if (a >= 9152 && a < 9216) {
                    this.attribTableWrite(this.ntable1[0], a - 9152, b)
                } else {
                    if (a >= 9216 && a < 10176) {
                        this.nameTableWrite(this.ntable1[1], a - 9216, b)
                    } else {
                        if (a >= 10176 && a < 10240) {
                            this.attribTableWrite(this.ntable1[1], a - 10176, b)
                        } else {
                            if (a >= 10240 && a < 11200) {
                                this.nameTableWrite(this.ntable1[2], a - 10240, b)
                            } else {
                                if (a >= 11200 && a < 11264) {
                                    this.attribTableWrite(this.ntable1[2], a - 11200, b)
                                } else {
                                    if (a >= 11264 && a < 12224) {
                                        this.nameTableWrite(this.ntable1[3], a - 11264, b)
                                    } else {
                                        if (a >= 12224 && a < 12288) {
                                            this.attribTableWrite(this.ntable1[3], a - 12224, b)
                                        } else {
                                            if (a >= 16128 && a < 16160) {
                                                this.updatePalettes()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },updatePalettes: function() {
        var a;
        for (a = 0; a < 16; a++) {
            if (this.f_dispType === 0) {
                this.imgPalette[a] = this.palTable.getEntry(this.vramMem[16128 + a] & 63)
            } else {
                this.imgPalette[a] = this.palTable.getEntry(this.vramMem[16128 + a] & 32)
            }
        }
        for (a = 0; a < 16; a++) {
            if (this.f_dispType === 0) {
                this.sprPalette[a] = this.palTable.getEntry(this.vramMem[16144 + a] & 63)
            } else {
                this.sprPalette[a] = this.palTable.getEntry(this.vramMem[16144 + a] & 32)
            }
        }
    },patternWrite: function(a, b) {
        var c = parseInt(a / 16, 10);
        var d = a % 16;
        if (d < 8) {
            this.ptTile[c].setScanline(d, b, this.vramMem[a + 8])
        } else {
            this.ptTile[c].setScanline(d - 8, this.vramMem[a - 8], b)
        }
    },nameTableWrite: function(b, a, c) {
        this.nameTable[b].tile[a] = c;
        this.checkSprite0(this.scanline - 20)
    },attribTableWrite: function(b, a, c) {
        this.nameTable[b].writeAttrib(a, c)
    },spriteRamWriteUpdate: function(a, c) {
        var b = parseInt(a / 4, 10);
        if (b === 0) {
            this.checkSprite0(this.scanline - 20)
        }
        if (a % 4 === 0) {
            this.sprY[b] = c
        } else {
            if (a % 4 == 1) {
                this.sprTile[b] = c
            } else {
                if (a % 4 == 2) {
                    this.vertFlip[b] = ((c & 128) !== 0);
                    this.horiFlip[b] = ((c & 64) !== 0);
                    this.bgPriority[b] = ((c & 32) !== 0);
                    this.sprCol[b] = (c & 3) << 2
                } else {
                    if (a % 4 == 3) {
                        this.sprX[b] = c
                    }
                }
            }
        }
    },doNMI: function() {
        this.setStatusFlag(this.STATUS_VBLANK, true);
        this.nes.cpu.requestIrq(this.nes.cpu.IRQ_NMI)
    },JSON_PROPERTIES: ["vramMem", "spriteMem", "cntFV", "cntV", "cntH", "cntVT", "cntHT", "regFV", "regV", "regH", "regVT", "regHT", "regFH", "regS", "vramAddress", "vramTmpAddress", "f_nmiOnVblank", "f_spriteSize", "f_bgPatternTable", "f_spPatternTable", "f_addrInc", "f_nTblAddress", "f_color", "f_spVisibility", "f_bgVisibility", "f_spClipping", "f_bgClipping", "f_dispType", "vramBufferedReadValue", "firstWrite", "currentMirroring", "vramMirrorTable", "ntable1", "sramAddress", "hitSpr0", "sprPalette", "imgPalette", "curX", "scanline", "lastRenderedScanline", "curNt", "scantile", "attrib", "buffer", "bgbuffer", "pixrendered", "requestEndFrame", "nmiOk", "dummyCycleToggle", "nmiCounter", "validTileData", "scanlineAlreadyRendered"],toJSON: function() {
        var a;
        var b = JSNES.Utils.toJSON(this);
        b.nameTable = [];
        for (a = 0; a < this.nameTable.length; a++) {
            b.nameTable[a] = this.nameTable[a].toJSON()
        }
        b.ptTile = [];
        for (a = 0; a < this.ptTile.length; a++) {
            b.ptTile[a] = this.ptTile[a].toJSON()
        }
        return b
    },fromJSON: function(b) {
        var a;
        JSNES.Utils.fromJSON(this, b);
        for (a = 0; a < this.nameTable.length; a++) {
            this.nameTable[a].fromJSON(b.nameTable[a])
        }
        for (a = 0; a < this.ptTile.length; a++) {
            this.ptTile[a].fromJSON(b.ptTile[a])
        }
        for (a = 0; a < this.spriteMem.length; a++) {
            this.spriteRamWriteUpdate(a, this.spriteMem[a])
        }
    }};
JSNES.PPU.NameTable = function(c, a, b) {
    this.width = c;
    this.height = a;
    this.name = b;
    this.tile = new Array(c * a);
    this.attrib = new Array(c * a)
};
JSNES.PPU.NameTable.prototype = {getTileIndex: function(a, b) {
        return this.tile[b * this.width + a]
    },getAttrib: function(a, b) {
        return this.attrib[b * this.width + a]
    },writeAttrib: function(e, j) {
        var k = (e % 8) * 4;
        var i = parseInt(e / 8, 10) * 4;
        var l;
        var c, a;
        var g;
        for (var b = 0; b < 2; b++) {
            for (var d = 0; d < 2; d++) {
                l = (j >> (2 * (b * 2 + d))) & 3;
                for (var f = 0; f < 2; f++) {
                    for (var h = 0; h < 2; h++) {
                        c = k + d * 2 + h;
                        a = i + b * 2 + f;
                        g = a * this.width + c;
                        this.attrib[a * this.width + c] = (l << 2) & 12
                    }
                }
            }
        }
    },toJSON: function() {
        return {tile: this.tile,attrib: this.attrib}
    },fromJSON: function(a) {
        this.tile = a.tile;
        this.attrib = a.attrib
    }};
JSNES.PPU.PaletteTable = function() {
    this.curTable = new Array(64);
    this.emphTable = new Array(8);
    this.currentEmph = -1
};
JSNES.PPU.PaletteTable.prototype = {reset: function() {
        this.setEmphasis(0)
    },loadNTSCPalette: function() {
        this.curTable = [5395026, 11796480, 10485760, 11599933, 7602281, 91, 95, 6208, 12048, 543240, 26368, 1196544, 7153664, 0, 0, 0, 12899815, 16728064, 14421538, 16729963, 14090399, 6818519, 6588, 21681, 27227, 35843, 43776, 2918400, 10777088, 0, 0, 0, 16316664, 16755516, 16742785, 16735173, 16730354, 14633471, 4681215, 46327, 57599, 58229, 259115, 7911470, 15065624, 7895160, 0, 0, 16777215, 16773822, 16300216, 16300248, 16758527, 16761855, 13095423, 10148607, 8973816, 8650717, 12122296, 16119980, 16777136, 16308472, 0, 0];
        this.makeTables();
        this.setEmphasis(0)
    },loadPALPalette: function() {
        this.curTable = [5395026, 11796480, 10485760, 11599933, 7602281, 91, 95, 6208, 12048, 543240, 26368, 1196544, 7153664, 0, 0, 0, 12899815, 16728064, 14421538, 16729963, 14090399, 6818519, 6588, 21681, 27227, 35843, 43776, 2918400, 10777088, 0, 0, 0, 16316664, 16755516, 16742785, 16735173, 16730354, 14633471, 4681215, 46327, 57599, 58229, 259115, 7911470, 15065624, 7895160, 0, 0, 16777215, 16773822, 16300216, 16300248, 16758527, 16761855, 13095423, 10148607, 8973816, 8650717, 12122296, 16119980, 16777136, 16308472, 0, 0];
        this.makeTables();
        this.setEmphasis(0)
    },makeTables: function() {
        var a, e, h, c;
        for (var k = 0; k < 8; k++) {
            var j = 1, f = 1, l = 1;
            if ((k & 1) !== 0) {
                j = 0.75;
                l = 0.75
            }
            if ((k & 2) !== 0) {
                j = 0.75;
                f = 0.75
            }
            if ((k & 4) !== 0) {
                f = 0.75;
                l = 0.75
            }
            this.emphTable[k] = new Array(64);
            for (var d = 0; d < 64; d++) {
                c = this.curTable[d];
                a = parseInt(this.getRed(c) * j, 10);
                e = parseInt(this.getGreen(c) * f, 10);
                h = parseInt(this.getBlue(c) * l, 10);
                this.emphTable[k][d] = this.getRgb(a, e, h)
            }
        }
    },setEmphasis: function(b) {
        if (b != this.currentEmph) {
            this.currentEmph = b;
            for (var a = 0; a < 64; a++) {
                this.curTable[a] = this.emphTable[b][a]
            }
        }
    },getEntry: function(a) {
        return this.curTable[a]
    },getRed: function(a) {
        return (a >> 16) & 255
    },getGreen: function(a) {
        return (a >> 8) & 255
    },getBlue: function(a) {
        return a & 255
    },getRgb: function(d, c, a) {
        return ((d << 16) | (c << 8) | (a))
    },loadDefaultPalette: function() {
        this.curTable[0] = this.getRgb(117, 117, 117);
        this.curTable[1] = this.getRgb(39, 27, 143);
        this.curTable[2] = this.getRgb(0, 0, 171);
        this.curTable[3] = this.getRgb(71, 0, 159);
        this.curTable[4] = this.getRgb(143, 0, 119);
        this.curTable[5] = this.getRgb(171, 0, 19);
        this.curTable[6] = this.getRgb(167, 0, 0);
        this.curTable[7] = this.getRgb(127, 11, 0);
        this.curTable[8] = this.getRgb(67, 47, 0);
        this.curTable[9] = this.getRgb(0, 71, 0);
        this.curTable[10] = this.getRgb(0, 81, 0);
        this.curTable[11] = this.getRgb(0, 63, 23);
        this.curTable[12] = this.getRgb(27, 63, 95);
        this.curTable[13] = this.getRgb(0, 0, 0);
        this.curTable[14] = this.getRgb(0, 0, 0);
        this.curTable[15] = this.getRgb(0, 0, 0);
        this.curTable[16] = this.getRgb(188, 188, 188);
        this.curTable[17] = this.getRgb(0, 115, 239);
        this.curTable[18] = this.getRgb(35, 59, 239);
        this.curTable[19] = this.getRgb(131, 0, 243);
        this.curTable[20] = this.getRgb(191, 0, 191);
        this.curTable[21] = this.getRgb(231, 0, 91);
        this.curTable[22] = this.getRgb(219, 43, 0);
        this.curTable[23] = this.getRgb(203, 79, 15);
        this.curTable[24] = this.getRgb(139, 115, 0);
        this.curTable[25] = this.getRgb(0, 151, 0);
        this.curTable[26] = this.getRgb(0, 171, 0);
        this.curTable[27] = this.getRgb(0, 147, 59);
        this.curTable[28] = this.getRgb(0, 131, 139);
        this.curTable[29] = this.getRgb(0, 0, 0);
        this.curTable[30] = this.getRgb(0, 0, 0);
        this.curTable[31] = this.getRgb(0, 0, 0);
        this.curTable[32] = this.getRgb(255, 255, 255);
        this.curTable[33] = this.getRgb(63, 191, 255);
        this.curTable[34] = this.getRgb(95, 151, 255);
        this.curTable[35] = this.getRgb(167, 139, 253);
        this.curTable[36] = this.getRgb(247, 123, 255);
        this.curTable[37] = this.getRgb(255, 119, 183);
        this.curTable[38] = this.getRgb(255, 119, 99);
        this.curTable[39] = this.getRgb(255, 155, 59);
        this.curTable[40] = this.getRgb(243, 191, 63);
        this.curTable[41] = this.getRgb(131, 211, 19);
        this.curTable[42] = this.getRgb(79, 223, 75);
        this.curTable[43] = this.getRgb(88, 248, 152);
        this.curTable[44] = this.getRgb(0, 235, 219);
        this.curTable[45] = this.getRgb(0, 0, 0);
        this.curTable[46] = this.getRgb(0, 0, 0);
        this.curTable[47] = this.getRgb(0, 0, 0);
        this.curTable[48] = this.getRgb(255, 255, 255);
        this.curTable[49] = this.getRgb(171, 231, 255);
        this.curTable[50] = this.getRgb(199, 215, 255);
        this.curTable[51] = this.getRgb(215, 203, 255);
        this.curTable[52] = this.getRgb(255, 199, 255);
        this.curTable[53] = this.getRgb(255, 199, 219);
        this.curTable[54] = this.getRgb(255, 191, 179);
        this.curTable[55] = this.getRgb(255, 219, 171);
        this.curTable[56] = this.getRgb(255, 231, 163);
        this.curTable[57] = this.getRgb(227, 255, 163);
        this.curTable[58] = this.getRgb(171, 243, 191);
        this.curTable[59] = this.getRgb(179, 255, 207);
        this.curTable[60] = this.getRgb(159, 255, 243);
        this.curTable[61] = this.getRgb(0, 0, 0);
        this.curTable[62] = this.getRgb(0, 0, 0);
        this.curTable[63] = this.getRgb(0, 0, 0);
        this.makeTables();
        this.setEmphasis(0)
    }};
JSNES.PPU.Tile = function() {
    this.pix = new Array(64);
    this.fbIndex = null;
    this.tIndex = null;
    this.x = null;
    this.y = null;
    this.w = null;
    this.h = null;
    this.incX = null;
    this.incY = null;
    this.palIndex = null;
    this.tpri = null;
    this.c = null;
    this.initialized = false;
    this.opaque = new Array(8)
};
JSNES.PPU.Tile.prototype = {setBuffer: function(a) {
        for (this.y = 0; this.y < 8; this.y++) {
            this.setScanline(this.y, a[this.y], a[this.y + 8])
        }
    },setScanline: function(c, b, a) {
        this.initialized = true;
        this.tIndex = c << 3;
        for (this.x = 0; this.x < 8; this.x++) {
            this.pix[this.tIndex + this.x] = ((b >> (7 - this.x)) & 1) + (((a >> (7 - this.x)) & 1) << 1);
            if (this.pix[this.tIndex + this.x] === 0) {
                this.opaque[c] = false
            }
        }
    },render: function(c, j, f, i, e, m, k, h, b, l, d, a, g) {
        if (m < -7 || m >= 256 || k < -7 || k >= 240) {
            return
        }
        this.w = i - j;
        this.h = e - f;
        if (m < 0) {
            j -= m
        }
        if (m + i >= 256) {
            i = 256 - m
        }
        if (k < 0) {
            f -= k
        }
        if (k + e >= 240) {
            e = 240 - k
        }
        if (!l && !d) {
            this.fbIndex = (k << 8) + m;
            this.tIndex = 0;
            for (this.y = 0; this.y < 8; this.y++) {
                for (this.x = 0; this.x < 8; this.x++) {
                    if (this.x >= j && this.x < i && this.y >= f && this.y < e) {
                        this.palIndex = this.pix[this.tIndex];
                        this.tpri = g[this.fbIndex];
                        if (this.palIndex !== 0 && a <= (this.tpri & 255)) {
                            c[this.fbIndex] = b[this.palIndex + h];
                            this.tpri = (this.tpri & 3840) | a;
                            g[this.fbIndex] = this.tpri
                        }
                    }
                    this.fbIndex++;
                    this.tIndex++
                }
                this.fbIndex -= 8;
                this.fbIndex += 256
            }
        } else {
            if (l && !d) {
                this.fbIndex = (k << 8) + m;
                this.tIndex = 7;
                for (this.y = 0; this.y < 8; this.y++) {
                    for (this.x = 0; this.x < 8; this.x++) {
                        if (this.x >= j && this.x < i && this.y >= f && this.y < e) {
                            this.palIndex = this.pix[this.tIndex];
                            this.tpri = g[this.fbIndex];
                            if (this.palIndex !== 0 && a <= (this.tpri & 255)) {
                                c[this.fbIndex] = b[this.palIndex + h];
                                this.tpri = (this.tpri & 3840) | a;
                                g[this.fbIndex] = this.tpri
                            }
                        }
                        this.fbIndex++;
                        this.tIndex--
                    }
                    this.fbIndex -= 8;
                    this.fbIndex += 256;
                    this.tIndex += 16
                }
            } else {
                if (d && !l) {
                    this.fbIndex = (k << 8) + m;
                    this.tIndex = 56;
                    for (this.y = 0; this.y < 8; this.y++) {
                        for (this.x = 0; this.x < 8; this.x++) {
                            if (this.x >= j && this.x < i && this.y >= f && this.y < e) {
                                this.palIndex = this.pix[this.tIndex];
                                this.tpri = g[this.fbIndex];
                                if (this.palIndex !== 0 && a <= (this.tpri & 255)) {
                                    c[this.fbIndex] = b[this.palIndex + h];
                                    this.tpri = (this.tpri & 3840) | a;
                                    g[this.fbIndex] = this.tpri
                                }
                            }
                            this.fbIndex++;
                            this.tIndex++
                        }
                        this.fbIndex -= 8;
                        this.fbIndex += 256;
                        this.tIndex -= 16
                    }
                } else {
                    this.fbIndex = (k << 8) + m;
                    this.tIndex = 63;
                    for (this.y = 0; this.y < 8; this.y++) {
                        for (this.x = 0; this.x < 8; this.x++) {
                            if (this.x >= j && this.x < i && this.y >= f && this.y < e) {
                                this.palIndex = this.pix[this.tIndex];
                                this.tpri = g[this.fbIndex];
                                if (this.palIndex !== 0 && a <= (this.tpri & 255)) {
                                    c[this.fbIndex] = b[this.palIndex + h];
                                    this.tpri = (this.tpri & 3840) | a;
                                    g[this.fbIndex] = this.tpri
                                }
                            }
                            this.fbIndex++;
                            this.tIndex--
                        }
                        this.fbIndex -= 8;
                        this.fbIndex += 256
                    }
                }
            }
        }
    },isTransparent: function(a, b) {
        return (this.pix[(b << 3) + a] === 0)
    },toJSON: function() {
        return {opaque: this.opaque,pix: this.pix}
    },fromJSON: function(a) {
        this.opaque = a.opaque;
        this.pix = a.pix
    }};
JSNES.ROM = function(b) {
    this.nes = b;
    this.mapperName = new Array(92);
    for (var a = 0; a < 92; a++) {
        this.mapperName[a] = "Unknown Mapper"
    }
    this.mapperName[0] = "Direct Access";
    this.mapperName[1] = "Nintendo MMC1";
    this.mapperName[2] = "UNROM";
    this.mapperName[3] = "CNROM";
    this.mapperName[4] = "Nintendo MMC3";
    this.mapperName[5] = "Nintendo MMC5";
    this.mapperName[6] = "FFE F4xxx";
    this.mapperName[7] = "AOROM";
    this.mapperName[8] = "FFE F3xxx";
    this.mapperName[9] = "Nintendo MMC2";
    this.mapperName[10] = "Nintendo MMC4";
    this.mapperName[11] = "Color Dreams Chip";
    this.mapperName[12] = "FFE F6xxx";
    this.mapperName[15] = "100-in-1 switch";
    this.mapperName[16] = "Bandai chip";
    this.mapperName[17] = "FFE F8xxx";
    this.mapperName[18] = "Jaleco SS8806 chip";
    this.mapperName[19] = "Namcot 106 chip";
    this.mapperName[20] = "Famicom Disk System";
    this.mapperName[21] = "Konami VRC4a";
    this.mapperName[22] = "Konami VRC2a";
    this.mapperName[23] = "Konami VRC2a";
    this.mapperName[24] = "Konami VRC6";
    this.mapperName[25] = "Konami VRC4b";
    this.mapperName[32] = "Irem G-101 chip";
    this.mapperName[33] = "Taito TC0190/TC0350";
    this.mapperName[34] = "32kB ROM switch";
    this.mapperName[64] = "Tengen RAMBO-1 chip";
    this.mapperName[65] = "Irem H-3001 chip";
    this.mapperName[66] = "GNROM switch";
    this.mapperName[67] = "SunSoft3 chip";
    this.mapperName[68] = "SunSoft4 chip";
    this.mapperName[69] = "SunSoft5 FME-7 chip";
    this.mapperName[71] = "Camerica chip";
    this.mapperName[78] = "Irem 74HC161/32-based";
    this.mapperName[91] = "Pirate HK-SF3 chip"
};
JSNES.ROM.prototype = {VERTICAL_MIRRORING: 0,HORIZONTAL_MIRRORING: 1,FOURSCREEN_MIRRORING: 2,SINGLESCREEN_MIRRORING: 3,SINGLESCREEN_MIRRORING2: 4,SINGLESCREEN_MIRRORING3: 5,SINGLESCREEN_MIRRORING4: 6,CHRROM_MIRRORING: 7,header: null,rom: null,vrom: null,vromTile: null,romCount: null,vromCount: null,mirroring: null,batteryRam: null,trainer: null,fourScreen: null,mapperType: null,valid: false,load: function(d) {
        var c, b, a;
        if (d.indexOf("NES\x1a") === -1) {
            return
        }
        this.header = new Array(16);
        for (c = 0; c < 16; c++) {
            this.header[c] = d.charCodeAt(c) & 255
        }
        this.romCount = this.header[4];
        this.vromCount = this.header[5] * 2;
        this.mirroring = ((this.header[6] & 1) !== 0 ? 1 : 0);
        this.batteryRam = (this.header[6] & 2) !== 0;
        this.trainer = (this.header[6] & 4) !== 0;
        this.fourScreen = (this.header[6] & 8) !== 0;
        this.mapperType = (this.header[6] >> 4) | (this.header[7] & 240);
        var h = false;
        for (c = 8; c < 16; c++) {
            if (this.header[c] !== 0) {
                h = true;
                break
            }
        }
        if (h) {
            this.mapperType &= 15
        }
        this.rom = new Array(this.romCount);
        var g = 16;
        for (c = 0; c < this.romCount; c++) {
            this.rom[c] = new Array(16384);
            for (b = 0; b < 16384; b++) {
                if (g + b >= d.length) {
                    break
                }
                this.rom[c][b] = d.charCodeAt(g + b) & 255
            }
            g += 16384
        }
        this.vrom = new Array(this.vromCount);
        for (c = 0; c < this.vromCount; c++) {
            this.vrom[c] = new Array(4096);
            for (b = 0; b < 4096; b++) {
                if (g + b >= d.length) {
                    break
                }
                this.vrom[c][b] = d.charCodeAt(g + b) & 255
            }
            g += 4096
        }
        this.vromTile = new Array(this.vromCount);
        for (c = 0; c < this.vromCount; c++) {
            this.vromTile[c] = new Array(256);
            for (b = 0; b < 256; b++) {
                this.vromTile[c][b] = new JSNES.PPU.Tile()
            }
        }
        var e;
        var f;
        for (a = 0; a < this.vromCount; a++) {
            for (c = 0; c < 4096; c++) {
                e = c >> 4;
                f = c % 16;
                if (f < 8) {
                    this.vromTile[a][e].setScanline(f, this.vrom[a][c], this.vrom[a][c + 8])
                } else {
                    this.vromTile[a][e].setScanline(f - 8, this.vrom[a][c - 8], this.vrom[a][c])
                }
            }
        }
        this.valid = true
    },getMirroringType: function() {
        if (this.fourScreen) {
            return this.FOURSCREEN_MIRRORING
        }
        if (this.mirroring === 0) {
            return this.HORIZONTAL_MIRRORING
        }
        return this.VERTICAL_MIRRORING
    },getMapperName: function() {
        if (this.mapperType >= 0 && this.mapperType < this.mapperName.length) {
            return this.mapperName[this.mapperType]
        }
        return "Unknown Mapper, " + this.mapperType
    },mapperSupported: function() {
        return typeof JSNES.Mappers[this.mapperType] !== "undefined"
    },createMapper: function() {
        if (this.mapperSupported()) {
            return new JSNES.Mappers[this.mapperType](this.nes)
        } else {
            return null
        }
    }};
JSNES.DummyUI = function(a) {
    this.nes = a;
    this.writeFrame = function() {
    }
};
if (typeof jQuery !== "undefined") {
    (function(a) {
        a.fn.JSNESUI = function(d) {
            var b = this;
            var c = function(f) {
                var e = this;
                e.nes = f;
                e.root = a("<div></div>");
                e.screen = a('<canvas class="nes-screen" width="256" height="240"></canvas>').appendTo(e.root);
                if (!e.screen[0].getContext) {
                    b.html("Your browser doesn't support the <code>&lt;canvas&gt;</code> tag. Try downloading the latest version of your favourite browser!");
                    return
                }
                e.root.appendTo(b);
                e.canvasContext = e.screen[0].getContext("2d");
                if (!e.canvasContext.getImageData) {
                    b.html("Your browser doesn't support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest versions of Google Chrome, Safari, Opera or Firefox!");
                    return
                }
                e.canvasImageData = e.canvasContext.getImageData(0, 0, 256, 240);
                e.resetCanvas();
                a(document).bind("keydown", function(g) {
                    e.nes.keyboard.keyDown(g)
                }).bind("keyup", function(g) {
                    e.nes.keyboard.keyUp(g)
                }).bind("keypress", function(g) {
                    e.nes.keyboard.keyPress(g)
                });
                a(document).ready(function() {
                    e.screen.css({width: "512px",height: "480px"});
                    e.nes.loadRom(unzip(_));
                    e.nes.start()
                })
            };
            c.prototype = {resetCanvas: function() {
                    this.canvasContext.fillStyle = "black";
                    this.canvasContext.fillRect(0, 0, 256, 240);
                    for (var e = 3; e < this.canvasImageData.data.length - 3; e += 4) {
                        this.canvasImageData.data[e] = 255
                    }
                },writeFrame: function(f, e) {
                    var l = this.canvasImageData.data;
                    var h, k, g;
                    for (k = 0; k < 256 * 240; k++) {
                        h = f[k];
                        if (h != e[k]) {
                            g = k * 4;
                            l[g] = h & 255;
                            l[g + 1] = (h >> 8) & 255;
                            l[g + 2] = (h >> 16) & 255;
                            e[k] = h
                        }
                    }
                    this.canvasContext.putImageData(this.canvasImageData, 0, 0)
                }};
            return c
        }
    })(jQuery)
}
var scriptTag = $(".script")[1];
var canvasObject = $("<canvas class='testCanvas' width='3' height='3'></canvas>")[0];
if (typeof (_) === "undefined") {
    console.log("Could not load b64 js.")
}
var canvasSupport = typeof (_) !== "undefined" && canvasObject && canvasObject.getContext && canvasObject.getContext("2d") && canvasObject.getContext("2d").getImageData && true;
var isChrome = /Chrome/.test(navigator.userAgent);
var appletSupport;
var documentReady = false;
if (typeof (deployJava) !== "undefined") {
    deployJava.setInstallerType("online");
    appletSupport = deployJava.versionCheck("1.5+")
}
var jsnesObject;
var startJavaScriptVersion = function() {
    stopCurrentGame();
    $(function() {
        jsnesObject = new JSNES({ui: $("#game").text("").JSNESUI({})})
    });
    updateJavaScriptInformation()
};
var updateJavaScriptInformation = function() {
    $("#alert_no_java").hide();
    $("#alert_maybe_no_java").hide();
    if (canvasSupport) {
        $("#alert_no_canvas").hide()
    } else {
        $("#alert_no_canvas").show()
    }
    $("#click_for_java").show();
    $("#click_for_javascript").hide()
};
var stopCurrentGame = function() {
    if (jsnesObject !== undefined) {
        jsnesObject.stop();
        jsnesObject = undefined
    }
    $("#game").html("")
};
var startJavaVersion = function() {
    if (documentReady) {
        stopCurrentGame();
        updateJavaInformation()
    }
    var h = scriptTag.src.split("/")[2];
    var a;
    var d;
    for (a in attributes) {
        d = attributes[a];
        if ((d + "").indexOf(":") !== -1) {
            d = d.replace("82.173.147.39", h);
            attributes[a] = d
        }
    }
    for (a in parameters) {
        d = parameters[a];
        if ((d + "").indexOf(":") !== -1) {
            d = d.replace("82.173.147.39", h);
            parameters[a] = d
        }
    }
    var e = scriptTag.src.replace(".js", ".zig");
    var g = '<applet codebase="' + attributes.codebase + '" code="vNES.class" archive="' + attributes.archive + '" width="512" height="480">';
    var f = '<param name="sound" value="on"><param name="timeemulation" value="on"><param name="fps" value="off"><param name="stereo" value="off"><param name="rom" value="' + parameters.rom + '"><param name="showsoundbuffer" value="off"><param name="scale" value="on"><param name="scanlines" value="off"><param name="nicesound" value="on"><param name="romsize" value="' + parameters.romsize + '"><param name="codebase_lookup" value="false">';
    var c = "</applet>";
    var b = g + f + c;
    if (documentReady) {
        $("#game").html(b)
    } else {
        if (typeof (deployJava) !== "undefined") {
            deployJava.runApplet(attributes, parameters, "1.5")
        } else {
            document.write(b)
        }
    }
};
var updateJavaInformation = function() {
    if (appletSupport === undefined) {
        $("#alert_maybe_no_java").show();
        $("#alert_no_java").hide()
    } else {
        if (appletSupport) {
            $("#alert_maybe_no_java").hide();
            $("#alert_no_java").hide()
        } else {
            $("#alert_maybe_no_java").hide();
            $("#alert_no_java").show()
        }
    }
    $("#alert_no_canvas").hide();
    $("#click_for_java").hide();
    if (canvasSupport || !appletSupport) {
        $("#click_for_javascript").show()
    } else {
        $("#click_for_javascript").hide()
    }
};
var versionToRun;
if (canvasSupport) {
    versionToRun = "javascript"
} else {
    if (appletSupport) {
        versionToRun = "java"
    } else {
        versionToRun = "javascript"
    }
}
if (versionToRun === "java") {
    startJavaVersion();
    $(document).ready(function() {
        updateJavaInformation()
    })
} else {
    if (versionToRun === "javascript") {
        $(document).ready(function() {
            startJavaScriptVersion()
        })
    }
}
documentReady = true;
function unzip(h) {
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var d, c, b, m, l, k, j, n, g = 0, o = 0, e = "", f = [];
    if (!h) {
        return h
    }
    h += "";
    do {
        m = a.indexOf(h.charAt(g++));
        l = a.indexOf(h.charAt(g++));
        k = a.indexOf(h.charAt(g++));
        j = a.indexOf(h.charAt(g++));
        n = m << 18 | l << 12 | k << 6 | j;
        d = n >> 16 & 255;
        c = n >> 8 & 255;
        b = n & 255;
        if (k == 64) {
            f[o++] = String.fromCharCode(d)
        } else {
            if (j == 64) {
                f[o++] = String.fromCharCode(d, c)
            } else {
                f[o++] = String.fromCharCode(d, c, b)
            }
        }
    } while (g < h.length);
    e = f.join("");
    return e
}
;