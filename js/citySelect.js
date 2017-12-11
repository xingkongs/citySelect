/*!
 * jock-citypicker  v2.0
 * Copyright 2012, JockChou
 * Date: Sat Feb 13 22:33:48 2010 -0500
 * Email: 164068300@qq.com
 * QQ:164068300
 */
(function (host) {
    var window = host || window,
        doc = document,
        selectedCity = "",
        popUpCityFrame = null,
        selectEventProxy = null,
        hotEventProxy = null,
        scrollEventProxy = null,
        toString = Object.prototype.toString,
        city = cityList.city,
        KEY = ["A", "F", "G"],
        ID = {cityFrame: "div_select_city_sub_menu", cityList: "div_city_list"},
        CLAZZ = {
            cityFrame: "mod_list_city",
            cityTop: "city_top",
            cityList: "list_wrap",
            cityHot: "hot",
            cityCont: "city_cont",
            col1: "col1",
            col2: "col2",
            table: "mod_city_list"
        };

    function createCityTopHtml() {
        var fragment = doc.createDocumentFragment(),
            p = doc.createElement("p");
        for (var row in city) {
            if (city.hasOwnProperty(row)) {
                a = doc.createElement("a");
                a.href = "#" + row;
                if(row==="AA"){
                    a.appendChild(doc.createTextNode('直'));
                }else{
                    a.appendChild(doc.createTextNode(row));
                }
                p.appendChild(a);
            }
        }
        fragment.appendChild(p);
        return fragment;
    }

    function createCityTRHtml() {
        var fragment = doc.createDocumentFragment();
        for (var miao in city) {
            if (city.hasOwnProperty(miao)) {
                var tr = doc.createElement("tr"),
                    th = doc.createElement("th"),
                    td = doc.createElement("td"),
                    span = doc.createElement("span"),
                    span2 = doc.createElement("span"),
                    text = doc.createTextNode(miao),
                    miaoArray = city[miao],
                    currentMiao = null,
                    a = null;
                if(miao==="AA"){
                    text=doc.createTextNode("直")
                }
                //console.log(miaoArray);
                for(var sheng in miaoArray){

                    var shiArray = miaoArray[sheng]
                    for (var j = 0, len = shiArray.length; j < len; j++) {
                        currentMiao = shiArray[j];
                        a = doc.createElement("a");
                        a.title = currentMiao.name;
                        a.href = "/" + currentMiao.spell;
                        a.appendChild(doc.createTextNode(currentMiao.name));
                        td.appendChild(a);
                    }
                }

                span.appendChild(text);
                th.appendChild(span);
                span2.appendChild(doc.createTextNode(sheng+":"));
                th.appendChild(span2);
                tr.id = "miao_" + miao;
                tr.appendChild(th);
                tr.appendChild(td);
                fragment.appendChild(tr);
            }
        }
        return fragment;
    }

    function createCityContentHtml() {
        var fragment = doc.createDocumentFragment(),
            h4 = doc.createElement("h4"),
            table = doc.createElement("table"),
            colgroup = doc.createElement("colgroup"),
            tbody = doc.createElement("tbody"),
            col1 = doc.createElement("col"),
            col2 = doc.createElement("col"),
            trHtml = createCityTRHtml();
        table.className = CLAZZ.table;
        col1.className = CLAZZ.col1;
        col2.className = CLAZZ.col2;
        colgroup.appendChild(col1);
        colgroup.appendChild(col2);
        tbody.appendChild(trHtml);
        table.appendChild(colgroup);
        table.appendChild(tbody);
        selectEventProxy = table;
        fragment.appendChild(table);
        return fragment;
    }

    function stopPropagation(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }

    function preventDefault(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

    function cityScroll(m) {
        if (m && typeof m === "string") {
            m = m.toUpperCase();
            if (doc.all) {
                var cityListDiv = doc.getElementById(ID.cityList), tr = doc.getElementById("miao_" + m);
                if (tr !== null) {
                    cityListDiv.scrollTop = tr.offsetTop + 32;
                }
            } else {
                var miao = doc.getElementById("miao_" + m);
                if (miao !== null) {
                    miao.scrollIntoView();
                }
            }
        }
    }

    function addSelectEvent(proxyTag, type, callback) {
        proxyTag["on" + type] = function (e) {
            var event = e || window.event, target = event.srcElement || event.target;
            if (target.tagName.toLowerCase() == "a") {
                selectedCity = target.innerHTML;
                callback(selectedCity);
            }
            citypicker.close();
            stopPropagation(event);
            preventDefault(event);
        };
    }

    function addScrollEvent(proxyTag, type) {
        proxyTag["on" + type] = function (e) {
            var event = e || window.event, target = event.srcElement || event.target;
            if (target.tagName.toLowerCase() == "a") {
                var m = target.getAttribute("href").replace(/^#/, "") || "A";
                cityScroll(m);
            }
            stopPropagation(event);
            preventDefault(event);
        };
    }

    function addKeyPressEvent(tag) {
        tag.onkeypress = function (e) {
            var event = window.event || e, charCode, keyIndex = 0, keyCode;
            if (typeof event.charCode == "number") {
                charCode = event.charCode;
            } else {
                charCode = event.keyCode;
            }
            if (charCode >= 97 && charCode <= 122) {
                keyIndex = charCode - 97;
            } else if (charCode >= 65 && charCode <= 90) {
                keyIndex = charCode - 65;
            }
            keyCode = KEY[keyIndex];
            cityScroll(keyCode);
        };
    }

    function createFrame() {
        var cityFrame = doc.createElement("div"),
            cityTop = doc.createElement("div"),
            cityHot = doc.createElement("p"),
            cityList = doc.createElement("div"),
            cityCont = doc.createElement("div"),
            cityContentHtml = createCityContentHtml(),
            cityTopHtml = createCityTopHtml();
        addKeyPressEvent(cityFrame);
        hotEventProxy = cityHot;
        scrollEventProxy = cityTop;
        popUpCityFrame = cityFrame;
        cityFrame.id = ID.cityFrame;
        cityFrame.className = CLAZZ.cityFrame;
        cityTop.className = CLAZZ.cityTop;
        cityList.id = ID.cityList;
        cityList.className = CLAZZ.cityList;
        cityCont.className = CLAZZ.cityCont;
        cityCont.appendChild(cityContentHtml);
        cityTop.appendChild(cityTopHtml);
        cityList.appendChild(cityCont);
        cityFrame.appendChild(cityTop);
        cityFrame.appendChild(cityList);
        return cityFrame;
    }

    var citypicker = {
        version: "2.0",
        point: {left: 0, top: 0},
        callback: function () {
        },
        show: function () {
            var lenght = arguments.length,
                options,
                point = citypicker.point,
                callback = citypicker.callback;
            if (lenght == 2) {
                point = arguments[0];
                callback = arguments[1];
            } else {
                options = arguments[0];
                if (options && typeof options === "object") {
                    point.left = options.left || citypicker.point;
                    point.top = options.top || citypicker.top;
                    callback = options.selected || citypicker.callback;
                }
            }
            var docCityFrame = doc.getElementById(ID.cityFrame);
            if (!popUpCityFrame || !docCityFrame) {
                popUpCityFrame = createFrame();
                addScrollEvent(scrollEventProxy, "click");
                addKeyPressEvent(doc);
                doc.body.appendChild(popUpCityFrame);
            }
            citypicker.fix(point);
            citypicker.bind(callback);
            popUpCityFrame.style.display = "block";
            return this;
        },
        close: function () {
            if (popUpCityFrame) {
                popUpCityFrame.style.display = "none";
            }
        },
        getSelectedCity: function () {
            return selectedCity;
        },
        fix: function (point) {
            if (point && typeof point === "object") {
                var left = parseInt(point.left, 10) || 0,
                    top = parseInt(point.top, 10) || 0;
                citypicker.point = {left: left, top: top};
                if (popUpCityFrame) {
                    popUpCityFrame.style.left = left + "px";
                    popUpCityFrame.style.top = top + "px";
                }
            }
            return this;
        },
        bind: function (callback) {
            if (toString.call(callback) === "[object Function]") {
                citypicker.callback = callback;
                if (popUpCityFrame !== null) {
                    addSelectEvent(selectEventProxy, "click", callback);//table
                    addSelectEvent(hotEventProxy, "click", callback);//热门城市
                }
            }
            return this;
        }
    };
    window.citypicker = citypicker;
})(window);