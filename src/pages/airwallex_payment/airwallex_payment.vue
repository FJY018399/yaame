<!--
  hpp.vue
  Airwallex Payment Demo - Vue.  Created by Jessica Zhou and Josie Ku.

  airwallex-payment-elements Hosted Page Payment integration in Vue.
  Comments with "Example" demonstrate how states can be integrated
  with the element, they can be removed.

  Detailed guidance here: https://github.com/airwallex/airwallex-payment-demo/blob/master/docs/hpp.md
-->
<template>
	<div>
		<h2>Hosted payment page (HPP) integration</h2>
		<!-- STEP #2: Add a checkout button -->
		<button @click="redirectHpp()">Redirect to HPP</button>
	</div>
</template>

<script>
// STEP #1: Import airwallex-payment-elements package
import { redirectToCheckout, loadAirwallex } from "airwallex-payment-elements";
import { rechargeOrderPayment } from "../../lib/request/recharge";
import {
        getQueryString,
    } from '../../lib/utils';
// Enter your Payment Intent secret keys here
// More on getting these secrets: https://www.airwallex.com/docs/api#/Payment_Acceptance/Payment_Intents/Intro
let intent_id = "replace-with-your-intent-id";
let client_secret = "replace-with-your-client-secret";
let currency = "replace-with-your-currency";
const mode = "payment"; // Should be one of ['payment', 'recurring']


const getOrderPayment = async () => {
    let res = await rechargeOrderPayment({
        orderId: getQueryString('orderNo')
    });

    intent_id = res.data.intent_id;
    client_secret = res.data.client_secret;
    currency = res.data.currency;
}

getOrderPayment();

const redirectHppForCheckout = () => {
	redirectToCheckout({
		env: "demo",
		mode: "payment",
		currency,
		intent_id, // Required, must provide intent details
		client_secret, // Required
		theme: {
			// Must provide theme to display the checkout page properly
			fonts: [
				// Customizes the font for the payment elements
				{
					src: "https://checkout.airwallex.com/fonts/CircularXXWeb/CircularXXWeb-Regular.woff2",
					family: "AxLLCircular",
					weight: 400,
				},
			],
		},
		successUrl: "https://www.google.com", // Must be HTTPS sites
		failUrl: "https://www.google.com", // Must be HTTPS sites
		// For more detailed documentation at https://github.com/airwallex/airwallex-payment-demo/tree/master/docs#redirectToCheckout
	});
};

const redirectHppForRecurring = () => {
	redirectToCheckout({
		env: "demo",
		mode: "recurring",
		currency,
		client_secret, // Required
		recurringOptions: {
			card: {
				next_triggered_by: "customer",
				merchant_trigger_reason: "scheduled",
				currency,
			},
		},
		theme: {
			// Must provide theme to display the checkout page properly
			fonts: [
				// Customizes the font for the payment elements
				{
					src: "https://checkout.airwallex.com/fonts/CircularXXWeb/CircularXXWeb-Regular.woff2",
					family: "AxLLCircular",
					weight: 400,
				},
			],
		},
		successUrl: "https://www.google.com", // Must be HTTPS sites
		failUrl: "https://www.google.com", // Must be HTTPS sites
		// For more detailed documentation at https://github.com/airwallex/airwallex-payment-demo/tree/master/docs#redirectToCheckout
	});
};

// STEP #2: Initialize Airwallex on click with appropriate production environment and other configurations
loadAirwallex({
	env: "demo", // Can choose other production environments, 'staging | 'demo' | 'prod'
});

// STEP #3: Add a button handler to trigger the redirect to HPP
const redirectHpp = async () => {
	try {
		// STEP #3a: Initialize Airwallex on click with appropriate production environment and other configurations
		await loadAirwallex({
			env: "demo", // Can choose other production environments, 'staging | 'demo' | 'prod'
		});
		// STEP #3b: Redirect the customer to Airwallex checkout
		if (mode === "payment") {
			redirectHppForCheckout();
		} else if (mode === "recurring") {
			redirectHppForRecurring();
		}
	} catch (error) {
		// STEP #4: Catch error events
		/**
		 * ... Handle event on error
		 */
		window.alert("There was an error with HPP redirection", error);
	}
};

export default {
	name: "Hpp",
	data() {
		return {
			redirectHpp,
		};
	},
};
</script>
