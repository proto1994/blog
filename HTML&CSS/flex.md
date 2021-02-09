#### Basic Values of [flex](https://www.w3.org/TR/css-flexbox-1/#propdef-flex)

*This section is informative.*

The list below summarizes the effects of the four [flex](https://www.w3.org/TR/css-flexbox-1/#propdef-flex) values that represent most commonly-desired effects:

- [flex: initial](https://www.w3.org/TR/css-flexbox-1/#propdef-flex)

  Equivalent to [flex: 0 1 auto](https://www.w3.org/TR/css-flexbox-1/#propdef-flex). (This is the initial value.) Sizes the item based on the [width](https://www.w3.org/TR/CSS21/visudet.html#propdef-width)/[height](https://www.w3.org/TR/CSS21/visudet.html#propdef-height) properties. (If the item’s [main size property](https://www.w3.org/TR/css-flexbox-1/#main-size-property) computes to [auto](https://www.w3.org/TR/css-sizing-3/#valdef-width-auto), this will size the flex item based on its contents.) Makes the flex item inflexible when there is positive free space, but allows it to shrink to its minimum size when there is insufficient space. The [alignment abilities](https://www.w3.org/TR/css-flexbox-1/#alignment) or [auto margins](https://www.w3.org/TR/css-flexbox-1/#auto-margins) can be used to align flex items along the [main axis](https://www.w3.org/TR/css-flexbox-1/#main-axis).

- [flex: auto](https://www.w3.org/TR/css-flexbox-1/#propdef-flex)

  Equivalent to [flex: 1 1 auto](https://www.w3.org/TR/css-flexbox-1/#propdef-flex). Sizes the item based on the [width](https://www.w3.org/TR/CSS21/visudet.html#propdef-width)/[height](https://www.w3.org/TR/CSS21/visudet.html#propdef-height) properties, but makes them fully flexible, so that they absorb any free space along the [main axis](https://www.w3.org/TR/css-flexbox-1/#main-axis). If all items are either [flex: auto](https://www.w3.org/TR/css-flexbox-1/#propdef-flex), [flex: initial](https://www.w3.org/TR/css-flexbox-1/#propdef-flex), or [flex: none](https://www.w3.org/TR/css-flexbox-1/#propdef-flex), any positive free space after the items have been sized will be distributed evenly to the items with [flex: auto](https://www.w3.org/TR/css-flexbox-1/#propdef-flex).

- [flex: none](https://www.w3.org/TR/css-flexbox-1/#propdef-flex)

  Equivalent to [flex: 0 0 auto](https://www.w3.org/TR/css-flexbox-1/#propdef-flex). This value sizes the item according to the [width](https://www.w3.org/TR/CSS21/visudet.html#propdef-width)/[height](https://www.w3.org/TR/CSS21/visudet.html#propdef-height) properties, but makes the flex item [fully inflexible](https://www.w3.org/TR/css-flexbox-1/#fully-inflexible). This is similar to [initial](https://www.w3.org/TR/css-cascade-4/#valdef-all-initial), except that flex items are not allowed to shrink, even in overflow situations.

- [flex: ](https://www.w3.org/TR/css-flexbox-1/#propdef-flex)

  Equivalent to [flex:  1 0](https://www.w3.org/TR/css-flexbox-1/#propdef-flex). Makes the flex item flexible and sets the [flex basis](https://www.w3.org/TR/css-flexbox-1/#flex-flex-basis) to zero, resulting in an item that receives the specified proportion of the free space in the flex container. If all items in the flex container use this pattern, their sizes will be proportional to the specified flex factor.

By default, flex items won’t shrink below their minimum content size (the length of the longest word or fixed-size element). To change this, set the [min-width](https://www.w3.org/TR/CSS21/visudet.html#propdef-min-width) or [min-height](https://www.w3.org/TR/CSS21/visudet.html#propdef-min-height) property. (See [§4.5 Automatic Minimum Size of Flex Items](https://www.w3.org/TR/css-flexbox-1/#min-size-auto).)

