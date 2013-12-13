Bootstrap Application Wizard
============================

![Screenshot](http://i.imgur.com/e9B2Z.png)

General
-------
Author
* [Andrew Moffat](https://github.com/amoffat), built @ [Panopta](http://www.panopta.com/)

Special Thanks
* [Huzaifa Tapal](https://twitter.com/htapal)
* [Jason Abate](https://github.com/jasonabate)
* [John Zimmerman](https://github.com/johnzimmerman)
* [Shabbir Karimi](https://github.com/shabbirkarimi)

Update bootstrap v3.x
* [Gert-Jan Timmer] (https://github.com/GJRTimmer)

Contributors
* [Andrew Moffat] (https://github.com/amoffat)
* [bryancallahan] (https://github.com/bryancallahan)
* [che-burashco] (https://github.com/che-burashco)
* [bluetidepro] (https://github.com/bluetidepro)
* [david-proweb] (https://github.com/david-proweb)
* [kachar] (https://github.com/kachar)
* [ludokx] (https://github.com/ludokx)
* [choudeshell] (https://github.com/choudeshell)


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


Wizard
------


#### Wizard Options ####
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
        <td>backdrop</td>
        <td>boolean or string `static`</td>
        <td>true</td>
        <td>Includes a modal-backdrop element. Alternatively, specify `static` for a backdrop which doesn't close the modal on click.</td>
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
        <td>submitUrl</td>
        <td>string</td>
        <td>''</td>
        <td>Default submit url</td>
    </tr>
    <tr>
        <td>increateHeight</td>
        <td>integer</td>
        <td>0</td>
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
        <td>Default width of wizard dialog, includes step navigation, which takes 28%.</td>
    </tr>
    <tr>
        <td>buttons</td>
        <td>array</td>
        <td colspan="2">
            cancelText: "Cancel"<br />
            nextText: "Next"<br />
            backText: "Back"<br />
            submitText: "Submit"<br />
            submittingText: "Submitting..."<br />
        </td>
    </tr>
    <tr>
        <td>formClass</td>
        <td>string</td>
        <td>form-horizontal</td>
        <td>Allows the configuration of the class(es) of the form. Default `form-horizontal` is set. Multiple classes are allow by separation of space.</td>
    </tr>
</table>


Logging can be turned on by setting logging before wizard initialization
```javascript
$.fn.wizard.logging = true;
```



#### Wizard Methods ####
Usage:
```javascript
var wizard = $("#some-wizard").wizard({});

wizard.methodName(arguments);
```


<table>
    <tr>
        <th>Method</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show()</td>
        <td>Displays the wizard</td>
    </tr>
    <tr>
        <td>hide()</td>
        <td>Alias for close()</td>
    </tr>
    <tr>
        <td>close()</td>
        <td>Closes the wizard</td>
    </tr>
    <tr>
        <td>serialize()</td>
        <td>Returns all inputs from the wizard as serialized string, see [jQuery serialize()] (http://api.jquery.com/serialize/). Add-on: standard disabled inputs are not serialized. This function will will also serialize disabled inputs which have a attribute `data-serialize="1"`.</td>
    </tr>
    <tr>
        <td>serializeArray()</td>
        <td>Returns all inputs from the wizard as array object, can be used for sending a JSON object to the server. See [jQuery serializeArray()] (http://api.jquery.com/serializeArray/) Add-on: standard disabled inputs are not serialized. This function will will also serialize disabled inputs which have a attribute `data-serialize="1"`.</td>
    </tr>
    <tr>
        <td>getActiveCard</td>
        <td>Returns a wizardCard object for the active card</td>
    </tr>
    <tr>
        <td>setTitle(title)</td>
        <td>Set the title of the wizard</td>
    </tr>
    <tr>
        <td>setSubtitle(subTitle)</td>
        <td>Sets the secondary, less pronounced title in the wizard header</td>
    </tr>
    <tr>
        <td>errorPopover(element, msg, allowHtml)</td>
        <td>This creates an error popup on element, with content msg. 
        This is useful being called from a card-level validator, 
        where you might want to pick specific elements on a card on which to show an error tooltip. 
        allowHtml (default:false) allows html content as msg argument.
        </td>
    </tr>
    <tr>
        <td>changeNextButton(text, [class])</td>
        <td>Changes the “next” button (used to advance steps in the wizard) to have text text  and optionally css class cls.  This is used internally by the wizard when the last step is reached, to display a green “submit” button, but it may be useful elsewhere.</td>
    </tr>
    <tr>
        <td>updateProgressBar(percent)</td>
        <td>Sets the progress bar in the lower right to percent complete. This typically shouldn’t be touched by user code, but it can be useful to call updateProgressBar(0) after a submit handler returns. [See Submitting Data].</td>
    </tr>
    <tr>
        <td>hideButtons()</td>
        <td>Hides the next and previous buttons. This is only really useful after a submission handler returns. [See Submitting Data].</td>
    </tr>
    <tr>
        <td>showButtons()</td>
        <td>Shows the next and previous buttons. This is only really useful after a submission handler returns. [See Submitting Data].</td>
    </tr>
    <tr>
        <td>submitSuccess()</td>
        <td>Shows the special submit cards. This is only really useful after a submission handler returns. [See Submitting Data].</td>
    </tr>
    <tr>
        <td>submitError()</td>
        <td>Shows the special submit cards. This is only really useful after a submission handler returns. [See Submitting Data].</td>
    </tr>
     <tr>
        <td>submitFailure()</td>
        <td>Shows the special submit cards. This is only really useful after a submission handler returns. [See Submitting Data].</td>
    </tr>
     <tr>
        <td>reset()</td>
        <td>Resets the wizard to its original state.  This only resets wizard internals, and does not affect your form elements. If you want to reset those, listen for the `reset` event, and write some code to reset your elements manually.</td>
    </tr>
    <tr>
        <td>find(selector)</td>
        <td>Search for the given selector within the modal. And returns the same result as jQuery.find(selector) function.</td>
    </tr>
</table>



#### Wizard Events ####
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


#### Submitting Wizard ####

The easiest way to submit data to the wizard is to pass in a submitUrl on construction.
```javascript
var wizard = $("#some-wizard").wizard({submitUrl: "/some_url"});
```

When the wizard reaches its last step and the user clicks the submit button, all of the inputs from all of the wizard cards will be aggregated together and POSTed to your submitUrl.

If you wish to implement your own submit listener, take a look at the source of the Wizard._defaultSubmit method, which is the default submit listener.
```javascript
function(wizard) {
    $.ajax({
        type: "POST",
        url: wizard.args.submitUrl,
        data: wizard.serialize(),
        dataType: "json"
    }).done(function(response) {
        wizard.submitSuccess();
        wizard.hideButtons();
        wizard.updateProgressBar(0);
    }).fail(function() {
        wizard.submitFailure();
        wizard.hideButtons();
    });
}
```

The wizard class implements the serialize() and serializeArray() methods of jQuery form elements. These methods will scan through all the form input elements in your wizard cards, aggregate the names and values, and return a data structure for submitting via an ajax call.

After your submission, depending on whether your submission succeeded, failed, or had an error, you can display a specific hidden card to reflect the submission status. These submission cards must first be defined in the html.
```html
<div class="wizard" id="some-wizard">
    <!-- normal wizard cards: -->
 
    <div class="wizard-card" data-cardname="card1">
        <h3>Card 1</h3>
        <div>...</div>
    </div>
 
    <!-- begin special status cards below: -->
 
    <div class="wizard-success">
        submission succeeded!
    </div>
 
    <div class="wizard-error">
        submission had an error
    </div>
 
    <div class="wizard-failure">
        submission failed
    </div>
</div>
```

These 3 cards are hidden by default and only appear when you specifically activate them. Typically, these cards will be activated by status of an ajax post.
```javascript
wizard.on("submit", function(wizard) {
    $.ajax({
        url: "/wizard_submit_url",
        type: "POST",
        url: wizard.args.submitUrl,
        data: wizard.serialize(),
        dataType: "json"
    }).done(function(response) {
        wizard.submitSuccess();         // displays the success card
        wizard.hideButtons();           // hides the next and back buttons
        wizard.updateProgressBar(0);    // sets the progress meter to 0
    }).fail(function() {
        wizard.submitError();           // display the error card
        wizard.hideButtons();           // hides the next and back buttons
    });
}
```
By activating these cards in the ajax request handlers, you can display information relevant to the status of the submit request

After submission, you may wish to reset the wizard to some default state.  See the [reset()] method in the wizard class for details on this.


Wizard Cards
------------------

#### Access ####
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


#### Validation ####
Most wizard cards will require some kind of validation of the input before proceeding to the next card. This validation is not intended to sanitize malicious data to be trustworthy (this should be done server-side), merely to catch any obvious common problems with the data.

Validation can be attached inline to form elements by using the attribute `data-validate` on the input.
```html
<div class="wizard-card">
    <h3>Card 1</h3>
    Name <input type="text" name="name" data-validate="validateName" />
</div>
```

When the Next button is clicked for the card, validateName will be called with the element as its first argument.  Here’s an example validation function:

```javascript
function validateName(el) {
    var name = el.val();
    var retValue = {};
 
    if (name == "") {
        retValue.status = false;
        retValue.msg = "Please enter a name";
    }
    else {
        retValue.status = true;
    }
 
    return retValue;
}
```

If the validator returns with an object with .status == false, then an error popup will display on the element and the wizard will not be allowed to progress to the next step. The wizard will only progress when all of the validators on the page return with a status of true.

Entire cards may be assigned a validation function by using the `data-validate` attribute on the card.
```html
<div class="wizard-card" data-validate="someFunction">
    <h3>Card 1</h3>
    Some content
</div>
```

`someFunction()` will receive a WizardCard object on which you can manually search for the inputs on that card and validate them.  This is useful for validating complex interdependencies between many inputs, for example, if a name field can only be empty if another field is populated.

The final method for validating entire cards is to subscribe to the the “validate” event and provide a validation function.

```javascript
wizard.cards["Card 1"].on("validate", function(card) {
    var input = card.el.find("input");
    var name = input.val();
    if (name == "") {
        card.wizard.errorPopover(input, "Name cannot be empty");
        return false;
    }
    return true;
});
```

A card-level validation function is slightly different from an input-level validation function. In a card-level function, you are required to display any error popovers, using the wizard object’s errorPopover() method, as well as returning true or false to tell the wizard whether or not it should advance to the next step.



#### Validation Error Popup ####
##### Input with adjacent button #####
Bootstrap has the possibility to have button adjacent to an input. This causes the error-popover to be misplaced.
To correct this the error-popover has to be placed on the span of the adjacent button.

To accomplish this the application wizard has smart detection for this. When creating an adjacent button to an input an additionial `id` has to be set on the adjacent `<span>` of the `button`. The `id` name of the span has to be `btn-(ID OF INPUT)`.

For example within the following card setup. The card uses standard bootstrap v3.x code for an input with adjacent button. The id of the input is `fqdn`. The id of the adjacent span becomes `btn-fqdn`.

This will cause the error-popop to be correctly displayed when there is an validation error.

```html
<div class="wizard-card" data-cardname="address">
    <h3>Address</h3>

    <div class="wizard-input-section">
        <p>Full Qualified Domain Name</p>
    
        <div class="form-group">
            <div class="col-sm-8">
                <div class="input-group">
                    <input type="text" class="form-control" id="fqdn" name="fqdn" placeholder="FQDN" data-validate="validateFQDN" data-is-valid="0" data-lookup="0" />
                    <span class="input-group-btn" id="btn-fqdn">
                        <button class="btn btn-default" type="button" onclick='lookup();'>Lookup</button>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
```

#### Card CSS ####
If you require to display an selection box overlayed over wizard, like is done within the demo for some of the selects. You have to add the following class to your wizard-card element. `wizard-card-overlay`.



#### Card Methods ####
<table>
    <tr>
        <th>Method</th>
        <th>Description</th>
    </tr>
    <tr>
        <td></td>
        <td></td>
    </tr>
</table>


#### Card Events ####
Registering event on cards can be done with the jQuery `on(event, callback)` function on the wizardCard object.

<table>
    <tr>
        <th>Event</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>loaded</td>
        <td>Triggers when the card is first loaded (when the card is selected but has never been selected before). This is useful for lazy-loading content.</td>
    </tr>
    <tr>
        <td>validate</td>
        <td>when the card is being validated. The callback assigned to this can itself be used as a validator if it returns a boolean.</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>Triggers when this card is selected as the active wizard card</td>
    </tr>
    <tr>
        <td>deselect</td>
        <td>Triggers when this card is changed from. The new card will receive the select event, and the old card will receive the deselect event.</td>
    </tr>
    <tr>
        <td>enabled</td>
        <td></td>
    </tr>
    <tr>
        <td>disabled</td>
        <td></td>
    </tr>
    <tr>
        <td>reload</td>
        <td>Triggers when the card is first loaded or when the reload() function is called.</td>
    </tr>
    <tr>
        <td>validate</td>
        <td>Called when the card is being validated. The callback assigned to this can serve as a validator itself, if it returns a boolean.</td>
    </tr>
    <tr>
        <td>validated</td>
        <td>Triggers when validation is done</td>
    </tr>
    <tr>
        <td>invalid</td>
        <td>Triggers when validation failed</td>
    </tr>
    <tr>
        <td>markVisited</td>
        <td>Triggers when this card is marked as visited, meaning, typically, that the user can go back to it from a different step</td>
    </tr>
    <tr>
        <td>unmarkVisited</td>
        <td>Triggers removing this card as a visited card</td>
    </tr>
</table>
