Bootstrap Application Wizard
============================

![Screenshot](http://i.imgur.com/e9B2Z.png)

General
-------
Author
* [Andrew Moffat](https://github.com/amoffat), built @ [Panopta](http://www.panopta.com/)

Contributors
* [Huzaifa Tapal](https://twitter.com/htapal)
* [Jason Abate](https://github.com/jasonabate)
* [John Zimmerman](https://github.com/johnzimmerman)
* [Shabbir Karimi](https://github.com/shabbirkarimi)
* [Gert-Jan Timmer] (https://github.com/GJRTimmer)

Dependencies
------------
* jQuery 2.x
* Bootstrap 3.x
 
Installation
------------
CSS

```html
<link href="bootstrap-wizard/bootstrap-wizard.css" rel="stylesheet" />
```

Javascript
```html
<script src="bootstrap-wizard/bootstrap-wizard.js" type="text/javascript"></script>
```

Usage
-----
#### 1) Create wizard ####

```html
<div class="wizard" id="some-wizard" data-title="Wizard Title"></div>
```

To set the title of the application wizard use the `data-title` attribute

#### 2) Create wizard cards ####
Each .wizard-card will be its own step in the Application Wizard, and the h3 tag will be used for its navigation name on the left.  Also notice the `data-cardname` attribute on each card. While not required, this can be used to access the cards by a specific name.

Card Setup
```html
<div class="wizard-card" data-cardname="card1">
    <h3>Card 1</h3>
    Some content
</div>
```


Basic Wizard Setup
```html
<div class="wizard" id="some-wizard" data-title="Wizard Title">
    <div class="wizard-card" data-cardname="card1">
        <h3>Card 1</h3>
        Some content
    </div>
    
    <div class="wizard-card" data-cardname="card2">
        <h3>Card 2</h3>
        Some content
    </div>
</div>
```

#### 3) Initialize Wizard ####
After setting up the wizard with it's cards you can initilize it.

```javascript
$(function() {
    var options = {};
    var wizard = $("#some-wizard").wizard(options);
});
```


Wizard Options
--------------
<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>keyboard</td>
        <td>boolean</td>
        <td>true</td>
        <td>Closes the modal when escape key is pressed.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>boolean</td>
        <td>false</td>
        <td>Shows the modal when initialized.</td>
    </tr>
    <tr>
        <td>showCancel</td>
        <td>boolean</td>
        <td>false</td>
        <td>Show cancel button when initialized.</td>
    </tr>
    <tr>
        <td>showClose</td>
        <td>boolean</td>
        <td>true</td>
        <td>Show close button when initialized</td>
    </tr>
    <tr>
        <td>progressBarCurrent</td>
        <td>boolean</td>
        <td>false</td>
        <td></td>
    </tr>
    <tr>
        <td>increateHeight</td>
        <td>integer</td>
        <td>0</td>
        <td>Deprecated</td>
    </tr>
    <tr>
        <td>width</td>
        <td>integer</td>
        <td>750</td>
        <td>Deprecated</td>
    </tr>
    <tr>
        <td>contentHeight</td>
        <td>integer</td>
        <td>300</td>
        <td>Default height of content view</td>
    </tr>
    <tr>
        <td>contentWidth</td>
        <td>integer</td>
        <td>580</td>
        <td>Default width of wizard</td>
    </tr>
    <tr>
        <td>buttons</td>
        <td>array</td>
        <td>
            cancelText: "Cancel"<br />
            nextText: "Next"<br />
            backText: "Back"<br />
            submitText: "Submit"<br />
            submittingText: "Submitting..."<br />
        </td>
        <td></td>
    </tr>
</table>

Logging can be turned on by setting logging setting before wizard initialization
```javascript
$.fn.wizard.logging = true;
```

Wizard Methods
--------------
Usage:
```javascript
var wizard = $("#some-wizard").wizard({});

wizard.methodName(arguments);
```

<table>
    <tr>
        <th>Method</th>
        <th>Arguments</th>
        <th>Argument type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show()</td>
        <td></td>
        <td></td>
        <td>Displays the wizard</td>
    </tr>
    <tr>
        <td>hide()</td>
        <td></td>
        <td></td>
        <td>Alias for close()</td>
    </tr>
    <tr>
        <td>close()</td>
        <td></td>
        <td></td>
        <td>Closes the wizard</td>
    </tr>
    <tr>
        <td>serialize()</td>
        <td></td>
        <td></td>
        <td>Returns all inputs from the wizard as serialized string, see [jQuery serialize()] (http://api.jquery.com/serialize/)</td>
    </tr>
    <tr>
        <td>serializeArray()</td>
        <td></td>
        <td></td>
        <td>Returns all inputs from the wizard as array object, can be used for sending a JSON object to the server. See [jQuery serializeArray()] (http://api.jquery.com/serializeArray/)</td>
    </tr>
    <tr>
        <td>getActiveCard</td>
        <td></td>
        <td></td>
        <td>Returns a wizardCard object for the active card</td>
    </tr>
    <tr>
        <td>setTitle(title)</td>
        <td>title</td>
        <td>string</td>
        <td>Set the title of the wizard</td>
    </tr>
    <tr>
        <td>setSubtitle(subTitle)</td>
        <td>subTitle</td>
        <td>string</td>
        <td>Sets the secondary, less pronounced title in the wizard header</td>
    </tr>
    <tr>
        <td>errorPopover(element, msg)</td>
        <td>element<br/>msg</td>
        <td>element object<br />string</td>
        <td>This creates an error popup on element, with content msg.  This is useful being called from a card-level validator, where you might want to pick specific elements on a card on which to show an error tooltip.</td>
    </tr>
    <tr>
        <td>changeNextButton(text, [class])</td>
        <td>text<br />class (optional)</td>
        <td>string<br />string</td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

Wizard Events
-------------
You can register on the follwing wizard events with jQuery's `on(eventName, callback)` function.

Example registering on the reset event
```javascript
var wizard = $("#some-wizard").wizard({});

wizard.on("reset", function() {
    // Some reset actions
});
```

<table>
    <tr>
        <th>Event</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>reset</td>
        <td>Reset event is called when the dialog is either closed or when submit is done</td>
    </tr>
    <tr>
        <td>submit</td>
        <td>Triggers when the submit button is clicked on the final card</td>
    </tr>
    <tr>
        <td>closed</td>
        <td>Triggers when the wizard is closed</td>
    </tr>
    <tr>
        <td>incrementCard</td>
        <td>Triggers  when the next card becomes the current card</td>
    </tr>
    <tr>
        <td>decrementCard</td>
        <td>Triggers when the previous card becomes the current card</td>
    </tr>
    <tr>
        <td>progressBar</td>
        <td>Triggers when the progress bar is incremented.  The first argument passed to the callback is the new progress percent from 0 to 100.</td>
    </tr>
    <tr>
        <td>submitSuccess</td>
        <td>Trigger when submit was succesfull</td>
    </tr>
    <tr>
        <td>submitFailure</td>
        <td>Trigger when submit failed</td>
    </tr>
    
    <tr>
        <td>submitError</td>
        <td>Triggers when submit encounters an error</td>
    </tr>
    <tr>
        <td>loading</td>
        <td>Triggers after the submit event</td>
    </tr>
    <tr>
        <td>readySubmit</td>
        <td>Triggers when the wizard has reached its final card</td>
    </tr>
</table>


Working with cards
------------------

#### Access Card ####
Cards can be accessed through the cards attribute on the wizard object. By default, this is an object whose keys are the text from the h3 tags, and whose values are instances of the WizardCard class. So for example, with the following markup:
```html
<div class="wizard" id="some-wizard">
    <div class="wizard-card">
        <h3>Card 1</h3>
        <div>...</div>
    </div>
</div>
```

You could access this card the following way:
```javascript
var wizard = $("#some-wizard").wizard();
var card = wizard.cards["Card 1"];
```

From this card object, you can call any of the card methods.
You can also set a card’s name specifically by using the `data-cardname` attribute
```html
<div class="wizard" id="some-wizard">
    <div class="wizard-card" data-cardname="card1">
        <h3>Card 1</h3>
        <div>...</div>
    </div>
</div>
```

Now you can access the card by the name “card1″:
```javascript
var wizard = $("#some-wizard").wizard();
var card = wizard.cards["card1"];
```






To be Removed
# [Demo & Complete Documentation](http://www.panopta.com/2013/02/06/bootstrap-application-wizard/)
