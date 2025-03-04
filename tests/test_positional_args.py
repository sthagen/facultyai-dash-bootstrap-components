import inspect

import dash_bootstrap_components as dbc
import pytest
from dash import Dash, html
from dash_bootstrap_components._components import __all__ as COMPONENT_NAMES
from selenium.webdriver.common.by import By


def test_dbpa001_checklist(dash_duo):
    """
    Check that the options and value positional arguments are working for dbc.Checklist.
    """
    app = Dash()

    options = {
        "OptionA": "Option 1",
        "OptionB": "Option 2",
        "OptionC": "Option 3",
    }

    value = "OptionB"

    with_keywords = dbc.Checklist(
        options=options,
        value=value,
        id="with-keywords",
    )
    without_keywords = dbc.Checklist(options, value, id="without-keywords")

    app.layout = html.Div([with_keywords, without_keywords])

    dash_duo.start_server(app)

    # Check values
    assert [
        a.get_attribute("value")
        for a in dash_duo.wait_for_element("#with-keywords").find_elements(
            by=By.TAG_NAME, value="input"
        )
    ] == [
        a.get_attribute("value")
        for a in dash_duo.wait_for_element("#without-keywords").find_elements(
            by=By.TAG_NAME, value="input"
        )
    ]

    # Check labels
    assert [
        a.text
        for a in dash_duo.wait_for_element("#with-keywords").find_elements(
            by=By.TAG_NAME, value="label"
        )
    ] == [
        a.text
        for a in dash_duo.wait_for_element("#without-keywords").find_elements(
            by=By.TAG_NAME, value="label"
        )
    ]


def test_dbpa002_radio_items(dash_duo):
    """
    Check that the options and value positional arguments are working for
    dbc.RadioItems.
    """
    app = Dash()

    options = {
        "OptionA": "Option 1",
        "OptionB": "Option 2",
        "OptionC": "Option 3",
    }

    value = "OptionB"

    with_keywords = dbc.RadioItems(
        options=options,
        value=value,
        id="with-keywords",
    )
    without_keywords = dbc.RadioItems(options, value, id="without-keywords")

    app.layout = html.Div([with_keywords, without_keywords])

    dash_duo.start_server(app)

    # Check values
    assert [
        a.get_attribute("value")
        for a in dash_duo.wait_for_element("#with-keywords").find_elements(
            by=By.TAG_NAME, value="input"
        )
    ] == [
        a.get_attribute("value")
        for a in dash_duo.wait_for_element("#without-keywords").find_elements(
            by=By.TAG_NAME, value="input"
        )
    ]

    # Check labels
    assert [
        a.text
        for a in dash_duo.wait_for_element("#with-keywords").find_elements(
            by=By.TAG_NAME, value="label"
        )
    ] == [
        a.text
        for a in dash_duo.wait_for_element("#without-keywords").find_elements(
            by=By.TAG_NAME, value="label"
        )
    ]


def test_dbpa003_select(dash_duo):
    """
    Check that the options and value positional arguments are working for dbc.Select.
    """
    app = Dash()

    options = {
        "OptionA": "Option 1",
        "OptionB": "Option 2",
        "OptionC": "Option 3",
    }

    value = "OptionB"

    with_keywords = dbc.Select(
        options=options,
        value=value,
        id="with-keywords",
    )
    without_keywords = dbc.Select(options, value, id="without-keywords")

    app.layout = html.Div([with_keywords, without_keywords])

    dash_duo.start_server(app)

    # Check values
    assert [
        a.get_attribute("value")
        for a in dash_duo.wait_for_element("#with-keywords").find_elements(
            by=By.TAG_NAME, value="option"
        )
    ] == [
        a.get_attribute("value")
        for a in dash_duo.wait_for_element("#without-keywords").find_elements(
            by=By.TAG_NAME, value="option"
        )
    ]

    # Check labels
    assert [
        a.text
        for a in dash_duo.wait_for_element("#with-keywords").find_elements(
            by=By.TAG_NAME, value="option"
        )
    ] == [
        a.text
        for a in dash_duo.wait_for_element("#without-keywords").find_elements(
            by=By.TAG_NAME, value="option"
        )
    ]


@pytest.mark.parametrize("component_name", COMPONENT_NAMES)
def test_dbpa004_keyword_only_args(component_name):
    component = getattr(dbc, component_name)
    signature = inspect.signature(component)
    id_seen = False
    for name, param in signature.parameters.items():
        if name == "id":
            id_seen = True
        elif id_seen:
            # all parameters after the id should be keyword only or **kwargs
            assert param.kind in (
                inspect.Parameter.KEYWORD_ONLY,
                inspect.Parameter.VAR_KEYWORD,
            )

    assert id_seen
