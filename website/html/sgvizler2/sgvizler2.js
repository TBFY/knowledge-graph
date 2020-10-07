(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sgvizler2 = {}));
}(this, (function (exports) { 'use strict';

    var sgvizler2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get sgvizler () { return sgvizler; },
        get bordercloud () { return bordercloud; },
        get google () { return google$1; },
        get d3 () { return d3$1; },
        get leaflet () { return leaflet; },
        get VERSION () { return VERSION; },
        get HOMEPAGE () { return HOMEPAGE; },
        get containerLoadAll () { return containerLoadAll; },
        get containerDraw () { return containerDraw; },
        get containerDrawAll () { return containerDrawAll; },
        get selectDraw () { return selectDraw; },
        get selectDrawAll () { return selectDrawAll; },
        get getChartDoc () { return getChartDoc; },
        get getChartOptions () { return getChartOptions; },
        get encodeHtml () { return encodeHtml; },
        get decodeHtml () { return decodeHtml; },
        get giveHTMLAndScript () { return giveHTMLAndScript; },
        get showTabHtmlAndScript () { return showTabHtmlAndScript; },
        get create () { return create; }
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * Define the type of patterns for the options
     *
     * @class sgvizler.CHART_PATTERN_OPTIONS
     * @memberof sgvizler
     */
    var CHART_PATTERN_OPTIONS;
    (function (CHART_PATTERN_OPTIONS) {
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["EMPTY"] = 0] = "EMPTY";
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["UNKNOWN"] = 1] = "UNKNOWN";
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["VARIABLE"] = 2] = "VARIABLE";
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["STYLE"] = 3] = "STYLE";
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["CLASS"] = 4] = "CLASS";
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["WIKI"] = 5] = "WIKI";
        CHART_PATTERN_OPTIONS[CHART_PATTERN_OPTIONS["OBJECT"] = 6] = "OBJECT";
    })(CHART_PATTERN_OPTIONS || (CHART_PATTERN_OPTIONS = {}));
    /**
     * Abstract class for all the charts. Ensures that chart types
     * correctly inherit methods from this class.
     * @class sgvizler.Chart
     * @abstract
     * @export
     * @memberof sgvizler
     */
    class Chart {
        /**
         * Constructor of all chart types created by
         * sgvizler.charts inherit from.
         * @memberof sgvizler.Chart
         * @constructor sgvizler.Chart
         */
        constructor() {
            /**
             * Give the options of chart
             * @property options
             * @memberof sgvizler.Chart
             * @public
             * @type {{}}
             */
            this.options = {};
            this._tabDependences = [];
            this._patternOptions = CHART_PATTERN_OPTIONS.EMPTY;
            this._width = '';
            this._height = '';
            this._optionsRaw = '';
            this._class = '';
            this._style = '';
            this._width = '100%';
            this._isDone = false;
            let currentThis = this;
            Loader.on('loaded', () => {
                if (currentThis.container != null &&
                    !currentThis._isDone &&
                    currentThis.isLoadedAllDependencies() &&
                    currentThis._resultSparql !== null &&
                    currentThis._resultSparql !== undefined) {
                    currentThis.doDraw();
                }
            });
        }
        loadDependenciesAndDraw(result) {
            return __awaiter(this, void 0, void 0, function* () {
                Logger.log(this.container, 'Chart loaded dependencies : ' + this.container.id);
                // let promisesArray: Array<any> = []
                this._resultSparql = result;
                if (this.isLoadedAllDependencies()) {
                    yield this.doDraw();
                }
                else {
                    yield this.loadDependencies();
                }
            });
        }
        loadDependencies() {
            return __awaiter(this, void 0, void 0, function* () {
                let promisesArray = [];
                for (let dep of this._tabDependences) {
                    promisesArray.push(dep.load());
                }
                return Promise.all(promisesArray);
            });
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {CHART_PATTERN_OPTIONS}
         */
        get patternOptions() {
            return this._patternOptions;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {string}
         */
        get classHtml() {
            return this._class;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @param {string} value
         */
        set classHtml(value) {
            this._class = value;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {string}
         */
        get style() {
            return this._style;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @param {string} value
         */
        set style(value) {
            this._style = value;
        }
        /**
         *
         * @memberof sgvizler.Chart
         * @returns {Container}
         */
        get container() {
            return this._container;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @param {Container} value
         */
        set container(value) {
            this._container = value;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {string}
         */
        get optionsRaw() {
            return this._optionsRaw;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @param {string} value
         */
        set optionsRaw(value) {
            this._optionsRaw = value;
            this.doParseOptionsRaw();
        }
        /**
         * To read new options for interactive chart
         */
        get newOptionsRaw() {
            return this.optionsRaw;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {string}
         */
        get height() {
            return this._height;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @param {string} value
         */
        set height(value) {
            this._height = value;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {string}
         */
        get width() {
            return this._width;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @param {string} value
         */
        set width(value) {
            this._width = value;
        }
        /**
         * Todo
         * @memberof sgvizler.Chart
         * @returns {string}
         */
        getHTMLStyleOrClass() {
            let html = '';
            let opts = this.options;
            if (this._patternOptions === CHART_PATTERN_OPTIONS.CLASS) {
                html = Object.keys(opts).map((property) => '${opts[property]}').join(' ');
                html = 'class="' + html + '"';
            }
            if (this._patternOptions === CHART_PATTERN_OPTIONS.STYLE) {
                html = Object.keys(opts).map((property) => '${property}:${opts[property]}').join(';');
                html = 'style="' + html + '"';
            }
            return html;
        }
        addScript(url, loadBefore) {
            let dep = new ScriptDependency(url, loadBefore);
            this._tabDependences.push(dep);
            return dep;
        }
        addCss(url, loadBefore) {
            let dep = new CssDependency(url, loadBefore);
            this._tabDependences.push(dep);
            return dep;
        }
        isLoadedAllDependencies() {
            for (let dep of this._tabDependences) {
                if (!Loader.isLoaded(dep)) {
                    return false;
                }
            }
            return true;
        }
        doDraw() {
            Logger.log(this.container, 'Chart started : ' + this._container.id);
            let currentThis = this;
            let isEmpty = false;
            if (currentThis._resultSparql === null
                || currentThis._resultSparql === undefined) {
                isEmpty = true;
            }
            else {
                let cols = currentThis._resultSparql.head.vars;
                let rows = currentThis._resultSparql.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                if (noCols === 0) {
                    isEmpty = true;
                }
            }
            if (isEmpty) {
                Logger.displayFeedback(currentThis._container, MESSAGES.ERROR_DATA_EMPTY);
                Logger.log(currentThis.container, 'Chart finished with error : ' + currentThis._container.id);
            }
            else {
                currentThis.draw(currentThis._resultSparql).then(function (valeur) {
                    currentThis._isDone = true;
                    Logger.log(currentThis.container, 'Chart finished : ' + currentThis._container.id);
                    Logger.fireDoneEvent(currentThis._container);
                }, function (error) {
                    console.log(error);
                    Logger.displayFeedback(currentThis._container, MESSAGES.ERROR_CHART, [error]);
                    Logger.log(currentThis.container, 'Chart finished with error : ' + currentThis._container.id);
                });
            }
        }
        // noinspection JSValidateJSDoc
        // noinspection tslint
        /**
         * todo
         * @memberof sgvizler.Chart
         * @param {RegExp} patternOption
         * @param {CHART_PATTERN_OPTIONS} typePattern
         */
        execPattern(patternOption, typePattern) {
            let matchArray;
            let raw = this._optionsRaw;
            while ((matchArray = patternOption.exec(raw)) !== null) { // tslint:disable-line
                // this.options[matchArray[1].toLowerCase()] = matchArray[2].trim()
                // this.options[matchArray[1]] = matchArray[2].trim()
                Tools.assignProperty(this.options, matchArray[1], matchArray[2].trim());
                this._patternOptions = typePattern;
            }
        }
        /**
         * todo
         * @memberof sgvizler.Chart
         */
        doParseOptionsRaw() {
            // 3 possibilities
            // pattern option : separate by optionA=a|optionB=b
            // pattern style : any options, only style separate by ;
            // pattern class : words separate by space
            // noinspection TsLint
            let patternOption = /\|? *([^=]*) *= *([^=|]*)/iy; // tslint:disable-line
            let patternStyle = /([^:]+):([^:;]+) *;?/iy; // tslint:disable-line
            let patternClass = /([^ |;]+) ?/iy; // tslint:disable-line
            let patternWiki = /\!? *([^=]*) *= *([^=!]*)/iy; // tslint:disable-line
            let raw = this._optionsRaw;
            if (raw === '') {
                this._patternOptions = CHART_PATTERN_OPTIONS.EMPTY;
            }
            else {
                this._patternOptions = CHART_PATTERN_OPTIONS.UNKNOWN;
            }
            if (this._optionsRaw.indexOf('{') === 0 && this.patternOptions === CHART_PATTERN_OPTIONS.UNKNOWN) {
                //this.execPattern(patternObject,CHART_PATTERN_OPTIONS.OBJECT) // todo ?
                this._patternOptions = CHART_PATTERN_OPTIONS.OBJECT;
            }
            if (this._optionsRaw.indexOf('|') === -1 && this.patternOptions === CHART_PATTERN_OPTIONS.UNKNOWN) {
                this.execPattern(patternWiki, CHART_PATTERN_OPTIONS.WIKI);
            }
            if (this.patternOptions === CHART_PATTERN_OPTIONS.UNKNOWN) {
                this.execPattern(patternOption, CHART_PATTERN_OPTIONS.VARIABLE);
            }
            if (this.patternOptions === CHART_PATTERN_OPTIONS.UNKNOWN) {
                this.execPattern(patternStyle, CHART_PATTERN_OPTIONS.STYLE);
            }
            if (this.patternOptions === CHART_PATTERN_OPTIONS.UNKNOWN) {
                let matchArray;
                let raw = this._optionsRaw;
                let i = 0;
                while ((matchArray = patternClass.exec(raw)) !== null) { // tslint:disable-line
                    this.options['class' + i] = matchArray[2];
                    this._patternOptions = CHART_PATTERN_OPTIONS.UNKNOWN;
                    i++;
                }
            }
            if (this.patternOptions === CHART_PATTERN_OPTIONS.UNKNOWN) {
                Logger.displayFeedback(this.container, MESSAGES.ERROR_CHART_PATTERN_OPTION_UNKNOWN, [this._optionsRaw]);
            }
            else if (this.patternOptions === CHART_PATTERN_OPTIONS.WIKI ||
                this.patternOptions === CHART_PATTERN_OPTIONS.VARIABLE ||
                this.patternOptions === CHART_PATTERN_OPTIONS.STYLE) {
                if (this.options['width'] !== undefined) {
                    this.width = this.options['width'];
                }
                if (this.options['height'] !== undefined) {
                    this.height = this.options['height'];
                }
            }
        }
    }

    /**
     * Todo Table
     * @class sgvizler.visualization.Table
     * @tutorial sgvizler_visualization_Table
     * @memberof sgvizler.visualization
     */
    class Table extends Chart {
        get icon() {
            return 'fa fa-table';
        }
        get label() {
            return 'Table';
        }
        get subtext() {
            return 'simple table';
        }
        get classFullName() {
            return 'sgvizler.visualization.Table';
        }
        get tutorialFilename() {
            return 'tutorial-sgvizler_visualization_Table.html';
        }
        constructor() {
            super();
            //  addDependence(SparqlResult)
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Table
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let opt = Object.assign({ headings: 'true' }, currentChart.options);
                let cols = result.head.vars;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                // console.log(opt)
                let html = '<table ' + currentChart.getHTMLStyleOrClass() + ' >';
                if (opt.headings === 'true') {
                    html += '<tr>';
                    for (let col of cols) {
                        html += '<th>' + col + '</th>';
                    }
                    html += '</tr>';
                }
                for (let row of rows) {
                    html += '<tr>';
                    for (let col of cols) {
                        html += '<td>' + row[col].value + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                let obj = document.getElementById(currentChart.container.id);
                if (obj) {
                    obj.innerHTML = html;
                }
                // finish
                resolve();
            });
        }
    }

    /**
     * @namespace sgvizler.visualization
     */

    var visualizationNS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Table: Table
    });

    /**
     * Todo
     *
     * @class sgvizler.visualization.Loader
     * @memberof sgvizler.visualization
     */
    class Loader {
        static on(event, fn) {
            if (event === 'loaded') {
                Loader._listCallEvent.push(fn);
            }
        }
        static detectRoot() {
            let resultXpath = document.evaluate('//script[contains(@src,"sgvizler2.js")]/@src', document, null, XPathResult.STRING_TYPE, null);
            let srcScript = resultXpath.stringValue;
            let match = /^(.*)sgvizler2\.js$/.exec(srcScript);
            if (match) {
                Loader._pathScripts = match[1];
            }
        }
        static isLoad(dep) {
            return Loader._load.indexOf(dep.url) !== -1;
        }
        static isLoaded(dep) {
            return Loader._loaded.indexOf(dep.url) !== -1;
        }
        static load(dep) {
            if (dep instanceof ScriptDependency) {
                Loader.loadScript(dep);
            }
            else if (dep instanceof CssDependency) {
                Loader.loadCss(dep);
            }
        }
        static fireEvent(event) {
            for (let call of Loader._listCallEvent) {
                call(event);
            }
        }
        static checkDependenciesToLoad() {
            //filter doublons
            Loader._dependenciesToLoad = Loader._dependenciesToLoad.filter((v, i, a) => a.indexOf(v) === i);
            let len = Loader._dependenciesToLoad.length;
            for (let i = 0; i < len; i++) {
                let dep = Loader._dependenciesToLoad[i];
                if (dep === undefined || Loader.isLoaded(dep)) {
                    //this._dependenciesToLoad.splice(i)
                    delete this._dependenciesToLoad[i];
                }
            }
            Loader._dependenciesToLoad.forEach((dep) => {
                if (dep instanceof ScriptDependency) {
                    Loader.loadScript(dep);
                }
                else if (dep instanceof ScriptDependency) {
                    Loader.loadCss(dep);
                }
            });
        }
        static getAbsoluteURL(url) {
            if (url.match(/^(\/\/|https?)/)) {
                return url;
            }
            else {
                return Loader._pathScripts + url;
            }
        }
        static loadScript(dep) {
            let url = dep.url;
            return new Promise(function (resolve, reject) {
                if (dep.loadBefore && !dep.loadBefore.endDownload) {
                    //Logger.logSimple('Waiting : ' + dep.loadBefore.url + ' before ' + dep.url)
                    Loader._dependenciesToLoad.push(dep);
                    Loader.load(dep.loadBefore);
                    return resolve();
                }
                // include script only once
                if (Loader.isLoad(dep)) {
                    return resolve(); // false;
                }
                else {
                    Loader._load.push(url);
                }
                Logger.logSimple('Loading : ' + dep.url);
                // Adding the script tag to the head as suggested before
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = Loader.getAbsoluteURL(url);
                // Then bind the event to the callback function.
                // There are several events for cross browser compatibility.
                script.onload = function () {
                    Loader._loaded.push(url); // in first
                    dep.callBack();
                    // remember included script
                    Loader.fireEvent('loaded');
                    Loader.checkDependenciesToLoad();
                };
                // Fire the loading
                head.appendChild(script);
            });
        }
        static loadCss(dep) {
            let url = dep.url;
            return new Promise(function (resolve, reject) {
                if (dep.loadBefore && !dep.loadBefore.endDownload) {
                    Loader._dependenciesToLoad.push(dep);
                    Loader.load(dep.loadBefore);
                    return resolve();
                }
                // include script only once
                if (Loader.isLoad(dep)) {
                    return resolve(); // false;
                }
                else {
                    Loader._load.push(url);
                }
                // <link rel="stylesheet" type="text/css" href="../dist/datatables.min.css"/>
                let head = document.getElementsByTagName('head')[0];
                let link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = Loader.getAbsoluteURL(url);
                // Then bind the event to the callback function.
                // There are several events for cross browser compatibility.
                link.onload = function () {
                    Loader._loaded.push(url);
                    Logger.logSimple('Loaded : ' + url);
                    dep.callBack();
                    // remember included script
                    Loader.fireEvent('loaded');
                    Loader.checkDependenciesToLoad();
                };
                // Fire the loading
                head.appendChild(link);
            });
        }
    }
    Loader._load = [];
    Loader._loaded = [];
    Loader._dependenciesToLoad = [];
    Loader._pathScripts = '';
    Loader._listCallEvent = [];

    class Dependency {
        constructor(url, loadBefore) {
            this.url = url;
            this.loadBefore = loadBefore ? loadBefore : null;
            this.endDownload = false;
            this.startDownload = false;
        }
        load() {
            if (!this.isLoaded()) {
                this.startDownload = true;
                Logger.logSimple('Load started :' + this.url);
                Loader.load(this);
            }
        }
        isLoaded() {
            if (Loader.isLoaded(this)) {
                this.startDownload = true;
                this.endDownload = true;
            }
            return this.endDownload;
        }
        callBack() {
            this.endDownload = true;
            Logger.logSimple('Load ended :' + this.url);
        }
    }
    class ScriptDependency extends Dependency {
    }
    class CssDependency extends Dependency {
    }

    /**
     * todo
     * @class sgvizler.SparqlError
     * @memberof sgvizler
     */
    class SparqlError {
        static getErrorMessageWithStatus200(xhr) {
            let patternWikidata = /MalformedQueryException: *(.*)/m; // tslint:disable-line
            let errorWikidata = patternWikidata.exec(xhr.response);
            if (errorWikidata !== null) {
                return errorWikidata[1];
            }
            return xhr.response;
        }
        static getErrorWithOtherStatus(xhr, url) {
            let linkError = '<a href="' + url + '" target="_blank">See this error</a>';
            let message = '';
            if (xhr.status === 0) {
                if (xhr.statusText !== '') {
                    message = xhr.statusText + '(' + xhr.status + ')';
                }
                else {
                    message = 'You need to allow running insecure content in your navigator or this SPARQL service doesn\'t exist or timed out or CORS violation or no Access-Control-Allow-Origin header set. (see console log)';
                }
            }
            else {
                message = xhr.statusText + '(' + xhr.status + ')';
            }
            return message + '<br/>\n' + linkError;
        }
    }

    /**
     *
     * @memberof gvizler
     */
    class Select {
        /**
         *
         * @param {string} elementID
         * @returns {Promise<void>}
         */
        static drawWithElementId(elementID) {
            return __awaiter(this, void 0, void 0, function* () {
                let element = document.getElementById(elementID);
                if (element) {
                    yield Select.draw(element);
                }
            });
        }
        /**
         *
         * @param {Element} element
         * @param options
         * @returns {Promise<void>}
         */
        static draw(element, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let nodesOption = Select.getSelectOptions(options);
                for (let node of nodesOption) {
                    element.appendChild(node.cloneNode(true));
                }
            });
        }
        /**
         * todo
         */
        static drawAll() {
            let nodesOption = Select.getSelectOptions();
            let nodesSnapshot = document.evaluate("//select[contains(@class, '" + Select.CLASS_NAME + "')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
                for (let node of nodesOption) {
                    // @ts-ignore
                    nodesSnapshot.snapshotItem(i).appendChild(node.cloneNode(true));
                }
            }
        }
        /**
         * Build url of chart's doc
         * @param {string} classFullName
         * @param {string} pathDoc
         * @returns {string} absolute or relative URL
         */
        static getChartDoc(classFullName, pathDoc) {
            let chartClass = Tools.getObjectByPath(classFullName);
            let path = '';
            if (pathDoc !== undefined) {
                path = pathDoc;
            }
            else {
                path = Core.DOCPATH;
            }
            return path + chartClass.tutorialFilename;
        }
        static getSelectOptions(options) {
            let chartClass;
            let nodeOption;
            let nodeOptgroup;
            let attrLabel;
            let attrValue;
            let attrIcon;
            let attrSub;
            let attrSelected;
            let nodes = [];
            // todo: write the option selected in the doc
            let classSelected = options && options.selected ? options.selected : this.classOfChartSelectedByDefault;
            for (let optgroup of this.charts) {
                nodeOptgroup = document.createElement('optgroup');
                attrLabel = document.createAttribute('label');
                attrLabel.value = optgroup.label;
                nodeOptgroup.setAttributeNode(attrLabel);
                for (let chart of optgroup.charts) {
                    chartClass = Tools.getObjectByPath(chart);
                    nodeOption = document.createElement('option');
                    attrIcon = document.createAttribute('data-icon');
                    attrIcon.value = chartClass.icon;
                    attrSub = document.createAttribute('data-subtext');
                    // todo: write the option subtext in the doc
                    if (options.subtext === 'classFullName') {
                        attrSub.value = chartClass.classFullName;
                    }
                    else {
                        attrSub.value = chartClass.subtext;
                    }
                    attrValue = document.createAttribute('value');
                    attrValue.value = chartClass.classFullName;
                    if (classSelected === chart) {
                        attrSelected = document.createAttribute('selected');
                        nodeOption.setAttributeNode(attrSelected);
                    }
                    nodeOption.text = chartClass.label;
                    nodeOption.setAttributeNode(attrIcon);
                    nodeOption.setAttributeNode(attrSub);
                    nodeOption.setAttributeNode(attrValue);
                    nodeOptgroup.appendChild(nodeOption);
                }
                nodes.push(nodeOptgroup);
            }
            return nodes;
        }
    }
    Select.CLASS_NAME = 'sgvizler-select';
    Select.classOfChartSelectedByDefault = 'bordercloud.visualization.DataTable';
    /**
     * Stores the charts
     */
    Select.charts = [
        {
            // optgroup
            label: 'bordercloud.visualization',
            charts: [
                'bordercloud.visualization.DataTable',
                'bordercloud.visualization.PivotTable'
            ]
        },
        // { // not ready
        //     // optgroup
        //     label: 'd3.visualization',
        //     charts: [
        //         /*'d3.visualization.AreaChart',
        //         'd3.visualization.BarChart',
        //         'd3.visualization.BubbleChart',
        //         'd3.visualization.ColumnChart',*/
        //         'd3.visualization.Line',
        //         'd3.visualization.Pie'
        //         /*,
        //         'd3.visualization.ScatterChart'
        //         */
        //     ]
        // },
        {
            // optgroup
            label: 'leaflet.visualization',
            charts: [
                'leaflet.visualization.Map'
            ]
        },
        {
            // optgroup
            label: 'google.visualization',
            charts: [
                'google.visualization.AnnotationChart',
                'google.visualization.AreaChart',
                'google.visualization.BarChart',
                'google.visualization.BubbleChart',
                'google.visualization.Calendar',
                'google.visualization.CandlestickChart',
                'google.visualization.ColumnChart',
                'google.visualization.ComboChart',
                'google.visualization.GeoChart',
                'google.visualization.Histogram',
                'google.visualization.IntervalChart',
                'google.visualization.LineChart',
                'google.visualization.Map',
                // 'google.visualization.OrgChart',
                'google.visualization.Pie',
                'google.visualization.ScatterChart',
                'google.visualization.SteppedAreaChart',
                'google.visualization.Table',
                'google.visualization.Trendline',
                'google.visualization.Timeline',
                'google.visualization.TreeMap'
            ]
        },
        {
            // optgroup
            label: 'sgvizler.visualization',
            charts: [
                'sgvizler.visualization.Table'
            ]
        }
    ];

    /**
     * todo
     * @class sgvizler.MESSAGES
     * @memberof sgvizler
     */
    var MESSAGES;
    (function (MESSAGES) {
        MESSAGES[MESSAGES["ERROR_CHART_UNKNOWN"] = 0] = "ERROR_CHART_UNKNOWN";
        MESSAGES[MESSAGES["ERROR_CHART_PATTERN_OPTION_UNKNOWN"] = 1] = "ERROR_CHART_PATTERN_OPTION_UNKNOWN";
        MESSAGES[MESSAGES["ERROR_REQUEST"] = 2] = "ERROR_REQUEST";
        MESSAGES[MESSAGES["ERROR_CHART"] = 3] = "ERROR_CHART";
        MESSAGES[MESSAGES["ERROR_DEPENDENCIES"] = 4] = "ERROR_DEPENDENCIES";
        MESSAGES[MESSAGES["ERROR_ENDPOINT_FORGOT"] = 5] = "ERROR_ENDPOINT_FORGOT";
        MESSAGES[MESSAGES["ERROR_DATA_EMPTY"] = 6] = "ERROR_DATA_EMPTY";
        MESSAGES[MESSAGES["ERROR_DATA_NOROW"] = 7] = "ERROR_DATA_NOROW";
    })(MESSAGES || (MESSAGES = {}));
    /**
     *
     * @class sgvizler.Messages
     * @memberof sgvizler
     */
    class Messages {
        static get(id, args) {
            let message = '';
            switch (id) {
                case MESSAGES.ERROR_CHART_UNKNOWN:
                    message = 'The chart $0 does not exist.';
                    break;
                case MESSAGES.ERROR_CHART_PATTERN_OPTION_UNKNOWN:
                    message = "The pattern of chart options is unknown : '$0'" +
                        "Use 'variable1=value1|variable1=value1' or for style 'width:100%;font:red;' or 'class1 class2'";
                    break;
                case MESSAGES.ERROR_REQUEST:
                    message = 'Sorry, the sparql server sent an error. </br> $0';
                    break;
                case MESSAGES.ERROR_CHART:
                    message = 'Sorry, the chart sent an error. </br> $0';
                    break;
                case MESSAGES.ERROR_DEPENDENCIES:
                    message = 'The chart dependencies sent an error. </br> $0';
                    break;
                case MESSAGES.ERROR_ENDPOINT_FORGOT:
                    message = 'The endpoint of Sparql service is forgotten (data-sgvizler-endpoint).';
                    break;
                case MESSAGES.ERROR_DATA_EMPTY:
                    message = 'The resquest sent null.';
                    break;
                case MESSAGES.ERROR_DATA_NOROW:
                    message = 'The resquest sent no row.';
                    break;
            }
            if (args) {
                for (let i = 0, len = args.length; i < len; i++) { // tslint:disable-line
                    message = message.replace('$' + i, args[i]);
                }
            }
            return message;
        }
    }

    /**
     * Todo comment
     * @class sgvizler.Tools
     * @memberof sgvizler
     */
    class Tools {
        // noinspection JSValidateJSDoc
        /**
         * Gets the object located at `path` from `object`. `path`
         * is given in dot notation.
         * Search in first in the library and after in window object
         * @param {string} path
         * @param object
         * @returns { any }  or undefined
         */
        static getObjectByPath(path, object) {
            let i;
            let len;
            let segments = path.split('.');
            let cursor = object || sgvizler2; // search in the lib if object is empty
            for (i = 0, len = segments.length; i < len; i += 1) {
                if (cursor === undefined) { // create new child element.
                    break;
                }
                if (i < len - 1) {
                    cursor = cursor[segments[i]]; // if cursor is undefined, it remains undefined.
                }
                else {
                    try {
                        cursor = new cursor[segments[i]](); // create an instance
                    }
                    catch (e) {
                        // do nothing
                        // cursor[segments[i]]() is not a constructor]
                        cursor = undefined;
                    }
                }
            }
            if (cursor === undefined && !object) { // window is the global scope.
                cursor = this.getObjectByPath(path, window);
            }
            return cursor;
        }
        static assignProperty(obj, path, value) {
            return Tools.assignJSON(obj, Tools.getJSONByPath(path, value));
        }
        // public static escapeHtml (str: string): string {
        //     let text = document.createTextNode(str)
        //     let div = document.createElement('div')
        //     div.appendChild(text)
        //     return div.innerHTML
        // }
        // public static decodeHtml (html: string): any {
        // //     let element = document.createElement('div')
        // //     element.innerHTML = html
        // //     return element.textContent
        // // }
        // // function decodeHTMLEntities(text) {
        // }
        static encodeHtml(str) {
            let buf = [];
            for (let i = str.length - 1; i >= 0; i--) {
                // let iC = str.charCodeAt(i)
                // if (iC < 65 || iC > 127 ) { //|| (iC>90 && iC<97)
                //     buf.unshift(['&#', iC, ';'].join(''))
                // } else {
                //     buf.unshift(str[i])
                // }
                switch (str[i]) {
                    case '&':
                        buf.unshift('&amp;');
                        break;
                    case '"':
                        buf.unshift('&quot;');
                        break;
                    case "'":
                        buf.unshift('&apos;');
                        break;
                    case '<':
                        buf.unshift('&lt;');
                        break;
                    case '>':
                        buf.unshift('&gt;');
                        break;
                    // case '':
                    //     buf.unshift(['&#', str.charCodeAt(i), ';'].join(''))
                    //     break;
                    default:
                        buf.unshift(str[i]);
                }
            }
            return buf.join('');
        }
        static decodeHtml(str) {
            let text = str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
            // remove \u00a0 of &nbsp;
            text = text.replace(/(?:[^\S\r\n]|\u00a0)/g, function (match, dec) {
                return ' ';
            });
            return text;
        }
        static getJSONByPath(path, value) {
            let json = '';
            let propertyName = '';
            let nextPath = '';
            if (path.length === 0 || !value) {
                return json;
            }
            let positionDot = path.search(/\./);
            if (positionDot === -1) {
                propertyName = path.trim();
                if (Number.isNaN(Number(value))) {
                    let valueBoolean = Tools.convertToBoolean(value);
                    if (valueBoolean === undefined) {
                        let str = JSON.stringify(String(value));
                        str = str.substring(1, str.length - 1);
                        json = '{"' + propertyName + '":"' + str + '"}';
                    }
                    else {
                        json = '{"' + propertyName + '":' + value + '}';
                    }
                }
                else {
                    json = '{"' + propertyName + '":' + value + '}';
                }
            }
            else {
                propertyName = path.substring(0, positionDot);
                nextPath = path.substring(positionDot + 1, path.length);
                json = '{"' + propertyName.trim() + '": ' + Tools.getJSONByPath(nextPath, value) + ' }';
            }
            return json;
        }
        static assignJSON(obj, json) {
            Tools.mergeInObject(obj, JSON.parse(json));
            return obj;
        }
        static convertToBoolean(input) {
            if (input.length <= 5) {
                try {
                    return JSON.parse(input);
                }
                catch (e) {
                    return undefined;
                }
            }
            return undefined;
        }
        // Convert to typescript : https://github.com/gmasmejean/recursiveAssign/blob/master/index.js
        static assign(ref, key, value) {
            if (Tools.isPlainObject(value)) {
                if (!Tools.isPlainObject(ref[key])) {
                    ref[key] = {};
                }
                Tools.mergeInObject(ref[key], value);
            }
            else {
                ref[key] = value;
            }
        }
        static mergeInObject(dest, data) {
            Object.keys(data).forEach(key => {
                Tools.assign(dest, key, data[key]);
            });
        }
        static isPlainObject(o) {
            return o !== undefined && o.constructor !== undefined && o.constructor.prototype === Object.prototype;
        }
        static sizeConvertInteger(x) {
            var val = x;
            // Fix bug: TypeError: x.replace is not a function
            if (typeof x !== 'number') {
                val = parseInt(x.replace("px", ""), 10);
            }
            if (isNaN(val)) {
                return null;
            }
            return val;
        }
    }

    /**
     * Handles all logging, either to console or designated HTML
     * container.
     *
     * @class sgvizler.Logger
     * @memberof sgvizler
     */
    class Logger {
        static done(callback) {
            this._doneCallEvent = callback;
            return this;
        }
        static fireDoneEvent(container) {
            container.loadingIcon.hide();
            if (this._doneCallEvent) {
                this._doneCallEvent(container.id);
            }
        }
        static fail(callback) {
            this._failCallEvent = callback;
            return this;
        }
        static fireFailEvent(container) {
            container.loadingIcon.hide();
            if (this._failCallEvent) {
                this._failCallEvent(container.id);
            }
        }
        /**
         * Logs a message.
         * @method log
         * @protected
         * @param {string} message The message to log.
         */
        static log(container, message) {
            if (container.loglevel === 2) {
                console.log(this.elapsedTime() + 's: ' + message);
            }
        }
        static logSimple(message) {
            console.log(this.elapsedTime() + 's: ' + message);
        }
        /**
         * Todo
         * @param {Container} container
         * @param {MESSAGES} messageName
         * @param {Array<string>} args
         */
        static displayFeedback(container, messageName, args) {
            let message = Messages.get(messageName, args);
            if (container.loglevel === 2) {
                if (message) {
                    let obj = document.getElementById(container.id);
                    if (obj) {
                        obj.innerHTML = "<p style='color:red'>" + message + '</p>';
                    }
                }
            }
            Logger.fireFailEvent(container);
        }
        /**
         * @method timeElapsed
         * @private
         * @return {number} The number of seconds elapsed since
         * this sgvizler got loaded.
         */
        static elapsedTime() {
            return (Date.now() - this._startTime) / 1000;
        }
    }
    /**
     * The timestamp for the load start of the current running
     * version of sgvizler. Used to calculate time elapse of
     * future events.
     */
    Logger._startTime = Date.now();

    /**
     *
     * @class sgvizler.Core
     * @memberof sgvizler
     */
    class Core {
        /**
         * todo
         * @returns {string}
         */
        static get path() {
            return this._path;
        }
        /**
         * todo
         * @param {string} value
         */
        static set path(value) {
            this._path = value;
        }
    }
    /**
     * The version number of this sgvizler2.
     * @static
     * @readonly
     * @type {string} VERSION
     */
    Core.VERSION = '0.0';
    /**
     * sgvizler2's homepage.
     * @static
     * @readonly
     * @type {string} HOMEPAGE
     */
    Core.HOMEPAGE = 'https://bordercloud.github.io/sgvizler2/index.html';
    /**
     * sgvizler2's docs path
     * @static
     * @readonly
     * @type {string} DOCPATH
     */
    Core.DOCPATH = 'https://bordercloud.github.io/sgvizler2/';
    Core._path = '';

    /**
     *
     * @class sgvizler.SPARQL_RESULT
     * @memberof sgvizler
     */
    var SPARQL_RESULT;
    (function (SPARQL_RESULT) {
        SPARQL_RESULT[SPARQL_RESULT["xml"] = 0] = "xml";
        SPARQL_RESULT[SPARQL_RESULT["json"] = 1] = "json";
        SPARQL_RESULT[SPARQL_RESULT["jsonp"] = 2] = "jsonp";
    })(SPARQL_RESULT || (SPARQL_RESULT = {}));
    /**
     *
     * @class sgvizler.SparqlTools
     * @memberof gvizler
     */
    class SparqlTools {
        static getOutputLabel(id) {
            let str = '';
            switch (id) {
                case SPARQL_RESULT.xml:
                    str = 'xml';
                    break;
                case SPARQL_RESULT.json:
                    str = 'json';
                    break;
                case SPARQL_RESULT.jsonp:
                    str = 'jsonp';
                    break;
            }
            return str;
        }
        static getXMLHttpRequestResponseType(id) {
            let type = '';
            switch (id) {
                case SPARQL_RESULT.xml:
                    type = ''; // 	DOMString (this is the default value for xhr)
                    break;
                case SPARQL_RESULT.json:
                case SPARQL_RESULT.jsonp:
                    type = 'json';
                    break;
            }
            return type;
        }
        static getHeaderAccept(id) {
            let str = '';
            switch (id) {
                case SPARQL_RESULT.xml:
                    str = 'application/sparql-results+xml';
                    break;
                case SPARQL_RESULT.json:
                case SPARQL_RESULT.jsonp:
                    str = 'application/sparql-results+json';
                    break;
            }
            return str;
        }
        static convertString(label) {
            let result = SPARQL_RESULT.json;
            switch (label) {
                case 'xml':
                    result = SPARQL_RESULT.xml;
                    break;
                case 'json':
                    result = SPARQL_RESULT.json;
                    break;
                case 'jsonp':
                    result = SPARQL_RESULT.jsonp;
                    break;
            }
            return result;
        }
    }

    /**
     * Important class. Runs SPARQL query against SPARQL
     * endpoints.
     *
     * Dependencies:
     *
     *   - sgvizler.util
     *   - sgvizler.namespace
     *   - sgvizler.registry
     *   - sgvizler.parser
     *   - sgvizler.loader
     *   - sgvizler.logger
     *   - sgvizler.defaults
     *   - jQuery
     *   - google.visualization
     *
     *
     * Example of how to use the Query class:
     *
     *     var sparqlQueryString = "SELECT * {?s ?p ?o} LIMIT 10",
     *         containerID = "myElementID",
     *         Q = new sgvizler.Query();
     *
     *     // Note that default values may be set in the sgvizler object.
     *     Q.query(sparqlQueryString)
     *         .endpointURL("http://dbpedia.org/sparql")
     *         .endpointOutputFormat("json")                    // Possible values 'xml', 'json', 'jsonp'.
     *         .chartFunction("google.visualization.BarChart")  // The name of the function to draw the chart.
     *         .draw(containerID);                              // Draw the chart in the designated HTML element.
     *
     * @class sgvizler.Request
     * @memberof sgvizler
     */
    class Request {
        constructor() {
            this._query = '';
            this._endpoint = '';
            this._endpointOutputFormat = SPARQL_RESULT.json;
            this._method = 'GET';
            this._queryParameter = 'query';
            this.listeners = {};
        }
        // private _endpointResultsUrlPart: string
        // // private _chartPathFunction: string
        // private _endpointURL: string
        /**
         *
         * @returns {string}
         */
        get method() {
            return this._method;
        }
        /**
         *
         * @param {string} value
         */
        set method(value) {
            this._method = value;
        }
        /**
         *
         * @returns {Container}
         */
        get container() {
            return this._container;
        }
        /**
         *
         * @param {Container} value
         */
        set container(value) {
            this._container = value;
        }
        /**
         * Get query string.
         * @method query
         * @public
         * @return {string}
         */
        get query() {
            return this._query;
        }
        /**
         * Set query string.
         * @method query
         * @public
         * @chainable
         * @param value
         */
        set query(value) {
            this._query = value;
        }
        /**
         * Get endpoint URL.
         * @method endpointURL
         * @public
         * @return {string}
         */
        get endpoint() {
            return this._endpoint;
        }
        /**
         * Set endpoint URL.
         * @method endpointURL
         * @public
         * @chainable
         * @example
         *     sgvizler.endpointURL('http://sparql.dbpedia.org');
         *   sets this Query object's endpoint to DBpedia.
         * @param value
         */
        set endpoint(value) {
            this._endpoint = value;
        }
        /**
         * Get endpoint output format.
         * @method endpointOutputFormat
         * @public
         * @return {string}
         */
        get endpointOutputFormat() {
            return this._endpointOutputFormat;
        }
        /**
         * Set endpoint output format. Legal values are `'xml'`,
         * `'json'`, `'jsonp'`.
         * @method endpointOutputFormat
         * @public
         * @chainable
         * @param value
         */
        set endpointOutputFormat(value) {
            this._endpointOutputFormat = value;
        }
        /**
         * todo
         * @returns {string}
         */
        get queryParameter() {
            return this._queryParameter;
        }
        /**
         * todo
         * @param {string} value
         */
        set queryParameter(value) {
            this._queryParameter = value;
        }
        sendRequest() {
            let myRequest = this;
            // Create new promise with the Promise() constructor;
            // This has as its argument a function
            // with two parameters, resolve and reject
            return new Promise(function (resolve, reject) {
                // Standard XHR to load an image
                let xhr = new XMLHttpRequest();
                let data;
                let url = myRequest.endpoint;
                if (myRequest.method.toLowerCase() === 'get') {
                    url += '?' + myRequest.queryParameter + '=' + encodeURIComponent(myRequest.query) +
                        '&output=' + SparqlTools.getOutputLabel(myRequest.endpointOutputFormat);
                }
                else {
                    data = myRequest.queryParameter + '=' + encodeURIComponent(myRequest.query);
                }
                xhr.open(myRequest.method, url, true);
                xhr.setRequestHeader('Accept', SparqlTools.getHeaderAccept(myRequest.endpointOutputFormat));
                // hide errors xhr.responseType = SparqlTools.getXMLHttpRequestResponseType(myRequest.endpointOutputFormat)
                // TODO check progress
                xhr.onprogress = function (oEvent) {
                    if (oEvent.lengthComputable) {
                        let percentComplete = (oEvent.loaded / oEvent.total) * 100;
                        console.log('onprogress' + percentComplete);
                    }
                };
                // When the request loads, check whether it was successful
                xhr.onload = function (options) {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            // If successful, resolve the promise by passing back the request response
                            resolve(JSON.parse(xhr.response));
                        }
                        else {
                            // If it fails, reject the promise with a error message
                            reject(SparqlError.getErrorMessageWithStatus200(xhr));
                        }
                    }
                };
                xhr.onerror = () => reject(SparqlError.getErrorWithOtherStatus(xhr, url));
                // Send the request
                if (data) {
                    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
                    xhr.send(data);
                }
                else {
                    xhr.send();
                }
                // console.log(myRequest.query)
            });
        }
    }

    /**
     *
     * @class sgvizler.
     * @memberof sgvizler
     */
    var CONTAINER_STATE;
    (function (CONTAINER_STATE) {
        CONTAINER_STATE[CONTAINER_STATE["FAILED"] = 0] = "FAILED";
        CONTAINER_STATE[CONTAINER_STATE["LOADED"] = 1] = "LOADED";
        CONTAINER_STATE[CONTAINER_STATE["LOADING"] = 2] = "LOADING";
    })(CONTAINER_STATE || (CONTAINER_STATE = {}));
    /**
     * Draws charts specified in HTML containers, here we call them
     * "sgvizler-containers".
     *
     * Example of use: The following sgvizler-container will be
     * selected by sgvizler due to the use of designated
     * attributes. The result is a pie chart (draw with
     * `google.visualization.PieChart`) showing the number of instance
     * per class in the endpoint at
     * `http://sws.ifi.uio.no/sparql/ndp`.
     *
     *     <div id="ex1"
     *          data-sgvizler-endpoint="http://sws.ifi.uio.no/sparql/npd"
     *          data-sgvizler-query="SELECT ?class (count(?instance) AS ?noOfInstances)
     *                               WHERE{ ?instance a ?class }
     *                               GROUP BY ?class
     *                               ORDER BY ?class"
     *          data-sgvizler-chart="google.visualization.PieChart"
     *          style="width:800px; height:400px;"></div>
     *
     * These container must have an id attribute (or else sgvizler
     * will not know where to put the chart) and a query attribute (or
     * else the container will be ignored by sgvizler).
     *
     * Dependencies:
     *
     *  - sgvizler.util
     *  - sgvizler.loader
     *  - sgvizler.logger
     *  - sgvizler.Query
     *  - jQuery
     * @class sgvizler.Container
     * @memberof sgvizler
     */
    class Container {
        /**
         * Collects values designated for sgvizler in the given.
         * See also property PREFIX.
         * @param {string} elementID The ID for which the attributes should be collected.
         */
        constructor(elementID) {
            this._lang = 'en';
            this._chartOptions = '';
            this._chartName = '';
            this._loglevel = 0;
            this._id = '';
            // step 1 : read parameters and create the object Query
            // pre-condition
            let element = document.getElementById(elementID);
            if (element === null) {
                throw new Error('elementID unknown : ' + elementID);
            }
            let self = Container;
            this._state = CONTAINER_STATE.LOADING;
            let elmAttrs = element.attributes;
            // read basic parameters
            if (elmAttrs[self.LANG]) {
                this._lang = elmAttrs[self.LANG].value;
            }
            if (elmAttrs[self.LOG_LEVEL_ATTRIBUTE_NAME]) {
                this._loglevel = parseInt(elmAttrs[self.LOG_LEVEL_ATTRIBUTE_NAME].value, 10);
            }
            if (elmAttrs[self.CHART_ATTRIBUTE_NAME]) {
                this._chartName = elmAttrs[self.CHART_ATTRIBUTE_NAME].value;
                // This code will disappear but it's necessary for the migration with the old Sgvizler
                switch (this._chartName) {
                    case 'google.visualization.AnnotatedTimeLine':
                    case 'google.visualization.Gauge':
                    case 'google.visualization.ImageSparkLine':
                    case 'google.visualization.MotionChart':
                    case 'sgvizler.visualization.D3ForceGraph':
                    case 'sgvizler.visualization.DefList"':
                    case 'sgvizler.visualization.DraculaGraph':
                    case 'sgvizler.visualization.List':
                    case 'sgvizler.visualization.Text':
                    case 'sgvizler.visualization.MapWKT':
                        {
                            console.warn('Sgvizler2 : ' + this._chartName + ' is deprecated. Please choose another chart.');
                            this._chartName = 'bordercloud.visualization.DataTable';
                            break;
                        }
                    case 'sgvizler.visualization.Map':
                        {
                            console.warn('Sgvizler2 : ' + this._chartName + ' is obsolete. Please choose leaflet.visualization.Map or another chart.');
                            this._chartName = 'leaflet.visualization.Map';
                            break;
                        }
                    case 'google.visualization.GeoMap':
                        {
                            console.warn('Sgvizler2 : ' + this._chartName + ' is obsolete. Please choose google.visualization.Map or another chart.');
                            this._chartName = 'google.visualization.Map';
                            break;
                        }
                    case 'google.visualization.PieChart':
                        {
                            console.warn('Sgvizler2 : ' + this._chartName + ' is obsolete. Please choose google.visualization.Pie or another chart.');
                            this._chartName = 'google.visualization.Pie';
                            break;
                        }
                }
            }
            if (elmAttrs[self.CHART_OPTION_ATTRIBUTE_NAME]) {
                this._chartOptions =
                    Tools.decodeHtml(elmAttrs[self.CHART_OPTION_ATTRIBUTE_NAME].value);
            }
            // build request object
            let request = new Request();
            request.container = this;
            this._id = elementID;
            if (elmAttrs[self.QUERY_ATTRIBUTE_NAME]) {
                request.query = Tools.decodeHtml(elmAttrs[self.QUERY_ATTRIBUTE_NAME].value);
            }
            if (elmAttrs[self.ENDPOINT_ATTRIBUTE_NAME]) {
                request.endpoint = Tools.decodeHtml(elmAttrs[self.ENDPOINT_ATTRIBUTE_NAME].value);
            }
            else {
                this._state = CONTAINER_STATE.FAILED;
                Logger.displayFeedback(this, MESSAGES.ERROR_ENDPOINT_FORGOT);
                return;
            }
            if (elmAttrs[self.OUTPUT_FORMAT_ATTRIBUTE_NAME]) {
                request.endpointOutputFormat = SparqlTools.convertString(elmAttrs[self.OUTPUT_FORMAT_ATTRIBUTE_NAME].value);
            }
            if (elmAttrs[self.OUTPUT_METHOD_ATTRIBUTE_NAME]) {
                request.method = elmAttrs[self.OUTPUT_METHOD_ATTRIBUTE_NAME].value;
            }
            if (elmAttrs[self.QUERY_PARAMETER_ATTRIBUTE_NAME]) {
                request.queryParameter = elmAttrs[self.QUERY_PARAMETER_ATTRIBUTE_NAME].value;
            }
            this._request = request;
            // build the chart object
            let chart = Tools.getObjectByPath(this.chartName);
            if (chart === undefined) {
                this._state = CONTAINER_STATE.FAILED;
                Logger.displayFeedback(this, MESSAGES.ERROR_CHART_UNKNOWN, [this.chartName]);
            }
            else {
                chart.container = this;
                // read with and height of container before chart options
                try {
                    let element = $('#' + elementID);
                    let widthCss = element.css('width');
                    let heightCss = element.css('height');
                    if (widthCss !== null) {
                        chart.width = widthCss;
                    }
                    if (heightCss !== null && heightCss !== '0px') {
                        chart.height = heightCss;
                    }
                }
                catch (e) {
                    // do nothing, unit test not support jquery
                }
                // read options (and replace may be with and height)
                chart.optionsRaw = this._chartOptions;
                this._chart = chart;
            }
            this.saveRefOfContainer();
        }
        /**
         * Save the reference of container
         */
        saveRefOfContainer() {
            let index = -1;
            let len = Container.list.length;
            for (let i = 0; i < len; i++) {
                let dep = Container.list[i];
                if (this.id === Container.list[i].id) {
                    //this._dependenciesToLoad.splice(i)
                    index = i;
                }
            }
            if (index != -1) {
                Container.list[index] = this;
            }
            else {
                Container.list.push(this);
            }
        }
        /**
         * Draws the sgvizler-containers with the given element id.
         * @method containerDraw
         * @param {string} elementID
         * @param options
         * @returns {Promise<void>}
         */
        static drawWithElementId(elementID, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let container = new Container(elementID);
                // console.log(container)
                container._loadingIcon = new LoadingIcon(container);
                container.loadingIcon.show();
                Logger.log(container, 'drawing id: ' + elementID);
                yield container.draw();
            });
        }
        // noinspection JSValidateJSDoc
        /**
         * Draws all sgvizler-containers on page.
         * @returns {Promise<any>}
         */
        static drawAll() {
            let promisesArray = [];
            let ids = [];
            let iterator = document.evaluate('//div[@' + Container.PREFIX + 'query]/@id', document, null, XPathResult.ANY_TYPE, null);
            let thisNode = iterator.iterateNext();
            while (thisNode) {
                ids.push(thisNode.value);
                thisNode = iterator.iterateNext();
            }
            for (let id of ids) {
                promisesArray.push(Container.drawWithElementId(id));
            }
            return Promise.all(promisesArray);
        }
        static loadDependenciesId(elementID, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let container = new Container(elementID);
                // console.log(container)
                Logger.log(container, 'Load dependencies id: ' + elementID);
                yield container.loadDependencies();
            });
        }
        static loadAllDependencies() {
            let promisesArray = [];
            let ids = [];
            let iterator = document.evaluate('//div[@' + Container.PREFIX + 'query]/@id', document, null, XPathResult.ANY_TYPE, null);
            let thisNode = iterator.iterateNext();
            while (thisNode) {
                ids.push(thisNode.value);
                thisNode = iterator.iterateNext();
            }
            for (let id of ids) {
                promisesArray.push(Container.loadDependenciesId(id));
            }
            return Promise.all(promisesArray);
        }
        /**
         *
         * @param {string} elementID
         * @param {string} endpoint
         * @param {string} query
         * @param {string} chartName
         * @param {string} options
         * @param {string} loglevel
         * @returns {string}
         */
        static create(elementID, endpoint, query, chartName, options, loglevel, output, method, parameter, lang) {
            let element = document.getElementById(elementID);
            if (element === null) {
                throw new Error('elementID unknown : ' + elementID);
            }
            let self = Container;
            let attrQuery = document.createAttribute(self.QUERY_ATTRIBUTE_NAME);
            let attrEndpoint = document.createAttribute(self.ENDPOINT_ATTRIBUTE_NAME);
            let attrChart = document.createAttribute(self.CHART_ATTRIBUTE_NAME);
            // attrQuery.value = Tools.escapeHtml(query)
            attrQuery.value = query;
            attrEndpoint.value = endpoint;
            attrChart.value = chartName;
            element.setAttributeNode(attrQuery);
            element.setAttributeNode(attrEndpoint);
            element.setAttributeNode(attrChart);
            if (options) {
                let attrOptions = document.createAttribute(self.CHART_OPTION_ATTRIBUTE_NAME);
                attrOptions.value = options;
                element.setAttributeNode(attrOptions);
            }
            if (loglevel) {
                let attrLevel = document.createAttribute(self.LOG_LEVEL_ATTRIBUTE_NAME);
                attrLevel.value = loglevel;
                element.setAttributeNode(attrLevel);
            }
            if (output) {
                let attrOutput = document.createAttribute(self.OUTPUT_FORMAT_ATTRIBUTE_NAME);
                attrOutput.value = output;
                element.setAttributeNode(attrOutput);
            }
            if (method) {
                let attrMethod = document.createAttribute(self.OUTPUT_METHOD_ATTRIBUTE_NAME);
                attrMethod.value = method;
                element.setAttributeNode(attrMethod);
            }
            if (parameter) {
                let attrQueryAttribut = document.createAttribute(self.QUERY_PARAMETER_ATTRIBUTE_NAME);
                attrQueryAttribut.value = parameter;
                element.setAttributeNode(attrQueryAttribut);
            }
            if (lang) {
                let attrQueryAttribut = document.createAttribute(self.LANG);
                attrQueryAttribut.value = lang;
                element.setAttributeNode(attrQueryAttribut);
            }
            return element.innerHTML;
        }
        /**
         *
         * @returns {string}
         */
        get id() {
            return this._id;
        }
        /**
         *
         * @returns {string}
         */
        get lang() {
            return this._lang;
        }
        /**
         * Get the name of chart object.
         * @returns {string}
         */
        get chartName() {
            return this._chartName;
        }
        /**
         * Get the loading icon of container.
         * @returns {string}
         */
        get loadingIcon() {
            return this._loadingIcon;
        }
        ///////////////////////////////////// OPTIONS
        /**
         *
         * @returns {string}
         */
        get chartOptions() {
            return this._chartOptions;
        }
        /**
         *
         * @returns {Chart}
         */
        get chart() {
            return this._chart;
        }
        /**
         *
         * @returns {Request}
         */
        get request() {
            return this._request;
        }
        /**
         *
         * @returns {number}
         */
        get loglevel() {
            return this._loglevel;
        }
        /**
         *
         * @returns {Promise<void>}
         */
        draw() {
            return __awaiter(this, void 0, void 0, function* () {
                let sparqlResult;
                if (this._state === CONTAINER_STATE.FAILED) {
                    return;
                }
                try {
                    sparqlResult = yield this.request.sendRequest();
                    // console.log(queryResult)
                }
                catch (error) {
                    console.log(error);
                    Logger.displayFeedback(this, MESSAGES.ERROR_REQUEST, [error]);
                    this._state = CONTAINER_STATE.FAILED;
                }
                if (this._state === CONTAINER_STATE.FAILED) {
                    return;
                }
                let sparqlResultI = sparqlResult;
                if (sparqlResultI.head === undefined) {
                    console.log(sparqlResultI);
                    Logger.displayFeedback(this, MESSAGES.ERROR_CHART, ['ERROR_head_undefined']);
                    this._state = CONTAINER_STATE.FAILED;
                }
                try {
                    this._chart.loadDependenciesAndDraw(sparqlResultI);
                }
                catch (error) {
                    console.log(error);
                    Logger.displayFeedback(this, MESSAGES.ERROR_CHART, [error]);
                    this._state = CONTAINER_STATE.FAILED;
                }
            });
        }
        loadDependencies() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this._chart.loadDependencies();
                }
                catch (error) {
                    console.log(error);
                    Logger.displayFeedback(this, MESSAGES.ERROR_DEPENDENCIES, [error]);
                    this._state = CONTAINER_STATE.FAILED;
                }
            });
        }
    }
    Container.list = [];
    Container.LANG = 'lang';
    Container.PREFIX = 'data-sgvizler-';
    Container.QUERY_ATTRIBUTE_NAME = Container.PREFIX + 'query';
    Container.ENDPOINT_ATTRIBUTE_NAME = Container.PREFIX + 'endpoint';
    Container.OUTPUT_FORMAT_ATTRIBUTE_NAME = Container.PREFIX + 'endpoint-output-format';
    Container.QUERY_PARAMETER_ATTRIBUTE_NAME = Container.PREFIX + 'endpoint-query-parameter';
    Container.OUTPUT_METHOD_ATTRIBUTE_NAME = Container.PREFIX + 'endpoint-method';
    Container.CHART_ATTRIBUTE_NAME = Container.PREFIX + 'chart';
    Container.CHART_OPTION_ATTRIBUTE_NAME = Container.PREFIX + 'chart-options';
    Container.LOG_LEVEL_ATTRIBUTE_NAME = Container.PREFIX + 'log';

    /**
     * @class sgvizler.LoadingIcon
     * @memberof sgvizler
     */
    class LoadingIcon {
        constructor(container) {
            this._rotation = 0;
            this._container = container;
        }
        show() {
            let currentLoadingcon = this;
            let obj = document.getElementById(this._container.id);
            if (obj) {
                obj.innerHTML = "<canvas class='imageWait' " +
                    "style='position: relative;top: 50%;left: 50%;transform: translate(-50%, -50%);margin:100px auto;'></canvas>";
                let canvas = obj.getElementsByTagName('canvas')[0];
                let width = Tools.sizeConvertInteger(this._container.chart.width);
                let height = Tools.sizeConvertInteger(this._container.chart.height);
                canvas.setAttribute('width', (width) ? this._container.chart.width : "100");
                canvas.setAttribute('height', (height) ? this._container.chart.height : "100");
                var image = new Image();
                image.onload = function () {
                    currentLoadingcon._processusWaiting = setInterval(function () {
                        let ctx = canvas.getContext('2d');
                        if (ctx) {
                            let xcenter = ctx.canvas.width / 2, ycenter = ctx.canvas.height / 2, sourceWidth = 65, sourceHeight = 65;
                            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                            ctx.save();
                            ctx.translate(xcenter, ycenter); // to get it in the origin
                            currentLoadingcon._rotation += 2;
                            ctx.rotate(currentLoadingcon._rotation * Math.PI / 64); //rotate in origin
                            ctx.drawImage(image, -sourceWidth / 2, -sourceHeight / 2);
                            ctx.restore();
                        }
                    }, 20);
                };
                image.src = LoadingIcon._imgWait;
            }
        }
        hide() {
            let obj = document.getElementById(this._container.id);
            if (obj) {
                let canvas = obj.getElementsByTagName('canvas')[0];
                if (canvas) {
                    canvas.style.display = 'none';
                }
            }
            clearInterval(this._processusWaiting);
        }
    }
    LoadingIcon._imgWait = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9sGDRIEDlVx9CwAAA9ASURBVHja7Vt7dFXVnf6+fW5yc0lCSICQF+j4FkWFaFFSGZlplUDRmemCjuNyqp2po85gRZAQxMXVqiSAxpHWTl0dx+k4dsRHfRWsj+IDSuvioSJWK4MP4JIAIZD3fe1v/rj3hiTcc27AhC7Xmp2VtXLv2edk729/v9e39yFOYFvw8/NyzUgzxTHmTgteSva9LgAEYIWnTVx14c59HzbM2d011OPiiQKgZs2k74OsIXFqarKCRByB4qjPwjYLu2xF9dZffKVBuOGnlVmF4/Q4wDlg30lmailQJK1uajz43ceu/6x7KMZohhqEwnF6lOQc4tgASKwQKUgk54wpKVq34Ofn5X7lmHD7mguqHOOs13EA0J8REAnqvU7bOnnVjB3hrwwTDMx4ajBWikya0vkBFtz21fIJQZhFF1d2AMgZlMEKEIEOa4tXzdi6f7CG6Tuemw7dXnyqMb5zSZXSKFcwEUItiuMLmfbtw5e1NSdBsHgpUiYnewmhiwQWEaLA4QBKQTh0iQzpmmXCLHJpHgMw80/ChI6akmoZPkDyFEgOAAOSkARCACzEuIAPBd2Tv2zvs6l7Z6+GU9hSaQCgpbCbuR0dZnTxiLNgzI0O8H2QxkIyGYAQJCO2RKyddP/MrZ+fMBDaakqnGgcrAH4NSq4aXQYrCSSVSAb2Avb+eFfnfxQ0tB70DqOYT+JmCmNthlBKAVa6sn7GlhdPiGNsqy39oTF8VUoAAAKuAABA8loiJKKUMCt9gdzP22tLr3W75ZF/2hytr95c19raPd5Sa6FEaHRlAwGCM/p///LwYNGgM6F9cUkdYWpSq3t88S01GVLEY9HOznmFDx465HXLopcn3QPwDjc/kXSQH9VN33w2AKwrCZ6c7cPvSRbDAqJ+K+Ffo3vwwjQEu4+bCe21pcsoU9N7dY/P4MjEL0DguqycwHsHa8rGed1SN33LEgn3pJKldEwQcFbqs9+H+0kWQxAMAHKKIf4nqwIfv116Z+VxgdBeM2YCgRp4UPK4MTEc5zfY2Hxb0VivfvXVm++E9EI6JiQYAty8+py85FcVqYTiCL0JQ44zPt+m9WXBK4+dCca8qtQKDnZLRJIyv9+/qWVRycmeXWOcay3a+rMhBUx+IKcIACzwm3QZ1pHp8LkN5XfdNGAQ2haV3ExyDDUAFhzVR50SmiU1WalJwEFAnX1rZRJWIlnsM+a/113mnqvUz9r8haH9katZ+KIBAOiORB5EXBaC0jk9URDVsG508LSMIGy6AVkGvFoD8QOS1NNHj8iqWnF7cVT2QnZFJ3Z3RSfGIvELbcROjktTBbtA0NsSoGRuQWHKRVNK/93TP1RvXSzgcDqziMbYDgDf2HffPhn8ovfq92eOIf1+P9ZljA5ttSWjCfMxiULPyYMk1S7wJ3n3hRYeizVsugFZZxWW3QdH11EYCZJRiytG1IVecdciKheAWNEfhrrpm02SX9gwNnguwW1yC3mCEiDp9im7gitdmUCrkkwAJJIEPR2O85xjBQAALnwE0bz60O3Rzq7TrXgLADjAXV73xOJ4iVBH7xAJKZICAACqdgU/sMDb9KjCIAjCtasr5gXcfYLjTHBdfAACCdlVucv2zi6qD33xpXSGBw8dyq8L/ShqO4pInNlaW3yJW9/mA82fCdjbO0SC3Hp0cRFfmqkclTChzBaM9nCMttTTZogVucsabxnMYDGi7nBLZyw63sCpd+uTVJS29GWCPSoihPaYDQLCGUI0Sc50BUEWXe61gNYcD/0H0opX7G8E47Nba0sv9SicXlFvJoiv9e8zGrAAdmQMasQ33X0CuNPFF9hY1P7LUEoPeffta4rGw5+6rmAMm4xSKhOabVQf9e+zH9tF4UCGqAYC4131hO5wZFtOINsSTIBjJRhSsgtHrGxKO8B1COZkVdhppKkieAak0QIFqygMPgft1ojMq9N2BzOu0KrlB0Nu1zqdtk+HsSBRg0DvLr9qayg9YxCjJwsIQWNcQWiJNR8oU+lmAReBCfuRxa/y6hr7hJQNZcHL6aAa4BUAzgacI0MgQYvfw8HTsTh+YyLdn0Qca18trCn4Zkv9YW8hCtYVoHd2tC+6uDI5kfgPPKYZ8KoLmfAp7a4gnL4K4QPzIn8dCPg3Ahgrq4aVdXsXpK6/XX7XbMfoISuMAuijTRpUTwxGxNr49Nf2mDeDCNrBNJea8ZX5FGCBp+ur39uerk8LCk05OWYARd3nnvLaqIbmPQD6VHlvld1Z5RhnOYUpsIQRhISulNCBBYp6Yc+uw387Bw1DsmMUz8VZJBAJq9Y17Fbk+iCckkkqkrT+mDTG9RXBFSTnEvD3ejh7pHCQApZU7QreO5SO06GulOVPGq7a4upbylUw0y117lPuxOLPDAiEdaODef4cPippNhN075dSSAmfoYeqQkMLwOzV52STLK+r3nyddw7gnXlCEMFQuNv5ZCAg0O/nawAmE1RadAlKerQqFPwBhridnJczNhrDAq8+G8qDfyFiPC3kyobEmNdOOxQ8lBGEDRV3vShiMvvV5UfCJijwvardS/8BQ98IdXfcP2v7Ae8+XOwJQGLo4a6OrgUZ9YTfli9tIDGTaWrzpGcFQMStvocT07Ri5vZGrw5vjQ1eRQd/6e5Vkax9MD1dmO4DwobiJafKmJukjJRaNTUU3OI1sPkvVo66LHh8mzvH0taVByt84C+RjrWpEtoBYfXgpbuDb2QUVZjt+xkBPz0oJWH/QYtFnjF9zcTqLEbibwQRG0oAVmO24yfX9Ew2vRhJWd0/ZU9wXkZ57a2S4HiQl8HNDHrSTj0zKxTsdLt+23PnjgXN+XXf2tYy1CworzjnFRET3FhgAWuhB6r2BD2dag9dHR9udKVUXyY873U9K8f/kOJ2SEPmGsz1F1SMfIXkVPQ33eRnKx2itdd9PXT38wOV3AnhokwsAIBYGOtdzeDlSXMozYhFo01DBcDrI+8oL6gYtYvA1D6KUW8ByOLNaBhjq0J3Px8EzK55CHgJuj4AWD9qYR7IwkwsgNA8bX+wPd2lhc+fmU9wJYgmOv5BT51fLawpGJYbqIV4Kwl/QkIGQPVsDUh6XMJPq0JL1wPA/ltHlQ4LZP8boAsuuoSfHJzc9e2i+pbDaUHo9jvZAavAkY1yV3/wB9dAnZV7GYCxkD63XeHBKJ6Y9P7l2cACEf9M0pc68ZVUe0Sx0UoPh3i4Yc7uI3VLa23+SIfZOwXkMHHOZVw2A/8FtFzp6hMGOK5mD8NalNQhHRPIcd3eC91QNqzskVBnplX3+wPlxnACqYkCDIEfJ8o1tcqyScZ+GrfxD/48dO+u9MPJawCQw5QylkjzZzXPLRo+ctXB1qNAcDr8ceUp5mkNFgAxIt2lBc+eV0xwSnL9hikeDrg9pqAoeiaArV4gJBOawwA+BPDksVKovab4fILXJpM79hZK/cP8lwD49VGOsetQcxctWyGv7XAB0NlpK7xA1rwjIqhGMDsr3z11dSJtC0vPHirH2VZbMhrG96ZSKX5PoksmNB9bnjY6zMCqMBx84bXrlNyaLF4/amF+Guv9Ts8BLdL4yEluz2nsbNwBB0uGrtDgMyQKiIQ0eLSXMT73jFF4yjXz6i1S+nKm9k+PjVBgE2dTQAEErnF7xOmrEAa4o7227OPWhaPOHKzJH543vKh9cenLBC/tYwb9ywixyRWEqt3Bx5UpWSKhLDOrj1PJio2xlD+1V5jcGJnuVTes3RG6m9Qpji/7/bba0h9+WQDaa8ZMcAJ570O8Qm4mndpAstEPPWsHWc1ThoOHFL79Yllw2JGbfIUUsnqn6wDwtcmT7nB7xpynEEdcfwUg25BL2mpL97UtLpvbNr9k/PbZyB5Q3TAbTsei0RPba0t/Rsd5n0A5k+Kwqz0DkYIV+z9JG4t7pLRRC/MZGPYu4/wzOB5FFPRA1a7gfAC4fU3l5YZYQ/ZIzonjNMBOG2m/YPlVH7e5rmBt2ZMk5vR6cjuAZgDvWqtXrNUWY7GzMdx0OMcHM4xFo3z+7AmOeAXI6aQqBA7rOUaQYSddssvzljXWeDLh6weWtzGO+V4AQBAtb3u99I6TEv847mPCCHpFEgDEKSY79xue4ml3+02SmqSUJ2cehHEAryLNjx3H2WiynabSvLLuokBZZ05Ozhc+ml/R8BYSZwAcxl5e21NYlGICVmYspQFgSij4nJWu8XSSBgg4Wd9L/GniQnobEvifXiAUNLQe7O6OVEJoPhLPk6ffiJ4TCV/2vIxICnw2f1njgQGBAABf3x18QlbzRYWPAuNIwXJaMvB3gUdvmgiSAfIXra38tdcARzU077GMzRJxqLcDGzRZSgCFMLsitwLpF9U1va3aE3xAMVwKYVtPxFDyJ7HFnTxbbFoARdLEa8Ypgbi8Zs0kz43c4cv2bbSKTAbwvz0nZAcFAImSYvH4ZbkPHtibUVRJy4i9wU1Tdi89z1pcJ2inqDZL2yHZUES4BwA6aRsBhtOdKTKp9xUM6xeuraz1BuLAHw8fwHmA3ukj6h43AgDBGGD/sWB50+8yVmoD1vNKgidnmZj/tZDvk97bbDUvT/ojwdNd/Ggq/SCsXgq3h7/bMGf7Qc+4v7js7wSsMsCxn1Dt2URGMxj/Tt59Ta8PqFz9sm3R2klBgUu9Xu+xvU6nCvamfXtbHnvs+s/CbnaaqANK74Uw1xC5Ak3yQGgmG4hL2NDZGptZ/PD+9gHX7F+2LXz+zHzjz2vNzNDEUf0kTE2S1hnLjaI+iMftLphom8KOXfk37+9L3XNoUUGhg5zLaZzplKYBPOmoUSdywU9l8cu49GTB8sZ3jlm4GBw2VD4B4uqBm2wvM0kmWLZ3OBSeiu2PXr/y79/v6H3fphuQddqI0vMdg5No6Fdcu9tauCmTRnFCQLhtzfkTs+n8TkQWMUgnYaUdHWqtXDVjRyuGsA3aO1APzHhvq4Bn3U6fHrtzl0Celsu8IgxxG9QXweqrt1xtpY2DBQSklg6x4ysFAgCwjdWw+kOmFzcysYAgLdkwmC98DblPSBM2Hwd5Te9JDSTFSx4XDAu8a3n15mU4AW1IXwlc9NKkShg+QeKMxIsa6cFIfU8BlniHscjVdd/athMnqJ2QF8Zr1kysFnmjEU6HYTGs8kBkAYiBbBO0D8JHhH2orvrdN3CCG0/kP7t59Tl52cNz8n2RaE5cPsdhLG7khNvDkdaH52xvx/+3P137P1CQBU4FOFvrAAAAAElFTkSuQmCC";

    // Doc: 11-052r4_OGC_GeoSPARQL_-_A_Geographic_Query_Language_for_RDF_Data.pdf
    class WktLiteral {
        constructor(spatialReferenceSystem) {
            this.spatialReferenceSystem = spatialReferenceSystem !== null && spatialReferenceSystem !== void 0 ? spatialReferenceSystem : 'http://www.wikidata.org/entity/Q42274'; //by default : Earth
        }
        static create(raw) {
            try {
                // Point(LONG LAT): A single point as described above (Note the lack of a comma)
                const regexPoint = /^(?:\s*<([^>]+)>\s+)?Point\s*\(([^\s]+) +([^\s]+)\)$/i;
                const resultPoint = raw.match(regexPoint);
                if (resultPoint != null) {
                    return new PointWktLiteral(resultPoint[2], resultPoint[3], resultPoint[1]);
                }
                // Linestring(LONG1 LAT1, LONG2 LAT2, ..., LONGN LATN): A line connecting the specified points (Commas between each point)
                const regexLinestring = /^(?:\s*<([^>]+)>\s+)?Linestring\s*\((.+)\)$/i;
                const regexLonLatList = /([^\s,]+?)\s+([^\s,]+)/g;
                const resultLinestring = raw.match(regexLinestring);
                if (resultLinestring != null) {
                    let resultLinestringList = resultLinestring[2].matchAll(regexLonLatList);
                    const line = new LinestringWktLiteral(resultLinestring[1]);
                    for (const match of resultLinestringList) {
                        line.push(new PointWktLiteral(match[1], match[2], resultLinestring[1]));
                    }
                    return line;
                }
                // Envelope(minLong, maxLong, maxLat, minLat): A rectangle with the specified corners (Note the commas between each and especially note the somewhat odd ordering of (min, max, max, min)).
                const regexEnvelope = /^(?:\s*<([^>]+)>\s+)?Envelope\s*\(\s*([^\s,]+)\s*,\s*([^\s]+)\s*,\s*([^\s]+)\s*,\s*([^\s]+)\s*\)$/i;
                const resultEnvelope = raw.match(regexEnvelope);
                if (resultEnvelope != null) {
                    return new EnvelopeWktLiteral(resultEnvelope[2], resultEnvelope[3], resultEnvelope[4], resultEnvelope[5], resultEnvelope[1]);
                }
                // Polygon(LONG1 LAT1, LONG2 LAT2, ..., LONGN LATN, LONG1 LAT1): A filled-in shape with the specified points (Note that a polygon must start and end with the same point, i.e., be closed)
                const regexPolygon = /^(?:\s*<([^>]+)>\s+)?Polygon\s*\(\(([^\(\)]+)\)\)$/i;
                const resultPolygon = raw.match(regexPolygon);
                if (resultPolygon != null) {
                    let resultPolygonList = resultPolygon[2].matchAll(regexLonLatList);
                    const polygon = new PolygonWktLiteral(resultPolygon[1]);
                    for (const match of resultPolygonList) {
                        polygon.push(new PointWktLiteral(match[1], match[2], resultPolygon[1]));
                    }
                    return polygon;
                }
                //https://docs.microsoft.com/fr-fr/sql/relational-databases/spatial/multipolygon?view=sql-server-ver15
                const regexMultiPolygon = /^(?:\s*<([^>]+)>\s+)?(?:MULTI)?POLYGON\s*\((.+)\)$/i;
                const regexPolygonList = /\(\(?(.+?)\)\)?/g;
                const resultMultiPolygon = raw.match(regexMultiPolygon);
                if (resultMultiPolygon != null) {
                    let resultPolygonList = resultMultiPolygon[2].matchAll(regexPolygonList);
                    const multipolygon = new MultiPolygonWktLiteral(resultMultiPolygon[1]);
                    for (const matchPolygon of resultPolygonList) {
                        let resultPointList = matchPolygon[1].matchAll(regexLonLatList);
                        let polygon = new PolygonWktLiteral(resultMultiPolygon[1]);
                        for (const match of resultPointList) {
                            polygon.push(new PointWktLiteral(match[1], match[2], resultMultiPolygon[1]));
                        }
                        multipolygon.push(polygon);
                    }
                    return multipolygon;
                }
            }
            catch (e) {
                if (e instanceof ErrorWktLiteral) {
                    throw new ErrorWktLiteral("Parsing error. " + e.message + ": " + raw);
                }
                else {
                    throw e;
                }
            }
            throw new ErrorWktLiteral("Parsing error. Unknown syntax: " + raw);
        }
        static getNumber(value, parameterName) {
            if (typeof value === 'number') {
                return value;
            }
            else {
                const valueNumber = parseFloat(value);
                if (!isNaN(valueNumber)) {
                    return valueNumber;
                }
                else {
                    throw new ErrorWktLiteral("Value " + value + " of " + parameterName + " is not a number");
                }
            }
        }
    }
    class PointWktLiteral extends WktLiteral {
        constructor(long, lat, spatialReferenceSystem) {
            super(spatialReferenceSystem);
            this.long = WktLiteral.getNumber(long, "Point:longitude");
            this.lat = WktLiteral.getNumber(lat, "Point:latitude");
        }
        equals(obj) {
            if (obj instanceof PointWktLiteral) {
                const p = obj;
                if (p.long === this.long && p.lat === this.lat) {
                    return true;
                }
            }
            return false;
        }
    }
    class LinestringWktLiteral extends WktLiteral {
        constructor() {
            super(...arguments);
            this.points = [];
        }
        push(pointWktLiteral) {
            this.points.push(pointWktLiteral);
        }
    }
    class EnvelopeWktLiteral extends WktLiteral {
        constructor(minLong, maxLong, maxLat, minLat, spatialReferenceSystem) {
            super(spatialReferenceSystem);
            this.minLong = WktLiteral.getNumber(minLong, "Envelope:minLong");
            this.maxLong = WktLiteral.getNumber(maxLong, "Envelope:maxLong");
            this.maxLat = WktLiteral.getNumber(maxLat, "Envelope:maxLat");
            this.minLat = WktLiteral.getNumber(minLat, "Envelope:minLat");
        }
    }
    class PolygonWktLiteral extends WktLiteral {
        constructor() {
            super(...arguments);
            this.points = [];
        }
        push(pointWktLiteral) {
            this.points.push(pointWktLiteral);
        }
    }
    class MultiPolygonWktLiteral extends WktLiteral {
        constructor() {
            super(...arguments);
            this.polygons = [];
        }
        push(polygonWktLiteral) {
            this.polygons.push(polygonWktLiteral);
        }
    }
    class ErrorWktLiteral extends Error {
    }

    /**
     * @namespace sgvizler
     */
    const visualization = visualizationNS;

    var S = /*#__PURE__*/Object.freeze({
        __proto__: null,
        visualization: visualization,
        Loader: Loader,
        Dependency: Dependency,
        ScriptDependency: ScriptDependency,
        CssDependency: CssDependency,
        SparqlError: SparqlError,
        Select: Select,
        get MESSAGES () { return MESSAGES; },
        Messages: Messages,
        Tools: Tools,
        Logger: Logger,
        Core: Core,
        get CHART_PATTERN_OPTIONS () { return CHART_PATTERN_OPTIONS; },
        Chart: Chart,
        get SPARQL_RESULT () { return SPARQL_RESULT; },
        SparqlTools: SparqlTools,
        Request: Request,
        get CONTAINER_STATE () { return CONTAINER_STATE; },
        Container: Container,
        LoadingIcon: LoadingIcon,
        WktLiteral: WktLiteral,
        PointWktLiteral: PointWktLiteral,
        LinestringWktLiteral: LinestringWktLiteral,
        EnvelopeWktLiteral: EnvelopeWktLiteral,
        PolygonWktLiteral: PolygonWktLiteral,
        MultiPolygonWktLiteral: MultiPolygonWktLiteral,
        ErrorWktLiteral: ErrorWktLiteral
    });

    /**
     * Enum for tri-state values.
     * @readonly
     * @enum {number}
     */
    var DATATABLE_COL_OPTIONS;
    (function (DATATABLE_COL_OPTIONS) {
        DATATABLE_COL_OPTIONS[DATATABLE_COL_OPTIONS["TAG"] = 0] = "TAG";
        DATATABLE_COL_OPTIONS[DATATABLE_COL_OPTIONS["STYLE"] = 1] = "STYLE";
    })(DATATABLE_COL_OPTIONS || (DATATABLE_COL_OPTIONS = {}));
    /**
     * This table uses <a href="https://datatables.net/">DataTables.net</a>.
     * You can adapt each column with the option colstyle.
     *
     * @class bordercloud.visualization.DataTable
     * @memberof bordercloud.visualization
     */
    class DataTable extends Chart {
        constructor() {
            super();
            this.addCss(Core.path + 'lib/DataTables/DataTables-1.10.21/css/dataTables.bootstrap4.min.css');
            this.addCss(Core.path + 'lib/DataTables/Responsive-2.2.5/css/responsive.bootstrap4.min.css');
            this.addCss(Core.path + 'lib/DataTables/Buttons-1.6.2/css/buttons.bootstrap4.min.css');
            let jqueryDataTables = this.addScript(Core.path + 'lib/DataTables/DataTables-1.10.21/js/jquery.dataTables.min.js');
            let dataTablesBootstrap4 = this.addScript(Core.path + 'lib/DataTables/DataTables-1.10.21/js/dataTables.bootstrap4.min.js', jqueryDataTables);
            let dataTablesResponsive = this.addScript(Core.path + 'lib/DataTables/Responsive-2.2.5/js/dataTables.responsive.js', dataTablesBootstrap4);
            this.addScript(Core.path + 'lib/DataTables/Responsive-2.2.5/js/responsive.bootstrap4.js', dataTablesResponsive);
            let dataTablesButtons = this.addScript(Core.path + 'lib/DataTables/Buttons-1.6.2/js/dataTables.buttons.min.js', dataTablesBootstrap4);
            let buttonsBootstrap4 = this.addScript(Core.path + 'lib/DataTables/Buttons-1.6.2/js/buttons.bootstrap4.min.js', dataTablesButtons);
            let buttons = this.addScript(Core.path + 'lib/DataTables/Buttons-1.6.2/js/buttons.flash.min.js', buttonsBootstrap4);
            this.addScript(Core.path + 'lib/DataTables/JSZip-2.5.0/jszip.min.js', buttons);
            let pdfmake = this.addScript(Core.path + 'lib/DataTables/pdfmake-0.1.36/pdfmake.min.js', buttons);
            this.addScript(Core.path + 'lib/DataTables/pdfmake-0.1.36/vfs_fonts.js', pdfmake);
            this.addScript(Core.path + 'lib/DataTables/Buttons-1.6.2/js/buttons.html5.min.js', buttons);
            this.addScript(Core.path + 'lib/DataTables/Buttons-1.6.2/js/buttons.print.min.js', buttons);
        }
        /**
         * This function parses colStyle option and build the parameter ColumnDef of DataTable
         * Example :
         * "colStyle=col2_img_max-width:250px;col2_img_border-radius:50%;col2_img_display:block;col2_img_margin:auto;col3_img_max-width:300px;col3_img_max-height:300px;col2_img_opacity:0.5"
         *
         * @param {string} codeStyle
         * @param {number} noCols
         * @returns {Array<any>}
         */
        static buildColumnDefs(codeStyle, noCols) {
            // noinspection Annotator
            let regex = / *col([0-9]+)\_([a-zA-Z]+)\_([^=;\n]*) */ig;
            let m;
            let datasetColumnsDefs = [];
            let datasetColumnsFunc;
            let colOptions = [];
            let optionCol;
            let isModified;
            // init
            for (let c = 0; c < noCols; c++) {
                colOptions[c] = [];
                colOptions[c][DATATABLE_COL_OPTIONS.TAG] = '';
                colOptions[c][DATATABLE_COL_OPTIONS.STYLE] = '';
            }
            // noinspection TsLint
            while ((m = regex.exec(codeStyle)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                optionCol = parseInt(m[1], 10);
                colOptions[optionCol][DATATABLE_COL_OPTIONS.TAG] = m[2];
                colOptions[optionCol][DATATABLE_COL_OPTIONS.STYLE] += m[3] + ';';
            }
            for (let c = 0; c < noCols; c++) {
                isModified = true;
                switch (colOptions[c][DATATABLE_COL_OPTIONS.TAG]) {
                    case 'img':
                        datasetColumnsFunc = this.getFunctionColumnDefImg(colOptions[c][DATATABLE_COL_OPTIONS.STYLE]);
                        break;
                    case 'span':
                        datasetColumnsFunc = this.getFunctionColumnDefSpan(colOptions[c][DATATABLE_COL_OPTIONS.STYLE]);
                        break;
                    /**/
                    case 'video':
                        datasetColumnsFunc = this.getFunctionColumnDefVideo(colOptions[c][DATATABLE_COL_OPTIONS.STYLE]);
                        break;
                    default:
                        isModified = false;
                        datasetColumnsFunc = this.getFunctionColumnDefDefault();
                }
                // noinspection TsLint
                datasetColumnsDefs[c] = {
                    'targets': c,
                    // "data": "description",
                    'render': datasetColumnsFunc,
                    'isModified': isModified
                };
            }
            return datasetColumnsDefs;
        }
        static getFunctionColumnDefDefault() {
            return (function (data, type, full, meta) {
                return data;
            });
        }
        static getFunctionColumnDefImg(style) {
            return (function (data, type, full, meta) {
                return '<img src="' + data + '"  style="' + style + '"\>';
            });
        }
        static getFunctionColumnDefVideo(style) {
            return (function (data, type, full, meta) {
                let youtubePattern = new RegExp('youtu');
                let facebookPattern = new RegExp('facebook');
                let mediawikiPattern = new RegExp('commons\.wikimedia\.org');
                if (youtubePattern.test(data)) {
                    let url = data.replace('watch?v=', 'embed/');
                    return '<iframe  style="' + style + '" src="' + url + '" meta http-equiv="X-Frame-Options" content="allow" frameborder="0" allowfullscreen></iframe>';
                }
                else if (facebookPattern.test(data)) {
                    //data = 'https://www.facebook.com/XXXX/videos/XXXXX/' // example
                    //doc https://developers.facebook.com/docs/plugins/embedded-video-player
                    return '<iframe src="https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(data) + '&show_text=0&width=560" style="border:none;overflow:hidden;' + style + '" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';
                }
                else if (mediawikiPattern.test(data)) {
                    //data = 'https://commons.wikimedia.org/wiki/File%3AAuguste_%26_Louis_Lumi%C3%A8re-_L'Arroseur_arros%C3%A9_(1895).webm' // example
                    //return '<iframe src="' + data + '?embedplayer=false" style="' + style + '" frameborder="0" allowfullscreen></iframe>'
                    //doc http://html5video.org/wiki/Rewriting_HTML5_Media_Elements
                    return '<video controls style="' + style + '"><source src="' + data + '"></video>';
                }
                else {
                    return '<iframe  style="' + style + '" src="' + data + '" meta http-equiv="X-Frame-Options" content="allow" frameborder="0" allowfullscreen></iframe>';
                }
            });
        }
        static getFunctionColumnDefSpan(style) {
            return (function (data, type, full, meta) {
                return '<span style="' + style + '"\>' + data + '</span>';
            });
        }
        get icon() {
            return 'fa fa-table';
        }
        get label() {
            return 'DataTable';
        }
        get subtext() {
            return 'DataTable';
        }
        get classFullName() {
            return 'bordercloud.visualization.DataTable';
        }
        get tutorialFilename() {
            return 'tutorial-bordercloud_visualization_DataTable.html';
        }
        /**
         * Draw a chart
         * Available options:
         * - 'class' :  css class (default: "table table-striped table-bordered")
         * - 'cellspacing'   : cellspacing of table  (default: "0")
         * - 'width'   :  width (default: "100%")
         * - 'colStyle'   :   (default: "")
         *
         * Example :
         * "colStyle=col2_img_max-width:250px;col2_img_border-radius:50%;col2_img_display:block;col2_img_margin:auto;col3_img_max-width:300px;col3_img_max-height:300px;col2_img_opacity:0.5"
         *
         * @param {SparqlResultInterface} result
         * @returns {Promise< any >}
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // precondition
                let obj = document.getElementById(currentChart.container.id);
                if (!obj) {
                    Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART_UNKNOWN, [currentChart.container.id]);
                    return resolve();
                }
                try {
                    const optionsDateTime = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                    let lang = currentChart.container.lang;
                    let cols = result.head.vars;
                    let rows = result.results.bindings;
                    let row;
                    let datasetRow;
                    let noCols = cols.length;
                    let noRows = rows.length;
                    let idChart = currentChart.container.id + '-datatable';
                    let datasetColumns = [];
                    let datasetColumnsDefs;
                    let dataset = [];
                    let tableElement = document.createElement('table');
                    let tableId = document.createAttribute('id');
                    let tableClass = document.createAttribute('class');
                    let tableCellSpacing = document.createAttribute('cellspacing');
                    let tableWidth = document.createAttribute('width');
                    let opt = Object.assign({
                        'class': 'table table-striped table-bordered',
                        'cellspacing': '0',
                        'width': '100%',
                        'colstyle': undefined
                    }, currentChart.options);
                    for (let c = 0; c < noCols; c++) {
                        datasetColumns[c] = { title: cols[c].replace("_", " ") };
                    }
                    if (opt.colstyle !== undefined) {
                        datasetColumnsDefs = DataTable.buildColumnDefs(opt.colstyle, noCols);
                    }
                    for (let r = 0; r < noRows; r++) {
                        row = rows[r];
                        datasetRow = [];
                        // loop cells
                        for (let c = 0; c < noCols; c += 1) {
                            if (row[cols[c]] !== undefined) {
                                if (datasetColumnsDefs === undefined || !datasetColumnsDefs[c].isModified) {
                                    if (row[cols[c]].type === "uri") {
                                        datasetRow[c] = '<a href="' + row[cols[c]].value + '" target="_blank">' + row[cols[c]].value + '</a>';
                                    }
                                    else { //litteral
                                        switch (row[cols[c]].datatype) {
                                            case 'http://www.w3.org/2001/XMLSchema#dateTime':
                                                datasetRow[c] = (new Date(row[cols[c]].value)).toLocaleDateString(lang, optionsDateTime);
                                                break;
                                            case 'http://www.w3.org/2001/XMLSchema#date':
                                                datasetRow[c] = (new Date(row[cols[c]].value)).toLocaleDateString(lang);
                                                break;
                                            default:
                                                datasetRow[c] = row[cols[c]].value;
                                        }
                                    }
                                }
                                else {
                                    datasetRow[c] = row[cols[c]].value;
                                }
                            }
                            else {
                                datasetRow[c] = '';
                            }
                        }
                        dataset[r] = datasetRow;
                    }
                    tableId.value = idChart;
                    tableClass.value = opt.class;
                    tableCellSpacing.value = opt.cellspacing;
                    tableWidth.value = opt.width;
                    tableElement.setAttributeNode(tableId);
                    tableElement.setAttributeNode(tableClass);
                    tableElement.setAttributeNode(tableCellSpacing);
                    tableElement.setAttributeNode(tableWidth);
                    obj.appendChild(tableElement);
                    $.fn.dataTable.Buttons.defaults.dom.button.className = "btn btn-outline-dark btn-sm";
                    $('#' + idChart).DataTable({
                        bSort: false,
                        data: dataset,
                        columns: datasetColumns,
                        columnDefs: datasetColumnsDefs,
                        dom: "<'row'<'col'B><'col-auto'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                        buttons: [
                            {
                                extend: 'csv',
                                text: '<i class="fas fa-lg fa-file-csv align-text-bottom"></i>',
                                titleAttr: 'CSV'
                            },
                            {
                                extend: 'pdf',
                                text: '<i class="fas fa-lg fa-file-pdf align-text-bottom"></i>',
                                titleAttr: 'PDF'
                            },
                            {
                                extend: 'print',
                                text: '<i class="fas fa-lg fa-print align-text-bottom"></i>',
                                titleAttr: 'print'
                            }
                        ],
                        "language": DataTable.geti18n(lang)
                    });
                }
                catch (e) {
                    return reject(e);
                }
                // finish
                return resolve();
            });
        }
        static geti18n(lang) {
            switch (lang) {
                case 'fr':
                    return {
                        "sProcessing": "Traitement en cours...",
                        "sSearch": "Rechercher&nbsp;:",
                        "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
                        "sInfo": "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                        "sInfoEmpty": "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
                        "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                        "sInfoPostFix": "",
                        "sLoadingRecords": "Chargement en cours...",
                        "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
                        "sEmptyTable": "Aucune donn&eacute;e disponible dans le tableau",
                        "oPaginate": {
                            "sFirst": "Premier",
                            "sPrevious": "Pr&eacute;c&eacute;dent",
                            "sNext": "Suivant",
                            "sLast": "Dernier"
                        },
                        "oAria": {
                            "sSortAscending": ": activer pour trier la colonne par ordre croissant",
                            "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
                        }
                    };
                default: //en
                    return {
                        "sEmptyTable": "No data available in table",
                        "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
                        "sInfoEmpty": "Showing 0 to 0 of 0 entries",
                        "sInfoFiltered": "(filtered from _MAX_ total entries)",
                        "sInfoPostFix": "",
                        "sInfoThousands": ",",
                        "sLengthMenu": "Show _MENU_ entries",
                        "sLoadingRecords": "Loading...",
                        "sProcessing": "Processing...",
                        "sSearch": "Search:",
                        "sZeroRecords": "No matching records found",
                        "oPaginate": {
                            "sFirst": "First",
                            "sLast": "Last",
                            "sNext": "Next",
                            "sPrevious": "Previous"
                        },
                        "oAria": {
                            "sSortAscending": ": activate to sort column ascending",
                            "sSortDescending": ": activate to sort column descending"
                        }
                    };
            }
        }
    }

    /**
     * This table uses <a href="https://pivottable.js.org/examples/">PivotTable.js</a>.
     *
     * @class bordercloud.visualization.PivotTable
     * @memberof bordercloud.visualization
     */
    class PivotTable extends Chart {
        //private _pivotUIOptions:any = null;
        constructor() {
            super();
            // let lang = this.container.lang
            this.addCss(Core.path + 'lib/pivottable/dist/pivot.min.css');
            this.addCss(Core.path + 'lib/jquery-ui/jquery-ui.min.css');
            this.addCss(Core.path + 'lib/c3/c3.min.css');
            let dep = this.addScript(Core.path + 'lib/jquery-ui/jquery-ui.min.js');
            let touch = this.addScript(Core.path + 'lib/jquery-ui.touch-punch/jquery.ui.touch-punch.min.js', dep);
            let pivot = this.addScript(Core.path + 'lib/pivottable/dist/pivot.min.js', touch);
            let plotly = this.addScript(Core.path + 'lib/plotly/plotly-latest.min.js', pivot);
            this.addScript(Core.path + 'lib/pivottable/dist/plotly_renderers.js', plotly);
            let d3 = this.addScript(Core.path + 'lib/d3/d3.min.js', pivot);
            let c3 = this.addScript(Core.path + 'lib/c3/c3.min.js', d3);
            this.addScript(Core.path + 'lib/pivottable/dist/d3_renderers.js', d3);
            this.addScript(Core.path + 'lib/pivottable/dist/c3_renderers.js', c3);
            this.addScript(Core.path + 'lib/pivottable/dist/export_renderers.js', pivot);
            let gchart = this.addScript('https://www.gstatic.com/charts/loader.js', pivot);
            this.addScript(Core.path + 'lib/pivottable/dist/gchart_renderers.js', gchart);
            this.addScript(Core.path + 'lib/pivottable/dist/pivot.fr.min.js', pivot);
        }
        static init() {
            google.load("visualization", "1", { packages: ["corechart", "charteditor"] });
            PivotTable._isInit = true;
        }
        get icon() {
            return 'fa fa-table';
        }
        get label() {
            return 'PivotTable';
        }
        get subtext() {
            return 'PivotTable';
        }
        get classFullName() {
            return 'bordercloud.visualization.PivotTable';
        }
        get tutorialFilename() {
            return 'tutorial-bordercloud_visualization_PivotTable.html';
        }
        /**
         * Draw a chart
         * Options are interactives
         *
         * @param {SparqlResultInterface} result
         * @returns {Promise< any >}
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                try {
                    let obj = document.getElementById(currentChart.container.id);
                    if (!obj) {
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART_UNKNOWN, [currentChart.container.id]);
                        return resolve();
                    }
                    let lang = currentChart.container.lang;
                    let cols = result.head.vars;
                    let rows = result.results.bindings;
                    let row;
                    let datasetRow;
                    let noCols = cols.length;
                    let noRows = rows.length;
                    let idContainer = currentChart.container.id;
                    let idChart = currentChart.container.id + '-pivot';
                    let dataset = [];
                    let idSwith = currentChart.container.id + '-showUI';
                    let divElement = document.createElement('div');
                    let divId = document.createAttribute('id');
                    let defaultOptions = {
                        renderers: $.extend($.pivotUtilities.renderers, $.pivotUtilities.plotly_renderers, $.pivotUtilities.d3_renderers, $.pivotUtilities.c3_renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.export_renderers),
                        rendererOptions: {
                            width: Tools.sizeConvertInteger(currentChart.width),
                            height: Tools.sizeConvertInteger(currentChart.height)
                        }
                    };
                    let pivotUIOptions = null;
                    divId.value = idChart;
                    divElement.setAttributeNode(divId);
                    obj.appendChild(divElement);
                    for (let r = 0; r < noRows; r++) {
                        row = rows[r];
                        datasetRow = {};
                        // loop cells
                        for (let c = 0; c < noCols; c += 1) {
                            datasetRow[cols[c]] = row[cols[c]] !== undefined ? row[cols[c]].value : null;
                        }
                        dataset[r] = datasetRow;
                    }
                    try {
                        pivotUIOptions = JSON.parse(currentChart.optionsRaw);
                    }
                    catch (e) {
                        pivotUIOptions = {};
                    }
                    let config = Object.assign(pivotUIOptions, defaultOptions);
                    $('#' + idChart).pivotUI(dataset, config, true, lang);
                    let txtchecked = (config.showUI === true || config.showUI === undefined) ? "checked" : "";
                    $('#' + idContainer).prepend("<div class=\"custom-control custom-switch float-right\"" +
                        "style='z-index: 2; right: 0;'>\n" + //position: absolute;
                        "  <input type=\"checkbox\" class=\"custom-control-input\" id=\"" + idSwith + "\" " + txtchecked + ">\n" +
                        "  <label class=\"custom-control-label\" for=\"" + idSwith + "\"> </label>\n" +
                        "</div>");
                    $('#' + idSwith).on("change", function () {
                        let config = $('#' + idChart).data("pivotUIOptions");
                        config.showUI = this.checked;
                        $('#' + idChart).pivotUI(dataset, config, true, lang);
                    });
                }
                catch (e) {
                    return reject(e);
                }
                // finish
                return resolve();
            });
        }
        get newOptionsRaw() {
            let idChart = this.container.id + '-pivot';
            var config = $('#' + idChart).data("pivotUIOptions");
            return JSON.stringify(config, ['rowOrder', 'rows', 'cols', 'aggregatorName', 'vals', 'rendererName', 'showUI']);
        }
    }
    PivotTable._isInit = false;

    /**
     * @namespace bordercloud.visualization
     */

    var visualizationNS$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        DataTable: DataTable,
        PivotTable: PivotTable
    });

    /**
     * @namespace bordercloud
     */
    const visualization$1 = visualizationNS$1;

    var bordercloudNS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        visualization: visualization$1
    });

    /**
     * Tools
     * @class google.Tools
     * @memberof google
     */
    class Tools$1 {
        static decodeFormatSize(value) {
            let result = value;
            if (Number.isNaN(Number(value))) {
                let patternPercent = /%/gi;
                let patternPixel = /px/gi;
                if (result.search(patternPixel) >= 0) {
                    result = result.replace('px', '');
                    if (!Number.isNaN(Number(result))) {
                        result = Number(result);
                    }
                }
                else if (result.search(patternPercent) >= 0) ;
            }
            return result;
        }
    }

    /**
     * Data
     * @class google.Data
     * @memberof google.Data
     */
    class Data {
        constructor(result, raw = false) {
            if (raw) {
                this.convertResultRaw(result);
            }
            else {
                this.convertResult(result);
            }
        }
        setRole(col, role) {
            this._dataTable.setColumnProperty(col, 'role', role);
        }
        getDataTable() {
            return this._dataTable;
        }
        convertResult(result) {
            let data = new google.visualization.DataTable();
            let cols = result.head.vars;
            let rows = result.results.bindings;
            let noCols = cols.length;
            let noRows = rows.length;
            for (let col of cols) {
                // RDF Term	JSON form
                // IRI I	{"type": "uri", "value": "I"}
                // Literal S	{"type": "literal","value": "S"}
                // Literal S with language tag L	{ "type": "literal", "value": "S", "xml:lang": "L"}
                // Literal S with datatype IRI D	{ "type": "literal", "value": "S", "datatype": "D"}
                // Blank node, label B	{"type": "bnode", "value": "B"}
                let colName = col.replace('_', ' ');
                if (noRows > 0) {
                    let type = rows[0][col] !== undefined ? rows[0][col].datatype : '';
                    if (type === 'http://www.w3.org/2001/XMLSchema#decimal' ||
                        type === 'http://www.w3.org/2001/XMLSchema#integer') {
                        data.addColumn('number', colName);
                    }
                    else if (type === 'http://www.w3.org/2001/XMLSchema#boolean') {
                        data.addColumn('boolean', colName);
                    }
                    else if (type === 'http://www.w3.org/2001/XMLSchema#date') {
                        data.addColumn('date', colName);
                    }
                    else if (type === 'http://www.w3.org/2001/XMLSchema#dateTime') {
                        data.addColumn('datetime', colName);
                    }
                    else if (type === 'http://www.w3.org/2001/XMLSchema#time') {
                        data.addColumn('timeofday', colName);
                    }
                    else {
                        data.addColumn('string', colName);
                    }
                }
                else {
                    data.addColumn('string', colName);
                }
            }
            if (noRows > 0) {
                data.addRows(noRows);
                for (let x = 0; x < noRows; x++) {
                    for (let y = 0; y < noCols; y++) {
                        // data.setCell(x,y,rows[x][cols[y]].value)
                        let type = rows[x][cols[y]] !== undefined && rows[x][cols[y]].hasOwnProperty('datatype') ? rows[x][cols[y]].datatype : '';
                        if (type === 'http://www.w3.org/2001/XMLSchema#integer') {
                            data.setCell(x, y, parseInt(rows[x][cols[y]].value, 10));
                        }
                        else if (type === 'http://www.w3.org/2001/XMLSchema#decimal' || type === 'http://www.w3.org/2001/XMLSchema#float') {
                            data.setCell(x, y, parseFloat(rows[x][cols[y]].value));
                        }
                        else if (type === 'http://www.w3.org/2001/XMLSchema#boolean') {
                            // todo test
                            // 'boolean' - JavaScript boolean value ('true' or 'false'). Example value: v:'true'
                            data.setCell(x, y, rows[x][cols[y]].value === 'true' ? true : false);
                        }
                        else if (type === 'http://www.w3.org/2001/XMLSchema#date') {
                            // todo test
                            // 'date' - JavaScript Date object (zero-based month), with the time truncated. Example value: v:new Date(2008, 0, 15)
                            data.setCell(x, y, new Date(rows[x][cols[y]].value));
                        }
                        else if (type === 'http://www.w3.org/2001/XMLSchema#dateTime') {
                            // todo test
                            // 'datetime' - JavaScript Date object including the time. Example value: v:new Date(2008, 0, 15, 14, 30, 45)
                            data.setCell(x, y, new Date(rows[x][cols[y]].value));
                        }
                        else if (type === 'http://www.w3.org/2001/XMLSchema#time') {
                            // todo test
                            // 'timeofday' - Array of three numbers and an optional fourth, representing hour (0 indicates midnight), minute, second, and optional millisecond. Example values: v:[8, 15, 0], v: [6, 12, 1, 144]
                            let time = new Date(rows[x][cols[y]].value);
                            data.setCell(x, y, [time.getHours(), time.getHours(), time.getSeconds(), time.getMilliseconds()]);
                        }
                        else {
                            if (rows[x][cols[y]] === undefined) {
                                data.setCell(x, y, null);
                            }
                            else {
                                // 'string' - JavaScript string value. Example value: v:'hello'
                                //let value = rows[x][cols[y]] !== undefined ? rows[x][cols[y]].value : ''
                                data.setCell(x, y, rows[x][cols[y]].value);
                            }
                        }
                        // console.log('rows['+x+'][cols['+y+']].value = ' + rows[x][cols[y]].value + ' ' +
                        // rows[x][cols[y]].datatype)
                    }
                }
            }
            this._dataTable = data;
        }
        convertResultRaw(result) {
            let data = new google.visualization.DataTable();
            let cols = result.head.vars;
            let rows = result.results.bindings;
            let noCols = cols.length;
            let noRows = rows.length;
            for (let col of cols) {
                data.addColumn('string', col);
            }
            if (noRows > 0) {
                data.addRows(noRows);
                for (let x = 0; x < noRows; x++) {
                    for (let y = 0; y < noCols; y++) {
                        if (rows[x][cols[y]] === undefined) {
                            data.setCell(x, y, '');
                        }
                        else {
                            data.setCell(x, y, rows[x][cols[y]].value.toString());
                        }
                    }
                }
            }
            this._dataTable = data;
        }
    }

    /**
     * Todo AnnotationChart
     * @class google.visualization.AnnotationChart
     * @tutorial google_visualization_AnnotationChart
     * @memberof google.visualization
     */
    class AnnotationChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['annotationchart'] });
            AnnotationChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-line';
        }
        get label() {
            return 'AnnotationChart';
        }
        get subtext() {
            return 'AnnotationChart';
        }
        get classFullName() {
            return 'google.visualization.AnnotationChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_AnnotationChart.html';
        }
        /**
         * Make a standard simple html AnnotationChart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf AnnotationChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!AnnotationChart._isInit) {
                    AnnotationChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let AnnotationChart = new google.visualization.AnnotationChart(document.getElementById(currentChart.container.id));
                        AnnotationChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    AnnotationChart._isInit = false;

    /**
     * Todo AreaChart
     * @class google.visualization.AreaChart
     * @tutorial google_visualization_AreaChart
     * @memberof google.visualization
     */
    class AreaChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            AreaChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-area';
        }
        get label() {
            return 'AreaChart';
        }
        get subtext() {
            return 'AreaChart';
        }
        get classFullName() {
            return 'google.visualization.AreaChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_AreaChart.html';
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Table
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!AreaChart._isInit) {
                    AreaChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let areaChart = new google.visualization.AreaChart(document.getElementById(currentChart.container.id));
                        areaChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    AreaChart._isInit = false;

    /**
     * Todo BarChart
     * @class google.visualization.BarChart
     * @tutorial google_visualization_BarChart
     * @memberof google.visualization
     */
    class BarChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            BarChart._isInit = true;
        }
        get icon() {
            return 'fa fa-align-left';
        }
        get label() {
            return 'BarChart';
        }
        get subtext() {
            return 'BarChart';
        }
        get classFullName() {
            return 'google.visualization.BarChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_BarChart.html';
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf BarChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!BarChart._isInit) {
                    BarChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let chart = new google.visualization.BarChart(document.getElementById(currentChart.container.id));
                        chart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    BarChart._isInit = false;

    /**
     * Todo BubbleChart
     * @class google.visualization.BubbleChart
     * @tutorial google_visualization_BubbleChart
     * @memberof google.visualization
     */
    class BubbleChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            BubbleChart._isInit = true;
        }
        get icon() {
            return 'fa fa-circle';
        }
        get label() {
            return 'BubbleChart';
        }
        get subtext() {
            return 'BubbleChart';
        }
        get classFullName() {
            return 'google.visualization.BubbleChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_BubbleChart.html';
        }
        /**
         * Make a standard simple html bubbleChart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf BubbleChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!BubbleChart._isInit) {
                    BubbleChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let chart = new google.visualization.BubbleChart(document.getElementById(currentChart.container.id));
                        chart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    BubbleChart._isInit = false;

    /**
     * Todo Calendar
     * @class google.visualization.Calendar
     * @tutorial google_visualization_Calendar
     * @memberof google.visualization
     */
    class Calendar extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['calendar'] });
            Calendar._isInit = true;
        }
        get icon() {
            return 'fa fa-calendar';
        }
        get label() {
            return 'Calendar';
        }
        get subtext() {
            return 'Calendar';
        }
        get classFullName() {
            return 'google.visualization.Calendar';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Calendar.html';
        }
        /**
         * Make a standard simple html Calendar.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Calendar
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!Calendar._isInit) {
                    Calendar.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let calendar = new google.visualization.Calendar(document.getElementById(currentChart.container.id));
                        calendar.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Calendar._isInit = false;

    /**
     * Todo CandlestickChart
     * @class google.visualization.CandlestickChart
     * @tutorial google_visualization_CandlestickChart
     * @memberof google.visualization
     */
    class CandlestickChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            CandlestickChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-line';
        }
        get label() {
            return 'CandlestickChart';
        }
        get subtext() {
            return 'CandlestickChart';
        }
        get classFullName() {
            return 'google.visualization.CandlestickChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_CandlestickChart.html';
        }
        /**
         * Make a standard simple html CandlestickChart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf CandlestickChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // console.log(noCols + " x " + noRows)
                if (result.results.bindings.length === 0) {
                    return reject(Messages.get(MESSAGES.ERROR_DATA_NOROW));
                }
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!CandlestickChart._isInit) {
                    CandlestickChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let candlestickChart = new google.visualization.CandlestickChart(document.getElementById(currentChart.container.id));
                        candlestickChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    CandlestickChart._isInit = false;

    /**
     * Todo ColumnChart
     * @class google.visualization.ColumnChart
     * @tutorial google_visualization_ColumnChart
     * @memberof google.visualization
     */
    class ColumnChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            ColumnChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-bar';
        }
        get label() {
            return 'ColumnChart';
        }
        get subtext() {
            return 'ColumnChart';
        }
        get classFullName() {
            return 'google.visualization.ColumnChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_ColumnChart.html';
        }
        /**
         * Make a standard simple html ColumnChart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf ColumnChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                    reverseCategories: false
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!ColumnChart._isInit) {
                    ColumnChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let ColumnChart = new google.visualization.ColumnChart(document.getElementById(currentChart.container.id));
                        ColumnChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    ColumnChart._isInit = false;

    /**
     * Todo ComboChart
     * @class google.visualization.ComboChart
     * @tutorial google_visualization_ComboChart
     * @memberof google.visualization
     */
    class ComboChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            ComboChart._isInit = true;
        }
        get icon() {
            return 'fa fa-signal';
        }
        get label() {
            return 'ComboChart';
        }
        get subtext() {
            return 'ComboChart';
        }
        get classFullName() {
            return 'google.visualization.ComboChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_ComboChart.html';
        }
        /**
         * Make a standard simple html ComboChart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf ComboChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!ComboChart._isInit) {
                    ComboChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let comboChart = new google.visualization.ComboChart(document.getElementById(currentChart.container.id));
                        comboChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    ComboChart._isInit = false;

    /**
     * Todo API
     * @class google.API
     * @memberof google
     */
    class API {
        /**
         * todo
         * @returns {string}
         */
        static get key() {
            return this._key;
        }
        /**
         * todo
         * @param {string} value
         */
        static set key(value) {
            this._key = value;
        }
    }
    /**
     * todo
     * @type {string}
     * @private
     */
    API._key = '';

    /**
     * Todo GeoChart
     * @class google.visualization.GeoChart
     * @tutorial google_visualization_GeoChart
     * @memberof google.visualization
     */
    class GeoChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['geochart'], mapsApiKey: API.key });
            GeoChart._isInit = true;
        }
        get icon() {
            return 'fa fa-globe';
        }
        get label() {
            return 'GeoChart';
        }
        get subtext() {
            return 'GeoChart';
        }
        get classFullName() {
            return 'google.visualization.GeoChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_GeoChart.html';
        }
        /**
         * Make a standard simple html geochart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf GeoChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!GeoChart._isInit) {
                    GeoChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let geochart = new google.visualization.GeoChart(document.getElementById(currentChart.container.id));
                        geochart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    GeoChart._isInit = false;

    /**
     * Todo Histogram
     * @class google.visualization.Histogram
     * @tutorial google_visualization_Histogram
     * @memberof google.visualization
     */
    class Histogram extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            Histogram._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-area';
        }
        get label() {
            return 'Histogram';
        }
        get subtext() {
            return 'Histogram';
        }
        get classFullName() {
            return 'google.visualization.Histogram';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Histogram.html';
        }
        /**
         * Make a standard simple html Histogram.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Histogram
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!Histogram._isInit) {
                    Histogram.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let histogram = new google.visualization.Histogram(document.getElementById(currentChart.container.id));
                        histogram.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Histogram._isInit = false;

    /**
     * Todo IntervalChart
     * @class google.visualization.IntervalChart
     * @tutorial google_visualization_IntervalChart
     * @memberof google.visualization
     */
    class IntervalChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart', 'line'] });
            IntervalChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-line';
        }
        get label() {
            return 'Interval';
        }
        get subtext() {
            return 'Interval';
        }
        get classFullName() {
            return 'google.visualization.IntervalChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_IntervalChart.html';
        }
        /**
         * Draw a IntervalChart
         * @memberOf IntervalChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!IntervalChart._isInit) {
                    IntervalChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let cols = result.head.vars;
                        let noCols = cols.length;
                        for (let y = 2; y < noCols; y++) {
                            data.setRole(y, 'interval');
                        }
                        let line = new google.visualization.LineChart(document.getElementById(currentChart.container.id));
                        line.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    IntervalChart._isInit = false;

    /**
     * Todo LineChart
     * @class google.visualization.LineChart
     * @tutorial google_visualization_LineChart
     * @memberof google.visualization
     */
    class LineChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart', 'line'] });
            LineChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-line';
        }
        get label() {
            return 'Line';
        }
        get subtext() {
            return 'Line';
        }
        get classFullName() {
            return 'google.visualization.LineChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_LineChart.html';
        }
        /**
         * Draw a LineChart
         * @memberOf LineChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                let height = '500';
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!LineChart._isInit) {
                    LineChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let line = new google.visualization.LineChart(document.getElementById(currentChart.container.id));
                        line.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    LineChart._isInit = false;

    /**
     * Todo Table
     * @class google.visualization.Map
     * @tutorial google_visualization_Map
     * @memberof google.visualization
     */
    class Map extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['map'], mapsApiKey: API.key });
            Map._isInit = true;
        }
        get icon() {
            return 'fa fa-map';
        }
        get label() {
            return 'Map';
        }
        get subtext() {
            return 'Map';
        }
        get classFullName() {
            return 'google.visualization.Map';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Map.html';
        }
        /**
         * Make a Google map
         * todo
         * @memberOf Map
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                    showTooltip: false,
                    showInfoWindow: true,
                    enableScrollWheel: true
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                // fix bug in local
                if (location.origin.startsWith('file:')) {
                    opt = Object.assign({
                        icons: {
                            default: {
                                normal: 'https://maps.google.com/mapfiles/ms/micons/red-dot.png',
                                selected: 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png'
                            }
                        }
                    }, opt);
                }
                // init only one time
                if (!Map._isInit) {
                    Map.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let messageError = '';
                        let cols = result.head.vars;
                        let rows = result.results.bindings;
                        let noCols = cols.length;
                        let noRows = rows.length;
                        let lat;
                        let long;
                        let description;
                        let data = new google.visualization.DataTable();
                        if (noCols <= 2) {
                            messageError = 'Parameters : latitude(xsd:Decimal) longitude(xsd:Decimal) title(xsd:string' +
                                ' optional) introduction(xsd:string optional) link(IRI optional)';
                        }
                        else {
                            let latitudeCol = 0;
                            let longitudeCol = 1;
                            let descriptionCol = 2;
                            data.addColumn('number', latitudeCol);
                            data.addColumn('number', longitudeCol);
                            if (noCols > 2) {
                                data.addColumn('string', descriptionCol);
                            }
                            data.addRows(noRows);
                            for (let x = 0; x < noRows; x++) {
                                lat = parseFloat(rows[x][cols[latitudeCol]].value);
                                long = parseFloat(rows[x][cols[longitudeCol]].value);
                                description = '';
                                if (isNaN(lat) || isNaN(long)) {
                                    messageError = 'Latitude or longitude is not a decimal. Parameters of chart :' +
                                        ' latitude(xsd:Decimal)' +
                                        ' longitude(xsd:Decimal) title(xsd:string' +
                                        ' optional) introduction(xsd:string optional) link(IRI optional). ';
                                    break;
                                }
                                if (noCols >= 6) {
                                    // latitude longitude title text link
                                    let title = rows[x][cols[2]] !== undefined ? rows[x][cols[2]].value : '';
                                    let text = rows[x][cols[3]] !== undefined ? "<p style='margin: 0px'>" + rows[x][cols[3]].value + '</p>' : '';
                                    let link = rows[x][cols[4]] !== undefined ? "<a style='font-size: large;font-style: medium;' href='" + rows[x][cols[4]].value + "' target='_blank'>" + title + '</a>' : title;
                                    let img = rows[x][cols[5]] !== undefined ? "<img src='" + rows[x][cols[5]].value + "' style='margin-left:5px;margin-bottom:5px;width:150px;float:right;'/>" : '';
                                    if (rows[x][cols[3]] === undefined || rows[x][cols[3]].value.length === 0) {
                                        description = '<div style="display: flow-root;min-width: 150px;min-height:150px;">' + link + '<div>' + img + '</div></div>';
                                    }
                                    else {
                                        description = '<div style="display: flow-root;width: 350px;min-height:150px;">' + link + '<div>' + img + text + '</div></div>';
                                    }
                                    data.setCell(x, latitudeCol, lat);
                                    data.setCell(x, longitudeCol, long);
                                    data.setCell(x, descriptionCol, description);
                                }
                                else if (noCols === 5) {
                                    // latitude longitude title introduction link
                                    let title = rows[x][cols[2]] !== undefined ? rows[x][cols[2]].value : '';
                                    let text = rows[x][cols[3]] !== undefined ? rows[x][cols[3]].value : '';
                                    let link = rows[x][cols[4]] !== undefined ? "<a href='" + rows[x][cols[4]].value + "'>" + title + '</a>' : title;
                                    description = '<b>' + link + '</b><br/>' + text;
                                    data.setCell(x, latitudeCol, lat);
                                    data.setCell(x, longitudeCol, long);
                                    data.setCell(x, descriptionCol, description);
                                }
                                else if (noCols === 4) {
                                    // latitude longitude title introduction
                                    let title = rows[x][cols[2]] !== undefined ? rows[x][cols[2]].value : '';
                                    let text = rows[x][cols[3]] !== undefined ? rows[x][cols[3]].value : '';
                                    description = '<b>' + title + '</b><br/>' + text;
                                    data.setCell(x, latitudeCol, lat);
                                    data.setCell(x, longitudeCol, long);
                                    data.setCell(x, descriptionCol, description);
                                }
                                else if (noCols === 3) {
                                    // latitude longitude title
                                    let title = rows[x][cols[2]] !== undefined ? rows[x][cols[2]].value : '';
                                    description = '<b>' + title + '</br>';
                                    data.setCell(x, latitudeCol, lat);
                                    data.setCell(x, longitudeCol, long);
                                    data.setCell(x, descriptionCol, description);
                                }
                                else if (noCols === 2) {
                                    // latitude longitude
                                    data.setCell(x, latitudeCol, lat);
                                    data.setCell(x, longitudeCol, long);
                                }
                            }
                        }
                        if (messageError !== '') {
                            return reject(Error(messageError));
                        }
                        let table = new google.visualization.Map(document.getElementById(currentChart.container.id));
                        table.draw(data, opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Map._isInit = false;

    /**
     * Todo OrgChart
     * @class google.visualization.OrgChart
     * @tutorial google_visualization_OrgChart
     * @memberof google.visualization
     */
    class OrgChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['orgchart'] });
            OrgChart._isInit = true;
        }
        get icon() {
            return 'fa fa-sitemap';
        }
        get label() {
            return 'OrgChart';
        }
        get subtext() {
            return 'OrgChart';
        }
        get classFullName() {
            return 'google.visualization.OrgChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_OrgChart.html';
        }
        /**
         * Make a standard simple html OrgChart.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf OrgChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                    allowHtml: true
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!OrgChart._isInit) {
                    OrgChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let orgChart = new google.visualization.OrgChart(document.getElementById(currentChart.container.id));
                        orgChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    OrgChart._isInit = false;

    /**
     * Todo Pie
     * @class google.visualization.Pie
     * @tutorial google_visualization_Pie
     * @memberof google.visualization
     */
    class Pie extends Chart {
        constructor() {
            super();
            this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        get icon() {
            return 'fas fa-chart-pie';
        }
        get label() {
            return 'Pie';
        }
        get subtext() {
            return 'Pie';
        }
        get classFullName() {
            return 'google.visualization.Pie';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Pie.html';
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            Pie._isInit = true;
        }
        /**
         * Make a standard simple html pie.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Pie
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!Pie._isInit) {
                    Pie.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let Pie = new google.visualization.PieChart(document.getElementById(currentChart.container.id));
                        Pie.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Pie._isInit = false;

    /**
     * Todo ScatterChart
     * @class google.visualization.ScatterChart
     * @tutorial google_visualization_ScatterChart
     * @memberof google.visualization
     */
    class ScatterChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            ScatterChart._isInit = true;
        }
        get icon() {
            return 'fa fa-circle';
        }
        get label() {
            return 'ScatterChart';
        }
        get subtext() {
            return 'ScatterChart';
        }
        get classFullName() {
            return 'google.visualization.ScatterChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_ScatterChart.html';
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf ScatterChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!ScatterChart._isInit) {
                    ScatterChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let chart = new google.visualization.ScatterChart(document.getElementById(currentChart.container.id));
                        chart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    ScatterChart._isInit = false;

    /**
     * Todo SteppedAreaChart
     * @class google.visualization.SteppedAreaChart
     * @tutorial google_visualization_SteppedAreaChart
     * @memberof google.visualization
     */
    class SteppedAreaChart extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            SteppedAreaChart._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-area';
        }
        get label() {
            return 'SteppedAreaChart';
        }
        get subtext() {
            return 'SteppedAreaChart';
        }
        get classFullName() {
            return 'google.visualization.SteppedAreaChart';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_SteppedAreaChart.html';
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Table
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!SteppedAreaChart._isInit) {
                    SteppedAreaChart.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let steppedAreaChart = new google.visualization.SteppedAreaChart(document.getElementById(currentChart.container.id));
                        steppedAreaChart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    SteppedAreaChart._isInit = false;

    /**
     * Todo Table
     * @class google.visualization.Table
     * @tutorial google_visualization_Table
     * @memberof google.visualization
     */
    class Table$1 extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['table'] });
            Table$1._isInit = true;
        }
        get icon() {
            return 'fa fa-table';
        }
        get label() {
            return 'Table';
        }
        get subtext() {
            return 'Table';
        }
        get classFullName() {
            return 'google.visualization.Table';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Table.html';
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Table
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = '100%';
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                    raw: true,
                    showRowNumber: false
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!Table$1._isInit) {
                    Table$1.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result, opt.raw);
                        let table = new google.visualization.Table(document.getElementById(currentChart.container.id));
                        table.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Table$1._isInit = false;

    /**
     * Todo Timeline
     * @class google.visualization.Timeline
     * @tutorial google_visualization_Timeline
     * @memberof google.visualization
     */
    class Timeline extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['timeline'] });
            Timeline._isInit = true;
        }
        get icon() {
            return 'fa fa-tasks';
        }
        get label() {
            return 'Timeline';
        }
        get subtext() {
            return 'Timeline';
        }
        get classFullName() {
            return 'google.visualization.Timeline';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Timeline.html';
        }
        /**
         * Make a standard simple html Timeline.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Timeline
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!Timeline._isInit) {
                    Timeline.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let timeline = new google.visualization.Timeline(document.getElementById(currentChart.container.id));
                        timeline.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Timeline._isInit = false;

    /**
     * Todo TreeMap
     * @class google.visualization.TreeMap
     * @tutorial google_visualization_TreeMap
     * @memberof google.visualization
     */
    class TreeMap extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['treemap'] });
            TreeMap._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-area';
        }
        get label() {
            return 'TreeMap';
        }
        get subtext() {
            return 'TreeMap';
        }
        get classFullName() {
            return 'google.visualization.TreeMap';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_TreeMap.html';
        }
        /**
         * Make a standard simple html table.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Table
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                // Default options
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!TreeMap._isInit) {
                    TreeMap.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let treeMap = new google.visualization.TreeMap(document.getElementById(currentChart.container.id));
                        treeMap.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    TreeMap._isInit = false;

    /**
     * Todo Trendline
     * @class google.visualization.Trendline
     * @tutorial google_visualization_Trendline
     * @memberof google.visualization
     */
    class Trendline extends Chart {
        constructor() {
            super();
            let dep = this.addScript('https://www.gstatic.com/charts/loader.js');
        }
        static init() {
            google.charts.load('current', { 'packages': ['corechart'] });
            Trendline._isInit = true;
        }
        get icon() {
            return 'fas fa-chart-line';
        }
        get label() {
            return 'Trendline';
        }
        get subtext() {
            return 'Trendline';
        }
        get classFullName() {
            return 'google.visualization.Trendline';
        }
        get tutorialFilename() {
            return 'tutorial-google_visualization_Trendline.html';
        }
        /**
         * Make a standard simple html Trendline.
         * Available options:
         * - 'headings'   :  "true" / "false"  (default: "true")
         * @memberOf Trendline
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let height = 500;
                if (currentChart.height !== '') {
                    height = Tools$1.decodeFormatSize(currentChart.height);
                }
                let opt = Object.assign({
                    trendlines: { 0: {} }
                }, currentChart.options);
                // fix the size
                opt = Object.assign(opt, {
                    width: Tools$1.decodeFormatSize(currentChart.width),
                    height: height
                });
                if (!Trendline._isInit) {
                    Trendline.init();
                }
                google.charts.setOnLoadCallback(() => {
                    try {
                        let data = new Data(result);
                        let chart = new google.visualization.ScatterChart(document.getElementById(currentChart.container.id));
                        chart.draw(data.getDataTable(), opt);
                    }
                    catch (error) {
                        console.log(error);
                        Logger.displayFeedback(currentChart.container, MESSAGES.ERROR_CHART, [error]);
                        Logger.log(currentChart.container, 'Chart finished with error : ' + currentChart.container.id);
                    }
                });
                // finish
                return resolve();
            });
        }
    }
    Trendline._isInit = false;

    /**
     * @namespace google.visualization
     */
    // Word Trees
    // https://developers.google.com/chart/interactive/docs/gallery/wordtree
    // todo

    var visualizationNS$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AnnotationChart: AnnotationChart,
        AreaChart: AreaChart,
        BarChart: BarChart,
        BubbleChart: BubbleChart,
        Calendar: Calendar,
        CandlestickChart: CandlestickChart,
        ColumnChart: ColumnChart,
        ComboChart: ComboChart,
        GeoChart: GeoChart,
        Histogram: Histogram,
        IntervalChart: IntervalChart,
        LineChart: LineChart,
        Map: Map,
        OrgChart: OrgChart,
        Pie: Pie,
        ScatterChart: ScatterChart,
        SteppedAreaChart: SteppedAreaChart,
        Table: Table$1,
        Timeline: Timeline,
        TreeMap: TreeMap,
        Trendline: Trendline
    });

    /**
     * @namespace google
     */
    const visualization$2 = visualizationNS$2;

    var googleNS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        visualization: visualization$2,
        Data: Data,
        Tools: Tools$1,
        API: API
    });

    /**
     * Todo AreaChart
     * @class d3.visualization.AreaChart
     * @tutorial d3_visualization_AreaChart
     * @memberof d3.visualization
     */
    class AreaChart$1 extends Chart {
        get icon() {
            return 'fas fa-chart-area';
        }
        get label() {
            return 'AreaChart';
        }
        get subtext() {
            return 'AreaChart';
        }
        get classFullName() {
            return 'd3.visualization.AreaChart';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_AreaChart.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple line.
         * Available options:
         * -
         * @memberOf AreaChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                console.log('test');
                let heightOpt = '100%';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: false,
                    width: currentChart.width,
                    height: heightOpt
                }, currentChart.options);
                // build the datatable
                /*let cols = result.head.vars
                let rows = result.results.bindings
                let noCols = cols.length
                let noRows = rows.length
                let dataset: Array<any> = []
                let label
                let count
                let data = [{
                    date: '1-May-12',
                    close: 58.1
                }]
                for (let row of rows) {
                    label = row[cols[0]].value
                    count = Number(row[cols[1]].value)
                    if ( label === undefined || count === undefined) {
                        Logger.logSimple('Erreur ? D3JS:pie label ' + label + ' count ' + count)
                    } else {
                        dataset.push({ label: label , count: count })
                    }
                }

                console.log(data)
                let margin = {
                    top: 30,
                    right: 20 * 3,
                    bottom: 30,
                    left: 50
                }
                let width = 800 - margin.left - margin.right
                let height = 570 - margin.top - margin.bottom
                let parseDate = d3.time.format('%d-%b-%y').parse
                // x axis
                let x = d3.scalePoint().range([0, width])
                let xAxis = d3.axisBottom().scale(x).ticks(15)
                // y axis
                let y = d3.scaleLinear().range([height, 0])
                let yAxis = d3.axisRight().scale(y).ticks(17)

                let valueline = d3.line()
                    .x(function (d: any) {
                      return x(d.date)
                    })
                    .y(function (d: any) {
                      return y(d.close)
                    })
                let svg = d3.select( '#' + currentChart.container.id)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // get data

    data.forEach(function (d: any) {
        d.date = parseDate(d.date)
        d.close = +d.close
    })
                svg.append('path') // Add the valueline path.
                // .attr('fill', 'none')
               // .attr('stroke', 'steelblue')
               // .attr('stroke-linejoin', 'round')
               // .attr('stroke-linecap', 'round')
               // .attr('stroke-width', 1.5)
              //  .attr('d', valueline(dataset))
               .attr('d', valueline(data))
                svg.append('g') // Add the X Axis
                .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis)
                svg.append('g') // Add the Y Axis
                    .attr('class', 'y axis')
                    .call(yAxis)*/
                // finish
                // Example
                let containerElement = d3.select('#' + currentChart.container.id);
                let containerElementNode = containerElement.node();
                if (containerElementNode) {
                    let width = containerElementNode.clientWidth !== 0 ? containerElementNode.clientWidth : 300;
                    let height = containerElementNode.clientHeight !== 0 ? containerElementNode.clientHeight : 150;
                    let svg = containerElement.append('svg') // associate our data with the document
                        .attr('width', width)
                        .attr('height', height)
                        .attr('id', 'idtest');
                    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
                    let widthChart = width - (margin.left + margin.right);
                    let heightChart = height - (margin.top + margin.bottom);
                    let xScale = d3.scaleLinear();
                    let yScale = d3.scaleLinear();
                    let xAxisCall = d3.axisBottom();
                    let yAxisCall = d3.axisLeft();
                    xScale.domain([0, 100]).range([0, widthChart]);
                    yScale.domain([0, 100]).range([heightChart, 0]);
                    xAxisCall.scale(xScale);
                    yAxisCall.scale(yScale);
                    let newX = svg.append('g')
                        // .attr('class', 'x axis')
                        .attr('transform', 'translate(' + [margin.left, heightChart + margin.top] + ')')
                        .call(xAxisCall);
                    let newY = svg.append('g')
                        // .attr('class', 'y axis')
                        .attr('transform', 'translate(' + [margin.left, margin.top] + ')')
                        .call(yAxisCall);
                }
                return resolve();
            });
        }
    }

    /** Work in progress, help us ! */
    /**
     * Todo BarChart
     * @class d3.visualization.BarChart
     * @tutorial d3_visualization_BarChart
     * @memberof d3.visualization
     */
    class BarChart$1 extends Chart {
        get icon() {
            return 'far fa-chart-bar';
        }
        get label() {
            return 'BarChart';
        }
        get subtext() {
            return 'BarChart';
        }
        get classFullName() {
            return 'd3.visualization.BarChart';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_BarChart.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple pie.
         * Available options:
         * -
         * @memberOf BarChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let heightOpt = '100%';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: false,
                    width: currentChart.width,
                    height: heightOpt
                }, currentChart.options);
                // build the datatable
                let cols = result.head.vars;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                let dataset = [];
                let label;
                let counter;
                for (let row of rows) {
                    label = row[cols[0]].value;
                    counter = Number(row[cols[1]].value);
                    if (label === undefined || counter === undefined) {
                        Logger.logSimple('Erreur ? D3JS:pie label ' + label + ' count ' + counter);
                    }
                    else {
                        dataset.push({ label: label, count: counter });
                    }
                }
                // console.log(data)
                let containerElement = d3.select('#' + currentChart.container.id);
                let containerElementNode = containerElement.node();
                if (containerElementNode) {
                    let width = containerElementNode.clientWidth !== 0 ? containerElementNode.clientWidth : 300;
                    let height = containerElementNode.clientHeight !== 0 ? containerElementNode.clientHeight : 150;
                    let svg = containerElement.append('svg') // associate our data with the document
                        .attr('width', width)
                        .attr('height', height)
                        .attr('id', 'idtest');
                    svg = svg.append('g') // make a group to hold our pie chart
                        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                    // var donutWidth = 75;
                    /*let legendRectSize = 18
                    let legendSpacing = 4
                    let color = d3.scaleOrdinal(d3.schemeCategory10)*/
                    /*let arc = d3.arc()
                       // .innerRadius(radius - donutWidth)
                        .innerRadius(0)
                        .outerRadius(radius)
                    let pie = d3.pie()
                        .value(function (d: any) { return d.count })
                        .sort(null)*/
                    /*let path = svg.selectAll('path')
                        .data(pie(dataset)
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function (d: any, i: any) {
                            return color(d.data.label)
                        })*/
                    let bars = svg.selectAll('rect')
                        .data(dataset)
                        .enter()
                        .append('rect')
                        .attr('width', function (i) { return i.count / 10000; })
                        .attr('height', 50)
                        .attr('y', function (i, j) { return j * 50; })
                        .attr('fill', '#3399FF');
                    console.log('dataset : ' + dataset);
                    // Todo limit nb (look pie chart of Google)
                    /*let legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function (d: any, i: any) {
                            let height = legendRectSize + legendSpacing
                            let offset = height * color.domain().length / 2
                            let horz = -2 * legendRectSize
                            let vert = i * height - offset
                            return 'translate(' + (horz + radius * 2 + 20 ) + ',' + vert + ')'
                        })
                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color)
                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d: any) { return d })*/
                }
                // finish
                return resolve();
            });
        }
    }

    /**
     * Todo BubbleChart
     * @class d3.visualization.BubbleChart
     * @tutorial d3_visualization_BubbleChart
     * @memberof d3.visualization
     */
    class BubbleChart$1 extends Chart {
        get icon() {
            return 'fas fa-chart-pie';
        }
        get label() {
            return 'BubbleChart';
        }
        get subtext() {
            return 'BubbleChart';
        }
        get classFullName() {
            return 'd3.visualization.BubbleChart';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_BubbleChart.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple pie.
         * Available options:
         * -
         * @memberOf Pie
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                let heightOpt = '100%';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: false,
                    width: currentChart.width,
                    height: heightOpt
                }, currentChart.options);
                // build the datatable
                let cols = result.head.vars;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                /*let dataset: Array<any> = []
                let label
                let counter
                for (let row of rows) {
                    label = row[cols[0]].value
                    counter = Number(row[cols[1]].value)
                    if ( label === undefined || counter === undefined) {
                        Logger.logSimple('Erreur ? D3JS:pie label ' + label + ' count ' + counter)
                    } else {
                        dataset.push({ label: label , count: counter })
                    }
                }*/
                // console.log(data)
                // Example
                let containerElement = d3.select('#' + currentChart.container.id);
                let containerElementNode = containerElement.node();
                if (containerElementNode) {
                    let width = containerElementNode.clientWidth !== 0 ? containerElementNode.clientWidth : 300;
                    let height = containerElementNode.clientHeight !== 0 ? containerElementNode.clientHeight : 150;
                    let svg = containerElement.append('svg') // associate our data with the document
                        .attr('width', width)
                        .attr('height', height)
                        .attr('id', 'idtest');
                    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
                    let widthChart = width - (margin.left + margin.right);
                    let heightChart = height - (margin.top + margin.bottom);
                    let xScale = d3.scaleLinear();
                    let yScale = d3.scaleLinear();
                    let xAxisCall = d3.axisBottom();
                    let yAxisCall = d3.axisLeft();
                    xScale.domain([0, 100]).range([0, widthChart]);
                    yScale.domain([0, 100]).range([heightChart, 0]);
                    xAxisCall.scale(xScale);
                    yAxisCall.scale(yScale);
                    let newX = svg.append('g')
                        // .attr('class', 'x axis')
                        .attr('transform', 'translate(' + [margin.left, heightChart + margin.top] + ')')
                        .call(xAxisCall);
                    let newY = svg.append('g')
                        // .attr('class', 'y axis')
                        .attr('transform', 'translate(' + [margin.left, margin.top] + ')')
                        .call(yAxisCall);
                }
                // finish
                return resolve();
            });
        }
    }

    /**
     * Todo ColumnChart
     * @class d3.visualization.ColumnChart
     * @tutorial d3_visualization_ColumnChart
     * @memberof d3.visualization
     */
    class ColumnChart$1 extends Chart {
        get icon() {
            return 'far fa-chart-bar';
        }
        get label() {
            return 'ColumnChart';
        }
        get subtext() {
            return 'ColumnChart';
        }
        get classFullName() {
            return 'd3.visualization.ColumnChart';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_ColumnChart.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple ColumnChart.
         * Available options:
         * -
         * @memberOf ColumnChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let heightOpt = '100%';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: false,
                    width: currentChart.width,
                    height: heightOpt
                }, currentChart.options);
                /*
                            // build the datatable
                            let cols = result.head.vars
                            let rows = result.results.bindings
                            let noCols = cols.length
                            let noRows = rows.length
                            let dataset: Array<any> = []
                            let label
                            let counter
                            for (let row of rows) {
                                label = row[cols[0]].value
                                counter = Number(row[cols[1]].value)
                                if ( label === undefined || counter === undefined) {
                                    Logger.logSimple('Erreur ? D3JS:ColumnChart label ' + label + ' count ' + counter)
                                }else {
                                    dataset.push({ label: label , count: counter })
                                }
                            }
                
                            // console.log(data)
                            let containerElement = d3.select('#' + currentChart.container.id)
                            let containerElementNode = containerElement.node() as any
                            if (containerElementNode) {
                                let width = containerElementNode.clientWidth !== 0 ? containerElementNode.clientWidth : 300
                                let height = containerElementNode.clientHeight !== 0 ? containerElementNode.clientHeight : 150
                                let svg = containerElement.append('svg') // associate our data with the document
                                    .attr('width', width)
                                    .attr('height', height)
                                    .attr('id', 'idtest')
                
                                let radius = Math.min(width, height) / 2
                
                                svg = svg.append('g') // make a group to hold our ColumnChart chart
                                    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
                
                                // var donutWidth = 75;
                                let legendRectSize = 18
                                let legendSpacing = 4
                                let color = d3.scaleOrdinal(d3.schemeCategory10)
                
                                let arc = d3.arc()
                                   // .innerRadius(radius - donutWidth)
                                    .innerRadius(0)
                                    .outerRadius(radius)
                                let ColumnChart = d3.ColumnChart()
                                    .value(function (d: any) { return d.count })
                                    .sort(null)
                                let path = svg.selectAll('path')
                                    .data(ColumnChart(dataset))
                                    .enter()
                                    .append('path')
                                    .attr('d', arc)
                                    .attr('fill', function (d: any, i: any) {
                                        return color(d.data.label)
                                    })
                
                                // Todo limit nb (look ColumnChart chart of Google)
                                let legend = svg.selectAll('.legend')
                                    .data(color.domain())
                                    .enter()
                                    .append('g')
                                    .attr('class', 'legend')
                                    .attr('transform', function (d: any, i: any) {
                                        let height = legendRectSize + legendSpacing
                                        let offset = height * color.domain().length / 2
                                        let horz = -2 * legendRectSize
                                        let vert = i * height - offset
                                        return 'translate(' + (horz + radius * 2 + 20 ) + ',' + vert + ')'
                                    })
                                legend.append('rect')
                                    .attr('width', legendRectSize)
                                    .attr('height', legendRectSize)
                                    .style('fill', color)
                                    .style('stroke', color)
                                legend.append('text')
                                    .attr('x', legendRectSize + legendSpacing)
                                    .attr('y', legendRectSize - legendSpacing)
                                    .text(function (d: any) { return d })
                            }
                            */
                // finish
                return resolve();
            });
        }
    }

    /**
     * Todo Line
     * @class d3.visualization.Line
     * @tutorial d3_visualization_Line
     * @memberof d3.visualization
     */
    class Line extends Chart {
        get icon() {
            return 'fas fa-chart-line';
        }
        get label() {
            return 'Line';
        }
        get subtext() {
            return 'Line';
        }
        get classFullName() {
            return 'd3.visualization.Line';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_Line.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple line.
         * Available options:
         * -
         * @memberOf Line
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                //console.log('test')
                let heightOpt = '100%';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: true,
                    width: currentChart.width,
                    height: heightOpt
                    // hAxisscaleType: true
                }, currentChart.options);
                // build the datatable
                let cols = result.head.vars;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                let dataset = [];
                let label;
                let count;
                for (let row of rows) {
                    label = row[cols[0]].value;
                    count = Number(row[cols[1]].value);
                    if (label === undefined || count === undefined) {
                        Logger.logSimple('Erreur ? D3JS:pie label ' + label + ' count ' + count);
                    }
                    else {
                        dataset.push({ label: label, count: count });
                    }
                }
                console.log(dataset);
                let margin = {
                    top: 30,
                    right: 20 * 3,
                    bottom: 30,
                    left: 70
                };
                let width = 800 - margin.left - margin.right;
                let height = 570 - margin.top - margin.bottom;
                // x axis
                let x = d3.scalePoint()
                    .domain(dataset.map(function (entry) {
                    return entry.label;
                }))
                    .rangeRound([0, 800])
                    .padding(0.5);
                let xAxis = d3.axisBottom().scale(x).ticks(15);
                // y axis
                let y = d3.scaleLinear().range([height, 0]);
                y.domain([0, d3.max(dataset, function (d) {
                        return d.count;
                    })]);
                let yAxis = d3.axisLeft().scale(y).ticks(17);
                let valueline = d3.line()
                    .x(function (d) {
                    return x(d.label);
                })
                    .y(function (d) {
                    return y(d.count);
                });
                let svg = d3.select('#' + currentChart.container.id)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                svg.append('path') // Add the valueline path.
                    .attr('fill', 'none')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-linejoin', 'round')
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', 1.5)
                    .attr('d', valueline(dataset));
                svg.append('g') // Add the X Axis
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);
                svg.append('g') // Add the Y Axis
                    .attr('class', 'y axis')
                    .call(yAxis);
                // finish
                return resolve();
            });
        }
    }

    /**
     * Todo Pie
     * @class d3.visualization.Pie
     * @tutorial d3_visualization_Pie
     * @memberof d3.visualization
     */
    class Pie$1 extends Chart {
        get icon() {
            return 'fas fa-chart-pie';
        }
        get label() {
            return 'Pie';
        }
        get subtext() {
            return 'Pie';
        }
        get classFullName() {
            return 'd3.visualization.Pie';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_Pie.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple pie.
         * Available options:
         * -
         * @memberOf Pie
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let heightOpt = '100%';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: false,
                    width: currentChart.width,
                    height: heightOpt
                }, currentChart.options);
                // build the datatable
                let cols = result.head.vars;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                let dataset = [];
                let label;
                let counter;
                for (let row of rows) {
                    label = row[cols[0]].value;
                    counter = Number(row[cols[1]].value);
                    if (label === undefined || counter === undefined) {
                        Logger.logSimple('Erreur ? D3JS:pie label ' + label + ' count ' + counter);
                    }
                    else {
                        dataset.push({ label: label, count: counter });
                    }
                }
                // console.log(data)
                let containerElement = d3.select('#' + currentChart.container.id);
                let containerElementNode = containerElement.node();
                if (containerElementNode) {
                    let width = containerElementNode.clientWidth !== 0 ? containerElementNode.clientWidth : 300;
                    let height = containerElementNode.clientHeight !== 0 ? containerElementNode.clientHeight : 150;
                    let svg = containerElement.append('svg') // associate our data with the document
                        .attr('width', width)
                        .attr('height', height)
                        .attr('id', 'idtest');
                    let radius = Math.min(width, height) / 2;
                    svg = svg.append('g') // make a group to hold our pie chart
                        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                    // var donutWidth = 75;
                    let legendRectSize = 18;
                    let legendSpacing = 4;
                    let color = d3.scaleOrdinal(d3.schemeCategory10);
                    let arc = d3.arc()
                        // .innerRadius(radius - donutWidth)
                        .innerRadius(0)
                        .outerRadius(radius);
                    let pie = d3.pie()
                        .value(function (d) { return d.count; })
                        .sort(null);
                    let path = svg.selectAll('path')
                        .data(pie(dataset))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function (d, i) {
                        return color(d.data.label);
                    });
                    // Todo limit nb (look pie chart of Google)
                    let legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function (d, i) {
                        let height = legendRectSize + legendSpacing;
                        let offset = height * color.domain().length / 2;
                        let horz = -2 * legendRectSize;
                        let vert = i * height - offset;
                        return 'translate(' + (horz + radius * 2 + 20) + ',' + vert + ')';
                    });
                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color);
                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d) { return d; });
                }
                // finish
                return resolve();
            });
        }
    }

    /**
     * Todo ScatterChart
     * @class d3.visualization.ScatterChart
     * @tutorial d3_visualization_ScatterChart
     * @memberof d3.visualization
     */
    class ScatterChart$1 extends Chart {
        get icon() {
            return 'fa fa-ScatterChart-chart';
        }
        get label() {
            return 'ScatterChart';
        }
        get subtext() {
            return 'ScatterChart';
        }
        get classFullName() {
            return 'd3.visualization.ScatterChart';
        }
        get tutorialFilename() {
            return 'tutorial-d3_visualization_ScatterChart.html';
        }
        constructor() {
            super();
            //this.addCss(Core.path + '/lib/d3/d3.css')
            let dep = this.addScript(Core.path + 'lib/d3/d3.min.js');
        }
        /**
         * Make a simple ScatterChart.
         * Available options:
         * -
         * @memberOf ScatterChart
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                // transform query
                // console.log(noCols + " x " + noRows)
                let heightOpt = '500';
                if (currentChart.height !== '') {
                    heightOpt = currentChart.height;
                }
                let opt = Object.assign({
                    showRowNumber: false,
                    width: currentChart.width,
                    height: heightOpt
                }, currentChart.options);
                // build the datatable
                let cols = result.head.lets;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                let dataset = [];
                let label;
                let counter;
                for (let row of rows) {
                    label = row[cols[0]].value;
                    counter = Number(row[cols[1]].value);
                    if (label === undefined || counter === undefined) {
                        Logger.logSimple('Erreur ? D3JS:ScatterChart label ' + label + ' count ' + counter);
                    }
                    else {
                        dataset.push({ label: label, count: counter });
                    }
                }
                console.log(dataset);
                // let containerElement = d3.select('#' + currentChart.container.id)
                //  let containerElementNode = containerElement.node() as any
                /*if (containerElementNode) {
                    let width = containerElementNode.clientWidth !== 0 ? containerElementNode.clientWidth : 300
                    let height = containerElementNode.clientHeight !== 0 ? containerElementNode.clientHeight : 150
                    let svg = containerElement.append('svg') // associate our data with the document
                        .attr('width', width)
                        .attr('height', height)
                        .attr('id', 'idtest')

                    let radius = Math.min(width, height) / 2

                    svg = svg.append('g') // make a group to hold our ScatterChart chart
                        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')

                    // let donutWidth = 75;
                    let legendRectSize = 18
                    let legendSpacing = 4
                    let color = d3.scaleOrdinal(d3.schemeCategory10)

                    let arc = d3.arc()
                       // .innerRadius(radius - donutWidth)
                        .innerRadius(0)
                        .outerRadius(radius)
                    let ScatterChart = d3.ScatterChart()
                        .value(function (d: any) { return d.count })
                        .sort(null)
                    let path = svg.selectAll('path')
                        .data(ScatterChart(dataset))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function (d: any, i: any) {
                            return color(d.data.label)
                        })

                    // Todo limit nb (look ScatterChart chart of Google)
                    let legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function (d: any, i: any) {
                            let height = legendRectSize + legendSpacing
                            let offset = height * color.domain().length / 2
                            let horz = -2 * legendRectSize
                            let vert = i * height - offset
                            return 'translate(' + (horz + radius * 2 + 20 ) + ',' + vert + ')'
                        })
                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color)
                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d: any) { return d })*/
                /*
                                    let width = 500
                                    let height = 300
                                    let padding = 30
                                    let numDataPoints = 50
                                    let xRange = Math.random() * 1000
                                    let yRange = Math.random() * 1000
                                for (let i = 0; i < numDataPoints; i++) {
                                  let newNumber1 = Math.floor(Math.random() * xRange)
                                  let newNumber2 = Math.floor(Math.random() * yRange)
                                   dataset.push([newNumber1, newNumber2])
                                }
                                // Create scale functions
                                let xScale = d3.scale.linear()
                                               .domain([0, d3.max(dataset, function (d: any) {
                                                 return d[0]
                                               }) ])
                                               .range([padding, width - padding * 2])
                                let yScale = d3.scale.linear()
                                               .domain([0, d3.max(dataset, function (d: any) {
                                                 return d[1]
                                               })])
                                               .range([height - padding, padding])
                                let rScale = d3.scale.linear()
                                               .domain([0, d3.max(dataset, function (d: any) {
                                                 return d[1]
                                               })])
                                                            .range([2, 5])
                                let formatAsPercentage = d3.tickFormat('.1%')
                               // Define X axis
                                let xAxis = d3.svg.axis()
                                              .scale(xScale)
                                              .orient('bottom')
                                              .ticks(5)
                                              .tickFormat(formatAsPercentage)
                                // Define Y axis
                                let yAxis = d3.svg.axis()
                                              .scale(yScale)
                                                .orient('left')
                                                .ticks(5)
                                                .tickFormat(formatAsPercentage)
                                // Create SVG element
                                let svg = d3.select('#' + currentChart.container.id)
                                                        .append('svg')
                                                        .attr('width', width)
                                                        .attr('height', height)
                                                        .append('g')
                                // Create circles
                                svg.selectAll('circle')
                                     .data(dataset)
                                   .enter()
                                     .append('circle')
                                     .attr('cx', function (d: any) {
                                       return xScale(d[0])
                                     })
                                     .attr('cy', function (d: any) {
                                       return yScale(d[1])
                                     })
                                     .attr('r', function (d: any) {
                                       return rScale(d[1])
                                     })
                                // Create labels
                                svg.selectAll('text')
                                   .data(dataset)
                                   .enter()
                                   .append('text')
                                   .text(function (d: any) {
                                           return d[0] + ',' + d[1]
                                   })
                                   .attr('x', function (d: any) {
                                           return xScale(d[0])
                                   })
                                   .attr('y', function (d: any) {
                                           return yScale(d[1])
                                   })
                                   .attr('font-family', 'sans-serif')
                                   .attr('font-size', '11px')
                                   .attr('fill', 'red')
                                // Create X axis
                                svg.append('g')
                                   .attr('class', 'axis')
                                   .attr('transform', 'translate(0,' + (height - padding) + ')')
                                   .call(xAxis)
                                // Create Y axis
                                svg.append('g')
                                   .attr('class', 'axis')
                                   .attr('transform', 'translate(' + padding + ',0)')
                                   .call(yAxis)
                                   */
                // finish
                return resolve();
            });
        }
    }

    /**
     * @namespace bordercloud.visualization
     */

    var visualizationNS$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AreaChart: AreaChart$1,
        BarChart: BarChart$1,
        BubbleChart: BubbleChart$1,
        ColumnChart: ColumnChart$1,
        Line: Line,
        Pie: Pie$1,
        ScatterChart: ScatterChart$1
    });

    /**
     * @namespace d3
     */
    const visualization$3 = visualizationNS$3;

    var d3NS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        visualization: visualization$3
    });

    /**
     * Todo API
     * @class leaflet.API
     * @memberof google
     */
    class API$1 {
        static get osmAccessToken() {
            return this._osmAccessToken;
        }
        static set osmAccessToken(value) {
            this._osmAccessToken = value;
        }
    }
    /**
     * todo
     * @type {string}
     * @private
     */
    API$1._osmAccessToken = '';

    /**
     * Todo Table
     * @class leaflet.visualization.Map
     * @tutorial leaflet_visualization_Map
     * @memberof leaflet.visualization
     */
    class Map$1 extends Chart {
        get icon() {
            return 'fa fa-map';
        }
        get label() {
            return 'Map';
        }
        get subtext() {
            return 'Map';
        }
        get classFullName() {
            return 'leaflet.visualization.Map';
        }
        get tutorialFilename() {
            return 'tutorial-leaflet_visualization_Map.html';
        }
        constructor() {
            super();
            this.addCss(Core.path + 'lib/leaflet/leaflet.css');
            this.addCss(Core.path + 'lib/leaflet/MarkerCluster.Default.css');
            let dep = this.addScript(Core.path + 'lib/leaflet/leaflet.js');
            this.addScript(Core.path + 'lib/leaflet/leaflet.markercluster.js', dep);
        }
        /**
         * Make a Google map
         * todo
         * @memberOf Map
         * @returns {Promise<void>}
         * @param result
         */
        draw(result) {
            let currentChart = this;
            return new Promise(function (resolve, reject) {
                let messageError = '';
                let messageErrorParameters = 'Incorrect parameters. Parameters of chart :' +
                    ' [ wktLiteral(geosparql:wktLiteral) | latitude(xsd:Decimal) longitude(xsd:Decimal)] ' +
                    ' title(xsd:string optional) introduction(xsd:string optional) link(IRI optional) image(IRI optional). ';
                let cols = result.head.vars;
                let rows = result.results.bindings;
                let noCols = cols.length;
                let noRows = rows.length;
                let map;
                let height = '180px';
                let idChart = currentChart.container.id + '-leaflet';
                let element = document.getElementById(currentChart.container.id);
                let groupArray = []; // create new markers array
                let group;
                let markers;
                let marker;
                let lat;
                let long;
                let wktLiteralStr;
                let wktLiteralType;
                let wktLiteral;
                let tileAttributionFinal;
                let polylinelatlngs;
                let polyline;
                let rectangleBounds;
                let rectangle;
                let polygon;
                let pointWktLiteral;
                let linestringWktLiteral;
                let envelopeWktLiteral;
                let polygonWktLiteral;
                let multipolygonWktLiteral;
                let polygonPointslatlngs;
                let mapUri;
                let geoJSON;
                if (currentChart.height !== '') {
                    height = currentChart.height;
                }
                let opt = Object.assign({
                    width: currentChart.width,
                    height: height,
                    // showTooltip: true,
                    // showInfoWindow: true,
                    tileLayerTemplate: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
                    tileLayerAttributionHTML: '© <a href="https://www.mapbox.com/about/maps/" target=\'_blank\'>Mapbox</a> © <a href="http://www.openstreetmap.org/copyright" target=\'_blank\'>OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
                    tileLayerAttribution: null,
                    tileLayerAttributionLink: null,
                    tileLayerId: 'mapbox/streets-v11',
                    tileLayerAccessToken: API$1.osmAccessToken,
                    tileLayerTileSize: 512,
                    tileLayerZoomOffset: -1,
                    tileLayerTms: false,
                    tileLayerZoom: 13
                }, currentChart.options);
                if (element) {
                    element.innerHTML = "<div id='" + idChart + "' style='width: " + opt.width + '; height: ' + opt.height + ";'></div>";
                    if (opt.tileLayerAttribution != null) {
                        if (opt.tileLayerAttributionLink != null) {
                            tileAttributionFinal = "<a href=\"" + opt.tileLayerAttributionLink + "\" target='_blank'>" + opt.tileLayerAttribution + "</a>";
                        }
                        else {
                            tileAttributionFinal = opt.tileLayerAttribution;
                        }
                    }
                    else {
                        tileAttributionFinal = opt.tileLayerAttributionHTML;
                    }
                    let tileLayer = new L.tileLayer(opt.tileLayerTemplate, {
                        attribution: tileAttributionFinal,
                        tileSize: opt.tileLayerTileSize,
                        zoomOffset: opt.tileLayerZoomOffset,
                        maxZoom: 18,
                        id: opt.tileLayerId,
                        accessToken: opt.tileLayerAccessToken,
                        tms: opt.tileLayerTms,
                        zoom: opt.tileZoom,
                    });
                    map = L.map(idChart, { layers: [tileLayer] });
                    // todo insert option
                    markers = L.markerClusterGroup({
                        chunkedLoading: true,
                        spiderfyOnMaxZoom: true,
                        showCoverageOnHover: true,
                        zoomToBoundsOnClick: true
                    });
                    if (noCols < 1) {
                        messageError = messageErrorParameters;
                    }
                    else {
                        for (let row of rows) {
                            //check geoJSON
                            if (row[cols[0]].type === "uri") {
                                mapUri = row[cols[0]].value;
                                let xhr = new XMLHttpRequest();
                                //mapUri = "http://commons.wikimedia.org/data/main/Data:Paris.map"
                                //mapUri = "https://gist.githubusercontent.com/wavded/1200773/raw/e122cf709898c09758aecfef349964a8d73a83f3/sample.json"
                                xhr.open('GET', mapUri, false);
                                xhr.send(null);
                                if (xhr.status === 200) {
                                    // @ts-ignore
                                    geoJSON = L.geoJSON(JSON.parse(xhr.response));
                                    geoJSON.addTo(map);
                                    groupArray.push(geoJSON);
                                }
                                continue;
                            }
                            //check  wktLiteral
                            wktLiteralType = row[cols[0]].datatype;
                            if (wktLiteralType == "http://www.opengis.net/ont/geosparql#wktLiteral") {
                                wktLiteralStr = row[cols[0]].value;
                                try {
                                    wktLiteral = WktLiteral.create(wktLiteralStr);
                                    if (wktLiteral instanceof PointWktLiteral) {
                                        pointWktLiteral = wktLiteral;
                                        lat = wktLiteral.lat;
                                        long = wktLiteral.long;
                                        marker = L.marker([lat, long]);
                                        marker = Map$1.readOtherParametersWithPoint(row, cols.slice(1), marker);
                                        markers.addLayer(marker);
                                        groupArray.push(marker);
                                    }
                                    else if (wktLiteral instanceof LinestringWktLiteral) {
                                        linestringWktLiteral = wktLiteral;
                                        polylinelatlngs = [];
                                        for (let point of linestringWktLiteral.points) {
                                            polylinelatlngs.push([point.lat, point.long]);
                                        }
                                        polyline = L.polyline(polylinelatlngs, { color: 'red' });
                                        polyline = Map$1.readOtherParametersWithPoint(row, cols.slice(1), polyline);
                                        polyline.addTo(map);
                                        groupArray.push(polyline);
                                    }
                                    else if (wktLiteral instanceof EnvelopeWktLiteral) {
                                        envelopeWktLiteral = wktLiteral;
                                        rectangleBounds = [[envelopeWktLiteral.minLat, envelopeWktLiteral.minLong], [envelopeWktLiteral.maxLat, envelopeWktLiteral.maxLong]];
                                        rectangle = L.rectangle(rectangleBounds, { color: "#ff7800", weight: 1 });
                                        rectangle = Map$1.readOtherParametersWithPoint(row, cols.slice(1), rectangle);
                                        rectangle.addTo(map);
                                        groupArray.push(rectangle);
                                    }
                                    else if (wktLiteral instanceof PolygonWktLiteral) {
                                        polygonWktLiteral = wktLiteral;
                                        polygonPointslatlngs = [];
                                        for (let point of polygonWktLiteral.points) {
                                            polygonPointslatlngs.push([point.lat, point.long]);
                                        }
                                        polygon = L.polygon(polygonPointslatlngs, { color: 'green', weight: 1 });
                                        polygon = Map$1.readOtherParametersWithPoint(row, cols.slice(1), polygon);
                                        polygon.addTo(map);
                                        groupArray.push(polygon);
                                    }
                                    else if (wktLiteral instanceof MultiPolygonWktLiteral) {
                                        multipolygonWktLiteral = wktLiteral;
                                        for (let polygonWktLiteral of multipolygonWktLiteral.polygons) {
                                            polygonPointslatlngs = [];
                                            for (let point of polygonWktLiteral.points) {
                                                polygonPointslatlngs.push([point.lat, point.long]);
                                            }
                                            polygon = L.polygon(polygonPointslatlngs, { color: 'green', weight: 1 });
                                            polygon = Map$1.readOtherParametersWithPoint(row, cols.slice(1), polygon);
                                            polygon.addTo(map);
                                            groupArray.push(polygon);
                                        }
                                    }
                                }
                                catch (e) {
                                    if (e instanceof ErrorWktLiteral) {
                                        messageError = e.message;
                                        // console.log("ERROR SGVIZLER2: wktLiteral: "+  e.message)
                                        // continue //not fail
                                    }
                                    else {
                                        throw e;
                                    }
                                }
                            }
                            else {
                                lat = parseFloat(row[cols[0]].value);
                                long = parseFloat(row[cols[1]].value);
                                if (!isNaN(lat) && !isNaN(long)) {
                                    marker = L.marker([lat, long]);
                                    marker = Map$1.readOtherParametersWithPoint(row, cols.slice(2), marker);
                                    markers.addLayer(marker);
                                    groupArray.push(marker);
                                }
                                else {
                                    messageError = messageErrorParameters;
                                }
                            }
                        }
                    }
                    if (messageError !== '') {
                        return reject(Error(messageError));
                    }
                    if (noRows > 0) {
                        map.addLayer(markers);
                        // zoom on the markers
                        group = L.featureGroup(groupArray);
                        map.fitBounds(group.getBounds());
                    }
                    else {
                        map.fitWorld({ reset: true }).zoomIn();
                    }
                    // finish
                    return resolve();
                }
            });
        }
        static readOtherParametersWithPoint(row, cols, marker) {
            const title = row[cols[0]] !== undefined ? row[cols[0]].value : undefined;
            const text = row[cols[1]] !== undefined ? row[cols[1]].value : undefined;
            const link = row[cols[2]] !== undefined ? row[cols[2]].value : undefined;
            const img = row[cols[3]] !== undefined ? row[cols[3]].value : undefined;
            if (title === undefined
                && text === undefined
                && link === undefined
                && img === undefined) {
                return marker;
            }
            if (img !== undefined) {
                if (title !== undefined
                    && text !== undefined
                    && link !== undefined) {
                    marker.bindPopup('<div style="display: flow-root;min-height:150px;">' +
                        "<a style='font-size: large;font-style: normal;' href='" + link + "' target='_blank'>" + title + '</a>' +
                        '<div style="display: table-cell;vertical-align: top">' +
                        "<p style='margin: 0px'>" + text + '</p>' +
                        '</div>' +
                        '<div style="display: table-cell;">' +
                        "<a href='" + link + "' target='_blank'><img src='" + img + "' style='margin-left:5px;margin-bottom:5px;width:150px;float:right;'/></a>" +
                        '</div>' +
                        '</div>');
                }
                else if (title !== undefined
                    && text !== undefined) {
                    marker.bindPopup('<div style="display: flow-root;min-height:150px;min-height:150px;">' +
                        "<span style='font-size: large;font-style: normal;'>" + title + '</span>' +
                        '<div style="display: table-cell;vertical-align: top">' +
                        "<p style='margin: 0px'>" + text + '</p>' +
                        '</div>' +
                        '<div style="display: table-cell;">' +
                        "<a href='" + img + "' target='_blank'><img src='" + img + "' style='margin-left:5px;margin-bottom:5px;width:150px;float:right;'/></a>" +
                        '</div>' +
                        '</div>');
                }
                else if (title !== undefined
                    && link !== undefined) {
                    marker.bindPopup('<div style="display: flow-root;min-height:150px;min-height:150px;">' +
                        "<a style='font-size: large;font-style: normal;' href='" + link + "' target='_blank'>" + title + '</a>' +
                        '<div style="display: table-cell;">' +
                        "<a href='" + link + "' target='_blank'><img src='" + img + "' style='margin-left:5px;margin-bottom:5px;width:150px;float:right;'/></a>" +
                        '</div>' +
                        '</div>');
                }
                else if (title !== undefined) {
                    marker.bindPopup('<div style="display: flow-root;min-height:150px;min-height:150px;">' +
                        "<span style='font-size: large;font-style: normal;'>" + title + '</span>' +
                        '<div style="display: table-cell;">' +
                        "<a href='" + img + "' target='_blank'><img src='" + img + "' style='margin-left:5px;margin-bottom:5px;width:150px;float:right;'/></a>" +
                        '</div>' +
                        '</div>');
                }
                else {
                    marker.bindPopup('<div style="display: table-cell;">' +
                        "<a href='" + img + "' target='_blank'><img src='" + img + "' style='margin-left:5px;margin-bottom:5px;width:150px;float:right;'/></a>" +
                        '</div>');
                }
            }
            else {
                if (title !== undefined
                    && text !== undefined
                    && link !== undefined) {
                    marker.bindPopup("<a style='font-size: large;font-style: normal;' href='" + link + "' target='_blank'>" + title + '</a>' +
                        "<p style='margin: 0px'>" + text + '</p>');
                }
                else if (title !== undefined
                    && text !== undefined) {
                    marker.bindPopup("<span style='font-size: large;font-style: normal;'>" + title + '</span>' +
                        "<p style='margin: 0px'>" + text + '</p>');
                }
                else if (title !== undefined
                    && link !== undefined) {
                    marker.bindPopup("<a style='font-size: large;font-style: normal;' href='" + link + "' target='_blank'>" + title + '</a>');
                }
                else if (title !== undefined) {
                    marker.bindPopup("<span style='font-size: large;font-style: normal;'>" + title + '</span>');
                }
            }
            return marker;
        }
    }

    /**
     * @namespace leaflet.visualization
     */

    var visualizationNS$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Map: Map$1
    });

    /**
     * @namespace leaflet
     */
    const visualization$4 = visualizationNS$4;

    var leafletNS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        visualization: visualization$4,
        API: API$1
    });

    const sgvizler = S;
    const bordercloud = bordercloudNS;
    const google$1 = googleNS;
    const d3$1 = d3NS;
    const leaflet = leafletNS;
    /**
     * Todo
     * @const
     *
     */
    const VERSION = Core.VERSION;
    /**
     * Todo
     * @const
     */
    const HOMEPAGE = Core.HOMEPAGE;
    /**
     * Draws the sgvizler-containers with the given element id.
     *
     */
    function containerLoadAll() {
        Container.loadAllDependencies();
    }
    function readOptions(options) {
        if (options) {
            if (typeof options === 'object') {
                google$1.API.key = options.googleApiKey ? options.googleApiKey : '';
                leaflet.API.osmAccessToken = options.osmAccessToken ? options.osmAccessToken : '';
                if (options.path) {
                    Core.path = options.path.endsWith('/') ? options.path : options.path + '/';
                }
                else {
                    Core.path = '';
                }
            }
        }
    }
    /**
     * Draws the sgvizler-containers with the given element id.
     * @param {string} elementID
     */
    function containerDraw(elementID, options) {
        // S.Container.loadDependenciesId(elementID)
        readOptions(options);
        Container.drawWithElementId(elementID);
        return Logger;
    }
    /**
     * Todo.
     */
    function containerDrawAll(options) {
        // S.Container.loadAllDependencies()
        readOptions(options);
        Container.drawAll();
        return Logger;
    }
    /**
     * Todo.
     */
    function selectDraw(elementID) {
        // S.Select.loadDependencies()
        Select.drawWithElementId(elementID);
        return Logger;
    }
    /**
     * Todo.
     */
    function selectDrawAll() {
        // S.Select.loadDependencies()
        Select.drawAll();
        return Logger;
    }
    /**
     * Todo.
     * @param {string} className
     * @param {string} pathDoc
     * @returns {string}
     */
    function getChartDoc(className, pathDoc) {
        return Select.getChartDoc(className, pathDoc);
    }
    /**
     * Todo.
     * @param {string} className
     * @param {string} pathDoc
     * @returns {string}
     */
    function getChartOptions(elementID) {
        let optionsChart = "";
        Container.list.forEach((container) => {
            if (container.id === elementID) {
                optionsChart = container.chart.newOptionsRaw;
            }
        });
        return optionsChart;
    }
    function encodeHtml(str) {
        return Tools.encodeHtml(str);
    }
    function decodeHtml(str) {
        return Tools.decodeHtml(str);
    }
    function giveHTMLAndScript(idDivOfSgvizler, idHtmlOfSgvizler, idScriptOfSgvizler, options) {
        let div = document.getElementById(idDivOfSgvizler);
        let htmlDiv = document.getElementById(idHtmlOfSgvizler);
        let scriptDiv = document.getElementById(idScriptOfSgvizler);
        if (div) {
            if (htmlDiv) {
                htmlDiv.textContent = new XMLSerializer().serializeToString(div)
                    .replace(/&#10;/g, "\n")
                    .replace(/xmlns="http:\/\/www.w3.org\/1999\/xhtml"/g, "")
                    .replace(/ data-/gm, "\ndata-");
            }
            if (scriptDiv) {
                let script = "<script src=\"../browser/sgvizler2.js\"><\/script>\n" +
                    "<script>\n";
                if (options) {
                    script += "var options = {\n" +
                        "             googleApiKey : \"YOUR_GOOGLE_MAP_API_KEY\",\n" +
                        "             //OpenStreetMap Access Token\n" +
                        "             // https://www.mapbox.com/\n" +
                        "             osmAccessToken:  \"YOUR_OSM_ACCESS_TOKEN\"\n" +
                        "};\n";
                    script += "//Draw a chart\n" +
                        "//sgvizler2.containerDraw('result',options);\n" +
                        "//or\n" +
                        "//$(\"#result\").containerchart(options);\n" +
                        "\n" +
                        "//Draw all Chart\n" +
                        "sgvizler2.containerDrawAll(options);\n";
                }
                else {
                    script +=
                        "//Draw a chart\n" +
                            "//sgvizler2.containerDraw('" + idDivOfSgvizler + "');\n" +
                            "//or\n" +
                            "//$(\"#" + idDivOfSgvizler + "\").containerchart();\n" +
                            "\n" +
                            "//Draw all Chart\n" +
                            "sgvizler2.containerDrawAll();\n";
                }
                script += "<\/script>";
                scriptDiv.textContent = script;
            }
        }
    }
    function showTabHtmlAndScript(idDivOfSgvizler, options) {
        $("#" + idDivOfSgvizler).before('<ul class="nav nav-tabs" role="tablist" idDivOfSgvizler="' + idDivOfSgvizler + 'tab">\n' +
            '    <li class="nav-item">\n' +
            '         <a class="nav-link active" data-toggle="tab" href="#' + idDivOfSgvizler + 'Tab" role="tab" aria-expanded="true">Result</a>\n' +
            '         </li>\n' +
            '         <li class="nav-item">\n' +
            '         <a class="nav-link" data-toggle="tab" href="#' + idDivOfSgvizler + 'htmlTab" role="tab" aria-expanded="false">HTML</a>\n' +
            '         </li>\n' +
            '         <li class="nav-item">\n' +
            '         <a class="nav-link" data-toggle="tab" href="#' + idDivOfSgvizler + 'scriptTab" role="tab" aria-expanded="false">Javascript</a>\n' +
            '         </li>\n' +
            '</ul>\n' +
            '<div class="tab-content">\n' +
            '         <div class="tab-pane active" id="' + idDivOfSgvizler + 'Tab" role="tabpanel" aria-expanded="true">' +
            '              <div id="' + idDivOfSgvizler + 'example" style="padding: 25px;"></div>' +
            '         </div>\n' +
            '         <div class="tab-pane" id="' + idDivOfSgvizler + 'htmlTab" role="tabpanel" aria-expanded="false">\n' +
            '            <div class="bg-faded" style="padding: 25px;"><pre lang="html" id="' + idDivOfSgvizler + 'Html"></pre></div>\n' +
            '         </div>\n' +
            '         <div class="tab-pane" id="' + idDivOfSgvizler + 'scriptTab" role="tabpanel" aria-expanded="false">\n' +
            '            <div class="bg-faded" style="padding: 25px;"><pre lang="html" id="' + idDivOfSgvizler + 'Script"></pre></div>\n' +
            '         </div>\n' +
            '</div>');
        var element = $("#" + idDivOfSgvizler).detach();
        $('#' + idDivOfSgvizler + 'example').append(element);
        giveHTMLAndScript(idDivOfSgvizler, idDivOfSgvizler + "Html", idDivOfSgvizler + "Script", options);
    }
    /**
     * Todo
     * @param {string} elementID
     * @param {string} endpoint
     * @param {string} query
     * @param {string} chartName
     * @param {string} options
     * @param {string} loglevel
     * @returns {string}
     */
    function create(elementID, endpoint, query, chartName, options, loglevel, output, method, parameter, lang) {
        return Container.create(elementID, endpoint, query, chartName, options, loglevel, output, method, parameter, lang);
    }
    // noinspection JSPotentiallyInvalidConstructorUsage
    jQuery.fn.extend({
        selectchart: function (param, option) {
            let $this = this;
            let action = 'render';
            if (param) {
                if (typeof param === 'string') {
                    action = param;
                }
                else if (typeof param === 'object') {
                    action = param.action ? param.action : action;
                }
            }
            // Return the jQuery object for chaining.
            return $this.each(function (index, obj) {
                if (index >= 0 && action === 'render') {
                    if (param && typeof param === 'object') {
                        Select.draw(obj, param);
                    }
                    else {
                        Select.draw(obj);
                    }
                }
            });
        },
        containerchart: function (param, option) {
            let $this = this;
            let action = 'render';
            if (param) {
                if (typeof param === 'string') {
                    action = param;
                }
                else if (typeof param === 'object') {
                    action = param.action ? param.action : action;
                }
            }
            // Return the jQuery object for chaining.
            return $this.each(function (index, obj) {
                if (index >= 0 && action === 'render') {
                    if (param && typeof param === 'object') {
                        readOptions(param);
                    }
                    Container.drawWithElementId($(obj).attr('id'));
                }
            });
        }
    });
    Loader.detectRoot();

    exports.HOMEPAGE = HOMEPAGE;
    exports.VERSION = VERSION;
    exports.bordercloud = bordercloud;
    exports.containerDraw = containerDraw;
    exports.containerDrawAll = containerDrawAll;
    exports.containerLoadAll = containerLoadAll;
    exports.create = create;
    exports.d3 = d3$1;
    exports.decodeHtml = decodeHtml;
    exports.encodeHtml = encodeHtml;
    exports.getChartDoc = getChartDoc;
    exports.getChartOptions = getChartOptions;
    exports.giveHTMLAndScript = giveHTMLAndScript;
    exports.google = google$1;
    exports.leaflet = leaflet;
    exports.selectDraw = selectDraw;
    exports.selectDrawAll = selectDrawAll;
    exports.sgvizler = sgvizler;
    exports.showTabHtmlAndScript = showTabHtmlAndScript;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sgvizler2.js.map
