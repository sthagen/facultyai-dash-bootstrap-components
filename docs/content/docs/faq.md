---
title: FAQ
---

# Frequently Asked Questions

This page contains various tips and tricks and answers to frequently asked questions about _dash-bootstrap-components_. If you think something is missing, please submit an [issue][issue] on the GitHub issue tracker.

### How do I scale the viewport on mobile devices?

When building responsive layouts it is typical to have something like the following in your HTML template

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

this ensures that mobile devices don't rescale your content on small screens and lets you build mobile optimised layouts. See [here](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag) for a great explanation.

To achieve the same thing in Dash, use the `metas` keyword argument in the `Dash` constructor.

```python
app = dash.Dash(
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"},
    ],
)
```

### How do I make the `Popover` wider?

Bootstrap sets the `max-width` of the popover in the `.popover` CSS class. You can overwrite this, either by using a local copy of Bootstrap CSS and editing the file, or by adding a snippet like the following to your `assets/` folder.

```css
.popover {
  max-width: 400px;
}
```

See the [Dash docs](https://dash.plotly.com/external-resources) for details on linking custom stylesheets.

### Using Bootstrap and `dash_table.DataTable` together

This is a historical problem that was fixed in Dash 1.18.1. If you are able to, the easiest fix to compatibility issues with `dash_table.DataTable` and _dash-bootstrap-components_ is to simply update Dash

```
pip install -U dash
```

If you have an older version of Dash and are unable to update, then read on for a workaround.

Bootstrap CSS defines a CSS class called `row`, which is a key part of the Bootstrap grid system. The `DataTable` component applies the `row` class to rows in the table, which causes a clash and breaks some of the formatting of the table. In particular the table can overflow its container, and dropdowns aren't rendered correctly.

The solution is to prevent the Bootstrap row styles from being applied to rows in the table. There are two ways to do this. The first way, which is maybe more convenient if you just have a single table, is to pass additional arguments to the `css` prop of `DataTable` like this

```python
DataTable(..., css=[{"selector": ".row", "rule": "margin: 0; display: block"}])
```

Alternatively, you can write the following custom CSS to apply the styles to all tables in your app.

```css
.dash-table-container .row {
  display: block;
  margin: 0;
}
```

See the [Dash docs](https://dash.plotly.com/external-resources) for details on linking custom stylesheets.

### Why aren't my icons appearing?

The CDN links for icons we include are for [Bootstrap Icons v1.8.1](https://icons.getbootstrap.com/) and [Font Awesome v6.1.1](https://fontawesome.com/). With either library, if you are trying to use an icon, and it simply isn't appearing, then please check which icon documentation version you are using. Both libraries add new icons regularly, and it may be that the icon you want has been renamed or isn't included in the versions we include listed above.

### How do I create a multi-select?

`Select` can only be used to select individual items and doesn't have a multi-select feature. This is due to a limitation with how html renders selects. If you wish to be able to use multi-select, instead use `dash_core_components.Dropdown` with `multi=True` and apply css to style it in-line with Bootstrap styles. You can see an example of how to do this [here](https://github.com/tcbegley/dash-bootstrap-css).

[issue]: https://github.com/dbc-team/dash-bootstrap-components/issues/new?template=feature.md
