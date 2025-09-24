# `ios.js`

A JavaScript implementation of the Inclusion of Other in the Self (IOS) scale *that satisfies its original design features*.

`ios.js` offers three versions:
- Continuous IOS scale: fully continuous IOS scale

![Continuous IOS gif](demo/continuous-ios.gif)

- Step-choice IOS scale: discrete IOS scale that allows for many circles via buttons to move between pairs of circles

![Step-choice IOS gif](demo/step-choice-ios.gif)

- Standard IOS scale

![Standard IOS gif](demo/standard-ios.gif)

Number of pairs of circles, circle sizes, and labels (among other options) can be easily customised.

We also offer [extended versions of the discrete IOS scales](https://github.com/geoffreycastillo/ios-js/wiki/Extended-IOS-scales) that add intermediate circles.
These versions are useful when one expects IOS scores to be concentrated at the lower-end of the scale.
As we explain on that link, they also allow to replicate [IOS11](https://www.nature.com/articles/s41598-024-58042-6).

## Demo

https://geoffreycastillo.com/ios-js-demo/

## Paper

We present `ios.js`, and in particular the Continuous IOS scale, in more details in our (open-access) paper: [Beranek and Castillo (2022) Continuous Inclusion of Other in the Self](https://doi.org/10.1007/s40881-024-00176-4).

If you use `ios.js`, please cite it!

## Installation

`ios.js` uses [`interact.js`](https://github.com/taye/interact.js/).
It is tested with version `1.10.17`.
Refer to their page for instructions on how to install; for example, with a CDN:

```
<script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js"></script>
```

Then, download `ios.js` from the [releases](https://github.com/geoffreycastillo/ios-js/releases) and include it:

```
<script src="ios.js" type="text/javascript"></script>
```

or use a CDN such as [jsDelivr](https://www.jsdelivr.com/):

```
<script src="https://cdn.jsdelivr.net/gh/geoffreycastillo/ios-js/ios.min.js"></script>
```

When you use `ios.js` in a real experiment and rely on jsDelivr, you should specify a version number by replacing `ios-js` with `ios-js@x.x.x` in the link, where `x.x.x` corresponds to one of the version numbers in the [releases](https://github.com/geoffreycastillo/ios-js/releases). 
For example, to use `0.3.0`:

```
<script src="https://cdn.jsdelivr.net/gh/geoffreycastillo/ios-js@0.3.0/ios.min.js"></script>
```

Otherwise, you will use the latest version and run the risk that I push a new version while your experiment is running, which could break something.

## Quick start

```
# html
<div id="ios-continuous"></div>
Proportion overlap: <span id="continuous-ios-overlap"></span>
Proportion distance: <span id="continuous-ios-distance"></span>
```

```
# js
<script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/geoffreycastillo/ios-js@0.3.0/ios.min.js"></script>
<script>
    const iosContinuous = new Ios({
        el: 'ios-continuous',
    });

    const continuous_ios_distance_input = document.getElementById('continuous-ios-distance');
    const continuous_ios_overlap_input = document.getElementById('continuous-ios-overlap');

    document.getElementById('ios-continuous').addEventListener(
        'pointerdown',
        () => {
            window.addEventListener(
                'pointerup',
                () => {
                    continuous_ios_distance_input.innerHTML = iosContinuous.proportionDistance;
                    continuous_ios_overlap_input.innerHTML = iosContinuous.proportionOverlap;
                },
                false)
        }, false
    );
</script>
```

## Documentation

The [API documentation](https://github.com/geoffreycastillo/ios-js/wiki/API-Documentation) is in the [wiki](https://github.com/geoffreycastillo/ios-js/wiki).
If you do not want to dig in the doumentation, see below for the most common questions.

## Frequently asked questions

<details>

<summary>How to create the original IOS scale?</summary>

Use `type: 'original'` when creating the `Ios` object:
```
# html
<div id="ios-original"></div>
# js
const iosPictorial = new Ios({
    el: 'ios-original',
    type: 'original'
});
```

</details>

<details>

<summary>How to create the step-choice IOS scale?</summary>

Use `type: 'step-choice'`:
```
# html
<div id="ios-step-choice"></div>
# js
const iosStepChoice = new Ios({
    el: 'ios-step-choice',
    type: 'step-choice'
});
```

</details>

<details>

<summary>How to change the number of circles?</summary>

Use the `numberCircles` option.
For example, to create a step-choice IOS scale with 10 pairs of circles:
```
# js
const iosStepChoice = new Ios({
    el: 'ios-step-choice',
    type: 'step-choice',
    numberCircles: 10
});
```

</details>

<details>

<summary>Can I use it in Qualtrics?</summary>

Yes! See the wiki for instructions on [how to use `ios.js` with Qualtrics](https://github.com/geoffreycastillo/ios-js/wiki/Qualtrics).

</details>

<details>

<summary>Can I use it in oTree?</summary>

Yes! We have a [separate demo app](https://github.com/geoffreycastillo/ios_js_otree_demo).

</details>

<details>

<summary>How to change the labels 'You' and 'Other'?</summary>

Use the `you` and `other` options when creating the `Ios` object.
For example, to change 'You' to 'Children' and 'Other' to 'Parents':
```# js
const iosContinuous = new Ios({
    el: 'ios-continuous',
    you: 'Children',
    other: 'Parents'
});
```

</details>

<details>

<summary>Does it work on mobile devices?</summary>

Yes! 
In fact, `ios.js` does not handle the event listeners so it is up to you to decide how to trigger the event that records the value.
If you want to ensure that it works on both desktop and mobile devices, use the `PointerEvent` interface (with the events `pointerdown` and `pointerup`).
This is what the examples and the demo page do.

</details>

<details>

<summary>Help! My subjects do not interact with the circles and report no overlap!</summary>

In the original IOS scale, all pairs of circles are presented at once and subjects have to click on one of them.
By contrast, in the Continuous IOS scale, subjects are initially presented with only two non-overlapping circles, so no overlap is the default.
In principle, if your subjects want to report no overlap at all, they do not need to interact with the circles.
This can cause some ambiguity about whether subjects who report no overlap actually wanted to do so or simply skipped the task.

We see two ways of addressing this issue.
1. You could force subjects to progress only after they have interacted with the circles.
   For example, you could disable the "Next" button until they have interacted with the circles.
   The issue here is that you risk getting inflated overlap scores if subjects interact with the circles just to be able to progress.
2. The solution we have favoured in the experiment is to force subjects to interact with the circles in the instructions, but not in the task itself.
    When providing instructions about the Continuous IOS scale, we asked subjects to go almost all the way to full overlap to make the button "Next" appear.
    Subjects could thus get experience manipulating the circles.
    Then, in the next page where they actually report their IOS score, we did not force them to interact with the circles.
    We then interpreted an empty value as no overlap.

</details>


## Bugs? Suggestions?

[Open an issue](https://github.com/geoffreycastillo/ios-js/issues) or a [pull request](https://github.com/geoffreycastillo/ios-js/pulls), or email me
at [`geoffrey.castillo@ntu.ac.uk`](mailto:geoffrey.castillo@ntu.ac.uk).
