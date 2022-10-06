# ios.js

A JavaScript implementation of the Inclusion of Other in the Self scale, introduced by Aron et al. (1992).
On top of the original IOS—which we call the Pictorial IOS—`ios.js` also offers the Continuous IOS, and a middle-ground, the Step-choice IOS.

## Demo

https://geoffreycastillo.com/ios-js-demo/

## Installation

`ios.js` uses [`interact.js`](https://github.com/taye/interact.js/).
Refer to their page for instructions on how to install.

Then, download `ios.js` from the [releases](https://github.com/geoffreycastillo/ios-js/releases) and include it:

```
<script src="ios.js" type="text/javascript"></script>
```

or use a CDN such as [jsDelivr](https://www.jsdelivr.com/):

```
<script src="https://cdn.jsdelivr.net/gh/geoffreycastillo/ios-js/ios.min.js
"></script>
```

## Quick start

```
# html
<div id="ios-continuous"></div>
Proportion overlap: <span id="continuous-ios-overlap"></span>
Proportion distance: <span id="continuous-ios-distance"></span>


# js
<script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/geoffreycastillo/ios-js/ios.min.js"></script>
<script>
    const iosContinuous = new Ios({
        el: 'ios-continuous',
    });

    const continuous_ios_distance_input = document.getElementById('continuous-ios-distance');
    const continuous_ios_overlap_input = document.getElementById('continuous-ios-overlap');

    document.getElementById('ios-continuous').addEventListener(
        'mousedown',
        () => {
            window.addEventListener(
                'mouseup',
                () => {
                    continuous_ios_distance_input.innerHTML = iosContinuous.proportionDistance;
                    continuous_ios_overlap_input.innerHTML = iosContinuous.proportionOverlap;
                },
                false)
        }, false
    );
</script>
```

See the [wiki](https://github.com/geoffreycastillo/bingo-blower-js/wiki/Advice-for-oTree) for specific oTree advice.

## Examples

For the Step-Choice IOS:

```
# html
<div id="ios-step-choice"></div>
# js
const iosStepChoice = new Ios({
    el: 'ios-step-choice',
    numberCircles: 7
});
```

For the original, Pictorial IOS:

```
# html
<div id="ios-pictorial"></div>
# js
const iosPictorial = new Ios({
    el: 'ios-pictorial',
    numberCircles: 7,
    manyCircles: true,
});
```

## Documentation

See the [wiki](https://github.com/geoffreycastillo/bingo-blower-js/wiki) for the API documentation and for some specific advice when using in an experiment (
e.g. in oTree).

## Citation

If you use `ios.js`, please cite our paper: [Beranek and Castillo (2022) Continuous Inclusion of Other in the Self](https://geoffreycastillo.com/pdf/Beranek,Castillo-Continuous-Inclusion-of-Other-in-the-Self.pdf)

## Bugs? Suggestions?

[Open an issue](https://github.com/geoffreycastillo/ios-js/issues) or a [pull request](https://github.com/geoffreycastillo/ios-js/pulls), or email me
at [`geoffrey.castillo@univie.ac.at`](mailto:geoffrey.castillo@univie.ac.at).

## Licence

`ios.js` is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

Copyright (c) 2022 Geoffrey Castillo
