/**
 * Instantiate the IOS widget
 * @class
 * @param {Object} options
 * @param {string} options.el - Element where IOS will be inserted
 * @param {'continuous'|'step-choice'|'original'} [options.type = 'continuous'] - Choose between Continuous, Step-choice, or original IOS
 * @param {number} [options.numberCirles = 7] - Number of circles (original and Step-choice only)
 * @param {number} [options.circleDiameter = 100] - Initial diameter of the circles
 * @param {string} [options.you = 'You'] - String for the left circle
 * @param {string} [options.other = 'Other'] - String for the right circle
 * @param {string} [options.buttonsClass = ''] - Additional class to pass to the buttons: circles if using original IOS, arrows if using Step-choice IOS
 * @param {('column' | 'row')} [options.direction = 'column'] - Arrangement of the buttons, if using original IOS
 * @param {number} [options.leftTextWidth = 40] - Size reserved for string of left circle, needs to be adjusted manually until the initial pair of circles has no overlap
 * @param {number} [options.rightTextWidth = 40] - Size reserved for string of right circle, needs to be adjusted manually until the initial pair of circles has no overlap
 * @property {number} distance - Distance in pixels between the circles
 * @property {number} proportionOverlap - Proportion of overlap, between 0 (no overlap) and 1 (full overlap)
 * @property {number} proportionDistance - Proportion of distance, between 0 (no overlap) and 1 (full overlap)
 * @property {number} currentCircle - Current circle pair, between 1 and numberCircles (original and Step-choice only)
 */
function Ios({
                 el,
                 type = 'continuous',
                 numberCircles = 7,
                 circleDiameter = 100,
                 you = 'You',
                 other = 'Other',
                 buttonsClass = '',
                 direction = 'column',
                 leftTextWidth = 40,
                 rightTextWidth = 40
             } = {}) {


    /**
     * Replaces .outerWidth(true) from jQuery = width with margins
     * @private
     * @param el - the element
     * @return {number} the outerwidth with margins
     */
    function outerWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    }


    /**
     * Returns the left margin of an element
     * @private
     * @param el - the element
     * @return {number} - the left margin
     */
    function leftMargin(el) {
        let style = getComputedStyle(el);

        return parseInt(style.marginLeft);
    }


    /**
     * Sets the width and height of el to px
     * @private
     * @param el - the element
     * @param px - a size in pixels
     */
    function setWidthHeight(el, px) {
        el.style.width = `${px}px`;
        el.style.height = `${px}px`
    }


    /**
     * Find the area of the overlap between two circles
     * @private
     * @param radius - radius of a circle
     * @param distance - distance between the circles
     * @returns {number} - the overlap area
     */
    function areaOverlap(radius, distance) {
        return 2 * (radius ** 2) * Math.acos(distance / (2 * radius)) - (1 / 2) * distance * Math.sqrt(4 * (radius ** 2) - distance ** 2);
    }


    /**
     * Finds the total area of the circles
     * @private
     * @param radius - radius of a circle
     * @param distance - distance between the circles
     * @returns {number} - the total area
     */
    function areaCircles(radius, distance) {
        return 2 * Math.PI * (radius ** 2) - areaOverlap(radius, distance);
    }


    /**
     * Finds the proportion of overlap wrt to the total area of the circles
     * @private
     * @param radius - radius of a circle
     * @param distance - distance between the circles
     * @returns {number} - proportion overlap between 0 and 1
     */
    function findProportionOverlap(radius, distance) {
        return areaOverlap(radius, distance) / areaCircles(radius, distance)
    }


    /**
     * Find x coordinate of center of element
     * @private
     * @param element - an html element
     * @returns {number} - the x coordinate of the center
     */
    function findXPositionAtCenter(element) {
        const {top, left, width, height} = element.getBoundingClientRect();
        return left + width / 2
    }


    /**
     * Find the distance between the two circles
     * @private
     * @param leftCircle - the circle being leftCircle (on the left)
     * @param rightCircle - the circle remaining in place (on the right)
     * @returns {number} - the distance between the center of the two circles
     */
    function findDistanceBetweenCircles(leftCircle, rightCircle) {
        const draggedX = findXPositionAtCenter(leftCircle);
        const fixedX = findXPositionAtCenter(rightCircle);

        return fixedX - draggedX
    }

    function findProportionDistance(distance, initialDistance) {
        return distance / initialDistance
    }


    /**
     * Find the distance between the circles and the proportion of overlap
     * and place it in this.
     * @private
     * @param leftCircle - the left circle
     * @param rightCircle - the right circle
     */
    function reportDistanceOverlap(leftCircle, rightCircle) {
        const distance = findDistanceBetweenCircles(leftCircle, rightCircle);
        const radius = leftCircle.offsetWidth / 2;
        const overlap = findProportionOverlap(radius, distance);
        const proportionDistance = findProportionDistance(distance, circleDiameter);

        return {
            "distance": distance,
            "proportionOverlap": overlap,
            "proportionDistance": proportionDistance
        }
    }


    /** Sear for class name in DOM
     * https://stackoverflow.com/a/62209631/3248229
     * @private
     * @param {string} className
     */
    function searchForCss(className) {
        for (let i = 0; i < document.styleSheets.length; i++) {
            let styleSheet = document.styleSheets[i];
            try {
                for (let j = 0; j < styleSheet.cssRules.length; j++) {
                    let rule = styleSheet.cssRules[j];
                    // console.log(rule.selectorText)
                    if (rule.selectorText && rule.selectorText === `.${className}`) {
                        // console.log('found - ', rule.selectorText, ' ', i, '-', j);
                        return true
                    }
                }
                if (styleSheet.imports) {
                    for (let k = 0; k < styleSheet.imports.length; k++) {
                        let imp = styleSheet.imports[k];
                        for (let l = 0; l < imp.cssRules.length; l++) {
                            let rule = imp.cssRules[l];
                            if (rule.selectorText && rule.selectorText === `.${className}`) {
                                // console.log('found - ', rule.selectorText, ' ', i, '-', k, '-', l);
                                return true
                            }
                        }
                    }
                }
            } catch (err) {
            }
        }
        return false
    }


    function wrap(divs) {
        return `<div class="ios">
                        ${divs}
                </div>
                `
    }


    const wrapper = document.getElementById(el);
    const iosGroup = `
                    <div class="group left-group">
                        <div class="text left-text">${you}</div>
                        <div class="circle left-circle"></div>
                    </div>
                    <div class="group right-group">
                        <div class="circle right-circle"></div>
                        <div class="text right-text">${other}
                    </div>`
    let inner = ''

    if (type === 'original') {
        const singleCircle = function (value) {
            return `
                    <button type="button" name="ios" value="${value}" class="ios-button ${buttonsClass}">
                        <div class="circles" id="${'ios-' + value.toString()}">
                            <div>
                                ${iosGroup}
                            </div>
                        </div>
                    </button>`
        }

        for (let circle = 1; circle <= numberCircles; circle++) {
            inner += singleCircle(circle)
        }

    } else {
        inner = `
        <div class=circles>
            ${iosGroup}
        </div>`

    }

    wrapper.innerHTML = wrap(inner)

    const leftTextMinWidth = leftTextWidth
    const rightTextMinWidth = rightTextWidth
    const textMargin = 5;
    const borderWidth = 1;
    const endDiameter = Math.round(circleDiameter * Math.sqrt(2));

    const fixedStyle = document.createElement('style');
    const variableStyle = document.createElement('style');

    fixedStyle.innerHTML =
        `.ios {
    display: flex;
    flex-direction: ${direction};
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.group {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.left-group {
    touch-action: none;
    user-select: none;
    position: absolute;
}`

    variableStyle.innerHTML =
        `#${el} .circles {
    height: ${String(endDiameter + 2 * borderWidth) + 'px'};
    width: ${String(2 * endDiameter + 2 * borderWidth + leftTextMinWidth + rightTextMinWidth + 2 * textMargin) + 'px'};
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
}

#${el} .circle {
    width: ${circleDiameter.toString() + 'px'};
    height: ${circleDiameter.toString() + 'px'};
    border-width: ${borderWidth.toString() + 'px'};
    border-style: solid;
    border-color: Black;
    border-radius: 50%;
}

#${el} .right-group {
    margin-left: ${String(leftTextMinWidth + textMargin + circleDiameter) + 'px'}; /* .left-text.min-width + .left-text.margin-right + .circle.width + 2*circle.border-width */
    z-index: -1;
}

#${el} .left-text {
    margin-right: ${textMargin.toString() + 'px'};
    text-align: right;
    min-width: ${leftTextMinWidth.toString() + 'px'};
}

#${el} .right-text {
    margin-left: ${textMargin.toString() + 'px'};
    text-align: left;
    min-width: ${rightTextMinWidth.toString() + 'px'};
}`

    if (!searchForCss('ios')) {
        document.head.appendChild(fixedStyle);
    }

    document.head.appendChild(variableStyle);


    // get some elements
    let leftGroup = wrapper.querySelector('.left-group');
    let rightGroup = wrapper.querySelector('.right-group');
    let leftCircle = wrapper.querySelector('.left-circle');
    let rightCircle = wrapper.querySelector('.right-circle');

    // figure out some initial values and the scale
    const startRightGroupLeftMargin = leftMargin(rightGroup);
    const startDiameter = circleDiameter;
    const scale = 1000 / startDiameter;
    const initialDistanceOverlap = reportDistanceOverlap(leftCircle, rightCircle);
    this.distance = initialDistanceOverlap.distance;
    this.proportionOverlap = initialDistanceOverlap.proportionOverlap;
    this.proportionDistance = initialDistanceOverlap.proportionDistance;


    if (type === 'step-choice' || type === 'original') {

        if (numberCircles < 2 || numberCircles > 20) {
            throw new Error('numberCircles needs to be between 2 and 20 (both included)')
        }

        const DATA = [{}, [{"diameter": 1000, "distance": 1000}, {"diameter": 1225, "distance": 325}, {"diameter": 1414, "distance": 0}], [{
            "diameter": 1000,
            "distance": 1000
        }, {"diameter": 1155, "distance": 467}, {
            "diameter": 1291,
            "distance": 204
        }, {"diameter": 1414, "distance": 0}], [{"diameter": 1000, "distance": 1000}, {"diameter": 1118, "distance": 550}, {
            "diameter": 1225,
            "distance": 325
        }, {"diameter": 1323, "distance": 149}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1095, "distance": 606}, {"diameter": 1183, "distance": 406}, {
            "diameter": 1265,
            "distance": 250
        }, {"diameter": 1342, "distance": 117}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1080, "distance": 647}, {"diameter": 1155, "distance": 467}, {
            "diameter": 1225,
            "distance": 325
        }, {"diameter": 1291, "distance": 204}, {
            "diameter": 1354,
            "distance": 97
        }, {"diameter": 1414, "distance": 0}], [{"diameter": 1000, "distance": 1000}, {"diameter": 1069, "distance": 678}, {
            "diameter": 1134,
            "distance": 513
        }, {"diameter": 1195, "distance": 382}, {
            "diameter": 1254,
            "distance": 271
        }, {"diameter": 1309, "distance": 172}, {"diameter": 1363, "distance": 82}, {"diameter": 1414, "distance": 0}], [{
            "diameter": 1000,
            "distance": 1000
        }, {"diameter": 1061, "distance": 704}, {
            "diameter": 1118,
            "distance": 550
        }, {"diameter": 1173, "distance": 428}, {"diameter": 1225, "distance": 325}, {"diameter": 1275, "distance": 232}, {
            "diameter": 1323,
            "distance": 149
        }, {"diameter": 1369, "distance": 72}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1054, "distance": 724}, {"diameter": 1106, "distance": 580}, {
            "diameter": 1155,
            "distance": 467
        }, {"diameter": 1202, "distance": 369}, {
            "diameter": 1247,
            "distance": 282
        }, {"diameter": 1291, "distance": 204}, {"diameter": 1333, "distance": 131}, {"diameter": 1374, "distance": 64}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {
            "diameter": 1049,
            "distance": 742
        }, {"diameter": 1095, "distance": 606}, {"diameter": 1140, "distance": 498}, {"diameter": 1183, "distance": 406}, {
            "diameter": 1225,
            "distance": 325
        }, {"diameter": 1265, "distance": 250}, {
            "diameter": 1304,
            "distance": 181
        }, {"diameter": 1342, "distance": 117}, {"diameter": 1379, "distance": 57}, {"diameter": 1414, "distance": 0}], [{
            "diameter": 1000,
            "distance": 1000
        }, {"diameter": 1044, "distance": 756}, {
            "diameter": 1087,
            "distance": 628
        }, {"diameter": 1128, "distance": 526}, {"diameter": 1168, "distance": 439}, {"diameter": 1206, "distance": 361}, {
            "diameter": 1243,
            "distance": 290
        }, {"diameter": 1279, "distance": 224}, {
            "diameter": 1314,
            "distance": 163
        }, {"diameter": 1348, "distance": 106}, {"diameter": 1382, "distance": 52}, {"diameter": 1414, "distance": 0}], [{
            "diameter": 1000,
            "distance": 1000
        }, {"diameter": 1041, "distance": 769}, {
            "diameter": 1080,
            "distance": 647
        }, {"diameter": 1118, "distance": 550}, {"diameter": 1155, "distance": 467}, {"diameter": 1190, "distance": 392}, {
            "diameter": 1225,
            "distance": 325
        }, {"diameter": 1258, "distance": 262}, {
            "diameter": 1291,
            "distance": 204
        }, {"diameter": 1323, "distance": 149}, {"diameter": 1354, "distance": 97}, {"diameter": 1384, "distance": 47}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {
            "diameter": 1038,
            "distance": 780
        }, {"diameter": 1074, "distance": 664}, {"diameter": 1110, "distance": 571}, {"diameter": 1143, "distance": 491}, {
            "diameter": 1177,
            "distance": 420
        }, {"diameter": 1209, "distance": 355}, {
            "diameter": 1240,
            "distance": 295
        }, {"diameter": 1271, "distance": 239}, {"diameter": 1301, "distance": 186}, {"diameter": 1330, "distance": 136}, {
            "diameter": 1359,
            "distance": 89
        }, {"diameter": 1387, "distance": 44}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1035, "distance": 790}, {"diameter": 1069, "distance": 678}, {
            "diameter": 1102,
            "distance": 590
        }, {"diameter": 1134, "distance": 513}, {
            "diameter": 1165,
            "distance": 444
        }, {"diameter": 1195, "distance": 382}, {"diameter": 1225, "distance": 325}, {"diameter": 1254, "distance": 271}, {
            "diameter": 1282,
            "distance": 220
        }, {"diameter": 1309, "distance": 172}, {
            "diameter": 1336,
            "distance": 126
        }, {"diameter": 1363, "distance": 82}, {"diameter": 1389, "distance": 40}, {"diameter": 1414, "distance": 0}], [{
            "diameter": 1000,
            "distance": 1000
        }, {"diameter": 1033, "distance": 799}, {
            "diameter": 1065,
            "distance": 692
        }, {"diameter": 1095, "distance": 606}, {"diameter": 1125, "distance": 532}, {"diameter": 1155, "distance": 467}, {
            "diameter": 1183,
            "distance": 406
        }, {"diameter": 1211, "distance": 351}, {
            "diameter": 1238,
            "distance": 299
        }, {"diameter": 1265, "distance": 250}, {"diameter": 1291, "distance": 204}, {"diameter": 1317, "distance": 159}, {
            "diameter": 1342,
            "distance": 117
        }, {"diameter": 1366, "distance": 77}, {
            "diameter": 1390,
            "distance": 38
        }, {"diameter": 1414, "distance": 0}], [{"diameter": 1000, "distance": 1000}, {"diameter": 1031, "distance": 807}, {
            "diameter": 1061,
            "distance": 704
        }, {"diameter": 1090, "distance": 621}, {
            "diameter": 1118,
            "distance": 550
        }, {"diameter": 1146, "distance": 486}, {"diameter": 1173, "distance": 428}, {"diameter": 1199, "distance": 375}, {
            "diameter": 1225,
            "distance": 325
        }, {"diameter": 1250, "distance": 277}, {
            "diameter": 1275,
            "distance": 232
        }, {"diameter": 1299, "distance": 190}, {"diameter": 1323, "distance": 149}, {"diameter": 1346, "distance": 109}, {
            "diameter": 1369,
            "distance": 72
        }, {"diameter": 1392, "distance": 35}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1029, "distance": 814}, {"diameter": 1057, "distance": 714}, {
            "diameter": 1085,
            "distance": 635
        }, {"diameter": 1112, "distance": 566}, {
            "diameter": 1138,
            "distance": 505
        }, {"diameter": 1163, "distance": 448}, {"diameter": 1188, "distance": 396}, {"diameter": 1213, "distance": 348}, {
            "diameter": 1237,
            "distance": 302
        }, {"diameter": 1260, "distance": 258}, {
            "diameter": 1283,
            "distance": 217
        }, {"diameter": 1306, "distance": 177}, {"diameter": 1328, "distance": 139}, {"diameter": 1350, "distance": 103}, {
            "diameter": 1372,
            "distance": 67
        }, {"diameter": 1393, "distance": 33}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1027, "distance": 820}, {"diameter": 1054, "distance": 724}, {
            "diameter": 1080,
            "distance": 647
        }, {"diameter": 1106, "distance": 580}, {
            "diameter": 1131,
            "distance": 521
        }, {"diameter": 1155, "distance": 467}, {"diameter": 1178, "distance": 416}, {"diameter": 1202, "distance": 369}, {
            "diameter": 1225,
            "distance": 325
        }, {"diameter": 1247, "distance": 282}, {
            "diameter": 1269,
            "distance": 242
        }, {"diameter": 1291, "distance": 204}, {"diameter": 1312, "distance": 167}, {"diameter": 1333, "distance": 131}, {
            "diameter": 1354,
            "distance": 97
        }, {"diameter": 1374, "distance": 64}, {"diameter": 1394, "distance": 31}, {
            "diameter": 1414,
            "distance": 0
        }], [{"diameter": 1000, "distance": 1000}, {"diameter": 1026, "distance": 826}, {"diameter": 1051, "distance": 733}, {
            "diameter": 1076,
            "distance": 658
        }, {"diameter": 1100, "distance": 594}, {
            "diameter": 1124,
            "distance": 536
        }, {"diameter": 1147, "distance": 483}, {"diameter": 1170, "distance": 434}, {"diameter": 1192, "distance": 388}, {
            "diameter": 1214,
            "distance": 345
        }, {"diameter": 1235, "distance": 304}, {
            "diameter": 1256,
            "distance": 265
        }, {"diameter": 1277, "distance": 228}, {"diameter": 1298, "distance": 192}, {"diameter": 1318, "distance": 157}, {
            "diameter": 1338,
            "distance": 124
        }, {"diameter": 1357, "distance": 91}, {
            "diameter": 1376,
            "distance": 60
        }, {"diameter": 1395, "distance": 30}, {"diameter": 1414, "distance": 0}], [{"diameter": 1000, "distance": 1000}, {
            "diameter": 1025,
            "distance": 832
        }, {"diameter": 1049, "distance": 742}, {
            "diameter": 1072,
            "distance": 669
        }, {"diameter": 1095, "distance": 606}, {"diameter": 1118, "distance": 550}, {"diameter": 1140, "distance": 498}, {
            "diameter": 1162,
            "distance": 451
        }, {"diameter": 1183, "distance": 406}, {
            "diameter": 1204,
            "distance": 364
        }, {"diameter": 1225, "distance": 325}, {"diameter": 1245, "distance": 286}, {"diameter": 1265, "distance": 250}, {
            "diameter": 1284,
            "distance": 215
        }, {"diameter": 1304, "distance": 181}, {
            "diameter": 1323,
            "distance": 149
        }, {"diameter": 1342, "distance": 117}, {"diameter": 1360, "distance": 87}, {"diameter": 1379, "distance": 57}, {
            "diameter": 1396,
            "distance": 28
        }, {"diameter": 1414, "distance": 0}]]


        /**
         * Convert distance between the circles (in DATA) into distance the left circle needs to be translated
         * @private
         * @param distance: distance between the circles according to the data in DATA
         * @returns {number}: the translation to apply to the left circle
         */
        let translateDistance = function (distance) {
            return data[0].distance - distance
        }


        /**
         * Get the data from DATA, move the left circle, change the diameters, reduce the left margin of left circle
         * @private
         * @param circleNumber - the number of the circle we're treating (basically index - 1 in data)
         */
        let shiftCircles = function (circleNumber) {
            const diameter = Math.round(data[circleNumber - 1].diameter / scale)
            const translate = Math.round(translateDistance(data[circleNumber - 1].distance) / scale)
            const shiftMargin = (diameter / 2 - startDiameter / 2);

            // move the left circle group
            leftGroup.style.transform = `translate(${translate - shiftMargin}px, 0px)`;

            // change the diameter of both circles
            setWidthHeight(leftCircle, diameter);
            setWidthHeight(rightCircle, diameter);

            // change the margin of the right circle so that it appears to stay in place despite its diameter increasing
            const newMargin = startRightGroupLeftMargin - shiftMargin;
            rightGroup.style.marginLeft = `${newMargin}px`;
        }

        const data = DATA[numberCircles - 1]

        if (type === 'original') {

            let distanceOverlapPictures = [];

            for (let circle = 1; circle <= numberCircles; circle++) {
                // find each pair of circle in the DOM and arrange them according to DATA
                const iosID = 'ios-' + circle.toString()
                const circleDiv = document.getElementById(iosID)
                leftGroup = circleDiv.querySelector('.left-group')
                rightGroup = circleDiv.querySelector('.right-group')
                leftCircle = circleDiv.querySelector('.left-circle')
                rightCircle = circleDiv.querySelector('.right-circle')
                shiftCircles(circle)

                // get the distance and overlap and put it in a list
                const reports = reportDistanceOverlap(leftCircle, rightCircle);
                distanceOverlapPictures.push(reports)
            }

            const ios_buttons = document.querySelectorAll('.ios-button')
            for (const iosButton of ios_buttons) {
                iosButton.addEventListener(
                    'mousedown',
                    () => {
                        window.addEventListener(
                            'mouseup',
                            () => {
                                const pairNumber = iosButton.value;
                                this.proportionDistance = distanceOverlapPictures[pairNumber - 1].proportionDistance;
                                this.proportionOverlap = distanceOverlapPictures[pairNumber - 1].proportionOverlap;
                                this.currentCircle = pairNumber;
                            },
                            false)
                    }, false
                )
            }
        } else if (type === 'step-choice') {

            /**
             * Take the next or the previous pair of circles, retrieve the values from DATA,
             * then apply them: change the diameter and move the left circle
             * also take care of the left margin of the right circle
             * @private
             */
            let shiftAndReport = function () {
                // resize circles etc.
                shiftCircles(currentCircle);
                // expose the distance and the overlap
                const reports = reportDistanceOverlap(leftCircle, rightCircle);
                this.distance = reports.distance;
                this.proportionOverlap = reports.proportionOverlap;
                this.proportionDistance = reports.proportionDistance;
                // also report at which circle pair we're at
                this.currentCircle = currentCircle;
            }.bind(this)


            /**
             * Called when user presses next circle button
             * @private
             */
            let nextCircle = function () {
                if (currentCircle < numberCircles) {
                    ++currentCircle;
                    shiftAndReport();
                }
            }


            /**
             * Called when user presses previous circle button
             * @private
             */
            let previousCircle = function () {
                if (currentCircle > 1) {
                    --currentCircle;
                    shiftAndReport();
                }
            }

            /**
             * Helper to create the before and next circle buttons
             * @private
             * @param id - the id of the button
             * @param innerHTML - what the button looks like (typically right and left arrows)
             * @returns {HTMLButtonElement}
             */
            let createButton = function (id, innerHTML) {
                let button = document.createElement('button')
                button.id = id;
                button.innerHTML = innerHTML
                button.type = 'button';
                if (buttonsClass !== '') {
                    const buttonClassArray = buttonsClass.split(/\s+/);
                    button.classList.add(...buttonClassArray);
                }
                return button
            }

            // get the IOS groups and change the flex direction
            const iosGroup = wrapper.querySelector('.ios')
            iosGroup.style.flexDirection = 'row';

            // get the circles group
            const circles = wrapper.querySelector('.circles');

            // add the buttons
            const previousButton = createButton('previous-circle', '&larr;');
            circles.before(previousButton);

            const nextButton = createButton('next-circle', '&rarr;');
            circles.after(nextButton);

            // initialise
            let currentCircle = 1;
            this.currentCircle = currentCircle;

            // add the event listeners on the buttons
            nextButton.addEventListener('mousedown', nextCircle);
            previousButton.addEventListener('mousedown', previousCircle)
        }
    }
    
    if (type === 'continuous') {
        /**
         * Given the distance between the circles, finds the radius such that
         * - the total area is constant
         * - the increase in the proportion of overlap is linear
         * To do that, uses the results from the OLS (see R script)
         * @private
         * @param distance: distance between the circles
         * @return {number}: the radius that satisfies the requirements above
         */
        let findRadius = function (distance) {
            const diameter = 1.415e+03 / scale - 6.428e-01 * distance + 1.789e-04 * scale * (distance ** 2) - 2.059e-08 * scale ** 2 * (distance ** 3) + 6.938e-11 * scale ** 3 * (distance ** 4)

            return diameter / 2
        }


        /**
         * Called at each move
         * @private
         * @param event
         */
        let onMove = function (event) {
            // how far the mouse goes
            const drag = event.dx;

            positionX += drag;

            // do not go out of bound
            if (positionX < 0) {
                positionX = 0;
            } else if (positionX > maxDrag) {
                positionX = maxDrag;
            }

            // move the draggable circle
            event.target.style.transform = `translate(${positionX}px, 0px)`;

            // find the distances between the circles
            let distance = findDistanceBetweenCircles(leftCircle, rightCircle);

            // find the new radius of the circles that keeps the overlap constant
            const newR = findRadius(distance);
            const newD = Math.round(newR * 2);

            // increase the size of the circles
            // do it only if the circles have actually increased
            if (newD > startDiameter) {
                setWidthHeight(leftCircle, newD);
                setWidthHeight(rightCircle, newD);
            }
            // shift the margin of the fixed circle so that it appears to remain in place
            const shiftMargin = (newD / 2 - startDiameter / 2);
            const newMargin = Math.round(startRightGroupLeftMargin - shiftMargin);
            rightGroup.style.marginLeft = `${newMargin}px`;

            // expose the distance and the overlap
            const reports = reportDistanceOverlap(leftCircle, rightCircle);
            this.distance = reports.distance;
            this.proportionOverlap = reports.proportionOverlap;
            this.proportionDistance = reports.proportionDistance;
        }

        // find the initial radius and the radius that we'll need at the end
        // so that area of the two overlapping circles = sum of the areas of the two circles
        // deduct how much in total we'll need to increase the radius
        const startR = startDiameter / 2;
        const endR = Math.sqrt(2) * startR;
        const diffR = endR - startR;

        // get margin of right circle and width of left circle + text
        const leftGroupWidth = outerWidth(leftGroup);

        // drag parameters
        const maxDrag = outerWidth(leftCircle) - diffR + startRightGroupLeftMargin - leftGroupWidth;

        // initialise
        let positionX = 0;

        // declare the draggable circles
        const draggableCircle = interact(leftGroup);
        draggableCircle.draggable({
            startAxis: 'x',
            lockAxis: 'x',
            onmove: onMove.bind(this),
        });
    } 

    if (type !== 'continuous' && type !== 'step-choice' && type !== 'original') {
        throw new Error("numberCircles needs to be 'continuous', 'step-choice', or 'original'")
    }
}