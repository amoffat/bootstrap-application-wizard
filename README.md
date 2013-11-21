*Application Wizard for Bootstrap* by [Andrew Moffat](https://github.com/amoffat), built @ [Panopta](http://www.panopta.com/)

# [Online Demo & Complete Documentation](http://www.panopta.com/2013/02/06/bootstrap-application-wizard/)

# Installation

To use, include the wizard stylesheet after the bootstrap stylesheet:

	<link href="bootstrap-wizard/bootstrap-wizard.css" rel="stylesheet" />

And the wizard javascript after the bootstrap javascript:

	<script src="bootstrap-wizard/bootstrap-wizard.js" type="text/javascript"></script>

And create the required boilerplate markup for your wizard content:

	<div class="wizard" id="some-wizard">
	    <h1>Wizard Title</h1>
	    <div class="wizard-card" data-cardname="card1">
	        <h3>Card 1</h3>
	        Some content
	    </div>
	    <div class="wizard-card" data-cardname="card2">
	        <h3>Card 2</h3>
	        Some other content
	    </div>
	</div>

Each .wizard-card will be its own step in the Application Wizard, and the h3 tag will be used for its navigation name on the left.  Also notice the data-cardname  attribute on each card.  While not required, this can be used to access the cards by a specific name.

Lastly, initialize the wizard:
	
	$(function() {
	    var options = {};
	    var wizard = $("#some-wizard").wizard(options);
	});

And when you’re ready to display it, for example, on a button click, use wizard.show();

# Working with Cards

Cards can be accessed through the cards attribute on the wizard object.  By default, this is an object whose keys are the text from the h3 tags, and whose values are instances of the WizardCard class.  So for example, with the following markup:

	<div class="wizard" id="some-wizard">
	    <div class="wizard-card">
	        <h3>Card 1</h3>
	        <div>...</div>
	    </div>
	</div>

You could access this card the following way:

	var wizard = $("#some-wizard").wizard();
	var card = wizard.cards["Card 1"];

From this card object, you can call any of the card methods.

You can also set a card’s name specifically by using the data-cardname attribute:

	<div class="wizard" id="some-wizard">
	    <div class="wizard-card" data-cardname="card1">
	        <h3>Card 1</h3>
	        <div>...</div>
	    </div>
	</div>

Now you can access the card by the name “card1″:

	var wizard = $("#some-wizard").wizard();
	var card = wizard.cards["card1"];

# Validation

Most wizard cards will require some kind of validation of the input before proceeding to the next card.  This validation is not intended to sanitize malicious data to be trustworthy (this should be done server-side), merely to catch any obvious common problems with the data.

Validation can be attached inline to form elements by using the xhtml data attribute:

	<div class="wizard-card">
	    <h3>Card 1</h3>
	    Name <input type="text" name="name" data-validate="validateName" />
	</div>

When the Next button is clicked for the card, validateName will be called with the element as its first argument.  Here’s an example validation function:

	function validateName(el) {
	    var name = el.val();
	    var retValue = {};
 
	    if (name == "") {
	        retValue.status = false;
	        retValue.msg = "Please enter a name";
		} else {
	        retValue.status = true;
	    }
 
	    return retValue;
	}

If the validator returns with an object with .status == false, then an error popup will display on the element and the wizard will not be allowed to progress to the next step.  The wizard will only progress when all of the validators on the page return with a status of true.

Entire cards may be assigned a validation function by using the xhtml “data” attribute:

	<div class="wizard-card" data-validate="someFunction">
	    <h3>Card 1</h3>
	    Some content
	</div>

someFunction will receive a WizardCard object on which you can manually search for the inputs on that card and validate them.  This is useful for validating complex interdependencies between many inputs, for example, if a name field can only be empty if another field is populated.

The final method for validating entire cards is to subscribe to the the “validate” event and provide a validation function:

	wizard.cards["Card 1"].on("validate", function(card) {
	    var input = card.el.find("input");
	    var name = input.val();
	    if (name == "") {
	        card.wizard.errorPopover(input, "Name cannot be empty");
	        return false;
	    }
	    return true;
	});

A card-level validation function is slightly different from an input-level validation function.  In a card-level function, you are required to display any error popovers, using the wizard object’s errorPopover() method, as well as returning true or false to tell the wizard whether or not it should advance to the next step.

# Interesting Events

The following events are the most interesting when integrating the wizard:

### WizardCard events:

* loaded – when the card is first loaded (when the card is selected but has never been selected before).  This is useful for lazy-loading content.
* validate – when the card is being validated.  The callback assigned to this can itself be used as a validator if it returns a boolean.

### Wizard events:

* reset – when the X (close) button is clicked, or if you triggered this event manually via the “reset” method.  You’re responsible for resetting all card inputs, as the reset method will only reset the wizard’s internal state.
* submit – when the submit button is clicked on the final card.  Typically the handler assigned to this is responsible for handling all ajax communication.  The default handler is Wizard._defaultSubmit.

All events are documented under the Wizard and WizardCard class documentation.

# Submitting Data

The easiest way to submit data to the wizard is to pass in a submitUrl on construction:

	var wizard = $("#some-wizard").wizard({submitUrl: "/some_url"});

When the wizard reaches its last step and the user clicks the submit button, all of the inputs from all of the wizard cards will be aggregated together and POSTed to your submitUrl.

If you wish to implement your own submit listener, take a look at the source of the Wizard._defaultSubmit method, which is the default submit listener:

	function(wizard) {
	    $.ajax({
	        type: "POST",
	        url: wizard.args.submitUrl,
	        data: wizard.serialize(),
	        dataType: "json",
	        success: function(resp) {
	            wizard.submitSuccess();
	            wizard.hideButtons();
	            wizard.updateProgressBar(0);
	        },
	        error: function() {
	            wizard.submitFailure();
	            wizard.hideButtons();
	        },
	    });
	}

The wizard class implements the serialize() and serializeArray() methods of JQuery form elements.  These methods will scan through all the form input elements in your wizard cards, aggregate the names and values, and return a data structure for submitting via an ajax call.

After your submission, depending on whether your submission succeeded, failed, or had an error, you can display a specific hidden card to reflect the submission status.  These submission cards must first be defined in the html:

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

These 3 cards are hidden by default and only appear when you specifically activate them. Typically, these cards will be activated by status of an ajax post:

	wizard.on("submit", function(wizard) {
		$.ajax({
			url: "/wizard_submit",
			type: "POST",
			data: wizard.serialize(),
			success: function() {
				wizard.submitSuccess(); // displays the success card
				wizard.hideButtons(); // hides the next and back buttons
				wizard.updateProgressBar(0); // sets the progress meter to 0
			},
			error: function() {
				wizard.submitError(); // display the error card
				wizard.hideButtons(); // hides the next and back buttons
			}
		});
	});

By activating these cards in the ajax request handlers, you can display information relevant to the status of the submit request

After submission, you may wish to reset the wizard to some default state.  See the reset() method in the wizard class for details on this.

# Wizard Class

### $.wizard([options])

The wizard constructor takes an optional object of options:

* width – the total width of the wizard, default: 750px
* increaseHeight – how many pixels to increase the default height by, default: 0
* buttons – an object containing the following sub options:
	* nextText – the text for the “next” button, default: “Next”
	* backText – the text for the “back” button, default: “Back”
	* submitText – the text for the “submit” button, default: “Submit”
	* submittingText – the text for when the wizard is being submitted, default: “Submitting”
* progressBarCurrent – boolean instructing the wizard’s progress bar to follow the currently active step, instead of the furthest reached step.

### el

The div element that holds the wizard’s html layout.  This is the generated html of the wizard modal, not the original html passed into $().wizard();   For the original html, use the markup  attribute.

### markup

A reference to the original html markup used to build the wizard.  This is the html entered manually on the page, which is passed into $().wizard();

### show()

Displays the wizard

### hide()

Alias for close()

### close()

Closes the wizard

### serialize()

Returns all inputs from the wizard cards as a key=value query string.  See JQuery’s serialize()

### serializeArray()

Returns all inputs from the wizard cards as a list of objects with name and value attributes.  See JQuery’s serializeArray()

### on(eventName, callback)

Binds a callback to the eventName.  Valid event names are:

* reset – when the reset() method has been called
* incrementCard – when the next card becomes the current card
* decrementCard – when the previous card becomes the current card
* readySubmit – when the wizard has reached its final card
* progressBar – when the progress bar is incremented.  The first argument passed to the callback is the new progress percent from 0 to 100.
* submit – when the submit button is clicked on the final card
* loading – triggered after the submit trigger has been fired

### getActiveCard()

Returns a WizardCard object for the active card

### setTitle(title)

Sets the main title in the wizard header

### setSubtitle(subtitle)

Sets the secondary, less pronounced title in the wizard header

### trigger(eventName, …)

Triggers an event eventName, with an optional number of arguments (or no arguments)

### errorPopover(element, msg)

This creates an error popup on element, with content msg.  This is useful being called from a card-level validator, where you might want to pick specific elements on a card on which to show an error tooltip.

### changeNextButton(text, [cls])

Changes the “next” button (used to advance steps in the wizard) to have text text  and optionally css class cls.  This is used internally by the wizard when the last step is reached, to display a green “submit” button, but it may be useful elsewhere.

### updateProgressBar(percent)

Sets the progress bar in the lower right to percent complete.  This typically shouldn’t be touched by user code, but it can be useful to call updateProgressBar(0)  after a submit handler returns.  See Submitting Data.

### hideButtons()/showButtons()

Hides or shows the next and previous buttons.  This is only really useful after a submission handler returns.  See Submitting Data.

### submitSuccess()/submitError()/submitFailure()

Shows the special submit cards.  This is only really useful after a submission handler returns.  See Submitting Data.

### reset()

Resets the wizard to its original state.  This only resets wizard internals, and does not affect your form elements.  If you want to reset those, listen for the “reset” event, and write some code to reset your elements manually.  For example

	wizard.on("reset", function(wizard) {
	    $.each(wizard.cards, function(name, card) {
	        card.el.find("input").val(); // resets all inputs on a card to ""
	    });
	});

# WizardCard Class

Objects of this class fill the wizard.cards object.

### el

The div element that holds the card’s layout.  Use this when searching for elements in a specific card (like a specific input box or button, for example).

### wizard

This is a reference to the wizard object to which this card belongs.  Typically, this is used in card-level validators to call the errorPopover() method.

### validate()

Called automatically when the next button is clicked, this method runs all validators on elements contained in the card, as well as any card-level validator, if one exists.  This will return true if all validators return true, otherwise false.

### trigger(eventName, …)

Triggers an event eventName, with an optional number of arguments (or no arguments)

### on(eventName, callback)

Binds a callback to the eventName.  Valid event names are:

* reload – when the card is first loaded or when the reload() function is called.
* loaded – called when a card is first loaded
* selected – when this card is selected as the active wizard card
* markVisited – when this card is marked as visited, meaning, typically, that the user can go back to it from a different step
* unmarkVisited – removing this card as a visited card
* deselect – when this card is changed from.  The new card will receive the select event, and the old card will receive the deselect event.
* validate – called when the card is being validated.  The callback assigned to this can serve as a validator itself, if it returns a boolean.


# Thanks

* [Huzaifa Tapal](https://twitter.com/htapal)
* [Jason Abate](https://github.com/jasonabate)
* [John Zimmerman](https://github.com/johnzimmerman)
* [Shabbir Karimi](https://github.com/shabbirkarimi)
