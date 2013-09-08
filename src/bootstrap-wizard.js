/*
 * Copyright (C) 2013 Panopta, Andrew Moffat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function ($) {

	$.fn.wizard = function(args) {
		return new Wizard(this, args);
	};

	$.fn.wizard.logging = false;

	var WizardCard = function(wizard, card, index, prev, next) {
		this.wizard = wizard;
		this.index = index;
		this.prev = prev;
		this.next = next;
		this.el = card;
		this.title = card.find("h3").first().text();
		this.name = card.data("cardname") || this.title;

		this.nav = this._createNavElement(this.title, index);

		this._disabled = false;
		this._loaded = false;
		this._events = {};
	};

	WizardCard.prototype = {

		select: function() {
			this.log("selecting");
			if (!this.isSelected()) {
				this.nav.addClass("active");
				this.el.show();

				if (!this._loaded) {
					this.trigger("loaded");
					this.reload();
				}

				this.trigger("selected");
			}


			/*
			 * this is ugly, but we're handling the changing of the wizard's
			 * buttons here, in the WizardCard select.  so when a card is
			 * selected, we're figuring out if we're the first card or the
			 * last card and changing the wizard's buttons via the guts of
			 * the wizard
			 *
			 * ideally this logic should be encapsulated by some wizard methods
			 * that we can call from here, instead of messing with the guts
			 */
			var w = this.wizard;

			// The back button is only disabled on this first card...
			w.backButton.toggleClass("disabled", this.index == 0);

			if (this.index >= w._cards.length-1) {
				this.log("on last card, changing next button to submit");

				w.changeNextButton(w.args.buttons.submitText, "btn-success");
				w._readyToSubmit = true;
				w.trigger("readySubmit");
			}
			else {
				w._readyToSubmit = false;
				w.changeNextButton(w.args.buttons.nextText, "btn-primary");
			}

			return this;
		},

		_createNavElement: function(name, i) {
			var li = $('<li class="wizard-nav-item"></li>');
			var a = $('<a class="wizard-nav-link"></a>');
			a.data("navindex", i);
			li.append(a);
			a.append('<i class="icon-chevron-right"></i>')
			a.append(name);
			return li;
		},

		markVisited: function() {
			this.log("marking as visited");
			this.nav.addClass("already-visited");
			this.trigger("markVisited");
			return this;
		},

		unmarkVisited: function() {
			this.log("unmarking as visited");
			this.nav.removeClass("already-visited");
			this.trigger("unmarkVisited");
			return this;
		},

		deselect: function() {
			this.nav.removeClass("active");
			this.el.hide();
			this.trigger("deselect");
			return this;
		},

		enable: function() {
			this.log("enabling");
			this.nav.addClass("active");
			this._disabled = false;
			this.trigger("enabled");
			return this;
		},

		disable: function(hideCard) {
			this.log("disabling");
			this._disabled = true;
			this.nav.removeClass("active already-visited");
			if (hideCard) {this.el.hide();}
			this.trigger("disabled");
			return this;
		},

		isDisabled: function() {
			return this._disabled;
		},

		alreadyVisited: function() {
			return this.nav.hasClass("already-visited");
		},

		isSelected: function() {
			return this.nav.hasClass("active");
		},

		reload: function() {
			this._loaded = true;
			this.trigger("reload");
			return this;
		},

		on: function() {
			return this.wizard.on.apply(this, arguments);
		},

		trigger: function() {
			this.callListener("on"+arguments[0]);
			return this.wizard.trigger.apply(this, arguments);
		},

		/*
		 * displays an alert box on the current card
		 */
		toggleAlert: function(msg, toggle) {
			this.log("toggling alert to: " + toggle);

			toggle = typeof(toggle) == "undefined" ? true : toggle;

			if (toggle) {this.trigger("showAlert");}
			else {this.trigger("hideAlert");}

			var div;
			var alert = this.el.children("h3").first().next("div.alert");

			if (alert.length == 0) {
				/*
				 * we're hiding anyways, so no need to create anything.
				 * we'll do that if we ever are actually showing the alert
				 */
				if (!toggle) {return this;}

				this.log("couldn't find existing alert div, creating one");
				div = $("<div />");
				div.addClass("alert");
				div.addClass("hide");
				div.insertAfter(this.el.find("h3").first());
			}
			else {
				this.log("found existing alert div");
				div = alert.first();
			}

			if (toggle) {
				if (msg != null) {
					this.log("setting alert msg to", msg);
					div.html(msg);
				}
				div.show();
			}
			else {
				div.hide();
			}
			return this;
		},

		/*
		 * this looks for event handlers embedded into the html of the
		 * wizard card itself, in the form of a data- attribute
		 */
		callListener: function(name) {
            // a bug(?) in jquery..can't access data-<name> if name is camelCase
		    name = name.toLowerCase();

			this.log("looking for listener " + name);
			var listener = window[this.el.data(name)];
			if (listener) {
				this.log("calling listener " + name);
				var wizard = this.wizard;

				try {
					var vret = listener(this);
				}
				catch (e) {
					this.log("exception calling listener " + name + ": ", e);
				}
			}
			else {
				this.log("didn't find listener " + name);
			}
		},

		problem: function(toggle) {
			this.nav.find("a").toggleClass("wizard-step-error", toggle);
		},

		validate: function() {
			var failures = false;
			var self = this;

			/*
			 * run all the validators embedded on the inputs themselves
			 */
			this.el.find("[data-validate]").each(function(i, el) {
				self.log("validating individiual inputs");
				el = $(el);

				var v = el.data("validate");
				if (!v) {return;}

				var ret = {
					status: true,
					title: "Error",
					msg: ""
				};

				var vret = window[v](el);
				$.extend(ret, vret);

				if (!ret.status) {
					failures = true;
					el.parent(".control-group").toggleClass("error", true);
					self.wizard.errorPopover(el, ret.msg);
				}
				else {
					el.parent(".control-group").toggleClass("error", false);
					try {
						el.popover("destroy");
					}
					/*
					 * older versions of bootstrap don't have a destroy call
					 * for popovers
					 */
					catch (e) {
						el.popover("hide");
					}
				}
			});
			this.log("after validating inputs, failures is", failures);

			/*
			 * run the validator embedded in the card
			 */
			var cardValidator = window[this.el.data("validate")];
			if (cardValidator) {
				this.log("running html-embedded card validator");
				var cardValidated = cardValidator(this);
				if (typeof(cardValidated) == "undefined" || cardValidated == null) {
					cardValidated = true;
				}
				if (!cardValidated) failures = true;
				this.log("after running html-embedded card validator, failures\
 is", failures);
			}

			/*
			 * run the validate listener
			 */
			this.log("running listener validator");
			var listenerValidated = this.trigger("validate");
			if (typeof(listenerValidated) == "undefined" || listenerValidated == null) {
				listenerValidated = true;
			}
			if (!listenerValidated) failures = true;
			this.log("after running listener validator, failures is", failures);

			var validated = !failures;
			if (validated) {
				this.log("validated, calling listeners");
				this.trigger("validated");
			}
			else {
				this.log("invalid");
				this.trigger("invalid");
			}
			return validated;
		},

		log: function() {
			if (!window.console || !$.fn.wizard.logging) {return;}
			var prepend = "card '"+this.name+"': ";
			var args = [prepend];
			args.push.apply(args, arguments);

			console.log.apply(console, args);
		},

		isActive: function() {
			return this.nav.hasClass("active");
		}
	};


	Wizard = function(markup, args) {
		var wizard_template = [
			'<div class="modal hide wizard-modal" role="dialog">',

				'<div class="wizard-modal-header modal-header">',
					'<button class="wizard-close close" type="button">x</button>',
					'<h3 class="wizard-title"></h3>',
					'<span class="wizard-subtitle"></span>',
				'</div>',

				'<div class="pull-left wizard-steps">',
					'<div class="wizard-nav-container">',
						'<ul class="nav nav-list" style="padding-bottom:30px;">',
						'</ul>',
					'</div>',
					'<div class="wizard-progress-container">',,
						'<div class="progress progress-striped">',
							'<div class="bar"></div>',
						'</div>',
					'</div>',
				'</div>',

				'<form>',
					'<div class="wizard-cards">',
						'<div class="wizard-card-container">',
						'</div>',
						'<div class="wizard-modal-footer">',
							'<div class="wizard-buttons-container">',
								'<button class="btn wizard-cancel wizard-close" type="button">Cancel</button>',
								'<div class="btn-group-single pull-right">',
									'<button class="btn wizard-back" type="button">Back</button>',
									'<button class="btn btn-primary wizard-next" type="button">Next</button>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</form>',

			'</div>'
		];

		this.args = {
			submitUrl: "",
			width: 750,
			showCancel: false,
			progressBarCurrent: false,
			increaseHeight: 0,
			buttons: {
				cancelText: "Cancel",
				nextText: "Next",
				backText: "Back",
				submitText: "Submit",
				submittingText: "Submitting...",
			}
		};
		$.extend(this.args, args || {});

		this.markup = $(markup);
		this.submitCards = this.markup.find(".wizard-error,.wizard-failure,.wizard-success,.wizard-loading");
		this.el = $(wizard_template.join("\n"));
		this.el.find(".wizard-card-container")
			.append(this.markup.find(".wizard-card"))
			.append(this.submitCards);
		$("body").append(this.el);

		this.closeButton = this.el.find("button.wizard-close");
		this.footer = this.el.find(".wizard-modal-footer");
		this.cancelButton = this.footer.find(".wizard-cancel");
		this.backButton = this.footer.find(".wizard-back");
		this.nextButton = this.footer.find(".wizard-next");
		this.progress = this.el.find(".progress");
		this._cards = [];
		this.cards = {};
		this._readyToSubmit = false;
		this.percentComplete = 0;
		this._submitting = false;
		this._events = {};
		this._firstShow = true;


		// construction


		this._createCards();

		this.nextButton.click(this, this._handleNextClick);
		this.backButton.click(this, this._handleBackClick);

		this.cancelButton.text(this.args.buttons.cancelText);
		this.backButton.text(this.args.buttons.backText);
		this.nextButton.text(this.args.buttons.nextText);



		/*
		 * adjust the height of the modal, and everything associated with
		 * adjusting the height
		 */
		var baseHeight = 360;
		var navHeight = baseHeight + this.args.increaseHeight;

		this.el.find(".wizard-nav-container").css("height", navHeight);
		this.el.find(".wizard-steps").css("height", (navHeight+65)+"px");
		this.el.find(".wizard-card").css("height", (navHeight-60)+"px");
		this.submitCards.css("height", (navHeight-60)+"px");

		this.el.css("margin-top", -(this.el.height() / 2));


		/*
		 * adjust the width of the modal
		 */
		this.el.css("width", this.args.width);
		this.el.css("margin-left", -(this.args.width / 2));



		/*
		 * set up slimScroll for our nav, if slimScroll is installed
		 */
		if ($.fn.slimScroll && false) {
			var slimScrollArgs = {
				position: "left",
				height: "360px",
				size: "8px",
				distance: "5px",
				railVisible: true,
				disableFadeOut: true,
			};
			$.extend(slimScrollArgs, this.args.slimScroll || {});
			this.el.find(".wizard-nav-container").slimScroll(slimScrollArgs);
		}

		/*
		 * if the close X is clicked, reset the wizard
		 */
		var self = this;
		this.closeButton.click(function() {
			self.reset();
			self.close();
			self.trigger("closed");
		});

		this.el.find(".wizard-steps").on(
			"click", "li.already-visited a.wizard-nav-link", this,
			function(event) {
				var index = parseInt($(event.target).data("navindex"));
				event.data.setCard(index);
			});

		var title = this.markup.children("h1").first();
		if (title.length) {this.setTitle(title.text());}

		this.on("submit", this._defaultSubmit);
	};

	Wizard.prototype = {

		errorPopover: function(el, msg) {
			this.log("launching popover on", el);
			var popover = el.popover({
				content: msg,
				trigger: "manual"
			}).popover("show").next(".popover");

			popover.addClass("error-popover");
			return popover;
		},
		
		destroyPopover: function(pop) {
			pop = $(pop);
			pop.parent(".control-group").toggleClass("error", false);
			
			/*
			 * this is the element that the popover was created for
			 */
			var el = pop.prev();
			
			try {
				el.popover("destroy");
			}
			/*
			 * older versions of bootstrap don't have a destroy call
			 * for popovers
			 */
			catch (e) {
				el.popover("hide");
			}
		},
		
		hidePopovers: function(el) {
			this.log("hiding all popovers");
			var self = this;
			this.el.find(".error-popover").each(function (i, popover) {
				self.destroyPopover(popover);
			});
		},

		eachCard: function(fn) {
			$.each(this._cards, fn);
			return this;
		},

		getActiveCard: function() {
			this.log("getting active card");
			var currentCard = null;

			$.each(this._cards, function(i, card) {
				if (card.isActive()) {
					currentCard = card;
					return false;
				}
			});
			if (currentCard) {this.log("found active card", currentCard);}
			else {this.log("couldn't find an active card");}
			return currentCard;
		},

		setTitle: function(title) {
			this.log("setting title to", title);
			this.el.find(".wizard-title").first().text(title);
			return this;
		},

		setSubtitle: function(title) {
			this.log("setting subtitle to", title);
			this.el.find(".wizard-subtitle").first().text(title);
			return this;
		},

		changeNextButton: function(text, cls) {
			this.log("changing next button, text: " + text, "class: " + cls);
			if (typeof(cls) != "undefined") {
				this.nextButton.removeClass("btn-success btn-primary");
			}

			if (cls) {
				this.nextButton.addClass(cls);
			}
			this.nextButton.text(text);
			return this;
		},

		hide: function() {
			this.log("hiding");
			this.el.modal("hide");
			return this;
		},

		close: function() {
			this.log("closing");
			this.el.modal("hide");
			return this;
		},


		show: function(modalOptions) {
			this.log("showing");
			if (this._firstShow) {
				this.setCard(0);
				this._firstShow = false;
			}
			if (this.args.showCancel) { this.cancelButton.show(); }
			this.el.modal(modalOptions);
			return this;
		},

		on: function(name, fn) {
			this.log("adding listener to event " + name);
			this._events[name] = fn;
			return this;
		},

		trigger: function() {
			var name = arguments[0];
			var args = Array.prototype.slice.call(arguments);
			args.shift();
			args.unshift(this);

			this.log("firing event " + name);
			var handler = this._events[name];
			var ret = null;

			if (typeof(handler) == "function") {
				this.log("found event handler, calling " + name);
				try {
					ret = handler.apply(this, args);
				}
				catch (e) {
					this.log("event handler " + name + " had an exception");
				}
			}
			else {
				this.log("couldn't find an event handler for " + name);
			}
			return ret;
		},


		reset: function() {
			this.log("resetting");
			
			this.updateProgressBar(0);
			this.hideSubmitCards();

			this.setCard(0);
			this.lockCards();

			this.enableNextButton();
			this.showButtons();
			
			this.hidePopovers();

			this.trigger("reset");
			return this;
		},

		log: function() {
			if (!window.console || !$.fn.wizard.logging) {return;}
			var prepend = "wizard "+this.el.id+": ";
			var args = [prepend];
			args.push.apply(args, arguments);
			console.log.apply(console, args);
		},


		/*
		 * this handles switching to the next card or previous card, taking
		 * care to skip over disabled cards
		 */
		_abstractIncrementStep: function(direction, getNext) {
			var current = this.getActiveCard();
			var next;

			if (current) {
				/*
				 * loop until we find a card that isn't disabled
				 */
			    this.log("searching for valid next card");
				while (true) {
					next = getNext(current);
					if (next) {
						this.log("looking at card", next.index);
						if (next.isDisabled()) {
							this.log("card " + next.index + " is disabled/locked, continuing");
							current = next;
							continue;
						}
						else {
							return this.setCard(current.index+direction);
						}
					}
					else {
						this.log("next card is not defined, breaking");
						break;
					}
				}
			}
			else {
				this.log("current card is undefined");
			}
		},


		incrementCard: function() {
			this.log("incrementing card");
			var card = this._abstractIncrementStep(1, function(current){return current.next;});
			this.trigger("incrementCard");
			return card;
		},

		decrementCard: function() {
			this.log("decrementing card");
			var card = this._abstractIncrementStep(-1, function(current){return current.prev;});
			this.trigger("decrementCard");
			return card;
		},

		setCard: function(i) {
			this.log("setting card to " + i);
			this.hideSubmitCards();
			var currentCard = this.getActiveCard();

			if (this._submitting) {
				this.log("we're submitting the wizard already, can't change cards");
				return currentCard;
			}

			var newCard = this._cards[i];
			if (newCard) {
				if (newCard.isDisabled()) {
					this.log("new card is currently disabled, returning");
					return currentCard;
				}

				if (currentCard) {

					/*
					 * here, we're only validating if we're going forward,
					 * not if we're going backwards in a step
					 */
					if (i > currentCard.index) {
						var cardToValidate = currentCard;
						var ok = false;

						/*
						 * we need to loop over every card between our current
						 * card and the card that we clicked, and re-validate
						 * them.  if there's an error, we need to select the
						 * first card to have an error
						 */
						while (cardToValidate.index != newCard.index) {
							/*
							 * unless we're validating the card that we're
							 * leaving, we need to select the card, so that
							 * any validators that trigger errorPopovers can
							 * display correctly
							 */
							if (cardToValidate.index != currentCard.index) {
								cardToValidate.prev.deselect();
								cardToValidate.prev.markVisited();
								cardToValidate.select();
							}
							ok = cardToValidate.validate();
							if (!ok) {
								return cardToValidate;
							}
							cardToValidate = cardToValidate.next;
						}

						cardToValidate.prev.deselect();
						cardToValidate.prev.markVisited();
					}

					currentCard.deselect();
					currentCard.markVisited();
				}

				newCard.select();

				if (this.args.progressBarCurrent) {
					this.percentComplete = i * 100.0 / this._cards.length;
					this.updateProgressBar(this.percentComplete);					
				}
				else {
					var lastPercent = this.percentComplete;
					this.percentComplete = i * 100.0 / this._cards.length;
					this.percentComplete = Math.max(lastPercent, this.percentComplete);
					this.updateProgressBar(this.percentComplete);
				}

				return newCard;
			}
			else {
				this.log("couldn't find card " + i);
			}
		},

		updateProgressBar: function(percent) {
			this.log("updating progress to " + percent + "%");
			this.progress.find(".bar").css({width: percent + "%"});
			this.percentComplete = percent;

			this.trigger("progressBar", percent);

			if (percent == 100) {
				this.log("progress is 100, animating progress bar");
				this.progress.addClass("active");
			}
			else if (percent == 0) {
				this.log("progress is 0, disabling animation");
				this.progress.removeClass("active");
			}
		},

		getNextCard: function() {
			var currentCard = this.getActiveCard();
			if (currentCard) return currentCard.next;
		},

		lockCards: function() {
			this.log("locking nav cards");
			this.eachCard(function(i,card){card.unmarkVisited();});
			return this;
		},

		disableCards: function() {
			this.log("disabling all nav cards");
			this.eachCard(function(i,card){card.disable();});
			return this;
		},

		enableCards: function() {
			this.log("enabling all nav cards");
			this.eachCard(function(i,card){card.enable();});
			return this;
		},

		hideCards: function() {
			this.log("hiding cards");
			this.eachCard(function(i,card){card.deselect();});
			this.hideSubmitCards();
			return this;
		},

		hideButtons: function() {
			this.log("hiding buttons");
			this.cancelButton.hide();
			this.nextButton.hide();
			this.backButton.hide();
			return this;
		},

		showButtons: function() {
			this.log("showing buttons");
			if (this.args.showCancel) { this.cancelButton.show(); }
			this.nextButton.show();
			this.backButton.show();
			return this;
		},

		getCard: function(el) {
			var cardDOMEl = $(el).parents(".wizard-card").first()[0];
			if (cardDOMEl) {
				var foundCard = null;
				this.eachCard(function(i, card) {
					if (cardDOMEl == card.el[0]) {
						foundCard = card;
						return false;
					}
					return true;
				});
				return foundCard;
			}
			else {
				return null;
			}
		},

		_createCards: function() {
			var prev = null;
			var next = null;
			var currentCard = null;
			var wizard = this;
			var self = this;

			var cards = this.el.find(".wizard-cards .wizard-card");
			$.each(cards, function(i, card) {
				card = $(card);

				prev = currentCard;
				currentCard = new WizardCard(wizard, card, i, prev, next);
				self._cards.push(currentCard);
				if (currentCard.name) {
					self.cards[currentCard.name] = currentCard;
				}
				if (prev) {prev.next = currentCard;}

				self.el.find(".wizard-steps .nav-list").append(currentCard.nav);
			});
		},

		showSubmitCard: function(name) {
			this.log("showing "+name+" submit card");

			var card = this.el.find(".wizard-"+name);
			if (card.length) {
				this.hideCards();
				this.el.find(".wizard-"+name).show();
			}
			else {
				this.log("couldn't find submit card "+name);
			}
		},

		hideSubmitCard: function(name) {
			this.log("hiding "+name+" submit card");
			this.el.find(".wizard-"+name).hide();
		},

		hideSubmitCards: function() {
			var wizard = this;
			$.each(["success", "error", "failure", "loading"], function(i, name) {
				wizard.hideSubmitCard(name);
			});
		},

		enableNextButton: function() {
			this.log("enabling next button");
			this.nextButton.removeAttr("disabled");
			return this;
		},

		disableNextButton: function() {
			this.log("disabling next button");
			this.nextButton.attr("disabled", "disabled");
			return this;
		},

		serializeArray: function() {
			var form = this.el.children("form").first();
			return form.serializeArray();
		},

		serialize: function() {
			var form = this.el.children("form").first();
			return form.serialize();
		},


		/*
		 * the next 3 functions are to be called by the custom submit event
		 * handler.  the idea is that after you make an ajax call to submit
		 * your wizard data (or whatever it is you want to do at the end of
		 * the wizard), you call one of these 3 handlers to display a specific
		 * card for either success, failure, or error
		 */
		submitSuccess: function() {
			this.log("submit success");
			this._submitting = false;
			this.showSubmitCard("success");
			this.trigger("submitSuccess");
		},

		submitFailure: function() {
			this.log("submit failure");
			this._submitting = false;
			this.showSubmitCard("failure");
			this.trigger("submitFailure");
		},

		submitError: function() {
			this.log("submit error");
			this._submitting = false;
			this.showSubmitCard("error");
			this.trigger("submitError");
		},


		_submit: function() {
			this.log("submitting wizard");
			this._submitting = true;

			this.lockCards();
			this.cancelButton.hide();
			this.backButton.hide();

			this.showSubmitCard("loading");
			this.updateProgressBar(100);

			this.changeNextButton(this.args.buttons.submittingText, false);
			this.disableNextButton();

			var ret = this.trigger("submit");
			this.trigger("loading");
		},

		_onNextClick: function() {
			this.log("handling 'next' button click");
			var currentCard = this.getActiveCard();
			if (this._readyToSubmit && currentCard.validate()) {
				this._submit();
			}
			else {
				currentCard = this.incrementCard();
			}
		},

		_onBackClick: function() {
			this.log("handling 'back' button click");
			var currentCard = this.decrementCard();
		},


		_handleNextClick: function(event) {
			var wizard = event.data;
			wizard._onNextClick.call(wizard);
		},

		_handleBackClick: function(event) {
			var wizard = event.data;
			wizard._onBackClick.call(wizard);
		},


		/*
		 * this function is attached by default to the wizard's "submit" event.
		 * if you choose to implement your own custom submit logic, you should
		 * copy how this function works
		 */
		_defaultSubmit: function(wizard) {
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

	};

}(window.jQuery));
