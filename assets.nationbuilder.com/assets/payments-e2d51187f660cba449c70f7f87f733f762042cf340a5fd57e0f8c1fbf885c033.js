if (NB.Liquid) {
  if (NB.Liquid.Theme.version === 1) {
    $(document).ready(function(){
      initStripe();
      initRecaptcha();
    });
  } else {
    NB.EventHub.subscribe('nb.payments.options.ready', function() {
      initStripe();
      initRecaptcha();
    });
  }
} else {
  $(document).ready(function() { initStripe() });
}

function initStripe() {
  var stripe = new Stripe(NB.payments.publishableKey, {
    locale: NB.payments.locale || "auto"
  });
  var recursiveMerge = true;
  var elements = stripe.elements($.extend(recursiveMerge, {}, NB.payments.defaultElementsOptions, NB.payments.elementsOptions));
  var $paymentInputs = $('.payment-input');
  var $form = $paymentInputs.closest('form');
  var paymentRequestId = 'donation-v2-payment-request';
  var paymentRequestElem = document.getElementById(paymentRequestId);
  var ccRequestElem = document.getElementById('cc-request-button');
  var submittedPaymentMethod = NB.payments.paymentMethod;
  var hasExpressPaymentOptions = paymentRequestElem;
  const isPortalForm = $('.edit_donation_offcanvas_form').length > 0;

  // Hide EPO elements from the start
  $('#payment-methods').hide()
  $('#selected-payment-method').hide()
  $('#submitted-payment-method').hide()
  $('#demographics-read-only').hide()
  $('#address-read-only').hide()

  function createStripeInput($paymentInput) {
    if(this.initializeDefaultElementOptionsForCustomNationSignupPages) {
      initializeDefaultElementOptionsForCustomNationSignupPages();
    }
    var type = $paymentInput.data('payments-element-type');
    var element = elements.create(type, $.extend(recursiveMerge, { hidePostalCode: true }, NB.payments.defaultElementOptions, NB.payments.elementOptions));
    element.mount($paymentInput.get(0));
    element.on('change', function(event) {
      var $errorContainer = $($paymentInput.data('error-container'));
      $errorContainer.find('div.' + type + '-error').remove();
      if (event.error) {
        $errorContainer.append('<div class="' + type + '-error payment-toggle-view">' + event.error.message + '</div>');
      }
    });
    return element;
  }

  $paymentInputs.each(function(index, paymentInput) {
    NB.payments.elements[$(paymentInput).data('payments-element-type')] = createStripeInput($(paymentInput));
  });

  // Checking for fixedAmount first allows donation pages without a highlighted amount to return 0 and generate the payment request button
  function inputAmount() {
    var amount = NB.payments.fixedAmount || ($('input[name="donation[amount]"]').val() * 100);
    return Math.round(amount);
  }

  function setupPaymentRequestButton() {
    var label = NB.payments.descriptor || 'Payment';
    var theme = 'dark';
    var supportedThemes = ['dark', 'light', 'light-outline'];
    var selectedTheme = paymentRequestElem.dataset.epoButtonTheme || NB.payments.epoButtonTheme;
    if(supportedThemes.includes(selectedTheme)) { theme = selectedTheme };
    var paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: NB.payments.currency,
      total: {
        label: label,
        amount: inputAmount(),
        pending: true
      },
      requestPayerEmail: true,
      requestPayerName: true,
      requestPayerPhone: true
    });
    var prButton = elements.create('paymentRequestButton', {
      paymentRequest: paymentRequest,
      style: {
        paymentRequestButton: {
          theme: theme
        }
      }
    });
    prButton.on("click", function () {
      paymentRequest.update({
        total: {
          label: label,
          amount: inputAmount()
        }
      })
    });

    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment().then(function(result) {
      if (result) {
        prButton.mount("#" + paymentRequestId);
        if(result.applePay && navigator.userAgent.match(/Macintosh/i)) {
          // Show a notice about the Apple touchbar showing the platform name
          $('#apple-pay-notice').show();
        }
        if(!submittedPaymentMethod) {
          $('#payment-methods').show();
        }
      } else {
        hasExpressPaymentOptions = false;
        $('#payment-methods').hide();
        if(!submittedPaymentMethod) {
          showCreditCardInput();
        }
      }
    });
    return paymentRequest;
  }

  function populateDemographics(event) {
    var nameArray = event.payerName.split(" ");
    var firstName = nameArray[0];
    var lastName = nameArray[nameArray.length - 1];
    $("[name='donation[billing_address_attributes][phone_number]']").val(event.payerPhone);
    $("#demographics-phone").text(event.payerPhone);
    $("[name='donation[email]']").val(event.payerEmail);
    $("#demographics-email").text(event.payerEmail);
    $("[name='donation[first_name]']").val(firstName);
    $("[name='donation[last_name]']").val(lastName);
    $("#demographics-name").text(firstName + " " + lastName);

    var $demographicsReadOnlyElem = $('#demographics-read-only')
    if($demographicsReadOnlyElem && event.payerPhone && event.payerEmail && event.payerName) {
      $('#demographics-info').hide();
      floatDemographicInputLabels();
      $demographicsReadOnlyElem.show();
    } else {
      $demographicsReadOnlyElem.hide();
      $('#demographics-info').show();
    }
  }

  function populateAddress(address) {
    $("[name='donation[billing_address_attributes][address1]']").val(address.line1);
    $("#address-line1").text(address.line1);
    $("[name='donation[billing_address_attributes][address2]']").val(address.line2);
    if (address.line2) {
      $("label[for='donation_billing_address_address2']").addClass('floating-donation-label');
      $("#address-line2").text(address.line2);
    } else {
      $("#address-line2").hide();
    }
    $("[name='donation[billing_address_attributes][city]']").val(address.city);
    $("#address-city").text(address.city);
    $("[name='donation[billing_address_attributes][state]']").val(address.state);
    if (address.state) {
      $("label[for='donation_billing_address_state']").addClass('floating-donation-label');
      $("#address-state").text(address.state);
    } else {
      $("#address-state").hide();
    }
    $("[name='donation[billing_address_attributes][zip]']").val(address.postal_code);
    $("#address-zip").text(address.postal_code);
    $("[name='donation[billing_address_attributes][country_code]']").val(address.country);
    if (address.country) {
      $("#address-country").text(address.country);
    } else {
      $("#address-country").hide();
    }

    var $addressReadOnlyElem = $('#address-read-only');
    if($addressReadOnlyElem && address.line1 && address.city && address.postal_code) {
      $('#address-info').hide();
      floatAddressInputLabels();
      $addressReadOnlyElem.show();
    } else {
      $addressReadOnlyElem.hide();
      $('#address-info').show();
    }
  }

  // Float all demographic inputs to handle autopopulating fields
  function floatDemographicInputLabels() {
    $("label[for='donation_email']").addClass('floating-donation-label');
    $("label[for='donation_first_name']").addClass('floating-donation-label');
    $("label[for='donation_last_name']").addClass('floating-donation-label');
    $("label[for='donation_billing_address_phone_number']").addClass('floating-donation-label');
  }

  // Float address inputs to handle autopopulating fields. Address two and state are handled separately
  function floatAddressInputLabels() {
    $("label[for='donation_billing_address_address1']").addClass('floating-donation-label');
    $("label[for='donation_billing_address_city']").addClass('floating-donation-label');
    $("label[for='donation_billing_address_zip']").addClass('floating-donation-label');
  }

  function showSelectedPaymentMethod(wallet) {
    $('#selected-payment-method').show();
    $('#payment-methods').hide();
    if(wallet){
      $('#payment-method-icon').attr('data-type', wallet.type);
    }
  }

  function addPaymentMethodInput(paymentMethodId) {
    var paymentMethodInput = $('<input>').attr('type', 'hidden').attr('name', 'paymentMethod').val(paymentMethodId);
    $form.append(paymentMethodInput);
  }

  function handleExpressPaymentMethod(event) {
    event.complete('success');
    var paymentMethod = event.paymentMethod;
    addPaymentMethodInput(paymentMethod.id);
    populateDemographics(event);
    populateAddress(paymentMethod.billing_details.address);
    $('#your-info').show();
    showSelectedPaymentMethod(paymentMethod.card.wallet);
  }

  function showCreditCardInput() {
    if(!hasExpressPaymentOptions) {
      $('#cc-info a.change-payment-method').hide();
    }
    $('#your-info').show();
    $('#cc-info').show();
    $('#payment-methods').hide();
  }

  function handleEditDemographics(event) {
    event.preventDefault();
    $('#demographics-read-only').hide();
    $('#demographics-info').show();
  }

  function handleEditAddress(event) {
    event.preventDefault();
    $('#address-read-only').hide();
    $('#address-info').show();
  }

  function handleChangePaymentMethod(event) {
    event.preventDefault();
    $('.form-errors').hide();
    $('#address-read-only').hide();
    $('#address-info').show();
    $('#demographics-read-only').hide();
    $('#demographics-info').show();
    $('#selected-payment-method').hide();
    $('#your-info').hide();
    $('#cc-info').hide();
    $('input[name="paymentMethod"]').remove();
    $('#payment-methods').show();
  }

  function handleChangeSubmittedPaymentMethod(event) {
    event.preventDefault();
    $('#submitted-payment-method').hide()

    if(hasExpressPaymentOptions) {
      handleChangePaymentMethod(event);
    } else if(isPortalForm) {
      $('input[name="paymentMethod"]').remove();
      $('#cancel-link').show();
      $('#stripe_cc_field').show();
      $('#cc-info').show();
    } else {
      $('input[name="paymentMethod"]').remove();
      showCreditCardInput();
    }
  }

  if(hasExpressPaymentOptions) {
    var paymentRequest = setupPaymentRequestButton();
    paymentRequest.on('paymentmethod', handleExpressPaymentMethod);
    $(ccRequestElem).on('click', showCreditCardInput);
    $("a#edit-demographics").on('click', handleEditDemographics);
    $("a#edit-address").on('click', handleEditAddress);
    $("a.change-payment-method").on('click', handleChangePaymentMethod);
  } else {
    showCreditCardInput();
  }

  if(submittedPaymentMethod) {
    if($('#submitted-payment-method')[0]) {
      $('#cc-info').hide();
      $('#payment-methods').hide();
      $('#submitted-payment-method').show();
      $('#your-info').show();
      addPaymentMethodInput(submittedPaymentMethod);
      $('a.change-submitted-payment-method').on('click', handleChangeSubmittedPaymentMethod);
    }
  }

  function addressFields() {
    var address1 = $("[name='donation[billing_address_attributes][address1]']").val();
    if(address1) {
      return {
        billing_details: {
          address: {
            line1: address1,
            line2: $("[name='donation[billing_address_attributes][address2]']").val(),
            city: $("[name='donation[billing_address_attributes][city]']").val(),
            state: $("[name='donation[billing_address_attributes][state]']").val(),
            postal_code: $("[name='donation[billing_address_attributes][zip]']").val(),
            country: $("[name='donation[billing_address_attributes][country_code]']").val()
          }
        }
      }
    } else {
      return {};
    }
  }

  function createSource() {
    if (NB.payments.setupSecret) {
      return createSetupIntent();
    }
    else {
      return createPaymentMethod();
    }
  }

  function createSetupIntent() {
    return stripe.handleCardSetup(
      NB.payments.setupSecret,
      NB.payments.elements[Object.keys(NB.payments.elements)[0]],
      { payment_method_data: addressFields() }
    );
  }

  function createPaymentMethod() {
    return stripe.createPaymentMethod(
      'card',
      NB.payments.elements[Object.keys(NB.payments.elements)[0]],
      addressFields()
    );
  }

  function handleError(message) {
    if(NB.Liquid) {
      if (NB.Liquid.Theme.version === 1) {
        $form.find('input[type=submit]').removeAttr('disabled');
        showV1ThemeError($form, message);
      } else {
        NB.EventHub.dispatch('stripe.token.failure', $form, {message: message, className: 'payment-token-error'});
      }
    } else {
      // Trigger change to display correct copy on submit button for CP donations only
      addErrorMessage(message);
      $('[id$=payment_type_id]').trigger('change');
      $form.find('input[type=submit]').removeAttr('disabled');
    }
  }

  // The supporter portal appends the message to the card element
  // All other forms have Stripe errors prepend to the top of the form.
  function addErrorMessage(message) {
    if (isPortalForm) {
      addPortalPaymentError(message);
      scrollToPortalPaymentError();
    } else {
      $form.prepend('<div class="errorExplanation mt-3">' + message + '</div>');
    }
  }

  function addPortalPaymentError(message) {
    $('#cc-info').append(`<span class="payment-method-error d-inline-block" id="cc-info-error">${message}</span>`);
    $('#cc-label').addClass('input-label-errored');
    $('#cc-info').addClass('errored');
    $('#save-payment-method').addClass('disabled');
    $('#save-payment-method')[0].value = $('#save-payment-method').attr("aria-label");
  }

  function scrollToPortalPaymentError() {
    let paymentErrorPresent = $('#cc-info-error').length;
    let scrollToValue = (paymentErrorPresent ? $('#cc-info-error').offset().top : 0);
    if (paymentErrorPresent) {
      // Removing ~150 from scroll height allows both the error element and input label to be visible
      $('#payment-method-offcanvas-body').scrollTop(scrollToValue - 150);
    }
  }

  function performSubmit() {
    $form.off('submit', submitHandler);
    $form.prop('submittable?', true);
    $form.submit();
  }

  // Credit card payments have the payment method created during form submission.
  // EPO payments, and forms with non-payment errors, will already have a payment method input created before submission.
  // Credit card payments from staged pages may have the payment method inputs hidden without a payment method created yet.
  function submitHandler(event) {
    event.preventDefault();
    const paymentMethodHidden = $paymentInputs.is(":hidden") && !$('.progress-stages').length;
    if($('input[name="paymentMethod"]').length || paymentMethodHidden) {
      performSubmit();
    } else {
      createSource().then(function(result) {
        if (result.error) {
          handleError(result.error.message);
        } else {
          if (result.setupIntent) {
            addPaymentMethodInput(result.setupIntent.payment_method);
          } else if (result.paymentMethod) {
            addPaymentMethodInput(result.paymentMethod.id);
          }
          performSubmit();
        }
      });
    }
  }

  function showV1ThemeError(errorMessage) {
    if ($form.hasClass('ajaxForm')) {
      $form.find('.form_submit').html('<div class="form_submitting"><div id="errorExplanation">' + errorMessage + '</div></div>');
    } else {
      $form.find('.form-errors').html('<div class="errorExplanation" id="errorExplanation"><ul><li>' + errorMessage + '</li></ul></div>')
    }
  }

  $form.prop('submittable?', false);
  $form.on('submit', submitHandler);

  var scaSecret = NB.payments.scaSecret;
  if (scaSecret) {
    stripe.handleCardAction(scaSecret).then(function(result) {
      if (result.error) {
        handleError(result.error.message);
      } else {
        $('input[name="paymentMethod"]').remove();
        var paymentIntentInput = $('<input>').attr('type', 'hidden').attr('name', 'paymentIntent').val(result.paymentIntent.id);
        $form.append(paymentIntentInput);
        performSubmit();
      }
    });
  }
};

function initRecaptcha() {
  var $recaptcha = $('#recaptcha-input');
  var $paymentInputs = $('.payment-input');
  var $form = $paymentInputs.closest("form");

  if ($("#recaptcha_checkbox").length) {
    $('#recaptcha_checkbox').replaceWith($recaptcha);
  } else {
    $recaptcha.detach().appendTo($form);
  }
};
